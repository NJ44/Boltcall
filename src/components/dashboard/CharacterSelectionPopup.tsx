import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface CharacterSelectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCharacter: (character: string) => void;
}

const CharacterSelectionPopup: React.FC<CharacterSelectionPopupProps> = ({
  isOpen,
  onClose,
  onSelectCharacter
}) => {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  const characters = [
    {
      id: 'dentist-checking-teeth',
      name: 'Dentist Checking Teeth',
      animation: '/Dentist_Checking_Teeth.lottie'
    },
    {
      id: 'dentist-surgery',
      name: 'Dentist Surgery',
      animation: '/Dentist_Surgery.lottie'
    },
    {
      id: 'dental-care-teeth',
      name: 'Dental Care Teeth',
      animation: '/Dental_Care_Teeth.lottie'
    },
    {
      id: 'dental-care-anim',
      name: 'Dental Care Anim',
      animation: '/Dental_Care_anim.lottie'
    }
  ];

  const handleSelect = (characterId: string) => {
    setSelectedCharacter(characterId);
    onSelectCharacter(characterId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Character</h2>
                <p className="text-gray-600">Select your AI assistant character for the dashboard</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Character Grid */}
            <div className="grid grid-cols-2 gap-4">
              {characters.map((character, index) => (
                <motion.div
                  key={character.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative cursor-pointer rounded-xl border-2 transition-all duration-300 ${
                    selectedCharacter === character.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelect(character.id)}
                >
                  <div className="p-4">
                    <div className="w-full h-32 mb-2 flex items-center justify-center">
                      <DotLottieReact
                        src={character.animation}
                        loop
                        autoplay
                        style={{
                          width: '100%',
                          height: '100%',
                          maxWidth: '120px',
                          maxHeight: '120px'
                        }}
                      />
                    </div>
                  </div>
                  
                  {selectedCharacter === character.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                    >
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CharacterSelectionPopup;
