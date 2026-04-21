import { useState, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  UserGroupIcon,
  Add01Icon,
  CircleArrowUpRight02Icon,
  Search01Icon,
  BarChartIcon,
  Tick01Icon,
  Settings02Icon,
  DatabaseIcon,
  UserIcon,
  CallIcon,
  Calendar01Icon,
  LinkSquare01Icon,
  ZapIcon,
  PhoneOff01Icon,
  BubbleChatNotificationIcon,
  MessageCircleReplyIcon,
  Globe02Icon,
  Megaphone01Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

interface TabConfig {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  header: string;
  description: string;
  section: "main" | "services";
}

const TABS: TabConfig[] = [
  // ── MAIN ──────────────────────────────────────────────────────────────
  {
    id: "overview",
    label: "Overview",
    icon: DashboardSquare01Icon,
    header: "Lead Dashboard",
    description: "Real-time snapshot of your lead pipeline.",
    section: "main",
  },
  {
    id: "agents",
    label: "AI Agents",
    icon: UserGroupIcon,
    header: "Active Agents",
    description: "Your AI team — always on, never misses a call.",
    badge: "3",
    section: "main",
  },
  {
    id: "calls",
    label: "Live Calls",
    icon: CallIcon,
    header: "Call Activity",
    description: "Every inbound call answered and tracked.",
    badge: "5",
    section: "main",
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: LinkSquare01Icon,
    header: "Connected Tools",
    description: "Your calendar, CRM, and pipeline — all in sync.",
    section: "main",
  },
  // ── SERVICES ──────────────────────────────────────────────────────────
  {
    id: "leads",
    label: "Leads",
    icon: ZapIcon,
    header: "Lead Inbox",
    description: "Every inbound lead captured and tracked.",
    badge: "24",
    section: "services",
  },
  {
    id: "missed-calls",
    label: "Missed Calls",
    icon: PhoneOff01Icon,
    header: "Missed Call Recovery",
    description: "Auto-text every missed call within seconds.",
    section: "services",
  },
  {
    id: "sms",
    label: "SMS Agent",
    icon: MessageSquare01Icon,
    header: "SMS Automation",
    description: "Respond to every text instantly, 24/7.",
    section: "services",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: MessageCircle01Icon,
    header: "WhatsApp Messaging",
    description: "Auto-reply to WhatsApp leads.",
    section: "services",
  },
  {
    id: "website",
    label: "Website",
    icon: Globe01Icon,
    header: "Website Response",
    description: "Capture and reply to website form submissions.",
    section: "services",
  },
  {
    id: "ad-response",
    label: "Ad Response",
    icon: Megaphone01Icon,
    header: "Ad Lead Reply",
    description: "Reply to Facebook & Google ad leads in seconds.",
    section: "services",
  },
  {
    id: "email",
    label: "AI Email",
    icon: Mail01Icon,
    header: "Email Automation",
    description: "AI handles your email inbox, 24/7.",
    section: "services",
  },
];

const BentoCard = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const content = useMemo(() => {
    switch (activeTab.id) {
      case "overview":      return <OverviewDashboard />;
      case "agents":        return <AgentsDashboard />;
      case "calls":         return <CallsDashboard />;
      case "integrations":  return <IntegrationsDashboard />;
      case "leads":         return <LeadsDashboard />;
      case "missed-calls":  return <MissedCallsDashboard />;
      case "sms":           return <SmsDashboard />;
      case "whatsapp":      return <WhatsAppDashboard />;
      case "website":       return <WebsiteDashboard />;
      case "ad-response":   return <AdResponseDashboard />;
      case "email":         return <EmailDashboard />;
      default:              return null;
    }
  }, [activeTab.id]);

  return (
    <div className="flex items-center justify-center w-full antialiased">
      <div
        className="group relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/[0.08] bg-[#080b12] transition-all duration-500 hover:-translate-y-1 m-0"
        style={{
          boxShadow:
            "0 40px 80px -20px rgba(0,0,0,0.6), 0 20px 40px -20px rgba(59,130,246,0.25), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        <div className="p-4 sm:p-6 space-y-1.5 z-10 relative">
          <h2 className="text-[10px] text-blue-400/70 uppercase tracking-widest font-semibold">
            Platform Preview
          </h2>
          <p className="text-lg sm:text-2xl text-white font-medium leading-snug max-w-[520px]">
            Every lead answered. Every booking locked in. Automatically.
          </p>
        </div>

        <div className="relative w-full h-[320px] sm:h-[420px] overflow-hidden rounded-2xl sm:rounded-[2rem]">
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
                    {/* MAIN section label */}
                    <p className="px-2 pt-1 pb-1 text-[8px] font-semibold uppercase tracking-wider text-gray-600">
                      Main
                    </p>
                    {TABS.filter((t) => t.section === "main").map((tab) => (
                      <SidebarButton key={tab.id} tab={tab} activeTab={activeTab} setActiveTab={setActiveTab} />
                    ))}

                    {/* SERVICES section label */}
                    <p className="px-2 pt-3 pb-1 text-[8px] font-semibold uppercase tracking-wider text-gray-600">
                      Services
                    </p>
                    {TABS.filter((t) => t.section === "services").map((tab) => (
                      <SidebarButton key={tab.id} tab={tab} activeTab={activeTab} setActiveTab={setActiveTab} />
                    ))}
                  </LayoutGroup>
                </div>
              </div>

              {/* Content panel */}
              <div className="flex-1 bg-gray-900 p-5 pt-6 flex flex-col gap-4 overflow-hidden relative">
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
                    className="flex-1"
                  >
                    {content}
                  </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none z-20" />
              </div>
            </div>
          </div>
        </div>
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
      key={tab.id}
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

// ── MAIN panels ────────────────────────────────────────────────────────────

const OverviewDashboard = () => (
  <div className="flex flex-col gap-3 h-full">
    <div className="relative p-3.5 rounded-xl border border-white/10 bg-gray-800/40 overflow-hidden">
      <div className="flex flex-col gap-2 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-medium text-gray-500">Response Rate</span>
          <HugeiconsIcon icon={CircleArrowUpRight02Icon} size={12} className="text-blue-400" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xl font-medium tracking-tight text-white">98.7%</span>
          <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden mt-1">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "98.7%" }}
              className="h-full bg-blue-500 rounded-full"
            />
          </div>
        </div>
        <span className="text-[9px] text-gray-500">
          Every inbound lead responded to within seconds
        </span>
      </div>
      <div className="absolute -right-2 -bottom-2 opacity-5 scale-150 rotate-12">
        <HugeiconsIcon icon={BarChartIcon} size={64} />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-2">
      <div className="p-3 rounded-xl border border-white/10 bg-gray-800/40 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-medium text-white">24</span>
          <span className="text-[8px] text-gray-500 uppercase font-medium">Leads Today</span>
        </div>
        <HugeiconsIcon icon={UserGroupIcon} size={14} className="text-gray-600" />
      </div>
      <div className="p-3 rounded-xl border border-white/10 bg-gray-800/40 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-medium text-white">11</span>
          <span className="text-[8px] text-gray-500 uppercase font-medium">Booked</span>
        </div>
        <HugeiconsIcon icon={Calendar01Icon} size={14} className="text-gray-600" />
      </div>
    </div>
  </div>
);

const AgentsDashboard = () => (
  <div className="flex flex-col h-full">
    <div className="rounded-xl border border-white/10 overflow-hidden flex flex-col h-full bg-gray-800/20">
      <div className="bg-gray-800/60 px-3 py-2 border-b border-white/10 flex items-center justify-between">
        <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Active AI Agents</span>
        <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-md bg-gray-700/60 border border-white/10">
          <HugeiconsIcon icon={Search01Icon} size={10} className="text-gray-500" />
          <span className="text-[8px] text-gray-500 font-medium">Search</span>
        </div>
      </div>
      <div className="p-1 flex flex-col gap-0.5">
        {[
          { name: "Front Desk Agent", role: "Answers & qualifies every inbound call", color: "bg-emerald-400" },
          { name: "Follow-Up Agent", role: "Re-engages leads that didn't book", color: "bg-emerald-400" },
          { name: "After-Hours Agent", role: "Captures leads when you're closed", color: "bg-amber-400" },
        ].map((agent, i) => (
          <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group">
            <div className="w-6 h-6 rounded-full bg-gray-700 border border-white/10 flex items-center justify-center relative">
              <HugeiconsIcon icon={UserIcon} size={10} className="text-gray-400" />
              <div className={cn("absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-gray-900", agent.color)} />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] font-medium text-white truncate">{agent.name}</span>
              <span className="text-[8px] text-gray-500 truncate">{agent.role}</span>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <HugeiconsIcon icon={Settings02Icon} size={12} className="text-gray-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const CallsDashboard = () => (
  <div className="flex flex-col gap-3 h-full">
    <div className="grid grid-cols-2 gap-3">
      {[
        { title: "Book Appointment", desc: "Instantly schedule via call.", icon: Calendar01Icon },
        { title: "Qualify Lead", desc: "Score and route new leads.", icon: Tick01Icon },
      ].map((card, i) => (
        <div
          key={i}
          className="p-3.5 rounded-xl border border-white/10 bg-gray-800/40 flex flex-col gap-3 relative overflow-hidden group"
        >
          <div className="flex flex-col gap-1 z-10">
            <span className="text-[12px] font-medium text-white leading-tight">{card.title}</span>
            <span className="text-[9px] text-gray-500 leading-tight">{card.desc}</span>
          </div>
          <button className="w-fit flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-700 text-white text-[8px] font-semibold transition-all active:scale-95 group-hover:bg-blue-600 z-10">
            <HugeiconsIcon icon={Add01Icon} size={8} strokeWidth={3} />
            Trigger
          </button>
        </div>
      ))}
    </div>
    <div className="mt-auto p-3 rounded-xl bg-gray-800/40 border border-white/10 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="p-1 px-1.5 rounded-md bg-gray-700 border border-white/10">
          <HugeiconsIcon icon={CallIcon} size={10} className="text-gray-400" />
        </div>
        <span className="text-[9px] text-gray-500 font-medium">5 calls active right now</span>
      </div>
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
    </div>
  </div>
);

const IntegrationsDashboard = () => (
  <div className="flex flex-col gap-3 h-full overflow-hidden">
    <div className="flex-1 rounded-xl border border-white/10 flex flex-col bg-gray-800/20 overflow-hidden">
      <div className="bg-gray-800/60 px-3 py-2 border-b border-white/10 flex items-center justify-between">
        <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">
          Connected Tools
        </span>
        <HugeiconsIcon icon={DatabaseIcon} size={12} className="text-gray-600" />
      </div>
      <div className="flex-1 p-1 overflow-y-auto">
        {[
          { name: "Google Calendar", desc: "Auto-books appointments", icon: Calendar01Icon },
          { name: "HubSpot CRM", desc: "Syncs every lead & call", icon: DatabaseIcon },
          { name: "GoHighLevel", desc: "Pipeline + SMS follow-up", icon: BarChartIcon },
          { name: "Zapier", desc: "1,000+ app automations", icon: LinkSquare01Icon },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
          >
            <div className="w-6 h-6 rounded-md bg-gray-700 border border-white/10 flex items-center justify-center text-gray-500 group-hover:text-blue-400 group-hover:bg-blue-900/30 transition-colors">
              <HugeiconsIcon icon={item.icon} size={12} />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] font-medium text-white truncate">{item.name}</span>
              <span className="text-[8px] text-gray-500 uppercase">{item.desc}</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── SERVICE panels ─────────────────────────────────────────────────────────

const LeadsDashboard = () => (
  <div className="flex flex-col gap-2 h-full">
    <div className="rounded-xl border border-white/10 overflow-hidden bg-gray-800/20">
      <div className="bg-gray-800/60 px-3 py-2 border-b border-white/10 flex items-center justify-between">
        <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Recent Leads</span>
        <span className="text-[8px] text-blue-400">24 today</span>
      </div>
      {[
        { name: "Mike Torres",  source: "Facebook Ad",  status: "Booked",  dot: "bg-emerald-400" },
        { name: "Sarah Kim",    source: "Website Form", status: "Replied", dot: "bg-blue-400" },
        { name: "James Lee",    source: "Missed Call",  status: "Pending", dot: "bg-amber-400" },
        { name: "Ana Ruiz",     source: "Google Ad",    status: "Booked",  dot: "bg-emerald-400" },
      ].map((lead, i) => (
        <div key={i} className="flex items-center gap-2 px-3 py-1.5 border-b border-white/5 last:border-0">
          <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-[8px] text-gray-400 font-medium shrink-0">
            {lead.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[9px] font-medium text-white truncate">{lead.name}</div>
            <div className="text-[8px] text-gray-500 truncate">{lead.source}</div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <div className={`w-1.5 h-1.5 rounded-full ${lead.dot}`} />
            <span className="text-[8px] text-gray-400">{lead.status}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MissedCallsDashboard = () => (
  <div className="flex flex-col gap-2 h-full">
    <div className="p-3 rounded-xl border border-white/10 bg-gray-800/40 flex items-center justify-between">
      <div>
        <div className="text-[10px] font-medium text-white">Auto-Recovery</div>
        <div className="text-[8px] text-gray-500">Text sent within 30s of missed call</div>
      </div>
      <div className="w-8 h-4 rounded-full bg-emerald-500 flex items-end px-0.5 pb-0.5">
        <div className="ml-auto w-3 h-3 rounded-full bg-white" />
      </div>
    </div>
    <div className="rounded-xl border border-white/10 overflow-hidden bg-gray-800/20">
      {[
        { name: "Unknown",   time: "2m ago",  replied: true  },
        { name: "John D.",   time: "15m ago", replied: true  },
        { name: "555-9821",  time: "1h ago",  replied: false },
      ].map((call, i) => (
        <div key={i} className="flex items-center gap-2 px-3 py-1.5 border-b border-white/5 last:border-0">
          <div className="w-5 h-5 rounded-full bg-red-900/40 border border-red-500/20 flex items-center justify-center shrink-0">
            <span className="text-[8px] text-red-400">✕</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[9px] font-medium text-white">{call.name}</div>
            <div className="text-[8px] text-gray-500">{call.time}</div>
          </div>
          <span className={`text-[8px] px-1.5 py-0.5 rounded-md shrink-0 ${call.replied ? "bg-emerald-900/40 text-emerald-400" : "bg-gray-700 text-gray-500"}`}>
            {call.replied ? "SMS sent" : "Pending"}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const SmsDashboard = () => (
  <div className="flex flex-col gap-2 h-full">
    <div className="rounded-xl border border-white/10 bg-gray-800/40 p-3 flex flex-col gap-2">
      <div className="text-[9px] text-gray-500 uppercase font-semibold tracking-wider">AI Reply Template</div>
      <div className="bg-gray-900/80 rounded-lg p-2.5 text-[9px] text-gray-300 leading-relaxed">
        "Hi {"{name}"}, thanks for reaching out to {"{business}"}! We got your message and will get back shortly. Want to book a time? {"{link}"}"
      </div>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[8px] text-gray-500">47 replies sent today</span>
      </div>
    </div>
    <div className="rounded-xl border border-white/10 overflow-hidden bg-gray-800/20">
      {[
        { name: "Tom B.",   msg: "Is 3pm available?",       time: "1m"  },
        { name: "Cindy R.", msg: "Thanks for the quick reply", time: "8m"  },
        { name: "David L.", msg: "Need more info about pricing", time: "22m" },
      ].map((c, i) => (
        <div key={i} className="flex items-center gap-2 px-3 py-1.5 border-b border-white/5 last:border-0">
          <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-[8px] text-gray-400 shrink-0">{c.name[0]}</div>
          <div className="flex-1 min-w-0">
            <div className="text-[9px] font-medium text-white">{c.name}</div>
            <div className="text-[8px] text-gray-500 truncate">{c.msg}</div>
          </div>
          <span className="text-[8px] text-gray-600 shrink-0">{c.time}</span>
        </div>
      ))}
    </div>
  </div>
);

const WhatsAppDashboard = () => (
  <div className="flex flex-col gap-2 h-full">
    <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-900/10 flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-emerald-400" />
      <span className="text-[9px] text-emerald-400 font-medium">WhatsApp Business Connected</span>
    </div>
    <div className="rounded-xl border border-white/10 bg-gray-800/20 overflow-hidden">
      {[
        { name: "Maria G.", msg: "Is the appointment confirmed?", time: "3m"  },
        { name: "David K.", msg: "What are your hours?",          time: "12m" },
        { name: "Lisa M.",  msg: "Thank you!",                    time: "1h"  },
      ].map((c, i) => (
        <div key={i} className="flex items-center gap-2 px-3 py-1.5 border-b border-white/5 last:border-0">
          <div className="w-5 h-5 rounded-full bg-gray-700 text-[8px] text-gray-400 flex items-center justify-center shrink-0">{c.name[0]}</div>
          <div className="flex-1 min-w-0">
            <div className="text-[9px] font-medium text-white">{c.name}</div>
            <div className="text-[8px] text-gray-500 truncate">{c.msg}</div>
          </div>
          <span className="text-[8px] text-gray-600 shrink-0">{c.time}</span>
        </div>
      ))}
    </div>
  </div>
);

const WebsiteDashboard = () => (
  <div className="flex flex-col gap-2 h-full">
    <div className="p-3 rounded-xl border border-white/10 bg-gray-800/40 flex items-center justify-between">
      <div>
        <div className="text-[10px] font-medium text-white">Instant Website Reply</div>
        <div className="text-[8px] text-gray-500">Reply to form submissions in &lt;60s</div>
      </div>
      <div className="w-8 h-4 rounded-full bg-emerald-500 flex items-end px-0.5 pb-0.5">
        <div className="ml-auto w-3 h-3 rounded-full bg-white" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2">
      <div className="p-2.5 rounded-xl border border-white/10 bg-gray-800/40">
        <div className="text-xs font-medium text-white">18</div>
        <div className="text-[8px] text-gray-500 uppercase mt-0.5">Forms today</div>
      </div>
      <div className="p-2.5 rounded-xl border border-white/10 bg-gray-800/40">
        <div className="text-xs font-medium text-white">28s</div>
        <div className="text-[8px] text-gray-500 uppercase mt-0.5">Avg reply</div>
      </div>
    </div>
    <div className="rounded-xl border border-white/10 overflow-hidden bg-gray-800/20">
      {[
        { name: "Contact Form",   site: "yourbiz.com/contact",  time: "4m"  },
        { name: "Quote Request",  site: "yourbiz.com/pricing",  time: "19m" },
        { name: "Book a Call",    site: "yourbiz.com/book",     time: "1h"  },
      ].map((f, i) => (
        <div key={i} className="flex items-center gap-2 px-3 py-1.5 border-b border-white/5 last:border-0">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[9px] font-medium text-white">{f.name}</div>
            <div className="text-[8px] text-gray-600 truncate">{f.site}</div>
          </div>
          <span className="text-[8px] text-gray-600 shrink-0">{f.time}</span>
        </div>
      ))}
    </div>
  </div>
);

const AdResponseDashboard = () => (
  <div className="flex flex-col gap-2 h-full">
    <div className="rounded-xl border border-white/10 bg-gray-800/20 overflow-hidden">
      <div className="bg-gray-800/60 px-3 py-2 border-b border-white/10">
        <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Connected Ad Sources</span>
      </div>
      {[
        { name: "Facebook Ads", leads: "12 today", colorText: "text-blue-400",   dot: "bg-blue-400"   },
        { name: "Google Ads",   leads: "8 today",  colorText: "text-amber-400",  dot: "bg-amber-400"  },
      ].map((src, i) => (
        <div key={i} className="flex items-center gap-2 px-3 py-2 border-b border-white/5 last:border-0">
          <div className={`w-1.5 h-1.5 rounded-full ${src.dot} shrink-0`} />
          <div className="flex-1 min-w-0">
            <div className={`text-[9px] font-medium ${src.colorText}`}>{src.name}</div>
          </div>
          <span className="text-[8px] text-gray-500 shrink-0">{src.leads}</span>
        </div>
      ))}
    </div>
    <div className="p-2.5 rounded-xl border border-white/10 bg-gray-800/40 flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      <span className="text-[9px] text-gray-400">
        Avg. reply time: <span className="text-white font-medium">22s</span>
      </span>
    </div>
    <div className="rounded-xl border border-white/10 overflow-hidden bg-gray-800/20">
      {[
        { name: "Carlos M.",  ad: "HVAC Special Offer",    time: "2m"  },
        { name: "Jenny P.",   ad: "Free Consult — Dental", time: "11m" },
        { name: "Ray T.",     ad: "Plumbing Emergency",    time: "34m" },
      ].map((lead, i) => (
        <div key={i} className="flex items-center gap-2 px-3 py-1.5 border-b border-white/5 last:border-0">
          <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-[8px] text-gray-400 shrink-0">{lead.name[0]}</div>
          <div className="flex-1 min-w-0">
            <div className="text-[9px] font-medium text-white">{lead.name}</div>
            <div className="text-[8px] text-gray-500 truncate">{lead.ad}</div>
          </div>
          <span className="text-[8px] text-gray-600 shrink-0">{lead.time}</span>
        </div>
      ))}
    </div>
  </div>
);

const EmailDashboard = () => (
  <div className="flex flex-col gap-2 h-full">
    <div className="rounded-xl border border-white/10 bg-gray-800/20 overflow-hidden">
      <div className="bg-gray-800/60 px-3 py-2 border-b border-white/10 flex items-center justify-between">
        <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">AI Inbox</span>
        <span className="text-[8px] text-blue-400">3 unread</span>
      </div>
      {[
        { from: "New Patient Inquiry", preview: "I'd like to schedule a consult...",   time: "5m",  unread: true  },
        { from: "Quote Request",       preview: "Can you provide pricing for...",       time: "1h",  unread: true  },
        { from: "Follow-up",           preview: "Just checking in on my appointment",  time: "3h",  unread: false },
      ].map((email, i) => (
        <div key={i} className={`flex items-start gap-2 px-3 py-1.5 border-b border-white/5 last:border-0 ${email.unread ? "bg-blue-900/10" : ""}`}>
          <div className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${email.unread ? "bg-blue-400" : "bg-transparent"}`} />
          <div className="flex-1 min-w-0">
            <div className="text-[9px] font-medium text-white truncate">{email.from}</div>
            <div className="text-[8px] text-gray-500 truncate">{email.preview}</div>
          </div>
          <span className="text-[8px] text-gray-600 shrink-0">{email.time}</span>
        </div>
      ))}
    </div>
    <div className="p-2.5 rounded-xl border border-white/10 bg-gray-800/40 flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      <span className="text-[9px] text-gray-400">
        AI replied to <span className="text-white font-medium">31 emails</span> today
      </span>
    </div>
  </div>
);
