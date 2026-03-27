import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MessageSquare, Megaphone, Globe, Calendar, Bell, PhoneForwarded, Bot } from 'lucide-react';
import { updateMetaDescription } from '../lib/utils';

/* ─── animated glow line using unique IDs for animateMotion ────────────── */
const GlowLineWithId: React.FC<{ id: string; path: string; delay?: number }> = ({ id, path, delay = 0 }) => (
  <g>
    <path d={path} stroke="#1e3a5f" strokeWidth="2" fill="none" opacity="0.25" />
    <path
      d={path}
      stroke="url(#blueGlow)"
      strokeWidth="3"
      fill="none"
      strokeDasharray="16 184"
      strokeLinecap="round"
      style={{
        animation: `flowDash 3s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    />
    <path id={id} d={path} fill="none" stroke="none" />
    <circle r="5" fill="#93c5fd" filter="url(#dotGlow)">
      <animateMotion dur="3s" repeatCount="indefinite" begin={`${delay}s`}>
        <mpath xlinkHref={`#${id}`} />
      </animateMotion>
    </circle>
  </g>
);

/* ─── source / output card ─────────────────────────────────────────────── */
const NodeCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  sub?: string;
  delay?: number;
}> = ({ icon, label, sub, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="flex flex-col items-center gap-2 rounded-2xl border border-blue-500/20 bg-[#0a1628]/80 backdrop-blur-sm px-6 py-5 w-36 shadow-[0_0_24px_rgba(59,130,246,0.12)] hover:shadow-[0_0_32px_rgba(59,130,246,0.25)] transition-shadow duration-300"
  >
    <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">{icon}</div>
    <span className="text-sm font-semibold text-white tracking-wide">{label}</span>
    {sub && <span className="text-[11px] text-blue-300/60 text-center leading-tight">{sub}</span>}
  </motion.div>
);

/* ─── central AI node ──────────────────────────────────────────────────── */
const CenterNode: React.FC = () => (
  <motion.div
    initial={{ scale: 0.7, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.6, delay: 0.3, type: 'spring' }}
    className="relative flex flex-col items-center justify-center rounded-3xl border-2 border-blue-500/40 bg-gradient-to-br from-blue-600/20 to-blue-900/30 backdrop-blur-md px-10 py-8 shadow-[0_0_60px_rgba(59,130,246,0.25)]"
  >
    {/* pulsing ring */}
    <div className="absolute inset-0 rounded-3xl border-2 border-blue-400/20 animate-ping-slow" />
    <div className="rounded-2xl bg-blue-500/20 p-4 mb-3">
      <Bot size={40} className="text-blue-400" />
    </div>
    <span className="text-lg font-bold text-white tracking-wide">Boltcall</span>
    <span className="text-xs text-blue-300/70 font-medium">AI Agent</span>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════════════ */

const DemoFlowPage: React.FC = () => {
  useEffect(() => {
    document.title = 'How Boltcall Works | Demo';
    updateMetaDescription('See how Boltcall AI connects every channel to smart business actions.');
  }, []);

  /*
   * Layout — the diagram is rendered in two ways:
   *   • Desktop (md+): an SVG layer draws the animated lines between absolutely-
   *     positioned card columns and a centre node.
   *   • Mobile: a simplified vertical layout with CSS-only animated connectors.
   */

  const sources = [
    { icon: <Phone size={22} />, label: 'Phone', sub: 'Incoming calls' },
    { icon: <Mail size={22} />, label: 'Email', sub: 'Form submissions' },
    { icon: <MessageSquare size={22} />, label: 'SMS', sub: 'Text messages' },
    { icon: <Megaphone size={22} />, label: 'Ads', sub: 'Lead ads' },
    { icon: <Globe size={22} />, label: 'Website', sub: 'Chat widget' },
  ];

  const outputs = [
    { icon: <Calendar size={22} />, label: 'Calendar', sub: 'Book appointments' },
    { icon: <Bell size={22} />, label: 'Notifications', sub: 'Alert the owner' },
    { icon: <PhoneForwarded size={22} />, label: 'Phone', sub: 'Transfer to human' },
  ];

  return (
    <div className="min-h-screen bg-[#060d1b] text-white overflow-hidden relative">
      {/* subtle radial background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(59,130,246,0.08),transparent)]" />

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="relative z-10 pt-16 pb-8 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent"
        >
          How Boltcall Works
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-blue-200/60 max-w-xl mx-auto text-base md:text-lg"
        >
          Every channel flows into one AI agent — and the right action happens automatically.
        </motion.p>
      </header>

      {/* ── Desktop diagram (hidden on mobile) ────────────────────────────── */}
      <div className="hidden md:block relative z-10 mx-auto max-w-6xl px-4 pb-24">
        <div className="relative" style={{ height: 520 }}>
          {/* SVG lines layer */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1100 520"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="blueGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                <stop offset="50%" stopColor="#60a5fa" stopOpacity="1" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
              <filter id="dotGlow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Source → Center lines */}
            <GlowLineWithId id="s0" path="M 140 60  C 320 60, 380 260, 480 260"  delay={0} />
            <GlowLineWithId id="s1" path="M 140 170 C 320 170, 380 260, 480 260" delay={0.4} />
            <GlowLineWithId id="s2" path="M 140 260 C 300 260, 380 260, 480 260" delay={0.8} />
            <GlowLineWithId id="s3" path="M 140 350 C 320 350, 380 260, 480 260" delay={1.2} />
            <GlowLineWithId id="s4" path="M 140 450 C 320 450, 380 260, 480 260" delay={1.6} />

            {/* Center → Output lines */}
            <GlowLineWithId id="o0" path="M 620 260 C 720 260, 780 120, 960 120"  delay={0.2} />
            <GlowLineWithId id="o1" path="M 620 260 C 720 260, 780 260, 960 260"  delay={0.7} />
            <GlowLineWithId id="o2" path="M 620 260 C 720 260, 780 400, 960 400"  delay={1.1} />
          </svg>

          {/* Source cards — left column */}
          <div className="absolute left-0 top-0 flex flex-col items-center" style={{ width: 160 }}>
            {sources.map((s, i) => (
              <div key={s.label} className="mb-2" style={{ marginTop: i === 0 ? 16 : 0 }}>
                <NodeCard icon={s.icon} label={s.label} sub={s.sub} delay={0.1 * i} />
              </div>
            ))}
          </div>

          {/* Center AI node */}
          <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
            <CenterNode />
          </div>

          {/* Output cards — right column */}
          <div className="absolute right-0 flex flex-col items-center gap-6" style={{ width: 160, top: 56 }}>
            {outputs.map((o, i) => (
              <NodeCard key={o.label} icon={o.icon} label={o.label} sub={o.sub} delay={0.2 + 0.1 * i} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile layout ─────────────────────────────────────────────────── */}
      <div className="md:hidden relative z-10 px-6 pb-20">
        {/* Sources */}
        <h2 className="text-xs uppercase tracking-widest text-blue-400/60 mb-4 text-center">Sources</h2>
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {sources.map((s, i) => (
            <NodeCard key={s.label} icon={s.icon} label={s.label} delay={0.05 * i} />
          ))}
        </div>

        {/* Animated connector down */}
        <div className="flex justify-center mb-6">
          <div className="w-0.5 h-16 bg-gradient-to-b from-blue-500/60 to-transparent relative overflow-hidden">
            <div className="absolute inset-0 w-full bg-gradient-to-b from-transparent via-blue-400 to-transparent animate-mobile-flow" />
          </div>
        </div>

        {/* Center node */}
        <div className="flex justify-center mb-6">
          <CenterNode />
        </div>

        {/* Animated connector down */}
        <div className="flex justify-center mb-6">
          <div className="w-0.5 h-16 bg-gradient-to-b from-blue-500/60 to-transparent relative overflow-hidden">
            <div className="absolute inset-0 w-full bg-gradient-to-b from-transparent via-blue-400 to-transparent animate-mobile-flow" />
          </div>
        </div>

        {/* Outputs */}
        <h2 className="text-xs uppercase tracking-widest text-blue-400/60 mb-4 text-center">Actions</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {outputs.map((o, i) => (
            <NodeCard key={o.label} icon={o.icon} label={o.label} sub={o.sub} delay={0.05 * i} />
          ))}
        </div>
      </div>

      {/* ── Inline keyframe styles ────────────────────────────────────────── */}
      <style>{`
        @keyframes flowDash {
          0%   { stroke-dashoffset: 200; }
          100% { stroke-dashoffset: 0;   }
        }
        @keyframes ping-slow {
          0%   { opacity: 0.6; transform: scale(1);   }
          70%  { opacity: 0;   transform: scale(1.15); }
          100% { opacity: 0;   transform: scale(1.15); }
        }
        .animate-ping-slow {
          animation: ping-slow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes mobile-flow {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(200%);  }
        }
        .animate-mobile-flow {
          animation: mobile-flow 1.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default DemoFlowPage;
