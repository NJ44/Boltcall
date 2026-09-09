import { describe, it, expect } from 'vitest';
import { assertOwnerGate, readApprovedManifest, verifyPreparation, inspectPullRequest, releaseMarker, verifyLiveDeployment, selectApprovalReceipts, sha256, SITE_ID, PRODUCTION_URL } from '../release-control.mjs';

const gate = () => ({ name: 'production', can_admins_bypass: false,
  deployment_branch_policy: { protected_branches: false, custom_branch_policies: true },
  protection_rules: [{ type: 'required_reviewers', reviewers: [{ type: 'User', reviewer: { id: 77395319 } }] }],
});

describe('exact pull request integration', () => {
  it('requires latest associated CI and refuses a changed PR head', async () => {
    const pr = { number: 7, state: 'open', head: { sha: source, ref: 'codex/test' }, base: { ref: 'main', repo: { full_name: 'Boltcall/Boltcall' } } };
    const run = { id: 10, head_sha: source, head_branch: 'codex/test', event: 'pull_request', path: '.github/workflows/pr-tests.yml', pull_requests: [{ number: 7 }], status: 'completed', conclusion: 'success' };
    let runs = [run];
    const api = async path => path.startsWith('pulls/') ? pr : { total_count: runs.length, workflow_runs: runs };
    expect((await inspectPullRequest(api, 7, source)).run.id).toBe(10);
    runs = [run, { ...run, id: 11, conclusion: 'failure' }];
    await expect(inspectPullRequest(api, 7, source)).rejects.toThrow(/latest/);
    pr.head.sha = 'b'.repeat(40);
    await expect(inspectPullRequest(api, 7, source)).rejects.toThrow(/changed/);
  });
});

describe('production acceptance', () => {
  it('preserves a prior deploy attempt during verification retry but rejects acceptance before the selected deploy', () => {
    const jobs = [
      { name: 'owner-review', started_at: '2026-09-08T00:00:00Z', completed_at: '2026-09-08T00:01:00Z' },
      { name: 'deploy', started_at: '2026-09-08T00:02:00Z', completed_at: '2026-09-08T00:03:00Z' },
      { name: 'owner-verification', started_at: '2026-09-08T00:04:00Z', completed_at: '2026-09-08T00:05:00Z' },
    ].map(job => ({ ...job, run_id: 789, run_attempt: 1, status: 'completed', conclusion: 'success' }));
    expect(selectApprovalReceipts(jobs, 789, 2).deploymentAttempt).toBe(1);
    const stale = [...jobs, { ...jobs[1], run_attempt: 2, started_at: '2026-09-08T00:06:00Z', completed_at: '2026-09-08T00:07:00Z' }];
    expect(() => selectApprovalReceipts(stale, 789, 2)).toThrow(/acceptance/);
    expect(() => selectApprovalReceipts(jobs.slice(1), 789, 2)).toThrow(/approval/);
  });
  it('ties the public marker and receipt to the deploy currently published by Netlify', () => {
    const m = manifest(); const hash = 'f'.repeat(64);
    const marker = releaseMarker(m, hash, { requestId: 'request-1', runId: 789, runAttempt: 1 });
    const id = 'a'.repeat(24), previewId = 'b'.repeat(24), upload = 'c'.repeat(64);
    const receipt = { ...marker, deploy_id: id, production_deploy_id: id, preview_deploy_id: previewId, production_url: PRODUCTION_URL,
      stage: 'published', upload_fingerprint: upload, preview_receipt: { deploy_id: previewId, context: 'deploy-preview', upload_fingerprint: upload },
      production_receipt: { deploy_id: id, context: 'production', upload_fingerprint: upload } };
    const site = { id: SITE_ID, ssl_url: PRODUCTION_URL, build_settings: { stop_builds: true }, published_deploy: { id } };
    const deploy = { id, site_id: SITE_ID, context: 'production', state: 'ready' };
    expect(verifyLiveDeployment({ expected: marker, marker, receipt, site, deploy })).toBe(true);
    expect(() => verifyLiveDeployment({ expected: marker, marker, receipt, site: { ...site, published_deploy: { id: 'other' } }, deploy })).toThrow(/published/);
    expect(() => verifyLiveDeployment({ expected: marker, marker: { ...marker, manifest_hash: 'a'.repeat(64) }, receipt, site, deploy })).toThrow(/marker/);
    expect(() => verifyLiveDeployment({ expected: marker, marker, receipt, site: { ...site, build_settings: { stop_builds: false } }, deploy })).toThrow(/Git/);
    for (const change of [{ stage: 'restored' }, { preview_deploy_id: id }, { preview_receipt: {} }, { upload_fingerprint: 'd'.repeat(64) }]) {
      expect(() => verifyLiveDeployment({ expected: marker, marker, receipt: { ...receipt, ...change }, site, deploy })).toThrow(/published/);
    }
  });
});
const policies = [{ name: 'main', type: 'branch' }];
const source = 'a'.repeat(40);
const manifest = () => ({ schema_version: 1, project_id: 'boltcall', repository: 'Boltcall/Boltcall',
  release_id: 'boltcall-aaaaaaaaaaaa-123-1', source_sha: source, created_at: '2026-09-08T00:00:00.000Z',
  preparation: { run_id: 123, run_attempt: 1, workflow_sha: 'b'.repeat(40), path: '.github/workflows/prepare-boltcall-release.yml' },
  artifact: { id: 456, name: 'boltcall-payload-123-1', digest: `sha256:${'c'.repeat(64)}`, payload_sha256: 'd'.repeat(64) },
  target: { provider: 'netlify', site_id: SITE_ID, production_url: PRODUCTION_URL },
  checks: { typecheck: true, tests: true, build: true, functions: true },
});

describe('release authorization', () => {
  it('requires the sole owner and exact main policy before accepting a release', () => {
    expect(assertOwnerGate(gate(), policies)).toBe(true);
    const bypass = gate(); bypass.can_admins_bypass = true;
    expect(() => assertOwnerGate(bypass, policies)).toThrow(/owner/);
    expect(() => assertOwnerGate(gate(), [{ name: '*', type: 'branch' }])).toThrow(/main/);
    const team = gate(); team.protection_rules[0].reviewers.push({ type: 'Team', reviewer: { id: 42 } });
    expect(() => assertOwnerGate(team, policies)).toThrow(/owner/);
  });
});

describe('reviewed release evidence', () => {
  it('accepts only the selected manifest bytes, source and fixed production target', () => {
    const m = manifest(); const bytes = JSON.stringify(m);
    expect(readApprovedManifest(bytes, m.release_id, sha256(bytes))).toEqual(m);
    expect(() => readApprovedManifest(bytes + ' ', m.release_id, sha256(bytes))).toThrow(/changed/);
    m.target.site_id = 'different-site'; const altered = JSON.stringify(m);
    expect(() => readApprovedManifest(altered, m.release_id, sha256(altered))).toThrow(/target/);
  });

  it('rejects self-asserted test booleans unless exact preparation jobs and retained artifact prove them', () => {
    const m = manifest();
    const run = { id: 123, run_attempt: 1, head_sha: m.preparation.workflow_sha, head_branch: 'main',
      event: 'workflow_dispatch', path: m.preparation.path, display_title: `Prepare ${source}`, status: 'completed', conclusion: 'success' };
    const jobs = ['validate', 'publish'].map(name => ({ name, run_id: 123, run_attempt: 1, status: 'completed', conclusion: 'success' }));
    const artifact = { ...m.artifact, expired: false, workflow_run: { id: 123, head_sha: run.head_sha } };
    expect(verifyPreparation(m, { run, jobs, artifact, mainContains: true })).toBe(true);
    expect(() => verifyPreparation(m, { run: { ...run, display_title: `Prepare ${'e'.repeat(40)}` }, jobs, artifact, mainContains: true })).toThrow(/preparation/);
    expect(() => verifyPreparation(m, { run, jobs: jobs.slice(0, 1), artifact, mainContains: true })).toThrow(/jobs/);
    expect(() => verifyPreparation(m, { run, jobs, artifact: { ...artifact, expired: true }, mainContains: true })).toThrow(/artifact/);
    expect(() => verifyPreparation(m, { run, jobs, artifact, mainContains: false })).toThrow(/main/);
  });
});
