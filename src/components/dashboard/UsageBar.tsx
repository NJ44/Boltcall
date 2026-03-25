import React from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  MessageCircle,
  MessageSquare,
  Smartphone,
  Users,
  Database,
  Infinity,
} from 'lucide-react';
import type { ResourceType } from '../../lib/plan-limits';
import { getUsageBarClasses, formatLimit, getResourceConfig } from '../../lib/plan-limits';

interface UsageBarProps {
  resource: ResourceType;
  current: number;
  limit: number; // -1 = unlimited
  percentage: number;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Phone,
  MessageCircle,
  MessageSquare,
  Smartphone,
  Users,
  Database,
};

const UsageBar: React.FC<UsageBarProps> = ({
  resource,
  current,
  limit,
  percentage,
  showIcon = true,
  size = 'md',
  className = '',
}) => {
  const config = getResourceConfig(resource);
  const { bar: barColor, text: textColor } = getUsageBarClasses(percentage);
  const Icon = ICON_MAP[config.icon] || Phone;
  const isUnlimited = limit === -1;

  const barHeight = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-xs';
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showIcon && (
            <Icon className={`${iconSize} text-gray-400`} />
          )}
          <span className={`${textSize} font-medium text-gray-700`}>
            {config.label}
          </span>
        </div>
        <span className={`${textSize} font-semibold ${isUnlimited ? 'text-gray-500' : textColor}`}>
          {isUnlimited ? (
            <span className="flex items-center gap-1">
              {current.toLocaleString()}
              <span className="text-gray-400">/</span>
              <Infinity className="w-3.5 h-3.5 text-gray-400" />
            </span>
          ) : (
            <>
              {current.toLocaleString()} / {formatLimit(limit, '')}
            </>
          )}
        </span>
      </div>

      <div className={`w-full bg-gray-100 rounded-full ${barHeight}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isUnlimited ? '5%' : `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`${barHeight} rounded-full ${isUnlimited ? 'bg-gray-300' : barColor}`}
        />
      </div>

      {!isUnlimited && percentage >= 90 && (
        <p className="text-xs text-red-500 font-medium">
          {percentage >= 100
            ? 'Limit reached — upgrade to continue using this feature'
            : `${Math.round(100 - percentage)}% remaining — consider upgrading`}
        </p>
      )}
    </div>
  );
};

export default UsageBar;
