# Boltcall release workflow

Atlas proposes an exact PR, prepares a tested build, and dispatches a deployment request. GitHub owns integration and deployment authority. Production verification requires NJ44's separate browser acceptance and a fresh Netlify/public-marker check.

## One-time owner configuration

1. Configure `production` and `production-verification` environments. Each must have exactly one required reviewer: GitHub user NJ44, numeric ID `77395319`; administrator bypass must be disabled. Use custom deployment branch policies with exactly `main` of type `branch`. The scripts inspect both the reviewer and branch policies and fail closed on drift.
2. Protect `main` with required PRs, the `test` check, and required status `atlas-owner-integration`, binding both check contexts to the GitHub Actions App (integration ID `15368`). The owner-approved integration job publishes that status for the exact reviewed head; it does not need a repository-wide GitHub Actions bypass. A separately configured repository-admin bypass may preserve explicit operator session closure, but the runtime identity must never qualify for it. Use a non-owner bot/App identity with no status/check writing, workflow writing, administration, or pending-deployment approval permission. Workflow defaults are not a permission ceiling: untrusted PR code must never run with status-writing credentials. Pending-deployment review uses Deployments write, so removing only Actions write is insufficient. Do not give the worker NJ44's broad OAuth token.
3. Stop Netlify Git builds for site `8ec31e2a-c9cf-42e7-9b3d-7b7c04ed2613`. Netlify's separate Git integration can bypass a manual-only GitHub workflow. Both deployment and final verification require `build_settings.stop_builds === true`; CLI deployments remain the explicit release path. Check other deploy hooks/tokens separately.
4. Keep `NETLIFY_AUTH_TOKEN` in GitHub secrets, available only to the trusted release workflow. The AIOS worker never receives it. The site ID and production URL are fixed in reviewed source. The prep job uses checked-in public Supabase configuration defaults, without production credentials.
5. Land these workflows and scripts into main before enabling the Atlas Boltcall adapter. The first pipeline installation must be reviewed/landed by the owner because the old main has no PR CI or integration workflow. All subsequent PRs must pass `pr-tests.yml` for their exact current head before integration.

## Workflow contracts

| Workflow | Manual inputs | Run title |
| --- | --- | --- |
| `integrate-boltcall-pr.yml` | `pr_number`, `source_sha`, `request_id` | `Integrate PR <number> head <sha> request <id>` |
| `prepare-boltcall-release.yml` | `source_sha` | `Prepare <sha>` |
| `netlify-production-deploy.yml` | `release_id`, `manifest_hash`, `request_id` | `Release <release> request <id> manifest <hash>` |

PR CI runs on `pull_request` only, with contents read, no secrets and no persisted checkout credential. It runs `npm ci`, typecheck, the full Vitest suite, and `build:fast`. Integration reads the current PR and latest associated PR CI, waits at the owner environment, reads them again, makes a draft ready when needed, publishes `atlas-owner-integration: success` on that exact head, and merges using GitHub's SHA precondition. The status links to the validated integration run ID. Only the protected `merge` job receives `statuses: write`; inspection, failed gates/CI, and already-merged recovery never publish the status. A changed head, newer failed/pending CI, unknown gate, or conflict is refused. A failed or uncertain status response stops the merge.

Preparation accepts a full 40-character source SHA already in main. Its unprivileged `validate` job runs typecheck, the full suite, the full production/prerender/SEO build, and static function bundling with the pinned Netlify CLI 26.2.0 toolchain. `release-functions.mjs` resolves checked-in production configuration offline and captures schedules, timeouts, runtime versions and streaming metadata in the retained function manifest. In-source configuration keeps Netlify's normal precedence over TOML. It archives `dist/`, `.netlify-fn-build/`, and `netlify.toml` as `payload.tar.gz`. A separate publisher runs code from trusted workflow main, creates a write-once draft GitHub release, uploads `release-manifest.json`, and downloads it again to verify the exact bytes. Only then does it publish the evidence as a prerelease with `make_latest:false`; it never executes the prepared artifact. GitHub hides draft releases from read-only callers, so completed evidence must be published for Atlas and deployment inspection to read it without write permission. Preparation never deploys production.

Deployment jobs are `inspect`, `owner-review`, `deploy`, `owner-verification`, and `final-verification`. The initial inspection verifies the reviewed manifest bytes, source ancestry, successful exact preparation attempt/jobs and retained artifact metadata. Deployment repeats these checks after owner approval, verifies the downloaded artifact and payload hashes, adds the release marker, and uploads the retained site/functions as an unpublished draft with `--no-build`. After checking that draft, it publishes the same deploy ID. No push trigger exists and the concurrency group does not cancel an in-flight release.

After verifying the payload digest, deployment validates the retained function manifest and every archive path. Immediately before invoking Netlify it creates `.netlify/functions/manifest.json`, changing only the relocated ZIP paths and the temporary cache timestamp; original manifest bytes and ZIPs stay unchanged. This is required because CLI 26 only recognizes that cache location and expires caches after two minutes. A guard atomically refreshes only the derived timestamp every 30 seconds while the command runs, refuses substituted metadata, aborts the command on refresh failure, and stops its timer on success or failure. Uploading the ZIP directory without its metadata loses v2 streaming mode and causes Netlify 502 responses.

CLI 26.2.0 also detects a JavaScript workspace root independently of the subprocess working directory. Deployment therefore runs from the trusted checkout with `--cwd=<absolute prepared payload directory>`; those directories must differ or the CLI discards the explicit override. `CONTEXT=production` selects production settings without rebuilding (`--context` is incompatible with `--no-build`). This makes the CLI discover the prepared cache instead of silently falling back to metadata-free ZIP uploads.

The pinned CLI sends `draft:true` when creating the deploy but defaults to `draft:false` when finalizing its files/functions. The bundled official OpenAPI schema defines a `draft` boolean in both `createSiteDeploy` POST and `updateSiteDeploy` PUT; it does not promise that PUT ignores it. `scripts/netlify-draft.mjs` checks version 26.2.0 and the exact SHA256 of `dist/utils/deploy/deploy-site.js`, then uses a Node module loader hook to change that one default inside the child process. It requires an explicit draft/no-build command and rejects production flags and unexpected options before loading CLI code. It never edits the installed CLI. A toolchain upgrade must deliberately revalidate or remove this compatibility fix; a changed version or source hash fails closed.

The integration check runs the actual CLI subprocess against a loopback API with real function ZIPs and blocks nonlocal HTTP/fetch destinations. It verifies draft creation and finalization both send `draft:true`, and checks uploaded runtime, streaming mode, build metadata, schedules, timeouts and ZIP digests. It also checks that the vendor module and prepared ZIPs are unchanged. The synthetic functions throw if executed, so preparation and upload cannot accidentally invoke them.

Before publishing, deployment saves a draft receipt and checks the immutable `https://<deploy-id>--boltcall.netlify.app` URL, unpublished status, production context, exact function inventory, ZIP digests, runtime, invocation mode, build metadata and schedules from Netlify. It verifies the exact release marker and requires HTTP 401 from unauthenticated GETs to `saas-v2-leads`, `saas-v2-calls`, and `retell-agents`. It then rechecks that Git builds are stopped and the production deploy still matches the ID recorded before upload. Any mismatch stops before promotion and retains the draft receipt. Function timeouts are verified at the real CLI upload boundary; Netlify's inspected deploy response does not expose them, so the live draft check cannot independently attest to timeout settings.

Promotion sends one official `POST /sites/<fixed-site-id>/deploys/<verified-deploy-id>/restore`, after persisting `stage:"promotion_requested"`. It never uploads a second payload. Netlify provides no compare-and-swap condition on this endpoint; the immediately preceding production-pointer check narrows but cannot eliminate a race with another authorized deployer. Keep the Git build bypass stopped and avoid out-of-band publication during this workflow. A lost promotion response retains an uncertain receipt and must be reconciled, not automatically retried.

## Manifest and artifacts

The release ID and tag are `boltcall-<source first 12>-<preparation run ID>-<preparation attempt>`. Manifest SHA256 is over the exact UTF-8 asset bytes, including its final newline. An incomplete or mismatched upload stays in draft. Existing identities are never overwritten or resumed; prepare a fresh release after publication failure, including releases created by the old draft-only publisher.

```json
{
  "schema_version": 1,
  "project_id": "boltcall",
  "repository": "Boltcall/Boltcall",
  "release_id": "boltcall-<source12>-<run>-<attempt>",
  "source_sha": "<40 hex>",
  "created_at": "<ISO timestamp>",
  "preparation": {
    "run_id": 123,
    "run_attempt": 1,
    "workflow_sha": "<40 hex workflow-main commit>",
    "path": ".github/workflows/prepare-boltcall-release.yml"
  },
  "artifact": {
    "id": 456,
    "name": "boltcall-payload-123-1",
    "digest": "sha256:<64 hex GitHub artifact ZIP hash>",
    "payload_sha256": "<64 hex payload.tar.gz hash>"
  },
  "target": {
    "provider": "netlify",
    "site_id": "8ec31e2a-c9cf-42e7-9b3d-7b7c04ed2613",
    "production_url": "https://boltcall.org"
  },
  "checks": { "typecheck": true, "tests": true, "build": true, "functions": true }
}
```

The booleans alone prove nothing: execution inspects GitHub run/attempt identity, exact source in the run title, the trusted workflow commit, both successful preparation jobs, artifact run origin, digest, and expiry. Payload artifacts expire after 90 days. Reprepare expired evidence; do not rebuild under an old reviewed manifest. A preparation retry that needs a fresh artifact must rerun all jobs; failed-job-only preparation retries will fail closed if their attempt lacks validation/artifact evidence.

Public `https://boltcall.org/release.json` contains `schema_version:1`, `project_id:"boltcall"`, `sha`, `release_id`, `manifest_hash`, `request_id`, numeric `run_id`, numeric deployment `run_attempt`, and fixed `site_id`. The marker is injected after verifying the payload, avoiding circular hashes. It is served with no-store headers.

The Netlify CLI response produces `deployment-receipt.json`: all marker fields plus `deploy_id`, `production_url`, `previous_deploy_id`, and `stage` (`draft`, `promotion_requested`, or `published`). Promotion records `draft_verified_at`. The receipt is retained even if draft checks, promotion or post-deploy smoke checks fail, as `boltcall-deployment-<run>-<deployment attempt>`. Existing receipts cannot be passed back into promotion. An uncertain or failed deployment must be inspected before recovery; status reads must never dispatch again automatically.

Final verification requires successful owner-review, deploy and owner-verification jobs in chronological order. It supports a final-job retry using the successful deploy receipt from an earlier attempt. It checks the marker, Netlify site/published deploy ID, production deploy state, and HTTP 401 responses from all three unauthenticated function GETs. Then it writes `verification-receipt.json`, adding numeric `verification_attempt`, `verified_at`, and `owner_accepted:true`. The immutable `boltcall-verification-<run>-<verification attempt>` artifact contains exactly this one root file. AIOS checks its ZIP digest and run origin, both approval jobs, the final job, and the live public marker without holding Netlify credentials.

## Browser acceptance and recovery

At `production-verification`, NJ44 must open the live product in regular Chrome, test the changed workflow, and check the release marker before approving. A successful Actions run alone is not product acceptance. Authenticated API flows, write behavior and changed UI require their own browser exercise; the included automated smoke only checks release identity and function routing. Do not run `smoke:production` casually: its help smoke creates/deletes production users and inserts fixtures.

If final verification fails, inspect retained receipts and current production before retrying. A final-verification-only retry reuses the existing deployment. A deployment-stage retry checks every prior matching request run and earlier attempt: any retained deployment receipt or previously started deploy job refuses another Netlify write, including when the earlier workflow failed. This deliberately treats missing receipts as uncertain side effects. After inspecting production, recovery that needs another deployment prepares a fresh release ID and creates its new explicit request with fresh owner approval; AIOS keeps one durable request per release ID. A newer published deployment or changed marker must not be accepted for the old request. Rollback is a new explicit prepared-release deployment with owner approval; no implicit rollback, force push, or automatic redeploy occurs.

Read-only baseline inspection on 2026-09-09 found Netlify Git integration connected to `Boltcall/Boltcall` main with `stop_builds:false`; its published deploy was `6a9adc04534c5ab4741251ce`. The workflow intentionally refuses deployment while that bypass remains enabled. This implementation does not change cloud settings or deploy by itself.
