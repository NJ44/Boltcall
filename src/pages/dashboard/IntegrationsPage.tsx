import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, Mail, ChevronRight } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  logo: string;
  subtitle: string;
  description: string;
  fallbackColor: string;
}

const integrations: Integration[] = [
  {
    id: 'calcom',
    name: 'Cal.com',
    logo: '/cal.com_logo.png',
    subtitle: 'Calendar & Scheduling',
    description: 'Connect Cal.com to automatically schedule appointments and sync your availability.',
    fallbackColor: '#292929',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
    subtitle: 'Messaging & Communication',
    description: 'Connect WhatsApp Business to enable messaging with your customers.',
    fallbackColor: '#25D366',
  },
  {
    id: 'email',
    name: 'Email (Gmail)',
    logo: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico',
    subtitle: 'Email Integration',
    description: 'Connect your email account to enable email notifications and automated responses.',
    fallbackColor: '#EA4335',
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    subtitle: 'Office 365 & Teams',
    description: 'Sync with Outlook, Office 365, and Microsoft Teams.',
    fallbackColor: '#00A4EF',
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg',
    subtitle: 'Scheduling',
    description: 'Sync your Google Calendar so the AI receptionist can check availability and book appointments.',
    fallbackColor: '#4285F4',
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    logo: 'https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png',
    subtitle: 'CRM & Lead Management',
    description: 'Automatically push new leads and call data into HubSpot CRM.',
    fallbackColor: '#FF7A59',
  },
  {
    id: 'jobber',
    name: 'Jobber',
    logo: 'https://getjobber.com/wp-content/uploads/2021/12/cropped-Favicon-192x192.png',
    subtitle: 'Field Service Management',
    description: 'Sync leads as new jobs, schedule site visits, and send quotes automatically.',
    fallbackColor: '#7BC74D',
  },
  {
    id: 'housecall-pro',
    name: 'Housecall Pro',
    logo: 'https://www.housecallpro.com/wp-content/uploads/2023/07/cropped-favicon-192x192.png',
    subtitle: 'Home Service Management',
    description: 'Turn incoming calls into jobs, dispatch techs, and send invoices.',
    fallbackColor: '#0D6EFD',
  },
  {
    id: 'servicetitan',
    name: 'ServiceTitan',
    logo: 'https://www.servicetitan.com/favicon.ico',
    subtitle: 'HVAC, Plumbing & Electrical',
    description: 'Sync calls, book jobs, and track leads directly from your AI receptionist.',
    fallbackColor: '#1B365D',
  },
  {
    id: 'zapier',
    name: 'Zapier',
    logo: 'https://cdn.zapier.com/zapier/images/favicon.ico',
    subtitle: 'Connect 6,000+ Apps',
    description: 'Connect Boltcall to any tool you already use. No coding needed.',
    fallbackColor: '#FF4F00',
  },
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg',
    subtitle: 'Simple Lead Tracking',
    description: 'Log every call, lead, and appointment into a Google Sheet automatically.',
    fallbackColor: '#0F9D58',
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    logo: 'https://quickbooks.intuit.com/oidam/intuit/sbseg/en_us/universal/icons/qb-favicon-32.png',
    subtitle: 'Invoicing & Accounting',
    description: 'Create invoices automatically when your AI receptionist books a job.',
    fallbackColor: '#2CA01C',
  },
];

const IntegrationsPage: React.FC = () => {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [connectedIntegrations, setConnectedIntegrations] = useState<Set<string>>(new Set());
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());

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
  // isEmailConnected and isMicrosoftConnected handled via isConnected() in card grid

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

  const handleImgError = (id: string) => {
    setImgErrors(prev => new Set(prev).add(id));
  };

  const handleCardClick = (integration: Integration) => {
    if (integration.id === 'calcom' && isConnected('calcom')) {
      handleOpenCalcom();
      return;
    }
    if (integration.id === 'whatsapp') {
      handleContainerClick();
      return;
    }
    openPanel(integration.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
        <p className="text-gray-500 mt-1">Connect your favorite tools and services to Boltcall.</p>
      </motion.div>

      {/* Integrations Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-200 cursor-pointer group"
            onClick={() => handleCardClick(integration)}
          >
            <div className="flex items-start gap-4">
              {/* Logo */}
              {imgErrors.has(integration.id) ? (
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: integration.fallbackColor }}
                >
                  <span className="text-white font-bold text-lg">{integration.name[0]}</span>
                </div>
              ) : (
                <img
                  src={integration.logo}
                  alt={integration.name}
                  className="w-10 h-10 rounded-lg flex-shrink-0 object-contain"
                  onError={() => handleImgError(integration.id)}
                />
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-900">{integration.name}</h3>
                  {isConnected(integration.id) && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Connected
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{integration.subtitle}</p>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{integration.description}</p>
              </div>
            </div>

            {/* Connect button */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <button
                className="w-full flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors group-hover:bg-blue-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(integration);
                }}
              >
                {isConnected(integration.id) ? 'Manage' : 'Connect'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
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
            'whatsapp': { name: 'WhatsApp', color: '#25D366', description: 'Connect WhatsApp Business to enable messaging with your customers.', steps: ['Set up a WhatsApp Business account', 'Connect via the WhatsApp Business API', 'Your AI receptionist will handle WhatsApp conversations'], url: 'https://business.whatsapp.com' },
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
