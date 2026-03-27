import React, { useEffect, useState } from 'react';
import { ArrowLeft, User, Bot, Send, RefreshCw, CheckCircle, XCircle, Edit3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  getThreadDetail,
  approveDraft,
  rejectDraft,
  editAndSend,
  generateDraft,
  type EmailThread,
  type EmailMessage,
} from '../../lib/emailService';

interface Props {
  thread: EmailThread;
  onBack: () => void;
  onRefresh: () => void;
}

const EmailThreadView: React.FC<Props> = ({ thread, onBack, onRefresh }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    loadMessages();
  }, [thread.id]);

  const loadMessages = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await getThreadDetail(user.id, thread.id);
      setMessages(data.messages);
    } catch (err) {
      console.error('Failed to load thread:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (messageId: string) => {
    if (!user?.id) return;
    setActionLoading(messageId);
    try {
      await approveDraft(user.id, messageId, thread.id);
      await loadMessages();
      onRefresh();
    } catch (err) {
      console.error('Approve failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (messageId: string) => {
    if (!user?.id) return;
    setActionLoading(messageId);
    try {
      await rejectDraft(user.id, messageId);
      await loadMessages();
      onRefresh();
    } catch (err) {
      console.error('Reject failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditSend = async (messageId: string) => {
    if (!user?.id || !editText.trim()) return;
    setActionLoading(messageId);
    try {
      await editAndSend(user.id, messageId, thread.id, editText);
      setEditingId(null);
      setEditText('');
      await loadMessages();
      onRefresh();
    } catch (err) {
      console.error('Edit & send failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRegenerate = async (messageId: string) => {
    if (!user?.id) return;
    setActionLoading(messageId);
    try {
      await generateDraft(user.id, thread.id, thread.email_account_id, 'regenerate');
      await loadMessages();
    } catch (err) {
      console.error('Regenerate failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const startEdit = (message: EmailMessage) => {
    setEditingId(message.id);
    setEditText(message.ai_draft_text || '');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white flex-shrink-0">
        <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-gray-900 truncate">{thread.subject || '(no subject)'}</h2>
          <p className="text-xs text-gray-500">
            {thread.sender_name || thread.sender_email} &middot; {thread.message_count} messages
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-2 p-4 bg-gray-50 rounded-xl">
                <div className="h-3 bg-gray-200 rounded w-1/4" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          messages.map((message) => {
            const isInbound = message.direction === 'inbound';
            const hasPendingDraft = message.ai_draft_status === 'pending';
            const isEditing = editingId === message.id;

            return (
              <div key={message.id} className="space-y-2">
                {/* Message bubble */}
                <div className={`rounded-xl p-4 ${isInbound ? 'bg-gray-50 border border-gray-200' : 'bg-blue-50 border border-blue-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isInbound ? 'bg-gray-200' : 'bg-blue-200'}`}>
                      {isInbound ? <User className="w-3 h-3 text-gray-600" /> : <Send className="w-3 h-3 text-blue-600" />}
                    </div>
                    <span className="text-xs font-medium text-gray-700">{message.from_address}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(message.received_at || message.sent_at || message.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {message.body_text || '(empty)'}
                  </div>
                </div>

                {/* AI Draft Card */}
                {hasPendingDraft && message.ai_draft_text && (
                  <div className="ml-6 rounded-xl p-4 bg-amber-50 border border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-semibold text-amber-700">AI Draft Response</span>
                      <span className="text-[10px] text-amber-500 bg-amber-100 px-1.5 py-0.5 rounded">Pending Approval</span>
                    </div>

                    {isEditing ? (
                      <div className="space-y-3">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={6}
                          className="w-full text-sm border border-amber-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditSend(message.id)}
                            disabled={actionLoading === message.id}
                            className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5"
                          >
                            <Send className="w-3 h-3" />
                            {actionLoading === message.id ? 'Sending...' : 'Send Edited'}
                          </button>
                          <button
                            onClick={() => { setEditingId(null); setEditText(''); }}
                            className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed mb-3">
                          {message.ai_draft_text}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleApprove(message.id)}
                            disabled={actionLoading === message.id}
                            className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-1.5"
                          >
                            <CheckCircle className="w-3 h-3" />
                            {actionLoading === message.id ? 'Sending...' : 'Approve & Send'}
                          </button>
                          <button
                            onClick={() => startEdit(message)}
                            className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 flex items-center gap-1.5"
                          >
                            <Edit3 className="w-3 h-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleRegenerate(message.id)}
                            disabled={actionLoading === message.id}
                            className="px-3 py-1.5 text-xs font-medium text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 flex items-center gap-1.5"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Regenerate
                          </button>
                          <button
                            onClick={() => handleReject(message.id)}
                            disabled={actionLoading === message.id}
                            className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 flex items-center gap-1.5"
                          >
                            <XCircle className="w-3 h-3" />
                            Reject
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Auto-sent indicator */}
                {message.ai_draft_status === 'auto_sent' && (
                  <div className="ml-6 flex items-center gap-1.5 text-xs text-green-600">
                    <Bot className="w-3 h-3" />
                    <span>AI auto-responded</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EmailThreadView;
