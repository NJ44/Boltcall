import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, ChevronRight, Check, Loader2, AlertCircle, Unplug } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Integration {
  id: string;
  name: string;
  logo: string;
  subtitle: string;
  description: string;
  fallbackColor: string;
  type: 'api_key' | 'webhook' | 'oauth' | 'coming_soon';
  apiLabel?: string;
  webhookLabel?: string;
  extraFields?: Array<{ key: string; label: string; placeholder: string }>;
  steps: string[];
  url?: string;
}

interface SavedIntegration {
  id: string;
  provider: string;
  is_connected: boolean;
  config: any;
  last_sync_at: string | null;
  sync_count: number;
}

// ---------------------------------------------------------------------------
// Integration definitions
// ---------------------------------------------------------------------------

const FUNCTIONS_BASE = import.meta.env.DEV
  ? 'http://localhost:8888/.netlify/functions'
  : '/.netlify/functions';

const integrations: Integration[] = [
  {
    id: 'hubspot',
    name: 'HubSpot',
    logo: 'https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png',
    subtitle: 'CRM & Lead Management',
    description: 'Automatically push new leads and call data into HubSpot CRM.',
    fallbackColor: '#FF7A59',
    type: 'api_key',
    apiLabel: 'HubSpot Private App Token',
    steps: [
      'Go to HubSpot → Settings → Integrations → Private Apps',
      'Create a new private app with "contacts" scope',
      'Copy the access token and paste it below',
    ],
    url: 'https://app.hubspot.com/settings',
  },
  {
    id: 'zapier',
    name: 'Zapier',
    logo: 'https://cdn.zapier.com/zapier/images/favicon.ico',
    subtitle: 'Connect 6,000+ Apps',
    description: 'Send lead data to any app via Zapier webhooks — Slack, Mailchimp, Airtable, and more.',
    fallbackColor: '#FF4F00',
    type: 'webhook',
    webhookLabel: 'Zapier Webhook URL',
    steps: [
      'Create a new Zap in Zapier',
      'Choose "Webhooks by Zapier" as the trigger',
      'Select "Catch Hook" and copy the webhook URL',
      'Paste it below — we\'ll send lead data to this URL',
    ],
    url: 'https://zapier.com/app/zaps',
  },
  {
    id: 'google_sheets',
    name: 'Google Sheets',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg',
    subtitle: 'Simple Lead Tracking',
    description: 'Log every call, lead, and appointment into a Google Sheet automatically.',
    fallbackColor: '#0F9D58',
    type: 'api_key',
    apiLabel: 'Google API Key',
    extraFields: [
      { key: 'spreadsheet_id', label: 'Spreadsheet ID', placeholder: 'e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms' },
      { key: 'sheet_name', label: 'Sheet Name', placeholder: 'Leads' },
    ],
    steps: [
      'Create a Google Sheet with columns: Date, Name, Email, Phone, Source, Status, Notes',
      'Make the sheet publicly editable (or use a service account)',
      'Get a Google API key from console.cloud.google.com',
      'Copy the Spreadsheet ID from the sheet URL',
    ],
    url: 'https://sheets.google.com',
  },
  {
    id: 'calcom',
    name: 'Cal.com',
    logo: '/cal.com_logo.png',
    subtitle: 'Calendar & Scheduling',
    description: 'Already connected — your AI receptionist checks availability and books appointments via Cal.com.',
    fallbackColor: '#292929',
    type: 'api_key',
    apiLabel: 'Cal.com API Key',
    steps: [
      'Go to Cal.com → Settings → Developer → API Keys',
      'Create a new API key',
      'Paste it below',
    ],
    url: 'https://app.cal.com/settings/developer/api-keys',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
    subtitle: 'Messaging',
    description: 'Connect WhatsApp Business to enable messaging with your customers.',
    fallbackColor: '#25D366',
    type: 'coming_soon',
    steps: [],
  },
  {
    id: 'email',
    name: 'Email (Gmail)',
    logo: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico',
    subtitle: 'Email Notifications',
    description: 'Get email notifications for new leads, missed calls, and bookings.',
    fallbackColor: '#EA4335',
    type: 'coming_soon',
    steps: [],
  },
  {
    id: 'jobber',
    name: 'Jobber',
    logo: 'https://getjobber.com/wp-content/uploads/2021/12/cropped-Favicon-192x192.png',
    subtitle: 'Field Service Management',
    description: 'Sync leads as new jobs, schedule site visits, and send quotes.',
    fallbackColor: '#7BC74D',
    type: 'coming_soon',
    steps: [],
  },
  {
    id: 'housecall-pro',
    name: 'Housecall Pro',
    logo: 'https://www.housecallpro.com/wp-content/uploads/2023/07/cropped-favicon-192x192.png',
    subtitle: 'Home Service Management',
    description: 'Turn incoming calls into jobs and dispatch techs.',
    fallbackColor: '#0D6EFD',
    type: 'coming_soon',
    steps: [],
  },
  {
    id: 'servicetitan',
    name: 'ServiceTitan',
    logo: 'https://www.servicetitan.com/favicon.ico',
    subtitle: 'HVAC, Plumbing & Electrical',
    description: 'Sync calls, book jobs, and track leads.',
    fallbackColor: '#1B365D',
    type: 'coming_soon',
    steps: [],
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    logo: 'https://quickbooks.intuit.com/oidam/intuit/sbseg/en_us/universal/icons/qb-favicon-32.png',
    subtitle: 'Invoicing & Accounting',
    description: 'Create invoices automatically when a job is booked.',
    fallbackColor: '#2CA01C',
    type: 'coming_soon',
    steps: [],
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg',
    subtitle: 'Scheduling',
    description: 'Sync your Google Calendar for availability.',
    fallbackColor: '#4285F4',
    type: 'coming_soon',
    steps: [],
  },
  {
    id: 'microsoft',
    name: 'Microsoft 365',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    subtitle: 'Outlook & Teams',
    description: 'Sync with Outlook and Microsoft Teams.',
    fallbackColor: '#00A4EF',
    type: 'coming_soon',
    steps: [],
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const IntegrationsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [savedIntegrations, setSavedIntegrations] = useState<SavedIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [testing, setTesting] = useState(false);
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());

  // Form state
  const [formApiKey, setFormApiKey] = useState('');
  const [formWebhookUrl, setFormWebhookUrl] = useState('');
  const [formExtra, setFormExtra] = useState<Record<string, string>>({});

  // Load saved integrations
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`${FUNCTIONS_BASE}/integration-sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'list', userId: user.id }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.integrations) setSavedIntegrations(data.integrations);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const isConnected = (provider: string) =>
    savedIntegrations.some(i => i.provider === provider && i.is_connected);

  const getSyncInfo = (provider: string) =>
    savedIntegrations.find(i => i.provider === provider);

  const openPanel = (id: string) => {
    setActivePanel(id);
    setFormApiKey('');
    setFormWebhookUrl('');
    setFormExtra({});
  };

  const closePanel = () => setActivePanel(null);

  // Test connection
  const handleTest = async (integration: Integration) => {
    setTesting(true);
    try {
      const res = await fetch(`${FUNCTIONS_BASE}/integration-sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test',
          provider: integration.id,
          apiKey: formApiKey,
          webhookUrl: formWebhookUrl,
          config: formExtra,
        }),
      });
      const data = await res.json();
      showToast({
        message: data.success ? data.message || 'Connection verified!' : data.error || 'Connection failed',
        variant: data.success ? 'success' : 'error',
      });
    } catch {
      showToast({ message: 'Test failed', variant: 'error' });
    } finally {
      setTesting(false);
    }
  };

  // Connect integration
  const handleConnect = async (integration: Integration) => {
    if (!user) return;
    setConnecting(true);
    try {
      const res = await fetch(`${FUNCTIONS_BASE}/integration-sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'connect',
          userId: user.id,
          provider: integration.id,
          apiKey: formApiKey || undefined,
          webhookUrl: formWebhookUrl || undefined,
          config: Object.keys(formExtra).length > 0 ? formExtra : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedIntegrations(prev => {
          const existing = prev.findIndex(i => i.provider === integration.id);
          const newItem: SavedIntegration = {
            id: data.integration?.id || '',
            provider: integration.id,
            is_connected: true,
            config: formExtra,
            last_sync_at: null,
            sync_count: 0,
          };
          if (existing >= 0) {
            const updated = [...prev];
            updated[existing] = { ...updated[existing], is_connected: true };
            return updated;
          }
          return [...prev, newItem];
        });
        showToast({ message: `${integration.name} connected!`, variant: 'success' });
        closePanel();
      } else {
        showToast({ message: data.error || 'Connection failed', variant: 'error' });
      }
    } catch {
      showToast({ message: 'Connection failed', variant: 'error' });
    } finally {
      setConnecting(false);
    }
  };

  // Disconnect integration
  const handleDisconnect = async (integration: Integration) => {
    if (!user) return;
    try {
      await fetch(`${FUNCTIONS_BASE}/integration-sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'disconnect', userId: user.id, provider: integration.id }),
      });
      setSavedIntegrations(prev =>
        prev.map(i => i.provider === integration.id ? { ...i, is_connected: false } : i)
      );
      showToast({ message: `${integration.name} disconnected`, variant: 'default' });
      closePanel();
    } catch {
      showToast({ message: 'Failed to disconnect', variant: 'error' });
    }
  };

  // Sort: connected first, then active integrations, then coming soon
  const sorted = [...integrations].sort((a, b) => {
    const aConn = isConnected(a.id) ? 0 : 1;
    const bConn = isConnected(b.id) ? 0 : 1;
    if (aConn !== bConn) return aConn - bConn;
    const aActive = a.type !== 'coming_soon' ? 0 : 1;
    const bActive = b.type !== 'coming_soon' ? 0 : 1;
    return aActive - bActive;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
        <p className="text-gray-500 mt-1">
          Connect your CRM and tools — leads sync automatically when calls come in.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="flex gap-4">
        <div className="bg-white rounded-lg border px-4 py-3 flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <Check className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Connected</p>
            <p className="text-lg font-bold text-gray-900">{savedIntegrations.filter(i => i.is_connected).length}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border px-4 py-3 flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <ExternalLink className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Syncs</p>
            <p className="text-lg font-bold text-gray-900">{savedIntegrations.reduce((s, i) => s + (i.sync_count || 0), 0)}</p>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-brand-blue mr-3" />
          <span className="text-gray-500">Loading integrations...</span>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {sorted.map((integration) => {
            const connected = isConnected(integration.id);
            const syncInfo = getSyncInfo(integration.id);
            const comingSoon = integration.type === 'coming_soon';

            return (
              <div
                key={integration.id}
                className={`bg-white rounded-xl border p-6 transition-all duration-200 flex flex-col ${
                  comingSoon
                    ? 'border-gray-100 opacity-60'
                    : connected
                    ? 'border-green-200 hover:shadow-lg cursor-pointer'
                    : 'border-gray-200 hover:shadow-lg hover:border-blue-200 cursor-pointer'
                }`}
                onClick={() => !comingSoon && openPanel(integration.id)}
              >
                {/* Logo + status */}
                <div className="mb-5 flex items-center justify-between">
                  {imgErrors.has(integration.id) ? (
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: integration.fallbackColor }}
                    >
                      <span className="text-white font-bold text-lg">{integration.name[0]}</span>
                    </div>
                  ) : (
                    <img
                      src={integration.logo}
                      alt={integration.name}
                      className="w-10 h-10 rounded-lg object-contain"
                      onError={() => setImgErrors(prev => new Set(prev).add(integration.id))}
                    />
                  )}
                  {connected && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      <Check className="w-3 h-3" /> Connected
                    </span>
                  )}
                  {comingSoon && (
                    <span className="text-xs font-medium text-gray-400">Coming Soon</span>
                  )}
                </div>

                <h3 className="text-base font-semibold text-gray-900">{integration.name}</h3>
                <p className="text-sm text-gray-500 mt-1 flex-1">{integration.description}</p>

                {/* Sync info */}
                {connected && syncInfo && (
                  <p className="text-xs text-gray-400 mt-2">
                    {syncInfo.sync_count > 0
                      ? `${syncInfo.sync_count} leads synced`
                      : 'No syncs yet'}
                  </p>
                )}

                {/* Button */}
                <div className="mt-5 pt-5 border-t border-dashed border-gray-200">
                  <button
                    className={`inline-flex items-center gap-1 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                      connected
                        ? 'text-green-700 bg-green-50 hover:bg-green-100'
                        : comingSoon
                        ? 'text-gray-400 bg-gray-50 cursor-not-allowed'
                        : 'text-gray-700 bg-gray-100 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!comingSoon) openPanel(integration.id);
                    }}
                    disabled={comingSoon}
                  >
                    {connected ? 'Manage' : comingSoon ? 'Coming Soon' : 'Connect'}
                    {!comingSoon && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
                  </button>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* ─── Side Panel ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {activePanel && (() => {
          const integration = integrations.find(i => i.id === activePanel);
          if (!integration || integration.type === 'coming_soon') return null;
          const connected = isConnected(integration.id);

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
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      {imgErrors.has(integration.id) ? (
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: integration.fallbackColor }}>
                          <span className="text-white font-bold text-sm">{integration.name[0]}</span>
                        </div>
                      ) : (
                        <img src={integration.logo} alt={integration.name} className="w-8 h-8 rounded-lg object-contain" onError={() => setImgErrors(prev => new Set(prev).add(integration.id))} />
                      )}
                      <h2 className="text-xl font-semibold text-gray-900">{integration.name}</h2>
                    </div>
                    <button onClick={closePanel} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  {/* Connected status */}
                  {connected && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Connected</span>
                      </div>
                      <button
                        onClick={() => handleDisconnect(integration)}
                        className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                      >
                        <Unplug className="w-3 h-3" />
                        Disconnect
                      </button>
                    </div>
                  )}

                  {/* Steps */}
                  <h3 className="text-lg font-medium text-gray-900 mb-3">How to connect</h3>
                  <ol className="space-y-3 mb-6">
                    {integration.steps.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span
                          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ backgroundColor: integration.fallbackColor }}
                        >
                          {i + 1}
                        </span>
                        <span className="text-sm text-gray-600">{step}</span>
                      </li>
                    ))}
                  </ol>

                  <div className="border-t border-gray-200 mb-6" />

                  {/* API Key field */}
                  {integration.type === 'api_key' && integration.apiLabel && (
                    <div className="space-y-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{integration.apiLabel}</label>
                        <input
                          type="password"
                          value={formApiKey}
                          onChange={(e) => setFormApiKey(e.target.value)}
                          placeholder={`Enter your ${integration.name} API key`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>

                      {/* Extra fields */}
                      {integration.extraFields?.map((field) => (
                        <div key={field.key}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                          <input
                            type="text"
                            value={formExtra[field.key] || ''}
                            onChange={(e) => setFormExtra(prev => ({ ...prev, [field.key]: e.target.value }))}
                            placeholder={field.placeholder}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Webhook URL field */}
                  {integration.type === 'webhook' && (
                    <div className="space-y-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{integration.webhookLabel || 'Webhook URL'}</label>
                        <input
                          type="url"
                          value={formWebhookUrl}
                          onChange={(e) => setFormWebhookUrl(e.target.value)}
                          placeholder="https://hooks.zapier.com/hooks/catch/..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="space-y-3">
                    {/* Test button */}
                    {(formApiKey || formWebhookUrl) && (
                      <button
                        onClick={() => handleTest(integration)}
                        disabled={testing}
                        className="w-full flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                      >
                        {testing ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Testing...</>
                        ) : (
                          <><AlertCircle className="w-4 h-4" /> Test Connection</>
                        )}
                      </button>
                    )}

                    {/* Connect button */}
                    <button
                      onClick={() => handleConnect(integration)}
                      disabled={connecting || (!formApiKey && !formWebhookUrl && !connected)}
                      className="w-full text-white py-2.5 px-4 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-50"
                      style={{ backgroundColor: integration.fallbackColor }}
                    >
                      {connecting ? (
                        <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Connecting...</span>
                      ) : connected ? (
                        'Update Connection'
                      ) : (
                        `Connect ${integration.name}`
                      )}
                    </button>
                  </div>

                  {/* Visit link */}
                  {integration.url && (
                    <a href={integration.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mt-4">
                      <ExternalLink className="w-4 h-4" />
                      Visit {integration.name}
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
