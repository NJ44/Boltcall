import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, Mail } from 'lucide-react';

const IntegrationsPage: React.FC = () => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isEmailPanelOpen, setIsEmailPanelOpen] = useState(false);
  const [isMicrosoftPanelOpen, setIsMicrosoftPanelOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [microsoftAccount, setMicrosoftAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isEmailConnected, setIsEmailConnected] = useState(false);
  const [isMicrosoftConnected, setIsMicrosoftConnected] = useState(false);

  const handleContainerClick = () => {
    setIsSidePanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsSidePanelOpen(false);
  };

  const handleConnect = () => {
    console.log('Connecting with API key:', apiKey);
    // Implementation for connecting with Cal.com
    setIsConnected(true);
    setIsSidePanelOpen(false);
  };

  const handleEmailConnect = () => {
    console.log('Connecting email:', emailAddress);
    // Implementation for connecting email
    setIsEmailConnected(true);
    setIsEmailPanelOpen(false);
  };

  const handleMicrosoftConnect = () => {
    console.log('Connecting Microsoft account:', microsoftAccount);
    // Implementation for connecting Microsoft
    setIsMicrosoftConnected(true);
    setIsMicrosoftPanelOpen(false);
  };

  const handleOpenCalcom = () => {
    // Navigate to Cal.com page
    window.location.href = '/dashboard/calcom';
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
      </motion.div>

      {/* Integrations Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl"
      >
        {/* Cal.com Integration */}
        <div 
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={isConnected ? undefined : handleContainerClick}
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
          
          <p className="text-gray-600 mb-4">
            Connect Cal.com to automatically schedule appointments and sync your availability. 
            Your AI receptionist can book meetings directly into your calendar.
          </p>

          {isConnected && (
            <button
              onClick={handleOpenCalcom}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Open Cal.com
            </button>
          )}
        </div>

        {/* WhatsApp Integration */}
        <div 
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={handleContainerClick}
        >
          <div className="flex items-center gap-4 mb-4">
            {/* WhatsApp Logo */}
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">WhatsApp</h3>
              <p className="text-sm text-gray-500">Messaging & Communication</p>
            </div>
          </div>
          
          <p className="text-gray-600">
            Connect WhatsApp Business to enable messaging with your customers. 
            Your AI receptionist can handle WhatsApp conversations and provide instant support.
          </p>
        </div>

        {/* Email Integration */}
        <div 
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setIsEmailPanelOpen(true)}
        >
          <div className="flex items-center gap-4 mb-4">
            {/* Email Icon */}
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Email</h3>
              <p className="text-sm text-gray-500">Email Integration</p>
            </div>
          </div>
          
          <p className="text-gray-600">
            Connect your email account to enable email notifications and automated email responses. 
            Your AI receptionist can send and receive emails on your behalf.
          </p>

          {isEmailConnected && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">Email connected: {emailAddress}</p>
            </div>
          )}
        </div>

        {/* Microsoft Integration */}
        <div 
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setIsMicrosoftPanelOpen(true)}
        >
          <div className="flex items-center gap-4 mb-4">
            {/* Microsoft Logo */}
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border-2 border-gray-300">
              <svg className="w-8 h-8" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H11V11H0V0Z" fill="#F25022"/>
                <path d="M12 0H23V11H12V0Z" fill="#7FBA00"/>
                <path d="M0 12H11V23H0V12Z" fill="#00A4EF"/>
                <path d="M12 12H23V23H12V12Z" fill="#FFB900"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Microsoft</h3>
              <p className="text-sm text-gray-500">Office 365 & Teams</p>
            </div>
          </div>
          
          <p className="text-gray-600">
            Connect your Microsoft account to sync with Office 365, Outlook, and Microsoft Teams. 
            Your AI receptionist can access your calendar and send emails through your Microsoft account.
          </p>

          {isMicrosoftConnected && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">Microsoft connected: {microsoftAccount}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Email Integration Side Panel */}
      <AnimatePresence>
        {isEmailPanelOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed -inset-[200px] bg-black bg-opacity-50 z-40"
              onClick={() => setIsEmailPanelOpen(false)}
            />
            
            {/* Side Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ 
                type: 'tween', 
                ease: [0.25, 0.46, 0.45, 0.94], 
                duration: 0.4 
              }}
              className="fixed right-0 top-0 h-screen w-96 bg-white shadow-xl z-50 overflow-y-auto rounded-l-3xl"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Email Integration</h2>
                  </div>
                  <button
                    onClick={() => setIsEmailPanelOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* How it works section */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">How it works</h3>
                  <p className="text-gray-600 mb-4">
                    Connect your email account to enable automated email responses and notifications. 
                    Your AI receptionist can handle email inquiries and send automated follow-ups.
                  </p>
                </div>

                {/* Separator */}
                <div className="border-t border-gray-200 mb-6"></div>

                {/* Connect section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Email</h3>
                  <p className="text-gray-600 mb-6">
                    Enter your email address to get started
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <button
                      onClick={handleEmailConnect}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Connect Email
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Microsoft Integration Side Panel */}
      <AnimatePresence>
        {isMicrosoftPanelOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed -inset-[200px] bg-black bg-opacity-50 z-40"
              onClick={() => setIsMicrosoftPanelOpen(false)}
            />
            
            {/* Side Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ 
                type: 'tween', 
                ease: [0.25, 0.46, 0.45, 0.94], 
                duration: 0.4 
              }}
              className="fixed right-0 top-0 h-screen w-96 bg-white shadow-xl z-50 overflow-y-auto rounded-l-3xl"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border-2 border-gray-300">
                      <svg className="w-5 h-5" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0H11V11H0V0Z" fill="#F25022"/>
                        <path d="M12 0H23V11H12V0Z" fill="#7FBA00"/>
                        <path d="M0 12H11V23H0V12Z" fill="#00A4EF"/>
                        <path d="M12 12H23V23H12V12Z" fill="#FFB900"/>
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Microsoft Integration</h2>
                  </div>
                  <button
                    onClick={() => setIsMicrosoftPanelOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* How it works section */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">How it works</h3>
                  <p className="text-gray-600 mb-4">
                    Connect your Microsoft account to sync with Office 365, Outlook calendar, and Microsoft Teams. 
                    Your AI receptionist can access your calendar, send emails, and manage appointments through your Microsoft account.
                  </p>
                  <a 
                    href="https://www.microsoft.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Microsoft website
                  </a>
                </div>

                {/* Separator */}
                <div className="border-t border-gray-200 mb-6"></div>

                {/* Connect section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Microsoft</h3>
                  <p className="text-gray-600 mb-6">
                    Enter your Microsoft account email to get started
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Microsoft Account Email
                      </label>
                      <input
                        type="email"
                        value={microsoftAccount}
                        onChange={(e) => setMicrosoftAccount(e.target.value)}
                        placeholder="your@outlook.com or your@microsoft.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <button
                      onClick={handleMicrosoftConnect}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Connect Microsoft
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cal.com Side Panel */}
      <AnimatePresence>
        {isSidePanelOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed -inset-[200px] bg-black bg-opacity-50 z-40"
              onClick={handleClosePanel}
            />
            
            {/* Side Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ 
                type: 'tween', 
                ease: [0.25, 0.46, 0.45, 0.94], 
                duration: 0.4 
              }}
              className="fixed right-0 top-0 h-screen w-96 bg-white shadow-xl z-50 overflow-y-auto rounded-l-3xl"
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
                    Visit the Cal.com website
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
                        Get Your Cal.com API Key
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
