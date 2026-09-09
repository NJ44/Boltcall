import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { bundlePreparedFunctions, materializeFunctionCache, withFreshFunctionCache } from '../release-functions.mjs';
import { sha256 } from '../release-control.mjs';
import { uploadPreparedPayload } from '../release-workflow.mjs';
import { withNetlifyCLI } from './helpers/netlify-cli-fixture.mjs';

test('pinned Netlify CLI preserves v2 transport, TOML settings and in-source precedence without running functions', { timeout: 120000 }, async () => {
  const cliRoot = process.env.NETLIFY_CLI_ROOT;
  assert.ok(cliRoot, 'Run with the pinned NETLIFY_CLI_ROOT');
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'boltcall-function-cli-'));
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'boltcall-function-hash-'));
  const vendorPath = path.join(cliRoot, 'dist/utils/deploy/deploy-site.js');
  const vendorBytes = await fs.readFile(vendorPath);
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
    // Match deployment layout: a prepared payload nested inside a checkout that
    // has its own package.json and Netlify config. CWD alone selects the wrong
    // project root in CLI 26; exercise the real command through its upload API.
    const payload = path.join(root, 'release-payload');
    await fs.mkdir(path.join(payload, '.netlify-fn-build'), { recursive: true });
    await fs.mkdir(path.join(payload, 'dist'));
    await fs.writeFile(path.join(payload, 'dist/index.html'), 'fixture');
    // More than the CLI's 100-file limit exercises its asynchronous diff poll,
    // as the full production payload does, before uploading required functions.
    await Promise.all(Array.from({ length: 101 }, (_, index) => fs.writeFile(path.join(payload, 'dist', `${index}.txt`), String(index))));
    await fs.copyFile(path.join(root, 'netlify.toml'), path.join(payload, 'netlify.toml'));
    await fs.copyFile(preparedPath, path.join(payload, '.netlify-fn-build/manifest.json'));
    for (const fn of prepared.functions) await fs.copyFile(fn.path, path.join(payload, '.netlify-fn-build', `${fn.name}.zip`));
    await withNetlifyCLI({ root, cliRoot }, async ({ run, observed }) => {
      const { result } = await uploadPreparedPayload({ directory: payload, checkoutDirectory: root, message: 'fixture', run });
      assert.equal(result.deploy_id, 'f'.repeat(24));
      assert.equal(observed.creates.length, 1);
      assert.equal(observed.creates[0].draft, true);
      assert.equal(observed.updates.length, 1);
      assert.equal(observed.updates[0].draft, true);
      assert.equal(observed.updates[0].async, true);
      assert.deepEqual(observed.updates[0].function_schedules.sort((a, b) => a.name.localeCompare(b.name)), resultSchedules());
      assert.equal(observed.uploads.length, 2);
      assert.equal(observed.fileUploads.length, Object.keys(observed.updates[0].files).length);
      for (const upload of observed.fileUploads) assert.equal(upload.digest, observed.updates[0].files[upload.name]);
      for (const upload of observed.uploads) {
        assert.equal(upload.parameters.runtime, 'nodejs22.x');
        assert.equal(upload.parameters.invocation_mode, 'stream');
        assert.equal(Number(upload.parameters.timeout), expected[upload.name].timeout);
        assert.equal(upload.digest, digests.get(upload.name));
        assert.equal(observed.updates[0].functions_config[upload.name].build_data.runtimeAPIVersion, 2);
      }
      assert.deepEqual(observed.unexpected, []);
    });
    assert.deepEqual(await fs.readFile(vendorPath), vendorBytes, 'The installed CLI module must never be edited');
    for (const fn of prepared.functions) assert.equal(sha256(await fs.readFile(path.join(payload, '.netlify-fn-build', `${fn.name}.zip`))), digests.get(fn.name));
    const failedPayload = path.join(root, 'failed-payload');
    await fs.cp(payload, failedPayload, { recursive: true, filter: source => !source.includes(`${path.sep}.netlify${path.sep}`) && path.basename(source) !== '.netlify' });
    await withNetlifyCLI({ root, cliRoot, uploadFailure: { status: 422, code: 'FUNCTION_TIMEOUT_LIMIT',
      message: 'Fixture function upload rejected; token=fixture-api-secret\nAuthorization: Bearer fixture-message-secret',
      extra: { headers: { Authorization: 'Bearer ignored-header-secret' }, request: { env: 'ignored-request-secret' } } } }, async ({ run, observed }) => {
      await assert.rejects(uploadPreparedPayload({ directory: failedPayload, checkoutDirectory: root, message: 'fixture failure', run }), error => {
        assert.match(error.message, /JSONHTTPError: Unprocessable Entity/);
        assert.match(error.message, /Fixture function upload rejected/);
        assert.match(error.message, /"status":422/);
        assert.match(error.message, /"code":"FUNCTION_TIMEOUT_LIMIT"/);
        const diagnostic = JSON.parse(error.message.split('\n').find(line => line.startsWith('NETLIFY_RELEASE_ERROR ')).slice('NETLIFY_RELEASE_ERROR '.length));
        assert.deepEqual(Object.keys(diagnostic).sort(), ['code', 'message', 'status']);
        assert.doesNotMatch(error.message, /fixture-api-secret|fixture-message-secret|ignored-header-secret|ignored-request-secret/);
        assert.match(error.message, /exit 1/);
        return true;
      });
      assert.deepEqual(observed.cancellations, ['f'.repeat(24)]);
      assert.equal(observed.creates.length, 1);
      assert.deepEqual(observed.unexpected, []);
    });
    assert.deepEqual(await fs.readFile(vendorPath), vendorBytes, 'Failure diagnostics must not edit the installed CLI');
  } finally {
    await fs.rm(root, { recursive: true, force: true });
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
});

function resultSchedules() { return [{ name: 'override', cron: '0 6 * * *' }, { name: 'scheduled', cron: '*/5 * * * *' }]; }
