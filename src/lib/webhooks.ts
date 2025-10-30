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
  clientId?: string;
}): Promise<CreateAgentResponse> => {
  try {
    // Generate a client ID if not provided
    const clientId = data.clientId || `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const payload = {
      website_url: data.websiteUrl,
      client_id: clientId,
      business_name: data.businessName,
      main_category: data.mainCategory,
      country: data.country,
      service_areas: data.serviceAreas,
      opening_hours: data.openingHours,
      languages: data.languages,
    };

    const response = await fetch('https://n8n.srv974118.hstgr.cloud/webhook/3a4fe147-8277-4390-b1e6-c903fad3d7d2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'perbP3PNqCvbu9JxG3YZvlBC9dS6OjR2',
      },
      body: JSON.stringify(payload),
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
export const getAvailablePhoneNumbers = async (country?: string): Promise<PhoneNumber[]> => {
  try {
    const url = new URL('https://n8n.srv974118.hstgr.cloud/webhook/56056949-3a98-4987-94be-cba983065391');
    if (country) {
      url.searchParams.set('country', country.toUpperCase());
    }
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'perbP3PNqCvbu9JxG3YZvlBC9dS6OjR2',
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
        'x-api-key': 'perbP3PNqCvbu9JxG3YZvlBC9dS6OjR2',
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
