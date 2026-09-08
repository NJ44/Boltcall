# Boltcall release workflow

Atlas proposes an exact PR, prepares a tested build, and dispatches a deployment request. GitHub owns integration and deployment authority. Production verification requires NJ44's separate browser acceptance and a fresh Netlify/public-marker check.

## One-time owner configuration

1. Configure `production` and `production-verification` environments. Each must have exactly one required reviewer: GitHub user NJ44, numeric ID `77395319`; administrator bypass must be disabled. Use custom deployment branch policies with exactly `main` of type `branch`. The scripts inspect both the reviewer and branch policies and fail closed on drift.
2. Protect `main` from the Atlas runtime identity. The runtime may dispatch/reconcile workflows and create PRs, but must not be able to merge, push directly to main, change workflow code, or approve pending deployments. Use a separate bot/App identity; do not give the worker NJ44's broad OAuth token. Pending-deployment review uses Deployments write, so removing only Actions write is insufficient.
3. Stop Netlify Git builds for site `8ec31e2a-c9cf-42e7-9b3d-7b7c04ed2613`. Netlify's separate Git integration can bypass a manual-only GitHub workflow. Both deployment and final verification require `build_settings.stop_builds === true`; CLI deployments remain the explicit release path. Check other deploy hooks/tokens separately.
4. Keep `NETLIFY_AUTH_TOKEN` in GitHub secrets, available only to the trusted release workflow. The AIOS worker never receives it. The site ID and production URL are fixed in reviewed source. The prep job uses checked-in public Supabase configuration defaults, without production credentials.
5. Land these workflows and scripts into main before enabling the Atlas Boltcall adapter. The first pipeline installation must be reviewed/landed by the owner because the old main has no PR CI or integration workflow. All subsequent PRs must pass `pr-tests.yml` for their exact current head before integration.

## Workflow contracts

| Workflow | Manual inputs | Run title |
| --- | --- | --- |
| `integrate-boltcall-pr.yml` | `pr_number`, `source_sha`, `request_id` | `Integrate PR <number> head <sha> request <id>` |
| `prepare-boltcall-release.yml` | `source_sha` | `Prepare <sha>` |
| `netlify-production-deploy.yml` | `release_id`, `manifest_hash`, `request_id` | `Release <release> request <id> manifest <hash>` |

PR CI runs on `pull_request` only, with contents read, no secrets and no persisted checkout credential. It runs `npm ci`, typecheck, the full Vitest suite, and `build:fast`. Integration reads the current PR and latest associated PR CI, waits at the owner environment, reads them again, and merges using GitHub's exact SHA precondition. A changed head, newer failed/pending CI, unknown gate, or conflict is refused.

Preparation accepts a full 40-character source SHA already in main. Its unprivileged `validate` job runs typecheck, the full suite, the full production/prerender/SEO build, and `netlify functions:build` using Netlify CLI 26.2.0. It archives `dist/`, `.netlify-fn-build/`, and `netlify.toml` as `payload.tar.gz`. A separate publisher runs code from trusted workflow main and creates a write-once draft GitHub release with `release-manifest.json`; it never executes the prepared artifact. Preparation never deploys production.

Deployment jobs are `inspect`, `owner-review`, `deploy`, `owner-verification`, and `final-verification`. The initial inspection verifies the reviewed manifest bytes, source ancestry, successful exact preparation attempt/jobs and retained artifact metadata. Deployment repeats these checks after owner approval, verifies the downloaded artifact and payload hashes, adds the release marker, and deploys the retained site/functions with `--no-build`. No push trigger exists and the concurrency group does not cancel an in-flight release.

## Manifest and artifacts

The release ID and draft tag are `boltcall-<source first 12>-<preparation run ID>-<preparation attempt>`. Manifest SHA256 is over the exact UTF-8 asset bytes, including its final newline.

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

The Netlify CLI response produces `deployment-receipt.json`: all marker fields plus `deploy_id` and `production_url`. It is retained even if the post-deploy smoke test fails, as `boltcall-deployment-<run>-<deployment attempt>`. An uncertain or failed deployment must be inspected before an explicit retry; status reads must never dispatch again automatically.

Final verification requires successful owner-review, deploy and owner-verification jobs in chronological order. It supports a final-job retry using the successful deploy receipt from an earlier attempt. It checks the marker, Netlify site/published deploy ID, production deploy state, and unauthenticated function response (401/403/405). Then it writes `verification-receipt.json`, adding numeric `verification_attempt`, `verified_at`, and `owner_accepted:true`. The immutable `boltcall-verification-<run>-<verification attempt>` artifact contains exactly this one root file. AIOS checks its ZIP digest and run origin, both approval jobs, the final job, and the live public marker without holding Netlify credentials.

## Browser acceptance and recovery

At `production-verification`, NJ44 must open the live product in regular Chrome, test the changed workflow, and check the release marker before approving. A successful Actions run alone is not product acceptance. Authenticated API flows, write behavior and changed UI require their own browser exercise; the included automated smoke only checks release identity and function routing. Do not run `smoke:production` casually: its help smoke creates/deletes production users and inserts fixtures.

If final verification fails, inspect retained receipts and current production before retrying. A final-verification-only retry reuses the existing deployment. A deployment-stage retry checks every prior matching request run and earlier attempt: any retained deployment receipt or previously started deploy job refuses another Netlify write, including when the earlier workflow failed. This deliberately treats missing receipts as uncertain side effects. After inspecting production, recovery that needs another deployment prepares a fresh release ID and creates its new explicit request with fresh owner approval; AIOS keeps one durable request per release ID. A newer published deployment or changed marker must not be accepted for the old request. Rollback is a new explicit prepared-release deployment with owner approval; no implicit rollback, force push, or automatic redeploy occurs.

Read-only baseline inspection on 2026-09-09 found Netlify Git integration connected to `Boltcall/Boltcall` main with `stop_builds:false`; its published deploy was `6a9adc04534c5ab4741251ce`. The workflow intentionally refuses deployment while that bypass remains enabled. This implementation does not change cloud settings or deploy by itself.
