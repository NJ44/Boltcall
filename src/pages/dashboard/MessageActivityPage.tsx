// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { PageSkeleton } from '../../components/ui/loading-skeleton';
import {
  Activity,
  Loader2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  Mail,
  MessageSquare,
  Phone,
  Star,
  RotateCw,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface ScheduledMessage {
  id: string;
  type: string;
  channel: string;
  recipient_phone: string | null;
  recipient_email: string | null;
  message_body: string;
  subject: string | null;
  scheduled_for: string;
  sent_at: string | null;
  status: string;
  error: string | null;
  created_at: string;
}

type StatusFilter = 'all' | 'scheduled' | 'sent' | 'failed' | 'cancelled';
type TypeFilter = 'all' | 'reminder' | 'review_request' | 'missed_call_textback' | 'followup';

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  scheduled: { label: 'Scheduled', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  sent: { label: 'Sent', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
  failed: { label: 'Failed', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  cancelled: { label: 'Cancelled', icon: Ban, color: 'text-gray-500', bg: 'bg-gray-100' },
  confirmed: { label: 'Confirmed', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
};

const typeConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  reminder: { label: 'Reminder', icon: Clock, color: 'text-blue-600' },
  review_request: { label: 'Review Request', icon: Star, color: 'text-yellow-600' },
  missed_call_textback: { label: 'Missed Call Text-Back', icon: Phone, color: 'text-red-500' },
  followup: { label: 'Follow-Up', icon: RotateCw, color: 'text-purple-600' },
};

function getChannelIcon(channel: string): React.ElementType {
  if (channel === 'email') return Mail;
  return MessageSquare;
}

const MessageActivityPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ScheduledMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);

    let query = supabase
      .from('scheduled_messages')
      .select('id, type, channel, recipient_phone, recipient_email, message_body, subject, scheduled_for, sent_at, status, error, created_at')
      .eq('user_id', user.id)
      .order('scheduled_for', { ascending: false })
      .limit(100);

    if (statusFilter !== 'all') query = query.eq('status', statusFilter);
    if (typeFilter !== 'all') query = query.eq('type', typeFilter);

    const { data, error } = await query;
    if (error) {
      console.error('Failed to fetch messages:', error);
    }
    setMessages(data || []);
    setLoading(false);
  }, [user?.id, statusFilter, typeFilter]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Counts for status badges
  const counts = {
    all: messages.length,
    scheduled: messages.filter(m => m.status === 'scheduled').length,
    sent: messages.filter(m => m.status === 'sent').length,
    failed: messages.filter(m => m.status === 'failed').length,
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-brand-blue" />
          <h2 className="text-lg font-semibold text-gray-900">Message Activity</h2>
        </div>
        <button
          onClick={fetchMessages}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {([
          { key: 'all', label: 'Total', count: counts.all, color: 'text-gray-900', bg: 'bg-gray-50' },
          { key: 'scheduled', label: 'Scheduled', count: counts.scheduled, color: 'text-amber-600', bg: 'bg-amber-50' },
          { key: 'sent', label: 'Sent', count: counts.sent, color: 'text-green-600', bg: 'bg-green-50' },
          { key: 'failed', label: 'Failed', count: counts.failed, color: 'text-red-600', bg: 'bg-red-50' },
        ] as const).map((stat) => (
          <button
            key={stat.key}
            onClick={() => setStatusFilter(stat.key as StatusFilter)}
            className={`rounded-xl border p-3 text-left transition-all ${
              statusFilter === stat.key
                ? 'border-brand-blue bg-blue-50 ring-1 ring-brand-blue'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <p className="text-xs text-gray-500">{stat.label}</p>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.count}</p>
          </button>
        ))}
      </div>

      {/* Type filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-500 font-medium">Type:</span>
        {(['all', 'reminder', 'review_request', 'missed_call_textback', 'followup'] as TypeFilter[]).map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
              typeFilter === t
                ? 'bg-brand-blue text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t === 'all' ? 'All' : typeConfig[t]?.label || t}
          </button>
        ))}
      </div>

      {/* Messages list */}
      {loading ? (
        <PageSkeleton />
      ) : messages.length === 0 ? (
        <div className="text-center py-16">
          <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No messages found</p>
          <p className="text-gray-400 text-sm mt-1">Automated messages will appear here when scheduled or sent.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((msg, i) => {
            const st = statusConfig[msg.status] || statusConfig.scheduled;
            const tp = typeConfig[msg.type] || { label: msg.type, icon: Activity, color: 'text-gray-500' };
            const ChannelIcon = getChannelIcon(msg.channel);
            const StatusIcon = st.icon as React.ElementType;
            const TypeIcon = tp.icon as React.ElementType;
            const isExpanded = expandedId === msg.id;
            const recipient = msg.channel === 'email' ? msg.recipient_email : msg.recipient_phone;
            const scheduledDate = new Date(msg.scheduled_for);
            const isOverdue = msg.status === 'scheduled' && scheduledDate < new Date();

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: Math.min(i * 0.02, 0.3) }}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                  className={`w-full text-left rounded-xl border p-4 transition-all hover:shadow-sm ${
                    isExpanded ? 'border-brand-blue bg-blue-50/30' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Channel icon */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${msg.channel === 'email' ? 'bg-purple-50' : 'bg-green-50'}`}>
                      <ChannelIcon className={`w-4 h-4 ${msg.channel === 'email' ? 'text-purple-600' : 'text-green-600'}`} />
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <TypeIcon className={`w-3.5 h-3.5 ${tp.color} flex-shrink-0`} />
                        <span className="text-sm font-medium text-gray-900 truncate">{tp.label}</span>
                        <span className="text-xs text-gray-400">→</span>
                        <span className="text-sm text-gray-600 truncate">{recipient || 'No recipient'}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{msg.message_body?.slice(0, 80)}</p>
                    </div>

                    {/* Status + time */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {isOverdue && (
                        <span className="text-xs text-amber-600 font-medium">Overdue</span>
                      )}
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${st.bg} ${st.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {st.label}
                      </span>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {scheduledDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}{' '}
                        {scheduledDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-gray-200 space-y-2 text-sm" onClick={(e) => e.stopPropagation()}>
                      {msg.subject && (
                        <div>
                          <span className="text-gray-500 font-medium">Subject: </span>
                          <span className="text-gray-900">{msg.subject}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-500 font-medium">Message: </span>
                        <span className="text-gray-700">{msg.message_body}</span>
                      </div>
                      <div className="flex gap-6 text-xs text-gray-400">
                        <span>Channel: {msg.channel.toUpperCase()}</span>
                        <span>Scheduled: {new Date(msg.scheduled_for).toLocaleString()}</span>
                        {msg.sent_at && <span>Sent: {new Date(msg.sent_at).toLocaleString()}</span>}
                      </div>
                      {msg.error && (
                        <div className="flex items-start gap-2 mt-1 p-2 bg-red-50 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-red-700">{msg.error}</span>
                        </div>
                      )}
                    </div>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MessageActivityPage;
