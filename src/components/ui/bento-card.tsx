import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { GlassDefs, GlassBox } from "./glass-box";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ZapIcon,
  PhoneOff01Icon,
  BubbleChatNotificationIcon,
  MessageCircleReplyIcon,
  Globe02Icon,
  Megaphone01Icon,
  Mail01Icon,
  Search01Icon,
  Tick01Icon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
  Refresh01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

interface TabConfig {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  header: string;
  description: string;
}

const TABS: TabConfig[] = [
  {
    id: "leads",
    label: "Leads",
    icon: ZapIcon,
    badge: "24",
    header: "Lead Inbox",
    description: "Every inbound lead captured and tracked.",
  },
  {
    id: "missed-calls",
    label: "Missed Calls",
    icon: PhoneOff01Icon,
    header: "Missed Call Recovery",
    description: "Auto-text every missed call within seconds.",
  },
  {
    id: "sms",
    label: "SMS Agent",
    icon: BubbleChatNotificationIcon,
    header: "SMS Automation",
    description: "Respond to every text instantly, 24/7.",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: MessageCircleReplyIcon,
    header: "WhatsApp Messaging",
    description: "Auto-reply to WhatsApp leads.",
  },
  {
    id: "website",
    label: "Website",
    icon: Globe02Icon,
    header: "Website Response",
    description: "Capture and reply to website form submissions.",
  },
  {
    id: "ad-response",
    label: "Ad Response",
    icon: Megaphone01Icon,
    header: "Ad Lead Reply",
    description: "Reply to Facebook & Google ad leads in seconds.",
  },
  {
    id: "email",
    label: "AI Email",
    icon: Mail01Icon,
    header: "Email Automation",
    description: "AI handles your email inbox, 24/7.",
  },
];

const BentoCard = () => {
  const { t } = useTranslation('marketing');
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const content = useMemo(() => {
    switch (activeTab.id) {
      case "leads":        return <LeadsDashboard />;
      case "missed-calls": return <MissedCallsDashboard />;
      case "sms":          return <SmsDashboard />;
      case "whatsapp":     return <WhatsAppDashboard />;
      case "website":      return <WebsiteDashboard />;
      case "ad-response":  return <AdResponseDashboard />;
      case "email":        return <EmailDashboard />;
      default:             return null;
    }
  }, [activeTab.id]);

  return (
    <div className="flex items-center justify-center w-full antialiased">
      <GlassDefs />
      <div
        className="w-full max-w-5xl transition-all duration-500 hover:-translate-y-1 m-0 relative"
        style={{ transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)" }}
      >
      <GlassBox variant="liquid" clip="lg" rounded="rounded-3xl" className="w-full">
        <div className="p-4 sm:p-6 space-y-1.5 z-30 relative">
          <h2 className="text-[10px] text-blue-300/90 uppercase tracking-widest font-semibold">
            {t('bentoCard.preview')}
          </h2>
          <p className="text-lg sm:text-2xl text-white font-semibold leading-snug max-w-[520px]">
            {t('bentoCard.tagline')}
          </p>
        </div>

        <div className="relative z-30 w-full h-[360px] sm:h-[480px] overflow-hidden rounded-2xl sm:rounded-[2rem]">
          <div className="absolute top-16 left-16 w-full h-full bg-gray-800/40 rounded-3xl border border-white/[0.08] opacity-80" />

          <div
            className="absolute top-8 left-24 w-full h-full bg-gray-900 rounded-tl-3xl flex flex-col overflow-hidden"
            style={{ boxShadow: "0 0 0 6px rgba(255,255,255,0.07)" }}
          >
            {/* Title bar */}
            <div className="px-5 py-4 rounded-tl-3xl border-b border-white/10 flex items-center relative bg-gray-800/80">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/70" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
                <div className="w-2 h-2 rounded-full bg-green-500/70" />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2">
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  Boltcall
                </span>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <div className="w-40 border-r border-white/10 flex flex-col bg-gray-800/40 overflow-hidden">
                <div className="flex-1 overflow-y-auto sidebar-nav-scroll p-2 pt-3 flex flex-col gap-0.5">
                  <LayoutGroup>
                    <p className="px-2 pt-1 pb-1 text-[8px] font-semibold uppercase tracking-wider text-gray-600">
                      Services
                    </p>
                    {TABS.map((tab) => (
                      <SidebarButton key={tab.id} tab={tab} activeTab={activeTab} setActiveTab={setActiveTab} />
                    ))}
                  </LayoutGroup>
                </div>
              </div>

              {/* Content panel */}
              <div className="flex-1 bg-gray-900 p-4 pt-5 flex flex-col gap-3 overflow-hidden relative">
                <header className="flex flex-col gap-0.5">
                  <h3 className="text-xs font-semibold text-gray-400 tracking-tight line-clamp-1 uppercase opacity-60">
                    {activeTab.header}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-normal leading-tight line-clamp-1">
                    {activeTab.description}
                  </p>
                </header>

                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={activeTab.id}
                    initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="flex-1 overflow-hidden"
                  >
                    {content}
                  </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none z-20" />
              </div>
            </div>
          </div>
        </div>
      </GlassBox>
      </div>
    </div>
  );
};

export default BentoCard;

// ── Sidebar button ─────────────────────────────────────────────────────────

const SidebarButton = ({
  tab,
  activeTab,
  setActiveTab,
}: {
  tab: TabConfig;
  activeTab: TabConfig;
  setActiveTab: (t: TabConfig) => void;
}) => {
  const isActive = activeTab.id === tab.id;
  const Icon = tab.icon;
  return (
    <button
      onClick={() => setActiveTab(tab)}
      className={cn(
        "relative flex items-center gap-1.5 p-2 rounded-xl text-xs transition-colors cursor-pointer w-full",
        isActive ? "text-white" : "text-gray-500 hover:text-gray-300",
      )}
    >
      <HugeiconsIcon icon={Icon} size={14} className="z-20 shrink-0 relative" />
      <span className="truncate z-20 relative font-medium">{tab.label}</span>
      {tab.badge && (
        <span
          className={cn(
            "ml-auto text-[8px] leading-none py-0.5 px-1 rounded-md tabular-nums transition-all z-20 relative",
            isActive
              ? "bg-blue-900/60 text-blue-400 border border-blue-700/50"
              : "bg-gray-700 text-gray-500 border border-transparent",
          )}
        >
          {tab.badge}
        </span>
      )}
      {isActive && (
        <motion.div
          layoutId="sidebar-pill"
          className="absolute left-0 w-[2px] h-4 rounded-full bg-blue-500 z-30"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      {isActive && (
        <motion.div
          layoutId="backgroundIndicator"
          className="absolute inset-0 rounded-lg bg-gray-700/60 border border-white/10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </button>
  );
};

// ── LEADS ──────────────────────────────────────────────────────────────────

const LEAD_STATUSES: Record<string, string> = {
  New:        "bg-blue-900/60 text-blue-400 border-blue-700/50",
  Contacted:  "bg-emerald-900/60 text-emerald-400 border-emerald-700/50",
  Qualified:  "bg-purple-900/60 text-purple-400 border-purple-700/50",
  Lost:       "bg-red-900/60 text-red-400 border-red-700/50",
};

const SOURCE_DOTS: Record<string, string> = {
  "Facebook Ad":  "bg-blue-400",
  "Google Ad":    "bg-amber-400",
  "Website Form": "bg-emerald-400",
  "Missed Call":  "bg-red-400",
  "SMS":          "bg-purple-400",
};

const LeadsDashboard = () => (
  <div className="flex flex-col gap-2 h-full">
    {/* KPI row */}
    <div className="grid grid-cols-3 gap-2">
      {[
        { label: "Total Leads", value: "24", trend: "+12%", up: true },
        { label: "Contacted",   value: "18", trend: "+8%",  up: true },
        { label: "Conversion",  value: "75%",trend: "+5%",  up: true },
      ].map((kpi) => (
        <div key={kpi.label} className="p-2.5 rounded-xl border border-white/10 bg-gray-800/40 flex flex-col gap-1">
          <span className="text-[8px] text-gray-500 uppercase font-semibold tracking-wider">{kpi.label}</span>
          <div className="flex items-end gap-1.5">
            <span className="text-sm font-semibold text-white">{kpi.value}</span>
            <span className={cn("text-[8px] font-medium", kpi.up ? "text-emerald-400" : "text-red-400")}>
              {kpi.trend}
            </span>
          </div>
        </div>
      ))}
    </div>

    {/* Filter row */}
    <div className="flex items-center gap-1.5">
      <div className="flex-1 flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-800/60 border border-white/10">
        <HugeiconsIcon icon={Search01Icon} size={9} className="text-gray-600" />
        <span className="text-[8px] text-gray-600">Search leads…</span>
      </div>
      {["All", "New", "Contacted"].map((f, i) => (
        <button key={f} className={cn("text-[8px] px-2 py-1 rounded-md border font-medium", i === 0 ? "bg-blue-900/60 text-blue-400 border-blue-700/50" : "bg-gray-800 text-gray-500 border-white/10")}>
          {f}
        </button>
      ))}
    </div>

    {/* Lead table */}
    <div className="rounded-xl border border-white/10 overflow-hidden bg-gray-800/20 flex-1">
      <div className="grid grid-cols-[1fr_80px_70px_50px] bg-gray-800/60 px-3 py-1.5 border-b border-white/10">
        {["Name", "Source", "Status", "Time"].map((h) => (
          <span key={h} className="text-[8px] font-semibold text-gray-600 uppercase tracking-wider">{h}</span>
        ))}
      </div>
      {[
        { name: "Mike Torres",  source: "Facebook Ad",  status: "Booked",    time: "2m"  },
        { name: "Sarah Kim",    source: "Website Form", status: "New",       time: "8m"  },
        { name: "James Lee",    source: "Missed Call",  status: "Contacted", time: "15m" },
        { name: "Ana Ruiz",     source: "Google Ad",    status: "Qualified", time: "1h"  },
        { name: "Tom B.",       source: "SMS",          status: "New",       time: "2h"  },
      ].map((lead, i) => (
        <div key={i} className="grid grid-cols-[1fr_80px_70px_50px] items-center px-3 py-1.5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-4 h-4 rounded-full bg-gray-700 flex items-center justify-center text-[7px] text-gray-400 font-medium shrink-0">
              {lead.name[0]}
            </div>
            <span className="text-[9px] text-white truncate">{lead.name}</span>
          </div>
          <div className="flex items-center gap-1 min-w-0">
            <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", SOURCE_DOTS[lead.source] ?? "bg-gray-500")} />
            <span className="text-[8px] text-gray-500 truncate">{lead.source}</span>
          </div>
          <span className={cn("text-[7px] px-1.5 py-0.5 rounded-md border font-medium w-fit", LEAD_STATUSES[lead.status] ?? LEAD_STATUSES["New"])}>
            {lead.status}
          </span>
          <span className="text-[8px] text-gray-600">{lead.time}</span>
        </div>
      ))}
    </div>
  </div>
);

// ── MISSED CALLS ──────────────────────────────────────────────────────────

const MissedCallsDashboard = () => (
  <div className="flex flex-col gap-2 h-full">
    {/* Stats */}
    <div className="grid grid-cols-3 gap-2">
      {[
        { label: "Missed Today", value: "7",   color: "text-red-400"     },
        { label: "SMS Sent",     value: "7",   color: "text-emerald-400" },
        { label: "Avg Reply",    value: "22s", color: "text-blue-400"    },
      ].map((s) => (
        <div key={s.label} className="p-2.5 rounded-xl border border-white/10 bg-gray-800/40 flex flex-col gap-1">
          <span className="text-[8px] text-gray-500 uppercase font-semibold tracking-wider">{s.label}</span>
          <span className={cn("text-sm font-semibold", s.color)}>{s.value}</span>
        </div>
      ))}
    </div>

    {/* Auto-recovery toggle */}
    <div className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-gray-800/40">
      <div>
        <div className="text-[10px] font-medium text-white">Auto-Recovery</div>
        <div className="text-[8px] text-gray-500">Text sent within 30s of missed call</div>
      </div>
      <div className="w-9 h-5 rounded-full bg-emerald-500 flex items-center px-0.5 justify-end">
        <div className="w-4 h-4 rounded-full bg-white shadow" />
      </div>
    </div>

    {/* Missed call list */}
    <div className="rounded-xl border border-white/10 overflow-hidden bg-gray-800/20 flex-1">
      <div className="bg-gray-800/60 px-3 py-1.5 border-b border-white/10">
        <span className="text-[8px] font-semibold text-gray-500 uppercase tracking-wider">Recent Missed Calls</span>
      </div>
      {[
        { name: "Unknown Caller", number: "+1 (555) 204-1832", time: "2m ago",  replied: true  },
        { name: "John D.",        number: "+1 (555) 302-4920", time: "15m ago", replied: true  },
        { name: "555-9821",       number: "+1 (555) 982-1000", time: "1h ago",  replied: false },
        { name: "Maria G.",       number: "+1 (555) 471-3300", time: "2h ago",  replied: true  },
      ].map((call, i) => (
        <div key={i} className="flex items-center gap-2.5 px-3 py-2 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
          <div className="w-6 h-6 rounded-full bg-red-900/40 border border-red-500/20 flex items-center justify-center shrink-0">
            <HugeiconsIcon icon={PhoneOff01Icon} size={10} className="text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[9px] font-medium text-white truncate">{call.name}</div>
            <div className="text-[8px] text-gray-500 truncate">{call.number}</div>
          </div>
          <div className="flex flex-col items-end gap-0.5 shrink-0">
            <span className="text-[7px] text-gray-600">{call.time}</span>
            <span className={cn("text-[7px] px-1.5 py-0.5 rounded-md font-medium", call.replied ? "bg-emerald-900/40 text-emerald-400" : "bg-gray-700 text-gray-500")}>
              {call.replied ? "SMS sent" : "Pending"}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ── SMS ───────────────────────────────────────────────────────────────────

const SmsDashboard = () => {
  const [selected, setSelected] = useState(0);
  const threads = [
    { name: "Tom B.",    preview: "Is 3pm available?",          time: "1m",  score: 82, draft: true  },
    { name: "Cindy R.",  preview: "Thanks for the quick reply", time: "8m",  score: 64, draft: false },
    { name: "David L.",  preview: "Need info on pricing",       time: "22m", score: 91, draft: true  },
    { name: "Amy K.",    preview: "Can you call me back?",      time: "1h",  score: 55, draft: false },
  ];
  return (
    <div className="flex gap-2 h-full">
      {/* Stats column */}
      <div className="flex flex-col gap-2 w-[110px] shrink-0">
        {[
          { label: "Messages",    value: "47" },
          { label: "Pending",     value: "3"  },
          { label: "Auto-Sent",   value: "44" },
          { label: "Hot Leads",   value: "8"  },
        ].map((s) => (
          <div key={s.label} className="p-2 rounded-xl border border-white/10 bg-gray-800/40 flex flex-col gap-0.5">
            <span className="text-[8px] text-gray-500 uppercase font-semibold tracking-wider">{s.label}</span>
            <span className="text-sm font-semibold text-white">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Thread list */}
      <div className="flex-1 flex flex-col rounded-xl border border-white/10 overflow-hidden bg-gray-800/20 min-w-0">
        <div className="bg-gray-800/60 px-3 py-1.5 border-b border-white/10">
          <span className="text-[8px] font-semibold text-gray-500 uppercase tracking-wider">Conversations</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {threads.map((t, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={cn(
                "w-full flex items-start gap-2 px-3 py-2 border-b border-white/5 last:border-0 text-left transition-colors",
                selected === i ? "bg-blue-900/20" : "hover:bg-white/5"
              )}
            >
              <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-[8px] text-gray-400 shrink-0 mt-0.5">{t.name[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-medium text-white truncate">{t.name}</span>
                  {t.draft && <span className="text-[7px] px-1 py-0.5 rounded bg-amber-900/60 text-amber-400 border border-amber-700/50 shrink-0">Draft</span>}
                </div>
                <div className="text-[8px] text-gray-500 truncate">{t.preview}</div>
              </div>
              <span className="text-[7px] text-gray-600 shrink-0">{t.time}</span>
            </button>
          ))}
        </div>

        {/* AI Draft approval */}
        {threads[selected].draft && (
          <div className="border-t border-amber-700/30 bg-amber-900/10 px-3 py-2">
            <div className="text-[8px] text-amber-400 font-medium mb-1.5">AI Draft — pending approval</div>
            <div className="text-[8px] text-gray-400 leading-relaxed mb-2 line-clamp-2">
              "Hi! Thanks for reaching out. We have availability at 3 PM today. Want me to book that for you?"
            </div>
            <div className="flex gap-1">
              <button className="flex items-center gap-0.5 px-2 py-1 rounded-md bg-emerald-900/60 text-emerald-400 text-[7px] font-semibold border border-emerald-700/50">
                <HugeiconsIcon icon={Tick01Icon} size={8} /> Send
              </button>
              <button className="flex items-center gap-0.5 px-2 py-1 rounded-md bg-red-900/40 text-red-400 text-[7px] font-semibold border border-red-700/40">
                <HugeiconsIcon icon={Cancel01Icon} size={8} /> Reject
              </button>
              <button className="flex items-center gap-0.5 px-2 py-1 rounded-md bg-gray-700 text-gray-400 text-[7px] font-semibold border border-white/10">
                <HugeiconsIcon icon={Refresh01Icon} size={8} /> Regen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── WHATSAPP ──────────────────────────────────────────────────────────────

const WhatsAppDashboard = () => {
  const [selected, setSelected] = useState(0);
  const threads = [
    { name: "Maria G.", msg: "Is the appointment confirmed?", time: "3m",  score: 88, draft: true  },
    { name: "David K.", msg: "What are your hours?",          time: "12m", score: 72, draft: false },
    { name: "Lisa M.",  msg: "Thank you!",                    time: "1h",  score: 45, draft: false },
    { name: "Omar S.",  msg: "How much does it cost?",        time: "2h",  score: 91, draft: true  },
  ];
  return (
    <div className="flex flex-col gap-2 h-full">
      {/* Connection status */}
      <div className="flex items-center justify-between p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-900/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[9px] text-emerald-400 font-medium">WhatsApp Business Connected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[8px] text-gray-500">Live</span>
        </div>
      </div>

      {/* Threads */}
      <div className="flex gap-2 flex-1 min-h-0">
        <div className="w-[130px] shrink-0 rounded-xl border border-white/10 overflow-hidden bg-gray-800/20 flex flex-col">
          <div className="bg-gray-800/60 px-2 py-1.5 border-b border-white/10">
            <span className="text-[7px] font-semibold text-gray-600 uppercase tracking-wider">Chats</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {threads.map((t, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={cn(
                  "w-full flex items-start gap-1.5 px-2 py-1.5 border-b border-white/5 last:border-0 text-left transition-colors",
                  selected === i ? "bg-blue-900/20" : "hover:bg-white/5"
                )}
              >
                <div className="w-4 h-4 rounded-full bg-gray-700 text-[7px] text-gray-400 flex items-center justify-center shrink-0 mt-0.5">{t.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[8px] font-medium text-white truncate">{t.name}</div>
                  <div className="text-[7px] text-gray-500 truncate">{t.msg}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message view */}
        <div className="flex-1 rounded-xl border border-white/10 overflow-hidden bg-gray-800/20 flex flex-col min-w-0">
          <div className="bg-gray-800/60 px-3 py-1.5 border-b border-white/10 flex items-center justify-between">
            <span className="text-[9px] font-medium text-white">{threads[selected].name}</span>
            <span className="text-[7px] px-1.5 py-0.5 rounded-md bg-emerald-900/40 text-emerald-400">Score {threads[selected].score}</span>
          </div>
          <div className="flex-1 p-3 flex flex-col gap-2 overflow-hidden">
            <div className="self-start max-w-[80%] bg-gray-700/60 rounded-xl rounded-tl-sm px-2.5 py-1.5">
              <p className="text-[9px] text-gray-300">{threads[selected].msg}</p>
            </div>
            <div className="self-end max-w-[80%] bg-blue-600/80 rounded-xl rounded-tr-sm px-2.5 py-1.5">
              <p className="text-[9px] text-white">Hi! Let me check that for you right away.</p>
            </div>
          </div>
          {threads[selected].draft && (
            <div className="border-t border-amber-700/30 bg-amber-900/10 px-3 py-2">
              <div className="text-[7px] text-amber-400 font-medium mb-1">AI Draft — pending approval</div>
              <div className="flex gap-1">
                <button className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-900/60 text-emerald-400 text-[7px] font-semibold border border-emerald-700/50">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} size={7} /> Approve
                </button>
                <button className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-red-900/40 text-red-400 text-[7px] font-semibold border border-red-700/40">
                  <HugeiconsIcon icon={Cancel01Icon} size={7} /> Reject
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── WEBSITE ───────────────────────────────────────────────────────────────

const WebsiteDashboard = () => (
  <div className="flex flex-col gap-2 h-full">
    {/* Stats */}
    <div className="grid grid-cols-3 gap-2">
      {[
        { label: "Forms Today", value: "18",  color: "text-white"        },
        { label: "Avg Reply",   value: "28s", color: "text-emerald-400"  },
        { label: "Converted",   value: "14",  color: "text-blue-400"     },
      ].map((s) => (
        <div key={s.label} className="p-2.5 rounded-xl border border-white/10 bg-gray-800/40 flex flex-col gap-1">
          <span className="text-[8px] text-gray-500 uppercase font-semibold tracking-wider">{s.label}</span>
          <span className={cn("text-sm font-semibold", s.color)}>{s.value}</span>
        </div>
      ))}
    </div>

    {/* Instant reply toggle */}
    <div className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-gray-800/40">
      <div>
        <div className="text-[10px] font-medium text-white">Instant Website Reply</div>
        <div className="text-[8px] text-gray-500">Reply to form submissions in &lt;60s</div>
      </div>
      <div className="w-9 h-5 rounded-full bg-emerald-500 flex items-center px-0.5 justify-end">
        <div className="w-4 h-4 rounded-full bg-white shadow" />
      </div>
    </div>

    {/* Form submissions table */}
    <div className="rounded-xl border border-white/10 overflow-hidden bg-gray-800/20 flex-1">
      <div className="bg-gray-800/60 px-3 py-1.5 border-b border-white/10 flex items-center justify-between">
        <span className="text-[8px] font-semibold text-gray-500 uppercase tracking-wider">Recent Submissions</span>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      </div>
      {[
        { form: "Contact Form",  site: "yourbiz.com/contact", time: "4m",  replied: true  },
        { form: "Quote Request", site: "yourbiz.com/pricing",  time: "19m", replied: true  },
        { form: "Book a Call",   site: "yourbiz.com/book",    time: "1h",  replied: false },
        { form: "Free Estimate", site: "yourbiz.com/estimate",time: "2h",  replied: true  },
      ].map((f, i) => (
        <div key={i} className="flex items-center gap-2.5 px-3 py-2 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[9px] font-medium text-white truncate">{f.form}</div>
            <div className="text-[8px] text-gray-600 truncate">{f.site}</div>
          </div>
          <span className="text-[7px] text-gray-600 shrink-0">{f.time}</span>
          <span className={cn("text-[7px] px-1.5 py-0.5 rounded-md shrink-0 font-medium", f.replied ? "bg-emerald-900/40 text-emerald-400" : "bg-gray-700 text-gray-500")}>
            {f.replied ? "Replied" : "Pending"}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// ── AD RESPONSE ───────────────────────────────────────────────────────────

const AdResponseDashboard = () => (
  <div className="flex flex-col gap-2 h-full">
    {/* Stats */}
    <div className="grid grid-cols-3 gap-2">
      {[
        { label: "Leads Today", value: "20",  color: "text-white"       },
        { label: "Avg Reply",   value: "22s", color: "text-emerald-400" },
        { label: "Booked",      value: "9",   color: "text-blue-400"    },
      ].map((s) => (
        <div key={s.label} className="p-2.5 rounded-xl border border-white/10 bg-gray-800/40 flex flex-col gap-1">
          <span className="text-[8px] text-gray-500 uppercase font-semibold tracking-wider">{s.label}</span>
          <span className={cn("text-sm font-semibold", s.color)}>{s.value}</span>
        </div>
      ))}
    </div>

    {/* Connected sources */}
    <div className="rounded-xl border border-white/10 bg-gray-800/20 overflow-hidden">
      <div className="bg-gray-800/60 px-3 py-1.5 border-b border-white/10">
        <span className="text-[8px] font-semibold text-gray-500 uppercase tracking-wider">Connected Ad Sources</span>
      </div>
      {[
        { name: "Facebook Ads", leads: "12 today", colorText: "text-blue-400",  dot: "bg-blue-400",  connected: true  },
        { name: "Google Ads",   leads: "8 today",  colorText: "text-amber-400", dot: "bg-amber-400", connected: true  },
        { name: "TikTok Ads",   leads: "—",        colorText: "text-gray-500",  dot: "bg-gray-600",  connected: false },
      ].map((src, i) => (
        <div key={i} className="flex items-center gap-2.5 px-3 py-2 border-b border-white/5 last:border-0">
          <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", src.dot)} />
          <div className="flex-1 min-w-0">
            <div className={cn("text-[9px] font-medium", src.colorText)}>{src.name}</div>
          </div>
          <span className="text-[8px] text-gray-500 shrink-0">{src.leads}</span>
          {!src.connected && (
            <span className="text-[7px] px-1.5 py-0.5 rounded-md bg-gray-700 text-gray-500 border border-white/10 shrink-0">Soon</span>
          )}
        </div>
      ))}
    </div>

    {/* Recent ad leads */}
    <div className="rounded-xl border border-white/10 overflow-hidden bg-gray-800/20 flex-1">
      <div className="bg-gray-800/60 px-3 py-1.5 border-b border-white/10">
        <span className="text-[8px] font-semibold text-gray-500 uppercase tracking-wider">Recent Ad Leads</span>
      </div>
      {[
        { name: "Carlos M.", ad: "HVAC Special Offer",    time: "2m",  status: "Booked"    },
        { name: "Jenny P.",  ad: "Free Consult — Dental", time: "11m", status: "Contacted" },
        { name: "Ray T.",    ad: "Plumbing Emergency",    time: "34m", status: "New"       },
      ].map((lead, i) => (
        <div key={i} className="flex items-center gap-2 px-3 py-2 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
          <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-[8px] text-gray-400 shrink-0">{lead.name[0]}</div>
          <div className="flex-1 min-w-0">
            <div className="text-[9px] font-medium text-white truncate">{lead.name}</div>
            <div className="text-[8px] text-gray-500 truncate">{lead.ad}</div>
          </div>
          <span className="text-[7px] text-gray-600 shrink-0">{lead.time}</span>
          <span className={cn("text-[7px] px-1.5 py-0.5 rounded-md font-medium shrink-0", LEAD_STATUSES[lead.status] ?? LEAD_STATUSES["New"])}>
            {lead.status}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// ── EMAIL ─────────────────────────────────────────────────────────────────

const EmailDashboard = () => (
  <div className="flex flex-col gap-2 h-full">
    {/* Stats */}
    <div className="grid grid-cols-4 gap-2">
      {[
        { label: "Connected",  value: "2",  color: "text-emerald-400" },
        { label: "Open",       value: "11", color: "text-white"       },
        { label: "Drafts",     value: "3",  color: "text-amber-400"   },
        { label: "Sent Today", value: "31", color: "text-blue-400"    },
      ].map((s) => (
        <div key={s.label} className="p-2 rounded-xl border border-white/10 bg-gray-800/40 flex flex-col gap-1">
          <span className="text-[7px] text-gray-500 uppercase font-semibold tracking-wider leading-tight">{s.label}</span>
          <span className={cn("text-sm font-semibold", s.color)}>{s.value}</span>
        </div>
      ))}
    </div>

    {/* Filter row */}
    <div className="flex items-center gap-1">
      {["All", "Open", "Replied", "Closed"].map((f, i) => (
        <button key={f} className={cn("text-[8px] px-2 py-1 rounded-md border font-medium", i === 0 ? "bg-blue-900/60 text-blue-400 border-blue-700/50" : "bg-gray-800 text-gray-500 border-white/10")}>
          {f}
        </button>
      ))}
    </div>

    {/* Email inbox table */}
    <div className="rounded-xl border border-white/10 overflow-hidden bg-gray-800/20 flex-1">
      <div className="bg-gray-800/60 px-3 py-1.5 border-b border-white/10 flex items-center justify-between">
        <span className="text-[8px] font-semibold text-gray-500 uppercase tracking-wider">AI Inbox</span>
        <span className="text-[8px] text-blue-400">3 unread</span>
      </div>
      {[
        { from: "New Patient Inquiry", preview: "I'd like to schedule a consult...",  time: "5m",  unread: true,  status: "Open"    },
        { from: "Quote Request",       preview: "Can you provide pricing for...",      time: "1h",  unread: true,  status: "Open"    },
        { from: "Service Follow-up",   preview: "Just checking in on my appt",        time: "3h",  unread: false, status: "Replied" },
        { from: "Website Lead",        preview: "Found you on Google — need help",    time: "5h",  unread: true,  status: "Open"    },
      ].map((email, i) => (
        <div key={i} className={cn("flex items-center gap-2 px-3 py-2 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors", email.unread ? "bg-blue-900/5" : "")}>
          <div className={cn("w-1.5 h-1.5 rounded-full shrink-0 mt-0.5", email.unread ? "bg-blue-400" : "bg-transparent")} />
          <div className="flex-1 min-w-0">
            <div className="text-[9px] font-medium text-white truncate">{email.from}</div>
            <div className="text-[8px] text-gray-500 truncate">{email.preview}</div>
          </div>
          <span className="text-[7px] text-gray-600 shrink-0 mr-1">{email.time}</span>
          <span className={cn("text-[7px] px-1.5 py-0.5 rounded-md font-medium shrink-0", email.status === "Open" ? "bg-blue-900/60 text-blue-400 border border-blue-700/50" : "bg-gray-700 text-gray-500 border border-white/10")}>
            {email.status}
          </span>
        </div>
      ))}
    </div>
  </div>
);
