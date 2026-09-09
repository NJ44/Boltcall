import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { materializeFunctionCache, withFreshFunctionCache } from './release-functions.mjs';
import { REPOSITORY, SITE_ID, PRODUCTION_URL, SHA, HASH, sha256, assertOwnerGate,
  readApprovedManifest, verifyPreparation, inspectPullRequest, listAll, releaseMarker,
  assertNetlifySite, verifyLiveDeployment, selectApprovalReceipts } from './release-control.mjs';

export async function command(bin, args, options = {}) {
  try {
    const { stdout } = await promisify(execFile)(bin, args, { encoding: 'utf8', timeout: 1800000,
      maxBuffer: 16000000, windowsHide: true, ...options });
    return Buffer.isBuffer(stdout) ? stdout : stdout.trim();
  } catch { throw Error(`${bin} failed; inspect workflow receipts and production before retrying`); }
}

export function githubApi(token = process.env.GH_TOKEN) {
  return async (endpoint, { method = 'GET', body, raw = false, upload = false, accept = 'application/vnd.github+json' } = {}) => {
    const url = upload ? endpoint : `https://api.github.com/${endpoint === 'graphql' ? endpoint : `repos/${REPOSITORY}/${endpoint}`}`;
    const response = await fetch(url, { method, headers: { Authorization: `Bearer ${token}`,
      Accept: accept, 'X-GitHub-Api-Version': '2022-11-28',
      ...(body ? { 'Content-Type': 'application/json' } : {}) },
      ...(body ? { body: upload ? body : JSON.stringify(body) } : {}), signal: AbortSignal.timeout(180000) });
    if (!response.ok) throw Error(`GitHub release request failed (HTTP ${response.status})`);
    if (Number(response.headers.get('content-length')) > 350000000) throw Error('Release evidence exceeds download limit');
    if (raw) return Buffer.from(await response.arrayBuffer());
    if (response.status === 204) return null;
    const result = await response.json();
    if (result.errors?.length) throw Error('GitHub rejected the release operation');
    return result;
  };
}

function assertMain(env) {
  if (env.GITHUB_REPOSITORY !== REPOSITORY || env.GITHUB_REF !== 'refs/heads/main' ||
      env.GITHUB_EVENT_NAME !== 'workflow_dispatch' || !SHA.test(env.GITHUB_SHA || '')) throw Error('Release workflows must execute from canonical main');
}
async function summary(env, text) { if (env.GITHUB_STEP_SUMMARY) await fs.appendFile(env.GITHUB_STEP_SUMMARY, text); }
async function output(env, values) {
  if (env.GITHUB_OUTPUT) await fs.appendFile(env.GITHUB_OUTPUT, Object.entries(values).map(([key, value]) => `${key}=${value}\n`).join(''));
}
async function gate(api, name) {
  const environment = await api(`environments/${name}`);
  const policies = await listAll(api, `environments/${name}/deployment-branch-policies`, 'branch_policies');
  assertOwnerGate(environment, policies, name);
}
async function gates(api) { await gate(api, 'production'); await gate(api, 'production-verification'); }

export async function runIntegration({ env = process.env, api = githubApi() } = {}) {
  assertMain(env);
  const phase = env.INTEGRATION_PHASE;
  const runId = env.GITHUB_RUN_ID;
  if (!['inspect', 'merge'].includes(phase) || env.GITHUB_JOB !== phase || !/^[a-f0-9-]{36}$/.test(env.REQUEST_ID || '') ||
      !/^[1-9]\d*$/.test(runId || '')) throw Error('Invalid integration workflow phase, request or run identity');
  await gate(api, 'production');
  const number = Number(env.PR_NUMBER);
  const result = await inspectPullRequest(api, number, env.SOURCE_SHA);
  await summary(env, `## Review exact Boltcall integration\n\nPR: https://github.com/${REPOSITORY}/pull/${number}\n\nHead: ${env.SOURCE_SHA}\n\nRequest: ${env.REQUEST_ID}\n\nLatest CI: ${result.run?.html_url || 'Already merged'}\n\nApproval permits merging this exact head. Production deployment requires separate manifest approval.\n`);
  if (phase === 'merge' && !result.merged) {
    if (result.pr.draft) await api('graphql', { method: 'POST', body: { query: 'mutation($id:ID!){markPullRequestReadyForReview(input:{pullRequestId:$id}){pullRequest{id}}}', variables: { id: result.pr.node_id } } });
    // The protected-main rule binds this context to the GitHub Actions App.
    // Only this owner-approved job may attest to the freshly rechecked head.
    await api(`statuses/${env.SOURCE_SHA}`, { method: 'POST', body: { state: 'success', context: 'atlas-owner-integration',
      description: 'Owner approved exact PR head after latest CI passed', target_url: `https://github.com/${REPOSITORY}/actions/runs/${runId}` } });
    const merged = await api(`pulls/${number}/merge`, { method: 'PUT', body: { sha: env.SOURCE_SHA, merge_method: 'merge' } });
    if (!merged.merged || !SHA.test(merged.sha || '')) throw Error('GitHub did not merge the selected PR');
    await summary(env, `\nMerged source: ${merged.sha}\n`);
    return merged;
  }
  return result;
}

export async function publishPrepared({ env = process.env, api = githubApi(), run = command } = {}) {
  assertMain(env);
  const source = env.SOURCE_SHA, runId = Number(env.GITHUB_RUN_ID), attempt = Number(env.GITHUB_RUN_ATTEMPT);
  if (env.GITHUB_JOB !== 'publish' || !SHA.test(source || '')) throw Error('Invalid preparation phase');
  await run('git', ['fetch', 'origin', 'main']);
  await run('git', ['merge-base', '--is-ancestor', source, 'origin/main']);
  const releaseId = `boltcall-${source.slice(0, 12)}-${runId}-${attempt}`;
  const artifact = await api(`actions/artifacts/${Number(env.PAYLOAD_ARTIFACT_ID)}`);
  if (artifact.name !== `boltcall-payload-${runId}-${attempt}` || artifact.expired !== false ||
      artifact.workflow_run?.id !== runId || artifact.workflow_run?.head_sha !== env.GITHUB_SHA ||
      artifact.digest !== env.PAYLOAD_ARTIFACT_DIGEST) throw Error('Preparation artifact identity changed');
  const jobs = await listAll(api, `actions/runs/${runId}/attempts/${attempt}/jobs`, 'jobs');
  if (!jobs.some(job => job.name === 'validate' && job.run_id === runId && job.run_attempt === attempt && job.conclusion === 'success')) throw Error('Required validation has not passed');
  const manifest = { schema_version: 1, project_id: 'boltcall', repository: REPOSITORY, release_id: releaseId,
    source_sha: source, created_at: new Date().toISOString(),
    preparation: { run_id: runId, run_attempt: attempt, workflow_sha: env.GITHUB_SHA, path: '.github/workflows/prepare-boltcall-release.yml' },
    artifact: { id: artifact.id, name: artifact.name, digest: artifact.digest, payload_sha256: env.PAYLOAD_SHA256 },
    target: { provider: 'netlify', site_id: SITE_ID, production_url: PRODUCTION_URL },
    checks: { typecheck: true, tests: true, build: true, functions: true } };
  const bytes = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`), hash = sha256(bytes);
  readApprovedManifest(bytes, releaseId, hash);
  const existing = await listAll(api, 'releases');
  if (existing.some(release => release.tag_name === releaseId)) throw Error('Release identity already exists; prepared evidence is write-once');
  const release = await api('releases', { method: 'POST', body: { tag_name: releaseId, target_commitish: source,
    name: releaseId, draft: true, body: `Prepared source: ${source}\nManifest SHA256: ${hash}\nPreparation: https://github.com/${REPOSITORY}/actions/runs/${runId}\nProduction is not deployed by preparation.` } });
  const asset = await api(`https://uploads.github.com/repos/${REPOSITORY}/releases/${release.id}/assets?name=release-manifest.json`, { method: 'POST', body: bytes, upload: true });
  if (!Number.isSafeInteger(asset?.id) || asset.id < 1 || asset.name !== 'release-manifest.json' ||
      asset.state !== 'uploaded' || asset.size !== bytes.length) throw Error('Prepared manifest upload is incomplete');
  readApprovedManifest(await api(`releases/assets/${asset.id}`, { raw: true, accept: 'application/octet-stream' }), releaseId, hash);
  // Drafts are invisible to contents:read callers. Publish only the verified
  // evidence as a prerelease; the separate owner gates still control deployment.
  const published = await api(`releases/${release.id}`, { method: 'PATCH', body: { draft: false, prerelease: true, make_latest: 'false' } });
  if (published?.id !== release.id || published.tag_name !== releaseId || published.draft !== false || published.prerelease !== true) {
    throw Error('Prepared manifest release is not published');
  }
  await summary(env, `## Prepared Boltcall release\n\nRelease: ${releaseId}\n\nSource: ${source}\n\nManifest SHA256: ${hash}\n\nPayload SHA256: ${manifest.artifact.payload_sha256}\n\nRetained artifact: ${artifact.id}\n\nDeployment requires the exact release ID/hash and owner approval.\n`);
  return manifest;
}

export async function inspectPrepared({ env = process.env, api = githubApi(), run = command } = {}) {
  assertMain(env);
  if (!/^boltcall-[a-f0-9]{12}-\d+-[1-9]\d*$/.test(env.RELEASE_ID || '') || !HASH.test(env.MANIFEST_HASH || '')) throw Error('Invalid release selection');
  const releases = await listAll(api, 'releases');
  const release = releases.find(item => item.tag_name === env.RELEASE_ID);
  const assets = release?.assets?.filter(asset => asset.name === 'release-manifest.json');
  if (assets?.length !== 1 || assets[0].size > 200000) throw Error('Prepared manifest asset is unavailable');
  // Asset API returns JSON by default. The authenticated octet-stream request
  // downloads published evidence using the consumer's read-only token.
  const bytes = await api(`releases/assets/${assets[0].id}`, { raw: true, accept: 'application/octet-stream' });
  const manifest = readApprovedManifest(bytes, env.RELEASE_ID, env.MANIFEST_HASH);
  await run('git', ['fetch', 'origin', 'main']);
  await run('git', ['merge-base', '--is-ancestor', manifest.source_sha, 'origin/main']);
  const p = manifest.preparation;
  const prepRun = await api(`actions/runs/${p.run_id}/attempts/${p.run_attempt}`);
  const jobs = await listAll(api, `actions/runs/${p.run_id}/attempts/${p.run_attempt}/jobs`, 'jobs');
  const artifact = await api(`actions/artifacts/${manifest.artifact.id}`);
  verifyPreparation(manifest, { run: prepRun, jobs, artifact, mainContains: true });
  await gates(api);
  releaseMarker(manifest, env.MANIFEST_HASH, { requestId: env.REQUEST_ID, runId: Number(env.GITHUB_RUN_ID), runAttempt: Number(env.GITHUB_RUN_ATTEMPT) });
  await summary(env, `## Review prepared Boltcall release\n\nRelease: ${manifest.release_id}\n\nSource: ${manifest.source_sha}\n\nManifest SHA256: ${env.MANIFEST_HASH}\n\nPayload SHA256: ${manifest.artifact.payload_sha256}\n\nNetlify site: ${SITE_ID}\n\nProduction: ${PRODUCTION_URL}\n\nRequest: ${env.REQUEST_ID}\n\nBrowser acceptance remains required after deployment.\n`);
  await output(env, { source_sha: manifest.source_sha, release_url: `https://github.com/${REPOSITORY}/releases` });
  return manifest;
}

async function downloadArtifact(api, artifact, directory, expectedFile) {
  // Actions requires the JSON API media type before redirecting to ZIP bytes.
  const bytes = await api(`actions/artifacts/${artifact.id}/zip`, { raw: true });
  if (`sha256:${sha256(bytes)}` !== artifact.digest) throw Error('Downloaded artifact digest changed');
  await fs.mkdir(directory, { recursive: true });
  const archive = path.resolve(directory, 'artifact.zip');
  await fs.writeFile(archive, bytes);
  const entries = (await command('unzip', ['-Z1', archive])).split(/\r?\n/);
  if (entries.length !== 1 || entries[0] !== expectedFile) throw Error('Release artifact contains unexpected files');
  await command('unzip', ['-q', archive, '-d', directory]);
  return path.resolve(directory, expectedFile);
}
async function netlify(endpoint) {
  const response = await fetch(`https://api.netlify.com/api/v1/${endpoint}`, { headers: { Authorization: `Bearer ${process.env.NETLIFY_AUTH_TOKEN}` }, signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw Error(`Netlify inspection failed (HTTP ${response.status})`);
  return response.json();
}
async function liveCheck(manifest, env, receipt) {
  const expected = releaseMarker(manifest, env.MANIFEST_HASH, { requestId: env.REQUEST_ID,
    runId: Number(env.GITHUB_RUN_ID), runAttempt: receipt.run_attempt });
  const response = await fetch(`${PRODUCTION_URL}/release.json?release=${encodeURIComponent(env.RELEASE_ID)}&check=${Date.now()}`, { cache: 'no-store', signal: AbortSignal.timeout(30000) });
  if (!response.ok || !(response.headers.get('content-type') || '').includes('application/json')) throw Error('Public release marker is unavailable');
  const marker = await response.json();
  const site = await netlify(`sites/${SITE_ID}`);
  const deploy = await netlify(`deploys/${receipt.deploy_id}`);
  verifyLiveDeployment({ expected, marker, receipt, site, deploy });
  const functionResponse = await fetch(`${PRODUCTION_URL}/.netlify/functions/saas-v2-leads`, { signal: AbortSignal.timeout(30000) });
  if (![401, 403, 405].includes(functionResponse.status)) throw Error('Production function smoke test failed');
  return expected;
}

async function assertNoPriorDeployment(api, env) {
  const currentId = Number(env.GITHUB_RUN_ID), currentAttempt = Number(env.GITHUB_RUN_ATTEMPT);
  const runs = await listAll(api, 'actions/workflows/netlify-production-deploy.yml/runs?event=workflow_dispatch', 'workflow_runs');
  const title = `Release ${env.RELEASE_ID} request ${env.REQUEST_ID} manifest ${env.MANIFEST_HASH}`;
  const matches = runs.filter(run => run.display_title === title && run.head_branch === 'main' &&
    run.path === '.github/workflows/netlify-production-deploy.yml' && run.event === 'workflow_dispatch' && run.id !== currentId);
  if (matches.some(run => run.conclusion === 'success' || (run.id < currentId && run.status !== 'completed'))) {
    throw Error('A prior deployment request is active or complete; reconcile it instead of deploying again');
  }
  // Always inspect earlier attempts of this run, even if the list endpoint has
  // not yet returned it. A failed workflow can already have changed production.
  matches.push({ id: currentId, run_attempt: currentAttempt - 1 });
  for (const prior of matches) {
    if (!Number.isSafeInteger(prior.run_attempt) || prior.run_attempt < 0 || prior.run_attempt > 20) throw Error('Prior deployment history cannot be reconciled safely');
    if (!prior.run_attempt) continue;
    const artifacts = await listAll(api, `actions/runs/${prior.id}/artifacts`, 'artifacts');
    if (artifacts.some(a => a.name?.startsWith(`boltcall-deployment-${prior.id}-`))) {
      throw Error('A previous deployment receipt exists; inspect production, prepare a fresh release, and obtain owner approval for its recovery request');
    }
    for (let attempt = 1; attempt <= prior.run_attempt; attempt++) {
      const jobs = await listAll(api, `actions/runs/${prior.id}/attempts/${attempt}/jobs`, 'jobs');
      if (jobs.some(job => job.name === 'deploy' && job.conclusion !== 'skipped' &&
          (job.started_at || ['in_progress', 'completed'].includes(job.status)))) {
        throw Error('A prior deployment job already started; its side effects may be uncertain. Inspect production, prepare a fresh release, and obtain owner approval for recovery');
      }
    }
  }
}

export async function deployPrepared({ env = process.env, api = githubApi(), run = command } = {}) {
  if (env.GITHUB_JOB !== 'deploy') throw Error('Deployment must run in the protected workflow deploy phase');
  const manifest = await inspectPrepared({ env, api, run });
  await assertNoPriorDeployment(api, env);
  assertNetlifySite(await netlify(`sites/${SITE_ID}`));
  const artifact = await api(`actions/artifacts/${manifest.artifact.id}`);
  const payload = await downloadArtifact(api, artifact, 'release-download', 'payload.tar.gz');
  if (sha256(await fs.readFile(payload)) !== manifest.artifact.payload_sha256) throw Error('Prepared payload changed');
  await fs.mkdir('release-payload', { recursive: true });
  const entries = (await command('tar', ['-tzf', payload])).split(/\r?\n/);
  if (!entries.every(entry => !entry.split('/').includes('..') && /^(dist\/|\.netlify-fn-build\/|netlify\.toml$)/.test(entry))) throw Error('Prepared payload has unexpected paths');
  await command('tar', ['-xzf', payload, '-C', 'release-payload']);
  const marker = releaseMarker(manifest, env.MANIFEST_HASH, { requestId: env.REQUEST_ID, runId: Number(env.GITHUB_RUN_ID), runAttempt: Number(env.GITHUB_RUN_ATTEMPT) });
  await fs.writeFile('release-payload/dist/release.json', `${JSON.stringify(marker)}\n`);
  await fs.appendFile('release-payload/dist/_headers', '\n/release.json\n  Cache-Control: no-store, max-age=0\n  Content-Type: application/json\n');
  // Payload digest was verified before extraction; only cache paths/time change.
  const cachePath = await materializeFunctionCache(path.resolve('release-payload'));
  const result = JSON.parse(await withFreshFunctionCache(cachePath, signal => run('netlify', ['deploy', '--prod', '--no-build', '--dir=dist', '--functions=.netlify-fn-build', '--timeout=600', '--json',
    '--message', `Release ${manifest.release_id} request ${env.REQUEST_ID} manifest ${env.MANIFEST_HASH}`], { cwd: path.resolve('release-payload'), env: { ...process.env, NETLIFY_SITE_ID: SITE_ID }, signal })));
  if (result.site_id !== SITE_ID || !/^[a-zA-Z0-9_-]+$/.test(result.deploy_id || '')) throw Error('Netlify returned an invalid deployment receipt');
  const receipt = { ...marker, deploy_id: result.deploy_id, production_url: PRODUCTION_URL };
  // Save before smoke checks so failed verification still retains the deploy ID.
  await fs.writeFile('deployment-receipt.json', `${JSON.stringify(receipt, null, 2)}\n`);
  await liveCheck(manifest, env, receipt);
  await summary(env, `\nPublished deploy: ${receipt.deploy_id}\n\nBrowser-test ${PRODUCTION_URL} before accepting production-verification.\n`);
  return receipt;
}

export async function finalVerification({ env = process.env, api = githubApi() } = {}) {
  if (env.GITHUB_JOB !== 'final-verification') throw Error('Invalid final verification phase');
  const manifest = await inspectPrepared({ env, api });
  const runId = Number(env.GITHUB_RUN_ID), attempt = Number(env.GITHUB_RUN_ATTEMPT);
  const receipts = [];
  if (attempt > 20) throw Error('Too many workflow attempts to reconcile safely');
  for (let number = 1; number <= attempt; number++) {
    const jobs = await listAll(api, `actions/runs/${runId}/attempts/${number}/jobs`, 'jobs');
    receipts.push(...jobs.filter(job => job.run_attempt === number));
  }
  const { deploymentAttempt } = selectApprovalReceipts(receipts, runId, attempt);
  const artifacts = await listAll(api, `actions/runs/${runId}/artifacts`, 'artifacts');
  const artifactsForDeploy = artifacts.filter(a => a.name === `boltcall-deployment-${runId}-${deploymentAttempt}` && !a.expired &&
    a.workflow_run?.id === runId && a.workflow_run?.head_sha === env.GITHUB_SHA);
  if (artifactsForDeploy.length !== 1) throw Error('Exact deployment receipt is unavailable');
  const file = await downloadArtifact(api, artifactsForDeploy[0], 'deployment-evidence', 'deployment-receipt.json');
  const receipt = JSON.parse(await fs.readFile(file, 'utf8'));
  if (receipt.run_attempt !== deploymentAttempt) throw Error('Deployment attempt receipt changed');
  await liveCheck(manifest, env, receipt);
  const verified = { ...receipt, verification_attempt: attempt, verified_at: new Date().toISOString(), owner_accepted: true };
  await fs.writeFile('verification-receipt.json', `${JSON.stringify(verified, null, 2)}\n`);
  await summary(env, `\nOwner acceptance and final runtime verification passed for deploy ${receipt.deploy_id}.\n`);
  return verified;
}

if (process.argv[1]?.replaceAll('\\', '/').endsWith('/release-workflow.mjs')) {
  const operations = { integrate: runIntegration, publish: publishPrepared, inspect: inspectPrepared, deploy: deployPrepared, verify: finalVerification };
  const operation = operations[process.argv[2]];
  if (!operation) throw Error('Unknown release workflow operation');
  await operation();
}
