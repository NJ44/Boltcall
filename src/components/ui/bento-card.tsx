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
    id: "overview",
    label: "Overview",
    icon: DashboardSquare01Icon,
    header: "Lead Dashboard",
    description: "Real-time snapshot of your lead pipeline.",
  },
  {
    id: "agents",
    label: "AI Agents",
    icon: UserGroupIcon,
    header: "Active Agents",
    description: "Your AI team — always on, never misses a call.",
    badge: "3",
  },
  {
    id: "calls",
    label: "Live Calls",
    icon: CallIcon,
    header: "Call Activity",
    description: "Every inbound call answered and tracked.",
    badge: "5",
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: LinkSquare01Icon,
    header: "Connected Tools",
    description: "Your calendar, CRM, and pipeline — all in sync.",
  },
];

const BentoCard = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const content = useMemo(() => {
    switch (activeTab.id) {
      case "overview":
        return <OverviewDashboard />;
      case "agents":
        return <AgentsDashboard />;
      case "calls":
        return <CallsDashboard />;
      case "integrations":
        return <IntegrationsDashboard />;
      default:
        return null;
    }
  }, [activeTab.id]);

  return (
    <div className="flex items-center justify-center w-full antialiased">
      <div className="group relative w-full max-w-6xl overflow-hidden rounded-3xl border border-white/[0.08] bg-[#080b12] shadow-2xl shadow-blue-500/15 transition-all duration-500 hover:shadow-blue-500/25 hover:-translate-y-1 m-0">
        <div className="p-6 sm:p-10 space-y-2 z-10 relative">
          <h2 className="text-xs text-blue-400/70 uppercase tracking-widest font-semibold">
            Platform Preview
          </h2>
          <p className="text-2xl sm:text-4xl text-white font-medium leading-snug max-w-[700px]">
            Every lead answered. Every booking locked in. Automatically.
          </p>
        </div>

        <div className="relative w-full h-[480px] sm:h-[640px] overflow-hidden rounded-2xl sm:rounded-[2rem]">
          <div className="absolute top-16 left-16 w-full h-full bg-gray-800/40 rounded-3xl border border-white/[0.08] opacity-80" />

          <div
            className="absolute top-8 left-24 w-full h-full bg-gray-900 rounded-tl-3xl flex flex-col overflow-hidden"
            style={{ boxShadow: "0 0 0 6px rgba(255,255,255,0.07)" }}
          >
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
              <div className="w-40 border-r border-white/10 p-2 flex flex-col gap-1 pt-6 bg-gray-800/40">
                <LayoutGroup>
                  {TABS.map((tab) => {
                    const isActive = activeTab.id === tab.id;
                    const Icon = tab.icon;

                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                          "relative flex items-center gap-1.5 p-2 rounded-xl text-xs transition-colors cursor-pointer",
                          isActive
                            ? "text-white"
                            : "text-gray-500 hover:text-gray-300",
                        )}
                      >
                        <HugeiconsIcon
                          icon={Icon}
                          size={14}
                          className="z-20 shrink-0 relative"
                        />
                        <span className="truncate z-20 relative font-medium">
                          {tab.label}
                        </span>
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
                  })}
                </LayoutGroup>
              </div>

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
