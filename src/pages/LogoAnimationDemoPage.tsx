import React, { useRef, useState, useCallback } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

/* ─── 3-D tilt card with Boltcall logo ───────────────────────────────────── */
const SPRING = { stiffness: 260, damping: 30 };

const FloatingLogo: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  const rawX = useSpring(0, SPRING);
  const rawY = useSpring(0, SPRING);

  const rotateX  = useTransform(rawY, v => -v * 18);
  const rotateY  = useTransform(rawX, v =>  v * 18);
  const glowX    = useTransform(rawX, [-1, 1], ['10%', '90%']);
  const glowY    = useTransform(rawY, [-1, 1], ['10%', '90%']);

  /* layer parallax depths */
  const shadow1X = useTransform(rawX, v =>  v * -12);
  const shadow1Y = useTransform(rawY, v =>  v *  12);
  const shadow2X = useTransform(rawX, v =>  v * -24);
  const shadow2Y = useTransform(rawY, v =>  v *  24);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width  * 2 - 1);
    rawY.set((e.clientY - rect.top)  / rect.height * 2 - 1);
  }, [rawX, rawY]);

  const onLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    setHovering(false);
  }, [rawX, rawY]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={onLeave}
      style={{ perspective: 1000 }}
      className="relative w-72 h-72 cursor-none select-none"
    >
      {/* 3-D scene */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative w-full h-full"
      >
        {/* Deepest shadow ghost – layer 3 */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            x: shadow2X,
            y: shadow2Y,
            translateZ: -40,
            opacity: 0.08,
            filter: 'blur(8px)',
          }}
        >
          <img src="/boltcall_small_logo.webp" alt="" className="w-48 h-48 object-contain" />
        </motion.div>

        {/* Mid shadow ghost – layer 2 */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            x: shadow1X,
            y: shadow1Y,
            translateZ: -20,
            opacity: 0.18,
            filter: 'blur(3px)',
          }}
        >
          <img src="/boltcall_small_logo.webp" alt="" className="w-48 h-48 object-contain" />
        </motion.div>

        {/* Specular highlight – moves with mouse */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([gx, gy]: string[]) =>
                `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.12) 0%, transparent 60%)`,
            ),
            translateZ: 10,
          }}
        />

        {/* Main logo – top layer */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: 'translateZ(30px)' }}
        >
          <motion.img
            src="/boltcall_small_logo.webp"
            alt="Boltcall"
            className="w-48 h-48 object-contain drop-shadow-2xl"
            animate={hovering ? { scale: 1.06 } : { scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─── Ambient rings ──────────────────────────────────────────────────────── */
const Ring: React.FC<{ size: number; delay: number; opacity: number }> = ({ size, delay, opacity }) => (
  <motion.div
    className="absolute rounded-full border border-indigo-500/30 pointer-events-none"
    style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, left: '50%', top: '50%' }}
    animate={{ scale: [1, 1.12, 1], opacity: [opacity, opacity * 0.4, opacity] }}
    transition={{ duration: 4, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

/* ─── Floating data chip ─────────────────────────────────────────────────── */
const Chip: React.FC<{ label: string; value: string; x: string; y: string; delay: number }> = ({
  label, value, x, y, delay,
}) => (
  <motion.div
    className="absolute hidden md:flex flex-col items-start gap-0.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3"
    style={{ left: x, top: y }}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: [0, -4, 0] }}
    transition={{ opacity: { delay, duration: 0.6 }, y: { delay, duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
  >
    <span className="text-[10px] uppercase tracking-widest text-white/40 font-medium">{label}</span>
    <span className="text-sm font-semibold text-white">{value}</span>
  </motion.div>
);

/* ─── Page ───────────────────────────────────────────────────────────────── */
const LogoAnimationDemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#080810] text-white overflow-hidden font-sans">

      {/* ── noise grain overlay ── */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* ── radial background ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(99,102,241,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(79,70,229,0.07),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.05),transparent_40%)]" />
      </div>

      {/* ── sparse grid ── */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* ── top bar ── */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex items-center justify-between px-8 py-6"
      >
        <div className="flex items-center gap-3">
          <img src="/boltcall_small_logo.webp" alt="Boltcall" className="h-7 w-auto" />
          <span className="text-sm font-medium text-white/50 tracking-wide">/ Demo</span>
        </div>
        <a
          href="/"
          className="text-xs text-white/30 hover:text-white/70 transition-colors tracking-widest uppercase"
        >
          ← Back
        </a>
      </motion.header>

      {/* ── hero ── */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-6 gap-16">

        {/* headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center space-y-4 max-w-xl"
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-indigo-400/80 font-medium">
            Interactive Logo Component
          </p>
          <h1
            className="text-5xl sm:text-6xl font-bold leading-[1.1] tracking-tight"
          >
            Depth in
            <br />
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-300 bg-clip-text text-transparent">
              every pixel
            </span>
          </h1>
          <p className="text-base text-white/40 leading-relaxed">
            A layered 3-D parallax component — mouse-reactive depth with
            multi-layer rendering and specular highlight.
          </p>
        </motion.div>

        {/* stage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="relative flex items-center justify-center"
          style={{ width: 480, height: 480 }}
        >
          {/* ambient rings */}
          <Ring size={360} delay={0}   opacity={0.6} />
          <Ring size={450} delay={1.2} opacity={0.35} />
          <Ring size={520} delay={2.4} opacity={0.18} />

          {/* soft glow blob */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              className="w-56 h-56 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)' }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          {/* floating data chips */}
          <Chip label="Layers"    value="3-deep"    x="-12%"  y="15%"  delay={0.6} />
          <Chip label="Spring"    value="260/30"    x="102%"  y="18%"  delay={0.8} />
          <Chip label="Rotation"  value="±18 deg"   x="-14%"  y="68%"  delay={1.0} />
          <Chip label="Z-offset"  value="−40 → +30" x="103%"  y="65%"  delay={1.2} />

          {/* logo card */}
          <FloatingLogo />
        </motion.div>

        {/* hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-xs text-white/25 tracking-widest uppercase"
        >
          Move cursor over the logo
        </motion.p>

      </main>

      {/* ── spec strip ── */}
      <motion.section
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.7 }}
        className="relative z-10 border-t border-white/5 mt-4"
      >
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/5 text-center">
          {[
            { stat: 'framer-motion', desc: 'Spring physics' },
            { stat: 'translateZ', desc: 'CSS 3-D preserve' },
            { stat: '60 fps', desc: 'GPU-composited' },
          ].map(({ stat, desc }) => (
            <div key={stat} className="px-8 py-8 space-y-1">
              <p className="text-xl font-bold text-white/90 tracking-tight">{stat}</p>
              <p className="text-xs text-white/30 uppercase tracking-widest">{desc}</p>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default LogoAnimationDemoPage;
