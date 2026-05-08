import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Mail, ExternalLink } from 'lucide-react';

// ─── Channel SVG Icons ────────────────────────────────────────────────────────
const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const RedditIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
  </svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────
interface MessageDetail {
  framework: string;
  template: string;
  cta: string;
  ctaUrl?: string;
}
interface AudienceNode {
  name: string;
  segments: string[];
  volume: string;
  tier?: 'T1' | 'T2' | 'T3' | 'T4';
  message: MessageDetail;
}
interface MethodNode {
  name: string;
  volume: string;
  audiences: AudienceNode[];
}
interface ChannelNode {
  id: string;
  name: string;
  borderCls: string;
  iconCls: string;
  bgHeaderCls: string;
  icon: React.ReactNode;
  dailyTotal: string;
  methods: MethodNode[];
}

const TIER_STYLES: Record<string, string> = {
  T1: 'bg-blue-100 text-blue-700',
  T2: 'bg-purple-100 text-purple-700',
  T3: 'bg-amber-100 text-amber-700',
  T4: 'bg-red-100 text-red-700',
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const CHANNELS: ChannelNode[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    borderCls: 'border-l-blue-600',
    iconCls: 'text-blue-600',
    bgHeaderCls: 'bg-blue-50',
    icon: <LinkedInIcon className="w-4 h-4" />,
    dailyTotal: '40 DMs + 2 posts/day',
    methods: [
      {
        name: 'DMs',
        volume: '40/day · ~1,200/mo',
        audiences: [
          {
            name: 'Law Firms',
            segments: ['PI Attorneys', 'Family Law', 'Immigration', 'Employment Law'],
            volume: '40/day · 1,200/mo',
            tier: 'T1',
            message: {
              framework: 'Warm opener → Observation → Stat → Soft CTA',
              template:
                'Warm opener specific to their content/firm.\n\nSaw you are [observation about firm — case win, hire, recent content].\n\n78% of clients book the first attorney that responds. Average response time in legal is 23+ hours.\n\nSoft CTA: Want me to send the free [calculator / playbook]?',
              cta: 'Free AI Revenue Calculator',
              ctaUrl: 'boltcall.org/ai-revenue-calculator',
            },
          },
        ],
      },
      {
        name: 'Content Posts',
        volume: '2/day · ~60/mo',
        audiences: [
          {
            name: 'LinkedIn Followers',
            segments: ['All followers', 'Law firm audience'],
            volume: '~60 posts/mo',
            message: {
              framework: 'Broad hook → Story/Stat → Framework → Lead Magnet CTA',
              template:
                'Speed-to-lead stories, stat posts, and frameworks. Long-form and actionable. Broad hooks that anyone can relate to before narrowing to legal/local biz.\n\nNo em dashes. No hashtags. Line spacing for readability.\n\nEnd with: "Comment [KEYWORD] and connect" to deliver lead magnet.',
              cta: 'Comment [KEYWORD] + connect',
              ctaUrl: 'boltcall.org/ai-revenue-calculator',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'facebook',
    name: 'Facebook',
    borderCls: 'border-l-indigo-500',
    iconCls: 'text-indigo-500',
    bgHeaderCls: 'bg-indigo-50',
    icon: <FacebookIcon className="w-4 h-4" />,
    dailyTotal: '0→50 DMs + 3 group posts/wk',
    methods: [
      {
        name: 'DMs',
        volume: '0→50/day (warmup ramp)',
        audiences: [
          {
            name: 'Solar + Roofing',
            segments: ['Solar installers', 'Roofing contractors', 'HVAC', 'Dental', 'Med Spa'],
            volume: 'Wk1-2: 0 → Wk3: 20-30 → Wk4+: 40-50/day',
            tier: 'T1',
            message: {
              framework: '3-Touch + Day 14 break-up sequence',
              template:
                'Day 1: Cold opener — specific detail + 78% stat + free calculator offer\n\nDay 4: Value bump — "roofers lose $94K/yr from slow response" + link\n\nDay 7: Soft close — 1-line offer + good-luck close\n\nDay 14: Break-up — "not now or never?"',
              cta: 'Solar Speed Playbook → AI Revenue Calculator',
              ctaUrl: 'boltcall.org/solar-speed-playbook',
            },
          },
        ],
      },
      {
        name: 'Group Posts',
        volume: '3 posts/wk in 3–5 groups',
        audiences: [
          {
            name: 'Solar & Roofing Groups',
            segments: [
              'Solar Industry Professionals',
              'D2D Solar',
              'Solar Sales Mastery',
              'Roofing Business Owners',
              'Storm Restoration',
            ],
            volume: '~60 posts/mo',
            message: {
              framework: 'Mon/Thu/Fri: Stat post · Wed: Question · Sun: Value tip',
              template:
                'Mon: Speed-to-lead stat post (solar + roofing specific)\nWed: Engagement question for all ICP verticals\nThu: Stat post\nFri: Stat post\nSun: Value tip for adjacent trades\n\nNo URL drops until 2 weeks of value-posting in that group. Convert comments → DMs.',
              cta: 'Convert engagement → DMs',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'cold-email',
    name: 'Cold Email',
    borderCls: 'border-l-emerald-500',
    iconCls: 'text-emerald-600',
    bgHeaderCls: 'bg-emerald-50',
    icon: <Mail className="w-4 h-4" />,
    dailyTotal: '~167/day · 5,000/mo (Instantly)',
    methods: [
      {
        name: 'Sequences via Instantly',
        volume: '5,000/mo · 5 domains rotating',
        audiences: [
          {
            name: 'T1 — Direct ICP',
            segments: ['Solar', 'Roofing', 'HVAC', 'Dental', 'Plumbing', 'Med Spa', 'Law Firms'],
            volume: '3,500/mo · ~120/day',
            tier: 'T1',
            message: {
              framework: 'P-V-P-C: Personalization → Value → Proof → Soft CTA',
              template:
                'Opening line references the prospect specifically (their biz name, recent win, vertical stat).\n\nValue: speed-to-lead stat for their vertical.\n\nProof: specific result or metric.\n\nSoft CTA: "Free AI Revenue Calculator" or book a 15-min call.',
              cta: 'AI Revenue Calculator / Book a call',
              ctaUrl: 'boltcall.org/ai-revenue-calculator',
            },
          },
          {
            name: 'T2 — Affiliates',
            segments: ['Web designers', 'Marketing agencies', 'Coaches', 'Bookkeepers'],
            volume: '1,000/mo · ~33/day',
            tier: 'T2',
            message: {
              framework: 'PLG: Short — "Reply YES"',
              template:
                '3-line opener → one ask → CTA.\n\nShort and direct. Invite to learn about the affiliate program.\n\n"Reply YES and I\'ll send the affiliate 1-pager."',
              cta: 'Affiliate 1-pager → book a call',
            },
          },
          {
            name: 'T3 — Partners',
            segments: ['Peer SaaS founders', 'Integration listings'],
            volume: '500/mo · ~17/day',
            tier: 'T3',
            message: {
              framework: 'PLG: Short — peer-to-peer tone',
              template:
                '3-line opener → co-marketing ask.\n\nPeer-to-peer tone. Reference shared audience overlap.\n\nInvite to joint webinar or integration listing.',
              cta: 'Co-marketing invite / joint webinar',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'x-twitter',
    name: 'X (Twitter)',
    borderCls: 'border-l-gray-800',
    iconCls: 'text-gray-900',
    bgHeaderCls: 'bg-gray-50',
    icon: <XIcon className="w-4 h-4" />,
    dailyTotal: '100 personal + 15→50 Boltcall DMs',
    methods: [
      {
        name: 'DMs — Personal Account',
        volume: '100/day (X Pro limit)',
        audiences: [
          {
            name: 'Affiliates',
            segments: ['Web designers', 'Marketing agencies', 'Coaches'],
            volume: '60/day · ~1,800/mo',
            tier: 'T2',
            message: {
              framework: 'Value observation → Affiliate invite',
              template:
                'Lead with a genuine observation about their content or niche.\n\n"We pay [X]% recurring on every referral. Most partners send 2–3 clients/mo with zero extra work."\n\nOffer to send the affiliate 1-pager.',
              cta: 'Affiliate 1-pager',
            },
          },
          {
            name: 'Peer SaaS Founders',
            segments: ['T3 integration targets', 'Co-marketing partners'],
            volume: '30/day · ~900/mo',
            tier: 'T3',
            message: {
              framework: 'Peer tone → Co-marketing angle',
              template:
                'Peer-to-peer tone. Reference shared audience.\n\nCo-marketing or integration partnership invite.',
              cta: 'Joint webinar / integration listing',
            },
          },
        ],
      },
      {
        name: 'DMs — Boltcall Account',
        volume: '15→30→50/day (ramp)',
        audiences: [
          {
            name: 'T1 Local Biz (ICP)',
            segments: ['100% T1 direct ICP'],
            volume: 'Day1-3: 15 / Day4-7: 30 / Day8+: 50',
            tier: 'T1',
            message: {
              framework: 'Brand DM — value-first, no pitch opener',
              template:
                'Value-first opener referencing their business content or situation.\n\nSpeed-to-lead angle tailored to their specific vertical.',
              cta: 'AI Revenue Calculator',
              ctaUrl: 'boltcall.org/ai-revenue-calculator',
            },
          },
        ],
      },
      {
        name: 'Whale Pre-warm',
        volume: '5-10 replies/day → 1 DM/wk (Wed)',
        audiences: [
          {
            name: 'Solar Industry Whales',
            segments: ['Sam Taggart', 'Taylor McCarthy', 'Aaron Bartholomew', 'Jordan Powell', 'Tyler Mounce'],
            volume: '5-10 replies/day · 1 DM/wk',
            tier: 'T4',
            message: {
              framework: '2-wk reply warmup → Custom Loom DM → Equity pitch',
              template:
                'Phase 1 (2 weeks): 5–10 strategic replies per day on whale posts to build recognition.\n\nPhase 2 (Wednesday DM): Custom Loom video showing speed-to-lead applied to their exact audience + equity pitch or partnership invite.',
              cta: 'Solar Benchmark 2026 / Equity pitch',
              ctaUrl: 'boltcall.org/solar-benchmark-2026',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'reddit',
    name: 'Reddit',
    borderCls: 'border-l-orange-500',
    iconCls: 'text-orange-500',
    bgHeaderCls: 'bg-orange-50',
    icon: <RedditIcon className="w-4 h-4" />,
    dailyTotal: '5–10 long-form answers/day',
    methods: [
      {
        name: 'Long-form AEO Answers',
        volume: '5–10/day · ~150/mo',
        audiences: [
          {
            name: 'AI Citation Engines',
            segments: ['ChatGPT', 'Perplexity', 'Google AI Overviews', 'Gemini'],
            volume: '5-10/day',
            message: {
              framework: '9:1 helpful-to-mention ratio — no links, no DMs',
              template:
                'Answer questions about speed-to-lead, lead response, and AI for local businesses comprehensively and helpfully.\n\nNo cold DMs. Never drop direct links. 9:1 helpful-to-mention ratio.\n\nGoal: get cited by AI engines as an authoritative source on speed-to-lead for local service businesses.',
              cta: 'Build AI citation presence (AEO)',
            },
          },
        ],
      },
    ],
  },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3">
    <div className="text-xl font-bold text-gray-900">{value}</div>
    <div className="text-xs font-medium text-gray-700 mt-0.5">{label}</div>
    {sub && <div className="text-[10px] text-gray-400 mt-0.5">{sub}</div>}
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const OutreachMapPage: React.FC = () => {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleChannel = (id: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleMsg = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="mb-5">
        <p className="text-sm text-gray-400 mt-0.5">
          Channel → Method → Audience → Message — active as of May 2026
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Active channels" value="5" sub="LI · FB · Email · X · Reddit" />
        <StatCard label="Daily touchpoints" value="~350+" sub="DMs + posts + emails" />
        <StatCard label="Monthly emails" value="5,000" sub="Instantly sequences" />
        <StatCard label="Audience tiers" value="T1 – T4" sub="Direct · Affiliates · Partners · Whales" />
      </div>

      {/* Column headers */}
      <div className="hidden sm:grid grid-cols-[180px_1fr_160px_72px] gap-3 px-4 mb-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Method</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Audience</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Volume / Tier</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Message</span>
      </div>

      {/* Channel sections */}
      <div className="space-y-3">
        {CHANNELS.map((channel) => {
          const isCollapsed = collapsed.has(channel.id);
          return (
            <div
              key={channel.id}
              className={`rounded-xl border border-gray-100 border-l-4 ${channel.borderCls} bg-white shadow-sm overflow-hidden`}
            >
              {/* Channel header */}
              <button
                onClick={() => toggleChannel(channel.id)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={channel.iconCls}>{channel.icon}</span>
                  <div className="text-left">
                    <span className="text-sm font-semibold text-gray-900">{channel.name}</span>
                    <span className="ml-2 text-xs text-gray-400">{channel.dailyTotal}</span>
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                    isCollapsed ? '-rotate-90' : ''
                  }`}
                />
              </button>

              {/* Methods */}
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    {channel.methods.map((method) => (
                      <div key={method.name} className="border-t border-gray-100">
                        {/* Method sub-header */}
                        <div className={`flex items-center gap-2 px-4 py-2 ${channel.bgHeaderCls}`}>
                          <span className="text-xs font-semibold text-gray-700">{method.name}</span>
                          <span className="px-1.5 py-0.5 bg-white/70 text-gray-500 text-[10px] font-medium rounded-full border border-gray-200">
                            {method.volume}
                          </span>
                        </div>

                        {/* Audience rows */}
                        {method.audiences.map((audience) => {
                          const msgKey = `${channel.id}__${method.name}__${audience.name}`;
                          const isMsgOpen = expanded.has(msgKey);
                          return (
                            <div key={audience.name} className="border-t border-gray-50">
                              <div className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[180px_1fr_160px_72px] gap-x-3 gap-y-1 px-4 py-3 items-start">
                                {/* Method label (sm+) */}
                                <div className="hidden sm:block pt-0.5">
                                  <span className="text-xs text-gray-400 italic">{method.name}</span>
                                </div>

                                {/* Audience */}
                                <div>
                                  <div className="text-sm font-medium text-gray-800">{audience.name}</div>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {audience.segments.map((s) => (
                                      <span
                                        key={s}
                                        className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-md"
                                      >
                                        {s}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Volume + Tier */}
                                <div className="flex flex-col gap-1 items-start">
                                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded-full leading-tight">
                                    {audience.volume}
                                  </span>
                                  {audience.tier && (
                                    <span
                                      className={`px-2 py-0.5 text-[10px] font-semibold rounded-full leading-tight ${
                                        TIER_STYLES[audience.tier]
                                      }`}
                                    >
                                      {audience.tier}
                                    </span>
                                  )}
                                </div>

                                {/* View message */}
                                <div>
                                  <button
                                    onClick={() => toggleMsg(msgKey)}
                                    className="flex items-center gap-0.5 text-xs font-medium text-blue-600 hover:text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
                                  >
                                    View
                                    <ChevronRight
                                      className={`w-3 h-3 transition-transform duration-150 ${
                                        isMsgOpen ? 'rotate-90' : ''
                                      }`}
                                    />
                                  </button>
                                </div>
                              </div>

                              {/* Expanded message panel */}
                              <AnimatePresence initial={false}>
                                {isMsgOpen && (
                                  <motion.div
                                    key="msg"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.18, ease: 'easeInOut' }}
                                    className="overflow-hidden"
                                  >
                                    <div className="mx-4 mb-3 rounded-lg border border-blue-100 bg-blue-50/40 p-3">
                                      <div className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mb-2">
                                        {audience.message.framework}
                                      </div>
                                      <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                                        {audience.message.template}
                                      </pre>
                                      <div className="mt-3 pt-2 border-t border-blue-100 flex items-center gap-2 flex-wrap">
                                        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                                          CTA
                                        </span>
                                        <span className="text-xs text-blue-700 font-medium">
                                          {audience.message.cta}
                                        </span>
                                        {audience.message.ctaUrl && (
                                          <a
                                            href={`https://${audience.message.ctaUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-auto flex items-center gap-1 text-[10px] text-gray-400 hover:text-blue-600 transition-colors"
                                          >
                                            <span>{audience.message.ctaUrl}</span>
                                            <ExternalLink className="w-3 h-3" />
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OutreachMapPage;
