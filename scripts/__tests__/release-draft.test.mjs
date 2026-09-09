import { describe, it, expect } from 'vitest';
import { assertPreparedDeployMetadata } from '../release-workflow.mjs';
import { SITE_ID } from '../release-control.mjs';

function fixture() {
  const functions = [{ name: 'fixture', digest: 'e'.repeat(64), runtime: 'nodejs22.x', invocationMode: 'stream',
    buildData: { runtimeAPIVersion: 2, bootstrapVersion: '2.16.0' }, schedule: '@hourly' }];
  const receipt = { deploy_id: 'b'.repeat(24) };
  const deploy = { id: receipt.deploy_id, site_id: SITE_ID, state: 'ready', context: 'production',
    available_functions: [{ n: 'fixture', d: functions[0].digest, r: 'nodejs22.x', im: 'stream', bd: functions[0].buildData }],
    function_schedules: [{ name: 'fixture', cron: '@hourly' }] };
  return { deploy, receipt, functions };
}
describe('per-context prepared deployment metadata', () => {
  it.each(['production', 'deploy-preview'])('requires the explicitly selected %s context', context => {
    const { deploy, receipt, functions } = fixture();
    expect(() => assertPreparedDeployMetadata({ ...deploy, context }, receipt, functions, context)).not.toThrow();
    expect(() => assertPreparedDeployMetadata({ ...deploy, context: 'branch-deploy' }, receipt, functions, context)).toThrow();
  });
  it.each(['runtime', 'stream', 'build metadata', 'digest', 'schedules', 'inventory', 'duplicate', 'site', 'id'])('refuses changed %s', failure => {
    const { deploy, receipt, functions } = fixture();
    if (failure === 'runtime') deploy.available_functions[0].r = 'nodejs24.x';
    if (failure === 'stream') delete deploy.available_functions[0].im;
    if (failure === 'build metadata') deploy.available_functions[0].bd = null;
    if (failure === 'digest') deploy.available_functions[0].d = 'f'.repeat(64);
    if (failure === 'schedules') deploy.function_schedules = [];
    if (failure === 'inventory') deploy.available_functions = [];
    if (failure === 'duplicate') deploy.available_functions.push(deploy.available_functions[0]);
    if (failure === 'site') deploy.site_id = 'other';
    if (failure === 'id') deploy.id = 'a'.repeat(24);
    expect(() => assertPreparedDeployMetadata(deploy, receipt, functions)).toThrow();
  });
});
