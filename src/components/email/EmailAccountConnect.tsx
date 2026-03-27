import React, { useState } from 'react';
import { Mail, Plus, Trash2, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  getEmailAccounts,
  startGmailAuth,
  startOutlookAuth,
  disconnectEmailAccount,
  type EmailAccount,
} from '../../lib/emailService';

interface Props {
  accounts: EmailAccount[];
  onRefresh: () => void;
}

const EmailAccountConnect: React.FC<Props> = ({ accounts, onRefresh }) => {
  const { user } = useAuth();
  const [connecting, setConnecting] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  const handleGmailConnect = async () => {
    if (!user?.id) return;
    setConnecting('gmail');
    try {
      await startGmailAuth(user.id);
    } catch (err) {
      console.error('Gmail connect error:', err);
      setConnecting(null);
    }
  };

  const handleOutlookConnect = async () => {
    if (!user?.id) return;
    setConnecting('outlook');
    try {
      await startOutlookAuth(user.id);
    } catch (err) {
      console.error('Outlook connect error:', err);
      setConnecting(null);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    if (!user?.id) return;
    setDisconnecting(accountId);
    try {
      await disconnectEmailAccount(user.id, accountId);
      onRefresh();
    } catch (err) {
      console.error('Disconnect error:', err);
    } finally {
      setDisconnecting(null);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Connected Accounts */}
      {accounts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Connected Accounts</h3>
          {accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  account.provider === 'gmail' ? 'bg-red-50' : 'bg-blue-50'
                }`}>
                  <Mail className={`w-5 h-5 ${account.provider === 'gmail' ? 'text-red-600' : 'text-blue-600'}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{account.email_address}</p>
                  <p className="text-xs text-gray-500">
                    {account.provider === 'gmail' ? 'Gmail' : 'Outlook'} &middot; Last synced: {formatDate(account.last_synced_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  account.is_active
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {account.is_active ? 'Active' : 'Inactive'}
                </span>
                <button
                  onClick={() => handleDisconnect(account.id)}
                  disabled={disconnecting === account.id}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  title="Disconnect"
                >
                  {disconnecting === account.id ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Connect Buttons */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          {accounts.length > 0 ? 'Add Another Account' : 'Connect Your Email'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleGmailConnect}
            disabled={connecting === 'gmail'}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50/50 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">
                {connecting === 'gmail' ? 'Connecting...' : 'Connect Gmail'}
              </p>
              <p className="text-xs text-gray-500">Google Workspace & Gmail</p>
            </div>
            <Plus className="w-4 h-4 text-gray-400 ml-auto" />
          </button>

          <button
            onClick={handleOutlookConnect}
            disabled={connecting === 'outlook'}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#0078D4" d="M24 7.387v10.478c0 .23-.08.424-.238.583a.795.795 0 0 1-.583.238h-8.322V6.566h8.322c.23 0 .424.08.583.238.159.159.238.353.238.583zM14.118 6.566v12.12L0 16.768V8.486l14.118-1.92z"/>
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">
                {connecting === 'outlook' ? 'Connecting...' : 'Connect Outlook'}
              </p>
              <p className="text-xs text-gray-500">Microsoft 365 & Outlook</p>
            </div>
            <Plus className="w-4 h-4 text-gray-400 ml-auto" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailAccountConnect;
