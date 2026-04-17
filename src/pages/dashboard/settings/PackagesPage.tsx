import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, Clock, Star, MessageSquare, Loader2, AlertCircle, Zap } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { PremiumToggle } from '../../../components/ui/bouncy-toggle';

type FeatureKey = 'reminders' | 'reputation_manager' | 'chatbot';

interface PackageDef {
  key: FeatureKey;
  name: string;
  tagline: string;
  price: string;
  priceNote: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  bgGradient: string;
  features: string[];
  configLink: string;
  badge?: string;
}

const PACKAGES: PackageDef[] = [
  {
    key: 'reminders',
    name: 'Appointment Reminders',
    tagline: 'Reduce no-shows automatically',
    price: '$29',
    priceNote: '/mo add-on',
    icon: Clock,
    accentColor: 'text-green-600',
    bgGradient: 'from-green-50 to-emerald-50',
    badge: 'Popular',
    features: [
      'Automated SMS reminders before appointments',
      'Email reminders with custom timing',
      'Customizable reminder templates',
      'Two-way confirmation replies',
      'No-show reduction analytics',
    ],
    configLink: '/dashboard/reminders',
  },
  {
    key: 'reputation_manager',
    name: 'Reputation Manager',
    tagline: 'Grow your 5-star reviews on autopilot',
    price: '$29',
    priceNote: '/mo add-on',
    icon: Star,
    accentColor: 'text-yellow-600',
    bgGradient: 'from-yellow-50 to-amber-50',
    features: [
      'Auto-request Google reviews after service',
      'Smart timing — send when satisfaction is highest',
      'Customizable review request messages',
      'Track review count over time',
      'Negative feedback filter',
    ],
    configLink: '/dashboard/reputation',
  },
  {
    key: 'chatbot',
    name: 'Website Chatbot',
    tagline: 'Turn website visitors into booked clients',
    price: '$39',
    priceNote: '/mo add-on',
    icon: MessageSquare,
    accentColor: 'text-purple-600',
    bgGradient: 'from-purple-50 to-violet-50',
    badge: 'New',
    features: [
      'AI chat bubble on your website',
      'Answers FAQs and books appointments',
      'Customizable appearance & brand colors',
      'Captures visitor contact info',
      'Works 24/7 without you',
    ],
    configLink: '/dashboard/chat-widget',
  },
];

const PackagesPage: React.FC = () => {
  const { user } = useAuth();
  const [features, setFeatures] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('business_features')
          .select('*')
          .eq('user_id', user.id)
          .single();
        if (fetchError || !data) {
          setError('Failed to load package settings.');
          setLoading(false);
          return;
        }
        setFeatures({
          reminders: data.reminders_enabled ?? false,
          reputation_manager: data.reputation_manager_enabled ?? false,
          chatbot: data.chatbot_enabled ?? false,
        });
      } catch {
        setError('Failed to load packages. Please try again.');
      }
      setLoading(false);
    })();
  }, [user]);

  const toggleFeature = async (key: FeatureKey) => {
    if (!user) return;
    const newValue = !features[key];
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
    } catch {
      setError('Something went wrong. Please try again.');
      setTimeout(() => setError(null), 4000);
    }
    setToggling(null);
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
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Packages</h1>
        <p className="text-sm text-gray-500 mt-1">
          Add-on packages to extend your Boltcall workspace. Enable only what you need.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 text-sm">Dismiss</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {PACKAGES.map((pkg) => {
          const Icon = pkg.icon;
          const enabled = features[pkg.key] ?? false;
          const isToggling = toggling === pkg.key;

          return (
            <div
              key={pkg.key}
              className={`relative bg-white rounded-2xl border-2 transition-all duration-200 overflow-hidden flex flex-col ${
                enabled
                  ? 'border-blue-300 shadow-md shadow-blue-100'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              {/* Top accent gradient */}
              <div className={`bg-gradient-to-br ${pkg.bgGradient} px-5 pt-5 pb-4`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm`}>
                      <Icon className={`w-5 h-5 ${pkg.accentColor}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-900">{pkg.name}</h3>
                        {pkg.badge && (
                          <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                            {pkg.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{pkg.tagline}</p>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">{pkg.price}</span>
                  <span className="text-xs text-gray-500">{pkg.priceNote}</span>
                </div>
              </div>

              {/* Features */}
              <div className="px-5 py-4 flex-1">
                <ul className="space-y-2">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-green-600" />
                      </div>
                      <span className="text-xs text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                <Link
                  to={pkg.configLink}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Configure
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{enabled ? 'Active' : 'Inactive'}</span>
                  {isToggling ? (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  ) : (
                    <PremiumToggle checked={enabled} onChange={() => toggleFeature(pkg.key)} />
                  )}
                </div>
              </div>

              {/* Active indicator */}
              {enabled && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Active
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PackagesPage;
