import React, { useState, useEffect, useRef } from 'react';
import { Phone } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import dayjs from 'dayjs';
import SetupCompletionPopup from '../../components/SetupCompletionPopup';
import { AgentWorkflowBlock } from '../../components/ui/agent-workflow-block';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import TalkToAgentModal from '../../components/TalkToAgentModal';
import TodayGlanceCard from '../../components/dashboard/TodayGlanceCard';
import RecentWinBanner from '../../components/dashboard/RecentWinBanner';
import { useDashboardStore } from '../../stores/dashboardStore';

interface LatestBooking {
  client_name: string;
  completed_at: string;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showTalkModal, setShowTalkModal] = useState(false);
  const [primaryAgent, setPrimaryAgent] = useState<{ id: string; name: string; retell_agent_id?: string } | null>(null);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [latestBooking, setLatestBooking] = useState<LatestBooking | null>(null);

  const fetchLiveData = useDashboardStore((s) => s.fetchLiveData);
  const hasFetchedLiveData = useRef(false);

  // Fetch live stats for TodayGlanceCard — guarded by ref to prevent duplicate fires
  useEffect(() => {
    if (hasFetchedLiveData.current) return;
    hasFetchedLiveData.current = true;
    fetchLiveData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch user's primary agent for "Talk to Agent" button
  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('agents')
      .select('id, name, retell_agent_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: true })
      .limit(1)
      .then(({ data }) => {
        if (data?.[0]) setPrimaryAgent(data[0]);
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

  // Check if setup was just completed
  useEffect(() => {
    const setupCompleted = searchParams.get('setupCompleted');
    if (setupCompleted === 'true') {
      setShowCompletionPopup(true);
      setShowConfetti(true);
      setSearchParams({});
      setTimeout(() => setShowConfetti(false), 2500);
    }
  }, [searchParams, setSearchParams]);

  // Fire confetti effect
  useEffect(() => {
    if (!showConfetti) return;
    confetti({
      particleCount: 500,
      spread: 160,
      gravity: 0.3,
      origin: { y: 0.4 },
    });
  }, [showConfetti]);

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
          <AgentWorkflowBlock />
        </div>
      </div>

      {/* Talk to Agent */}
      {primaryAgent && (
        <div className="bg-white dark:bg-[#111114] rounded-lg border border-gray-200 dark:border-[#1e1e24] p-4">
          <button
            onClick={() => setShowTalkModal(true)}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            <Phone className="w-5 h-5" />
            Talk to Your Agent
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Your AI agent will call your phone so you can test it live
          </p>
        </div>
      )}

      {primaryAgent && (
        <TalkToAgentModal
          open={showTalkModal}
          onClose={() => setShowTalkModal(false)}
          agentId={primaryAgent.retell_agent_id || primaryAgent.id}
          agentName={primaryAgent.name}
        />
      )}
    </div>
  );
};

export default DashboardPage;
