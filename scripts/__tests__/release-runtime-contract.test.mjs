import { describe, expect, it } from 'vitest';
import { runtimeContractBytes } from '../release-runtime-contract.mjs';

const functionMetadata = () => ({ name: 'fixture', runtime: 'js', runtimeVersion: 'nodejs22.x', invocationMode: 'stream',
  buildData: { runtimeAPIVersion: 2, bootstrapVersion: '2.16.0' }, timeout: 300 });

describe('prepared runtime identity', () => {
  it('is stable across bookkeeping changes without including paths, hashes or release identity', () => {
    const original = functionMetadata(), before = structuredClone(original);
    expect(runtimeContractBytes({ ...original, timestamp: 1, path: '/one/fixture.zip', digest: 'old', release_id: 'one' }))
      .toEqual(runtimeContractBytes({ ...original, timestamp: 2, path: '/two/fixture.zip', digest: 'new', release_id: 'two' }));
    expect(original).toEqual(before);
    expect(runtimeContractBytes(original).toString()).not.toMatch(/timestamp|path|digest|release/);
  });
  it.each([
    ['legacy API', fn => { fn.buildData.runtimeAPIVersion = 1; }],
    ['missing invocation mode', fn => { delete fn.invocationMode; }],
    ['missing runtime', fn => { delete fn.runtimeVersion; }],
    ['invalid timeout', fn => { fn.timeout = -1; }],
    ['invalid function name', fn => { fn.name = '../other'; }],
  ])('refuses %s before packaging', (_, change) => {
    const fn = functionMetadata();
    change(fn);
    expect(() => runtimeContractBytes(fn)).toThrow('Invalid prepared runtime contract');
  });
  it('distinguishes a configured timeout from the platform default', () => {
    const fn = functionMetadata(), configured = runtimeContractBytes(fn);
    delete fn.timeout;
    expect(runtimeContractBytes(fn)).not.toEqual(configured);
    expect(JSON.parse(runtimeContractBytes(fn)).timeout).toBeNull();
  });
});
