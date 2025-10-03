import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';

const IntegrationsPage: React.FC = () => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const handleContainerClick = () => {
    setIsSidePanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsSidePanelOpen(false);
  };

  const handleConnect = () => {
    console.log('Connecting with API key:', apiKey);
    // Implementation for connecting with Cal.com
  };

  // Add effect to update body class when panel is open
  React.useEffect(() => {
    if (isSidePanelOpen) {
      document.body.classList.add('panel-open');
    } else {
      document.body.classList.remove('panel-open');
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('panel-open');
    };
  }, [isSidePanelOpen]);

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
          <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
          <p className="text-gray-600 mt-1">Connect your favorite tools and automate your workflow</p>
        </div>
      </motion.div>

      {/* Cal.com Integration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-lg"
      >
        <div 
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={handleContainerClick}
        >
          <div className="flex items-center gap-4 mb-4">
            {/* Cal.com Logo */}
            <img 
              src="/cal.com_logo.png" 
              alt="Cal.com" 
              className="w-12 h-12"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Cal.com</h3>
              <p className="text-sm text-gray-500">Calendar & Scheduling</p>
            </div>
          </div>
          
          <p className="text-gray-600">
            Connect Cal.com to automatically schedule appointments and sync your availability. 
            Your AI receptionist can book meetings directly into your calendar.
          </p>
        </div>
      </motion.div>

      {/* Side Panel */}
      <AnimatePresence>
        {isSidePanelOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={handleClosePanel}
            />
            
            {/* Side Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 overflow-y-auto rounded-l-3xl"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/cal.com_logo.png" 
                      alt="Cal.com" 
                      className="w-8 h-8"
                    />
                    <h2 className="text-xl font-semibold text-gray-900">Cal.com</h2>
                  </div>
                  <button
                    onClick={handleClosePanel}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* How it works section */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">How it works</h3>
                  <p className="text-gray-600 mb-4">
                    Generate an API key in the settings of your Calcom app and provide it here.
                  </p>
                  <a 
                    href="https://cal.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Link to the cal.com website
                  </a>
                </div>

                {/* Separator */}
                <div className="border-t border-gray-200 mb-6"></div>

                {/* Connect section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Connect with Calcom</h3>
                  <p className="text-gray-600 mb-6">
                    Please first setup your account to get started
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Key
                      </label>
                      <input
                        type="text"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your Cal.com API key"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <button
                      onClick={handleConnect}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntegrationsPage;
