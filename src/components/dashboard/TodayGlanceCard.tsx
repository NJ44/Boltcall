import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDashboardStore } from '../../stores/dashboardStore';

const TodayGlanceCard: React.FC = () => {
  const { liveStats, callbackStats, loading } = useDashboardStore();

  const handled = liveStats?.retell?.successful_calls_today ?? 0;
  const missed = liveStats?.retell?.missed_calls_today ?? 0;
  const pending = (callbackStats as any)?.pending ?? 0;
  const needsAction = missed + pending;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-lg border border-border/30 bg-background/40 px-5 py-4 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label="Today's activity summary"
    >
      <div className="flex flex-wrap items-center gap-8">
        {/* Missed — anxiety hook */}
        <div className="flex flex-col gap-0.5">
          {loading ? (
            <span className="h-7 w-10 rounded bg-foreground/10 animate-pulse" />
          ) : (
            <span className={`text-2xl font-bold tabular-nums leading-none ${missed > 0 ? 'text-red-500' : 'text-foreground/80'}`}>
              {missed}
            </span>
          )}
          <span className="text-[10px] uppercase tracking-[0.14em] text-foreground/50 font-medium">Missed today</span>
        </div>

        <div className="h-8 w-px bg-border/40 hidden sm:block" aria-hidden="true" />

        {/* Handled — relief */}
        <div className="flex flex-col gap-0.5">
          {loading ? (
            <span className="h-7 w-10 rounded bg-foreground/10 animate-pulse" />
          ) : (
            <span className="text-2xl font-bold tabular-nums leading-none text-emerald-500">
              {handled}
            </span>
          )}
          <span className="text-[10px] uppercase tracking-[0.14em] text-foreground/50 font-medium">Handled by AI</span>
        </div>

        {/* Contextual CTA — only when there's something to act on */}
        {!loading && needsAction > 0 && (
          <Link
            to="/dashboard/leads"
            className="ml-auto text-xs font-medium text-foreground/60 hover:text-foreground/90 transition-colors underline-offset-2 hover:underline"
          >
            {needsAction} lead{needsAction !== 1 ? 's' : ''} need a callback →
          </Link>
        )}

        {!loading && needsAction === 0 && handled > 0 && (
          <p className="ml-auto text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            All caught up — AI handled everything today ✓
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default TodayGlanceCard;
