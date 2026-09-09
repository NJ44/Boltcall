import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { randomUUID } from 'node:crypto';

export const NETLIFY_CLI_VERSION = '26.2.0';
export async function loadNetlifyToolchain(cliRoot = process.env.NETLIFY_CLI_ROOT) {
  if (!cliRoot) throw Error('Pinned NETLIFY_CLI_ROOT is required');
  const packagePath = path.resolve(cliRoot, 'package.json');
  if (JSON.parse(await fs.readFile(packagePath)).version !== NETLIFY_CLI_VERSION) throw Error('Unexpected Netlify CLI version');
  const require = createRequire(packagePath);
  const { resolveConfig } = await import(pathToFileURL(require.resolve('@netlify/config')));
  const { zipFunctions } = await import(pathToFileURL(require.resolve('@netlify/zip-it-and-ship-it')));
  const { normalizeFunctionsConfig } = await import(pathToFileURL(path.resolve(cliRoot, 'dist/lib/functions/config.js')));
  return { resolveConfig, zipFunctions, normalizeFunctionsConfig };
}

export async function bundlePreparedFunctions(root = process.cwd(), { cliRoot } = {}) {
  root = await fs.realpath(root);
  const { resolveConfig, zipFunctions, normalizeFunctionsConfig } = await loadNetlifyToolchain(cliRoot);
  // Offline config resolution and static bundling never invoke application handlers.
  const { config, buildDir, configPath } = await resolveConfig({ cwd: root, repositoryRoot: root,
    config: path.join(root, 'netlify.toml'), context: 'production', mode: 'build', offline: true, logs: {} });
  if (path.resolve(buildDir) !== root || path.resolve(configPath) !== path.join(root, 'netlify.toml') ||
      await fs.realpath(config.functionsDirectory) !== path.join(root, 'netlify/functions')) throw Error('Function configuration escaped the prepared repository');
  const functionsConfig = normalizeFunctionsConfig({ functionsConfig: config.functions, projectRoot: root,
    siteEnv: { AWS_LAMBDA_JS_RUNTIME: 'nodejs22.x' } });
  for (const [pattern, value] of Object.entries(config.functions)) {
    // CLI 26 normalizes schedules but omits TOML timeouts; ZISI supports them.
    if (value.timeout !== undefined) functionsConfig[pattern].timeout = value.timeout;
    for (const file of value.included_files || []) {
      const relative = path.relative(root, path.resolve(root, file.replace(/^!/, '')));
      if (relative.startsWith('..') || path.isAbsolute(relative)) throw Error('Function include escaped the prepared repository');
    }
  }
  const destination = path.join(root, '.netlify-fn-build');
  await fs.mkdir(destination);
  await zipFunctions(path.join(root, 'netlify/functions'), destination, { basePath: root, config: functionsConfig });
  return path.join(destination, 'manifest.json');
}

export async function materializeFunctionCache(root, { now = Date.now() } = {}) {
  root = await fs.realpath(root);
  const directory = path.join(root, '.netlify-fn-build');
  if ((await fs.lstat(directory)).isSymbolicLink() || await fs.realpath(directory) !== directory) throw Error('Function archive directory escaped the verified payload');
  const manifestPath = path.join(directory, 'manifest.json');
  const stat = await fs.lstat(manifestPath);
  if (!stat.isFile() || stat.size > 2000000) throw Error('Invalid prepared function manifest');
  const manifest = JSON.parse(await fs.readFile(manifestPath));
  if (manifest.version !== 1 || !Number.isFinite(manifest.timestamp) || !Array.isArray(manifest.functions) ||
      !manifest.functions.length || manifest.functions.length > 1000) throw Error('Invalid prepared function manifest');
  const names = new Set();
  const functions = [];
  for (const fn of manifest.functions) {
    const original = typeof fn.path === 'string' ? fn.path.replaceAll('\\', '/') : '';
    if (!/^[a-zA-Z0-9_-]+$/.test(fn.name || '') || names.has(fn.name) || original.split('/').includes('..') ||
        !original.endsWith(`/.netlify-fn-build/${fn.name}.zip`) || fn.runtime !== 'js' ||
        ![1, 2].includes(fn.buildData?.runtimeAPIVersion) ||
        (fn.buildData.runtimeAPIVersion === 2 && (!['stream', 'background'].includes(fn.invocationMode) || !/^nodejs\d+\.x$/.test(fn.runtimeVersion || '')))) {
      throw Error('Invalid prepared function identity or runtime metadata');
    }
    names.add(fn.name);
    const archive = path.join(directory, `${fn.name}.zip`);
    if (!(await fs.lstat(archive)).isFile() || await fs.realpath(archive) !== archive) throw Error('Function archive escaped the verified payload');
    functions.push({ ...fn, path: archive });
  }
  const entries = await fs.readdir(directory);
  if (entries.length !== names.size + 1 || entries.some(name => name !== 'manifest.json' && !names.has(name.slice(0, -4)))) throw Error('Prepared function archives do not match their manifest');
  const cacheDirectory = path.join(root, '.netlify/functions');
  // The verified payload allows no .netlify directory. Refuse pre-existing caches.
  await fs.mkdir(path.join(root, '.netlify'));
  await fs.mkdir(cacheDirectory);
  const cachePath = path.join(cacheDirectory, 'manifest.json');
  await fs.writeFile(cachePath, `${JSON.stringify({ ...manifest, timestamp: now, functions })}\n`, { flag: 'wx' });
  return cachePath;
}

export async function withFreshFunctionCache(cachePath, operation, { intervalMs = 30000 } = {}) {
  if (!Number.isSafeInteger(intervalMs) || intervalMs < 1 || intervalMs > 30000) throw Error('Invalid function cache refresh interval');
  const template = JSON.parse(await fs.readFile(cachePath));
  const fingerprint = value => JSON.stringify({ ...value, timestamp: 0 });
  const expected = fingerprint(template);
  const temporary = `${cachePath}.${randomUUID()}.tmp`;
  const controller = new AbortController();
  let pending = Promise.resolve(), refreshError, timer;
  const refresh = () => {
    pending = pending.then(async () => {
      if (refreshError) return;
      try {
        if (!(await fs.lstat(cachePath)).isFile() || fingerprint(JSON.parse(await fs.readFile(cachePath))) !== expected) throw Error('Function cache metadata changed');
        await fs.writeFile(temporary, `${JSON.stringify({ ...template, timestamp: Date.now() })}\n`, { flag: 'wx' });
        await fs.rename(temporary, cachePath);
      } catch {
        refreshError = Error('Function cache freshness could not be preserved; stop deployment and inspect its receipt');
        controller.abort(refreshError);
      }
    });
    return pending;
  };
  try {
    await refresh();
    if (refreshError) throw refreshError;
    timer = setInterval(() => { void refresh(); }, intervalMs);
    const result = await operation(controller.signal);
    await pending;
    if (refreshError) throw refreshError;
    return result;
  } catch (error) {
    throw refreshError || error;
  } finally {
    clearInterval(timer);
    await pending;
    await fs.unlink(temporary).catch(error => { if (error.code !== 'ENOENT') throw error; });
  }
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  if (process.argv[2] !== 'bundle') throw Error('Unknown function preparation operation');
  await bundlePreparedFunctions();
}
