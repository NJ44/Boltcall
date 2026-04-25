import React, { useRef, useCallback } from 'react';
import { motion, useSpring, useTransform, MotionValue } from 'framer-motion';

const SPRING = { stiffness: 72, damping: 12, mass: 1 };

type LayerConfig = {
  id: string; label: string; desc: string;
  factor: number; size: number; opacity: number;
  blurPx: number; brightness: number;
  glowColor: string; glowSpread: number;
};

const LAYERS: LayerConfig[] = [
  { id: 'layer4', label: 'layer4', desc: 'Back — shifts most',
    factor: 44, size: 218, opacity: 0.18, blurPx: 14, brightness: 0.38,
    glowColor: 'rgba(15,40,160,0.9)', glowSpread: 36 },
  { id: 'layer3', label: 'layer3', desc: 'Mid — medium shift',
    factor: 24, size: 208, opacity: 0.52, blurPx: 5, brightness: 0.70,
    glowColor: 'rgba(59,120,245,0.75)', glowSpread: 26 },
  { id: 'layer2', label: 'layer2', desc: 'Front — shifts least',
    factor: 9, size: 198, opacity: 1, blurPx: 0, brightness: 1,
    glowColor: 'rgba(125,190,255,0.35)', glowSpread: 44 },
];

const LogoLayer: React.FC<{
  mouseX: MotionValue<number>; mouseY: MotionValue<number>; cfg: LayerConfig;
}> = ({ mouseX, mouseY, cfg }) => {
  const x = useTransform(mouseX, v => v * cfg.factor);
  const y = useTransform(mouseY, v => v * cfg.factor);
  const parts: string[] = [];
  if (cfg.blurPx > 0) parts.push('blur(' + cfg.blurPx + 'px)');
  if (cfg.brightness < 1) parts.push('brightness(' + cfg.brightness + ')');
  parts.push('drop-shadow(0 0 ' + cfg.glowSpread + 'px ' + cfg.glowColor + ')');
  const imgFilter = parts.join(' ');
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ x, y }}
    >
      <img src="/boltcall_small_logo.webp" alt="" draggable={false}
        style={{ width: cfg.size, height: cfg.size, objectFit: 'contain',
                 opacity: cfg.opacity, filter: imgFilter, userSelect: 'none' }}
        loading="lazy"
        decoding="async" />
    </motion.div>
  );
};

const Stage: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useSpring(0, SPRING);
  const mouseY = useSpring(0, SPRING);
  const onMove = useCallback((e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left - rect.width / 2) / (rect.width / 2));
    mouseY.set((e.clientY - rect.top - rect.height / 2) / (rect.height / 2));
  }, [mouseX, mouseY]);
  const onLeave = useCallback(() => { mouseX.set(0); mouseY.set(0); }, [mouseX, mouseY]);
  return (
    <div ref={ref} className="relative cursor-crosshair"
      style={{ width: 420, height: 420 }} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%)' }}
        animate={{ opacity: [0.5, 1, 0.5], scale: [0.88, 1.04, 0.88] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      {LAYERS.map(cfg => (
        <LogoLayer key={cfg.id} mouseX={mouseX} mouseY={mouseY} cfg={cfg} />
      ))}
    </div>
  );
};

const LogoAnimationDemoPage: React.FC = () => (
  <div className="min-h-screen text-white overflow-hidden"
    style={{ background: '#04060d' }}>

    <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap');
      .font-syne { font-family: 'Syne', sans-serif; }
      .font-dm   { font-family: 'DM Mono', 'Courier New', monospace; }`}</style>

    <div className="pointer-events-none fixed inset-0" style={{
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
      backgroundSize: '64px 64px',
    }} />
    <div className="pointer-events-none fixed inset-0" style={{
      background: 'radial-gradient(ellipse 60% 50% at 50% 55%, rgba(29,78,216,0.07), transparent)',
    }} />

    <motion.header
      initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="font-dm relative z-10 flex items-center justify-between px-8 py-6 border-b"
      style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
      <div className="flex items-center gap-3">
        <img src="/boltcall_small_logo.webp" alt="Boltcall" className="h-6 w-auto" width={24} height={24} loading="eager" decoding="async" />
        <span className="text-xs tracking-widest text-white/30">/ parallax-depth demo</span>
      </div>
      <a href="/" className="text-[11px] text-white/25 hover:text-white/60 transition-colors tracking-[0.2em] uppercase">
        back
      </a>
    </motion.header>

    <main className="relative z-10 flex flex-col items-center justify-center min-h-[88vh] px-6 gap-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="font-dm text-center max-w-lg space-y-3">
        <p className="text-[10px] tracking-[0.35em] text-blue-400/60 uppercase">
          Layered Parallax Component
        </p>
        <h1 className="font-syne text-5xl sm:text-6xl font-extrabold leading-[1.05]"
          style={{ letterSpacing: '-0.02em' }}>
          Three{' '}
          <span style={{ background: 'linear-gradient(90deg,#60a5fa,#a5f3fc)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Planes.
          </span>
          <br />One Depth.
        </h1>
        <p className="text-sm text-white/35 leading-relaxed pt-1">
          Each layer translates at its own rate —{' '}
          <span className="text-blue-400/70">no 3-D CSS</span>, no perspective.
          Pure 2-D parallax shift between three independent depth planes.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.18 }} className="relative">
        <div className="absolute inset-0 rounded-full pointer-events-none"
          style={{ border: '1px solid rgba(59,130,246,0.10)', transform: 'scale(1.08)' }} />
        <div className="absolute inset-0 rounded-full pointer-events-none"
          style={{ border: '1px solid rgba(59,130,246,0.05)', transform: 'scale(1.22)' }} />
        <Stage />
      </motion.div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="font-dm text-[11px] tracking-[0.3em] text-white/20 uppercase">
        move cursor over the logo
      </motion.p>
    </main>

    <motion.section
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.6 }}
      className="font-dm relative z-10 border-t"
      style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
      <div className="max-w-2xl mx-auto grid grid-cols-3">
        {LAYERS.map((cfg, i) => (
          <div key={cfg.id}
            className={['px-6 py-8 flex flex-col gap-2', i < LAYERS.length - 1 ? 'border-r' : ''].join(' ')}
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  background: i === 2 ? 'rgba(147,210,255,0.9)' : i === 1 ? 'rgba(59,130,246,0.7)' : 'rgba(30,60,180,0.6)',
                  boxShadow: i === 2 ? '0 0 6px rgba(147,210,255,0.6)' : i === 1 ? '0 0 6px rgba(59,130,246,0.5)' : '0 0 6px rgba(30,60,180,0.4)',
                }} />
              <code className="text-xs text-white/50">{cfg.label}</code>
            </div>
            <p className="font-syne text-2xl font-bold text-white/80">x{cfg.factor}</p>
            <p className="text-[11px] text-white/30 leading-tight">{cfg.desc}</p>
            <p className="text-[10px] text-white/20 pt-1">blur {cfg.blurPx}px · opacity {Math.round(cfg.opacity * 100)}%</p>
          </div>
        ))}
      </div>
    </motion.section>
  </div>
);

export default LogoAnimationDemoPage;
