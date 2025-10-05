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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Voice Library</h1>
          <p className="text-gray-600 mt-1">
            Browse and select voices for your AI agents. Preview different styles and assign the perfect voice for your use case.
          </p>
        </div>
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
