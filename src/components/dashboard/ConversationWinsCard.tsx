import React, { useEffect, useState } from 'react';
import { Trophy, Phone, MessageSquare, Smartphone, Zap, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface ChannelCount {
  channel: string;
  count: number;
}

interface WinStats {
  totalToday: number;
  totalConversations: number;
  winRate: number;
  byChannel: ChannelCount[];
  healsToday: number;
  healSuccessRate: number;
}

const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  voice: <Phone className="w-3 h-3" />,
  chat:  <MessageSquare className="w-3 h-3" />,
  sms:   <Smartphone className="w-3 h-3" />,
  whatsapp: <MessageSquare className="w-3 h-3" />,
  email: <Zap className="w-3 h-3" />,
  ads:   <Zap className="w-3 h-3" />,
};

const CHANNEL_LABELS: Record<string, string> = {
  voice:    'Voice',
  chat:     'Chat',
  sms:      'SMS',
  whatsapp: 'WhatsApp',
  email:    'Email',
  ads:      'Ads',
};

export const ConversationWinsCard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<WinStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetchStats();
  }, [user?.id]);

  async function fetchStats() {
    if (!user?.id) return;
    setLoading(true);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayIso = todayStart.toISOString();

    try {
      const [winsResult, healsResult] = await Promise.all([
        supabase
          .from('conversation_wins')
          .select('channel, outcome_type')
          .eq('user_id', user.id)
          .gte('created_at', todayIso),
        supabase
          .from('agent_self_heal_log')
          .select('status')
          .eq('user_id', user.id)
          .gte('created_at', todayIso),
      ]);

      const wins = winsResult.data || [];
      const heals = healsResult.data || [];

      // Channel breakdown
      const channelMap: Record<string, number> = {};
      for (const w of wins) {
        const ch = w.channel || 'unknown';
        channelMap[ch] = (channelMap[ch] || 0) + 1;
      }
      const byChannel: ChannelCount[] = Object.entries(channelMap)
        .map(([channel, count]) => ({ channel, count }))
        .sort((a, b) => b.count - a.count);

      // Total conversations = wins + heals (each heal = 1 failed conversation)
      const totalConversations = wins.length + heals.length;
      const winRate = totalConversations > 0
        ? Math.round((wins.length / totalConversations) * 100)
        : 0;

      const healsFixed = heals.filter(h => h.status === 'fixed').length;
      const healSuccessRate = heals.length > 0
        ? Math.round((healsFixed / heals.length) * 100)
        : 0;

      setStats({
        totalToday: wins.length,
        totalConversations,
        winRate,
        byChannel,
        healsToday: heals.length,
        healSuccessRate,
      });
    } catch (err) {
      console.error('[ConversationWinsCard] Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-32 mb-4" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-50 rounded-lg">
            <Trophy className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-sm font-semibold text-gray-800">Today's Outcomes</span>
        </div>
        <button
          onClick={fetchStats}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {/* Wins today */}
        <div className="bg-emerald-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-emerald-700">{stats.totalToday}</div>
          <div className="text-xs text-emerald-600 mt-0.5">Wins</div>
        </div>

        {/* Win rate */}
        <div className={`rounded-lg p-3 text-center ${stats.winRate >= 70 ? 'bg-blue-50' : stats.winRate >= 40 ? 'bg-amber-50' : 'bg-red-50'}`}>
          <div className={`text-2xl font-bold ${stats.winRate >= 70 ? 'text-blue-700' : stats.winRate >= 40 ? 'text-amber-700' : 'text-red-700'}`}>
            {stats.winRate}%
          </div>
          <div className={`text-xs mt-0.5 ${stats.winRate >= 70 ? 'text-blue-600' : stats.winRate >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
            Win rate
          </div>
        </div>

        {/* Self-heals */}
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-700">{stats.healsToday}</div>
          <div className="text-xs text-purple-600 mt-0.5">
            {stats.healsToday === 1 ? 'Self-heal' : 'Self-heals'}
            {stats.healsToday > 0 && (
              <span className="block text-purple-500">{stats.healSuccessRate}% fixed</span>
            )}
          </div>
        </div>
      </div>

      {/* Channel breakdown */}
      {stats.byChannel.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {stats.byChannel.map(({ channel, count }) => (
            <span
              key={channel}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
            >
              {CHANNEL_ICONS[channel] || <Zap className="w-3 h-3" />}
              {CHANNEL_LABELS[channel] || channel} {count}
            </span>
          ))}
        </div>
      )}

      {stats.totalToday === 0 && stats.healsToday === 0 && (
        <p className="text-xs text-gray-400 text-center py-2">
          No conversations evaluated yet today
        </p>
      )}
    </div>
  );
};

export default ConversationWinsCard;
