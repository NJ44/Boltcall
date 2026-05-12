export async function detectCountryCode(): Promise<string | null> {
  try {
    const res = await fetch('https://ip-api.com/json/?fields=countryCode', {
      signal: AbortSignal.timeout(2000),
    });
    const data = await res.json();
    return typeof data.countryCode === 'string' ? data.countryCode : null;
  } catch {
    return null;
  }
}
