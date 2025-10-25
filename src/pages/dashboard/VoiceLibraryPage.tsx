import React from 'react';
import { motion } from 'framer-motion';
import VoiceLibrary from '../../components/dashboard/VoiceLibrary';

const VoiceLibraryPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
      </motion.div>

      {/* Voice Library Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-lg border border-gray-200"
      >
        <VoiceLibrary />
      </motion.div>
    </div>
  );
};

export default VoiceLibraryPage;
