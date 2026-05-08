import React, { useState, useEffect, useCallback } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  Bot,
  Phone,
  Zap,
  Activity,
  RefreshCw,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Building2,
  LogOut,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface KPIs {
  total_users: number;
  total_agents: number;
  total_leads: number;
  total_phones: number;
  wins_today: number;
  heals_today: number;
  wins_by_channel: Record<string, number>;
}

interface UserRow {
  user_id: string;
  email: string;
  workspace: string;
  business_name: string;
  industry: string;
  agents: number;
  leads: number;
  wins_today: number;
  heals_today: number;
  phones: number;
  joined: string;
  last_sign_in: string | null;
}

interface AdminData {
  kpis: KPIs;
  users: UserRow[];
  recent_wins: any[];
  recent_heals: any[];
}

const CHANNEL_ICONS: Record<string, string> = {
  voice: '📞',
  chat: '💬',
  sms: '📱',
  whatsapp: '💬',
  email: '✉️',
  ads: '📣',
};

const KpiCard: React.FC<{ label: string; value: number | string; icon: React.ReactNode; color: string }> = ({ label, value, icon, color }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
    <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const AdminPanel: React.FC = () => {
  useEffect(() => {
    document.title = 'Admin | Boltcall';
    updateMetaDescription('Boltcall platform admin — all-user metrics and system health.');
  }, []);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortCol, setSortCol] = useState<keyof UserRow>('wins_today');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const fetchData = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/.netlify/functions/admin-metrics', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      setData(await res.json());
    } catch (e: any) {
      setError(e.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = '/login'; return; }
      setCurrentUser(session.user);
      await fetchData(session.access_token);
    };
    init();
  }, [fetchData]);

  const handleSort = (col: keyof UserRow) => {
    if (sortCol === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir('desc');
    }
  };

  const sortedUsers = [...(data?.users || [])].sort((a, b) => {
    const av = a[sortCol] ?? '';
    const bv = b[sortCol] ?? '';
    const cmp = typeof av === 'number' ? (av - (bv as number)) : String(av).localeCompare(String(bv));
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const SortIcon: React.FC<{ col: keyof UserRow }> = ({ col }) => {
    if (sortCol !== col) return <ChevronDown className="w-3 h-3 text-gray-300 ml-1" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-blue-600 ml-1" />
      : <ChevronDown className="w-3 h-3 text-blue-600 ml-1" />;
  };

  const thClass = "px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-900 select-none";

  if (!currentUser && !error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <Shield className="w-14 h-14 text-red-400" />
        <p className="text-lg font-semibold text-gray-800">Access Denied</p>
        <p className="text-sm text-gray-500">{error}</p>
        <a href="/" className="text-blue-600 text-sm hover:underline">Go to homepage</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-gray-900">Admin</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">Platform</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 hidden sm:block">{currentUser?.email}</span>
            <button
              onClick={async () => { await supabase.auth.signOut(); window.location.href = '/'; }}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
            {data && (
              <button
                onClick={async () => {
                  const { data: { session } } = await supabase.auth.getSession();
                  if (session) fetchData(session.access_token);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {loading && !data && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <RefreshCw className="w-7 h-7 animate-spin text-blue-600" />
            <p className="text-sm text-gray-500">Loading all-user data…</p>
          </div>
        )}

        {data && (
          <>
            {/* KPI Grid */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
            >
              <KpiCard label="Total Users" value={data.kpis.total_users} icon={<Users className="w-5 h-5 text-blue-600" />} color="bg-blue-50" />
              <KpiCard label="Total Agents" value={data.kpis.total_agents} icon={<Bot className="w-5 h-5 text-violet-600" />} color="bg-violet-50" />
              <KpiCard label="Total Leads" value={data.kpis.total_leads} icon={<Zap className="w-5 h-5 text-amber-600" />} color="bg-amber-50" />
              <KpiCard label="Phone Numbers" value={data.kpis.total_phones} icon={<Phone className="w-5 h-5 text-green-600" />} color="bg-green-50" />
              <KpiCard label="Wins Today" value={data.kpis.wins_today} icon={<CheckCircle className="w-5 h-5 text-emerald-600" />} color="bg-emerald-50" />
              <KpiCard label="Self-Heals Today" value={data.kpis.heals_today} icon={<Activity className="w-5 h-5 text-rose-600" />} color="bg-rose-50" />
            </motion.div>

            {/* Win channel breakdown */}
            {Object.keys(data.kpis.wins_by_channel).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {Object.entries(data.kpis.wins_by_channel).map(([ch, count]) => (
                  <span key={ch} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-medium text-emerald-700">
                    {CHANNEL_ICONS[ch] || '•'} {ch}: {count}
                  </span>
                ))}
              </div>
            )}

            {/* Users Table */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">All Users</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{data.users.length} accounts — click a row to expand</p>
                </div>
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className={thClass} onClick={() => handleSort('email')}>
                        <span className="flex items-center">Email <SortIcon col="email" /></span>
                      </th>
                      <th className={thClass} onClick={() => handleSort('business_name')}>
                        <span className="flex items-center">Business <SortIcon col="business_name" /></span>
                      </th>
                      <th className={thClass} onClick={() => handleSort('agents')}>
                        <span className="flex items-center">Agents <SortIcon col="agents" /></span>
                      </th>
                      <th className={thClass} onClick={() => handleSort('leads')}>
                        <span className="flex items-center">Leads <SortIcon col="leads" /></span>
                      </th>
                      <th className={thClass} onClick={() => handleSort('phones')}>
                        <span className="flex items-center">Phones <SortIcon col="phones" /></span>
                      </th>
                      <th className={thClass} onClick={() => handleSort('wins_today')}>
                        <span className="flex items-center">Wins Today <SortIcon col="wins_today" /></span>
                      </th>
                      <th className={thClass} onClick={() => handleSort('heals_today')}>
                        <span className="flex items-center">Heals Today <SortIcon col="heals_today" /></span>
                      </th>
                      <th className={thClass} onClick={() => handleSort('joined')}>
                        <span className="flex items-center">Joined <SortIcon col="joined" /></span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {sortedUsers.map((u) => (
                      <React.Fragment key={u.user_id}>
                        <tr
                          className="hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => setExpandedUser(expandedUser === u.user_id ? null : u.user_id)}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                {(u.email || 'U').charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm text-gray-800 truncate max-w-[180px]">{u.email}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                              <span className="text-sm text-gray-700 truncate max-w-[120px]">{u.business_name !== '—' ? u.business_name : u.workspace}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{u.agents || '—'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{u.leads || '—'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{u.phones || '—'}</td>
                          <td className="px-4 py-3">
                            {u.wins_today > 0
                              ? <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">{u.wins_today} wins</span>
                              : <span className="text-xs text-gray-400">—</span>
                            }
                          </td>
                          <td className="px-4 py-3">
                            {u.heals_today > 0
                              ? <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full"><AlertTriangle className="w-3 h-3" />{u.heals_today}</span>
                              : <span className="text-xs text-gray-400">—</span>
                            }
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500">{u.joined ? new Date(u.joined).toLocaleDateString() : '—'}</td>
                        </tr>

                        {/* Expanded row */}
                        {expandedUser === u.user_id && (
                          <tr>
                            <td colSpan={8} className="px-4 py-4 bg-blue-50/40 border-l-2 border-blue-400">
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                                <div>
                                  <span className="text-xs font-medium text-gray-500 block">User ID</span>
                                  <span className="text-gray-700 font-mono text-xs break-all">{u.user_id}</span>
                                </div>
                                <div>
                                  <span className="text-xs font-medium text-gray-500 block">Industry</span>
                                  <span className="text-gray-700">{u.industry !== '—' ? u.industry : '—'}</span>
                                </div>
                                <div>
                                  <span className="text-xs font-medium text-gray-500 block">Workspace</span>
                                  <span className="text-gray-700">{u.workspace}</span>
                                </div>
                                <div>
                                  <span className="text-xs font-medium text-gray-500 block">Last Sign In</span>
                                  <span className="text-gray-700">{u.last_sign_in ? new Date(u.last_sign_in).toLocaleString() : 'Never'}</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                    {sortedUsers.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-400">No users found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Recent activity: wins + heals side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Recent wins */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <h2 className="font-semibold text-gray-900 text-sm">Recent Wins</h2>
                </div>
                <ul className="divide-y divide-gray-50">
                  {(data.recent_wins || []).slice(0, 10).map((w: any) => (
                    <li key={w.id} className="px-5 py-3 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-medium text-gray-700">{CHANNEL_ICONS[w.channel] || '•'} {w.channel || 'unknown'}</span>
                        <span className="ml-2 text-xs text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">{w.outcome_type}</span>
                        {w.summary && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">{w.summary}</p>}
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                        {new Date(w.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </li>
                  ))}
                  {(data.recent_wins || []).length === 0 && (
                    <li className="px-5 py-8 text-center text-xs text-gray-400">No wins yet today</li>
                  )}
                </ul>
              </motion.div>

              {/* Recent heals */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-500" />
                  <h2 className="font-semibold text-gray-900 text-sm">Recent Self-Heals</h2>
                </div>
                <ul className="divide-y divide-gray-50">
                  {(data.recent_heals || []).slice(0, 10).map((h: any) => (
                    <li key={h.id} className="px-5 py-3 flex items-center justify-between">
                      <div>
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                          h.status === 'fixed' ? 'bg-emerald-50 text-emerald-700' :
                          h.status === 'max_attempts_reached' ? 'bg-rose-50 text-rose-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>{h.status || 'in progress'}</span>
                        {h.heal_iterations != null && (
                          <span className="ml-2 text-xs text-gray-500">{h.heal_iterations} iteration{h.heal_iterations !== 1 ? 's' : ''}</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                        {new Date(h.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </li>
                  ))}
                  {(data.recent_heals || []).length === 0 && (
                    <li className="px-5 py-8 text-center text-xs text-gray-400">No self-heals recently</li>
                  )}
                </ul>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
