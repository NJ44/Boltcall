import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Clock,
  X
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
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [selectedInstruction, setSelectedInstruction] = useState<string | null>(null);
  
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
    if (!user?.id) {
      setIsLoadingLeads(false);
      return;
    }

    setIsLoadingLeads(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
        showToast({
          title: 'Error',
          message: 'Failed to fetch leads',
          variant: 'error',
          duration: 3000
        });
        setLeads([]);
        return;
      }

      if (data) {
        // Map database fields to Lead interface
        const mappedLeads: Lead[] = data.map((lead: any) => ({
          id: lead.id,
          name: lead.name || lead.full_name || `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'Unknown',
          phone: lead.phone || lead.phone_number || '',
          email: lead.email || '',
          source: lead.source || lead.acquisition_source || lead.source_type || 'Unknown',
          status: lead.status || 'pending',
          createdAt: lead.created_at || lead.createdAt || new Date().toISOString(),
          assignedAgentId: lead.assigned_agent_id || lead.assignedAgentId || config?.assignedAgentId || undefined
        }));

        setLeads(mappedLeads);
      } else {
        setLeads([]);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      showToast({
        title: 'Error',
        message: 'Failed to fetch leads',
        variant: 'error',
        duration: 3000
      });
      setLeads([]);
    } finally {
      setIsLoadingLeads(false);
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

  const openInstructionModal = (instructionType: string) => {
    setSelectedInstruction(instructionType);
  };

  const closeInstructionModal = () => {
    setSelectedInstruction(null);
  };

  return (
    <div className="space-y-8">
      {/* Current Configuration - Minimal */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Assigned Agent */}
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Assigned Agent</div>
              <div className="text-base font-medium text-gray-900 dark:text-white mt-0.5">
                {assignedAgent ? assignedAgent.name : 'No agent assigned'}
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">System Status</div>
              <div className="flex items-center gap-2 mt-0.5">
                {config?.isActive ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-base font-medium text-green-600">Active</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-base font-medium text-gray-500 dark:text-gray-400">Inactive</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Leads</h2>
        </div>
        
        {isLoadingLeads ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-4">Loading leads...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No leads found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Leads will appear here once you start receiving them</p>
          </div>
        ) : (
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
                  {lead.phone || 'N/A'}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100 flex-1">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {lead.email || 'N/A'}
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
        )}
      </div>

      {/* Setup Instructions - Buttons */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-5">Setup Instructions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Website Forms Button */}
          <button
            onClick={() => openInstructionModal('website')}
            className="group relative flex items-center gap-4 p-6 rounded-xl bg-white/80 dark:bg-gray-900/60 backdrop-blur border border-white/20 ring-1 ring-gray-200/60 dark:ring-gray-700/60 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 hover:ring-purple-400/40"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/15 to-purple-600/10 dark:from-purple-400/15 dark:to-purple-500/10 flex items-center justify-center group-hover:from-purple-500/25 group-hover:to-purple-600/20 transition-colors">
              <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-left">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Website Forms</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Any platform</p>
            </div>
          </button>

          {/* Google Ads Button */}
          <button
            onClick={() => openInstructionModal('google')}
            className="group relative flex items-center gap-4 p-6 rounded-xl bg-white/80 dark:bg-gray-900/60 backdrop-blur border border-white/20 ring-1 ring-gray-200/60 dark:ring-gray-700/60 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 hover:ring-blue-400/40"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/15 to-blue-600/10 dark:from-blue-400/15 dark:to-blue-500/10 flex items-center justify-center group-hover:from-blue-500/25 group-hover:to-blue-600/20 transition-colors">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Google Ads</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Lead Form</p>
            </div>
          </button>

          {/* Facebook Ads Button */}
          <button
            onClick={() => openInstructionModal('facebook')}
            className="group relative flex items-center gap-4 p-6 rounded-xl bg-white/80 dark:bg-gray-900/60 backdrop-blur border border-white/20 ring-1 ring-gray-200/60 dark:ring-gray-700/60 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 hover:ring-blue-400/40"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/15 to-blue-600/10 dark:from-blue-400/15 dark:to-blue-500/10 flex items-center justify-center group-hover:from-blue-500/25 group-hover:to-blue-600/20 transition-colors">
              <Facebook className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Facebook Ads</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Lead Ads</p>
            </div>
          </button>
        </div>
      </div>

      {/* Instruction Modal */}
      <AnimatePresence>
        {selectedInstruction && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeInstructionModal}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {selectedInstruction === 'website' && (
                      <>
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Website Forms (any platform)</h2>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Integrate with any form platform</p>
                        </div>
                      </>
                    )}
                    {selectedInstruction === 'google' && (
                      <>
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Google Ads Lead Form (in-ad form)</h2>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Integrate with Google Ads lead forms</p>
                        </div>
                      </>
                    )}
                    {selectedInstruction === 'facebook' && (
                      <>
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <Facebook className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Facebook (Meta) Lead Ads</h2>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Integrate with Facebook Lead Ads</p>
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    onClick={closeInstructionModal}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Website Forms Instructions */}
                  {selectedInstruction === 'website' && (
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
                  )}

                  {/* Google Ads Instructions */}
                  {selectedInstruction === 'google' && (
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
                  )}

                  {/* Facebook Ads Instructions */}
                  {selectedInstruction === 'facebook' && (
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
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpeedToLeadPage;