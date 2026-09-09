import { afterEach, describe, expect, it } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { materializeFunctionCache, withFreshFunctionCache } from '../release-functions.mjs';
import { sha256 } from '../release-control.mjs';

const roots = [];
afterEach(async () => { for (const root of roots.splice(0)) await fs.rm(root, { recursive: true, force: true }); });
async function fixture(change = () => {}) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'boltcall-function-test-'));
  roots.push(root);
  const directory = path.join(root, '.netlify-fn-build');
  await fs.mkdir(directory);
  const manifest = { version: 1, timestamp: 1, system: { platform: 'linux' }, functions: [{ name: 'example',
    path: '/prepared/.netlify-fn-build/example.zip', mainFile: '/prepared/netlify/functions/example.ts',
    runtime: 'js', runtimeVersion: 'nodejs22.x', invocationMode: 'stream',
    buildData: { runtimeAPIVersion: 2, bootstrapVersion: '2.16.0' }, schedule: '*/5 * * * *', timeout: 300 }] };
  change(manifest);
  await fs.writeFile(path.join(directory, 'manifest.json'), JSON.stringify(manifest));
  await fs.writeFile(path.join(directory, 'example.zip'), Buffer.from([0x50, 0x4b, 3, 4, 255]));
  return { root, directory, manifest };
}

describe('verified function cache materialization', () => {
  it('changes only relocated paths and timestamp while preserving original evidence and ZIP digest', async () => {
    const { root, directory, manifest } = await fixture();
    const original = await fs.readFile(path.join(directory, 'manifest.json'));
    const digest = sha256(await fs.readFile(path.join(directory, 'example.zip')));
    const output = await materializeFunctionCache(root, { now: 1234 });
    const cache = JSON.parse(await fs.readFile(output));
    expect(cache).toEqual({ ...manifest, timestamp: 1234, functions: manifest.functions.map(fn => ({ ...fn, path: path.join(directory, 'example.zip') })) });
    expect(await fs.readFile(path.join(directory, 'manifest.json'))).toEqual(original);
    expect(sha256(await fs.readFile(path.join(directory, 'example.zip')))).toBe(digest);
  });
  it.each([
    ['duplicate name', m => m.functions.push(m.functions[0])],
    ['traversal name', m => { m.functions[0].name = '../example'; }],
    ['traversal path', m => { m.functions[0].path = '/prepared/../.netlify-fn-build/example.zip'; }],
    ['outside archive root', m => { m.functions[0].path = '/other/example.zip'; }],
    ['mismatched archive name', m => { m.functions[0].path = '/prepared/.netlify-fn-build/other.zip'; }],
    ['missing stream mode', m => { delete m.functions[0].invocationMode; }],
    ['missing v2 runtime', m => { delete m.functions[0].runtimeVersion; }],
    ['invalid schema', m => { m.version = 2; }],
  ])('rejects %s before creating a deploy cache', async (_, change) => {
    const { root } = await fixture(change);
    await expect(materializeFunctionCache(root)).rejects.toThrow();
    await expect(fs.stat(path.join(root, '.netlify/functions/manifest.json'))).rejects.toThrow();
  });
  it.each(['missing', 'undeclared'])('rejects %s ZIP files', async kind => {
    const { root, directory } = await fixture();
    if (kind === 'missing') await fs.unlink(path.join(directory, 'example.zip'));
    else await fs.writeFile(path.join(directory, 'extra.zip'), 'extra');
    await expect(materializeFunctionCache(root)).rejects.toThrow();
  });
  it.each([false, true])('refreshes atomically and stops renewing after command completion (failure=%s)', async fails => {
    const { root } = await fixture();
    const cachePath = await materializeFunctionCache(root, { now: 1 });
    const operation = withFreshFunctionCache(cachePath, async signal => {
      expect(signal.aborted).toBe(false);
      const initial = JSON.parse(await fs.readFile(cachePath));
      await new Promise(resolve => setTimeout(resolve, 90));
      const refreshed = JSON.parse(await fs.readFile(cachePath));
      expect(refreshed.timestamp).toBeGreaterThan(initial.timestamp);
      expect({ ...refreshed, timestamp: 0 }).toEqual({ ...initial, timestamp: 0 });
      if (fails) throw Error('Deploy command failed');
      return 'receipt';
    }, { intervalMs: 20 });
    if (fails) await expect(operation).rejects.toThrow('Deploy command failed');
    else expect(await operation).toBe('receipt');
    const after = await fs.readFile(cachePath);
    await new Promise(resolve => setTimeout(resolve, 60));
    expect(await fs.readFile(cachePath)).toEqual(after);
    expect(await fs.readdir(path.dirname(cachePath))).toEqual(['manifest.json']);
  });
  it.each(['missing', 'substituted'])('aborts the deployment when cache freshness fails because metadata is %s', async failure => {
    const { root } = await fixture();
    const cachePath = await materializeFunctionCache(root);
    await expect(withFreshFunctionCache(cachePath, async signal => {
      if (failure === 'missing') await fs.unlink(cachePath);
      else await fs.writeFile(cachePath, JSON.stringify({ version: 1, timestamp: 1, functions: [] }));
      await new Promise((resolve, reject) => {
        if (signal.aborted) reject(signal.reason);
        else signal.addEventListener('abort', () => reject(signal.reason), { once: true });
      });
      throw Error('Deployment must not continue after refresh failure');
    }, { intervalMs: 20 })).rejects.toThrow(/freshness/);
    expect((await fs.readdir(path.dirname(cachePath))).some(name => name.endsWith('.tmp'))).toBe(false);
  });
});
