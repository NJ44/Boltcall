export function redactReleaseOutput(value, env = process.env, limit = 6000) {
  let text = String(value);
  const secrets = Object.entries(env).filter(([key, value]) => value && /token|secret|password|passwd|auth|cookie|credential|(?:^|_)key$|private.?key|api.?key|connection.?string/i.test(key))
    .map(([, value]) => String(value)).sort((a, b) => b.length - a.length);
  for (const secret of secrets) text = text.split(secret).join('[REDACTED]');
  return text
    .replace(/(["']?(?:authorization|proxy-authorization|cookie|set-cookie)["']?\s*[:=]\s*)(?:"[^"\r\n]*"|'[^'\r\n]*'|[^\r\n"\\]*)/gi, '$1[REDACTED]')
    .replace(/(https?:\/\/)[^\s/@]+:[^\s/@]+@/gi, '$1[REDACTED]@')
    .replace(/([?&](?:token|key|api_key|access_token|signature|sig|auth|password)=)[^&#\s"'\\]+/gi, '$1[REDACTED]')
    .replace(/((?:token|secret|password|passwd|api_key)\s*["']?\s*[:=]\s*["']?)[^\s,"';}]+/gi, '$1[REDACTED]')
    .replace(/\x1b\[[0-9;]*m/g, '').trim().slice(-limit);
}

export function netlifyFailureDiagnostic(error, env = process.env) {
  const result = {};
  if (Number.isInteger(error?.status) && error.status >= 100 && error.status <= 599) result.status = error.status;
  const code = error?.json?.code ?? error?.code;
  if (typeof code === 'string' || typeof code === 'number') result.code = redactReleaseOutput(String(code), env, 100);
  const message = typeof error?.json?.message === 'string' ? error.json.message : error?.message;
  if (typeof message === 'string') result.message = redactReleaseOutput(message, env, 2000);
  return result;
}

export function reportNetlifyFailure(error) {
  try {
    // Copy only these scalar fields; never serialize the error, response headers,
    // request options, environment, stack, or nested response body.
    process.stderr.write(`NETLIFY_RELEASE_ERROR ${JSON.stringify(netlifyFailureDiagnostic(error))}\n`);
  } catch { /* Diagnostics must not interfere with the original failure/cancellation. */ }
}
