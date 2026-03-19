import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Copy, Send, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { supabase } from '../../lib/supabase';

interface FacebookConnection {
  id: string;
  page_id: string;
  page_name: string | null;
  created_at: string;
}

const InstantLeadReplyPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<string>('');
  const [fbConnections, setFbConnections] = useState<FacebookConnection[]>([]);
  const [fbLoading, setFbLoading] = useState(true);
  const [fbConnecting, setFbConnecting] = useState(false);
  const [testSending, setTestSending] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const webhookUrl = 'https://boltcall.org/.netlify/functions/lead-webhook';

  // Fetch Facebook connection status
  useEffect(() => {
    const fetchConnections = async () => {
      if (!user?.id) return;
      setFbLoading(true);
      try {
        const { data, error } = await supabase
          .from('facebook_page_connections')
          .select('id, page_id, page_name, created_at')
          .or(`workspace_id.eq.${user.id},user_id.eq.${user.id}`);

        if (error) {
          console.error('Error fetching FB connections:', error);
        } else {
          setFbConnections(data || []);
        }
      } catch (err) {
        console.error('Error fetching FB connections:', err);
      } finally {
        setFbLoading(false);
      }
    };

    fetchConnections();
  }, [user?.id]);

  const handleContainerClick = (integration: string) => {
    setSelectedIntegration(integration);
    setIsSidePanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsSidePanelOpen(false);
    setSelectedIntegration('');
  };

  const handleConnectFacebook = async () => {
    setFbConnecting(true);
    try {
      const response = await fetch('/.netlify/functions/facebook-auth-start');
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        showToast({ message: 'Failed to start Facebook connection. Please try again.', variant: 'error' });
        console.error('No OAuth URL received:', data);
      }
    } catch (error) {
      showToast({ message: 'Error connecting to Facebook. Please try again.', variant: 'error' });
      console.error('Error starting Facebook OAuth:', error);
    } finally {
      setFbConnecting(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    showToast({ message: 'Copied to clipboard', variant: 'success' });
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSendTestLead = async () => {
    if (!user?.id) {
      showToast({ message: 'You must be logged in to send a test lead.', variant: 'error' });
      return;
    }

    setTestSending(true);
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Lead',
          email: `test+${Date.now()}@example.com`,
          phone: '+1234567890',
          source: 'test_webhook',
          user_id: user.id,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showToast({ message: 'Test lead sent successfully! Check your Leads page.', variant: 'success' });
      } else {
        showToast({ message: `Test failed: ${result.error || 'Unknown error'}`, variant: 'error' });
        console.error('Test lead response:', result);
      }
    } catch (error) {
      showToast({ message: 'Failed to send test lead. Check your network connection.', variant: 'error' });
      console.error('Test lead error:', error);
    } finally {
      setTestSending(false);
    }
  };

  const fetchSnippet = user?.id
    ? `fetch("${webhookUrl}", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    source: "website_form",
    user_id: "${user.id}"
  })
})`
    : '// Log in to see your user_id';

  const htmlFormSnippet = user?.id
    ? `<form id="lead-form">
  <input name="name" placeholder="Your name" required />
  <input name="email" type="email" placeholder="Email" required />
  <input name="phone" placeholder="Phone" />
  <button type="submit">Get Started</button>
</form>

<script>
document.getElementById("lead-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    await fetch("${webhookUrl}", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        email: fd.get("email"),
        phone: fd.get("phone"),
        source: "website_form",
        user_id: "${user.id}"
      })
    });
    alert("Thanks! We'll be in touch.");
  });
</script>`
    : '<!-- Log in to see your user_id -->';

  // Add effect to update body class when panel is open
  useEffect(() => {
    if (isSidePanelOpen) {
      document.body.classList.add('panel-open');
    } else {
      document.body.classList.remove('panel-open');
    }
    return () => {
      document.body.classList.remove('panel-open');
    };
  }, [isSidePanelOpen]);

  const isConnected = fbConnections.length > 0;

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

      {/* Integration Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl"
      >

        {/* Facebook Ads Integration */}
        <div
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer relative"
          onClick={() => handleContainerClick('facebook-ads')}
        >
          {/* Connected badge */}
          {isConnected && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
              <CheckCircle className="w-3 h-3" />
              Connected
            </div>
          )}

          <div className="flex items-center gap-4 mb-4">
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

          {isConnected && fbConnections[0]?.page_name && (
            <p className="mt-3 text-sm text-green-700 font-medium">
              Page: {fbConnections[0].page_name}
              {fbConnections.length > 1 && ` (+${fbConnections.length - 1} more)`}
            </p>
          )}
        </div>

        {/* Web Form Integration */}
        <div
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleContainerClick('web-form')}
        >
          <div className="flex items-center gap-4 mb-4">
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
              className="fixed -inset-[200px] bg-black bg-opacity-50 z-40"
              onClick={handleClosePanel}
            />

            {/* Side Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[28rem] bg-white shadow-xl z-50 overflow-y-auto rounded-l-3xl"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      selectedIntegration === 'facebook-ads' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}>
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

                {/* Facebook Ads Panel */}
                {selectedIntegration === 'facebook-ads' && (
                  <div className="space-y-6">
                    {/* Connection Status */}
                    {fbLoading ? (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Checking connection status...
                      </div>
                    ) : isConnected ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <h3 className="text-lg font-medium text-green-900">Connected</h3>
                        </div>
                        <p className="text-green-700 text-sm mb-3">
                          Your Facebook page is connected. New leads from Lead Ads will automatically appear in your Leads page.
                        </p>
                        <div className="space-y-2">
                          {fbConnections.map((conn) => (
                            <div key={conn.id} className="flex items-center justify-between bg-white rounded-md px-3 py-2 text-sm">
                              <span className="font-medium text-gray-900">{conn.page_name || conn.page_id}</span>
                              <span className="text-gray-500 text-xs">
                                Connected {new Date(conn.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Connect Your Facebook Page</h3>
                        <p className="text-gray-600 mb-4">
                          Click the button below to connect your Facebook Page. After authorization, Boltcall will automatically receive leads from your Facebook Lead Ads and add them to your Leads page for instant follow-up.
                        </p>
                      </div>
                    )}

                    {/* How it works */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">How it works:</h4>
                      <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                        <li>Click "Connect Facebook" and authorize Boltcall</li>
                        <li>Select the Facebook Page(s) running Lead Ads</li>
                        <li>New leads are automatically captured in real-time</li>
                        <li>Your AI follows up instantly via SMS/email</li>
                      </ol>
                    </div>

                    {/* Connect / Reconnect Button */}
                    <button
                      onClick={handleConnectFacebook}
                      disabled={fbConnecting}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {fbConnecting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Connecting...
                        </>
                      ) : isConnected ? (
                        'Reconnect Facebook'
                      ) : (
                        'Connect Facebook'
                      )}
                    </button>
                  </div>
                )}

                {/* Web Form Panel */}
                {selectedIntegration === 'web-form' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Your Webhook URL</h3>
                      <p className="text-gray-600 mb-4">
                        Send lead data to this URL from any website form, Zapier, or third-party tool. Leads will appear in your Leads page instantly.
                      </p>
                    </div>

                    {/* Webhook URL */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-sm bg-white px-3 py-2 rounded border border-gray-200 break-all text-gray-800">
                          {webhookUrl}
                        </code>
                        <button
                          onClick={() => handleCopy(webhookUrl, 'url')}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                          title="Copy URL"
                        >
                          {copied === 'url' ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* User ID */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your User ID</label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-sm bg-white px-3 py-2 rounded border border-gray-200 break-all text-gray-800 font-mono">
                          {user?.id || 'Loading...'}
                        </code>
                        {user?.id && (
                          <button
                            onClick={() => handleCopy(user.id, 'userId')}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                            title="Copy User ID"
                          >
                            {copied === 'userId' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-500" />
                            )}
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Include this in every request so leads are linked to your account.</p>
                    </div>

                    {/* Fetch Example */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">JavaScript (fetch)</h4>
                        <button
                          onClick={() => handleCopy(fetchSnippet, 'fetch')}
                          className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          {copied === 'fetch' ? (
                            <><CheckCircle className="w-3 h-3" /> Copied</>
                          ) : (
                            <><Copy className="w-3 h-3" /> Copy</>
                          )}
                        </button>
                      </div>
                      <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                        {fetchSnippet}
                      </pre>
                    </div>

                    {/* HTML Form Example */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">HTML Form Example</h4>
                        <button
                          onClick={() => handleCopy(htmlFormSnippet, 'html')}
                          className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          {copied === 'html' ? (
                            <><CheckCircle className="w-3 h-3" /> Copied</>
                          ) : (
                            <><Copy className="w-3 h-3" /> Copy</>
                          )}
                        </button>
                      </div>
                      <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                        {htmlFormSnippet}
                      </pre>
                    </div>

                    {/* Test Button */}
                    <button
                      onClick={handleSendTestLead}
                      disabled={testSending || !user?.id}
                      className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {testSending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending test lead...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Test Lead
                        </>
                      )}
                    </button>
                  </div>
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
