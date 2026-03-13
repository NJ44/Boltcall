import { Handler } from '@netlify/functions';
import Retell from 'retell-sdk';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

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

  const apiKey = process.env.RETELL_API_KEY || process.env.VITE_RETELL_API_KEY;
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
            general_prompt: body.general_prompt || `You are a helpful AI receptionist for ${body.agent_name || 'this business'}. Be friendly, professional, and concise.`,
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

        // Step 2: Determine response engine
        let responseEngine;

        if (body.llm_id) {
          responseEngine = { type: 'retell-llm' as const, llm_id: body.llm_id };
        } else if (body.llm_websocket_url) {
          responseEngine = { type: 'custom-llm' as const, llm_websocket_url: body.llm_websocket_url };
        } else {
          // Auto-create a Retell LLM linked to the knowledge base
          const llm = await client.llm.create({
            model: 'gpt-4o-mini',
            general_prompt: `You are a friendly, professional AI receptionist for ${body.business_name}. Help callers with scheduling, answering questions, and providing information about the business. Be concise and helpful.`,
            knowledge_base_ids: [kb.knowledge_base_id],
          } as any);
          responseEngine = { type: 'retell-llm' as const, llm_id: llm.llm_id };
        }

        // Step 3: Create agent with the response engine
        const agent = await client.agent.create({
          agent_name: `${body.business_name} AI Assistant`,
          voice_id: body.voice_id || '11labs-Adrian',
          language: body.language || 'en-US',
          response_engine: responseEngine,
        } as any);

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            knowledge_base_id: kb.knowledge_base_id,
            agent_id: agent.agent_id,
            agent,
          }),
        };
      }

      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid action. Use: create_kb, create_agent, or create_full' }),
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
