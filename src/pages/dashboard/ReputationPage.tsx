import React, { useState, useEffect } from 'react';
import { Star, Save, Loader2, Check, AlertCircle, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useTokens } from '../../contexts/TokenContext';

const ReputationPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { claimReward } = useTokens();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [googleReviewUrl, setGoogleReviewUrl] = useState('');
  const [trigger, setTrigger] = useState<'delay' | 'scroll' | 'exit'>('delay');
  const [delaySeconds, setDelaySeconds] = useState(30);
  const [popupText, setPopupText] = useState('Enjoying our service? Leave us a Google review!');
  const [buttonText, setButtonText] = useState('Leave a Review');
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [smsTemplate, setSmsTemplate] = useState(
    'Hi {{client_name}}, thanks for visiting {{business_name}}! We\'d love your feedback: {{review_url}}'
  );
  const [smsDelay, setSmsDelay] = useState('24');

  // Scheduled review requests
  const [reviewRequests, setReviewRequests] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('business_features')
          .select('reputation_manager_config')
          .eq('user_id', user.id)
          .single();

        if (fetchError) {
          console.error('Failed to load reputation config:', fetchError);
          setError('Failed to load settings. Using defaults.');
          setTimeout(() => setError(null), 4000);
        }

        if (data?.reputation_manager_config) {
          const cfg = data.reputation_manager_config as Record<string, any>;
          if (cfg.google_review_url) setGoogleReviewUrl(cfg.google_review_url);
          if (cfg.trigger) setTrigger(cfg.trigger);
          if (cfg.delay_seconds) setDelaySeconds(cfg.delay_seconds);
          if (cfg.popup_text) setPopupText(cfg.popup_text);
          if (cfg.button_text) setButtonText(cfg.button_text);
          if (cfg.sms_enabled !== undefined) setSmsEnabled(cfg.sms_enabled);
          if (cfg.sms_template) setSmsTemplate(cfg.sms_template);
          if (cfg.sms_delay) setSmsDelay(cfg.sms_delay);
        }
      } catch (err) {
        console.error('Reputation load error:', err);
        setError('Failed to load settings. Using defaults.');
        setTimeout(() => setError(null), 4000);
      }
      setLoading(false);
    })();
  }, [user]);

  // Fetch scheduled review requests
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data, error: fetchErr } = await supabase
          .from('scheduled_messages')
          .select('id, recipient_phone, recipient_email, message_body, scheduled_for, status')
          .eq('user_id', user.id)
          .eq('type', 'review_request')
          .in('status', ['scheduled', 'sent', 'failed'])
          .order('scheduled_for', { ascending: false })
          .limit(10);

        if (!fetchErr && data) {
          setReviewRequests(data);
        }
      } catch (err) {
        console.error('Failed to load review requests:', err);
      }
      setReviewsLoading(false);
    })();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);

    const config = {
      google_review_url: googleReviewUrl,
      trigger,
      delay_seconds: delaySeconds,
      popup_text: popupText,
      button_text: buttonText,
      sms_enabled: smsEnabled,
      sms_template: smsTemplate,
      sms_delay: smsDelay,
    };

    try {
      const { error: updateError } = await supabase
        .from('business_features')
        .update({
          reputation_manager_config: config,
          reputation_manager_enabled: true,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Failed to save reputation config:', updateError);
        setError('Failed to save settings. Please try again.');
        showToast({ title: 'Error', message: 'Failed to save reputation settings.', variant: 'error', duration: 4000 });
        setSaving(false);
        return;
      }

      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);

      // Claim bonus token reward for enabling reputation manager
      const rewardResult = await claimReward('enable_reputation');
      if (rewardResult?.success && !rewardResult?.alreadyClaimed) {
        showToast({ title: 'Bonus Tokens!', message: '+25 tokens earned for enabling reputation manager', variant: 'success', duration: 4000 });
      }
    } catch (err) {
      console.error('Reputation save error:', err);
      setError('Something went wrong. Please try again.');
      showToast({ title: 'Error', message: 'Something went wrong saving reputation settings.', variant: 'error', duration: 4000 });
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
    <div className="space-y-6">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 text-sm">Dismiss</button>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Star className="w-4 h-4 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Reputation Manager</h2>
            <p className="text-sm text-gray-600">Automate Google review collection from your customers</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Google Review URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Review URL
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Find this in Google Business Profile &gt; Share review form
            </p>
            <input
              type="url"
              value={googleReviewUrl}
              onChange={(e) => setGoogleReviewUrl(e.target.value)}
              placeholder="https://g.page/r/..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
            />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Website Review Popup</h3>
            <p className="text-sm text-gray-500 mb-4">
              Shows a review popup on your website via the Boltcall embed script.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Trigger Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">When to show popup</label>
                <select
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value as 'delay' | 'scroll' | 'exit')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                >
                  <option value="delay">After time delay</option>
                  <option value="scroll">After scrolling 70%</option>
                  <option value="exit">On exit intent</option>
                </select>
              </div>

              {/* Delay (only when trigger=delay) */}
              {trigger === 'delay' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delay (seconds)</label>
                  <input
                    type="number"
                    value={delaySeconds}
                    onChange={(e) => setDelaySeconds(parseInt(e.target.value) || 30)}
                    min={5}
                    max={300}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                  />
                </div>
              )}

              {/* Popup Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Popup message</label>
                <input
                  type="text"
                  value={popupText}
                  onChange={(e) => setPopupText(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              {/* Button Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button text</label>
                <input
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* SMS Review Requests */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">SMS Review Requests</h3>
                <p className="text-sm text-gray-500">Send review requests via SMS after appointments</p>
              </div>
              <button
                onClick={() => setSmsEnabled(!smsEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  smsEnabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    smsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {smsEnabled && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Send after (hours)</label>
                  <select
                    value={smsDelay}
                    onChange={(e) => setSmsDelay(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                  >
                    <option value="1">1 hour after appointment</option>
                    <option value="3">3 hours after appointment</option>
                    <option value="24">Next day</option>
                    <option value="48">2 days later</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SMS Template</label>
                  <textarea
                    value={smsTemplate}
                    onChange={(e) => setSmsTemplate(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Variables: {'{{client_name}}'}, {'{{business_name}}'}, {'{{review_url}}'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={saving || !googleReviewUrl}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saved ? (
                <Check className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saved ? 'Saved!' : 'Save & Activate'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Scheduled Review Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Review Requests</h2>
            <p className="text-sm text-gray-600">Scheduled and sent SMS review requests</p>
          </div>
        </div>

        {reviewsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        ) : reviewRequests.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No review requests yet.</p>
            <p className="text-xs text-gray-400 mt-1">Review requests will be scheduled automatically after appointments.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviewRequests.map((msg) => (
              <div
                key={msg.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {msg.recipient_phone || msg.recipient_email || 'Unknown'}
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

export default ReputationPage;
