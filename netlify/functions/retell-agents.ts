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
    backchannel_frequency: 0.8,
    ambient_sound: 'coffee-shop',
    response_eagerness: 1,
    interruption_sensitivity: 0.71,
    end_call_after_silence_ms: 175000,
    max_call_duration_ms: 481000,
    begin_message_delay_ms: 1000,
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

// Build general_tools array for LLM creation/update
// Includes: lookup_caller, transfer_call, end_call, check_availability, book_appointment, send_sms
function buildGeneralTools(options: {
  transferNumber?: string;
  baseUrl: string;
}): any[] {
  const { transferNumber, baseUrl } = options;
  const toolsWebhookUrl = `${baseUrl}/.netlify/functions/agent-tools`;

  const tools: any[] = [
    // Custom: lookup caller — MUST be first, called at the start of every inbound call
    {
      type: 'custom',
      name: 'lookup_caller',
      description: 'Look up the caller in the customer database using their phone number. IMPORTANT: Call this tool at the very start of every inbound call before greeting the caller, using the caller phone number from the call metadata.',
      speak_after_execution: false,
      speak_during_execution: false,
      url: toolsWebhookUrl,
      parameters: {
        type: 'object' as const,
        properties: {
          phone_number: { type: 'string', description: 'The caller phone number in E.164 format' },
        },
        required: ['phone_number'],
      },
      timeout_ms: 5000,
    },
    // Built-in: end call
    {
      type: 'end_call',
      name: 'end_call',
      description: 'End the call politely. Use when the conversation is complete and the caller has no more questions.',
    },
    // Custom: check availability
    {
      type: 'custom',
      name: 'check_availability',
      description: 'Check available appointment slots for a specific date. Use when the caller wants to book an appointment and you need to find available times.',
      speak_after_execution: true,
      speak_during_execution: true,
      execution_message_description: 'Let me check what times are available for that date.',
      url: toolsWebhookUrl,
      parameters: {
        type: 'object' as const,
        properties: {
          date: { type: 'string', description: 'The date to check availability for, in YYYY-MM-DD format' },
        },
        required: ['date'],
      },
      timeout_ms: 15000,
    },
    // Custom: book appointment
    {
      type: 'custom',
      name: 'book_appointment',
      description: 'Book an appointment for the caller. Use after confirming the date, time, and service with the caller. Always confirm the details before booking.',
      speak_after_execution: true,
      speak_during_execution: true,
      execution_message_description: 'One moment while I book that appointment for you.',
      url: toolsWebhookUrl,
      parameters: {
        type: 'object' as const,
        properties: {
          name: { type: 'string', description: 'Caller full name' },
          email: { type: 'string', description: 'Caller email address' },
          phone: { type: 'string', description: 'Caller phone number' },
          date: { type: 'string', description: 'Appointment date in YYYY-MM-DD format' },
          time: { type: 'string', description: 'Appointment time in HH:MM 24-hour format' },
          service: { type: 'string', description: 'Type of service or reason for visit' },
          notes: { type: 'string', description: 'Any additional notes or special requests' },
        },
        required: ['name', 'date', 'time'],
      },
      timeout_ms: 20000,
    },
    // Custom: send SMS
    {
      type: 'custom',
      name: 'send_sms',
      description: 'Send a text message to the caller. Use to send appointment confirmations, business address, or follow-up info. Always ask permission before sending.',
      speak_after_execution: true,
      speak_during_execution: true,
      execution_message_description: 'Let me send you a text message with that information.',
      url: toolsWebhookUrl,
      parameters: {
        type: 'object' as const,
        properties: {
          phone_number: { type: 'string', description: 'Phone number to send SMS to in E.164 format' },
          message: { type: 'string', description: 'The text message content' },
        },
        required: ['phone_number', 'message'],
      },
      timeout_ms: 10000,
    },
  ];

  // Add transfer_call tool only if a transfer number is provided
  if (transferNumber) {
    tools.unshift({
      type: 'transfer_call',
      name: 'transfer_call',
      description: 'Transfer the call to a human agent or the business owner. Use when the caller explicitly asks to speak to a person, or for urgent matters you cannot handle.',
      transfer_destination: {
        type: 'predefined',
        number: transferNumber,
      },
      transfer_option: {
        type: 'warm_transfer',
        show_transferee_as_caller: true,
      },
    });
  }

  return tools;
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
      const llmId = event.queryStringParameters?.llm_id;

      if (llmId) {
        const llm = await client.llm.retrieve(llmId);
        return { statusCode: 200, headers, body: JSON.stringify(llm) };
      }
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

        const webhookBaseUrl = process.env.URL || process.env.DEPLOY_URL || 'https://boltcall.org';

        // If no response engine provided, create a Retell LLM first
        if (!responseEngine) {
          const generalTools = buildGeneralTools({
            transferNumber: body.transfer_number || '',
            baseUrl: webhookBaseUrl,
          });

          const llm = await client.llm.create({
            model: 'gpt-4.1-mini',
            general_prompt: body.general_prompt || buildAgentPrompt(body.agent_name || 'this business', body.country),
            ...(body.knowledge_base_ids ? { knowledge_base_ids: body.knowledge_base_ids } : {}),
            general_tools: generalTools,
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
          webhook_url: `${webhookBaseUrl}/.netlify/functions/retell-webhook`,
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
        const baseUrl = process.env.URL || process.env.DEPLOY_URL || 'https://boltcall.org';

        if (body.llm_id) {
          responseEngine = { type: 'retell-llm' as const, llm_id: body.llm_id };
        } else if (body.llm_websocket_url) {
          responseEngine = { type: 'custom-llm' as const, llm_websocket_url: body.llm_websocket_url };
        } else {
          // Build general_tools with transfer, availability, booking, and SMS
          const generalTools = buildGeneralTools({
            transferNumber: body.transfer_number || '',
            baseUrl,
          });

          // Auto-create a Retell LLM linked to the knowledge base
          const llmConfig: any = {
            model: 'gpt-4.1-mini',
            general_prompt: generalPrompt,
            knowledge_base_ids: [kb.knowledge_base_id],
            general_tools: generalTools,
          };
          if (beginMessage) {
            llmConfig.begin_message = beginMessage;
          }
          const llm = await client.llm.create(llmConfig);
          responseEngine = { type: 'retell-llm' as const, llm_id: llm.llm_id };
        }

        // Step 4: Create agent with the response engine + default config
        const webhookUrl = `${(process.env.URL || process.env.DEPLOY_URL || 'https://boltcall.org')}/.netlify/functions/retell-webhook`;
        const agent = await client.agent.create({
          agent_name: `${body.business_name} AI Receptionist`,
          voice_id: body.voice_id || '11labs-Adrian',
          language: body.language || 'en-US',
          response_engine: responseEngine,
          webhook_url: webhookUrl,
          ...getDefaultAgentConfig(body.language),
        } as any);

        // Step 5: Register agent in Cekura + create test scenarios (don't run yet)
        let cekuraSetup: { success: boolean; cekura_agent_id?: number; evaluators_created?: number; error?: string } = { success: false };
        try {
          const baseUrl = process.env.URL || process.env.DEPLOY_URL || 'https://boltcall.org';

          // Step 5a: Register agent in Cekura
          const registerRes = await fetch(`${baseUrl}/.netlify/functions/cekura-test`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'register_agent',
              retell_agent_id: agent.agent_id,
              agent_name: `${body.business_name} AI Receptionist`,
              phone_number: body.phone_number,
              language: body.language,
            }),
          });

          if (registerRes.ok) {
            const registerData = await registerRes.json();
            const cekuraAgentId = registerData.cekura_agent_id;

            // Step 5b: Create test evaluators (prepared, not run)
            const evalRes = await fetch(`${baseUrl}/.netlify/functions/cekura-test`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'create_evaluators',
                cekura_agent_id: cekuraAgentId,
                agent_name: `${body.business_name} AI Receptionist`,
                business_name: body.business_name,
              }),
            });

            if (evalRes.ok) {
              const evalData = await evalRes.json();
              cekuraSetup = {
                success: true,
                cekura_agent_id: cekuraAgentId,
                evaluators_created: evalData.evaluators_created,
              };
            } else {
              cekuraSetup = { success: true, cekura_agent_id: cekuraAgentId, evaluators_created: 0, error: 'Evaluator creation failed' };
            }
          } else {
            const err = await registerRes.json().catch(() => ({}));
            cekuraSetup = { success: false, error: err.details || err.error || 'Cekura registration failed' };
          }
        } catch (testErr) {
          console.error('Cekura setup failed:', testErr);
          cekuraSetup = { success: false, error: testErr instanceof Error ? testErr.message : 'Cekura setup failed' };
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
            cekura_setup: cekuraSetup,
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

      // Sync knowledge base — replace all text sources in an existing Retell KB
      if (action === 'sync_kb') {
        const { knowledge_base_id, knowledge_base_texts, knowledge_base_urls } = body;
        if (!knowledge_base_id) {
          return { statusCode: 400, headers, body: JSON.stringify({ error: 'knowledge_base_id required' }) };
        }

        if (!knowledge_base_texts?.length && !knowledge_base_urls?.length) {
          return { statusCode: 400, headers, body: JSON.stringify({ error: 'No sources to add' }) };
        }

        // Step 1: Delete all existing text sources to avoid duplicates
        const existing = await client.knowledgeBase.retrieve(knowledge_base_id);
        const textSources = (existing.knowledge_base_sources || []).filter(
          (s: any) => s.type === 'text'
        );
        for (const source of textSources) {
          try {
            await client.knowledgeBase.deleteSource(knowledge_base_id, (source as any).source_id);
          } catch (e) {
            console.error(`Failed to delete source ${(source as any).source_id}:`, e);
          }
        }

        // Step 2: Add fresh sources
        const addParams: any = {};
        if (knowledge_base_texts?.length) addParams.knowledge_base_texts = knowledge_base_texts;
        if (knowledge_base_urls?.length) addParams.knowledge_base_urls = knowledge_base_urls;

        const updated = await client.knowledgeBase.addSources(knowledge_base_id, addParams);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            knowledge_base_id: updated.knowledge_base_id,
            sources_deleted: textSources.length,
            sources_added: (knowledge_base_texts?.length || 0) + (knowledge_base_urls?.length || 0),
          }),
        };
      }

      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid action. Use: create_kb, create_agent, create_full, create_web_call, or sync_kb' }),
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
