import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Phone, MessageSquare, Zap, Clock, Users, Star,
  Copy, Check, ChevronRight, ChevronDown, Loader2, AlertCircle,
  ExternalLink, Upload, Sparkles, CheckCircle2,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

type FeatureKey =
  | 'voice_agent'
  | 'speed_to_lead'
  | 'chatbot'
  | 'reminders'
  | 'lead_reactivation'
  | 'reputation_manager';

type FeatureCard = {
  key: FeatureKey;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  configLink: string;
  needsEmbed: boolean;
};

const FEATURES: FeatureCard[] = [
  {
    key: 'voice_agent',
    name: 'AI Receptionist',
    description: 'Never miss a call — AI picks up and books appointments for you',
    icon: Phone,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    configLink: '/dashboard/agents',
    needsEmbed: false,
  },
  {
    key: 'speed_to_lead',
    name: 'Speed to Lead',
    description: 'Automatically call back new leads within 60 seconds',
    icon: Zap,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    configLink: '/dashboard/speed-to-lead',
    needsEmbed: true,
  },
  {
    key: 'chatbot',
    name: 'Website Chatbot',
    description: 'AI chat bubble on your website that answers questions and books',
    icon: MessageSquare,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    configLink: '/dashboard/website-bubble',
    needsEmbed: true,
  },
  {
    key: 'reminders',
    name: 'Appointment Reminders',
    description: 'Text and email clients before their appointment — reduces no-shows',
    icon: Clock,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    configLink: '/dashboard/reminders',
    needsEmbed: false,
  },
  {
    key: 'lead_reactivation',
    name: 'Lead Reactivation',
    description: 'AI calls your old leads and re-books the ones still interested',
    icon: Users,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    configLink: '/dashboard/lead-reactivation',
    needsEmbed: false,
  },
  {
    key: 'reputation_manager',
    name: 'Google Reviews',
    description: 'Automatically ask happy customers for a 5-star Google review',
    icon: Star,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    configLink: '/dashboard/reputation',
    needsEmbed: true,
  },
];

// Readiness data collected from DB
interface ReadinessData {
  hasAgent: boolean;
  agentName: string | null;
  agentId: string | null;
  hasPhone: boolean;
  phoneNumber: string | null;
  hasCalcom: boolean;
  businessName: string | null;
  embedToken: string | null;
  googleReviewUrl: string | null;
  remindersConfig: Record<string, any> | null;
  reputationConfig: Record<string, any> | null;
}

const FeatureHub: React.FC = () => {
  const { user } = useAuth();
  const [features, setFeatures] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<FeatureKey | null>(null);
  const [readiness, setReadiness] = useState<ReadinessData>({
    hasAgent: false, agentName: null, agentId: null,
    hasPhone: false, phoneNumber: null,
    hasCalcom: false, businessName: null, embedToken: null,
    googleReviewUrl: null, remindersConfig: null, reputationConfig: null,
  });

  // Inline form states
  const [googleReviewUrl, setGoogleReviewUrl] = useState('');
  const [calApiKey, setCalApiKey] = useState('');
  const [inlineSaving, setInlineSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Fetch everything on mount
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        // Parallel fetch all data we need
        const [featuresRes, agentRes, phoneRes, profileRes] = await Promise.all([
          supabase
            .from('business_features')
            .select('*')
            .eq('user_id', user.id)
            .single(),
          supabase
            .from('agents')
            .select('id, name, agent_type')
            .eq('user_id', user.id)
            .limit(1)
            .maybeSingle(),
          supabase
            .from('phone_numbers')
            .select('id, phone_number')
            .eq('user_id', user.id)
            .limit(1)
            .maybeSingle(),
          supabase
            .from('business_profiles')
            .select('id, business_name')
            .eq('user_id', user.id)
            .maybeSingle(),
        ]);

        // Handle business_features
        let data = featuresRes.data;
        if (featuresRes.error || !data) {
          const { data: newRow, error: insertError } = await supabase
            .from('business_features')
            .insert({ user_id: user.id, workspace_id: user.id })
            .select()
            .single();
          if (insertError) {
            setError('Failed to initialize features. Please refresh.');
            setLoading(false);
            return;
          }
          data = newRow;
        }

        if (data) {
          setFeatures({
            voice_agent: data.voice_agent_enabled ?? false,
            speed_to_lead: data.speed_to_lead_enabled ?? false,
            chatbot: data.chatbot_enabled ?? false,
            reminders: data.reminders_enabled ?? false,
            lead_reactivation: data.lead_reactivation_enabled ?? false,
            reputation_manager: data.reputation_manager_enabled ?? false,
          });

          const repConfig = (data.reputation_manager_config || {}) as Record<string, any>;
          const remConfig = (data.reminders_config || {}) as Record<string, any>;

          setReadiness({
            hasAgent: !!agentRes.data,
            agentName: agentRes.data?.name || null,
            agentId: agentRes.data?.id || null,
            hasPhone: !!phoneRes.data,
            phoneNumber: phoneRes.data?.phone_number || null,
            hasCalcom: !!remConfig.cal_connected,
            businessName: profileRes.data?.business_name || null,
            embedToken: data.embed_token || null,
            googleReviewUrl: repConfig.google_review_url || null,
            remindersConfig: remConfig,
            reputationConfig: repConfig,
          });

          if (repConfig.google_review_url) {
            setGoogleReviewUrl(repConfig.google_review_url);
          }
        }
      } catch (err) {
        console.error('FeatureHub load error:', err);
        setError('Failed to load features. Please try again.');
      }
      setLoading(false);
    })();
  }, [user]);

  const toggleFeature = async (key: FeatureKey) => {
    if (!user) return;
    const newValue = !features[key];

    // If turning ON and feature needs setup, expand the card instead of just toggling
    if (newValue && needsSetup(key)) {
      setExpandedCard(key);
      return;
    }

    setToggling(key);
    try {
      const { error: updateError } = await supabase
        .from('business_features')
        .update({ [`${key}_enabled`]: newValue, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);

      if (updateError) {
        setError(`Failed to toggle ${key.replace(/_/g, ' ')}.`);
        setTimeout(() => setError(null), 4000);
        setToggling(null);
        return;
      }

      setFeatures((prev) => ({ ...prev, [key]: newValue }));

      // If just turned ON, expand the card to show status
      if (newValue) {
        setExpandedCard(key);
      } else {
        setExpandedCard(null);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setTimeout(() => setError(null), 4000);
    }
    setToggling(null);
  };

  // Check if a feature needs additional setup before it can be activated
  const needsSetup = (key: FeatureKey): boolean => {
    switch (key) {
      case 'voice_agent':
        return !readiness.hasAgent || !readiness.hasPhone;
      case 'speed_to_lead':
        return !readiness.hasAgent;
      case 'chatbot':
        return !readiness.hasAgent;
      case 'reminders':
        return !readiness.hasCalcom;
      case 'lead_reactivation':
        return false;
      case 'reputation_manager':
        return !readiness.googleReviewUrl && !googleReviewUrl;
      default:
        return false;
    }
  };

  // Activate a feature after inline setup is done
  const activateFeature = async (key: FeatureKey) => {
    if (!user) return;
    setInlineSaving(true);

    try {
      if (key === 'reputation_manager' && googleReviewUrl) {
        const existing = readiness.reputationConfig || {};
        await supabase
          .from('business_features')
          .update({
            reputation_manager_config: {
              ...existing,
              google_review_url: googleReviewUrl,
              trigger: existing.trigger || 'delay',
              delay_seconds: existing.delay_seconds || 30,
              popup_text: existing.popup_text || 'Enjoying our service? Leave us a Google review!',
              button_text: existing.button_text || 'Leave a Review',
            },
            reputation_manager_enabled: true,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);

        setReadiness((prev) => ({ ...prev, googleReviewUrl }));
        setFeatures((prev) => ({ ...prev, reputation_manager: true }));
      } else if (key === 'reminders') {
        if (calApiKey.trim()) {
          const { data: { session } } = await supabase.auth.getSession();
          const response = await fetch('/.netlify/functions/calcom-webhook', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session?.access_token}`,
            },
            body: JSON.stringify({ cal_api_key: calApiKey.trim() }),
          });

          if (!response.ok) {
            const result = await response.json();
            setError(result.error || 'Failed to connect Cal.com');
            setInlineSaving(false);
            return;
          }

          setReadiness((prev) => ({ ...prev, hasCalcom: true }));
          setCalApiKey('');
        }

        await supabase
          .from('business_features')
          .update({
            reminders_enabled: true,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);

        setFeatures((prev) => ({ ...prev, reminders: true }));
      } else {
        await supabase
          .from('business_features')
          .update({ [`${key}_enabled`]: true, updated_at: new Date().toISOString() })
          .eq('user_id', user.id);

        setFeatures((prev) => ({ ...prev, [key]: true }));
      }
    } catch (err) {
      setError('Activation failed. Please try again.');
      setTimeout(() => setError(null), 4000);
    }
    setInlineSaving(false);
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  // Get readiness checklist for a feature
  const getReadinessItems = (key: FeatureKey): { label: string; ready: boolean; link?: string }[] => {
    switch (key) {
      case 'voice_agent':
        return [
          { label: 'AI agent created', ready: readiness.hasAgent, link: '/dashboard/agents' },
          { label: 'Phone number configured', ready: readiness.hasPhone, link: '/dashboard/phone' },
        ];
      case 'speed_to_lead':
        return [
          { label: 'AI agent created', ready: readiness.hasAgent, link: '/dashboard/agents' },
        ];
      case 'chatbot':
        return [
          { label: 'AI agent created', ready: readiness.hasAgent, link: '/dashboard/agents' },
        ];
      case 'reminders':
        return [
          { label: 'Cal.com connected', ready: readiness.hasCalcom },
        ];
      case 'reputation_manager':
        return [
          { label: 'Google Review URL added', ready: !!readiness.googleReviewUrl },
        ];
      default:
        return [];
    }
  };

  // Reusable embed code block with platform-specific guidance
  const renderEmbedBlock = (label: string, copyId: string) => {
    if (!readiness.embedToken) return null;
    const script = `<script src="https://tryboltcall.com/embed.js" data-token="${readiness.embedToken}"></script>`;
    return (
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-600 block">{label}</label>
        <div className="flex items-center gap-2">
          <code className="flex-1 px-3 py-2 bg-gray-50 rounded-lg border text-xs font-mono text-gray-700 truncate">
            {script}
          </code>
          <button
            onClick={() => copyText(script, copyId)}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
          >
            {copied === copyId ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
          </button>
        </div>
        <p className="text-xs text-gray-400">
          <span className="font-medium text-gray-500">Where to paste it:</span>{' '}
          Wix → Settings &gt; Custom Code &nbsp;|&nbsp;
          WordPress → Appearance &gt; Header Scripts &nbsp;|&nbsp;
          Squarespace → Settings &gt; Code Injection
        </p>
      </div>
    );
  };

  // Render inline activation panel for each feature
  const renderActivationPanel = (key: FeatureKey) => {
    const isActive = features[key];
    const items = getReadinessItems(key);
    const allReady = items.every((i) => i.ready);

    switch (key) {
      case 'voice_agent':
        return (
          <div className="space-y-3">
            {/* How it works */}
            <p className="text-xs text-gray-500 leading-relaxed">
              When someone calls your number, the AI picks up, answers their questions using your business info, and books appointments on your calendar.
            </p>
            {isActive ? (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-3">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>
                  <span className="font-medium">{readiness.agentName || 'Your AI receptionist'}</span> is live
                  {readiness.phoneNumber ? <> on <span className="font-medium">{readiness.phoneNumber}</span></> : ' and answering calls'}
                </span>
              </div>
            ) : (
              <>
                {/* Readiness checklist */}
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-sm">
                      {item.ready ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                      )}
                      <span className={item.ready ? 'text-gray-700' : 'text-gray-500'}>{item.label}</span>
                      {!item.ready && item.link && (
                        <Link to={item.link} className="text-blue-600 hover:text-blue-700 text-xs font-medium ml-auto">
                          Set up →
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
                {allReady && (
                  <button
                    onClick={() => activateFeature('voice_agent')}
                    disabled={inlineSaving}
                    className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {inlineSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Turn On AI Receptionist
                  </button>
                )}
              </>
            )}
            <Link to="/dashboard/agents" className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
              Change voice, greeting, or behavior <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        );

      case 'speed_to_lead':
        return (
          <div className="space-y-3">
            <p className="text-xs text-gray-500 leading-relaxed">
              When someone fills out a form on your website (or from Google/Facebook ads), your AI instantly calls them back to book an appointment.
            </p>
            {!readiness.hasAgent ? (
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                    <span className="text-gray-500">{item.label}</span>
                    {item.link && (
                      <Link to={item.link} className="text-blue-600 hover:text-blue-700 text-xs font-medium ml-auto">
                        Set up →
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <>
                {isActive && (
                  <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-3">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Live — new leads from your website will be called back automatically</span>
                  </div>
                )}
                {/* Option 1: Embed script (easiest) */}
                {renderEmbedBlock(
                  'Step 1: Copy this code and add it to your website',
                  'embed'
                )}
                {/* Option 2: Direct webhook for tech-savvy or ad platforms */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    For Google Ads or Facebook Ads: use this link
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-gray-50 rounded-lg border text-xs font-mono text-gray-700 truncate">
                      {window.location.origin}/hooks/lead?client_id={user?.id}
                    </code>
                    <button
                      onClick={() => copyText(`${window.location.origin}/hooks/lead?client_id=${user?.id}`, 'webhook')}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                    >
                      {copied === 'webhook' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Paste this as the "webhook URL" in your ad platform's lead form settings</p>
                </div>
                {!isActive && (
                  <button
                    onClick={() => activateFeature('speed_to_lead')}
                    disabled={inlineSaving}
                    className="w-full mt-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {inlineSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    Turn On Speed to Lead
                  </button>
                )}
              </>
            )}
            <Link to="/dashboard/speed-to-lead" className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
              View incoming leads <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        );

      case 'chatbot':
        return (
          <div className="space-y-3">
            <p className="text-xs text-gray-500 leading-relaxed">
              A chat bubble appears on your website. Visitors can ask questions, get instant answers from your AI, and book appointments — all without calling.
            </p>
            {!readiness.hasAgent ? (
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                    <span className="text-gray-500">{item.label}</span>
                    {item.link && (
                      <Link to={item.link} className="text-blue-600 hover:text-blue-700 text-xs font-medium ml-auto">
                        Set up →
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <>
                {isActive && (
                  <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-3">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Live — the chat bubble is active on your website</span>
                  </div>
                )}
                {renderEmbedBlock(
                  'Copy this code and add it to your website — the chat bubble will appear automatically',
                  'chatbot-embed'
                )}
                {!isActive && (
                  <button
                    onClick={() => activateFeature('chatbot')}
                    disabled={inlineSaving}
                    className="w-full mt-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {inlineSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
                    Turn On Chatbot
                  </button>
                )}
              </>
            )}
            <Link to="/dashboard/website-bubble" className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
              Change colors, position, or greeting <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        );

      case 'reminders':
        return (
          <div className="space-y-3">
            <p className="text-xs text-gray-500 leading-relaxed">
              Automatically sends a text and/or email to your clients before their appointment. Reduces no-shows by up to 80%.
            </p>
            {isActive && readiness.hasCalcom ? (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-3">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Live — reminders go out {readiness.remindersConfig?.time || '24'} hours before each appointment</span>
              </div>
            ) : readiness.hasCalcom ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Calendar connected</span>
                </div>
                <button
                  onClick={() => activateFeature('reminders')}
                  disabled={inlineSaving}
                  className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {inlineSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
                  Turn On Reminders
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-xs text-gray-500 bg-blue-50 rounded-lg p-3 space-y-1">
                  <p className="font-medium text-gray-700">Quick setup (takes 30 seconds):</p>
                  <ol className="list-decimal list-inside space-y-0.5 text-gray-600">
                    <li>Open <a href="https://cal.com/settings/developer/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">cal.com/settings/developer/api-keys</a></li>
                    <li>Click "Create new key" and copy it</li>
                    <li>Paste it below</li>
                  </ol>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Your Cal.com connection key</label>
                  <input
                    type="password"
                    value={calApiKey}
                    onChange={(e) => setCalApiKey(e.target.value)}
                    placeholder="cal_live_..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => activateFeature('reminders')}
                  disabled={inlineSaving || !calApiKey.trim()}
                  className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {inlineSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
                  Connect Calendar & Turn On
                </button>
              </div>
            )}
            <Link to="/dashboard/reminders" className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
              Edit reminder message or timing <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        );

      case 'lead_reactivation':
        return (
          <div className="space-y-3">
            <p className="text-xs text-gray-500 leading-relaxed">
              Upload a list of past leads or customers who never booked. The AI will call each one, have a natural conversation, and try to re-book them.
            </p>
            {isActive ? (
              <>
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-3">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Ready — upload your leads to start a campaign</span>
                </div>
                <Link
                  to="/dashboard/lead-reactivation"
                  className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload Lead List (Excel or CSV)
                </Link>
              </>
            ) : (
              <button
                onClick={() => activateFeature('lead_reactivation')}
                disabled={inlineSaving}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {inlineSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
                Turn On Lead Reactivation
              </button>
            )}
          </div>
        );

      case 'reputation_manager':
        return (
          <div className="space-y-3">
            <p className="text-xs text-gray-500 leading-relaxed">
              After each appointment, your customers get a friendly text or see a popup on your website asking them to leave a Google review.
            </p>
            {isActive && readiness.googleReviewUrl ? (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-3">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Live — customers are being asked for reviews automatically</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-xs text-gray-500 bg-yellow-50 rounded-lg p-3 space-y-1">
                  <p className="font-medium text-gray-700">How to find your review link:</p>
                  <ol className="list-decimal list-inside space-y-0.5 text-gray-600">
                    <li>Search your business on Google</li>
                    <li>Click "Ask for reviews" on your Business Profile</li>
                    <li>Copy the link and paste it below</li>
                  </ol>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Your Google Review link</label>
                  <input
                    type="url"
                    value={googleReviewUrl}
                    onChange={(e) => setGoogleReviewUrl(e.target.value)}
                    placeholder="https://g.page/r/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => activateFeature('reputation_manager')}
                  disabled={inlineSaving || !googleReviewUrl.trim()}
                  className="w-full py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {inlineSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
                  Turn On Google Reviews
                </button>
              </div>
            )}
            {readiness.embedToken && isActive && renderEmbedBlock(
              'Add to your website to show review popups',
              'rep-embed'
            )}
            <Link to="/dashboard/reputation" className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
              Edit popup message or SMS timing <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 text-sm">Dismiss</button>
        </div>
      )}

      {/* Feature Grid */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900">Features</h2>
            <p className="text-sm text-gray-500 mt-1">Turn on the tools you need — each one takes under a minute to set up</p>
          </div>
          <div className="text-sm text-gray-500">
            {Object.values(features).filter(Boolean).length} / {FEATURES.length} active
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              const enabled = features[feature.key];
              const isToggling = toggling === feature.key;
              const isExpanded = expandedCard === feature.key;

              return (
                <motion.div
                  key={feature.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative rounded-xl border transition-all ${
                    enabled
                      ? 'border-gray-200 bg-white shadow-sm'
                      : 'border-gray-100 bg-gray-50'
                  } ${isExpanded ? 'ring-2 ring-blue-200' : ''}`}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg ${feature.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${feature.color}`} />
                      </div>

                      {/* Toggle */}
                      <button
                        onClick={() => toggleFeature(feature.key)}
                        disabled={isToggling}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          enabled ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        {isToggling ? (
                          <Loader2 className="w-4 h-4 animate-spin text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                        ) : (
                          <span
                            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                              enabled ? 'left-[22px]' : 'left-0.5'
                            }`}
                          />
                        )}
                      </button>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-0.5">{feature.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{feature.description}</p>

                    {/* Status indicator or expand button */}
                    {enabled ? (
                      <button
                        onClick={() => setExpandedCard(isExpanded ? null : feature.key)}
                        className="inline-flex items-center text-sm text-green-600 hover:text-green-700 font-medium"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Active
                        {isExpanded ? <ChevronDown className="w-4 h-4 ml-1" /> : <ChevronRight className="w-4 h-4 ml-1" />}
                      </button>
                    ) : (
                      <button
                        onClick={() => setExpandedCard(isExpanded ? null : feature.key)}
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Activate
                        {isExpanded ? <ChevronDown className="w-4 h-4 ml-0.5" /> : <ChevronRight className="w-4 h-4 ml-0.5" />}
                      </button>
                    )}
                  </div>

                  {/* Expanded activation panel */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-2 border-t border-gray-100">
                          {renderActivationPanel(feature.key)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Status dot */}
                  <div className="absolute top-5 right-16">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        enabled ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureHub;
