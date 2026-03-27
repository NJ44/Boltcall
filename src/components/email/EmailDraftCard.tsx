import React, { useState } from 'react';
import { Bot, CheckCircle, XCircle, Edit3, Send } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { approveDraft, rejectDraft, editAndSend, type EmailMessage } from '../../lib/emailService';

interface Props {
  draft: EmailMessage & {
    email_threads?: { subject: string; sender_email: string; sender_name: string };
  };
  onAction: () => void;
}

const EmailDraftCard: React.FC<Props> = ({ draft, onAction }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(draft.ai_draft_text || '');

  const handleApprove = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      await approveDraft(user.id, draft.id, draft.thread_id);
      onAction();
    } catch (err) {
      console.error('Approve error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      await rejectDraft(user.id, draft.id);
      onAction();
    } catch (err) {
      console.error('Reject error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSend = async () => {
    if (!user?.id || !editText.trim()) return;
    setLoading(true);
    try {
      await editAndSend(user.id, draft.id, draft.thread_id, editText);
      setEditing(false);
      onAction();
    } catch (err) {
      console.error('Edit & send error:', err);
    } finally {
      setLoading(false);
    }
  };

  const senderName = draft.email_threads?.sender_name || draft.from_address;
  const subject = draft.email_threads?.subject || '(no subject)';

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
        <Bot className="w-4 h-4 text-amber-600" />
        <span className="text-xs font-semibold text-amber-700">AI Draft</span>
        <span className="text-xs text-gray-500 ml-auto">
          {draft.ai_draft_generated_at ? new Date(draft.ai_draft_generated_at).toLocaleString() : ''}
        </span>
      </div>

      {/* Context */}
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-900">Re: {subject}</p>
        <p className="text-xs text-gray-500">Replying to {senderName}</p>
      </div>

      {/* Original message snippet */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-500 font-medium mb-1">Original message:</p>
        <p className="text-sm text-gray-600 line-clamp-3">
          {draft.body_text?.substring(0, 200) || '(empty)'}
        </p>
      </div>

      {/* Draft content */}
      <div className="px-4 py-3">
        {editing ? (
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={6}
            className="w-full text-sm border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
          />
        ) : (
          <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {draft.ai_draft_text}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-2">
        {editing ? (
          <>
            <button
              onClick={handleEditSend}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5"
            >
              <Send className="w-3 h-3" />
              {loading ? 'Sending...' : 'Send Edited'}
            </button>
            <button
              onClick={() => { setEditing(false); setEditText(draft.ai_draft_text || ''); }}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleApprove}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-1.5"
            >
              <CheckCircle className="w-3 h-3" />
              {loading ? 'Sending...' : 'Approve & Send'}
            </button>
            <button
              onClick={() => setEditing(true)}
              className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 flex items-center gap-1.5"
            >
              <Edit3 className="w-3 h-3" />
              Edit
            </button>
            <button
              onClick={handleReject}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50 flex items-center gap-1.5"
            >
              <XCircle className="w-3 h-3" />
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailDraftCard;
