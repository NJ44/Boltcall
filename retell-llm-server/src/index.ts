import express from 'express';
import { createServer } from 'http';
import type { IncomingMessage } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import type { RetellRequest, RetellResponse } from './types.js';
import { streamChatCompletion } from './llm-client.js';
import { loadSession, getSession, clearSession } from './retell-session.js';

const app = express();
const server = createServer(app);

// Log every WebSocket upgrade before ws library handles it — reveals Retell's headers
server.on('upgrade', (req: IncomingMessage) => {
  console.log(`[retell-llm-server] HTTP upgrade path=${req.url}`);
  console.log(`[retell-llm-server] upgrade headers=${JSON.stringify(req.headers)}`);
});

// perMessageDeflate:false — Retell's WS client has compatibility issues with deflate
const wss = new WebSocketServer({ server, perMessageDeflate: false });

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() });
});

function toText(raw: Buffer | ArrayBuffer | Buffer[]): string {
  if (Array.isArray(raw)) return Buffer.concat(raw as Buffer[]).toString('utf8');
  if (raw instanceof ArrayBuffer) return Buffer.from(raw).toString('utf8');
  return (raw as Buffer).toString('utf8');
}

wss.on('connection', (ws: WebSocket, req) => {
  let callId: string | null = null;
  console.log(`[retell-llm-server] WebSocket connected path=${req.url}`);

  ws.on('message', async (raw, isBinary) => {
    const text = toText(raw as Buffer | ArrayBuffer | Buffer[]);
    console.log(`[retell-llm-server] raw msg isBinary=${isBinary} len=${text.length} preview=${text.slice(0, 120)}`);

    let msg: RetellRequest;
    try {
      msg = JSON.parse(text);
    } catch {
      console.error('[retell-llm-server] JSON parse failed:', text.slice(0, 200));
      return;
    }

    console.log(`[retell-llm-server] msg type=${msg.interaction_type} call_id=${(msg as any).call?.call_id ?? callId}`);

    // ── call_details: first message Retell sends — load prompt, send greeting ──
    if (msg.interaction_type === 'call_details') {
      if (!msg.call) {
        console.warn('[retell-llm-server] call_details missing .call field, raw:', text.slice(0, 500));
        return;
      }
      callId = msg.call.call_id;
      const agentId = msg.call.agent_id;
      console.log(`[retell-llm-server] call_details agent=${agentId} call=${callId}`);

      const session = await loadSession(callId, agentId);
      console.log(`[retell-llm-server] session loaded, begin="${session.beginMessage.slice(0, 60)}"`);

      const greet: RetellResponse = {
        response_id: 0,
        content: session.beginMessage,
        content_complete: true,
        end_call: false,
      };
      ws.send(JSON.stringify(greet));
      console.log('[retell-llm-server] begin_message sent');
      return;
    }

    // ── update_only: transcript update, no response expected ──
    if (msg.interaction_type === 'update_only') return;

    // ── response_required / reminder_required: generate and stream response ──
    if (!callId) { console.warn('[retell-llm-server] response_required but no callId'); return; }
    const session = getSession(callId);
    if (!session) { console.warn(`[retell-llm-server] no session for ${callId}`); return; }

    console.log(`[retell-llm-server] streaming response for response_id=${msg.response_id}`);
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
      console.log(`[retell-llm-server] stream complete, chunks_sent=${chunkSent}`);
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
    console.log(`[retell-llm-server] WebSocket closed call=${callId} code=${code} reason=${reason?.toString() || ''}`);
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
