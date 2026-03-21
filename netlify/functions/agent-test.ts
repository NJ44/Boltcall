import { Handler } from '@netlify/functions';

const RETELL_API = 'https://api.retellai.com';
const RETELL_KEY = process.env.RETELL_API_KEY || '';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

// Pre-built test scenarios for local businesses
const DEFAULT_SCENARIOS = [
  {
    id: 'booking',
    name: 'Appointment Booking',
    messages: [
      "Hi, I'd like to book an appointment please",
      "Next Thursday would work",
      "My name is Sarah Thompson",
      "My number is 07700 900123",
      "sarah@email.com",
      "2pm works great, thanks"
    ],
    successCriteria: 'Agent should collect name, phone, email and book an appointment'
  },
  {
    id: 'pricing',
    name: 'Price Inquiry',
    messages: [
      "How much do you charge?",
      "Can you give me a rough estimate?",
      "That sounds reasonable. Can I book a consultation?"
    ],
    successCriteria: 'Agent should handle pricing without giving exact quotes, guide toward booking'
  },
  {
    id: 'after-hours',
    name: 'After Hours Call',
    messages: [
      "Are you guys open right now?",
      "When do you open tomorrow?",
      "Can I leave a message?"
    ],
    successCriteria: 'Agent should state business hours and offer to take a message or book for next available'
  },
  {
    id: 'angry-customer',
    name: 'Frustrated Customer',
    messages: [
      "I've been waiting for someone to call me back for 3 days!",
      "This is ridiculous, I need this sorted today",
      "Fine, when can someone actually help me?"
    ],
    successCriteria: 'Agent should empathize, apologize, and offer a solution without getting defensive'
  },
  {
    id: 'faq',
    name: 'General FAQ',
    messages: [
      "What services do you offer?",
      "Do you serve my area?",
      "How long does it usually take?"
    ],
    successCriteria: 'Agent should answer from knowledge base accurately'
  },
  {
    id: 'transfer',
    name: 'Transfer Request',
    messages: [
      "Can I speak to a real person?",
      "I need to talk to the owner",
      "It's urgent"
    ],
    successCriteria: 'Agent should acknowledge the request and either transfer or take details for callback'
  },
  {
    id: 'spam',
    name: 'Off-Topic / Spam',
    messages: [
      "Can you help me with my taxes?",
      "What's the weather like today?",
      "Tell me a joke"
    ],
    successCriteria: 'Agent should politely redirect to business services'
  },
  {
    id: 'multi-service',
    name: 'Multiple Services',
    messages: [
      "I need two things done - can you help with both?",
      "First one is urgent, second can wait",
      "Yes, book me in for the urgent one first"
    ],
    successCriteria: 'Agent should handle multiple requests and prioritize correctly'
  },
];

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
  return res.json();
}

// Step 1: Clone voice agent's LLM into a temporary chat agent
async function createTempChatAgent(voiceAgentId: string): Promise<{ chatAgentId: string; llmId: string }> {
  // Get the voice agent to find its LLM
  const voiceAgent = await retellFetch(`/get-agent/${voiceAgentId}`);
  const llmId = voiceAgent.response_engine?.llm_id;
  if (!llmId) throw new Error('Voice agent has no LLM configured');

  // Create a chat agent with the same LLM
  const chatAgent = await retellFetch('/create-chat-agent', {
    method: 'POST',
    body: JSON.stringify({
      response_engine: { type: 'retell-llm', llm_id: llmId },
      agent_name: `TEST-${voiceAgent.agent_name}-${Date.now()}`,
    }),
  });

  return { chatAgentId: chatAgent.agent_id, llmId };
}

// Step 2: Run a single test scenario
async function runScenario(chatAgentId: string, scenario: typeof DEFAULT_SCENARIOS[0]) {
  // Create a chat session
  const chat = await retellFetch('/create-chat', {
    method: 'POST',
    body: JSON.stringify({ agent_id: chatAgentId }),
  });

  const chatId = chat.chat_id;
  const conversation: Array<{ role: string; content: string }> = [];

  // Add the agent's greeting if present
  if (chat.first_message) {
    conversation.push({ role: 'agent', content: chat.first_message });
  }

  // Send each message in the scenario
  for (const message of scenario.messages) {
    conversation.push({ role: 'user', content: message });

    try {
      const response = await retellFetch('/create-chat-completion', {
        method: 'POST',
        body: JSON.stringify({ chat_id: chatId, content: message }),
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

  // End the chat
  try {
    await retellFetch(`/end-chat/${chatId}`, { method: 'PATCH' });
  } catch { /* ignore */ }

  // Get final transcript with analysis
  let analysis = null;
  try {
    // Wait briefly for post-chat analysis
    await new Promise(r => setTimeout(r, 2000));
    const chatData = await retellFetch(`/get-chat/${chatId}`);
    analysis = chatData.chat_analysis || null;
  } catch { /* ignore */ }

  return {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    chatId,
    conversation,
    analysis,
    successCriteria: scenario.successCriteria,
  };
}

// Step 3: Delete temp chat agent
async function deleteTempChatAgent(chatAgentId: string) {
  try {
    await retellFetch(`/delete-chat-agent/${chatAgentId}`, { method: 'DELETE' });
  } catch { /* ignore */ }
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  if (!RETELL_KEY) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Retell API key not configured' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { action, agentId, scenarios: customScenarios } = body;

    if (action === 'run-tests') {
      if (!agentId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'agentId is required' }) };
      }

      // Step 1: Create temp chat agent
      const { chatAgentId, llmId } = await createTempChatAgent(agentId);

      try {
        // Step 2: Run all scenarios
        const scenariosToRun = customScenarios || DEFAULT_SCENARIOS;
        const results = [];

        for (const scenario of scenariosToRun) {
          const result = await runScenario(chatAgentId, scenario);
          results.push(result);
        }

        // Step 3: Summarize
        const passed = results.filter(r => r.analysis?.call_successful === true).length;
        const failed = results.filter(r => r.analysis?.call_successful === false).length;
        const unknown = results.length - passed - failed;

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            agentId,
            llmId,
            tempChatAgentId: chatAgentId,
            summary: {
              total: results.length,
              passed,
              failed,
              unknown,
            },
            results,
          }),
        };
      } finally {
        // Step 4: Cleanup
        await deleteTempChatAgent(chatAgentId);
      }
    }

    if (action === 'run-single') {
      if (!agentId || !body.scenario) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'agentId and scenario are required' }) };
      }

      const { chatAgentId } = await createTempChatAgent(agentId);

      try {
        const result = await runScenario(chatAgentId, body.scenario);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, result }),
        };
      } finally {
        await deleteTempChatAgent(chatAgentId);
      }
    }

    if (action === 'list-scenarios') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ scenarios: DEFAULT_SCENARIOS }),
      };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid action. Use: run-tests, run-single, list-scenarios' }) };

  } catch (err) {
    console.error('Agent test error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err instanceof Error ? err.message : 'Internal error' }),
    };
  }
};
