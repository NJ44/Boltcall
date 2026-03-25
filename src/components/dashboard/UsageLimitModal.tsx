import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, X, Zap } from 'lucide-react';
import { useUsageStore } from '../../stores/usageStore';
import { getResourceConfig, getNextPlan, PLAN_LIMITS } from '../../lib/plan-limits';

const UsageLimitModal: React.FC = () => {
  const { showLimitModal, limitModalResource, setShowLimitModal, planTier } = useUsageStore();

  if (!showLimitModal || !limitModalResource) return null;

  const config = getResourceConfig(limitModalResource);
  const nextPlan = getNextPlan(planTier);
  const nextPlanConfig = nextPlan ? PLAN_LIMITS[nextPlan] : null;
  const nextPlanLimit = nextPlan ? PLAN_LIMITS[nextPlan].limits[limitModalResource] : null;

  return (
    <AnimatePresence>
      {showLimitModal && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowLimitModal(false)}
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
                onClick={() => setShowLimitModal(false)}
                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Icon */}
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <Lock className="w-7 h-7 text-red-500" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                {config.label} Limit Reached
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-500 text-center mb-6">
                You've used all available {config.label.toLowerCase()} on your{' '}
                <span className="font-medium text-gray-700">
                  {PLAN_LIMITS[planTier].name}
                </span>{' '}
                plan. Upgrade to get more capacity and unlock additional features.
              </p>

              {/* Next plan CTA */}
              {nextPlanConfig && nextPlanLimit && (
                <div className="bg-blue-50 rounded-xl p-4 mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-900">
                      {nextPlanConfig.name} Plan
                    </span>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full ml-auto">
                      ${nextPlanConfig.monthlyPrice}/mo
                    </span>
                  </div>
                  <p className="text-xs text-blue-700">
                    Get up to{' '}
                    <span className="font-bold">
                      {nextPlanLimit.limit === -1
                        ? 'unlimited'
                        : nextPlanLimit.limit.toLocaleString()}
                    </span>{' '}
                    {config.label.toLowerCase()}{' '}
                    {nextPlanLimit.unit && `(${nextPlanLimit.unit})`}
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="space-y-2.5">
                <Link
                  to="/dashboard/settings/plan-billing"
                  onClick={() => setShowLimitModal(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Upgrade Plan <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setShowLimitModal(false)}
                  className="w-full px-4 py-2.5 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UsageLimitModal;
