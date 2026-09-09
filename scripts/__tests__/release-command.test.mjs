import { describe, it, expect } from 'vitest';
import { command } from '../release-workflow.mjs';

describe('release subprocess failure diagnostics', () => {
  it('retains the failing subprocess cause and status without disclosing credentials or arguments', async () => {
    const env = { ...process.env, NETLIFY_AUTH_TOKEN: 'fixture-netlify-token-123', GH_TOKEN: 'fixture-github-token-456',
      SERVICE_PASSWORD: 'fixture-service-password-789', SUPABASE_SERVICE_ROLE_KEY: 'fixture-service-role-key' };
    const script = `console.error('HTTP 422: function upload rejected');
      console.error('netlify=' + process.env.NETLIFY_AUTH_TOKEN + ' github=' + process.env.GH_TOKEN);
      console.error('password=' + process.env.SERVICE_PASSWORD);
      console.error(process.env.SUPABASE_SERVICE_ROLE_KEY);
      console.error('Authorization: Bearer unrelated-api-token');
      console.error(JSON.stringify({ Authorization: 'Bearer unrelated-json-token', 'Set-Cookie': 'session=unrelated-cookie-secret' }));
      console.error('https://user:unrelated-password@example.invalid/upload?token=unrelated-query-secret');
      process.exit(7);`;
    const error = await command(process.execPath, ['-e', script], { env }).catch(value => value);
    expect(error.message).toContain('HTTP 422: function upload rejected');
    expect(error.message).toContain('exit 7');
    expect(error.message).not.toContain('console.error');
    for (const secret of [env.NETLIFY_AUTH_TOKEN, env.GH_TOKEN, env.SERVICE_PASSWORD, env.SUPABASE_SERVICE_ROLE_KEY, 'unrelated-api-token', 'unrelated-json-token', 'unrelated-cookie-secret', 'unrelated-password', 'unrelated-query-secret']) {
      expect(error.message).not.toContain(secret);
    }
    expect(error.message).toContain('[REDACTED]');
  });
  it('bounds a verbose failure while retaining its final cause', async () => {
    const error = await command(process.execPath, ['-e', "console.error('x'.repeat(12000)); console.error('Final failure: invalid function runtime'); process.exit(1)"]).catch(value => value);
    expect(error.message).toContain('Final failure: invalid function runtime');
    expect(error.message.length).toBeLessThan(7000);
  });
});
