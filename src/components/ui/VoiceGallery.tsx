import React, { useState, useEffect, useRef } from 'react';
import VoiceCard from './VoiceCard';
import { Volume2 } from 'lucide-react';
import { getVoices } from '../../server/api';

interface Voice {
  id: string;
  name: string;
  accent: string;
  gender: string;
  preview: string;
}

interface VoiceGalleryProps {
  selectedVoiceId: string;
  onVoiceSelect: (voiceId: string) => void;
}

const VoiceGallery: React.FC<VoiceGalleryProps> = ({
  selectedVoiceId,
  onVoiceSelect
}) => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const sharedAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        setLoading(true);
        const voicesData = await getVoices();
        setVoices(voicesData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load voices');
        setLoading(false);
      }
    };

    fetchVoices();
  }, []);

  const handlePlay = (voiceId: string) => {
    // Pause any currently playing audio
    if (sharedAudioRef.current) {
      sharedAudioRef.current.pause();
      sharedAudioRef.current.currentTime = 0;
    }
    
    setPlayingVoiceId(voiceId);
    
    // Set the audio source and play
    const voice = voices.find(v => v.id === voiceId);
    if (voice && sharedAudioRef.current) {
      sharedAudioRef.current.src = voice.preview;
      sharedAudioRef.current.play().catch(console.error);
    }
  };

  const handlePause = () => {
    if (sharedAudioRef.current) {
      sharedAudioRef.current.pause();
    }
    setPlayingVoiceId(null);
  };

  const handleEnded = () => {
    setPlayingVoiceId(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Available Voices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border-2 border-gray-200 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Available Voices</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Volume2 className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Available Voices</h3>
      </div>
      
      <p className="text-sm text-gray-600">
        Click on a voice card to select it, or use the play button to preview the voice.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {voices.map((voice) => (
          <VoiceCard
            key={voice.id}
            voice={voice}
            isSelected={selectedVoiceId === voice.id}
            onSelect={onVoiceSelect}
            isPlaying={playingVoiceId === voice.id}
            onPlay={handlePlay}
            onPause={handlePause}
          />
        ))}
      </div>

      {/* Shared audio element for optimal performance */}
      <audio
        ref={sharedAudioRef}
        preload="none"
        onEnded={handleEnded}
      />
    </div>
  );
};

export default VoiceGallery;
