import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageSkeleton } from '../../components/ui/loading-skeleton';
import {
  Phone, PhoneCall, PhoneOff, Clock, Calendar, CheckCircle2,
  Settings, Volume2, BookOpen, ArrowRight, BarChart3,
  TrendingUp, Users, Headphones, AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { PopButton } from '../../components/ui/pop-button';
import { StatusBadge } from '../../components/ui/status-badge';

interface ReceptionistStats {
  totalCalls: number;
  answeredCalls: number;
  appointmentsBooked: number;
  avgCallDuration: string;
  missedCalls: number;
}

interface AgentInfo {
  id: string;
  name: string;
  status: string;
  voice_id?: string;
  created_at?: string;
}

const AIReceptionistDashboardPage: React.FC = () => {
  const { user } = useAuth();
  useTranslation();
  const [agent, setAgent] = useState<AgentInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const [stats] = useState<ReceptionistStats>({
    totalCalls: 0,
    answeredCalls: 0,
    appointmentsBooked: 0,
    avgCallDuration: '0:00',
    missedCalls: 0
  });

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [agentRes, featuresRes] = await Promise.all([
          supabase
            .from('agents')
            .select('id, name, status, voice_id, created_at')
            .eq('user_id', user.id)
            .limit(1)
            .maybeSingle(),
          supabase
            .from('business_features')
            .select('voice_agent_enabled')
            .eq('user_id', user.id)
            .maybeSingle()
        ]);

        if (agentRes.data) {
          setAgent(agentRes.data);
        }
        if (featuresRes.data) {
          setIsEnabled(featuresRes.data.voice_agent_enabled ?? false);
        }
      } catch (err) {
        console.error('Failed to load receptionist data:', err);
      }
      setIsLoading(false);
    })();
  }, [user]);

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Status Badge */}
      <div className="flex items-center justify-end">
        <StatusBadge status={isEnabled ? 'active' : 'inactive'} />
      </div>

      {/* No Agent Setup CTA */}
      {!agent && (
        <div className="bg-white dark:bg-[#111114] rounded-xl border border-gray-200 dark:border-[#1e1e24] p-8 text-center">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Set Up Your AI Receptionist
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            Create an AI agent to start answering calls automatically. Choose a voice, connect your knowledge base, and assign a phone number.
          </p>
          <PopButton color="blue" asChild>
            <Link to="/dashboard/agents" className="gap-2">
              Create Agent
              <ArrowRight className="w-4 h-4" />
            </Link>
          </PopButton>
        </div>
      )}

      {/* Agent Active — Stats + Quick Actions */}
      {agent && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Calls', value: stats.totalCalls, icon: PhoneCall, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30' },
              { label: 'Answered', value: stats.answeredCalls, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/30' },
              { label: 'Appointments', value: stats.appointmentsBooked, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/30' },
              { label: 'Missed', value: stats.missedCalls, icon: PhoneOff, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/30' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white dark:bg-[#111114] rounded-xl border border-gray-200 dark:border-[#1e1e24] p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Receptionist Info Card */}
          <div className="bg-white dark:bg-[#111114] rounded-xl border border-gray-200 dark:border-[#1e1e24] overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-[#1e1e24] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{agent.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">AI Receptionist</p>
                </div>
              </div>
              <Link
                to="/dashboard/agents"
                className="text-xs text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors flex items-center gap-1"
              >
                <Settings className="w-3.5 h-3.5" />
                Configure
              </Link>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#0e0e11]">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Avg. Call Duration</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{stats.avgCallDuration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#0e0e11]">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Answer Rate</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {stats.totalCalls > 0 ? Math.round((stats.answeredCalls / stats.totalCalls) * 100) : 0}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#0e0e11]">
                  <Users className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Booking Rate</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {stats.answeredCalls > 0 ? Math.round((stats.appointmentsBooked / stats.answeredCalls) * 100) : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-[#111114] rounded-xl border border-gray-200 dark:border-[#1e1e24] overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-[#1e1e24]">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-[#1e1e24]">
              {[
                { label: 'Test Your Receptionist', description: 'Make a test call to hear your AI in action', icon: PhoneCall, link: '/dashboard/agents', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30' },
                { label: 'View Call History', description: 'See all calls your receptionist has handled', icon: BarChart3, link: '/dashboard/calls', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/30' },
                { label: 'Update Knowledge Base', description: 'Add or edit the information your AI knows', icon: BookOpen, link: '/dashboard/knowledge-base', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/30' },
                { label: 'Change Voice', description: 'Pick a different voice for your receptionist', icon: Volume2, link: '/dashboard/voice-library', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' },
                { label: 'Manage Phone Numbers', description: 'View and configure your phone numbers', icon: Phone, link: '/dashboard/phone', color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-950/30' },
              ].map((action) => (
                <Link
                  key={action.label}
                  to={action.link}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-[#0e0e11] transition-colors group"
                >
                  <div className={`w-9 h-9 rounded-lg ${action.bg} flex items-center justify-center flex-shrink-0`}>
                    <action.icon className={`w-4.5 h-4.5 ${action.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{action.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{action.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Not enabled warning */}
          {!isEnabled && (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Receptionist is inactive</p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                  Your AI receptionist is configured but not enabled. Turn it on from the dashboard to start answering calls.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AIReceptionistDashboardPage;
