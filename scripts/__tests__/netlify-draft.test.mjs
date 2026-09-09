import { describe, it, expect } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { assertDraftArguments, draftOnlySource, runDraftCLI } from '../netlify-draft.mjs';

describe('pinned draft subprocess guard', () => {
  it('accepts only the prepared draft command', () => {
    expect(() => assertDraftArguments(['deploy', '--draft', '--no-build', `--cwd=${path.resolve('payload')}`,
      '--dir=dist', '--functions=.netlify-fn-build', '--timeout=600', '--json', '--message', 'fixture'])).not.toThrow();
  });
  it.each([
    ['deploy', '--no-build'], ['deploy', '--draft'], ['deploy', '--draft', '--no-build', '--prod'],
    ['deploy', '--draft', '--no-build', '--prod=true'], ['deploy', '--draft', '--no-build', '--prod-if-unlocked'],
    ['deploy', '--draft', '--no-build', '-p'], ['deploy', '--draft', '--no-build', '--alias=production'],
    ['deploy', '--draft', '--no-build', '--cwd=relative'],
    ['deploy', '--message', '--draft', '--no-build'],
  ])('refuses unsafe arguments %j', (...args) => {
    expect(() => assertDraftArguments(args)).toThrow();
  });
  it('refuses a changed vendor module', () => {
    expect(() => draftOnlySource(Buffer.from('draft = false'))).toThrow(/module hash/);
  });
  it('allows only the explicit production command in production mode', () => {
    expect(() => assertDraftArguments(['deploy', '--prod', '--no-build'], 'production')).not.toThrow();
    for (const flags of [['--draft'], ['--prod', '--draft'], ['--prod-if-unlocked'], ['--prod', '--alias=live'], ['--prod', '--build']]) {
      expect(() => assertDraftArguments(['deploy', '--no-build', ...flags], 'production')).toThrow();
    }
  });
  it('refuses an unexpected CLI version before importing its code', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'boltcall-cli-version-'));
    try {
      await fs.writeFile(path.join(root, 'package.json'), JSON.stringify({ name: 'netlify-cli', version: '26.2.1' }));
      await expect(runDraftCLI(['deploy', '--draft', '--no-build'], root)).rejects.toThrow(/CLI version/);
    } finally { await fs.rm(root, { recursive: true, force: true }); }
  });
});
