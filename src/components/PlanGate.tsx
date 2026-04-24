import React from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../contexts/SubscriptionContext';
import type { PlanLevel } from '../lib/stripe';
import { PLAN_INFO } from '../lib/stripe';

interface PlanGateProps {
  requiredPlan: PlanLevel;
  children: React.ReactNode;
}

const PlanGate: React.FC<PlanGateProps> = ({ requiredPlan, children }) => {
  const { hasAccess, isLoading } = useSubscription();

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (hasAccess(requiredPlan)) {
    // Trial expiry messaging is handled exclusively by TrialExpiryPopup in DashboardLayout — no inline banner here.
    return <>{children}</>;
  }

  const planName = PLAN_INFO[requiredPlan].name;
  const monthlyPrice = PLAN_INFO[requiredPlan].monthlyPrice;

  return (
    <div
      className="min-h-[400px] flex items-center justify-center p-6 animate-[fadeIn_0.4s_ease-in-out_forwards]"
    >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>

        <h3 className="text-xl font-semibold text-text-primary mb-2">
          Upgrade to {planName}
        </h3>
        <p className="text-text-muted mb-6">
          This feature requires the <strong>{planName}</strong> plan or higher. Upgrade now to unlock it starting at ${monthlyPrice}/mo.
        </p>

        <Link
          to="/dashboard/settings/plan-billing"
          className="inline-flex items-center justify-center w-full px-6 py-3 bg-brand-blue text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          View Plans & Upgrade
        </Link>

        <Link
          to="/dashboard"
          className="block mt-3 text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default PlanGate;
