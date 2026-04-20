import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import SetupCompletionPopup from '../../components/SetupCompletionPopup';
import { AgentWorkflowBlock, type AgentCustomization } from '../../components/ui/agent-workflow-block';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import TodayGlanceCard from '../../components/dashboard/TodayGlanceCard';
import RecentWinBanner from '../../components/dashboard/RecentWinBanner';
import { useDashboardStore } from '../../stores/dashboardStore';

interface LatestBooking {
  client_name: string;
  completed_at: string;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { planLevel } = useSubscription();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [latestBooking, setLatestBooking] = useState<LatestBooking | null>(null);
  const [agentCustomizations, setAgentCustomizations] = useState<AgentCustomization[]>([]);

  const fetchLiveData = useDashboardStore((s) => s.fetchLiveData);
  const hasFetchedLiveData = useRef(false);

  // Fetch live stats for TodayGlanceCard — guarded by ref to prevent duplicate fires
  useEffect(() => {
    if (hasFetchedLiveData.current) return;
    hasFetchedLiveData.current = true;
    fetchLiveData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch agent customizations (avatar + color) for workflow canvas
  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('agents')
      .select('direction, avatar, color, name')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .then(({ data }) => {
        if (data) {
          const customizations: AgentCustomization[] = data.map((a: any) => ({
            direction: a.direction === 'outbound' ? 'outbound' : 'inbound',
            avatar: a.avatar ?? null,
            color: a.color ?? null,
            title: a.name,
          }));
          setAgentCustomizations(customizations);
        }
      });
  }, [user?.id]);

  // Fetch today's most recent completed booking for RecentWinBanner
  useEffect(() => {
    if (!user?.id) return;
    const dismissed = sessionStorage.getItem('recentWinDismissed');
    if (dismissed) return;
    supabase
      .from('callbacks')
      .select('client_name, completed_at')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .gte('completed_at', dayjs().startOf('day').toISOString())
      .order('completed_at', { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data?.[0]) setLatestBooking(data[0] as LatestBooking);
      });
  }, [user?.id]);

  // Check if setup was just completed — show the "Almost Done!" agent config modal
  useEffect(() => {
    const setupCompleted = searchParams.get('setupCompleted');
    if (setupCompleted === 'true') {
      setShowCompletionPopup(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  // Scroll to relevant section when filter param is present
  useEffect(() => {
    const activeFilter = searchParams.get('filter');
    if (!activeFilter) return;
    const el = document.getElementById(`section-${activeFilter}`);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [searchParams]);

  return (
    <div className="space-y-4 px-1 md:px-0">
      <SetupCompletionPopup
        isOpen={showCompletionPopup}
        onClose={() => setShowCompletionPopup(false)}
      />

      {/* Today at a Glance */}
      <TodayGlanceCard />

      {/* Recent Win Banner */}
      {latestBooking && (
        <RecentWinBanner
          clientName={latestBooking.client_name}
          completedAt={latestBooking.completed_at}
          onDismiss={() => setLatestBooking(null)}
        />
      )}

      {/* Agent Architecture */}
      <div className="bg-white dark:bg-[#111114] rounded-lg border border-gray-200 dark:border-[#1e1e24] overflow-hidden">
        <div className="bg-gray-50 dark:bg-[#0e0e11] border-b border-gray-200 dark:border-[#1e1e24] px-4 py-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Agent Architecture</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">How your triggers, agents, and outputs connect</p>
        </div>
        <div className="p-4">
          <AgentWorkflowBlock agents={agentCustomizations} />
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;
