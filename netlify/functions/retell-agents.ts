import { Handler } from '@netlify/functions';
import Retell from 'retell-sdk';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

// Legacy fallback prompt — used only when no prompt_config is provided
function buildAgentPrompt(businessName: string, country?: string): string {
  const basePrompt = `You are a friendly, professional AI receptionist for ${businessName}. Help callers with scheduling, answering questions, and providing information about the business. Be concise and helpful.`;
  const needsDisclosure = !country || ['us','ca','gb','uk','au','nz','il','ie','de','fr','es','it','nl','be','at','ch','se','no','dk','fi','pt','pl','cz','gr','ro','hu','bg','hr','sk','si','lt','lv','ee','lu','mt','cy','is','li'].includes(country.toLowerCase());
  if (needsDisclosure) {
    return `IMPORTANT: At the very beginning of every call, you MUST introduce yourself by saying: "Hi, thank you for calling ${businessName}. Just so you know, I'm an AI assistant here to help you." Then proceed naturally with the conversation.\n\n${basePrompt}`;
  }
  return basePrompt;
}

// Generate professional prompt via internal HTTP call to the generate-agent-prompt function
async function generateProfessionalPrompt(promptConfig: any): Promise<{ prompt: string; beginMessage: string }> {
  // Use the co-located Netlify function via internal URL
  const baseUrl = process.env.URL || process.env.DEPLOY_URL || 'https://boltcall.org';
  const response = await fetch(`${baseUrl}/.netlify/functions/generate-agent-prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(promptConfig),
  });

  if (!response.ok) {
    console.error('Prompt generation failed, falling back to legacy prompt');
    // Fallback: return a basic prompt so agent creation doesn't fail
    return {
      prompt: buildAgentPrompt(promptConfig.businessProfile?.businessName || 'this business', promptConfig.businessProfile?.country),
      beginMessage: `Hi, thanks for calling ${promptConfig.businessProfile?.businessName || 'us'}! How can I help you today?`,
    };
  }

  const data = await response.json();
  return { prompt: data.prompt, beginMessage: data.beginMessage };
}

// Default agent config — copied from agent_9a4ecdf921de328c9ba0009ff3 (Israel-Outbound)
// Applied to every new agent for consistent call quality
function getDefaultAgentConfig(language?: string) {
  const isHebrew = language?.startsWith('he');
  return {
    enable_backchannel: true,
    backchannel_words: isHebrew ? ['אהה', 'אה-אה'] : ['yeah', 'uh-huh'],
    interruption_sensitivity: 0.71,
    end_call_after_silence_ms: 175000,
    max_call_duration_ms: 481000,
    begin_message_delay_ms: 3800,
    allow_user_dtmf: true,
    post_call_analysis_model: 'gpt-4.1-mini',
  };
}

// Build the response_engine param based on what the caller provides
function buildResponseEngine(body: any) {
  // If caller provides an llm_id, use Retell LLM engine
  if (body.llm_id) {
    return {
      type: 'retell-llm' as const,
      llm_id: body.llm_id,
    };
  }
  // If caller provides a custom LLM websocket URL, use custom LLM engine
  if (body.llm_websocket_url) {
    return {
      type: 'custom-llm' as const,
      llm_websocket_url: body.llm_websocket_url,
    };
  }
  // Default: no response engine provided — caller must provide one
  return null;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const apiKey = process.env.RETELL_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Retell API key not configured' }),
    };
  }

  const client = new Retell({ apiKey });

  try {
    // GET /retell-agents — list all agents
    // GET /retell-agents?agent_id=xxx — get single agent
    if (event.httpMethod === 'GET') {
      const agentId = event.queryStringParameters?.agent_id;
      if (agentId) {
        const agent = await client.agent.retrieve(agentId);
        return { statusCode: 200, headers, body: JSON.stringify(agent) };
      }
      const agents = await client.agent.list();
      return { statusCode: 200, headers, body: JSON.stringify(agents) };
    }

    // POST /retell-agents — create agent with knowledge base
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { action } = body;

      // Create knowledge base
      if (action === 'create_kb') {
        const kb = await client.knowledgeBase.create({
          knowledge_base_name: body.knowledge_base_name,
          knowledge_base_texts: body.knowledge_base_texts,
          knowledge_base_urls: body.knowledge_base_urls || [],
        });
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            knowledge_base_id: kb.knowledge_base_id,
          }),
        };
      }

      // Create agent — auto-creates LLM if no llm_id or llm_websocket_url provided
      if (action === 'create_agent') {
        let responseEngine = buildResponseEngine(body);

        // If no response engine provided, create a Retell LLM first
        if (!responseEngine) {
          const llm = await client.llm.create({
            model: 'gpt-4o-mini',
            general_prompt: body.general_prompt || buildAgentPrompt(body.agent_name || 'this business', body.country),
            ...(body.knowledge_base_ids ? { knowledge_base_ids: body.knowledge_base_ids } : {}),
          } as any);
          responseEngine = {
            type: 'retell-llm' as const,
            llm_id: llm.llm_id,
          };
        }

        const agent = await client.agent.create({
          agent_name: body.agent_name,
          voice_id: body.voice_id || '11labs-Adrian',
          response_engine: responseEngine,
          ...getDefaultAgentConfig(body.language),
        } as any);

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            agent_id: agent.agent_id,
            agent,
          }),
        };
      }

      // Create both KB + Agent in one call
      if (action === 'create_full') {
        // Step 1: Create knowledge base
        const kb = await client.knowledgeBase.create({
          knowledge_base_name: `${body.business_name} Knowledge Base`,
          knowledge_base_texts: body.knowledge_base_texts || [],
          knowledge_base_urls: body.website_url ? [body.website_url] : [],
        });

        // Step 2: Generate professional prompt (or use legacy fallback)
        let generalPrompt: string;
        let beginMessage: string | undefined;

        if (body.prompt_config) {
          // Use the professional prompt generator
          const generated = await generateProfessionalPrompt(body.prompt_config);
          generalPrompt = generated.prompt;
          beginMessage = generated.beginMessage;
        } else if (body.general_prompt) {
          // Caller provided their own prompt
          generalPrompt = body.general_prompt;
          beginMessage = body.begin_message;
        } else {
          // Legacy fallback
          generalPrompt = buildAgentPrompt(body.business_name, body.country);
        }

        // Step 3: Determine response engine
        let responseEngine;

        if (body.llm_id) {
          responseEngine = { type: 'retell-llm' as const, llm_id: body.llm_id };
        } else if (body.llm_websocket_url) {
          responseEngine = { type: 'custom-llm' as const, llm_websocket_url: body.llm_websocket_url };
        } else {
          // Auto-create a Retell LLM linked to the knowledge base
          const llmConfig: any = {
            model: 'gpt-4o-mini',
            general_prompt: generalPrompt,
            knowledge_base_ids: [kb.knowledge_base_id],
          };
          if (beginMessage) {
            llmConfig.begin_message = beginMessage;
          }
          const llm = await client.llm.create(llmConfig);
          responseEngine = { type: 'retell-llm' as const, llm_id: llm.llm_id };
        }

        // Step 4: Create agent with the response engine + default config
        const agent = await client.agent.create({
          agent_name: `${body.business_name} AI Assistant`,
          voice_id: body.voice_id || '11labs-Adrian',
          language: body.language || 'en-US',
          response_engine: responseEngine,
          ...getDefaultAgentConfig(body.language),
        } as any);

        // Step 5: Trigger Cekura full simulation test (async — fires and returns result_id)
        let cekuraTest: { success: boolean; result_id?: number; cekura_agent_id?: number; evaluators_created?: number; total_runs?: number; error?: string } = { success: false };
        try {
          const baseUrl = process.env.URL || process.env.DEPLOY_URL || 'https://boltcall.org';
          const cekuraResponse = await fetch(`${baseUrl}/.netlify/functions/cekura-test`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'full_test',
              retell_agent_id: agent.agent_id,
              agent_name: `${body.business_name} AI Assistant`,
              business_name: body.business_name,
              phone_number: body.phone_number,
              language: body.language,
            }),
          });

          if (cekuraResponse.ok) {
            const cekuraData = await cekuraResponse.json();
            cekuraTest = {
              success: true,
              result_id: cekuraData.result_id,
              cekura_agent_id: cekuraData.cekura_agent_id,
              evaluators_created: cekuraData.evaluators_created,
              total_runs: cekuraData.total_runs,
            };
          } else {
            const cekuraErr = await cekuraResponse.json().catch(() => ({}));
            cekuraTest = { success: false, error: cekuraErr.details || cekuraErr.error || 'Cekura test failed' };
          }
        } catch (testErr) {
          console.error('Cekura test trigger failed:', testErr);
          cekuraTest = { success: false, error: testErr instanceof Error ? testErr.message : 'Cekura test trigger failed' };
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            knowledge_base_id: kb.knowledge_base_id,
            agent_id: agent.agent_id,
            agent,
            prompt_used: body.prompt_config ? 'professional' : body.general_prompt ? 'custom' : 'legacy',
            cekura_test: cekuraTest,
          }),
        };
      }

      // Create a web call for testing the agent in-browser
      if (action === 'create_web_call') {
        if (!body.agent_id) {
          return { statusCode: 400, headers, body: JSON.stringify({ error: 'agent_id required' }) };
        }
        const webCall = await client.call.createWebCall({
          agent_id: body.agent_id,
          metadata: body.metadata || {},
        });
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            call_id: webCall.call_id,
            access_token: webCall.access_token,
          }),
        };
      }

      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid action. Use: create_kb, create_agent, create_full, or create_web_call' }),
      };
    }

    // PUT /retell-agents — update agent
    if (event.httpMethod === 'PUT') {
      const body = JSON.parse(event.body || '{}');
      const { agent_id, ...updates } = body;
      if (!agent_id) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'agent_id required' }) };
      }
      const agent = await client.agent.update(agent_id, updates as any);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, agent }) };
    }

    // DELETE /retell-agents?agent_id=xxx
    if (event.httpMethod === 'DELETE') {
      const agentId = event.queryStringParameters?.agent_id;
      if (!agentId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'agent_id required' }) };
      }
      await client.agent.delete(agentId);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (error) {
    console.error('retell-agents error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Retell agent operation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
