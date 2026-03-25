import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, Lock } from 'lucide-react';
import { useUsageGate } from '../../hooks/useUsageTracking';
import UsageBadge from './UsageBadge';
import type { ResourceType } from '../../lib/plan-limits';

interface UsageGateWrapperProps {
  /** The resource to gate */
  resource: ResourceType;
  /** Content to render when usage is within limits */
  children: React.ReactNode;
  /**
   * Behavior when at limit:
   * - 'block' = replaces children with upgrade prompt (default)
   * - 'warn' = shows warning banner above children
   * - 'disable' = renders children but passes disabled state via render prop
   */
  mode?: 'block' | 'warn' | 'disable';
  /** Optional label override for the resource */
  label?: string;
  /** Render prop variant — receives gate state */
  render?: (gate: {
    allowed: boolean;
    current: number;
    limit: number;
    percentage: number;
    isAtLimit: boolean;
    isApproaching: boolean;
    showUpgrade: () => void;
  }) => React.ReactNode;
}

/**
 * Wraps a feature section with usage limit enforcement.
 *
 * Usage:
 *   <UsageGateWrapper resource="phone_numbers">
 *     <AddPhoneNumberButton />
 *   </UsageGateWrapper>
 *
 *   <UsageGateWrapper resource="ai_voice_minutes" mode="warn">
 *     <CallInterface />
 *   </UsageGateWrapper>
 *
 *   <UsageGateWrapper
 *     resource="sms_sent"
 *     render={({ allowed, showUpgrade }) => (
 *       <button disabled={!allowed} onClick={allowed ? send : showUpgrade}>
 *         Send SMS
 *       </button>
 *     )}
 *   />
 */
const UsageGateWrapper: React.FC<UsageGateWrapperProps> = ({
  resource,
  children,
  mode = 'block',
  label,
  render,
}) => {
  const gate = useUsageGate(resource);

  // Render prop mode
  if (render) {
    return <>{render(gate)}</>;
  }

  // If allowed and not approaching, just render children
  if (gate.allowed && !gate.isApproaching) {
    return <>{children}</>;
  }

  // Approaching limit — show warning banner
  if (gate.allowed && gate.isApproaching && (mode === 'warn' || mode === 'block')) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              <span className="font-medium">{label || resource.replace(/_/g, ' ')}</span>:{' '}
              {Math.round(gate.percentage)}% used
              <UsageBadge current={gate.current} limit={gate.limit} percentage={gate.percentage} className="ml-2" />
            </p>
          </div>
          <Link
            to="/dashboard/settings/usage"
            className="text-xs font-medium text-amber-700 hover:text-amber-900 whitespace-nowrap"
          >
            View Usage
          </Link>
        </motion.div>
        {children}
      </>
    );
  }

  // At limit
  if (!gate.allowed) {
    if (mode === 'warn') {
      return (
        <>
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-800">
                <span className="font-medium">{label || resource.replace(/_/g, ' ')}</span> limit
                reached. Upgrade your plan to continue.
              </p>
            </div>
            <Link
              to="/dashboard/settings/plan-billing"
              className="inline-flex items-center gap-1 text-xs font-medium text-red-700 hover:text-red-900 whitespace-nowrap"
            >
              Upgrade <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>
          {children}
        </>
      );
    }

    if (mode === 'disable') {
      return <div className="opacity-50 pointer-events-none">{children}</div>;
    }

    // mode === 'block' — replace children with upgrade prompt
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center"
      >
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {label || resource.replace(/_/g, ' ')} Limit Reached
        </h3>
        <p className="text-sm text-gray-500 mb-1">
          You've used {gate.current.toLocaleString()} of {gate.limit.toLocaleString()}{' '}
          {resource.replace(/_/g, ' ')}.
        </p>
        <p className="text-sm text-gray-500 mb-5">
          Upgrade your plan to get more capacity.
        </p>
        <Link
          to="/dashboard/settings/plan-billing"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          Upgrade Plan <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    );
  }

  return <>{children}</>;
};

export default UsageGateWrapper;
