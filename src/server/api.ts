import type { LeadFormData } from '../lib/validators';
import { supabase } from '../lib/supabase';

export async function handleLeadSubmission(data: LeadFormData): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabase
      .from('leads')
      .insert({
        name: data.name,
        email: data.email,
        company: data.company,
        website: data.website || null,
        phone: data.phone || null,
        message: data.message || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Lead submission error:', error);
      return {
        success: false,
        message: 'Something went wrong. Please try again.'
      };
    }

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
    post: async (path: string, data: { name: string; email: string; subject: string; message: string; company?: string; website?: string; phone?: string }) => {
      if (path === '/lead') {
        const leadData = {
          name: data.name,
          email: data.email,
          company: data.company || '',
          website: data.website || '',
          phone: data.phone || '',
          message: data.message
        };
        return await handleLeadSubmission(leadData);
      }
      throw new Error('Endpoint not found');
    }
  };
}
