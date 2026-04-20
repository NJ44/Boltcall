#!/usr/bin/env node
/**
 * Build the Boltcall WordPress plugin ZIP.
 *
 * Reads version from wordpress-plugin/boltcall/boltcall.php, zips the plugin
 * directory into public/wordpress/boltcall-for-wordpress.zip (always) and
 * public/wordpress/boltcall-for-wordpress-vX.Y.Z.zip (versioned).
 *
 * Uses PowerShell's Compress-Archive on Windows, `zip` on Unix.
 */

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const pluginDir = resolve(root, 'wordpress-plugin', 'boltcall');
const outDir = resolve(root, 'public', 'wordpress');

if (!existsSync(pluginDir)) {
  console.error('[build-wp-plugin] Plugin source directory not found:', pluginDir);
  process.exit(1);
}

const mainPhp = readFileSync(resolve(pluginDir, 'boltcall.php'), 'utf8');
const versionMatch = mainPhp.match(/Version:\s*([0-9.]+)/i);
const version = versionMatch ? versionMatch[1] : '0.0.0';

mkdirSync(outDir, { recursive: true });

const stableZip = resolve(outDir, 'boltcall-for-wordpress.zip');
const versionedZip = resolve(outDir, `boltcall-for-wordpress-v${version}.zip`);

for (const z of [stableZip, versionedZip]) {
  if (existsSync(z)) rmSync(z);
}

const isWindows = process.platform === 'win32';

function zipWindows(dest) {
  const cmd = `powershell.exe -NoProfile -Command "Compress-Archive -Path '${pluginDir}' -DestinationPath '${dest}' -Force"`;
  execSync(cmd, { stdio: 'inherit' });
}

function zipUnix(dest) {
  const parent = dirname(pluginDir);
  const name = 'boltcall';
  execSync(`cd "${parent}" && zip -rq "${dest}" "${name}"`, { stdio: 'inherit' });
}

const zipper = isWindows ? zipWindows : zipUnix;

for (const dest of [stableZip, versionedZip]) {
  zipper(dest);
  console.log('[build-wp-plugin] Wrote', dest);
}

console.log(`[build-wp-plugin] Boltcall WordPress plugin v${version} built.`);
