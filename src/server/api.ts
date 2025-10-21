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

    // Check if we have cached voices in localStorage (less than 1 hour old)
    const cachedVoices = localStorage.getItem('retellVoices');
    const cachedTimestamp = localStorage.getItem('retellVoicesTimestamp');
    
    if (cachedVoices && cachedTimestamp) {
      const age = Date.now() - parseInt(cachedTimestamp);
      if (age < 3600000) { // 1 hour
        console.log('Using cached Retell voices');
        return JSON.parse(cachedVoices);
      }
    }

    // Try to fetch from the HTML page that can bypass CORS
    try {
      const response = await fetch('/fetch-voices.html');
      if (response.ok) {
        // Wait a bit for the page to fetch and store the data
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if data was stored
        const storedVoices = localStorage.getItem('retellVoices');
        if (storedVoices) {
          console.log('Using voices fetched via HTML page');
          return JSON.parse(storedVoices);
        }
      }
    } catch (htmlError) {
      console.warn('Could not fetch via HTML page:', htmlError);
    }

    // Fallback: try direct API call (might work in some browsers)
    try {
      const response = await fetch('https://api.retellai.com/v2/voices', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Transform the data and limit to 10 voices
        const voices = data.items.slice(0, 10).map((voice: any) => ({
          id: voice.voice_id,
          name: voice.name,
          accent: voice.accent,
          gender: voice.gender,
          preview: voice.preview_audio_url,
        }));

        // Cache the voices
        localStorage.setItem('retellVoices', JSON.stringify(voices));
        localStorage.setItem('retellVoicesTimestamp', Date.now().toString());
        
        return voices;
      }
    } catch (directError) {
      console.warn('Direct API call failed:', directError);
    }

    throw new Error('All API methods failed');
    
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
