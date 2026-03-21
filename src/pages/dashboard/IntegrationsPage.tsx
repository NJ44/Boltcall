import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, Mail } from 'lucide-react';

const IntegrationsPage: React.FC = () => {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [connectedIntegrations, setConnectedIntegrations] = useState<Set<string>>(new Set());

  const openPanel = (id: string) => setActivePanel(id);
  const closePanel = () => setActivePanel(null);

  const handleConnect = (id: string) => {
    setConnectedIntegrations(prev => new Set(prev).add(id));
    setActivePanel(null);
  };

  const isConnected = (id: string) => connectedIntegrations.has(id);

  const handleOpenCalcom = () => {
    window.location.href = '/dashboard/calcom';
  };

  // Backwards compat
  const handleContainerClick = () => openPanel('calcom');
  const isSidePanelOpen = activePanel === 'calcom';
  const handleClosePanel = closePanel;
  const isEmailPanelOpen = activePanel === 'email';
  const isMicrosoftPanelOpen = activePanel === 'microsoft';
  const handleEmailConnect = () => handleConnect('email');
  const handleMicrosoftConnect = () => handleConnect('microsoft');
  const isEmailConnected = isConnected('email');
  const isMicrosoftConnected = isConnected('microsoft');

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
        className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl"
      >
        {/* Cal.com Integration */}
        <div 
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={isConnected('calcom') ? undefined : handleContainerClick}
        >
          <div className="flex items-center gap-3 mb-3">
            {/* Cal.com Logo */}
            <img 
              src="/cal.com_logo.png" 
              alt="Cal.com" 
              className="w-10 h-10"
            />
            <div>
              <h3 className="text-base font-semibold text-gray-900">Cal.com</h3>
              <p className="text-xs text-gray-500">Calendar & Scheduling</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">
            Connect Cal.com to automatically schedule appointments and sync your availability. 
            Your AI receptionist can book meetings directly into your calendar.
          </p>

          {isConnected('calcom') && (
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
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={handleContainerClick}
        >
          <div className="flex items-center gap-3 mb-3">
            {/* WhatsApp Logo */}
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">WhatsApp</h3>
              <p className="text-xs text-gray-500">Messaging & Communication</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-600">
            Connect WhatsApp Business to enable messaging with your customers. 
            Your AI receptionist can handle WhatsApp conversations and provide instant support.
          </p>
        </div>

        {/* Email Integration */}
        <div 
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => openPanel('email')}
        >
          <div className="flex items-center gap-3 mb-3">
            {/* Gmail Logo */}
            <img 
              src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico" 
              alt="Gmail" 
              className="w-10 h-10"
              onError={(e) => {
                // Fallback to SVG if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div 
              className="w-10 h-10 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-lg flex items-center justify-center"
              style={{ display: 'none' }}
            >
              <Mail className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Email</h3>
              <p className="text-xs text-gray-500">Email Integration</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-600">
            Connect your email account to enable email notifications and automated email responses. 
            Your AI receptionist can send and receive emails on your behalf.
          </p>

          {isEmailConnected && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">Email connected</p>
            </div>
          )}
        </div>

        {/* Microsoft Integration */}
        <div 
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => openPanel('microsoft')}
        >
          <div className="flex items-center gap-3 mb-3">
            {/* Microsoft Logo */}
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border-2 border-gray-300">
              <svg className="w-7 h-7" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H11V11H0V0Z" fill="#F25022"/>
                <path d="M12 0H23V11H12V0Z" fill="#7FBA00"/>
                <path d="M0 12H11V23H0V12Z" fill="#00A4EF"/>
                <path d="M12 12H23V23H12V12Z" fill="#FFB900"/>
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Microsoft</h3>
              <p className="text-xs text-gray-500">Office 365 & Teams</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-600">
            Connect your Microsoft account to sync with Office 365, Outlook, and Microsoft Teams. 
            Your AI receptionist can access your calendar and send emails through your Microsoft account.
          </p>

          {isMicrosoftConnected && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">Microsoft connected</p>
            </div>
          )}
        </div>

        {/* Google Calendar Integration */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => openPanel('google-calendar')}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                <path d="M18 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2z" fill="#4285F4"/>
                <path d="M6 4h12v4H6V4z" fill="#EA4335"/>
                <rect x="8" y="10" width="3" height="3" rx="0.5" fill="white"/>
                <rect x="13" y="10" width="3" height="3" rx="0.5" fill="white"/>
                <rect x="8" y="15" width="3" height="3" rx="0.5" fill="white"/>
                <rect x="13" y="15" width="3" height="3" rx="0.5" fill="white"/>
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Google Calendar</h3>
              <p className="text-xs text-gray-500">Scheduling</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Sync your Google Calendar so the AI receptionist can check your availability and book appointments directly.
          </p>
        </div>

        {/* HubSpot CRM */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => openPanel('hubspot')}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#FF7A59] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.58 10.1V7.64a2.07 2.07 0 001.19-1.87 2.08 2.08 0 00-2.08-2.08 2.08 2.08 0 00-2.08 2.08c0 .82.48 1.53 1.18 1.87v2.46a5.12 5.12 0 00-2.35 1.08l-6.38-4.96a2.34 2.34 0 00.06-.52A2.34 2.34 0 004.78 3.4a2.34 2.34 0 00-2.34 2.33 2.34 2.34 0 002.34 2.34c.49 0 .95-.15 1.33-.42l6.27 4.88a5.13 5.13 0 00-.7 2.59 5.13 5.13 0 001.51 3.64l-1.2 1.2a1.76 1.76 0 00-.52-.08 1.78 1.78 0 00-1.78 1.78 1.78 1.78 0 001.78 1.78 1.78 1.78 0 001.78-1.78c0-.18-.03-.36-.08-.52l1.2-1.2a5.14 5.14 0 003.64 1.51 5.15 5.15 0 005.14-5.14 5.15 5.15 0 00-5.14-5.14c-.58 0-1.14.1-1.67.27z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">HubSpot</h3>
              <p className="text-xs text-gray-500">CRM & Lead Management</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Automatically push new leads and call data into HubSpot. Keep your CRM updated without lifting a finger.
          </p>
        </div>

        {/* Jobber */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => openPanel('jobber')}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#7BC74D] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Jobber</h3>
              <p className="text-xs text-gray-500">Field Service Management</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Perfect for plumbers, electricians, and contractors. Sync leads as new jobs, schedule site visits, and send quotes automatically.
          </p>
        </div>

        {/* Housecall Pro */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => openPanel('housecall-pro')}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#0D6EFD] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Housecall Pro</h3>
              <p className="text-xs text-gray-500">Home Service Management</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Built for home service businesses. Turn incoming calls into jobs, dispatch techs, and send invoices — all connected to your AI receptionist.
          </p>
        </div>

        {/* ServiceTitan */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => openPanel('servicetitan')}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#1B365D] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ST</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">ServiceTitan</h3>
              <p className="text-xs text-gray-500">HVAC, Plumbing & Electrical</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            The #1 platform for HVAC, plumbing, and electrical businesses. Sync calls, book jobs, and track leads directly from your AI receptionist.
          </p>
        </div>

        {/* Zapier */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => openPanel('zapier')}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#FF4F00] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.478 12.89l-2.557-2.557 2.557-2.557a1.51 1.51 0 000-2.134l-.12-.12a1.51 1.51 0 00-2.133 0L10.668 8.08 8.11 5.522a1.51 1.51 0 00-2.134 0l-.12.12a1.51 1.51 0 000 2.134l2.557 2.557-2.557 2.557a1.51 1.51 0 000 2.134l.12.12a1.51 1.51 0 002.134 0l2.557-2.557 2.557 2.557a1.51 1.51 0 002.134 0l.12-.12a1.51 1.51 0 000-2.134z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Zapier</h3>
              <p className="text-xs text-gray-500">Connect 6,000+ Apps</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Connect Boltcall to any tool you already use — QuickBooks, Google Sheets, Slack, Mailchimp, and 6,000+ more. No coding needed.
          </p>
        </div>

        {/* Google Sheets */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => openPanel('google-sheets')}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#0F9D58] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 11H5v2h14v-2zm0 4H5v2h14v-2zm0-8H5v2h14V7z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Google Sheets</h3>
              <p className="text-xs text-gray-500">Simple Lead Tracking</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Automatically log every call, lead, and appointment into a Google Sheet. Simple lead tracking without learning a new tool.
          </p>
        </div>

        {/* QuickBooks */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => openPanel('quickbooks')}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#2CA01C] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">QuickBooks</h3>
              <p className="text-xs text-gray-500">Invoicing & Accounting</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Create invoices and estimates automatically when your AI receptionist books a job. Keep your books up to date effortlessly.
          </p>
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
              onClick={() => closePanel()}
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
                    onClick={() => closePanel()}
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
                  </p>
                </div>

                {/* Separator */}
                <div className="border-t border-gray-200 mb-6"></div>

                {/* Connect section */}
                <div>
                  <button
                    onClick={handleEmailConnect}
                    className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.636H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" fill="#4285F4"/>
                    </svg>
                    Sign in with Google
                  </button>
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
              onClick={() => closePanel()}
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
                    onClick={() => closePanel()}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* How it works section */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">How it works</h3>
                  <p className="text-gray-600 mb-4">
                    Connect your Microsoft account to sync with Office 365, Outlook, and Microsoft Teams.
                  </p>
                </div>

                {/* Separator */}
                <div className="border-t border-gray-200 mb-6"></div>

                {/* Connect section */}
                <div>
                  <button
                    onClick={handleMicrosoftConnect}
                    className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 0H11V11H0V0Z" fill="#F25022"/>
                      <path d="M12 0H23V11H12V0Z" fill="#7FBA00"/>
                      <path d="M0 12H11V23H0V12Z" fill="#00A4EF"/>
                      <path d="M12 12H23V23H12V12Z" fill="#FFB900"/>
                    </svg>
                    Sign in with Microsoft
                  </button>
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
                      onClick={() => handleConnect('calcom')}
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

      {/* Generic Integration Panel (for new integrations) */}
      <AnimatePresence>
        {activePanel && !['calcom', 'email', 'microsoft'].includes(activePanel) && (() => {
          const integrationInfo: Record<string, { name: string; color: string; description: string; steps: string[]; apiLabel?: string; url?: string }> = {
            'google-calendar': { name: 'Google Calendar', color: '#4285F4', description: 'Sync your Google Calendar so the AI receptionist can check availability and book appointments.', steps: ['Sign in with your Google account', 'Select which calendar to use', 'Your AI receptionist will check availability before booking'], url: 'https://calendar.google.com' },
            'hubspot': { name: 'HubSpot', color: '#FF7A59', description: 'Automatically push new leads, calls, and appointments into your HubSpot CRM.', steps: ['Create a free HubSpot account if you don\'t have one', 'Enter your HubSpot API key below', 'New leads from calls will appear in your HubSpot contacts'], apiLabel: 'HubSpot API Key', url: 'https://app.hubspot.com' },
            'jobber': { name: 'Jobber', color: '#7BC74D', description: 'Sync leads as new jobs, schedule site visits, and send quotes automatically.', steps: ['Log into your Jobber account', 'Enter your Jobber API key below', 'Incoming calls will create new job requests in Jobber'], apiLabel: 'Jobber API Key', url: 'https://getjobber.com' },
            'housecall-pro': { name: 'Housecall Pro', color: '#0D6EFD', description: 'Turn incoming calls into jobs, dispatch techs, and send invoices — all connected.', steps: ['Log into your Housecall Pro account', 'Enter your API key below', 'Booked appointments will sync as new jobs'], apiLabel: 'Housecall Pro API Key', url: 'https://housecallpro.com' },
            'servicetitan': { name: 'ServiceTitan', color: '#1B365D', description: 'Sync calls, book jobs, and track leads directly from your AI receptionist.', steps: ['Contact your ServiceTitan admin for API access', 'Enter your Client ID and Secret below', 'Calls and bookings will sync in real time'], apiLabel: 'ServiceTitan Client ID', url: 'https://servicetitan.com' },
            'zapier': { name: 'Zapier', color: '#FF4F00', description: 'Connect Boltcall to 6,000+ apps — QuickBooks, Slack, Mailchimp, and more.', steps: ['Create a free Zapier account', 'Search for "Boltcall" in Zapier', 'Choose a trigger (new lead, call ended, appointment booked) and connect to any app'], url: 'https://zapier.com' },
            'google-sheets': { name: 'Google Sheets', color: '#0F9D58', description: 'Log every call, lead, and appointment into a Google Sheet automatically.', steps: ['Sign in with your Google account', 'Select or create a spreadsheet', 'New leads and calls will be added as rows automatically'], url: 'https://sheets.google.com' },
            'quickbooks': { name: 'QuickBooks', color: '#2CA01C', description: 'Create invoices and estimates automatically when a job is booked.', steps: ['Log into your QuickBooks account', 'Authorize Boltcall to access your QuickBooks', 'Booked jobs will create draft invoices automatically'], apiLabel: 'QuickBooks API Key', url: 'https://quickbooks.intuit.com' },
          };
          const info = integrationInfo[activePanel];
          if (!info) return null;
          return (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed -inset-[200px] bg-black bg-opacity-50 z-40"
                onClick={closePanel}
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', ease: [0.25, 0.46, 0.45, 0.94], duration: 0.4 }}
                className="fixed right-0 top-0 h-screen w-96 bg-white shadow-xl z-50 overflow-y-auto rounded-l-3xl"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: info.color }}>
                        <span className="text-white font-bold text-sm">{info.name[0]}</span>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">{info.name}</h2>
                    </div>
                    <button onClick={closePanel} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  <p className="text-gray-600 mb-6">{info.description}</p>

                  <div className="border-t border-gray-200 mb-6"></div>

                  <h3 className="text-lg font-medium text-gray-900 mb-3">How to connect</h3>
                  <ol className="space-y-3 mb-6">
                    {info.steps.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: info.color }}>{i + 1}</span>
                        <span className="text-sm text-gray-600">{step}</span>
                      </li>
                    ))}
                  </ol>

                  {info.apiLabel && (
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{info.apiLabel}</label>
                        <input
                          type="text"
                          placeholder={`Enter your ${info.name} API key`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <button
                        onClick={() => handleConnect(activePanel)}
                        className="w-full text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: info.color }}
                      >
                        Connect {info.name}
                      </button>
                    </div>
                  )}

                  {!info.apiLabel && (
                    <button
                      onClick={() => handleConnect(activePanel)}
                      className="w-full text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity mb-4"
                      style={{ backgroundColor: info.color }}
                    >
                      Connect {info.name}
                    </button>
                  )}

                  {info.url && (
                    <a href={info.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
                      <ExternalLink className="w-4 h-4" />
                      Visit {info.name}
                    </a>
                  )}
                </div>
              </motion.div>
            </>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};

export default IntegrationsPage;
