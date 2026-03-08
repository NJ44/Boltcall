import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Phone, MessageSquare, Zap, Clock, Users, Star,
  Copy, Check, ChevronRight, Loader2,
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
  icon: React.ElementType;
  color: string;
  bgColor: string;
  configLink: string;
  needsEmbed: boolean;
};

const FEATURES: FeatureCard[] = [
  {
    key: 'voice_agent',
    name: 'AI Receptionist',
    description: 'AI answers your phone 24/7',
    icon: Phone,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    configLink: '/dashboard/agents',
    needsEmbed: false,
  },
  {
    key: 'speed_to_lead',
    name: 'Speed to Lead',
    description: 'Auto-respond to new leads instantly',
    icon: Zap,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    configLink: '/dashboard/speed-to-lead',
    needsEmbed: true,
  },
  {
    key: 'chatbot',
    name: 'Website Chatbot',
    description: 'AI chat widget on your website',
    icon: MessageSquare,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    configLink: '/dashboard/website-bubble',
    needsEmbed: true,
  },
  {
    key: 'reminders',
    name: 'Reminders',
    description: 'Automated appointment reminders',
    icon: Clock,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    configLink: '/dashboard/reminders',
    needsEmbed: false,
  },
  {
    key: 'lead_reactivation',
    name: 'Lead Reactivation',
    description: 'Re-engage old leads with AI',
    icon: Users,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    configLink: '/dashboard/lead-reactivation',
    needsEmbed: false,
  },
  {
    key: 'reputation_manager',
    name: 'Reputation Manager',
    description: 'Automate Google review collection',
    icon: Star,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    configLink: '/dashboard/reputation',
    needsEmbed: true,
  },
];

const FeatureHub: React.FC = () => {
  const { user } = useAuth();
  const [features, setFeatures] = useState<Record<string, boolean>>({});
  const [embedToken, setEmbedToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showScript, setShowScript] = useState(false);

  // Fetch or create business_features row
  useEffect(() => {
    if (!user) return;
    (async () => {
      // Try to get existing row
      let { data, error } = await supabase
        .from('business_features')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // If no row exists, create one
      if (error || !data) {
        const { data: newRow } = await supabase
          .from('business_features')
          .insert({ user_id: user.id, workspace_id: user.id })
          .select()
          .single();
        data = newRow;
      }

      if (data) {
        setFeatures({
          voice_agent: data.voice_agent_enabled,
          speed_to_lead: data.speed_to_lead_enabled,
          chatbot: data.chatbot_enabled,
          reminders: data.reminders_enabled,
          lead_reactivation: data.lead_reactivation_enabled,
          reputation_manager: data.reputation_manager_enabled,
        });
        setEmbedToken(data.embed_token);
      }
      setLoading(false);
    })();
  }, [user]);

  const toggleFeature = async (key: FeatureKey) => {
    if (!user) return;
    setToggling(key);
    const newValue = !features[key];

    const { error } = await supabase
      .from('business_features')
      .update({ [`${key}_enabled`]: newValue, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);

    if (!error) {
      setFeatures((prev) => ({ ...prev, [key]: newValue }));

      // Show embed script banner if a website feature was just enabled
      const feature = FEATURES.find((f) => f.key === key);
      if (newValue && feature?.needsEmbed) {
        setShowScript(true);
      }
    }
    setToggling(null);
  };

  const copyScript = () => {
    if (!embedToken) return;
    const scriptTag = `<script src="https://tryboltcall.com/embed.js" data-token="${embedToken}"></script>`;
    navigator.clipboard.writeText(scriptTag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const enabledWebFeatures = FEATURES.filter((f) => f.needsEmbed && features[f.key]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Feature Grid */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900">Features</h2>
            <p className="text-sm text-gray-500 mt-1">Toggle features on or off for your business</p>
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

              return (
                <motion.div
                  key={feature.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative rounded-xl border p-5 transition-all ${
                    enabled
                      ? 'border-gray-200 bg-white shadow-sm'
                      : 'border-gray-100 bg-gray-50'
                  }`}
                >
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

                  <h3 className="font-semibold text-gray-900 mb-1">{feature.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{feature.description}</p>

                  <Link
                    to={feature.configLink}
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Configure
                    <ChevronRight className="w-4 h-4 ml-0.5" />
                  </Link>

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

      {/* Embed Script Banner */}
      {(showScript || enabledWebFeatures.length > 0) && embedToken && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-lg">Paste this into your website</h3>
              <p className="text-blue-100 text-sm mt-1">
                One script powers {enabledWebFeatures.map((f) => f.name).join(', ') || 'your website features'}.
                Add it to Wix, Squarespace, WordPress, or any site builder.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <code className="flex-1 bg-white/10 backdrop-blur rounded-lg px-4 py-3 text-sm font-mono text-blue-50 overflow-x-auto">
              {`<script src="https://tryboltcall.com/embed.js" data-token="${embedToken}"></script>`}
            </code>
            <button
              onClick={copyScript}
              className="flex-shrink-0 bg-white/20 hover:bg-white/30 rounded-lg px-4 py-3 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <div className="mt-3 text-xs text-blue-200">
            Works with: Wix (Settings &gt; Custom Code) &middot; Squarespace (Code Injection) &middot; WordPress (Header Scripts) &middot; Any HTML site
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FeatureHub;
