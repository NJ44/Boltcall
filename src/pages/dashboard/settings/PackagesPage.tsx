import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock, Star, MessageSquare,
  Loader2, AlertCircle, Package,
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { PremiumToggle } from '../../../components/ui/bouncy-toggle';

type FeatureKey = 'reminders' | 'reputation_manager' | 'chatbot';

interface PackageItem {
  key: FeatureKey;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  configLink: string;
}

interface PackageGroup {
  name: string;
  description: string;
  badge: string;
  features: PackageItem[];
}

const PACKAGES: PackageGroup[] = [
  {
    name: 'Operations Pack',
    description: 'Reduce no-shows and grow your online reputation on autopilot',
    badge: 'Add-on',
    features: [
      {
        key: 'reminders',
        name: 'Appointment Reminders',
        description: 'Text and email clients before their appointment — reduces no-shows',
        icon: Clock,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        configLink: '/dashboard/reminders',
      },
      {
        key: 'reputation_manager',
        name: 'Reputation Manager',
        description: 'Automatically ask happy customers for a 5-star Google review',
        icon: Star,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        configLink: '/dashboard/reputation',
      },
    ],
  },
  {
    name: 'Smart Website Pack',
    description: 'Turn your website into a lead-converting machine with AI',
    badge: 'Add-on',
    features: [
      {
        key: 'chatbot',
        name: 'Website Chatbot',
        description: 'AI chat bubble on your website that answers questions and books',
        icon: MessageSquare,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        configLink: '/dashboard/chat-widget',
      },
    ],
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
          Add-on packages to extend your Boltcall workspace
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 text-sm">Dismiss</button>
        </div>
      )}

      {PACKAGES.map((pkg) => {
        const activeCount = pkg.features.filter((f) => features[f.key]).length;

        return (
          <div key={pkg.name} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-gray-900">{pkg.name}</h2>
                    <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
                      {pkg.badge}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{pkg.description}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400 font-medium">
                {activeCount}/{pkg.features.length} active
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {pkg.features.map((feature) => {
                const Icon = feature.icon;
                const enabled = features[feature.key];
                const isToggling = toggling === feature.key;

                return (
                  <div
                    key={feature.key}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${feature.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${feature.color}`} />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900">{feature.name}</span>
                        <p className="text-xs text-gray-500">{feature.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        to={feature.configLink}
                        className="text-xs text-gray-400 hover:text-blue-600 font-medium transition-colors"
                      >
                        Configure
                      </Link>
                      {isToggling ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      ) : (
                        <PremiumToggle
                          checked={enabled}
                          onChange={() => toggleFeature(feature.key)}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PackagesPage;
