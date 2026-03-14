import { Handler } from '@netlify/functions';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import Retell from 'retell-sdk';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
  return createClient(url, key);
}

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY || '';
  return new OpenAI({ apiKey });
}

function getRetell() {
  const apiKey = process.env.RETELL_API_KEY || '';
  return new Retell({ apiKey });
}

// ── Tool definitions for OpenAI function calling ──
const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'update_agent_greeting',
      description: 'Update the AI agent greeting message (the first thing it says when answering a call)',
      parameters: {
        type: 'object',
        properties: {
          greeting: { type: 'string', description: 'The new greeting message the agent should say' },
        },
        required: ['greeting'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_agent_prompt',
      description: 'Update the AI agent system prompt (the instructions that control how it behaves on calls). Use this when the user wants to change the agent personality, tone, behavior, or what it talks about.',
      parameters: {
        type: 'object',
        properties: {
          instructions: { type: 'string', description: 'What the user wants the agent to do differently. This will be used to modify the existing prompt.' },
        },
        required: ['instructions'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'regenerate_agent_prompt',
      description: 'Regenerate the entire agent prompt from scratch using the business profile data. Use when the user wants a fresh prompt or says the current one is broken.',
      parameters: {
        type: 'object',
        properties: {
          tone: { type: 'string', enum: ['friendly_concise', 'formal', 'playful', 'calm'], description: 'Optional tone override for the regenerated prompt' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'add_faq',
      description: 'Add a new FAQ entry to the knowledge base so the AI agent can answer this question',
      parameters: {
        type: 'object',
        properties: {
          question: { type: 'string', description: 'The question callers might ask' },
          answer: { type: 'string', description: 'The answer the AI should give' },
        },
        required: ['question', 'answer'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'add_service',
      description: 'Add a new service to the business knowledge base',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Service name' },
          duration: { type: 'number', description: 'Duration in minutes' },
          price: { type: 'number', description: 'Price in dollars' },
        },
        required: ['name'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_business_hours',
      description: 'Update business opening hours for one or more days',
      parameters: {
        type: 'object',
        properties: {
          hours: {
            type: 'object',
            description: 'Object with day names as keys. Each value has open, close (HH:MM format), and closed (boolean). Example: {"monday": {"open": "09:00", "close": "17:00", "closed": false}}',
            additionalProperties: {
              type: 'object',
              properties: {
                open: { type: 'string' },
                close: { type: 'string' },
                closed: { type: 'boolean' },
              },
            },
          },
        },
        required: ['hours'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_agent_details',
      description: 'Get the current agent configuration including prompt, greeting, voice, and status. Use this when the user asks what their agent currently does or to diagnose issues.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_call_stats',
      description: 'Get recent call statistics: total calls, average duration, successful call rate',
      parameters: {
        type: 'object',
        properties: {
          days: { type: 'number', description: 'Number of days to look back (default 7)' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'change_voice',
      description: 'Change the AI agent voice. You can use friendly names like "Adrian", "Dorothy", "Charlie" or full IDs like "11labs-Adrian".',
      parameters: {
        type: 'object',
        properties: {
          voice_id: { type: 'string', description: 'The voice name or ID (e.g. "Adrian", "Dorothy", "Charlie", or "11labs-Adrian")' },
        },
        required: ['voice_id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'toggle_agent',
      description: 'Enable or disable the AI agent. When disabled, the agent will not answer calls.',
      parameters: {
        type: 'object',
        properties: {
          enabled: { type: 'boolean', description: 'true to enable the agent, false to disable it' },
        },
        required: ['enabled'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_transfer_number',
      description: 'Set or update the phone number that calls get transferred to (e.g. your personal phone or front desk).',
      parameters: {
        type: 'object',
        properties: {
          phone_number: { type: 'string', description: 'The phone number to transfer calls to (e.g. "+1234567890")' },
        },
        required: ['phone_number'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_test_call_link',
      description: 'Generate a web call link so the user can test their AI agent directly in the browser. No parameters needed.',
      parameters: { type: 'object', properties: {} },
    },
  },
];

// ── Fetch user's business context ──
async function getBusinessContext(userId: string) {
  const supabase = getSupabase();
  const context: any = { userId };

  try {
    const { data: profile } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (profile) context.profile = profile;

    const { data: agents } = await supabase
      .from('agents')
      .select('*')
      .eq('user_id', userId)
      .limit(5);
    if (agents?.length) context.agents = agents;

    const { data: phones } = await supabase
      .from('phone_numbers')
      .select('phone_number, status, label')
      .eq('user_id', userId)
      .limit(5);
    if (phones?.length) context.phones = phones;

    // Get knowledge base entries
    const { data: kb } = await supabase
      .from('knowledge_base')
      .select('services, faqs, policies')
      .eq('user_id', userId)
      .single();
    if (kb) context.knowledgeBase = kb;
  } catch (e) {
    console.error('Error fetching context:', e);
  }

  return context;
}

function contextToString(ctx: any): string {
  const parts: string[] = [];
  if (ctx.profile) {
    parts.push(`Business: ${ctx.profile.business_name} | Industry: ${ctx.profile.main_category} | Country: ${ctx.profile.country}`);
    if (ctx.profile.website_url) parts.push(`Website: ${ctx.profile.website_url}`);
  }
  if (ctx.agents?.length) {
    parts.push(`Agents: ${ctx.agents.map((a: any) => `${a.name} [${a.agent_type}, ${a.status}] (retell_id: ${a.retell_agent_id || 'none'})`).join('; ')}`);
  }
  if (ctx.phones?.length) {
    parts.push(`Phones: ${ctx.phones.map((p: any) => `${p.phone_number} (${p.status})`).join(', ')}`);
  }
  return parts.join('\n');
}

// ── Tool execution ──
async function executeTool(name: string, args: any, ctx: any): Promise<{ result: string; actionTaken?: string }> {
  const supabase = getSupabase();
  const retell = getRetell();
  const agent = ctx.agents?.[0]; // Primary agent

  switch (name) {
    case 'update_agent_greeting': {
      if (!agent?.retell_agent_id) return { result: 'No agent found. Please complete setup first.' };

      // Get the agent to find its LLM ID
      const retellAgent = await retell.agent.retrieve(agent.retell_agent_id);
      const llmId = (retellAgent as any).response_engine?.llm_id;
      if (!llmId) return { result: 'Could not find agent LLM configuration.' };

      // Update the LLM begin_message
      await retell.llm.update(llmId, { begin_message: args.greeting } as any);

      // Also update in Supabase
      await supabase.from('agents').update({ greeting: args.greeting }).eq('id', agent.id);

      return {
        result: `Greeting updated to: "${args.greeting}"`,
        actionTaken: `Changed agent greeting to: "${args.greeting}"`,
      };
    }

    case 'update_agent_prompt': {
      if (!agent?.retell_agent_id) return { result: 'No agent found. Please complete setup first.' };

      const retellAgent = await retell.agent.retrieve(agent.retell_agent_id);
      const llmId = (retellAgent as any).response_engine?.llm_id;
      if (!llmId) return { result: 'Could not find agent LLM configuration.' };

      // Get current prompt
      const llm = await retell.llm.retrieve(llmId);
      const currentPrompt = (llm as any).general_prompt || '';

      // Use GPT to modify the prompt based on user instructions
      const openai = getOpenAI();
      const editResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a prompt editor. Given a current voice agent system prompt and user instructions, output ONLY the modified prompt. Keep the overall structure intact. Apply the requested changes precisely. Do not add commentary.',
          },
          {
            role: 'user',
            content: `Current prompt:\n\n${currentPrompt}\n\n---\nUser wants to change: ${args.instructions}\n\nOutput the modified prompt:`,
          },
        ],
        max_tokens: 3000,
        temperature: 0.3,
      });

      const newPrompt = editResponse.choices[0]?.message?.content || currentPrompt;

      // Update in Retell
      await retell.llm.update(llmId, { general_prompt: newPrompt } as any);

      // Update in Supabase
      await supabase.from('agents').update({ system_prompt: newPrompt }).eq('id', agent.id);

      return {
        result: `Prompt updated based on your instructions: "${args.instructions}"`,
        actionTaken: `Modified agent prompt: ${args.instructions}`,
      };
    }

    case 'regenerate_agent_prompt': {
      if (!agent?.retell_agent_id) return { result: 'No agent found. Please complete setup first.' };
      if (!ctx.profile) return { result: 'No business profile found.' };

      const retellAgent = await retell.agent.retrieve(agent.retell_agent_id);
      const llmId = (retellAgent as any).response_engine?.llm_id;
      if (!llmId) return { result: 'Could not find agent LLM configuration.' };

      // Call the prompt generator
      const baseUrl = process.env.URL || process.env.DEPLOY_URL || 'https://boltcall.org';
      const promptConfig = {
        agentType: agent.agent_type || 'inbound',
        businessProfile: {
          businessName: ctx.profile.business_name,
          mainCategory: ctx.profile.main_category,
          country: ctx.profile.country,
          serviceAreas: ctx.profile.service_areas || [],
          openingHours: ctx.profile.opening_hours || {},
          languages: (ctx.profile.languages || ['en']).join(', '),
          websiteUrl: ctx.profile.website_url,
          businessPhone: ctx.profile.business_phone,
          city: ctx.profile.city,
          state: ctx.profile.state,
        },
        callFlow: args.tone ? { tone: args.tone } : undefined,
        knowledgeBase: ctx.knowledgeBase || undefined,
      };

      const response = await fetch(`${baseUrl}/.netlify/functions/generate-agent-prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promptConfig),
      });

      if (!response.ok) return { result: 'Prompt regeneration failed. Please try again.' };

      const generated = await response.json();

      // Update in Retell
      const llmUpdate: any = { general_prompt: generated.prompt };
      if (generated.beginMessage) llmUpdate.begin_message = generated.beginMessage;
      await retell.llm.update(llmId, llmUpdate);

      // Update in Supabase
      await supabase.from('agents').update({
        system_prompt: generated.prompt,
        greeting: generated.beginMessage || agent.greeting,
      }).eq('id', agent.id);

      return {
        result: `Prompt regenerated from scratch${args.tone ? ` with ${args.tone} tone` : ''}. Your agent now has a fresh, professional prompt.`,
        actionTaken: `Regenerated full agent prompt${args.tone ? ` (tone: ${args.tone})` : ''}`,
      };
    }

    case 'add_faq': {
      if (!ctx.profile) return { result: 'No business profile found.' };

      // Update in Supabase knowledge base
      const { data: kb } = await supabase
        .from('knowledge_base')
        .select('faqs')
        .eq('user_id', ctx.userId)
        .single();

      const existingFaqs = kb?.faqs || [];
      const updatedFaqs = [...existingFaqs, { question: args.question, answer: args.answer }];

      await supabase
        .from('knowledge_base')
        .upsert({ user_id: ctx.userId, faqs: updatedFaqs }, { onConflict: 'user_id' });

      return {
        result: `Added FAQ:\nQ: ${args.question}\nA: ${args.answer}`,
        actionTaken: `Added FAQ: "${args.question}"`,
      };
    }

    case 'add_service': {
      const { data: kb } = await supabase
        .from('knowledge_base')
        .select('services')
        .eq('user_id', ctx.userId)
        .single();

      const existingServices = kb?.services || [];
      const newService = { name: args.name, duration: args.duration || 30, price: args.price || 0 };
      const updatedServices = [...existingServices, newService];

      await supabase
        .from('knowledge_base')
        .upsert({ user_id: ctx.userId, services: updatedServices }, { onConflict: 'user_id' });

      return {
        result: `Added service: ${args.name}${args.duration ? ` (${args.duration} min)` : ''}${args.price ? ` - $${args.price}` : ''}`,
        actionTaken: `Added service: "${args.name}"`,
      };
    }

    case 'update_business_hours': {
      if (!ctx.profile) return { result: 'No business profile found.' };

      const currentHours = ctx.profile.opening_hours || {};
      const updatedHours = { ...currentHours, ...args.hours };

      await supabase
        .from('business_profiles')
        .update({ opening_hours: updatedHours })
        .eq('user_id', ctx.userId);

      const changedDays = Object.keys(args.hours).join(', ');
      return {
        result: `Business hours updated for: ${changedDays}`,
        actionTaken: `Updated hours for ${changedDays}`,
      };
    }

    case 'get_agent_details': {
      if (!agent) return { result: 'No agent found. Please complete setup first.' };

      let retellDetails: any = null;
      if (agent.retell_agent_id) {
        try {
          retellDetails = await retell.agent.retrieve(agent.retell_agent_id);
        } catch { /* ignore */ }
      }

      const details = [
        `Name: ${agent.name}`,
        `Type: ${agent.agent_type || 'inbound'}`,
        `Status: ${agent.status || 'unknown'}`,
        `Voice: ${retellDetails?.voice_id || agent.voice_id || '11labs-Adrian'}`,
        `Greeting: ${agent.greeting || 'Default greeting'}`,
      ];

      if (agent.system_prompt) {
        details.push(`Prompt preview: ${agent.system_prompt.substring(0, 200)}...`);
      }

      return { result: details.join('\n') };
    }

    case 'get_call_stats': {
      if (!agent?.retell_agent_id) return { result: 'No agent found.' };

      const days = args.days || 7;
      const since = Date.now() - days * 24 * 60 * 60 * 1000;

      try {
        const calls = await retell.call.list({
          filter_criteria: {
            agent_id: [agent.retell_agent_id],
            after_start_timestamp: since,
          },
        });

        const callList = Array.isArray(calls) ? calls : [];
        const total = callList.length;
        const successful = callList.filter((c: any) => c.call_analysis?.call_successful).length;
        const avgDuration = total > 0
          ? Math.round(callList.reduce((sum: number, c: any) => sum + ((c.end_timestamp || 0) - (c.start_timestamp || 0)), 0) / total / 1000)
          : 0;

        return {
          result: `Last ${days} days:\n• Total calls: ${total}\n• Successful: ${successful} (${total > 0 ? Math.round(successful / total * 100) : 0}%)\n• Avg duration: ${avgDuration}s`,
        };
      } catch {
        return { result: 'Could not fetch call stats. Your agent may not have received calls yet.' };
      }
    }

    case 'change_voice': {
      if (!agent?.retell_agent_id) return { result: 'No agent found. Please complete setup first.' };

      // Map friendly names to full 11labs IDs
      const voiceMap: Record<string, string> = {
        adrian: '11labs-Adrian',
        dorothy: '11labs-Dorothy',
        charlie: '11labs-Charlie',
        matilda: '11labs-Matilda',
        chris: '11labs-Chris',
        jessica: '11labs-Jessica',
        eric: '11labs-Eric',
        laura: '11labs-Laura',
        brian: '11labs-Brian',
        sarah: '11labs-Sarah',
      };

      const inputVoice = args.voice_id.trim();
      const resolvedVoice = voiceMap[inputVoice.toLowerCase()] || inputVoice;

      // Update voice in Retell
      await retell.agent.update(agent.retell_agent_id, { voice_id: resolvedVoice });

      // Update in Supabase
      await supabase.from('agents').update({ voice_id: resolvedVoice }).eq('id', agent.id);

      return {
        result: `Voice changed to "${resolvedVoice}". Your agent will now use this voice on all calls.`,
        actionTaken: `Changed agent voice to ${resolvedVoice}`,
      };
    }

    case 'toggle_agent': {
      if (!agent) return { result: 'No agent found. Please complete setup first.' };

      const enabled = !!args.enabled;
      await supabase
        .from('agents')
        .update({ is_active: enabled, status: enabled ? 'active' : 'inactive' })
        .eq('id', agent.id);

      return {
        result: `Agent has been ${enabled ? 'enabled' : 'disabled'}. ${enabled ? 'It will now answer incoming calls.' : 'It will no longer answer calls until re-enabled.'}`,
        actionTaken: `${enabled ? 'Enabled' : 'Disabled'} the agent`,
      };
    }

    case 'update_transfer_number': {
      if (!agent) return { result: 'No agent found. Please complete setup first.' };

      const phone = args.phone_number.trim();

      // Update in agents table
      await supabase
        .from('agents')
        .update({ transfer_number: phone })
        .eq('id', agent.id);

      return {
        result: `Transfer number updated to ${phone}. Calls will now be transferred to this number when requested.`,
        actionTaken: `Updated transfer number to ${phone}`,
      };
    }

    case 'get_test_call_link': {
      if (!agent?.retell_agent_id) return { result: 'No agent found. Please complete setup first.' };

      const baseUrl = process.env.URL || process.env.DEPLOY_URL || 'https://boltcall.org';

      try {
        const webCallResponse = await fetch(`${baseUrl}/.netlify/functions/retell-agents`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create_web_call',
            agent_id: agent.retell_agent_id,
          }),
        });

        if (!webCallResponse.ok) {
          return { result: 'Failed to create test call. Please try again.' };
        }

        const webCallData = await webCallResponse.json();

        return {
          result: `Test call ready! Use this access token to start a web call:\n\nAccess Token: ${webCallData.access_token}\n\nYou can test your agent by clicking the "Test Call" button in your dashboard, or use the Retell Web SDK with this token.`,
          actionTaken: 'Generated test call link',
        };
      } catch {
        return { result: 'Could not generate test call. Please try again or use the Test Call button in your dashboard.' };
      }
    }

    default:
      return { result: `Unknown action: ${name}` };
  }
}

// ── System prompt ──
const SYSTEM_PROMPT = `You are Bolt, the Boltcall AI assistant. You live inside the dashboard and can both ANSWER questions and TAKE ACTIONS on the user's behalf.

You have tools to:
- Update the agent's greeting (what it says first on calls)
- Update the agent's prompt/behavior (make it more formal, friendlier, add instructions, etc.)
- Regenerate the entire prompt from scratch
- Add FAQs to the knowledge base
- Add services to the knowledge base
- Update business hours
- View current agent configuration
- Get call statistics
- Change the agent's voice (Adrian, Dorothy, Charlie, etc.)
- Enable or disable the agent
- Update the call transfer phone number
- Generate a test call link to try the agent in your browser

IMPORTANT RULES:
- When the user asks you to DO something (change greeting, make agent friendlier, add a FAQ, etc.), USE THE TOOLS. Don't just tell them how — do it for them.
- After executing an action, confirm what you did in a short, clear message.
- If you need clarification before acting (e.g. "what should the new greeting say?"), ask first.
- Be concise — 2-3 sentences max for most responses.
- If the user asks something you can't do with your tools, explain what they need to do manually and where in the dashboard.
- You can call multiple tools in sequence if needed (e.g. add FAQ then regenerate prompt).`;

// ── Main handler ──
const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { messages, userId } = JSON.parse(event.body || '{}');
    if (!messages?.length) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Messages required' }) };
    }

    const openai = getOpenAI();

    // Fetch user context
    let ctx: any = { userId };
    if (userId) {
      ctx = await getBusinessContext(userId);
    }

    const contextStr = contextToString(ctx);
    const systemContent = contextStr
      ? `${SYSTEM_PROMPT}\n\n--- User's Business Context ---\n${contextStr}`
      : SYSTEM_PROMPT;

    // First call — may include tool calls
    let response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemContent },
        ...messages.slice(-20),
      ],
      tools,
      tool_choice: 'auto',
      max_tokens: 1000,
      temperature: 0.5,
    });

    let assistantMessage = response.choices[0]?.message;
    const actionsTaken: string[] = [];

    // Process tool calls (up to 3 rounds to handle chained actions)
    let rounds = 0;
    while (assistantMessage?.tool_calls?.length && rounds < 3) {
      rounds++;
      const toolResults: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: 'assistant' as const, content: assistantMessage.content, tool_calls: assistantMessage.tool_calls },
      ];

      for (const tc of assistantMessage.tool_calls) {
        const args = JSON.parse(tc.function.arguments || '{}');
        console.log(`Executing tool: ${tc.function.name}`, args);

        const { result, actionTaken } = await executeTool(tc.function.name, args, ctx);
        if (actionTaken) actionsTaken.push(actionTaken);

        toolResults.push({
          role: 'tool' as const,
          tool_call_id: tc.id,
          content: result,
        });
      }

      // Follow-up call with tool results
      response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemContent },
          ...messages.slice(-20),
          ...toolResults,
        ],
        tools,
        tool_choice: 'auto',
        max_tokens: 1000,
        temperature: 0.5,
      });

      assistantMessage = response.choices[0]?.message;
    }

    const reply = assistantMessage?.content || 'Done!';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        reply,
        actions: actionsTaken.length > 0 ? actionsTaken : undefined,
      }),
    };
  } catch (error: any) {
    console.error('AI Assistant error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};

export { handler };
