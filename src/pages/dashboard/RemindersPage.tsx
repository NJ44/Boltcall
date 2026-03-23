import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, MessageSquare, Plus, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useTokens } from '../../contexts/TokenContext';
import ModalShell from '../../components/ui/modal-shell';

const RemindersPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { claimReward } = useTokens();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [defaultReminderTime, setDefaultReminderTime] = useState('24');
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [calConnected, setCalConnected] = useState(false);

  // Scheduled reminders
  const [scheduledReminders, setScheduledReminders] = useState<any[]>([]);
  const [remindersLoading, setRemindersLoading] = useState(true);

  // Settings modal
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [calError, setCalError] = useState(false);

  // Load config
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data } = await supabase
          .from('business_features')
          .select('reminders_enabled, reminders_config')
          .eq('user_id', user.id)
          .single();

        if (data) {
          setRemindersEnabled(data.reminders_enabled ?? true);
          const cfg = (data.reminders_config || {}) as Record<string, any>;
          if (cfg.time) setDefaultReminderTime(cfg.time);
          if (cfg.email_enabled !== undefined) setEmailEnabled(cfg.email_enabled);
          if (cfg.sms_enabled !== undefined) setSmsEnabled(cfg.sms_enabled);
          if (cfg.cal_connected) setCalConnected(true);
        }
      } catch (err) {
        console.error('Reminders load error:', err);
      }
      setLoading(false);
    })();
  }, [user]);

  // Fetch scheduled reminders
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data } = await supabase
          .from('scheduled_messages')
          .select('id, recipient_phone, recipient_email, message_body, scheduled_for, status')
          .eq('user_id', user.id)
          .eq('type', 'reminder')
          .in('status', ['scheduled', 'sent', 'failed'])
          .order('scheduled_for', { ascending: true })
          .limit(10);

        if (data) setScheduledReminders(data);
      } catch (err) {
        console.error('Failed to load scheduled reminders:', err);
      }
      setRemindersLoading(false);
    })();
  }, [user]);

  const handleSaveSettings = async () => {
    if (!user) return;

    // Check if Cal.com is configured
    if (!calConnected) {
      setCalError(true);
      return;
    }

    setCalError(false);
    setSaving(true);
    setError(null);

    try {
      const { data: existing } = await supabase
        .from('business_features')
        .select('reminders_config')
        .eq('user_id', user.id)
        .single();

      const existingConfig = (existing?.reminders_config || {}) as Record<string, any>;

      const { error: updateError } = await supabase
        .from('business_features')
        .update({
          reminders_enabled: remindersEnabled,
          reminders_config: {
            ...existingConfig,
            time: defaultReminderTime,
            email_enabled: emailEnabled,
            sms_enabled: smsEnabled,
          },
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (updateError) {
        setError('Failed to save settings.');
        showToast({ title: 'Error', message: 'Failed to save reminder settings.', variant: 'error', duration: 4000 });
        setSaving(false);
        return;
      }

      setSaving(false);
      setShowSettingsModal(false);
      showToast({ title: 'Saved', message: 'Reminder settings updated.', variant: 'success', duration: 3000 });

      const rewardResult = await claimReward('configure_reminders');
      if (rewardResult?.success && !rewardResult?.alreadyClaimed) {
        showToast({ title: 'Bonus Tokens!', message: '+25 tokens earned for configuring reminders', variant: 'success', duration: 4000 });
      }
    } catch (err) {
      console.error('Reminders save error:', err);
      setError('Something went wrong.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 text-sm">Dismiss</button>
        </div>
      )}

      {/* Scheduled Reminders */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Scheduled Reminders</h2>
          <button
            onClick={() => { setCalError(false); setShowSettingsModal(true); }}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Reminder
          </button>
        </div>
        <div className="bg-white rounded-xl border border-gray-100">
          {remindersLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          ) : scheduledReminders.length === 0 ? (
            <div className="text-center py-12 px-6">
              <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No scheduled reminders yet</p>
              <p className="text-xs text-gray-400 mt-1">Reminders will appear here when appointments are booked via Cal.com.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {scheduledReminders.map((msg) => (
                <div key={msg.id} className="flex items-center justify-between px-6 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {msg.recipient_phone || msg.recipient_email || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {msg.message_body.length > 80
                        ? msg.message_body.slice(0, 80) + '...'
                        : msg.message_body}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                    <span className="text-xs text-gray-500">
                      {new Date(msg.scheduled_for).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}{' '}
                      {new Date(msg.scheduled_for).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      msg.status === 'scheduled' ? 'bg-blue-100 text-blue-700'
                        : msg.status === 'sent' ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {msg.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* Reminder Settings Modal */}
      <ModalShell
        open={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Reminder Settings"
        footer={
          <>
            <button
              onClick={() => setShowSettingsModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </button>
          </>
        }
      >
        <div className="space-y-6">
          {/* Cal.com error */}
          {calError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Cal.com is not connected</p>
                  <p className="text-sm text-red-700 mt-1">
                    You need to connect Cal.com first so reminders can be triggered by bookings.
                  </p>
                  <Link
                    to="/dashboard/integrations"
                    onClick={() => setShowSettingsModal(false)}
                    className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 mt-2"
                  >
                    Go to Integrations →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Enable Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Enable Reminders</p>
              <p className="text-xs text-gray-500 mt-0.5">Turn reminders on or off for all clients</p>
            </div>
            <button
              onClick={() => setRemindersEnabled(!remindersEnabled)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                remindersEnabled ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                remindersEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {/* Reminder Time */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Reminder Time</label>
            <select
              value={defaultReminderTime}
              onChange={(e) => setDefaultReminderTime(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="24">24 hours before</option>
              <option value="48">48 hours before</option>
              <option value="72">72 hours before</option>
              <option value="168">1 week before</option>
            </select>
          </div>

          {/* Channels */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-900">Delivery Channels</p>
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm text-gray-700">Email</p>
                <p className="text-xs text-gray-500">Send reminders via email</p>
              </div>
              <button
                onClick={() => setEmailEnabled(!emailEnabled)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  emailEnabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  emailEnabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm text-gray-700">SMS</p>
                <p className="text-xs text-gray-500">Send reminders via text message</p>
              </div>
              <button
                onClick={() => setSmsEnabled(!smsEnabled)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  smsEnabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  smsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </ModalShell>
    </div>
  );
};

export default RemindersPage;
