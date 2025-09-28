import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface CharacterDisplayProps {
  selectedCharacter: string | null;
}

const CharacterDisplay: React.FC<CharacterDisplayProps> = ({ selectedCharacter }) => {
  if (!selectedCharacter) return null;

  const getCharacterAnimation = (characterId: string) => {
    switch (characterId) {
      case 'dentist-checking-teeth':
        return '/Dentist_Checking_Teeth.lottie';
      case 'dentist-surgery':
        return '/Dentist_Surgery.lottie';
      case 'dental-care-teeth':
        return '/Dental_Care_Teeth.lottie';
      case 'dental-care-anim':
        return '/Dental_Care_anim.lottie';
      default:
        return '/Dentist_Checking_Teeth.lottie';
    }
  };

  return (
    <div className="w-16 h-16">
      <DotLottieReact
        src={getCharacterAnimation(selectedCharacter)}
        loop
        autoplay
        style={{
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
};

export default CharacterDisplay;
