import React, { useState, useEffect } from 'react';
import { Clock, Save, Loader2, Check, AlertCircle, Link, Unlink, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useTokens } from '../../contexts/TokenContext';

const RemindersPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { claimReward } = useTokens();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [defaultReminderText, setDefaultReminderText] = useState('Hi {{client_name}}, this is a reminder about your {{service}} appointment on {{appointment_date}} at {{appointment_time}}. Please arrive 10 minutes early.');
  const [defaultReminderTime, setDefaultReminderTime] = useState('24');
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);

  // Upcoming scheduled reminders
  const [scheduledReminders, setScheduledReminders] = useState<any[]>([]);
  const [remindersLoading, setRemindersLoading] = useState(true);

  // Cal.com integration state
  const [calConnected, setCalConnected] = useState(false);
  const [calApiKey, setCalApiKey] = useState('');
  const [calConnecting, setCalConnecting] = useState(false);
  const [calDisconnecting, setCalDisconnecting] = useState(false);
  const [calError, setCalError] = useState<string | null>(null);
  const [calSuccess, setCalSuccess] = useState<string | null>(null);

  // Load config from Supabase
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('business_features')
          .select('reminders_enabled, reminders_config')
          .eq('user_id', user.id)
          .single();

        if (fetchError) {
          console.error('Failed to load reminders config:', fetchError);
          setError('Failed to load settings. Using defaults.');
          setTimeout(() => setError(null), 4000);
        }

        if (data) {
          setRemindersEnabled(data.reminders_enabled ?? true);
          const cfg = (data.reminders_config || {}) as Record<string, any>;
          if (cfg.template) setDefaultReminderText(cfg.template);
          if (cfg.time) setDefaultReminderTime(cfg.time);
          if (cfg.email_enabled !== undefined) setEmailEnabled(cfg.email_enabled);
          if (cfg.sms_enabled !== undefined) setSmsEnabled(cfg.sms_enabled);
          if (cfg.cal_connected) setCalConnected(true);
        }
      } catch (err) {
        console.error('Reminders load error:', err);
        setError('Failed to load settings. Using defaults.');
        setTimeout(() => setError(null), 4000);
      }
      setLoading(false);
    })();
  }, [user]);

  // Fetch upcoming scheduled reminders
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data, error: fetchErr } = await supabase
          .from('scheduled_messages')
          .select('id, recipient_phone, recipient_email, message_body, scheduled_for, status')
          .eq('user_id', user.id)
          .eq('type', 'reminder')
          .in('status', ['scheduled', 'sent', 'failed'])
          .order('scheduled_for', { ascending: true })
          .limit(10);

        if (!fetchErr && data) {
          setScheduledReminders(data);
        }
      } catch (err) {
        console.error('Failed to load scheduled reminders:', err);
      }
      setRemindersLoading(false);
    })();
  }, [user]);

  const handleConnectCal = async () => {
    if (!calApiKey.trim()) {
      setCalError('Please enter your Cal.com API key.');
      return;
    }
    setCalConnecting(true);
    setCalError(null);
    setCalSuccess(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/.netlify/functions/calcom-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ cal_api_key: calApiKey.trim() }),
      });

      const result = await response.json();
      if (!response.ok) {
        setCalError(result.error || 'Failed to connect Cal.com');
      } else {
        setCalConnected(true);
        setCalApiKey('');
        setCalSuccess('Cal.com connected successfully! Appointment webhooks are now active.');
        setTimeout(() => setCalSuccess(null), 5000);
      }
    } catch (err: any) {
      console.error('Cal.com connect error:', err);
      setCalError('Network error. Please try again.');
    }
    setCalConnecting(false);
  };

  const handleDisconnectCal = async () => {
    setCalDisconnecting(true);
    setCalError(null);
    setCalSuccess(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/.netlify/functions/calcom-webhook', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
      });

      const result = await response.json();
      if (!response.ok) {
        setCalError(result.error || 'Failed to disconnect Cal.com');
      } else {
        setCalConnected(false);
        setCalSuccess('Cal.com disconnected. Webhook removed.');
        setTimeout(() => setCalSuccess(null), 5000);
      }
    } catch (err: any) {
      console.error('Cal.com disconnect error:', err);
      setCalError('Network error. Please try again.');
    }
    setCalDisconnecting(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);

    try {
      // Read existing config to preserve Cal.com fields
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
            template: defaultReminderText,
            time: defaultReminderTime,
            email_enabled: emailEnabled,
            sms_enabled: smsEnabled,
          },
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Failed to save reminders config:', updateError);
        setError('Failed to save settings. Please try again.');
        setSaving(false);
        return;
      }

      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);

      // Claim bonus token reward for configuring reminders
      const rewardResult = await claimReward('configure_reminders');
      if (rewardResult?.success && !rewardResult?.alreadyClaimed) {
        showToast({ title: 'Bonus Tokens!', message: '+25 tokens earned for configuring reminders', variant: 'success', duration: 4000 });
      }
    } catch (err) {
      console.error('Reminders save error:', err);
      setError('Something went wrong. Please try again.');
      setSaving(false);
    }
  };

  const handleReset = () => {
    setDefaultReminderText('Hi {{client_name}}, this is a reminder about your {{service}} appointment on {{appointment_date}} at {{appointment_time}}. Please arrive 10 minutes early.');
    setDefaultReminderTime('24');
    setEmailEnabled(true);
    setSmsEnabled(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 text-sm">Dismiss</button>
        </div>
      )}

      {/* Cal.com Integration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Link className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Cal.com Integration</h2>
            <p className="text-sm text-gray-600">Connect your Cal.com account to sync appointment bookings</p>
          </div>
        </div>

        {calError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{calError}</p>
            <button onClick={() => setCalError(null)} className="ml-auto text-red-400 hover:text-red-600 text-sm">Dismiss</button>
          </div>
        )}

        {calSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            <p className="text-sm text-green-700">{calSuccess}</p>
          </div>
        )}

        {calConnected ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-sm font-medium text-gray-900">Cal.com is connected</span>
              <span className="text-xs text-gray-500">Receiving booking events</span>
            </div>
            <button
              onClick={handleDisconnectCal}
              disabled={calDisconnecting}
              className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
            >
              {calDisconnecting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Unlink className="w-4 h-4" />
              )}
              Disconnect
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cal.com API Key</label>
              <input
                type="password"
                value={calApiKey}
                onChange={(e) => setCalApiKey(e.target.value)}
                placeholder="cal_live_..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Find your API key at{' '}
                <a
                  href="https://cal.com/settings/developer/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700 underline"
                >
                  cal.com/settings/developer/api-keys
                </a>
              </p>
            </div>
            <button
              onClick={handleConnectCal}
              disabled={calConnecting}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
            >
              {calConnecting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Link className="w-4 h-4" />
              )}
              Connect Cal.com
            </button>
          </div>
        )}
      </motion.div>

      {/* Reminders Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Reminders Configuration</h2>
              <p className="text-sm text-gray-600">Configure your reminder settings and templates</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <label className="text-sm font-medium text-gray-900">Enable Reminders</label>
              <p className="text-xs text-gray-500">Turn reminders on or off for all clients</p>
            </div>
            <button
              onClick={() => setRemindersEnabled(!remindersEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                remindersEnabled ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  remindersEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Default Reminder Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Default Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Time</label>
                  <select
                    value={defaultReminderTime}
                    onChange={(e) => setDefaultReminderTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                  <option value="24">24 hours before</option>
                  <option value="48">48 hours before</option>
                  <option value="72">72 hours before</option>
                  <option value="168">1 week before</option>
                </select>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                    value={defaultReminderText}
                    onChange={(e) => setDefaultReminderText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={6}
                  placeholder="Enter your default reminder message template..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Variables: {'{{client_name}}'}, {'{{service}}'}, {'{{appointment_date}}'}, {'{{appointment_time}}'}
                  </p>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Reminders</label>
                  <p className="text-xs text-gray-500">Send reminders via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailEnabled}
                  onChange={(e) => setEmailEnabled(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 accent-blue-600"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">SMS Reminders</label>
                  <p className="text-xs text-gray-500">Send reminders via SMS</p>
                </div>
                <input
                  type="checkbox"
                  checked={smsEnabled}
                  onChange={(e) => setSmsEnabled(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 accent-blue-600"
                />
              </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-gray-300"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saved ? 'Saved!' : 'Save Configuration'}
          </button>
        </div>
      </motion.div>

      {/* Upcoming Reminders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Reminders</h2>
            <p className="text-sm text-gray-600">Scheduled SMS reminders for upcoming appointments</p>
          </div>
        </div>

        {remindersLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        ) : scheduledReminders.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No scheduled reminders yet.</p>
            <p className="text-xs text-gray-400 mt-1">Reminders will appear here when appointments are booked via Cal.com.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {scheduledReminders.map((msg) => (
              <div
                key={msg.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50"
              >
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
                    {new Date(msg.scheduled_for).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    {new Date(msg.scheduled_for).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      msg.status === 'scheduled'
                        ? 'bg-blue-100 text-blue-700'
                        : msg.status === 'sent'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {msg.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RemindersPage;
