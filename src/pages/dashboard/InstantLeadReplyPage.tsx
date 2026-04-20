import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Send, Loader2, Download, ExternalLink } from 'lucide-react';
import { PopButton } from '../../components/ui/pop-button';
import { CopyButton } from '../../components/ui/copy-button';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useTokens } from '../../contexts/TokenContext';
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
  const { claimReward } = useTokens();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<string>('');
  const [fbConnections, setFbConnections] = useState<FacebookConnection[]>([]);
  const [fbLoading, setFbLoading] = useState(true);
  const [fbConnecting, setFbConnecting] = useState(false);
  const [testSending, setTestSending] = useState(false);
  const [setupMode, setSetupMode] = useState<'embed' | 'wordpress' | 'advanced'>('embed');
  const webhookUrl = 'https://boltcall.org/.netlify/functions/lead-webhook';
  const prettyWebhookUrl = user?.id ? `https://boltcall.org/l/${user.id}` : '';

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
          // If connections exist, claim the bonus reward (safe to call multiple times)
          if (data && data.length > 0) {
            claimReward('connect_facebook').then((result) => {
              if (result?.success && !result?.alreadyClaimed) {
                showToast({ title: 'Bonus Tokens!', message: '+75 tokens earned for connecting Facebook Ads', variant: 'success', duration: 4000 });
              }
            });
          }
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

  const embedSnippet = user?.id
    ? `<script src="https://boltcall.org/form.js" data-user-id="${user.id}"></script>

<!-- Add data-boltcall to any form you want to capture: -->
<form data-boltcall>
  <input name="name" placeholder="Your name" required />
  <input name="email" type="email" placeholder="Email" required />
  <input name="phone" placeholder="Phone" />
  <button type="submit">Get Started</button>
</form>`
    : '<!-- Log in to see your install tag -->';

  const fetchSnippet = user?.id
    ? `fetch("${prettyWebhookUrl}", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    source: "website_form"
  })
})`
    : '// Log in to see your endpoint';

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
    await fetch("${prettyWebhookUrl}", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        email: fd.get("email"),
        phone: fd.get("phone"),
        source: "website_form"
      })
    });
    alert("Thanks! We'll be in touch.");
  });
</script>`
    : '<!-- Log in to see your endpoint -->';

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

        {/* Website Integration */}
        <div
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleContainerClick('website')}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Website</h3>
              <p className="text-sm text-gray-500">Capture leads from any site</p>
            </div>
          </div>

          <p className="text-gray-600">
            Add one line of code — or install our WordPress plugin. Works with every form builder: WPForms, Gravity Forms, Elementor, Wix, Webflow, and more.
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
              className="fixed right-0 top-0 h-full w-full sm:w-[28rem] bg-white shadow-xl z-50 overflow-y-auto rounded-l-none sm:rounded-l-3xl"
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
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedIntegration === 'facebook-ads' ? 'Facebook Ads' : 'Website'}
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
                    <PopButton
                      color="blue"
                      onClick={handleConnectFacebook}
                      disabled={fbConnecting}
                      className="w-full gap-2"
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
                    </PopButton>
                  </div>
                )}

                {/* Website Panel */}
                {selectedIntegration === 'website' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Capture Leads From Your Website</h3>
                      <p className="text-gray-600 mb-4">
                        Pick the easiest way to connect. Works with WordPress, Wix, Webflow, Squarespace, and raw HTML.
                      </p>
                    </div>

                    {/* Mode tabs */}
                    <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100 rounded-lg">
                      <button
                        onClick={() => setSetupMode('embed')}
                        className={`py-2 px-2 rounded-md text-xs font-medium transition-colors ${
                          setupMode === 'embed' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Embed <span className="text-purple-600 font-semibold">· Easiest</span>
                      </button>
                      <button
                        onClick={() => setSetupMode('wordpress')}
                        className={`py-2 px-2 rounded-md text-xs font-medium transition-colors ${
                          setupMode === 'wordpress' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        WordPress
                      </button>
                      <button
                        onClick={() => setSetupMode('advanced')}
                        className={`py-2 px-2 rounded-md text-xs font-medium transition-colors ${
                          setupMode === 'advanced' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        API
                      </button>
                    </div>

                    {setupMode === 'embed' ? (
                      <div className="space-y-5">
                        {/* How it works */}
                        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                          <h4 className="font-semibold text-purple-900 text-sm mb-2">How it works</h4>
                          <ol className="text-sm text-purple-900/80 space-y-1.5 list-decimal list-inside">
                            <li>Paste the tag below into your site's HTML (anywhere before <code className="bg-white px-1 rounded">&lt;/body&gt;</code>)</li>
                            <li>Add <code className="bg-white px-1 rounded">data-boltcall</code> to any form you want to capture</li>
                            <li>Submissions flow into your Leads page instantly — no code required</li>
                          </ol>
                        </div>

                        {/* Embed snippet */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 text-sm">Install tag</h4>
                            <CopyButton textToCopy={embedSnippet} className="py-1 px-3 text-xs h-auto" />
                          </div>
                          <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                            {embedSnippet}
                          </pre>
                        </div>

                        {/* Options */}
                        <div className="bg-gray-50 rounded-lg p-4 text-sm">
                          <h4 className="font-medium text-gray-900 mb-2">Optional form attributes</h4>
                          <ul className="space-y-1.5 text-gray-600">
                            <li><code className="bg-white px-1.5 py-0.5 rounded border border-gray-200 text-xs">data-success-message="..."</code> — custom thank-you text</li>
                            <li><code className="bg-white px-1.5 py-0.5 rounded border border-gray-200 text-xs">data-success-url="/thanks"</code> — redirect after submit</li>
                            <li><code className="bg-white px-1.5 py-0.5 rounded border border-gray-200 text-xs">data-source="homepage-hero"</code> — tag the lead source</li>
                          </ul>
                        </div>

                        {/* Auto-capture all forms */}
                        <details className="bg-gray-50 rounded-lg p-4 text-sm">
                          <summary className="font-medium text-gray-900 cursor-pointer">Capture every form on the page</summary>
                          <p className="text-gray-600 mt-2">
                            If you can't edit your forms to add <code className="bg-white px-1 rounded">data-boltcall</code>, add <code className="bg-white px-1 rounded">data-auto="true"</code> to the script tag. It'll listen to every form on the page.
                          </p>
                        </details>
                      </div>
                    ) : setupMode === 'wordpress' ? (
                      <div className="space-y-5">
                        {/* Step 1: Download */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="flex items-center justify-center w-6 h-6 bg-[#21759b] text-white text-xs font-bold rounded-full">1</span>
                            <h4 className="font-medium text-gray-900 text-sm">Download the plugin</h4>
                          </div>
                          <a
                            href="/wordpress/boltcall-for-wordpress.zip"
                            download
                            className="inline-flex items-center gap-2 mt-1 px-4 py-2 bg-[#21759b] text-white rounded-lg hover:bg-[#1a5f7f] transition-colors font-medium text-sm"
                          >
                            <Download className="w-4 h-4" />
                            Download boltcall-for-wordpress.zip
                          </a>
                        </div>

                        {/* Step 2: Upload */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="flex items-center justify-center w-6 h-6 bg-[#21759b] text-white text-xs font-bold rounded-full">2</span>
                            <h4 className="font-medium text-gray-900 text-sm">Upload to WordPress</h4>
                          </div>
                          <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside ml-1">
                            <li>Log into your WordPress admin</li>
                            <li>Go to <strong>Plugins → Add New → Upload Plugin</strong></li>
                            <li>Choose the ZIP, click <strong>Install Now</strong>, then <strong>Activate</strong></li>
                          </ol>
                        </div>

                        {/* Step 3: User ID */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="flex items-center justify-center w-6 h-6 bg-[#21759b] text-white text-xs font-bold rounded-full">3</span>
                            <h4 className="font-medium text-gray-900 text-sm">Paste your Boltcall User ID</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            In WordPress, go to <strong>Settings → Boltcall</strong> and paste this ID:
                          </p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 text-sm bg-white px-3 py-2 rounded border border-gray-200 break-all text-gray-800 font-mono">
                              {user?.id || 'Loading...'}
                            </code>
                            {user?.id && (
                              <CopyButton
                                textToCopy={user.id}
                                label=""
                                copiedLabel=""
                                className="p-2 px-2 h-auto flex-shrink-0"
                              />
                            )}
                          </div>
                        </div>

                        {/* What it captures */}
                        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                          <h4 className="font-semibold text-green-900 text-sm mb-2">Captured automatically</h4>
                          <div className="grid grid-cols-2 gap-y-1 gap-x-3 text-sm text-green-900/80">
                            <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 flex-shrink-0" /> Contact Form 7</div>
                            <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 flex-shrink-0" /> WPForms</div>
                            <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 flex-shrink-0" /> Gravity Forms</div>
                            <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 flex-shrink-0" /> Elementor Pro</div>
                            <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 flex-shrink-0" /> Ninja Forms</div>
                            <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 flex-shrink-0" /> Fluent Forms</div>
                          </div>
                        </div>

                        <a
                          href="https://boltcall.mintlify.app/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Full WordPress setup docs
                        </a>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {/* Webhook URL */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Your webhook URL</label>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 text-sm bg-white px-3 py-2 rounded border border-gray-200 break-all text-gray-800">
                              {prettyWebhookUrl || webhookUrl}
                            </code>
                            <CopyButton
                              textToCopy={prettyWebhookUrl || webhookUrl}
                              label=""
                              copiedLabel=""
                              className="p-2 px-2 h-auto flex-shrink-0"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1.5">
                            POST any JSON with <code className="bg-white px-1 rounded">email</code> or <code className="bg-white px-1 rounded">phone</code>. Your account is encoded in the URL — no <code className="bg-white px-1 rounded">user_id</code> needed in the body.
                          </p>
                        </div>

                        {/* Fetch Example */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 text-sm">JavaScript (fetch)</h4>
                            <CopyButton textToCopy={fetchSnippet} className="py-1 px-3 text-xs h-auto" />
                          </div>
                          <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                            {fetchSnippet}
                          </pre>
                        </div>

                        {/* HTML Form Example */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 text-sm">HTML form example</h4>
                            <CopyButton textToCopy={htmlFormSnippet} className="py-1 px-3 text-xs h-auto" />
                          </div>
                          <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                            {htmlFormSnippet}
                          </pre>
                        </div>
                      </div>
                    )}

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
