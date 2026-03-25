import React from 'react';
import { Infinity } from 'lucide-react';
import type { ResourceType } from '../../lib/plan-limits';
import { getUsageColor } from '../../lib/plan-limits';

interface UsageBadgeProps {
  resource?: ResourceType;
  current: number;
  limit: number; // -1 = unlimited
  percentage?: number;
  className?: string;
}

const COLOR_CLASSES = {
  green: 'bg-blue-50 text-blue-700 border-blue-200',
  yellow: 'bg-amber-50 text-amber-700 border-amber-200',
  red: 'bg-red-50 text-red-700 border-red-200',
};

const UsageBadge: React.FC<UsageBadgeProps> = ({
  current,
  limit,
  percentage,
  className = '',
}) => {
  const isUnlimited = limit === -1;
  const pct = percentage ?? (isUnlimited ? 0 : Math.min((current / limit) * 100, 100));
  const color = getUsageColor(pct);

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
        isUnlimited ? 'bg-gray-50 text-gray-600 border-gray-200' : COLOR_CLASSES[color]
      } ${className}`}
    >
      {current.toLocaleString()}
      <span className="opacity-60">/</span>
      {isUnlimited ? (
        <Infinity className="w-3 h-3 opacity-60" />
      ) : (
        <span>{limit.toLocaleString()}</span>
      )}
    </span>
  );
};

export default UsageBadge;
