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
    // Try to fetch from Supabase voices table first
    try {
      const { data: voices, error } = await supabase
        .from('voices')
        .select('id, name, accent, gender, preview_audio_url')
        .eq('is_active', true)
        .limit(10);

      if (!error && voices && voices.length > 0) {
        console.log('Using real Retell voices from Supabase');
        return voices.map(voice => ({
          id: voice.id,
          name: voice.name,
          accent: voice.accent,
          gender: voice.gender,
          preview: voice.preview_audio_url,
        }));
      }
    } catch (supabaseError) {
      console.warn('Could not fetch from Supabase:', supabaseError);
    }

    // Fallback: try to fetch from the static JSON file
    try {
      const response = await fetch('/retell-voices.json');
      if (response.ok) {
        const voices = await response.json();
        console.log('Using real Retell voices from JSON file');
        return voices;
      }
    } catch (jsonError) {
      console.warn('Could not fetch from JSON file:', jsonError);
    }

    // Final fallback: use mock data
    console.log('Using mock data as final fallback');
    return mockVoices.map(voice => ({
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
