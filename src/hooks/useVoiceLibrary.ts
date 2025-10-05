import { useState, useEffect } from 'react';

export interface Voice {
  id: string;
  display_name: string;
  provider: string;
  language: string;
  gender?: string;
  style_tags?: string[];
  sample_rate_hz: number;
  supports_realtime: boolean;
  price_per_min_usd?: number;
  provider_voice_id: string;
}

export interface VoiceFilters {
  provider?: string;
  language?: string;
  query?: string;
  supports_realtime?: boolean;
}

export interface VoicePreviewRequest {
  provider: string;
  provider_voice_id: string;
  text: string;
  volume?: number;
}

export interface VoiceAssignmentRequest {
  agent_id: string;
  provider: string;
  voice_id: string;
}

export const useVoiceLibrary = () => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVoices = async (filters?: VoiceFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (filters?.provider) params.append('provider', filters.provider);
      if (filters?.language) params.append('lang', filters.language);
      if (filters?.query) params.append('q', filters.query);
      if (filters?.supports_realtime) params.append('supports_realtime', 'true');

      const response = await fetch(`/api/voices?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.statusText}`);
      }

      const data = await response.json();
      setVoices(data.voices || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch voices');
      console.error('Error fetching voices:', err);
    } finally {
      setLoading(false);
    }
  };

  const previewVoice = async (request: VoicePreviewRequest): Promise<Blob | null> => {
    try {
      const response = await fetch('/api/voices/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Preview failed: ${response.statusText}`);
      }

      return await response.blob();
    } catch (err) {
      console.error('Error previewing voice:', err);
      return null;
    }
  };

  const assignVoiceToAgent = async (request: VoiceAssignmentRequest): Promise<boolean> => {
    try {
      const response = await fetch(`/api/agents/${request.agent_id}/voice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: request.provider,
          voice_id: request.voice_id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Assignment failed: ${response.statusText}`);
      }

      return true;
    } catch (err) {
      console.error('Error assigning voice:', err);
      return false;
    }
  };

  return {
    voices,
    loading,
    error,
    fetchVoices,
    previewVoice,
    assignVoiceToAgent,
  };
};

export const useVoicePreview = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVoiceId, setCurrentVoiceId] = useState<string | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const playPreview = async (
    voice: Voice,
    _text: string,
    _volume: number = 80
  ): Promise<void> => {
    if (isPlaying && currentVoiceId === voice.id) {
      stopPreview();
      return;
    }

    setIsPlaying(true);
    setCurrentVoiceId(voice.id);

    try {
      // Create audio context if it doesn't exist
      if (!audioContext) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(ctx);
      }

      // In a real implementation, you would call the preview API here
      // For now, we'll simulate with a timeout
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } catch (error) {
      console.error('Error playing preview:', error);
    } finally {
      setIsPlaying(false);
      setCurrentVoiceId(null);
    }
  };

  const stopPreview = () => {
    setIsPlaying(false);
    setCurrentVoiceId(null);
    
    if (audioContext) {
      audioContext.close();
      setAudioContext(null);
    }
  };

  useEffect(() => {
    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [audioContext]);

  return {
    isPlaying,
    currentVoiceId,
    playPreview,
    stopPreview,
  };
};
