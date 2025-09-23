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
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
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
    />
  );
};

export default Icon;
