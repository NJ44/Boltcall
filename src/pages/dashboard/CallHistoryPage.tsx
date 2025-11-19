import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CallHistorySkeleton } from '../../components/ui/loading-skeleton';
import { 
  Phone, 
  PhoneIncoming, 
  PhoneOutgoing, 
  Clock, 
  User,
  Play,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { getRetellCallHistory, type RetellCall } from '../../lib/retell';
import { supabase } from '../../lib/supabase';

const CallHistoryPage: React.FC = () => {
  const [calls, setCalls] = useState<RetellCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [directionFilter, setDirectionFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  });
  const [selectedCall, setSelectedCall] = useState<RetellCall | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch user's agents from Supabase
  const fetchUserAgents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: agents, error } = await supabase
        .from('agents')
        .select('retell_agent_id')
        .eq('user_id', user.id)
        .not('retell_agent_id', 'is', null);

      if (error) throw error;

      const agentIds = agents?.map(agent => agent.retell_agent_id).filter(Boolean) || [];
      return agentIds;
    } catch (error) {
      console.error('Error fetching user agents:', error);
      return [];
    }
  };

  // Fetch call history from Retell AI
  const fetchCallHistory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const agentIds = await fetchUserAgents();
      
      if (!agentIds || agentIds.length === 0) {
        setCalls([]);
        setLoading(false);
        return;
      }

      const params: any = {
        agentIds,
        limit: 100
      };

      // Add filters
      if (statusFilter !== 'all') {
        params.callStatus = [statusFilter];
      }

      if (directionFilter !== 'all') {
        params.direction = [directionFilter];
      }

      if (dateRange.start) {
        params.startDate = new Date(dateRange.start);
      }

      if (dateRange.end) {
        params.endDate = new Date(dateRange.end);
      }

      const response = await getRetellCallHistory(params);
      setCalls(response.calls);
    } catch (error) {
      console.error('Error fetching call history:', error);
      setError('Failed to fetch call history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCallHistory();
  }, [statusFilter, directionFilter, dateRange]);

  // Filter calls based on search term
  const filteredCalls = calls.filter(call => 
    call.agent_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.call_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.transcript?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format duration
  const formatDuration = (ms?: number) => {
    if (!ms) return 'N/A';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ended': return 'text-green-600 bg-green-100';
      case 'registered': return 'text-blue-600 bg-blue-100';
      case 'not_connected': return 'text-red-600 bg-red-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ended': return <CheckCircle className="w-4 h-4" />;
      case 'not_connected': return <XCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Get sentiment color
  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      case 'neutral': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Calls</p>
              <p className="text-2xl font-bold text-gray-900">{filteredCalls.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Successful</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredCalls.filter(call => call.call_status === 'ended').length}
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
              <p className="text-sm text-gray-600">Avg Duration</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatDuration(
                  filteredCalls.reduce((acc, call) => acc + (call.duration_ms || 0), 0) / 
                  filteredCalls.filter(call => call.duration_ms).length
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Positive Sentiment</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredCalls.filter(call => call.call_analysis?.user_sentiment === 'Positive').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search calls..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          >
            <option value="all" className="text-black">All Status</option>
            <option value="ended" className="text-black">Ended</option>
            <option value="registered" className="text-black">Registered</option>
            <option value="not_connected" className="text-black">Not Connected</option>
            <option value="error" className="text-black">Error</option>
          </select>

          {/* Direction Filter */}
          <select
            value={directionFilter}
            onChange={(e) => setDirectionFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          >
            <option value="all" className="text-black">All Directions</option>
            <option value="inbound" className="text-black">Inbound</option>
            <option value="outbound" className="text-black">Outbound</option>
          </select>

          {/* Start Date */}
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* End Date */}
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Calls Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <CallHistorySkeleton />
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <span className="ml-3 text-red-600">{error}</span>
          </div>
        ) : filteredCalls.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Phone className="w-8 h-8 text-gray-400" />
            <span className="ml-3 text-gray-600">No calls found</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Call Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sentiment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCalls.map((call) => (
                  <motion.tr
                    key={call.call_id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {call.direction === 'inbound' ? (
                            <PhoneIncoming className="w-4 h-4 text-green-600" />
                          ) : (
                            <PhoneOutgoing className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {call.call_id.slice(0, 8)}...
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(call.start_timestamp)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900">{call.agent_name}</p>
                      <p className="text-xs text-gray-500">{call.call_type}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(call.call_status)}`}>
                        {getStatusIcon(call.call_status)}
                        {call.call_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDuration(call.duration_ms)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {call.call_analysis?.user_sentiment ? (
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(call.call_analysis.user_sentiment)}`}>
                          {call.call_analysis.user_sentiment}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedCall(call);
                            setShowDetailsModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {call.recording_url && (
                          <a
                            href={call.recording_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-900"
                          >
                            <Play className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Call Details Modal */}
      {showDetailsModal && selectedCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Call Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Call Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Call Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Call ID:</span>
                      <span className="font-mono">{selectedCall.call_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Agent:</span>
                      <span>{selectedCall.agent_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedCall.call_status)}`}>
                        {selectedCall.call_status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span>{formatDuration(selectedCall.duration_ms)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Time:</span>
                      <span>{formatDate(selectedCall.start_timestamp)}</span>
                    </div>
                    {selectedCall.end_timestamp && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">End Time:</span>
                        <span>{formatDate(selectedCall.end_timestamp)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Call Analysis */}
                {selectedCall.call_analysis && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Call Analysis</h4>
                    <div className="space-y-2 text-sm">
                      {selectedCall.call_analysis.user_sentiment && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sentiment:</span>
                          <span className={`px-2 py-1 rounded text-xs ${getSentimentColor(selectedCall.call_analysis.user_sentiment)}`}>
                            {selectedCall.call_analysis.user_sentiment}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Successful:</span>
                        <span>{selectedCall.call_analysis.call_successful ? 'Yes' : 'No'}</span>
                      </div>
                      {selectedCall.call_analysis.call_summary && (
                        <div>
                          <span className="text-gray-600">Summary:</span>
                          <p className="mt-1 text-gray-900">{selectedCall.call_analysis.call_summary}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Transcript */}
              {selectedCall.transcript && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Transcript</h4>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedCall.transcript}
                    </pre>
                  </div>
                </div>
              )}

              {/* Recording */}
              {selectedCall.recording_url && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Recording</h4>
                  <audio controls className="w-full">
                    <source src={selectedCall.recording_url} type="audio/wav" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallHistoryPage;
