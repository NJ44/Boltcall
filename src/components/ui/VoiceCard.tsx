import React from 'react';
import { Play, Pause } from 'lucide-react';

interface Voice {
  id: string;
  name: string;
  accent: string;
  gender: string;
  preview: string;
  provider?: string;
}

interface VoiceCardProps {
  voice: Voice;
  isSelected: boolean;
  onSelect: (voiceId: string) => void;
  isPlaying: boolean;
  onPlay: (voiceId: string) => void;
  onPause: () => void;
}

const VoiceCard: React.FC<VoiceCardProps> = ({
  voice,
  isSelected,
  onSelect,
  isPlaying,
  onPlay,
  onPause
}) => {
  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay(voice.id);
    }
  };

  return (
    <div
      className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
      onClick={() => onSelect(voice.id)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{voice.name}</h3>
          <p className="text-sm text-gray-500 capitalize">
            {voice.gender} • {voice.accent}
            {voice.provider && ` • ${voice.provider}`}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePlayPause();
          }}
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
            isPlaying
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="flex items-center text-blue-600 text-sm">
          <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
          Selected
        </div>
      )}
    </div>
  );
};

export default VoiceCard;
