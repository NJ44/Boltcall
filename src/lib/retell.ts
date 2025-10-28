// Retell AI API integration for knowledge base creation

export interface RetellKnowledgeBaseText {
  text: string;
  title: string;
}

export interface RetellKnowledgeBaseResponse {
  knowledge_base_id: string;
  success: boolean;
  message?: string;
}

export interface RetellAgentResponse {
  agent_id: string;
  success: boolean;
  message?: string;
}

// Define interfaces for better type safety
interface CreateKnowledgeBaseData {
  businessName: string;
  websiteUrl?: string;
  mainCategory: string;
  country: string;
  serviceAreas: string[];
  openingHours: any;
  languages: string[];
  services?: Array<{
    name: string;
    duration: number;
    price: number;
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  policies?: {
    cancellation: string;
    reschedule: string;
    deposit: string;
  };
}

interface CreateAgentData {
  businessName: string;
  knowledgeBaseId: string;
  mainCategory: string;
  languages: string[];
}

// Create knowledge base in Retell AI
export const createRetellKnowledgeBase = async (data: CreateKnowledgeBaseData): Promise<RetellKnowledgeBaseResponse> => {
  try {
    const retellApiKey = process.env.RETELL_API_KEY || 'YOUR_RETELL_API_KEY';
    
    // Prepare knowledge base texts from business information
    const knowledgeBaseTexts: RetellKnowledgeBaseText[] = [];
    
    // Add business information
    knowledgeBaseTexts.push({
      title: "Business Information",
      text: `Business Name: ${data.businessName}\nCategory: ${data.mainCategory}\nCountry: ${data.country}\nService Areas: ${data.serviceAreas.join(', ')}\n\nLanguages Supported: ${data.languages.join(', ')}\n\nOpening Hours:\n${Object.entries(data.openingHours).map(([day, hours]: [string, any]) => {
        if (hours.closed) return `${day}: Closed`;
        return `${day}: ${hours.open} - ${hours.close}`;
      }).join('\n')}`
    });

    // Add services if provided
    if (data.services && data.services.length > 0) {
      knowledgeBaseTexts.push({
        title: "Services Offered",
        text: `Our services include:\n${data.services.map(service => 
          `• ${service.name} - Duration: ${service.duration} minutes, Price: $${service.price}`
        ).join('\n')}`
      });
    }

    // Add FAQs if provided
    if (data.faqs && data.faqs.length > 0) {
      knowledgeBaseTexts.push({
        title: "Frequently Asked Questions",
        text: data.faqs.map(faq => 
          `Q: ${faq.question}\nA: ${faq.answer}`
        ).join('\n\n')
      });
    }

    // Add policies if provided
    if (data.policies) {
      knowledgeBaseTexts.push({
        title: "Business Policies",
        text: `Cancellation Policy: ${data.policies.cancellation}\n\nReschedule Policy: ${data.policies.reschedule}\n\nDeposit Policy: ${data.policies.deposit}`
      });
    }

    // Add general business information
    knowledgeBaseTexts.push({
      title: "General Business Information",
      text: `We are a ${data.mainCategory} business serving ${data.serviceAreas.join(', ')}. We support multiple languages: ${data.languages.join(', ')}.\n${data.websiteUrl ? `Visit our website at ${data.websiteUrl} for more information.` : ''}\n\nOur AI assistant is here to help you with:\n- Answering questions about our services\n- Providing information about our business hours\n- Helping with appointment scheduling\n- Explaining our policies and procedures\n- Connecting you with the right team member`
    });

    const payload = {
      knowledge_base_name: `${data.businessName} Knowledge Base`,
      knowledge_base_texts: knowledgeBaseTexts,
      knowledge_base_urls: data.websiteUrl ? [data.websiteUrl] : []
    };

    const response = await fetch('https://api.retellai.com/v2/create-knowledge-base', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${retellApiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Retell API error: ${response.status} - ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    return {
      knowledge_base_id: result.knowledge_base_id,
      success: true,
      message: 'Knowledge base created successfully'
    };
  } catch (error) {
    console.error('Error creating Retell knowledge base:', error);
    throw error;
  }
};

// Create Retell agent with knowledge base
export const createRetellAgent = async (data: CreateAgentData): Promise<RetellAgentResponse> => {
  try {
    const retellApiKey = process.env.RETELL_API_KEY || 'YOUR_RETELL_API_KEY';
    
    const payload = {
      agent_name: `${data.businessName} AI Assistant`,
      language: data.languages.includes('en') ? 'en' : data.languages[0] || 'en',
      llm_websocket_url: 'wss://api.retellai.com/v2/llm/stream',
      voice_id: '11labs-Adrian', // Default voice
      knowledge_base_ids: [data.knowledgeBaseId],
      system_prompt: `You are an AI assistant for ${data.businessName}, a ${data.mainCategory} business. Your role is to help customers with information about our services, answer questions, and assist with appointments.\n\nKey guidelines:\n- Be friendly, professional, and helpful\n- Provide accurate information based on our knowledge base\n- If you don't know something, offer to connect them with a team member\n- Always maintain a positive tone\n- Focus on being helpful and solving customer problems\n\nLanguages supported: ${data.languages.join(', ')}`
    };

    const response = await fetch('https://api.retellai.com/v2/create-agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${retellApiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Retell API error: ${response.status} - ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    return {
      agent_id: result.agent_id,
      success: true,
      message: 'Agent created successfully'
    };
  } catch (error) {
    console.error('Error creating Retell agent:', error);
    throw error;
  }
};

// Combined function to create both knowledge base and agent
export const createRetellAgentAndKnowledgeBase = async (data: CreateKnowledgeBaseData): Promise<{
  knowledge_base_id: string;
  agent_id: string;
  success: boolean;
  message?: string;
}> => {
  try {
    // First create the knowledge base
    const kbResponse = await createRetellKnowledgeBase(data);
    
    if (!kbResponse.success) {
      throw new Error('Failed to create knowledge base');
    }

    // Then create the agent with the knowledge base
    const agentResponse = await createRetellAgent({
      businessName: data.businessName,
      knowledgeBaseId: kbResponse.knowledge_base_id,
      mainCategory: data.mainCategory,
      languages: data.languages
    });

    if (!agentResponse.success) {
      throw new Error('Failed to create agent');
    }

    return {
      knowledge_base_id: kbResponse.knowledge_base_id,
      agent_id: agentResponse.agent_id,
      success: true,
      message: 'Knowledge base and agent created successfully'
    };
  } catch (error) {
    console.error('Error creating Retell agent and knowledge base:', error);
    throw error;
  }
};