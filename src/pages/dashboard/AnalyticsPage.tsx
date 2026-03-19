import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  MessageSquare,
  Clock,
  Bot,
  PhoneCall,
  Users,
  AlertCircle,
  RefreshCw,
  Loader2,
  Coins,
} from 'lucide-react';
import KpiTile from '../../components/dashboard/KpiTile';
import TimeSeriesCard from '../../components/dashboard/TimeSeriesCard';
import Card from '../../components/ui/Card';
import {
  fetchDashboardStats,
  fetchDailyMetrics,
  type DashboardStats,
} from '../../lib/dashboardApi';
import { useTokens } from '../../contexts/TokenContext';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface DailyMetric {
  date: string;
  calls?: number;
  leads?: number;
  bookings?: number;
  sms_sent?: number;
  success_rate?: number;
  [key: string]: unknown;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function fmtDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function fmtNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n);
}

/* ------------------------------------------------------------------ */
/*  Small sub-components                                               */
/* ------------------------------------------------------------------ */

const StatusBadge: React.FC<{ label: string; value: number; color: string }> = ({
  label,
  value,
  color,
}) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-sm text-text-muted">{label}</span>
    </div>
    <span className="text-sm font-semibold text-text-main">{fmtNumber(value)}</span>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

const AnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [metrics, setMetrics] = useState<DailyMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setLastRefresh] = useState<Date | null>(null);
  const [tokensToday, setTokensToday] = useState(0);
  const [tokensThisWeek, setTokensThisWeek] = useState(0);

  const { totalAvailable, tokensUsed, monthlyAllocation, isLoading: tokensLoading } = useTokens();
  const { user } = useAuth();

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashStats, dailyMetrics] = await Promise.all([
        fetchDashboardStats(),
        fetchDailyMetrics(7),
      ]);
      setStats(dashStats);
      setMetrics((dailyMetrics as DailyMetric[]).reverse()); // oldest first for charts
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch token consumption for today and this week
  useEffect(() => {
    if (!user?.id) return;

    const fetchTokenUsage = async () => {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).toISOString();

      // Tokens consumed today
      const { data: todayData } = await supabase
        .from('token_transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('type', 'debit')
        .gte('created_at', todayStart);

      const todayTotal = (todayData || []).reduce((sum, tx) => sum + (tx.amount || 0), 0);
      setTokensToday(todayTotal);

      // Tokens consumed this week
      const { data: weekData } = await supabase
        .from('token_transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('type', 'debit')
        .gte('created_at', weekStart);

      const weekTotal = (weekData || []).reduce((sum, tx) => sum + (tx.amount || 0), 0);
      setTokensThisWeek(weekTotal);
    };

    fetchTokenUsage();
  }, [user?.id]);

  /* ----- Loading state ----- */
  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
          <p className="text-sm text-text-muted">Loading analytics...</p>
        </div>
      </div>
    );
  }

  /* ----- Error state ----- */
  if (error && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-text-main mb-2">Unable to load analytics</h3>
          <p className="text-sm text-text-muted mb-4">{error}</p>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blueDark transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </Card>
      </div>
    );
  }

  const retell = stats?.retell;
  const twilio = stats?.twilio;
  const sb = stats?.supabase;

  /* ----- Build sparkline data from daily metrics ----- */
  const callSparkline = metrics.map((m) => m.calls ?? m.leads ?? 0);
  const smsSparkline = metrics.map((m) => m.sms_sent ?? 0);
  const successSparkline = metrics.map((m) => m.success_rate ?? 0);
  const emptySparkline = [0, 0, 0, 0, 0, 0, 0];

  /* ----- Build time series data for chart ----- */
  const timeSeriesData = metrics.map((m) => ({
    date: m.date,
    leads: m.leads ?? m.calls ?? 0,
    bookings: m.bookings ?? 0,
  }));

  return (
    <div className="space-y-8">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div></div>
        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-border hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error banner (when we have stale data but refresh failed) */}
      {error && stats && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          Refresh failed: {error}. Showing last known data.
        </div>
      )}

      {/* KPI Cards - Primary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiTile
          title="AI Calls (24h)"
          value={retell?.calls_today ?? 0}
          delta={
            retell && retell.calls_7d > 0
              ? ((retell.calls_today / (retell.calls_7d / 7) - 1) * 100)
              : 0
          }
          sparkline={callSparkline.length >= 2 ? callSparkline : emptySparkline}
          format="number"
        />
        <KpiTile
          title="Success Rate"
          value={retell?.success_rate ? `${retell.success_rate}%` : '0%'}
          delta={0}
          sparkline={successSparkline.length >= 2 ? successSparkline : emptySparkline}
        />
        <KpiTile
          title="Avg Duration"
          value={fmtDuration(retell?.avg_duration_seconds ?? 0)}
          delta={0}
          sparkline={emptySparkline}
          format="time"
        />
        <KpiTile
          title="SMS Sent Today"
          value={twilio?.sms_sent_today ?? 0}
          delta={0}
          sparkline={smsSparkline.length >= 2 ? smsSparkline : emptySparkline}
          format="number"
        />
      </div>

      {/* Token Usage Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Coins className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-text-main">Token Usage</h3>
          </div>
          {tokensLoading ? (
            <div className="flex items-center justify-center h-20">
              <Loader2 className="w-5 h-5 text-brand-blue animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-text-main">{fmtNumber(tokensToday)}</p>
                <p className="text-xs text-text-muted mt-1">Consumed Today</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-text-main">{fmtNumber(tokensThisWeek)}</p>
                <p className="text-xs text-text-muted mt-1">Consumed This Week</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-blue">{fmtNumber(totalAvailable)}</p>
                <p className="text-xs text-text-muted mt-1">Remaining Balance</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-text-main">
                  {monthlyAllocation > 0 ? `${Math.round((tokensUsed / monthlyAllocation) * 100)}%` : '0%'}
                </p>
                <p className="text-xs text-text-muted mt-1">Monthly Used</p>
                {monthlyAllocation > 0 && (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-brand-blue h-1.5 rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.round((tokensUsed / monthlyAllocation) * 100))}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Secondary KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          {
            icon: PhoneCall,
            label: 'Calls (7d)',
            value: fmtNumber(retell?.calls_7d ?? 0),
            color: 'text-brand-blue',
          },
          {
            icon: Clock,
            label: 'Talk Time Today',
            value: `${retell?.total_talk_minutes_today ?? 0}m`,
            color: 'text-amber-500',
          },
          {
            icon: Bot,
            label: 'Active Agents',
            value: fmtNumber(retell?.active_agents ?? 0),
            color: 'text-purple-500',
          },
          {
            icon: MessageSquare,
            label: 'SMS Received',
            value: fmtNumber(twilio?.sms_received_today ?? 0),
            color: 'text-green-500',
          },
          {
            icon: Phone,
            label: 'Phone Numbers',
            value: fmtNumber(twilio?.total_phone_numbers ?? 0),
            color: 'text-sky-500',
          },
          {
            icon: Users,
            label: 'Workspaces',
            value: fmtNumber(sb?.total_workspaces ?? 0),
            color: 'text-indigo-500',
          },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
          >
            <Card className="p-4 flex flex-col items-center text-center gap-1">
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <span className="text-lg font-bold text-text-main">{item.value}</span>
              <span className="text-xs text-text-muted">{item.label}</span>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7-day trend chart (reuse TimeSeriesCard if data exists) */}
        {timeSeriesData.length > 1 ? (
          <TimeSeriesCard data={timeSeriesData} />
        ) : (
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-text-main mb-4">7-Day Trend</h3>
            <div className="flex items-center justify-center h-64 text-text-muted text-sm">
              No daily metrics data available yet.
              <br />
              Metrics will appear once the daily collector runs.
            </div>
          </Card>
        )}

        {/* Callbacks & Chats breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-text-main mb-6">Activity Breakdown</h3>
            <div className="grid grid-cols-2 gap-6">
              {/* Callbacks */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Phone className="w-4 h-4 text-brand-blue" />
                  <span className="text-sm font-semibold text-text-main">Callbacks</span>
                </div>
                <div className="divide-y divide-border">
                  <StatusBadge label="Total" value={sb?.callbacks_total ?? 0} color="bg-brand-blue" />
                  <StatusBadge label="Pending" value={sb?.callbacks_pending ?? 0} color="bg-amber-400" />
                </div>
              </div>

              {/* Chats */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-semibold text-text-main">Chats</span>
                </div>
                <div className="divide-y divide-border">
                  <StatusBadge label="Total" value={sb?.chats_total ?? 0} color="bg-green-500" />
                  <StatusBadge label="Active" value={sb?.chats_active ?? 0} color="bg-emerald-400" />
                </div>
              </div>
            </div>

            {/* Phone numbers list */}
            {twilio?.phone_numbers && twilio.phone_numbers.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Phone className="w-4 h-4 text-sky-500" />
                  <span className="text-sm font-semibold text-text-main">Phone Numbers</span>
                </div>
                <div className="space-y-2">
                  {twilio.phone_numbers.map((pn) => (
                    <div
                      key={pn.number}
                      className="flex items-center justify-between text-sm py-1"
                    >
                      <span className="text-text-muted">{pn.friendly_name || 'Unnamed'}</span>
                      <span className="font-mono text-text-main">{pn.number}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Latest Metrics (raw data card if available) */}
      {sb?.latest_metrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-text-main">Latest Daily Snapshot</h3>
              <span className="text-xs text-text-muted bg-gray-100 px-2 py-1 rounded">
                {sb.latest_metrics.date || 'Today'}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Object.entries(sb.latest_metrics)
                .filter(
                  ([key]) =>
                    key !== 'id' &&
                    key !== 'date' &&
                    key !== 'created_at' &&
                    key !== 'updated_at'
                )
                .map(([key, value]) => (
                  <div key={key} className="text-center">
                    <p className="text-xs text-text-muted mb-1">
                      {key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </p>
                    <p className="text-lg font-bold text-text-main">
                      {typeof value === 'number' ? fmtNumber(value) : String(value ?? '-')}
                    </p>
                  </div>
                ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default AnalyticsPage;
