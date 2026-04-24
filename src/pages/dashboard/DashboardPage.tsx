import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import SetupCompletionPopup from '../../components/SetupCompletionPopup';
import TodayGlanceCard from '../../components/dashboard/TodayGlanceCard';
import WinFeed from '../../components/dashboard/WinFeed';
import WhileYouWereGone from '../../components/dashboard/WhileYouWereGone';
import { useDashboardStore } from '../../stores/dashboardStore';
import { AgentWorkflowBlock, type AgentCustomization } from '../../components/ui/agent-workflow-block';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';

const DashboardPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [agentCustomizations, setAgentCustomizations] = useState<AgentCustomization[]>([]);

  const fetchLiveData = useDashboardStore((s) => s.fetchLiveData);
  const hasFetchedLiveData = useRef(false);
  const { user } = useAuth();
  const { planLevel } = useSubscription();

  // Fetch live stats for TodayGlanceCard — guarded by ref to prevent duplicate fires
  useEffect(() => {
    if (hasFetchedLiveData.current) return;
    hasFetchedLiveData.current = true;
    fetchLiveData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

      {/* While You Were Gone — shows if user was away 30+ min */}
      <WhileYouWereGone />

      {/* Today's Status — Trigger + Action */}
      <TodayGlanceCard />

      {/* Agent Architecture — workflow diagram */}
      <AgentWorkflowBlock agents={agentCustomizations} planLevel={planLevel} />

      {/* Recent Activity — Variable Reward */}
      <WinFeed />
    </div>
  );
};

export default DashboardPage;
