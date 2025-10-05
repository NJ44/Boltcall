import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import ConnectFacebookButton from '../../components/ConnectFacebookButton';

const InstantLeadReplyPage: React.FC = () => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<string>('');

  const handleContainerClick = (integration: string) => {
    setSelectedIntegration(integration);
    setIsSidePanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsSidePanelOpen(false);
    setSelectedIntegration('');
  };

  const handleConnect = () => {
    console.log('Connecting with:', selectedIntegration);
    // Implementation for connecting with the selected integration
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
          <h1 className="text-3xl font-bold text-gray-900">Instant Lead Reply</h1>
          <p className="text-gray-600 mt-1">Connect your lead sources to automate instant responses</p>
        </div>
      </motion.div>

      {/* Integration Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl"
      >

        {/* Facebook Ads Integration */}
        <div 
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleContainerClick('facebook-ads')}
        >
          <div className="flex items-center gap-4 mb-4">
            {/* Facebook Ads Logo */}
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Facebook Ads</h3>
              <p className="text-sm text-gray-500">Social Media Advertising</p>
            </div>
          </div>
          
          <p className="text-gray-600">
            Connect Facebook Ads to capture leads from your social media campaigns. 
            Automatically respond to users who engage with your Facebook ads.
          </p>
        </div>

        {/* Web Form Integration */}
        <div 
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleContainerClick('web-form')}
        >
          <div className="flex items-center gap-4 mb-4">
            {/* Web Form Logo */}
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Web Form</h3>
              <p className="text-sm text-gray-500">Website Lead Capture</p>
          </div>
        </div>

          <p className="text-gray-600">
            Connect your website forms to automatically respond to form submissions. 
            Provide instant confirmation and follow-up to website visitors.
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
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 capitalize">
                      {selectedIntegration.replace('-', ' ')}
                    </h2>
                  </div>
                  <button
                    onClick={handleClosePanel}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Facebook Ads OAuth Integration */}
                {selectedIntegration === 'facebook-ads' ? (
            <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Facebook Ads OAuth Integration</h3>
                      <p className="text-gray-600 mb-4">
                        Great—Option B it is. You'll add a "Connect Facebook" button that runs OAuth, lets the client pick their Page(s), and then you auto-subscribe those Pages to leadgen webhooks. After that, every new Lead Ad submission hits your webhook → your workflow.
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Setup Instructions:</h4>
                      <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                        <li>Create a Meta App (Business type) at developers.facebook.com</li>
                        <li>Add Webhooks product</li>
                        <li>Set Privacy Policy URL + App Domain in App Settings</li>
                        <li>Request these scopes in App Review: leads_retrieval, pages_manage_metadata, pages_read_engagement</li>
                        <li>Set OAuth redirect URI to: https://YOUR_DOMAIN/api/auth/facebook/callback</li>
                        <li>Put the app to Live when ready</li>
                      </ol>
                  </div>
                  
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Environment Variables Needed:</h4>
                      <div className="bg-gray-900 text-green-400 p-3 rounded-lg text-sm font-mono">
                        <div>FB_APP_ID=your_facebook_app_id</div>
                        <div>FB_APP_SECRET=your_facebook_app_secret</div>
                        <div>FB_WEBHOOK_VERIFY_TOKEN=your_verify_token</div>
                        <div>APP_URL=https://your-domain.com</div>
                        <div>N8N_WEBHOOK_URL=your_n8n_webhook_url</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Database Table (Supabase):</h4>
                      <div className="bg-gray-900 text-green-400 p-3 rounded-lg text-sm font-mono">
                        <div>create table if not exists facebook_page_connections (</div>
                        <div className="ml-2">id uuid primary key default gen_random_uuid(),</div>
                        <div className="ml-2">workspace_id uuid not null,</div>
                        <div className="ml-2">page_id text not null,</div>
                        <div className="ml-2">page_name text,</div>
                        <div className="ml-2">page_access_token text not null,</div>
                        <div className="ml-2">created_at timestamptz default now(),</div>
                        <div className="ml-2">unique(workspace_id, page_id)</div>
                        <div>);</div>
                      </div>
                  </div>
                  
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Webhook URL:</h4>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">
                          Set this callback URL in your Meta App → Webhooks → Page → Callback URL:
                        </p>
                        <code className="text-sm bg-white px-2 py-1 rounded border">
                          https://YOUR_DOMAIN/api/facebook/webhook
                        </code>
                        <p className="text-sm text-gray-600 mt-2">
                          Verify Token = FB_WEBHOOK_VERIFY_TOKEN
                        </p>
                      </div>
                    </div>

                    <ConnectFacebookButton 
                      onClick={handleClosePanel}
                      className="w-full py-3 px-4 font-medium"
                    />
                  </div>
                ) : (
                  <>
                    {/* How it works section for other integrations */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">How it works</h3>
                      <p className="text-gray-600 mb-4">
                        {selectedIntegration === 'web-form' && 
                          'Connect your website forms to automatically respond to form submissions and capture leads.'
                        }
                      </p>
                      <a 
                        href="#"
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Learn more about this integration
                      </a>
                    </div>

                    {/* Separator */}
                    <div className="border-t border-gray-200 mb-6"></div>

                    {/* Connect section for other integrations */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Connect {selectedIntegration.replace('-', ' ')}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Please configure your settings to get started
                      </p>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {selectedIntegration === 'web-form' && 'Web Form URL'}
                          </label>
                          <input
                            type="text"
                            placeholder={
                              selectedIntegration === 'web-form' ? 'Enter your web form URL' : ''
                            }
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
                  </>
          )}
        </div>
      </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InstantLeadReplyPage;
