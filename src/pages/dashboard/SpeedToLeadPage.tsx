import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Copy, 
  Globe, 
  Zap, 
  Facebook,
  AlertCircle,
  User,
  Phone,
  Mail,
  Clock
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import CardTable from '../../components/ui/CardTable';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  status: string;
  createdAt: string;
  assignedAgentId?: string;
}

interface SpeedToLeadConfig {
  assignedAgentId: string | null;
  isActive: boolean;
  workspaceId: string;
  sharedToken: string;
}

const SpeedToLeadPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [config, setConfig] = useState<SpeedToLeadConfig | null>(null);
  const [assignedAgent, setAssignedAgent] = useState<any>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  
  // Get domain from window location
  const domain = typeof window !== 'undefined' ? window.location.origin : 'YOUR-DOMAIN';
  
  // Get workspace ID and shared token (mock for now, should come from workspace/user settings)
  const workspaceId = config?.workspaceId || 'WORKSPACE_ID';
  const sharedToken = config?.sharedToken || 'SHARED_TOKEN';
  
  const liveWebhookUrl = `${domain}/hooks/lead?client_id=${workspaceId}&secret=${sharedToken}`;
  const testWebhookUrl = `${domain}/hooks/lead-test?client_id=${workspaceId}&secret=${sharedToken}`;

  useEffect(() => {
    if (user?.id) {
      fetchSpeedToLeadConfig();
    }
  }, [user?.id]);

  useEffect(() => {
    if (!config || !user?.id) return;
    
    if (config.assignedAgentId) {
      fetchAssignedAgent();
    }
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, user?.id]);

  const fetchSpeedToLeadConfig = async () => {
    try {
      // Fetch from Supabase - you'll need to create a speed_to_lead_config table
      // For now, using mock data
      const mockConfig: SpeedToLeadConfig = {
        assignedAgentId: null, // Will be fetched from actual config
        isActive: true,
        workspaceId: 'workspace_123',
        sharedToken: 'token_abc123'
      };
      setConfig(mockConfig);
    } catch (error) {
      console.error('Error fetching Speed to Lead config:', error);
    }
  };

  const fetchAssignedAgent = async () => {
    if (!user?.id || !config?.assignedAgentId) {
      setAssignedAgent(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('agents')
        .select('id, name, agent_type')
        .eq('id', config.assignedAgentId)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching assigned agent:', error);
      } else {
        setAssignedAgent(data);
      }
    } catch (error) {
      console.error('Error fetching assigned agent:', error);
    }
  };

  const fetchLeads = async () => {
    if (!user?.id) return;

    try {
      // Fetch leads from Supabase - you'll need a leads table
      // For now, using mock data
      const mockLeads: Lead[] = [
        {
          id: '1',
          name: 'John Doe',
          phone: '+14155550123',
          email: 'john@example.com',
          source: 'Website Form',
          status: 'contacted',
          createdAt: new Date().toISOString(),
          assignedAgentId: config?.assignedAgentId || undefined
        },
        {
          id: '2',
          name: 'Jane Smith',
          phone: '+14155550124',
          email: 'jane@example.com',
          source: 'Google Ads',
          status: 'pending',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '3',
          name: 'Bob Johnson',
          phone: '+14155550125',
          email: 'bob@example.com',
          source: 'Facebook Ads',
          status: 'contacted',
          createdAt: new Date(Date.now() - 7200000).toISOString()
        }
      ];

      setLeads(mockLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    showToast({
      title: 'Copied!',
      message: `${type} copied to clipboard`,
      variant: 'success',
      duration: 3000
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Speed to Lead</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Configure your lead capture system to automatically respond to leads within seconds
          </p>
        </div>
      </div>

      {/* Current Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Current Configuration</h2>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
              config?.isActive 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {config?.isActive ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Active
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  Inactive
                </>
              )}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Assigned Agent */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Assigned Agent</span>
            </div>
            {assignedAgent ? (
              <div className="mt-2">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{assignedAgent.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">ID: {assignedAgent.id}</p>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 mt-2">No agent assigned</p>
            )}
          </div>

          {/* System Status */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">System Status</span>
            </div>
            <div className="mt-2">
              {config?.isActive ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">System Active</p>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">System Inactive</p>
                </div>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Leads will {config?.isActive ? 'automatically' : 'not'} trigger calls
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Leads</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            All leads captured through Speed to Lead system
          </p>
        </div>
        
        <CardTable
          columns={[
            { key: 'name', label: 'Name', width: '20%' },
            { key: 'phone', label: 'Phone', width: '20%' },
            { key: 'email', label: 'Email', width: '25%' },
            { key: 'source', label: 'Source', width: '15%' },
            { key: 'status', label: 'Status', width: '10%' },
            { key: 'createdAt', label: 'Created', width: '10%' }
          ]}
          data={leads}
          renderRow={(lead) => (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="font-medium text-gray-900 dark:text-white">{lead.name}</div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100 flex-1">
                <Phone className="w-4 h-4 text-gray-400" />
                {lead.phone}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100 flex-1">
                <Mail className="w-4 h-4 text-gray-400" />
                {lead.email}
              </div>
              
              <div className="flex-1">
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                  {lead.source}
                </span>
              </div>
              
              <div className="flex-1">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  lead.status === 'contacted'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {lead.status}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 flex-1">
                <Clock className="w-4 h-4" />
                {formatDate(lead.createdAt)}
              </div>
            </div>
          )}
        />
      </div>

      {/* Setup Instructions */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Setup Instructions</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Choose your lead source and follow the setup instructions below
          </p>
        </div>

        {/* 1. Website Forms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">1) Website Forms (any platform)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Integrate with any form platform</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your webhook URL (live):
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-mono text-gray-900 dark:text-gray-100">
                  {liveWebhookUrl}
                </code>
                <button
                  onClick={() => copyToClipboard(liveWebhookUrl, 'Live webhook URL')}
                  className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Test-only URL (no calls placed):
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-mono text-gray-900 dark:text-gray-100">
                  {testWebhookUrl}
                </code>
                <button
                  onClick={() => copyToClipboard(testWebhookUrl, 'Test webhook URL')}
                  className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">What you do</h4>
              <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-200 list-decimal list-inside">
                <li>In your form tool, add a "webhook" or "post to URL" action.</li>
                <li>Paste the URL above. Method must be POST.</li>
                <li>Send at least phone or email. That's enough to trigger Speed-to-Lead.</li>
                <li>Submit a test lead. You should see 200 OK. In test mode we only log it.</li>
              </ol>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Notes</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                <li>Works with: JSON, x-www-form-urlencoded, or multipart/form-data.</li>
                <li>Phone format: best is E.164 (example +14155550123). If you don't include a country code, we'll assume the business's default country.</li>
                <li>Optional field names: keep whatever you have (full_name, contactPhone, etc.). We auto-detect and normalize.</li>
                <li>If you want to force mapping without changing your form, add to the URL:
                  <code className="ml-1 px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">
                    &map_phone=contactPhone&map_name=full_name&map_email=emailAddress
                  </code>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* 2. Google Ads Lead Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">2) Google Ads Lead Form (in-ad form)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Integrate with Google Ads lead forms</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">What you do</h4>
              <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-200 list-decimal list-inside">
                <li>In Google Ads, open your Lead form asset (or create one).</li>
                <li>Find Webhook integration (sometimes called "Lead delivery").</li>
                <li>Paste:
                  <div className="mt-2 ml-4">
                    <p className="font-medium mb-1">Webhook URL = <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs">{liveWebhookUrl}</code></p>
                    <p className="font-medium">Key/Secret = <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs">{sharedToken}</code> (use the same one)</p>
                  </div>
                </li>
                <li>Click Send test data. You should see the test in our dashboard.</li>
                <li>Attach the lead form asset to your campaign and publish.</li>
              </ol>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Notes</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                <li>Google sends a standard payload. You don't need to rename fields.</li>
                <li>Phone or email is enough to trigger the call.</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* 3. Facebook (Meta) Lead Ads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Facebook className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">3) Facebook (Meta) Lead Ads</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Integrate with Facebook Lead Ads</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Option A: Zapier/Make */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-gray-900 dark:text-white">A) Easiest — use Zapier/Make as a bridge</h4>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-200 list-decimal list-inside">
                  <li>Create a Zap/Scenario with Facebook Lead Ads as the trigger. Choose your Page and Lead Form.</li>
                  <li>Action = Webhooks by Zapier (or HTTP in Make) → POST to:
                    <code className="ml-1 px-1 py-0.5 bg-white dark:bg-gray-800 rounded text-xs">
                      {liveWebhookUrl}
                    </code>
                  </li>
                  <li>Send the lead fields as JSON. Test, then publish.</li>
                </ol>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                This avoids Meta app setup and works in minutes.
              </p>
            </div>

            {/* Option B: Direct */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900 dark:text-white">B) Direct — connect your Page to our app</h4>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-200 list-decimal list-inside">
                  <li>We'll send you a short link to approve our Meta App for your Facebook Page (Page admin required).</li>
                  <li>Click Continue and approve requested permissions for lead delivery.</li>
                  <li>We'll subscribe your Page to leadgen webhooks on our side.</li>
                  <li>In Ads Manager → Testing Tool for Lead Ads, send a test lead. You should see it in our dashboard.</li>
                </ol>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Notes</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                <li>With the direct method, Meta's webhook gives us a leadgen_id. We fetch the full lead securely on our side.</li>
                <li>No changes to your forms or field names.</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SpeedToLeadPage;
