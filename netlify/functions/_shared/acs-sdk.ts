/**
 * Azure Communication Services SDK helper.
 *
 * Implements HMAC-SHA256 auth for the ACS REST API without any extra npm packages.
 * All operations use node:crypto (built-in, no install needed).
 *
 * Required env var:
 *   ACS_CONNECTION_STRING   e.g. endpoint=https://boltcall.communication.azure.com/;accesskey=ABC123==
 *
 * ACS connection string format:
 *   endpoint=https://<resource>.communication.azure.com/;accesskey=<base64key>
 */

import { createHash, createHmac } from 'node:crypto';

// ─── Connection string ───────────────────────────────────────────────────────

export function parseAcsConnectionString(connStr: string): { endpoint: string; key: string } {
  const parts: Record<string, string> = {};
  for (const segment of connStr.split(';')) {
    const idx = segment.indexOf('=');
    if (idx === -1) continue;
    const k = segment.substring(0, idx).toLowerCase().trim();
    const v = segment.substring(idx + 1).trim();
    // accesskey may contain '=' characters — re-join if key was already seen
    if (k === 'accesskey' && parts[k]) {
      parts[k] += '=' + v;
    } else {
      parts[k] = v;
    }
  }

  const endpoint = parts['endpoint']?.replace(/\/$/, '');
  const key = parts['accesskey'];

  if (!endpoint || !key) {
    throw new Error('Invalid ACS_CONNECTION_STRING. Expected: endpoint=...;accesskey=...');
  }

  return { endpoint, key };
}

export function getAcsCredentials(): { endpoint: string; key: string } {
  const connStr = process.env.ACS_CONNECTION_STRING;
  if (!connStr) throw new Error('ACS_CONNECTION_STRING env var not set');
  return parseAcsConnectionString(connStr);
}

// ─── HMAC-SHA256 auth headers ────────────────────────────────────────────────

export function buildAcsAuthHeaders(
  method: string,
  urlStr: string,
  body: string,
  key: string,
): Record<string, string> {
  const url = new URL(urlStr);
  const host = url.host;
  const pathAndQuery = url.pathname + (url.search || '');
  const date = new Date().toUTCString();

  const contentHash = createHash('sha256').update(body, 'utf8').digest('base64');
  const stringToSign = `${method.toUpperCase()}\n${pathAndQuery}\n${date};${host};${contentHash}`;

  const keyBuffer = Buffer.from(key, 'base64');
  const signature = createHmac('sha256', keyBuffer).update(stringToSign, 'utf8').digest('base64');

  return {
    'x-ms-date': date,
    'x-ms-content-sha256': contentHash,
    Authorization: `HMAC-SHA256 SignedHeaders=x-ms-date;host;x-ms-content-sha256&Signature=${signature}`,
  };
}

// ─── SMS ─────────────────────────────────────────────────────────────────────

export interface AcsSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendAcsSms(
  from: string,
  to: string,
  message: string,
): Promise<AcsSendResult> {
  let endpoint: string;
  let key: string;
  try {
    ({ endpoint, key } = getAcsCredentials());
  } catch (e: any) {
    return { success: false, error: e.message };
  }

  const url = `${endpoint}/sms?api-version=2021-03-07`;
  const body = JSON.stringify({ from, smsRecipients: [{ to }], message });
  const authHeaders = buildAcsAuthHeaders('POST', url, body, key);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      return { success: false, error: `ACS SMS error ${res.status}: ${errText}` };
    }

    const data = await res.json();
    const result = data.value?.[0];

    if (!result?.successful) {
      return { success: false, error: result?.errorMessage || 'ACS returned unsuccessful' };
    }

    return { success: true, messageId: result.messageId };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ─── Phone numbers ───────────────────────────────────────────────────────────

const NUMBERS_API_VERSION = '2022-12-01';

export async function listAcsNumbers(): Promise<any[]> {
  const { endpoint, key } = getAcsCredentials();
  const url = `${endpoint}/phoneNumbers?api-version=${NUMBERS_API_VERSION}`;
  const authHeaders = buildAcsAuthHeaders('GET', url, '', key);

  const res = await fetch(url, { headers: { ...authHeaders } });
  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(`ACS list numbers error ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.phoneNumbers || [];
}

export async function releaseAcsNumber(phoneNumber: string): Promise<void> {
  const { endpoint, key } = getAcsCredentials();
  const encodedNumber = encodeURIComponent(phoneNumber);
  const url = `${endpoint}/phoneNumbers/${encodedNumber}?api-version=${NUMBERS_API_VERSION}`;
  const authHeaders = buildAcsAuthHeaders('DELETE', url, '', key);

  const res = await fetch(url, { method: 'DELETE', headers: { ...authHeaders } });
  if (!res.ok && res.status !== 204) {
    const err = await res.text().catch(() => '');
    throw new Error(`ACS release number error ${res.status}: ${err}`);
  }
}

/**
 * Search for available phone numbers.
 * Returns an operation ID — poll getSearchOperation() until it completes.
 */
export async function searchAcsNumbers(
  countryCode: string,
  areaCode?: string,
  quantity = 1,
): Promise<string> {
  const { endpoint, key } = getAcsCredentials();
  const url = `${endpoint}/availablePhoneNumbers/countries/${countryCode}:search?api-version=${NUMBERS_API_VERSION}`;

  const bodyObj: any = {
    phoneNumberType: 'local',
    assignmentType: 'application',
    capabilities: { sms: 'inbound+outbound', calling: 'none' },
    quantity,
  };
  if (areaCode) bodyObj.areaCode = areaCode;

  const body = JSON.stringify(bodyObj);
  const authHeaders = buildAcsAuthHeaders('POST', url, body, key);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders },
    body,
  });

  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(`ACS number search error ${res.status}: ${err}`);
  }

  // Returns 202 Accepted with Operation-Location header
  const operationId = res.headers.get('Operation-Location') || '';
  return operationId;
}

/** Purchase a phone number that was reserved via a search operation. */
export async function purchaseAcsNumbers(searchId: string): Promise<string> {
  const { endpoint, key } = getAcsCredentials();
  const url = `${endpoint}/phoneNumbers/operations/purchases?api-version=${NUMBERS_API_VERSION}`;
  const body = JSON.stringify({ searchId });
  const authHeaders = buildAcsAuthHeaders('POST', url, body, key);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders },
    body,
  });

  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(`ACS purchase numbers error ${res.status}: ${err}`);
  }

  return res.headers.get('Operation-Location') || '';
}
