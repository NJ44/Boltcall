import React, { useState, useEffect } from 'react';
import { Star, Loader2, AlertCircle, MessageSquare } from 'lucide-react';
import { PageSkeleton } from '../../components/ui/loading-skeleton';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useTokens } from '../../contexts/TokenContext';
import { UnsavedChanges } from '../../components/ui/unsaved-changes';

const inputClass =
  'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900';

const ReputationPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { claimReward } = useTokens();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);

  // Settings
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

  // Review request history
  const [reviewRequests, setReviewRequests] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Helper to mark fields dirty on change
  const dirty = () => setIsDirty(true);

  // ── Load saved config ──
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
      } catch {
        setError('Failed to load settings. Using defaults.');
        setTimeout(() => setError(null), 4000);
      }
      setLoading(false);
    })();
  }, [user]);

  // ── Load review request history ──
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data } = await supabase
          .from('scheduled_messages')
          .select('id, recipient_phone, recipient_email, scheduled_for, status')
          .eq('user_id', user.id)
          .eq('type', 'review_request')
          .in('status', ['scheduled', 'sent', 'failed'])
          .order('scheduled_for', { ascending: false })
          .limit(10);

        if (data) setReviewRequests(data);
      } catch {
        // silent — non-critical
      }
      setReviewsLoading(false);
    })();
  }, [user]);

  // ── Save ──
  const handleSave = async () => {
    if (!user) return;

    // Validate SMS template variables
    if (smsEnabled) {
      const missing = ['{{client_name}}', '{{review_url}}'].filter(v => !smsTemplate.includes(v));
      if (missing.length) {
        setError(`SMS template is missing: ${missing.join(', ')}`);
        showToast({ title: 'Missing variables', message: `Add ${missing.join(', ')} to your template`, variant: 'error', duration: 5000 });
        return;
      }
    }

    setSaving(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('business_features')
        .update({
          reputation_manager_config: {
            google_review_url: googleReviewUrl,
            trigger,
            delay_seconds: delaySeconds,
            popup_text: popupText,
            button_text: buttonText,
            sms_enabled: smsEnabled,
            sms_template: smsTemplate,
            sms_delay: smsDelay,
          },
          reputation_manager_enabled: true,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setSaveSuccess(true);
      setTimeout(() => { setSaveSuccess(false); setIsDirty(false); }, 2000);

      const reward = await claimReward('enable_reputation');
      if (reward?.success && !reward?.alreadyClaimed) {
        showToast({ title: 'Bonus Tokens!', message: '+25 tokens for enabling reputation manager', variant: 'success', duration: 4000 });
      }
    } catch {
      setError('Failed to save. Please try again.');
      showToast({ title: 'Error', message: 'Failed to save reputation settings.', variant: 'error', duration: 4000 });
      setSaveError(true);
      setTimeout(() => setSaveError(false), 3000);
    }
    setSaving(false);
  };

  if (loading) return <PageSkeleton />;

  const statusColor: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-700',
    sent: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 text-sm">
            Dismiss
          </button>
        </div>
      )}

      {/* ── Settings Card ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Star className="w-4 h-4 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Reputation Manager</h2>
            <p className="text-sm text-gray-500">Collect more Google reviews automatically</p>
          </div>
        </div>

        {/* Google Review URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Google Review Link</label>
          <p className="text-xs text-gray-400 mb-2">Google Business Profile &gt; Share review form</p>
          <input
            type="url"
            value={googleReviewUrl}
            onChange={(e) => { setGoogleReviewUrl(e.target.value); dirty(); }}
            placeholder="https://g.page/r/..."
            className={inputClass}
          />
        </div>

        {/* Website Popup Settings */}
        <div className="border-t border-gray-100 pt-5">
          <h3 className="text-base font-medium text-gray-900 mb-3">Website Popup</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Show popup</label>
              <select
                value={trigger}
                onChange={(e) => { setTrigger(e.target.value as 'delay' | 'scroll' | 'exit'); dirty(); }}
                className={inputClass}
              >
                <option value="delay">After a time delay</option>
                <option value="scroll">After 70% scroll</option>
                <option value="exit">When leaving the page</option>
              </select>
            </div>

            {trigger === 'delay' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delay (seconds)</label>
                <input
                  type="number"
                  value={delaySeconds}
                  onChange={(e) => { setDelaySeconds(parseInt(e.target.value) || 30); dirty(); }}
                  min={5}
                  max={300}
                  className={inputClass}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <input
                type="text"
                value={popupText}
                onChange={(e) => { setPopupText(e.target.value); dirty(); }}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button label</label>
              <input
                type="text"
                value={buttonText}
                onChange={(e) => { setButtonText(e.target.value); dirty(); }}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* SMS Review Requests */}
        <div className="border-t border-gray-100 pt-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-medium text-gray-900">SMS Review Requests</h3>
              <p className="text-sm text-gray-400">Auto-send after appointments</p>
            </div>
            <button
              onClick={() => { setSmsEnabled(!smsEnabled); dirty(); }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${smsEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${smsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {smsEnabled && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Send after</label>
                <select
                  value={smsDelay}
                  onChange={(e) => { setSmsDelay(e.target.value); dirty(); }}
                  className={inputClass}
                >
                  <option value="1">1 hour</option>
                  <option value="3">3 hours</option>
                  <option value="24">Next day</option>
                  <option value="48">2 days</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message template</label>
                <textarea
                  value={smsTemplate}
                  onChange={(e) => { setSmsTemplate(e.target.value); dirty(); }}
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Variables: <code className="text-gray-600">{'{{client_name}}'}</code>, <code className="text-gray-600">{'{{business_name}}'}</code>, <code className="text-gray-600">{'{{review_url}}'}</code>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Recent Review Requests ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-purple-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Recent Requests</h2>
        </div>

        {reviewsLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        ) : reviewRequests.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            No review requests yet. They will appear here after appointments.
          </p>
        ) : (
          <div className="space-y-2">
            {reviewRequests.map((msg) => (
              <div key={msg.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-gray-50 gap-1 sm:gap-0">
                <span className="text-sm text-gray-900 truncate">
                  {msg.recipient_phone || msg.recipient_email || 'Unknown'}
                </span>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-gray-500">
                    {new Date(msg.scheduled_for).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[msg.status] || 'bg-gray-100 text-gray-600'}`}>
                    {msg.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <UnsavedChanges
        open={isDirty}
        isSaving={saving}
        success={saveSuccess}
        error={saveError}
        onReset={() => { setIsDirty(false); window.location.reload(); }}
        onSave={handleSave}
      />
    </div>
  );
};

export default ReputationPage;
