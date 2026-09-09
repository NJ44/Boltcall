import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { bundlePreparedFunctions, materializeFunctionCache, withFreshFunctionCache } from '../release-functions.mjs';
import { sha256 } from '../release-control.mjs';

test('pinned Netlify CLI preserves v2 transport, TOML settings and in-source precedence without running functions', { timeout: 120000 }, async () => {
  const cliRoot = process.env.NETLIFY_CLI_ROOT;
  assert.ok(cliRoot, 'Run with the pinned NETLIFY_CLI_ROOT');
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'boltcall-function-cli-'));
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'boltcall-function-hash-'));
  try {
    await fs.mkdir(path.join(root, 'netlify/functions'), { recursive: true });
    await fs.writeFile(path.join(root, 'package.json'), '{"type":"module"}');
    await fs.writeFile(path.join(root, 'netlify.toml'), '[functions]\n  directory="netlify/functions"\n  node_bundler="esbuild"\n[functions.scheduled]\n  schedule="*/5 * * * *"\n  timeout=300\n[functions.override]\n  schedule="*/5 * * * *"\n  timeout=300\n');
    const source = 'throw new Error("Preparation must never execute application functions");\nexport default async () => new Response("ok");\n';
    await fs.writeFile(path.join(root, 'netlify/functions/scheduled.js'), source);
    await fs.writeFile(path.join(root, 'netlify/functions/override.js'), `${source}export const config={schedule:"0 6 * * *",timeout:30};\n`);
    const preparedPath = await bundlePreparedFunctions(root, { cliRoot });
    const preparedBytes = await fs.readFile(preparedPath);
    const prepared = JSON.parse(preparedBytes);
    const expected = { scheduled: { schedule: '*/5 * * * *', timeout: 300 }, override: { schedule: '0 6 * * *', timeout: 30 } };
    for (const fn of prepared.functions) {
      assert.equal(fn.invocationMode, 'stream');
      assert.equal(fn.runtimeVersion, 'nodejs22.x');
      assert.equal(fn.buildData.runtimeAPIVersion, 2);
      assert.equal(fn.schedule, expected[fn.name].schedule);
      assert.equal(fn.timeout, expected[fn.name].timeout);
    }
    assert.equal(prepared.functions.length, 2);
    const digests = new Map(await Promise.all(prepared.functions.map(async fn => [fn.name, sha256(await fs.readFile(fn.path))])));
    const { default: hashFns } = await import(pathToFileURL(path.join(cliRoot, 'dist/utils/deploy/hash-fns.js')));
    const { getFunctionsManifestPath } = await import(pathToFileURL(path.join(cliRoot, 'dist/utils/functions/functions.js')));
    await materializeFunctionCache(root);
    const manifestPath = await getFunctionsManifestPath({ base: root });
    assert.ok(manifestPath);
    // Reproduce the CLI's expired-cache condition; the deployment guard must
    // renew the derived cache before its real reader can silently use ZIP fallback.
    const staleCache = JSON.parse(await fs.readFile(manifestPath));
    await fs.writeFile(manifestPath, JSON.stringify({ ...staleCache, timestamp: 1 }));
    const result = await withFreshFunctionCache(manifestPath, () => hashFns({ getPathInProject: p => path.join(root, '.netlify', p) }, [path.join(root, '.netlify-fn-build')], {
      concurrentHash: 1, functionsConfig: {}, manifestPath, rootDir: root, skipFunctionsCache: false, statusCb() {}, tmpDir,
    }));
    for (const fn of Object.values(result.fnShaMap).flat()) {
      assert.equal(fn.invocationMode, 'stream');
      assert.equal(fn.runtime, 'nodejs22.x');
      assert.equal(fn.buildData.runtimeAPIVersion, 2);
      assert.equal(fn.timeout, expected[fn.normalizedPath].timeout);
      assert.equal(sha256(await fs.readFile(fn.filepath)), digests.get(fn.normalizedPath));
    }
    assert.deepEqual(result.functionSchedules.sort((a, b) => a.name.localeCompare(b.name)), [
      { name: 'override', cron: '0 6 * * *' }, { name: 'scheduled', cron: '*/5 * * * *' },
    ]);
    assert.deepEqual(await fs.readFile(preparedPath), preparedBytes);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
});
