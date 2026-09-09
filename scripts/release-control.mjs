import { createHash } from 'node:crypto';

export const REPOSITORY = 'Boltcall/Boltcall';
export const SITE_ID = '8ec31e2a-c9cf-42e7-9b3d-7b7c04ed2613';
export const PRODUCTION_URL = 'https://boltcall.org';
export const SHA = /^[a-f0-9]{40}$/;
export const HASH = /^[a-f0-9]{64}$/;
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const positive = value => Number.isSafeInteger(value) && value > 0;

export function readApprovedManifest(bytes, releaseId, hash) {
  if (!/^boltcall-[a-f0-9]{12}-\d+-[1-9]\d*$/.test(releaseId || '') || !HASH.test(hash || '')) throw Error('Invalid release selection');
  if (sha256(bytes) !== hash) throw Error('Reviewed manifest bytes changed');
  const m = JSON.parse(bytes);
  const p = m.preparation;
  if (m.schema_version !== 1 || m.project_id !== 'boltcall' || m.repository !== REPOSITORY || !SHA.test(m.source_sha || '') ||
      !positive(p?.run_id) || !positive(p?.run_attempt) || !SHA.test(p.workflow_sha || '') ||
      p.path !== '.github/workflows/prepare-boltcall-release.yml' || !Number.isFinite(Date.parse(m.created_at)) ||
      m.release_id !== releaseId || releaseId !== `boltcall-${m.source_sha.slice(0, 12)}-${p.run_id}-${p.run_attempt}`) {
    throw Error('Invalid preparation identity');
  }
  if (m.target?.provider !== 'netlify' || m.target.site_id !== SITE_ID || m.target.production_url !== PRODUCTION_URL) throw Error('Invalid production target');
  const a = m.artifact;
  if (!positive(a?.id) || a.name !== `boltcall-payload-${p.run_id}-${p.run_attempt}` ||
      !/^sha256:[a-f0-9]{64}$/.test(a.digest || '') || !HASH.test(a.payload_sha256 || '')) throw Error('Invalid prepared artifact identity');
  if (!['typecheck', 'tests', 'build', 'functions'].every(check => m.checks?.[check] === true)) throw Error('Release checks did not pass');
  return m;
}

export function verifyPreparation(m, { run, jobs, artifact, mainContains }) {
  if (mainContains !== true) throw Error('Release source must be in main');
  const p = m.preparation;
  if (run?.id !== p.run_id || run.run_attempt !== p.run_attempt || run.head_sha !== p.workflow_sha ||
      run.head_branch !== 'main' || run.event !== 'workflow_dispatch' || run.path !== p.path ||
      run.display_title !== `Prepare ${m.source_sha}` || run.status !== 'completed' || run.conclusion !== 'success') {
    throw Error('Exact preparation workflow did not complete successfully');
  }
  if (!['validate', 'publish'].every(name => jobs.filter(job => job.name === name && job.run_id === p.run_id &&
      job.run_attempt === p.run_attempt && job.status === 'completed' && job.conclusion === 'success').length === 1)) {
    throw Error('Required preparation jobs did not pass in the selected attempt');
  }
  if (artifact?.id !== m.artifact.id || artifact.name !== m.artifact.name || artifact.digest !== m.artifact.digest ||
      artifact.expired !== false || artifact.workflow_run?.id !== p.run_id || artifact.workflow_run?.head_sha !== p.workflow_sha) {
    throw Error('Prepared artifact is expired or does not match its workflow');
  }
  return true;
}

export async function listAll(api, endpoint, property) {
  const result = [];
  for (let page = 1; page <= 10; page++) {
    const response = await api(`${endpoint}${endpoint.includes('?') ? '&' : '?'}per_page=100&page=${page}`);
    const items = property ? response[property] : response;
    if (!Array.isArray(items) || response.total_count > 1000) throw Error('Receipt history exceeds safe reconciliation bounds');
    result.push(...items);
    if (items.length < 100 || (response.total_count !== undefined && result.length >= response.total_count)) return result;
  }
  throw Error('Receipt history pagination is incomplete');
}

export async function inspectPullRequest(api, number, sha) {
  if (!positive(number) || !SHA.test(sha || '')) throw Error('Invalid pull request selection');
  const pr = await api(`pulls/${number}`);
  if (pr.head?.sha !== sha || pr.base?.ref !== 'main' || pr.base?.repo?.full_name !== REPOSITORY) throw Error('PR source changed');
  if (pr.merged) {
    if (!SHA.test(pr.merge_commit_sha || '')) throw Error('Incomplete merge receipt');
    return { pr, merged: true, sha: pr.merge_commit_sha };
  }
  if (pr.state !== 'open' || pr.mergeable === false) throw Error('PR cannot merge cleanly');
  const runs = await listAll(api, `actions/workflows/pr-tests.yml/runs?event=pull_request&head_sha=${sha}`, 'workflow_runs');
  const run = runs.filter(item => item.head_sha === sha && item.head_branch === pr.head.ref && item.event === 'pull_request' &&
    item.path === '.github/workflows/pr-tests.yml' && item.pull_requests?.some(p => p.number === number))
    .sort((a, b) => b.id - a.id)[0];
  if (!run || run.status !== 'completed' || run.conclusion !== 'success') throw Error('The latest PR workflow has not passed for this exact head');
  return { pr, run };
}

export function releaseMarker(m, hash, { requestId, runId, runAttempt }) {
  if (!HASH.test(hash || '') || !/^[a-zA-Z0-9_-]{1,100}$/.test(requestId || '') || !positive(runId) || !positive(runAttempt)) throw Error('Invalid deployment identity');
  return { schema_version: 1, project_id: 'boltcall', sha: m.source_sha, release_id: m.release_id, manifest_hash: hash,
    request_id: requestId, run_id: runId, run_attempt: runAttempt, site_id: SITE_ID };
}

export function assertNetlifySite(site) {
  if (site?.id !== SITE_ID || site.ssl_url?.replace(/\/$/, '') !== PRODUCTION_URL) throw Error('Netlify site does not match the approved target');
  if (site.build_settings?.stop_builds !== true) throw Error('Netlify Git builds must be stopped before workflow-only releases can be enabled');
}

export function verifyLiveDeployment({ expected, marker, receipt, site, deploy }) {
  assertNetlifySite(site);
  if (!Object.entries(expected).every(([key, value]) => marker?.[key] === value && receipt?.[key] === value)) throw Error('Public release marker or deployment receipt changed');
  if (receipt.stage !== 'published' || receipt.production_deploy_id !== receipt.deploy_id ||
      !/^[a-f0-9]{24}$/.test(receipt.preview_deploy_id || '') || receipt.preview_deploy_id === receipt.deploy_id ||
      receipt.preview_receipt?.deploy_id !== receipt.preview_deploy_id || receipt.preview_receipt.context !== 'deploy-preview' ||
      receipt.production_receipt?.deploy_id !== receipt.deploy_id || receipt.production_receipt.context !== 'production' ||
      !/^[a-f0-9]{64}$/.test(receipt.upload_fingerprint || '') || receipt.preview_receipt.upload_fingerprint !== receipt.upload_fingerprint ||
      receipt.production_receipt.upload_fingerprint !== receipt.upload_fingerprint ||
      !/^[a-f0-9]{24}$/.test(receipt?.deploy_id || '') || receipt.production_url !== PRODUCTION_URL ||
      site.published_deploy?.id !== receipt.deploy_id || deploy?.id !== receipt.deploy_id ||
      deploy.site_id !== SITE_ID || deploy.context !== 'production' || deploy.state !== 'ready') {
    throw Error('Expected Netlify deployment is not currently published');
  }
  return true;
}

export function selectApprovalReceipts(jobs, runId, attempt) {
  const selected = new Map();
  for (const job of [...jobs].sort((a, b) => a.run_attempt - b.run_attempt)) {
    if (job.status === 'completed' && job.conclusion === 'success' && job.run_id === runId &&
        positive(job.run_attempt) && job.run_attempt <= attempt) selected.set(job.name, job);
  }
  const review = selected.get('owner-review'), deploy = selected.get('deploy'), acceptance = selected.get('owner-verification');
  if (!review || !deploy || !acceptance) throw Error('Owner approval and deployment job receipts are required');
  const times = [review.completed_at, deploy.started_at, deploy.completed_at, acceptance.started_at].map(Date.parse);
  if (!times.every(Number.isFinite) || times[0] > times[1] || times[1] > times[2] || times[2] > times[3]) {
    throw Error('Owner acceptance must follow the selected deployment and its prior approval');
  }
  return { deploymentAttempt: deploy.run_attempt, reviewAttempt: review.run_attempt, acceptanceAttempt: acceptance.run_attempt };
}

export function assertOwnerGate(environment, policies, name = 'production') {
  const rule = environment?.protection_rules?.find(item => item.type === 'required_reviewers');
  if (environment?.name !== name || environment.can_admins_bypass !== false ||
      rule?.reviewers?.length !== 1 || rule.reviewers[0].type !== 'User' ||
      rule.reviewers[0].reviewer?.id !== 77395319) {
    throw Error(`${name} requires sole owner NJ44 review with administrator bypass disabled`);
  }
  if (environment.deployment_branch_policy?.protected_branches !== false ||
      environment.deployment_branch_policy?.custom_branch_policies !== true ||
      policies?.length !== 1 || policies[0].name !== 'main' || policies[0].type !== 'branch') {
    throw Error(`${name} requires exactly one custom main branch policy`);
  }
  return true;
}
