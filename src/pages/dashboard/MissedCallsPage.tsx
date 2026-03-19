import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, PhoneCall, Clock, AlertCircle, Eye, XCircle, Play } from 'lucide-react';
import { CallHistorySkeleton } from '../../components/ui/loading-skeleton';
import CardTableWithPanel from '../../components/ui/CardTableWithPanel';
import { getRetellCallHistory, type RetellCall } from '../../lib/retell';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

// Threshold in ms — calls shorter than this are considered missed/abandoned
const MISSED_CALL_DURATION_THRESHOLD = 15000; // 15 seconds

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
  const [missedCalls, setMissedCalls] = useState<MissedCallDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCall, setSelectedCall] = useState<MissedCallDisplay | null>(null);
  const [showEditPanel, setShowEditPanel] = useState(false);

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
    // Calls that connected but were very short (caller hung up quickly)
    if (call.call_status === 'ended' && call.duration_ms != null && call.duration_ms < MISSED_CALL_DURATION_THRESHOLD) {
      return 'short_call';
    }
    return null; // not a missed call
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
    // Retell API returns from_number / to_number at the top level, but our TS interface
    // doesn't declare them. They come through in the raw JSON response.
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

      // Fetch a larger set so we have enough after filtering
      const response = await getRetellCallHistory({
        agentIds,
        limit: 100,
      });

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

      // Sort by most recent first
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

  const handleViewDetails = (call: MissedCallDisplay) => {
    setSelectedCall(call);
    setShowEditPanel(true);
  };

  // Build a clean tel: href from whatever phone string we have
  const buildTelHref = (phone: string): string => {
    const digits = phone.replace(/[^+\d]/g, '');
    return `tel:${digits}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <CallHistorySkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Phone className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Missed</p>
              <p className="text-2xl font-bold text-gray-900">{missedCalls.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Not Connected</p>
              <p className="text-2xl font-bold text-gray-900">
                {missedCalls.filter(c => c.status === 'not_connected').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Abandoned (Short)</p>
              <p className="text-2xl font-bold text-gray-900">
                {missedCalls.filter(c => c.status === 'short_call').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Missed Calls Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <CardTableWithPanel
          data={missedCalls}
          columns={[
            { key: 'caller', label: 'Caller', width: '25%' },
            { key: 'missedAt', label: 'Missed At', width: '20%' },
            { key: 'duration', label: 'Duration', width: '10%' },
            { key: 'status', label: 'Status', width: '15%' },
            { key: 'agent', label: 'Agent', width: '15%' },
            { key: 'actions', label: 'Actions', width: '15%' }
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
              <div className="text-sm text-gray-900 flex-1">
                {call.duration}
              </div>

              {/* Status */}
              <div className="flex-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(call.status)}`}>
                  {call.statusLabel}
                </span>
              </div>

              {/* Agent */}
              <div className="text-sm text-gray-900 flex-1">
                {call.agentName}
              </div>

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
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedCall.status)}`}>
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
      </motion.div>
    </div>
  );
};

export default MissedCallsPage;
