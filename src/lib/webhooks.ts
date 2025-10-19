// Webhook service for setup page integrations

export interface PhoneNumber {
  phone_number: string;
  friendly_name: string;
  region: string;
  rate_center: string;
}

export interface CreateAgentResponse {
  success: boolean;
  agentId?: string;
  message?: string;
}

export interface PurchaseNumberResponse {
  success: boolean;
  phoneNumber?: string;
  message?: string;
}

// Create AI agent and knowledge base webhook
export const createAgentAndKnowledgeBase = async (data: {
  businessName: string;
  websiteUrl?: string;
  mainCategory: string;
  country: string;
  serviceAreas: string[];
  openingHours: any;
  languages: string[];
}): Promise<CreateAgentResponse> => {
  try {
    const response = await fetch('https://n8n.srv974118.hstgr.cloud/webhook/ed6b6d51-1122-49b2-ba5b-1d1d0d1bc4fe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating agent and knowledge base:', error);
    throw error;
  }
};

// Get available phone numbers webhook
export const getAvailablePhoneNumbers = async (): Promise<PhoneNumber[]> => {
  try {
    const response = await fetch('https://n8n.srv974118.hstgr.cloud/webhook/56056949-3a98-4987-94be-cba983065391', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const phoneNumbers = await response.json();
    return phoneNumbers;
  } catch (error) {
    console.error('Error fetching phone numbers:', error);
    throw error;
  }
};

// Purchase phone number webhook
export const purchasePhoneNumber = async (phoneNumber: string): Promise<PurchaseNumberResponse> => {
  try {
    const response = await fetch('https://n8n.srv974118.hstgr.cloud/webhook/19e608fe-0603-4d5d-b605-0e8ce1dcd5d9', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error purchasing phone number:', error);
    throw error;
  }
};
