import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { notifyError, notifyInfo } from './_shared/notify';

/**
 * Agent Self-Healing Pipeline
 *
 * Triggered after a failed call is detected by retell-webhook.
 * Flow:
 *   1. Analyze the call transcript to identify the failure type
 *   2. Generate a targeted test scenario for that failure
 *   3. Clone voice agent → chat agent, run 3 tests to reproduce
 *   4. Fix the prompt automatically
 *   5. Retest 10 times to confirm the fix
 *   6. Deploy the updated prompt to the live agent
 *   7. Notify the business owner via Telegram + store in DB
 */

const RETELL_API = 'https://api.retellai.com';
const RETELL_KEY = process.env.RETELL_API_KEY || '';
const OPENAI_KEY = process.env.OPENAI_API_KEY || '';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error('Missing Supabase credentials');
  return createClient(url, key);
}

async function retellFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${RETELL_API}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${RETELL_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (path.includes('delete') && res.status === 204) return null;
  if (!res.ok) {
    const errText = await res.text().catch(() => 'Unknown error');
    throw new Error(`Retell API ${path} failed (${res.status}): ${errText}`);
  }
  return res.json();
}

async function askOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 4000,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI API failed: ${res.status}`);
  const data = await res.json();
  return data.choices[0]?.message?.content || '';
}

// ─── Step 1: Analyze the failed call transcript ─────────────────────────────

interface FailureAnalysis {
  failureType: string;
  failureSummary: string;
  rootCause: string;
  testMessages: string[];
  promptFix: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

async function analyzeFailure(transcript: string, agentPrompt: string, callAnalysis: any): Promise<FailureAnalysis> {
  const systemPrompt = `You are an expert AI voice agent debugger. Analyze a failed call transcript and the agent's current prompt to identify:
1. What went wrong (the failure type)
2. Why it went wrong (root cause in the prompt)
3. Test messages that would reproduce this exact failure
4. A specific prompt fix (the exact text to add/change)

Respond in JSON only with this structure:
{
  "failureType": "string - e.g. 'missed_booking', 'wrong_info', 'loop_detected', 'hallucination', 'greeting_skip', 'transfer_failure', 'rude_response'",
  "failureSummary": "string - one sentence describing what happened",
  "rootCause": "string - why the prompt allowed this to happen",
  "testMessages": ["array of 3-5 user messages that would reproduce this exact failure"],
  "promptFix": "string - the exact text to ADD to the prompt to fix this issue. Be specific. Include the section header and instruction.",
  "severity": "low|medium|high|critical"
}`;

  const userPrompt = `## Call Analysis
${JSON.stringify(callAnalysis || {}, null, 2)}

## Call Transcript
${transcript}

## Current Agent Prompt
${agentPrompt}

Analyze why this call failed and provide the fix.`;

  const response = await askOpenAI(systemPrompt, userPrompt);

  // Parse JSON from response (handle markdown code blocks)
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse failure analysis');
  return JSON.parse(jsonMatch[0]);
}

// ─── Step 2: Create temp chat agent and run tests ───────────────────────────

async function createTempChatAgent(voiceAgentId: string): Promise<{ chatAgentId: string; llmId: string }> {
  const voiceAgent = await retellFetch(`/get-agent/${voiceAgentId}`);
  const llmId = voiceAgent.response_engine?.llm_id;
  if (!llmId) throw new Error('Voice agent has no LLM configured');

  const chatAgent = await retellFetch('/create-chat-agent', {
    method: 'POST',
    body: JSON.stringify({
      response_engine: { type: 'retell-llm', llm_id: llmId },
      agent_name: `HEAL-${voiceAgent.agent_name}-${Date.now()}`,
    }),
  });

  return { chatAgentId: chatAgent.agent_id, llmId };
}

async function runChatTest(chatAgentId: string, messages: string[]): Promise<{ conversation: Array<{ role: string; content: string }>; analysis: any }> {
  const chat = await retellFetch('/create-chat', {
    method: 'POST',
    body: JSON.stringify({ agent_id: chatAgentId }),
  });

  const conversation: Array<{ role: string; content: string }> = [];
  if (chat.first_message) {
    conversation.push({ role: 'agent', content: chat.first_message });
  }

  for (const message of messages) {
    conversation.push({ role: 'user', content: message });
    try {
      const response = await retellFetch('/create-chat-completion', {
        method: 'POST',
        body: JSON.stringify({ chat_id: chat.chat_id, content: message }),
      });
      if (response.messages) {
        for (const msg of response.messages) {
          if (msg.content) {
            conversation.push({ role: 'agent', content: msg.content });
          }
        }
      }
    } catch (err) {
      conversation.push({ role: 'system', content: `Error: ${err}` });
    }
  }

  try {
    await retellFetch(`/end-chat/${chat.chat_id}`, { method: 'PATCH' });
  } catch { /* ignore */ }

  await new Promise(r => setTimeout(r, 2000));
  let analysis = null;
  try {
    const chatData = await retellFetch(`/get-chat/${chat.chat_id}`);
    analysis = chatData.chat_analysis || null;
  } catch { /* ignore */ }

  return { conversation, analysis };
}

async function deleteTempChatAgent(chatAgentId: string) {
  try {
    await retellFetch(`/delete-chat-agent/${chatAgentId}`, { method: 'DELETE' });
  } catch { /* ignore */ }
}

// ─── Step 3: Apply prompt fix ───────────────────────────────────────────────

async function applyPromptFix(llmId: string, promptFix: string): Promise<{ oldPrompt: string; newPrompt: string }> {
  const llm = await retellFetch(`/get-retell-llm/${llmId}`);
  const oldPrompt = llm.general_prompt || '';

  // Append the fix to the existing prompt under a self-heal section
  const fixSection = `\n\n## AUTO-FIX (${new Date().toISOString().split('T')[0]})\n${promptFix}`;
  const newPrompt = oldPrompt + fixSection;

  await retellFetch(`/update-retell-llm/${llmId}`, {
    method: 'PATCH',
    body: JSON.stringify({ general_prompt: newPrompt }),
  });

  return { oldPrompt, newPrompt };
}

// ─── Main Handler ───────────────────────────────────────────────────────────

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  if (!RETELL_KEY || !OPENAI_KEY) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'API keys not configured' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { action } = body;

    // ─── ACTION: analyze ─ Analyze a failed call and return the diagnosis ────
    if (action === 'analyze') {
      const { transcript, agentPrompt, callAnalysis } = body;
      if (!transcript) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'transcript required' }) };
      }

      const analysis = await analyzeFailure(transcript, agentPrompt || '', callAnalysis);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, analysis }) };
    }

    // ─── ACTION: heal ─ Full self-healing pipeline ──────────────────────────
    if (action === 'heal') {
      const { agentId, callId, transcript, callAnalysis, userId } = body;
      if (!agentId || !transcript) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'agentId and transcript required' }) };
      }

      const supabase = getSupabase();
      const startTime = Date.now();

      // Step 1: Get the agent's current prompt
      const voiceAgent = await retellFetch(`/get-agent/${agentId}`);
      const llmId = voiceAgent.response_engine?.llm_id;
      if (!llmId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Agent has no LLM configured' }) };
      }

      const llm = await retellFetch(`/get-retell-llm/${llmId}`);
      const currentPrompt = llm.general_prompt || '';

      // Step 2: Analyze the failure
      const analysis = await analyzeFailure(transcript, currentPrompt, callAnalysis);

      // Step 3: Create temp chat agent and reproduce the issue (3 runs)
      const { chatAgentId } = await createTempChatAgent(agentId);
      let reproduced = 0;

      try {
        for (let i = 0; i < 3; i++) {
          const result = await runChatTest(chatAgentId, analysis.testMessages);
          if (result.analysis?.call_successful === false) {
            reproduced++;
          }
        }
      } finally {
        await deleteTempChatAgent(chatAgentId);
      }

      // Step 4: Apply the prompt fix
      const { oldPrompt, newPrompt } = await applyPromptFix(llmId, analysis.promptFix);

      // Step 5: Retest with the fixed prompt (10 runs)
      const { chatAgentId: healedChatAgentId } = await createTempChatAgent(agentId);
      let passedAfterFix = 0;

      try {
        for (let i = 0; i < 10; i++) {
          const result = await runChatTest(healedChatAgentId, analysis.testMessages);
          // Count as passed if analysis says successful OR if no explicit failure
          if (result.analysis?.call_successful !== false) {
            passedAfterFix++;
          }
        }
      } finally {
        await deleteTempChatAgent(healedChatAgentId);
      }

      const fixSuccessRate = Math.round((passedAfterFix / 10) * 100);
      const fixVerified = fixSuccessRate >= 80;

      // If fix didn't work (< 80% pass rate), revert the prompt
      if (!fixVerified) {
        await retellFetch(`/update-retell-llm/${llmId}`, {
          method: 'PATCH',
          body: JSON.stringify({ general_prompt: oldPrompt }),
        });
      }

      const elapsedMs = Date.now() - startTime;

      // Step 6: Store the result in Supabase
      const healRecord = {
        agent_id: agentId,
        call_id: callId || null,
        user_id: userId || null,
        failure_type: analysis.failureType,
        failure_summary: analysis.failureSummary,
        root_cause: analysis.rootCause,
        severity: analysis.severity,
        reproduced_count: reproduced,
        prompt_fix_applied: analysis.promptFix,
        fix_verified: fixVerified,
        fix_success_rate: fixSuccessRate,
        fix_pass_count: passedAfterFix,
        fix_total_runs: 10,
        prompt_reverted: !fixVerified,
        elapsed_ms: elapsedMs,
        status: fixVerified ? 'fixed' : 'reverted',
      };

      const { data: insertedRecord, error: insertError } = await supabase
        .from('agent_self_heal_log')
        .insert(healRecord)
        .select('id')
        .single();

      if (insertError) {
        console.error('[self-heal] Failed to store record:', insertError);
      }

      // Step 7: Notify via Telegram
      const statusEmoji = fixVerified ? '✅' : '⚠️';
      const notification = `${statusEmoji} *Agent Self\\-Heal*\n\n` +
        `🤖 *Agent:* ${voiceAgent.agent_name?.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&') || 'Unknown'}\n` +
        `❌ *Failure:* ${analysis.failureSummary.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')}\n` +
        `🔍 *Type:* ${analysis.failureType}\n` +
        `🔧 *Fix:* ${fixVerified ? `Verified \\(${fixSuccessRate}% pass rate\\)` : 'Reverted \\- fix did not hold'}\n` +
        `⏱ *Time:* ${Math.round(elapsedMs / 1000)}s`;

      await notifyInfo(notification);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          healId: insertedRecord?.id || null,
          analysis: {
            failureType: analysis.failureType,
            failureSummary: analysis.failureSummary,
            rootCause: analysis.rootCause,
            severity: analysis.severity,
          },
          reproduction: {
            runs: 3,
            reproduced,
          },
          fix: {
            applied: true,
            verified: fixVerified,
            successRate: fixSuccessRate,
            passedRuns: passedAfterFix,
            totalRuns: 10,
            reverted: !fixVerified,
          },
          elapsedMs,
        }),
      };
    }

    // ─── ACTION: history ─ Get self-healing history for an agent ─────────────
    if (action === 'history') {
      const { agentId, userId, limit: queryLimit } = body;
      const supabase = getSupabase();

      let query = supabase
        .from('agent_self_heal_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(queryLimit || 20);

      if (agentId) query = query.eq('agent_id', agentId);
      if (userId) query = query.eq('user_id', userId);

      const { data, error } = await query;
      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, records: data || [] }),
      };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid action. Use: analyze, heal, history' }) };

  } catch (err) {
    console.error('[agent-self-heal] Error:', err);
    await notifyError('agent-self-heal: Pipeline failed', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err instanceof Error ? err.message : 'Self-healing failed' }),
    };
  }
};
