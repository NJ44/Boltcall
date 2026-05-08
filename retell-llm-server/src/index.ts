import express from 'express';
import { createServer } from 'http';
import type { IncomingMessage } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import type { RetellRequest, RetellResponse } from './types.js';
import { streamChatCompletion } from './llm-client.js';
import { loadSession, getSession, clearSession } from './retell-session.js';

const app = express();
const server = createServer(app);

// Log every WebSocket upgrade — diagnostic only
server.on('upgrade', (req: IncomingMessage) => {
  console.log(`[retell-llm-server] HTTP upgrade path=${req.url}`);
});

// perMessageDeflate:false — Retell WS client compatibility
const wss = new WebSocketServer({ server, perMessageDeflate: false });

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() });
});

function toText(raw: Buffer | ArrayBuffer | Buffer[]): string {
  if (Array.isArray(raw)) return Buffer.concat(raw as Buffer[]).toString('utf8');
  if (raw instanceof ArrayBuffer) return Buffer.from(raw).toString('utf8');
  return (raw as Buffer).toString('utf8');
}

// Extract call_id from path: /llm-websocket/{call_id}
function callIdFromPath(url: string | undefined): string | null {
  if (!url) return null;
  const parts = url.split('/');
  const id = parts[parts.length - 1];
  return id && id.startsWith('call_') ? id : null;
}

async function getAgentIdFromRetell(callId: string): Promise<string | null> {
  const apiKey = process.env.RETELL_API_KEY;
  if (!apiKey) { console.warn('[retell-llm-server] RETELL_API_KEY not set, cannot look up agent'); return null; }
  try {
    const res = await fetch(`https://api.retellai.com/v2/get-call/${callId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) {
      console.warn(`[retell-llm-server] Retell API ${res.status} for call ${callId}`);
      return null;
    }
    const data = await res.json() as { agent_id?: string };
    return data.agent_id ?? null;
  } catch (err) {
    console.error('[retell-llm-server] Retell API fetch error:', err);
    return null;
  }
}

wss.on('connection', (ws: WebSocket, req) => {
  const callId = callIdFromPath(req.url);
  console.log(`[retell-llm-server] WebSocket connected path=${req.url} callId=${callId}`);

  // ── Bootstrap session immediately on connect — don't wait for call_details ──
  // Retell does not reliably send call_details first; get agent_id via REST API.
  (async () => {
    try {
      const agentId = await getAgentIdFromRetell(callId ?? '');
      console.log(`[retell-llm-server] Retell agent_id=${agentId}`);

      const session = await loadSession(callId ?? 'fallback', agentId ?? '');
      console.log(`[retell-llm-server] session loaded, begin="${session.beginMessage.slice(0, 60)}"`);

      if (ws.readyState === WebSocket.OPEN) {
        const greet: RetellResponse = {
          response_id: 0,
          content: session.beginMessage,
          content_complete: true,
          end_call: false,
        };
        ws.send(JSON.stringify(greet));
        console.log('[retell-llm-server] begin_message sent');
      } else {
        console.warn('[retell-llm-server] ws closed before begin_message could be sent');
      }
    } catch (err) {
      console.error('[retell-llm-server] bootstrap error:', err);
    }
  })();

  ws.on('message', async (raw, isBinary) => {
    const text = toText(raw as Buffer | ArrayBuffer | Buffer[]);
    console.log(`[retell-llm-server] msg isBinary=${isBinary} len=${text.length} preview=${text.slice(0, 80)}`);

    let msg: RetellRequest;
    try {
      msg = JSON.parse(text);
    } catch {
      console.error('[retell-llm-server] JSON parse failed:', text.slice(0, 200));
      return;
    }

    console.log(`[retell-llm-server] msg type=${msg.interaction_type}`);

    // call_details: already handled via REST API above — skip
    if (msg.interaction_type === 'call_details') {
      console.log('[retell-llm-server] call_details received (session already loaded via REST API)');
      return;
    }

    // update_only: no response expected
    if (msg.interaction_type === 'update_only') return;

    // response_required / reminder_required: stream a response
    const session = getSession(callId ?? 'fallback');
    if (!session) {
      console.warn(`[retell-llm-server] no session for callId=${callId}`);
      return;
    }

    console.log(`[retell-llm-server] streaming for response_id=${msg.response_id}`);
    try {
      let chunkSent = false;
      for await (const chunk of streamChatCompletion(session.systemPrompt, msg.transcript)) {
        chunkSent = true;
        const partial: RetellResponse = {
          response_id: msg.response_id,
          content: chunk,
          content_complete: false,
          end_call: false,
        };
        ws.send(JSON.stringify(partial));
      }

      const final: RetellResponse = {
        response_id: msg.response_id,
        content: chunkSent ? '' : 'One moment, how can I help you?',
        content_complete: true,
        end_call: false,
      };
      ws.send(JSON.stringify(final));
      console.log(`[retell-llm-server] stream complete, chunks=${chunkSent}`);
    } catch (err) {
      console.error('[retell-llm-server] stream error:', err);
      const fallback: RetellResponse = {
        response_id: msg.response_id,
        content: 'I apologize, please give me just a moment.',
        content_complete: true,
        end_call: false,
      };
      ws.send(JSON.stringify(fallback));
    }
  });

  ws.on('close', (code, reason) => {
    console.log(`[retell-llm-server] WebSocket closed callId=${callId} code=${code} reason=${reason?.toString() || ''}`);
    if (callId) clearSession(callId);
  });

  ws.on('error', (err) => {
    console.error('[retell-llm-server] ws error:', err);
    if (callId) clearSession(callId);
  });
});

const PORT = parseInt(process.env.PORT ?? '8080', 10);
server.listen(PORT, () => {
  console.log(`[retell-llm-server] Listening on :${PORT}`);
});
