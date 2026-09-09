import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { bundlePreparedFunctions, materializeFunctionCache, withFreshFunctionCache, NETLIFY_CLI_VERSION, loadNetlifyToolchain } from '../release-functions.mjs';
import { sha256 } from '../release-control.mjs';
import { uploadPreparedPayload } from '../release-workflow.mjs';
import { withNetlifyCLI } from './helpers/netlify-cli-fixture.mjs';
import { SITE_ID } from '../release-control.mjs';

test('repository functions use the modern runtime required by the site environment', async () => {
  const cliRoot = process.env.NETLIFY_CLI_ROOT;
  assert.ok(cliRoot, 'Run with the pinned NETLIFY_CLI_ROOT');
  assert.equal(JSON.parse(await fs.readFile(path.join(cliRoot, 'package.json'))).version, NETLIFY_CLI_VERSION);
  const require = createRequire(path.join(cliRoot, 'package.json'));
  const { listFunctions } = await import(pathToFileURL(require.resolve('@netlify/zip-it-and-ship-it')));
  const directory = fileURLToPath(new URL('../../netlify/functions/', import.meta.url));
  // Actual bundler analysis catches named handler exports even beside a modern default export.
  const functions = await listFunctions(directory, { parseISC: true });
  assert.ok(functions.some(fn => fn.name === 'generate-runbook'));
  assert.deepEqual(functions.filter(fn => fn.runtimeAPIVersion !== 2).map(fn => fn.name), [],
    'Lambda-compatible functions cannot use this site environment; export only the modern entry point');
});

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
    const { extractZip } = await import(pathToFileURL(path.join(cliRoot, 'dist/utils/zip.js')));
    for (const fn of prepared.functions) {
      assert.equal(fn.invocationMode, 'stream');
      assert.equal(fn.runtimeVersion, 'nodejs22.x');
      assert.equal(fn.buildData.runtimeAPIVersion, 2);
      assert.equal(fn.schedule, expected[fn.name].schedule);
      assert.equal(fn.timeout, expected[fn.name].timeout);
      const extracted = path.join(root, 'inspected', fn.name);
      await extractZip(fn.path, { dir: extracted });
      assert.deepEqual(JSON.parse(await fs.readFile(path.join(extracted, '.netlify-runtime-contracts', `${fn.name}.json`))), {
        schema_version: 1, runtime: 'nodejs22.x', runtime_api_version: 2,
        invocation_mode: 'stream', timeout: expected[fn.name].timeout, bootstrap_version: fn.buildData.bootstrapVersion,
      });
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
    const receiptFile = path.join(root, 'deployment-receipt.json');
    const initialReceipt = { site_id: SITE_ID, previous_deploy_id: 'a'.repeat(24), stage: 'preview_requested' };
    await fs.writeFile(receiptFile, JSON.stringify(initialReceipt));
    await withNetlifyCLI({ root, cliRoot }, async ({ run, observed }) => {
      const { result, cachePath } = await uploadPreparedPayload({ directory: payload, checkoutDirectory: root, message: 'fixture', run });
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
      const previewReceipt = JSON.parse(await fs.readFile(receiptFile));
      assert.equal(previewReceipt.preview_deploy_id, result.deploy_id);
      await fs.writeFile(receiptFile, JSON.stringify({ ...previewReceipt, stage: 'production_requested' }));
      const production = await uploadPreparedPayload({ directory: payload, checkoutDirectory: root, cachePath, mode: 'production', message: 'fixture', run });
      assert.notEqual(production.result.deploy_id, result.deploy_id);
      assert.equal(observed.creates[1].draft, false);
      assert.equal(observed.updates[1].draft, false);
      for (const key of ['files', 'functions', 'functions_config', 'function_schedules']) assert.deepEqual(observed.updates[1][key], observed.updates[0][key]);
      const phaseUploads = id => observed.uploads.filter(u => u.deployId === id).map(({ deployId, ...u }) => u).sort((a, b) => a.name.localeCompare(b.name));
      assert.deepEqual(phaseUploads('e'.repeat(24)), phaseUploads('f'.repeat(24)));
      assert.ok(observed.creates.every(body => !('environment' in body)) && observed.updates.every(body => !('environment' in body)), 'Netlify must inherit context variables without a client-provided environment');
      assert.equal(JSON.parse(await fs.readFile(receiptFile)).production_deploy_id, production.result.deploy_id);
    });
    assert.deepEqual(await fs.readFile(vendorPath), vendorBytes, 'The installed CLI module must never be edited');
    for (const fn of prepared.functions) assert.equal(sha256(await fs.readFile(path.join(payload, '.netlify-fn-build', `${fn.name}.zip`))), digests.get(fn.name));
    const failedPayload = path.join(root, 'failed-payload');
    await fs.cp(payload, failedPayload, { recursive: true, filter: source => !source.includes(`${path.sep}.netlify${path.sep}`) && path.basename(source) !== '.netlify' });
    await fs.writeFile(receiptFile, JSON.stringify(initialReceipt));
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
    const changedPayload = path.join(root, 'changed-payload');
    await fs.cp(payload, changedPayload, { recursive: true, filter: source => !source.includes(`${path.sep}.netlify${path.sep}`) && path.basename(source) !== '.netlify' });
    await fs.writeFile(receiptFile, JSON.stringify(initialReceipt));
    await withNetlifyCLI({ root, cliRoot }, async ({ run, observed }) => {
      const first = await uploadPreparedPayload({ directory: changedPayload, checkoutDirectory: root, message: 'mutation fixture', run });
      await fs.writeFile(receiptFile, JSON.stringify({ ...JSON.parse(await fs.readFile(receiptFile)), stage: 'production_requested' }));
      await fs.writeFile(path.join(changedPayload, 'dist/index.html'), 'unreviewed mutation');
      await assert.rejects(uploadPreparedPayload({ directory: changedPayload, checkoutDirectory: root, cachePath: first.cachePath, mode: 'production', message: 'mutation fixture', run }), /differs from the verified preview/);
      assert.equal(observed.creates.length, 2);
      assert.equal(observed.updates.length, 1, 'Changed production maps must never be finalized');
      assert.deepEqual(observed.cancellations, ['e'.repeat(24)]);
      assert.equal(JSON.parse(await fs.readFile(receiptFile)).production_deploy_id, 'e'.repeat(24));
    });
    assert.deepEqual(await fs.readFile(vendorPath), vendorBytes);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
});

function resultSchedules() { return [{ name: 'override', cron: '0 6 * * *' }, { name: 'scheduled', cron: '*/5 * * * *' }]; }

test('runtime contract changes the ZIP identity that a cached wrong runtime would otherwise reuse', { timeout: 120000 }, async () => {
  const cliRoot = process.env.NETLIFY_CLI_ROOT;
  const { zipFunctions } = await loadNetlifyToolchain(cliRoot);
  const { extractZip } = await import(pathToFileURL(path.join(cliRoot, 'dist/utils/zip.js')));
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'boltcall-runtime-cache-'));
  const createSource = async (name, timeout) => {
    const directory = path.join(root, name);
    await fs.mkdir(path.join(directory, 'netlify/functions'), { recursive: true });
    await fs.mkdir(path.join(directory, 'assets'));
    await fs.mkdir(path.join(directory, 'dist'));
    await fs.writeFile(path.join(directory, 'assets/fixture.txt'), 'required ordinary include');
    await fs.writeFile(path.join(directory, 'dist/index.html'), 'fixture');
    await fs.writeFile(path.join(directory, 'package.json'), '{"type":"module"}');
    await fs.writeFile(path.join(directory, 'netlify.toml'), `[functions]\ndirectory="netlify/functions"\nnode_bundler="esbuild"\nincluded_files=["assets/*.txt"]\n[functions.echo]\ntimeout=${timeout}\n`);
    await fs.writeFile(path.join(directory, 'netlify/functions/echo.js'), 'throw Error("Never execute during preparation");\nexport default async()=>new Response("same code");\n');
    return directory;
  };
  try {
    await fs.writeFile(path.join(root, 'package.json'), '{"type":"module"}');
    const source = await createSource('source', 300);
    await fs.copyFile(path.join(source, 'netlify.toml'), path.join(root, 'netlify.toml'));
    const oldPayload = path.join(root, 'old-payload');
    await fs.mkdir(path.join(oldPayload, '.netlify-fn-build'), { recursive: true });
    await fs.cp(path.join(source, 'dist'), path.join(oldPayload, 'dist'), { recursive: true });
    await fs.copyFile(path.join(source, 'netlify.toml'), path.join(oldPayload, 'netlify.toml'));
    await zipFunctions(path.join(source, 'netlify/functions'), path.join(oldPayload, '.netlify-fn-build'), {
      basePath: source, config: { '*': { nodeBundler: 'esbuild', nodeVersion: 'nodejs22.x', timeout: 300, includedFiles: ['assets/*.txt'], includedFilesBasePath: source } },
    });
    const oldDigest = sha256(await fs.readFile(path.join(oldPayload, '.netlify-fn-build/echo.zip')));
    // Simulate Netlify's observed digest cache: code bytes retain earlier Node24/non-stream metadata.
    const functionCache = new Map([[oldDigest, { r: 'nodejs24.x', im: null }]]);
    const receiptFile = path.join(root, 'deployment-receipt.json');
    const initial = { site_id: SITE_ID, previous_deploy_id: 'a'.repeat(24), stage: 'preview_requested' };
    await fs.writeFile(receiptFile, JSON.stringify(initial));
    await withNetlifyCLI({ root, cliRoot, functionCache }, async ({ run, observed }) => {
      await uploadPreparedPayload({ directory: oldPayload, checkoutDirectory: root, run });
      assert.equal(observed.updates[0].functions_config.echo.build_data.runtimeAPIVersion, 2);
      assert.equal(observed.uploads.length, 0, 'Changing transport metadata cannot replace an already cached digest');
      assert.equal(observed.functionMetadata['f'.repeat(24)].echo.r, 'nodejs24.x');
      assert.equal(observed.functionMetadata['f'.repeat(24)].echo.im, null);
    });
    assert.equal(sha256(await fs.readFile(path.join(oldPayload, '.netlify-fn-build/echo.zip'))), oldDigest);
    const preparedPath = await bundlePreparedFunctions(source, { cliRoot });
    const prepared = JSON.parse(await fs.readFile(preparedPath));
    const digest = sha256(await fs.readFile(prepared.functions[0].path));
    assert.notEqual(digest, oldDigest, 'Runtime identity must be part of the actual archive bytes');
    const inspect = async fn => {
      const extracted = path.join(root, `inspected-${fn.timeout}`);
      await extractZip(fn.path, { dir: extracted });
      assert.equal(await fs.readFile(path.join(extracted, 'assets/fixture.txt'), 'utf8'), 'required ordinary include');
      assert.equal(JSON.parse(await fs.readFile(path.join(extracted, '.netlify-runtime-contracts/echo.json'))).timeout, fn.timeout);
    };
    await inspect(prepared.functions[0]);
    await fs.writeFile(receiptFile, JSON.stringify(initial));
    await withNetlifyCLI({ root, cliRoot, functionCache }, async ({ run, observed }) => {
      const preview = await uploadPreparedPayload({ directory: source, checkoutDirectory: root, run });
      const previewReceipt = JSON.parse(await fs.readFile(receiptFile));
      await fs.writeFile(receiptFile, JSON.stringify({ ...previewReceipt, stage: 'production_requested' }));
      const production = await uploadPreparedPayload({ directory: source, checkoutDirectory: root, mode: 'production', cachePath: preview.cachePath, run });
      assert.equal(observed.uploads.length, 1, 'Only the new contract hash requires upload; production reuses its correct metadata');
      assert.equal(observed.uploads[0].parameters.runtime, 'nodejs22.x');
      assert.equal(observed.uploads[0].parameters.invocation_mode, 'stream');
      assert.equal(observed.uploads[0].parameters.timeout, '300');
      for (const id of [preview.result.deploy_id, production.result.deploy_id]) {
        assert.equal(observed.functionMetadata[id].echo.d, digest);
        assert.equal(observed.functionMetadata[id].echo.r, 'nodejs22.x');
        assert.equal(observed.functionMetadata[id].echo.im, 'stream');
      }
      for (const field of ['files', 'functions', 'functions_config', 'function_schedules']) assert.deepEqual(observed.updates[0][field], observed.updates[1][field]);
      assert.equal(JSON.parse(await fs.readFile(receiptFile)).upload_fingerprint, previewReceipt.upload_fingerprint);
    });
    // Repeat in the same checkout: esbuild embeds source-path comments, so
    // differently named checkouts need not yield the same pre-existing code bytes.
    for (const timeout of [300, 301]) {
      for (const name of ['.netlify-fn-build', '.netlify-runtime-contracts', '.netlify']) {
        const generated = path.join(source, name);
        assert.equal(path.dirname(generated), source);
        await fs.rm(generated, { recursive: true, force: true });
      }
      if (timeout === 301) await fs.writeFile(path.join(source, 'netlify.toml'), (await fs.readFile(path.join(source, 'netlify.toml'), 'utf8')).replace('timeout=300', 'timeout=301'));
      const rebuilt = JSON.parse(await fs.readFile(await bundlePreparedFunctions(source, { cliRoot })));
      const rebuiltDigest = sha256(await fs.readFile(rebuilt.functions[0].path));
      if (timeout === 300) assert.equal(rebuiltDigest, digest, 'Same source and metadata produce identical ZIP hashes');
      else assert.notEqual(rebuiltDigest, digest, 'A timeout-only change changes the real ZIP hash');
      await inspect(rebuilt.functions[0]);
    }
  } finally {
    assert.equal(path.dirname(root), path.resolve(os.tmpdir()));
    await fs.rm(root, { recursive: true, force: true });
  }
});

test('source includedFiles overrides fail closed if they omit the required contract', async () => {
  const cliRoot = process.env.NETLIFY_CLI_ROOT;
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'boltcall-source-include-'));
  try {
    await fs.mkdir(path.join(root, 'netlify/functions'), { recursive: true });
    await fs.writeFile(path.join(root, 'package.json'), '{"type":"module"}');
    await fs.writeFile(path.join(root, 'netlify.toml'), '[functions]\ndirectory="netlify/functions"\nnode_bundler="esbuild"\n');
    await fs.writeFile(path.join(root, 'netlify/functions/fixture.txt'), 'source include stays intact');
    await fs.writeFile(path.join(root, 'netlify/functions/example.js'), 'throw Error("Never execute");\nexport default async()=>new Response("ok");\nexport const config={includedFiles:["fixture.txt"]};\n');
    await assert.rejects(bundlePreparedFunctions(root, { cliRoot }), /missing its runtime contract/);
    const { extractZip } = await import(pathToFileURL(path.join(cliRoot, 'dist/utils/zip.js')));
    const extracted = path.join(root, 'inspected');
    await extractZip(path.join(root, '.netlify-fn-build/example.zip'), { dir: extracted });
    assert.equal(await fs.readFile(path.join(extracted, 'netlify/functions/fixture.txt'), 'utf8'), 'source include stays intact');
  } finally {
    assert.equal(path.dirname(root), path.resolve(os.tmpdir()));
    await fs.rm(root, { recursive: true, force: true });
  }
});
