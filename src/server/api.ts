import type { LeadFormData } from '../lib/validators';
import { supabase } from '../lib/supabase';

// Mock voices data (replace with actual Retell API integration)
const mockVoices = [
  {
    voice_id: 'sarah',
    name: 'Sarah',
    accent: 'American',
    gender: 'Female',
    preview_audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    voice_id: 'mike',
    name: 'Mike',
    accent: 'American',
    gender: 'Male',
    preview_audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    voice_id: 'emily',
    name: 'Emily',
    accent: 'British',
    gender: 'Female',
    preview_audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    voice_id: 'david',
    name: 'David',
    accent: 'Australian',
    gender: 'Male',
    preview_audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    voice_id: 'anna',
    name: 'Anna',
    accent: 'Canadian',
    gender: 'Female',
    preview_audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    voice_id: 'james',
    name: 'James',
    accent: 'Irish',
    gender: 'Male',
    preview_audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  }
];

export async function getVoices(): Promise<any[]> {
  try {
    // Use Vite environment variable
    const apiKey = import.meta.env.VITE_RETELL_API_KEY;
    
    if (!apiKey) {
      console.warn('VITE_RETELL_API_KEY not found, using mock data');
      return mockVoices.map(voice => ({
        id: voice.voice_id,
        name: voice.name,
        accent: voice.accent,
        gender: voice.gender,
        preview: voice.preview_audio_url,
      }));
    }

    // Real Retell API call
    const response = await fetch('https://api.retellai.com/v2/voices', {
      headers: { 
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.items.map((voice: any) => ({
      id: voice.voice_id,
      name: voice.name,
      accent: voice.accent,
      gender: voice.gender,
      preview: voice.preview_audio_url,
    }));
  } catch (error) {
    console.error('Error fetching voices:', error);
    console.log('Falling back to mock data...');
    
    // Fallback to mock data if API call fails
    return mockVoices.map(voice => ({
      id: voice.voice_id,
      name: voice.name,
      accent: voice.accent,
      gender: voice.gender,
      preview: voice.preview_audio_url,
    }));
  }
}

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
