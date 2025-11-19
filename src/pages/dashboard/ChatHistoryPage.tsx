import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChatHistorySkeleton } from '../../components/ui/loading-skeleton';
import { 
  MessageSquare, 
  Clock, 
  User,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageCircle
} from 'lucide-react';
import { getRetellCallHistory, type RetellCall } from '../../lib/retell';
import { supabase } from '../../lib/supabase';

const ChatHistoryPage: React.FC = () => {
  const [chats, setChats] = useState<RetellCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  });
  const [selectedChat, setSelectedChat] = useState<RetellCall | null>(null);
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

  // Fetch chat history from Retell AI (web calls and chat interactions)
  const fetchChatHistory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const agentIds = await fetchUserAgents();
      
      if (!agentIds || agentIds.length === 0) {
        setChats([]);
        setLoading(false);
        return;
      }

      const params: any = {
        agentIds,
        limit: 100,
        // Filter for web calls and chat-like interactions
        callStatus: statusFilter !== 'all' ? [statusFilter] : undefined
      };

      if (dateRange.start) {
        params.startDate = new Date(dateRange.start);
      }

      if (dateRange.end) {
        params.endDate = new Date(dateRange.end);
      }

      const response = await getRetellCallHistory(params);
      
      // Filter for web calls and chat-like interactions
      const chatCalls = response.calls.filter(call => 
        call.call_type === 'web_call' || 
        call.transcript?.includes('chat') ||
        call.call_type === 'chat'
      );
      
      setChats(chatCalls);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setError('Failed to fetch chat history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, [statusFilter, dateRange]);

  // Filter chats based on search term
  const filteredChats = chats.filter(chat => 
    chat.agent_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.call_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.transcript?.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Parse transcript into chat messages
  const parseTranscript = (transcript: string) => {
    if (!transcript) return [];
    
    const lines = transcript.split('\n').filter(line => line.trim());
    return lines.map(line => {
      const [role, ...messageParts] = line.split(': ');
      return {
        role: role.toLowerCase(),
        message: messageParts.join(': ')
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search chats..."
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
            <option value="registered" className="text-black">Active</option>
            <option value="not_connected" className="text-black">Not Connected</option>
            <option value="error" className="text-black">Error</option>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Chats</p>
              <p className="text-2xl font-bold text-gray-900">{filteredChats.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredChats.filter(chat => chat.call_status === 'ended').length}
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
                  filteredChats.reduce((acc, chat) => acc + (chat.duration_ms || 0), 0) / 
                  filteredChats.filter(chat => chat.duration_ms).length
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
                {filteredChats.filter(chat => chat.call_analysis?.user_sentiment === 'Positive').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chats Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <ChatHistorySkeleton />
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <span className="ml-3 text-red-600">{error}</span>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <MessageSquare className="w-8 h-8 text-gray-400" />
            <span className="ml-3 text-gray-600">No chats found</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chat Details
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
                    Messages
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
                {filteredChats.map((chat) => (
                  <motion.tr
                    key={chat.call_id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <MessageCircle className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {chat.call_id.slice(0, 8)}...
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(chat.start_timestamp)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900">{chat.agent_name}</p>
                      <p className="text-xs text-gray-500">{chat.call_type}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(chat.call_status)}`}>
                        {getStatusIcon(chat.call_status)}
                        {chat.call_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDuration(chat.duration_ms)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {chat.transcript ? parseTranscript(chat.transcript).length : 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {chat.call_analysis?.user_sentiment ? (
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(chat.call_analysis.user_sentiment)}`}>
                          {chat.call_analysis.user_sentiment}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedChat(chat);
                          setShowDetailsModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Chat Details Modal */}
      {showDetailsModal && selectedChat && (
        <div className="fixed -inset-[200px] bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Chat Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chat Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Chat Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Chat ID:</span>
                      <span className="font-mono">{selectedChat.call_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Agent:</span>
                      <span>{selectedChat.agent_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedChat.call_status)}`}>
                        {selectedChat.call_status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span>{formatDuration(selectedChat.duration_ms)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Time:</span>
                      <span>{formatDate(selectedChat.start_timestamp)}</span>
                    </div>
                    {selectedChat.end_timestamp && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">End Time:</span>
                        <span>{formatDate(selectedChat.end_timestamp)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Chat Analysis */}
                {selectedChat.call_analysis && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Chat Analysis</h4>
                    <div className="space-y-2 text-sm">
                      {selectedChat.call_analysis.user_sentiment && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sentiment:</span>
                          <span className={`px-2 py-1 rounded text-xs ${getSentimentColor(selectedChat.call_analysis.user_sentiment)}`}>
                            {selectedChat.call_analysis.user_sentiment}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Successful:</span>
                        <span>{selectedChat.call_analysis.call_successful ? 'Yes' : 'No'}</span>
                      </div>
                      {selectedChat.call_analysis.call_summary && (
                        <div>
                          <span className="text-gray-600">Summary:</span>
                          <p className="mt-1 text-gray-900">{selectedChat.call_analysis.call_summary}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Messages */}
              {selectedChat.transcript && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Chat Messages</h4>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <div className="space-y-3">
                      {parseTranscript(selectedChat.transcript).map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-900 border'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {message.role === 'user' ? (
                                <User className="w-3 h-3" />
                              ) : (
                                <MessageSquare className="w-3 h-3" />
                              )}
                              <span className="text-xs font-medium capitalize">
                                {message.role}
                              </span>
                            </div>
                            <p className="text-sm">{message.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHistoryPage;
