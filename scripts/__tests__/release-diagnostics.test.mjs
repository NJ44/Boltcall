import { describe, it, expect } from 'vitest';
import { netlifyFailureDiagnostic } from '../release-diagnostics.mjs';

describe('structured Netlify failure diagnostics', () => {
  it('allows only status, code and redacted message from the response', () => {
    const diagnostic = netlifyFailureDiagnostic({ status: 422, json: { code: 'FUNCTION_TIMEOUT_LIMIT',
      message: 'Upload refused; token=hidden-token; known-secret', headers: { Authorization: 'Bearer hidden-header' } },
      request: { body: 'hidden-request', env: 'hidden-env' }, stack: 'hidden-stack' }, { NETLIFY_AUTH_TOKEN: 'known-secret' });
    expect(diagnostic).toEqual({ status: 422, code: 'FUNCTION_TIMEOUT_LIMIT', message: 'Upload refused; token=[REDACTED]; [REDACTED]' });
  });
  it('does not stringify arbitrary response objects', () => {
    expect(netlifyFailureDiagnostic({ status: 'hidden', json: { message: { secret: 'hidden' }, code: { secret: 'hidden' } } }, {})).toEqual({});
  });
  it('bounds the selected message and retains the final reason', () => {
    const result = netlifyFailureDiagnostic({ status: 502, message: `${'x'.repeat(3000)} connection closed` }, {});
    expect(result.message.length).toBe(2000);
    expect(result.message).toMatch(/connection closed$/);
  });
});
