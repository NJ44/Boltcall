import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface IconProps {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'brand' | 'text' | 'muted' | 'white';
}

const Icon: React.FC<IconProps> = ({
  icon: IconComponent,
  size = 'md',
  className = '',
  color = 'brand'
}) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-10 h-10'
  };

  const colorClasses = {
    brand: 'text-brand-blue',
    text: 'text-text-main',
    muted: 'text-text-muted',
    white: 'text-white'
  };

  return (
    <IconComponent 
      className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      strokeWidth={2.5}
    />
  );
};

export default Icon;
