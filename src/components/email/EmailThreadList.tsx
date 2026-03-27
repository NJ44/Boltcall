import React from 'react';
import { Mail, MailOpen, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { EmailThread } from '../../lib/emailService';

interface Props {
  threads: EmailThread[];
  selectedThreadId: string | null;
  onSelect: (thread: EmailThread) => void;
  loading: boolean;
}

const statusConfig = {
  open: { color: 'text-blue-600 bg-blue-50', icon: Mail, label: 'Open' },
  replied: { color: 'text-green-600 bg-green-50', icon: CheckCircle, label: 'Replied' },
  closed: { color: 'text-gray-500 bg-gray-100', icon: XCircle, label: 'Closed' },
  ignored: { color: 'text-gray-400 bg-gray-50', icon: MailOpen, label: 'Ignored' },
};

const EmailThreadList: React.FC<Props> = ({ threads, selectedThreadId, onSelect, loading }) => {
  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse flex gap-3 p-3">
            <div className="w-10 h-10 bg-gray-200 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
          <Mail className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-700">No email threads yet</p>
        <p className="text-xs text-gray-500 mt-1">New emails from leads will appear here</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {threads.map((thread) => {
        const isSelected = selectedThreadId === thread.id;
        const config = statusConfig[thread.status] || statusConfig.open;
        const StatusIcon = config.icon;
        const timeAgo = formatTimeAgo(thread.last_message_at);

        return (
          <button
            key={thread.id}
            onClick={() => onSelect(thread)}
            className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
              isSelected ? 'bg-blue-50/50 border-l-2 border-blue-600' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
                <StatusIcon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {thread.sender_name || thread.sender_email}
                  </p>
                  <span className="text-xs text-gray-400 flex-shrink-0">{timeAgo}</span>
                </div>
                <p className="text-sm text-gray-600 truncate mt-0.5">
                  {thread.subject || '(no subject)'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${config.color}`}>
                    {config.label}
                  </span>
                  <span className="text-[10px] text-gray-400">{thread.message_count} messages</span>
                  {thread.leads?.name && (
                    <span className="text-[10px] text-blue-500">{thread.leads.name}</span>
                  )}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateStr).toLocaleDateString();
}

export default EmailThreadList;
