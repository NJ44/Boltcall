import React from 'react';
import { motion } from 'framer-motion';
import { useDashboardStore } from '../../stores/dashboardStore';

const Dot: React.FC<{ color: string }> = ({ color }) => (
  <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${color}`} aria-hidden="true" />
);

const Stat: React.FC<{ color: string; value: number | string; label: string; loading: boolean }> = ({
  color,
  value,
  label,
  loading,
}) => (
  <div className="flex items-center gap-2">
    <Dot color={color} />
    {loading ? (
      <span className="h-3 w-16 rounded bg-foreground/10 animate-pulse inline-block" />
    ) : (
      <span className="flex items-baseline gap-1">
        <span className="text-sm font-bold text-foreground/90 tabular-nums">{value}</span>
        <span className="text-[10px] text-foreground/50 uppercase tracking-[0.12em]">{label}</span>
      </span>
    )}
  </div>
);

const TodayGlanceCard: React.FC = () => {
  const { liveStats, callbackStats, loading } = useDashboardStore();

  const callsToday = liveStats?.retell?.calls_today ?? 0;
  const handled = liveStats?.retell?.successful_calls_today ?? 0;
  const missed = liveStats?.retell?.missed_calls_today ?? 0;
  const pending = (callbackStats as any)?.pending ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-lg border border-border/30 bg-background/40 px-4 py-2.5 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label="Today's activity summary"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4">
          <Stat color="bg-blue-400"   value={callsToday} label="Calls Today" loading={loading} />
          <Stat color="bg-emerald-400" value={handled}   label="Handled"     loading={loading} />
          <Stat color="bg-red-400"    value={missed}     label="Missed"      loading={loading} />
          <Stat color="bg-amber-400"  value={pending}    label="Pending"     loading={loading} />
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/60 font-medium">
          While you were away
        </p>
      </div>
    </motion.div>
  );
};

export default TodayGlanceCard;
