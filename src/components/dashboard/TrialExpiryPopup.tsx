import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, X, Sparkles } from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext';

const DISMISSED_KEY = 'boltcall_trial_popup_dismissed';

const TrialExpiryPopup: React.FC = () => {
  const { isTrialing, trialDaysRemaining, isLoading } = useSubscription();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    // Only show if trialing with 3 or fewer days left
    if (isLoading || !isTrialing || trialDaysRemaining > 3) {
      setDismissed(true);
      return;
    }

    // Check if already dismissed today
    const lastDismissed = sessionStorage.getItem(DISMISSED_KEY);
    if (lastDismissed) {
      setDismissed(true);
      return;
    }

    // Show the popup
    setDismissed(false);
  }, [isTrialing, trialDaysRemaining, isLoading]);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem(DISMISSED_KEY, Date.now().toString());
  };

  const daysText =
    trialDaysRemaining === 0
      ? 'today'
      : trialDaysRemaining === 1
        ? 'tomorrow'
        : `in ${trialDaysRemaining} days`;

  const urgencyColor =
    trialDaysRemaining === 0
      ? 'text-red-600'
      : trialDaysRemaining === 1
        ? 'text-orange-600'
        : 'text-amber-600';

  const urgencyBg =
    trialDaysRemaining === 0
      ? 'bg-red-50'
      : trialDaysRemaining === 1
        ? 'bg-orange-50'
        : 'bg-amber-50';

  const urgencyIconBg =
    trialDaysRemaining === 0
      ? 'bg-red-100'
      : trialDaysRemaining === 1
        ? 'bg-orange-100'
        : 'bg-amber-100';

  return (
    <AnimatePresence>
      {!dismissed && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleDismiss}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full p-6 relative">
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Icon */}
              <div className={`w-14 h-14 ${urgencyIconBg} rounded-full flex items-center justify-center mx-auto mb-5`}>
                <Clock className={`w-7 h-7 ${urgencyColor}`} />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Your free trial ends {daysText}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-500 text-center mb-6">
                Subscribe to keep access to all features — AI receptionist, chatbot, speed-to-lead, and more.
              </p>

              {/* Urgency banner */}
              <div className={`${urgencyBg} rounded-xl p-4 mb-5`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className={`w-4 h-4 ${urgencyColor}`} />
                  <span className={`text-sm font-semibold ${urgencyColor}`}>
                    {trialDaysRemaining === 0
                      ? 'Last chance — your access expires today'
                      : `Only ${trialDaysRemaining} day${trialDaysRemaining === 1 ? '' : 's'} left`}
                  </span>
                </div>
                <p className={`text-xs ${urgencyColor} opacity-80`}>
                  After your trial ends, you'll lose access to Pro features and automations.
                </p>
              </div>

              {/* Action buttons */}
              <div className="space-y-2.5">
                <Link
                  to="/dashboard/settings/plan-billing"
                  onClick={handleDismiss}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Choose a Plan <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={handleDismiss}
                  className="w-full px-4 py-2.5 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                >
                  Remind Me Later
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TrialExpiryPopup;
