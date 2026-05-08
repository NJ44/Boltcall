import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import type { RetellRequest, RetellResponse } from './types.js';
import { streamChatCompletion } from './llm-client.js';
import { loadSession, getSession, clearSession } from './retell-session.js';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/llm-websocket' });

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() });
});

wss.on('connection', (ws: WebSocket) => {
  let callId: string | null = null;
  console.log('[retell-llm-server] WebSocket connected');

  ws.on('message', async (raw) => {
    let req: RetellRequest;
    try {
      req = JSON.parse(raw.toString());
    } catch {
      console.error('[retell-llm-server] failed to parse message:', raw.toString().slice(0, 200));
      return;
    }

    console.log(`[retell-llm-server] msg type=${req.interaction_type} call_id=${(req as any).call?.call_id ?? callId}`);

    // ── call_details: first message Retell sends — load prompt, send greeting ──
    if (req.interaction_type === 'call_details') {
      if (!req.call) {
        console.warn('[retell-llm-server] call_details missing .call field, raw:', raw.toString().slice(0, 500));
        return;
      }
      callId = req.call.call_id;
      const agentId = req.call.agent_id;
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

    // ── update_only: transcript update with no response expected ──
    if (req.interaction_type === 'update_only') return;

    // ── response_required / reminder_required: generate and stream response ──
    if (!callId) { console.warn('[retell-llm-server] response_required but no callId'); return; }
    const session = getSession(callId);
    if (!session) { console.warn(`[retell-llm-server] no session for ${callId}`); return; }

    console.log(`[retell-llm-server] streaming response for response_id=${req.response_id}`);
    try {
      let chunkSent = false;

      for await (const chunk of streamChatCompletion(session.systemPrompt, req.transcript)) {
        chunkSent = true;
        const partial: RetellResponse = {
          response_id: req.response_id,
          content: chunk,
          content_complete: false,
          end_call: false,
        };
        ws.send(JSON.stringify(partial));
      }

      const final: RetellResponse = {
        response_id: req.response_id,
        content: chunkSent ? '' : 'One moment, how can I help you?',
        content_complete: true,
        end_call: false,
      };
      ws.send(JSON.stringify(final));
      console.log(`[retell-llm-server] stream complete, chunks_sent=${chunkSent}`);
    } catch (err) {
      console.error('[retell-llm-server] stream error:', err);
      const fallback: RetellResponse = {
        response_id: req.response_id,
        content: 'I apologize, please give me just a moment.',
        content_complete: true,
        end_call: false,
      };
      ws.send(JSON.stringify(fallback));
    }
  });

  ws.on('close', () => {
    console.log(`[retell-llm-server] WebSocket closed call=${callId}`);
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
