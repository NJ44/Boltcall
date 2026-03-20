import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  PhoneCall,
  Clock,
  AlertCircle,
  Eye,
  Play,
  MessageSquare,
  Save,
  Loader2,
  Check,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Monitor,
  ArrowRight,
} from 'lucide-react';
import { CallHistorySkeleton } from '../../components/ui/loading-skeleton';
import CardTableWithPanel from '../../components/ui/CardTableWithPanel';
import { getRetellCallHistory, type RetellCall } from '../../lib/retell';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useTokens } from '../../contexts/TokenContext';
import { useNavigate } from 'react-router-dom';

// Threshold in ms — calls shorter than this are considered missed/abandoned
const MISSED_CALL_DURATION_THRESHOLD = 15000; // 15 seconds

const DEFAULT_TEMPLATE =
  "Hi! We noticed we missed your call at {{business_name}}. How can we help? Reply to this text or call us back. We're here for you!";

interface MissedCallConfig {
  enabled: boolean;
  template: string;
  delay_minutes: number;
  updated_at?: string;
}

interface MissedCallDisplay {
  id: string;
  callerPhone: string;
  missedAt: number; // timestamp ms
  duration: string;
  status: 'not_connected' | 'short_call' | 'error';
  statusLabel: string;
  agentName: string;
  disconnectionReason?: string;
  callSummary?: string;
  recordingUrl?: string;
  rawCall: RetellCall;
}

const MissedCallsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { claimReward } = useTokens();
  const navigate = useNavigate();

  // Config state
  const [configLoading, setConfigLoading] = useState(true);
  const [config, setConfig] = useState<MissedCallConfig>({
    enabled: false,
    template: DEFAULT_TEMPLATE,
    delay_minutes: 0,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Setup banner state
  const [showForwardingGuide, setShowForwardingGuide] = useState(false);
  const [boltcallPhone, setBoltcallPhone] = useState<string | null>(null);
  const [hasPhoneNumber, setHasPhoneNumber] = useState(false);

  // Missed calls state
  const [missedCalls, setMissedCalls] = useState<MissedCallDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCall, setSelectedCall] = useState<MissedCallDisplay | null>(null);
  const [showEditPanel, setShowEditPanel] = useState(false);

  // Stats
  const [textbacksSent, setTextbacksSent] = useState(0);

  // Format duration from ms
  const formatDuration = (ms?: number): string => {
    if (!ms || ms <= 0) return '0:00';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Determine the status bucket for a call
  const classifyMissedCall = (call: RetellCall): 'not_connected' | 'short_call' | 'error' | null => {
    if (call.call_status === 'not_connected') return 'not_connected';
    if (call.call_status === 'error') return 'error';
    if (call.call_status === 'ended' && call.duration_ms != null && call.duration_ms < MISSED_CALL_DURATION_THRESHOLD) {
      return 'short_call';
    }
    return null;
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'not_connected': return 'Not Connected';
      case 'short_call': return 'Abandoned';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'not_connected': return 'bg-red-100 text-red-800';
      case 'short_call': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Extract phone number from the raw Retell call object
  const extractCallerPhone = (call: RetellCall): string => {
    const raw = call as Record<string, any>;
    if (call.direction === 'inbound') {
      return raw.from_number || raw.caller_number || 'Unknown';
    }
    return raw.to_number || raw.from_number || 'Unknown';
  };

  // Fetch user's agent IDs from Supabase
  const fetchUserAgentIds = async (): Promise<string[]> => {
    if (!user?.id) return [];
    try {
      const { data: agents, error } = await supabase
        .from('agents')
        .select('retell_agent_id')
        .eq('user_id', user.id)
        .not('retell_agent_id', 'is', null);

      if (error) throw error;
      return agents?.map(a => a.retell_agent_id).filter(Boolean) || [];
    } catch (err) {
      console.error('Error fetching user agents:', err);
      return [];
    }
  };

  // Load config + phone number + text-back count
  useEffect(() => {
    if (!user?.id) return;

    (async () => {
      try {
        // Load missed call config
        const { data: featureRow } = await supabase
          .from('business_features')
          .select('missed_call_config')
          .eq('user_id', user.id)
          .single();

        if (featureRow?.missed_call_config) {
          const cfg = featureRow.missed_call_config as Record<string, any>;
          setConfig({
            enabled: cfg.enabled ?? false,
            template: cfg.template || DEFAULT_TEMPLATE,
            delay_minutes: cfg.delay_minutes ?? 0,
          });
        }

        // Load user's phone number
        const { data: phones } = await supabase
          .from('phone_numbers')
          .select('phone_number')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .limit(1);

        if (phones && phones.length > 0) {
          setBoltcallPhone(phones[0].phone_number);
          setHasPhoneNumber(true);
        }

        // Count text-backs sent (last 7 days)
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const { count } = await supabase
          .from('scheduled_messages')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('type', 'missed_call_textback')
          .in('status', ['sent', 'scheduled'])
          .gte('created_at', weekAgo);

        setTextbacksSent(count || 0);
      } catch (err) {
        console.error('Error loading config:', err);
      }
      setConfigLoading(false);
    })();
  }, [user?.id]);

  // Fetch calls and filter for missed ones
  const fetchMissedCalls = async () => {
    setLoading(true);
    setError(null);

    try {
      const agentIds = await fetchUserAgentIds();
      if (!agentIds.length) {
        setMissedCalls([]);
        setLoading(false);
        return;
      }

      const response = await getRetellCallHistory({ agentIds, limit: 100 });

      const missed: MissedCallDisplay[] = [];

      for (const call of response.calls) {
        const bucket = classifyMissedCall(call);
        if (!bucket) continue;

        missed.push({
          id: call.call_id,
          callerPhone: extractCallerPhone(call),
          missedAt: call.start_timestamp,
          duration: formatDuration(call.duration_ms),
          status: bucket,
          statusLabel: getStatusLabel(bucket),
          agentName: call.agent_name || 'Unknown Agent',
          disconnectionReason: call.disconnection_reason,
          callSummary: call.call_analysis?.call_summary,
          recordingUrl: call.recording_url,
          rawCall: call,
        });
      }

      missed.sort((a, b) => b.missedAt - a.missedAt);
      setMissedCalls(missed);
    } catch (err) {
      console.error('Error fetching missed calls:', err);
      setError('Failed to fetch missed calls. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchMissedCalls();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Save config
  const handleSaveConfig = async () => {
    if (!user?.id) return;
    setSaving(true);

    try {
      const { data: existing } = await supabase
        .from('business_features')
        .select('missed_call_config')
        .eq('user_id', user.id)
        .single();

      const existingConfig = (existing?.missed_call_config || {}) as Record<string, any>;

      const { error: updateError } = await supabase
        .from('business_features')
        .update({
          missed_call_config: {
            ...existingConfig,
            enabled: config.enabled,
            template: config.template,
            delay_minutes: config.delay_minutes,
            updated_at: new Date().toISOString(),
          },
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Failed to save missed call config:', updateError);
        showToast({ title: 'Error', message: 'Failed to save settings', variant: 'error', duration: 4000 });
        setSaving(false);
        return;
      }

      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);

      showToast({ title: 'Saved', message: 'Missed call text-back settings saved', variant: 'success', duration: 3000 });

      // Claim reward
      const rewardResult = await claimReward('configure_reminders');
      if (rewardResult?.success && !rewardResult?.alreadyClaimed) {
        showToast({ title: 'Bonus Tokens!', message: '+25 tokens earned for configuring text-back', variant: 'success', duration: 4000 });
      }
    } catch (err) {
      console.error('Save error:', err);
      showToast({ title: 'Error', message: 'Something went wrong', variant: 'error', duration: 4000 });
      setSaving(false);
    }
  };

  const handleViewDetails = (call: MissedCallDisplay) => {
    setSelectedCall(call);
    setShowEditPanel(true);
  };

  const buildTelHref = (phone: string): string => {
    const digits = phone.replace(/[^+\d]/g, '');
    return `tel:${digits}`;
  };

  if (configLoading && loading) {
    return (
      <div className="space-y-6">
        <CallHistorySkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section A: Setup Banner — show if no phone number configured */}
      {!hasPhoneNumber && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-1">Set up Missed Call Text-Back</h2>
          <p className="text-sm text-gray-600 mb-5">
            Choose how callers reach your AI receptionist. When calls are missed, we'll automatically text them back.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Option 1: Use a Boltcall Number */}
            <div className="bg-white rounded-lg border border-blue-200 p-5 relative">
              <span className="absolute -top-2.5 left-4 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                Recommended
              </span>
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Use a Boltcall Number</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Get a dedicated AI phone number. All calls go through your AI receptionist.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/dashboard/phone-numbers')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get a Phone Number
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Option 2: Forward from Your Number */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Smartphone className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Forward from Your Number</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Keep your existing number and forward unanswered calls to Boltcall.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowForwardingGuide(!showForwardingGuide)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                {showForwardingGuide ? 'Hide' : 'Show'} Setup Guide
                {showForwardingGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Forwarding Guide - expandable */}
          {showForwardingGuide && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 bg-white rounded-lg border border-gray-200 p-5 space-y-4"
            >
              {boltcallPhone && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-600 font-medium mb-1">Your Boltcall Number</p>
                  <p className="text-lg font-bold text-blue-900">{boltcallPhone}</p>
                  <p className="text-xs text-blue-600 mt-1">Forward your calls to this number</p>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">iPhone</p>
                    <p className="text-xs text-gray-600">
                      Settings &rarr; Phone &rarr; Call Forwarding &rarr; Enable &rarr; Enter your Boltcall number.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Or dial <code className="bg-gray-100 px-1 rounded">*61*{boltcallPhone || '[Boltcall number]'}#</code> for no-answer forwarding only.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Android</p>
                    <p className="text-xs text-gray-600">
                      Phone app &rarr; Settings &rarr; Call Forwarding &rarr; Forward when unanswered &rarr; Enter Boltcall number.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Monitor className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Carrier Codes</p>
                    <div className="text-xs text-gray-600 space-y-1 mt-1">
                      <p><strong>AT&T:</strong> <code className="bg-gray-100 px-1 rounded">*61*{boltcallPhone || '[number]'}#</code></p>
                      <p><strong>T-Mobile:</strong> <code className="bg-gray-100 px-1 rounded">**61*{boltcallPhone || '[number]'}#</code></p>
                      <p><strong>Verizon:</strong> <code className="bg-gray-100 px-1 rounded">*71{boltcallPhone || '[number]'}</code></p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Landline / VoIP</p>
                    <p className="text-xs text-gray-600">
                      Contact your provider to set up "no-answer forwarding" to your Boltcall number.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Section B: Text-Back Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Missed Call Text-Back</h2>
              <p className="text-sm text-gray-500">Automatically text callers when their call is missed</p>
            </div>
          </div>
          {/* Enable toggle */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>

        {config.enabled && (
          <div className="space-y-4">
            {/* Template editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMS Template
              </label>
              <textarea
                value={config.template}
                onChange={(e) => setConfig({ ...config, template: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                placeholder="Enter your text-back message..."
              />
              <p className="text-xs text-gray-400 mt-1">
                Available variables: <code className="bg-gray-100 px-1 rounded">{'{{business_name}}'}</code>, <code className="bg-gray-100 px-1 rounded">{'{{business_phone}}'}</code>
              </p>
            </div>

            {/* Delay selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Send text-back
              </label>
              <select
                value={config.delay_minutes}
                onChange={(e) => setConfig({ ...config, delay_minutes: parseInt(e.target.value) })}
                className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value={0}>Immediately</option>
                <option value={1}>After 1 minute</option>
                <option value={5}>After 5 minutes</option>
              </select>
            </div>

            {/* Save button */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSaveConfig}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : saved ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
              </button>
              <button
                onClick={() => setConfig({ ...config, template: DEFAULT_TEMPLATE, delay_minutes: 0 })}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Reset to default
              </button>
            </div>
          </div>
        )}

        {!config.enabled && (
          <p className="text-sm text-gray-500">
            Enable this feature to automatically send a text message when a call is missed.
          </p>
        )}
      </motion.div>

      {/* Section C: Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Phone className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Missed (7 days)</p>
              <p className="text-2xl font-bold text-gray-900">{missedCalls.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Text-Backs Sent</p>
              <p className="text-2xl font-bold text-gray-900">{textbacksSent}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <PhoneCall className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Response Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {missedCalls.length > 0 && textbacksSent > 0
                  ? `${Math.round((textbacksSent / missedCalls.length) * 100)}%`
                  : '--'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-white rounded-lg shadow-sm border p-12 flex flex-col items-center justify-center">
          <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={fetchMissedCalls}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Section D: Recent Missed Calls Table */}
      {!error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {loading ? (
            <CallHistorySkeleton />
          ) : (
            <CardTableWithPanel
              data={missedCalls}
              columns={[
                { key: 'caller', label: 'Caller', width: '25%' },
                { key: 'missedAt', label: 'Missed At', width: '20%' },
                { key: 'duration', label: 'Duration', width: '10%' },
                { key: 'status', label: 'Status', width: '15%' },
                { key: 'agent', label: 'Agent', width: '15%' },
                { key: 'actions', label: 'Actions', width: '15%' },
              ]}
              renderRow={(call) => (
                <div className="flex items-center gap-6">
                  {/* Caller */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{call.callerPhone}</div>
                      {call.disconnectionReason && (
                        <div className="text-xs text-gray-500">
                          {call.disconnectionReason.replace(/_/g, ' ')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Missed At */}
                  <div className="text-sm text-gray-900 flex-1">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {new Date(call.missedAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(call.missedAt).toLocaleTimeString()}
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="text-sm text-gray-900 flex-1">{call.duration}</div>

                  {/* Status */}
                  <div className="flex-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(call.status)}`}
                    >
                      {call.statusLabel}
                    </span>
                  </div>

                  {/* Agent */}
                  <div className="text-sm text-gray-900 flex-1">{call.agentName}</div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleViewDetails(call)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {call.recordingUrl && (
                      <a
                        href={call.recordingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-900 transition-colors"
                        title="Play recording"
                      >
                        <Play className="w-4 h-4" />
                      </a>
                    )}
                    {call.callerPhone !== 'Unknown' && (
                      <a
                        href={buildTelHref(call.callerPhone)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                        title="Call back"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        Call Back
                      </a>
                    )}
                  </div>
                </div>
              )}
              emptyStateText="No missed calls found"
              emptyStateAnimation="/No_Data_Preview.lottie"
              showEditPanel={showEditPanel}
              onCloseEditPanel={() => {
                setShowEditPanel(false);
                setSelectedCall(null);
              }}
              editPanelTitle="Missed Call Details"
              editPanelContent={
                selectedCall ? (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Caller Phone
                      </label>
                      <p className="text-sm font-medium text-gray-900">{selectedCall.callerPhone}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Time
                      </label>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedCall.missedAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Duration
                      </label>
                      <p className="text-sm text-gray-900">{selectedCall.duration}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Status
                      </label>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedCall.status)}`}
                      >
                        {selectedCall.statusLabel}
                      </span>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Agent
                      </label>
                      <p className="text-sm text-gray-900">{selectedCall.agentName}</p>
                    </div>
                    {selectedCall.disconnectionReason && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Disconnection Reason
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedCall.disconnectionReason.replace(/_/g, ' ')}
                        </p>
                      </div>
                    )}
                    {selectedCall.callSummary && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          AI Summary
                        </label>
                        <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                          {selectedCall.callSummary}
                        </p>
                      </div>
                    )}
                    {selectedCall.recordingUrl && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Recording
                        </label>
                        <audio controls className="w-full mt-1">
                          <source src={selectedCall.recordingUrl} type="audio/wav" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                    {selectedCall.callerPhone !== 'Unknown' && (
                      <a
                        href={buildTelHref(selectedCall.callerPhone)}
                        className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <PhoneCall className="w-4 h-4" />
                        Call Back {selectedCall.callerPhone}
                      </a>
                    )}
                  </div>
                ) : null
              }
            />
          )}
        </motion.div>
      )}
    </div>
  );
};

export default MissedCallsPage;
