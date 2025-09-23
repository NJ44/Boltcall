import type { LeadFormData } from '../lib/validators';

// Mock API for development
// TODO: Replace with Supabase/Airtable/Email provider in production

export async function handleLeadSubmission(data: LeadFormData): Promise<{ success: boolean; message: string }> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Log to console for development
    console.log('📧 New Lead Submission:', {
      timestamp: new Date().toISOString(),
      data: {
        name: data.name,
        email: data.email,
        company: data.company,
        website: data.website,
        phone: data.phone,
        message: data.message
      }
    });

    // Simulate success response
    return {
      success: true,
      message: 'Thank you! We\'ll be in touch within 24 hours.'
    };
  } catch (error) {
    console.error('Lead submission error:', error);
    return {
      success: false,
      message: 'Something went wrong. Please try again.'
    };
  }
}

// Simple Express-like server for development
export function createMockServer() {
  return {
    post: async (path: string, data: any) => {
      if (path === '/lead') {
        return await handleLeadSubmission(data);
      }
      throw new Error('Endpoint not found');
    }
  };
}
