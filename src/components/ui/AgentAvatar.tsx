import React from 'react';

interface AgentAvatarProps {
  avatar: string | null | undefined;
  color: string | null | undefined;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_MAP = {
  sm: { px: 32, text: 'text-sm', emoji: 'text-base' },
  md: { px: 48, text: 'text-lg', emoji: 'text-2xl' },
  lg: { px: 90, text: 'text-3xl', emoji: 'text-4xl' },
};

const DEFAULT_COLOR = '#3B82F6';

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function isEmoji(str: string): boolean {
  // Simple check: emoji are typically 1-2 code points via spread
  const chars = [...str];
  return chars.length <= 2;
}

export function AgentAvatar({ avatar, color, name, size = 'md', className = '' }: AgentAvatarProps) {
  const sz = SIZE_MAP[size];
  const resolvedColor = color || DEFAULT_COLOR;
  const bg = hexToRgba(resolvedColor, 0.12);
  const initial = (name || '?')[0].toUpperCase();

  const showEmoji = avatar && isEmoji(avatar);

  return (
    <div
      className={`flex items-center justify-center rounded-full flex-shrink-0 select-none font-semibold ${sz.text} ${className}`}
      style={{
        width: sz.px,
        height: sz.px,
        background: bg,
        border: `2px solid ${resolvedColor}`,
        color: resolvedColor,
      }}
    >
      {showEmoji ? (
        <span className={sz.emoji} style={{ lineHeight: 1 }}>
          {avatar}
        </span>
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
}
