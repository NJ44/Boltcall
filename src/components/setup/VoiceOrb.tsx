import React from 'react';
import { motion } from 'framer-motion';

export type VoiceOrbState = 'idle' | 'agent-speaking' | 'user-speaking' | 'ended' | 'error';

interface VoiceOrbProps {
  amplitude?: number;
  state?: VoiceOrbState;
  layoutId?: string;
  size?: number;
}

const palette: Record<VoiceOrbState, { core: string; ring: string; halo: string }> = {
  idle: {
    core: 'from-blue-400 via-blue-500 to-blue-700',
    ring: 'rgba(96, 165, 250, 0.35)',
    halo: 'rgba(59, 130, 246, 0.25)',
  },
  'agent-speaking': {
    core: 'from-blue-300 via-blue-500 to-indigo-700',
    ring: 'rgba(96, 165, 250, 0.55)',
    halo: 'rgba(59, 130, 246, 0.45)',
  },
  'user-speaking': {
    core: 'from-emerald-300 via-teal-500 to-cyan-700',
    ring: 'rgba(45, 212, 191, 0.5)',
    halo: 'rgba(20, 184, 166, 0.35)',
  },
  ended: {
    core: 'from-slate-400 via-slate-500 to-slate-700',
    ring: 'rgba(148, 163, 184, 0.3)',
    halo: 'rgba(100, 116, 139, 0.2)',
  },
  error: {
    core: 'from-rose-400 via-rose-500 to-rose-700',
    ring: 'rgba(251, 113, 133, 0.4)',
    halo: 'rgba(244, 63, 94, 0.3)',
  },
};

const VoiceOrb: React.FC<VoiceOrbProps> = ({
  amplitude = 0,
  state = 'idle',
  layoutId = 'setup-orb',
  size = 280,
}) => {
  const colors = palette[state];
  const scale = 1 + Math.min(amplitude, 1) * 0.18;
  const haloScale = 1 + Math.min(amplitude, 1) * 0.35;

  return (
    <motion.div
      layoutId={layoutId}
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      transition={{ type: 'spring', stiffness: 200, damping: 26 }}
    >
      {/* Outer halo — slow ambient pulse */}
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{ background: colors.halo }}
        animate={{
          scale: state === 'idle' ? [1, 1.1, 1] : haloScale,
          opacity: state === 'idle' ? [0.6, 0.9, 0.6] : 0.85,
        }}
        transition={
          state === 'idle'
            ? { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
            : { type: 'spring', stiffness: 120, damping: 18 }
        }
      />

      {/* Concentric rings — react to amplitude */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{
            borderColor: colors.ring,
            width: `${60 + i * 20}%`,
            height: `${60 + i * 20}%`,
          }}
          animate={{
            scale: state === 'idle' ? [1, 1.05, 1] : 1 + amplitude * (0.15 + i * 0.08),
            opacity: state === 'ended' ? 0.25 : 0.7 - i * 0.18,
          }}
          transition={
            state === 'idle'
              ? { duration: 2.6 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }
              : { type: 'spring', stiffness: 220, damping: 20 }
          }
        />
      ))}

      {/* Core orb */}
      <motion.div
        className={`relative rounded-full bg-gradient-to-br ${colors.core} shadow-2xl`}
        style={{ width: '52%', height: '52%' }}
        animate={{
          scale: state === 'idle' ? [1, 1.04, 1] : scale,
        }}
        transition={
          state === 'idle'
            ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
            : { type: 'spring', stiffness: 260, damping: 22 }
        }
      >
        {/* Inner shine */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.55), rgba(255,255,255,0.05) 45%, transparent 70%)',
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default VoiceOrb;
