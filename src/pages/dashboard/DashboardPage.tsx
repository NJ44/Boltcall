import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import SetupCompletionPopup from '../../components/SetupCompletionPopup';
import TodayGlanceCard from '../../components/dashboard/TodayGlanceCard';
import WinFeed from '../../components/dashboard/WinFeed';
import { useDashboardStore } from '../../stores/dashboardStore';

const DashboardPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);

  const fetchLiveData = useDashboardStore((s) => s.fetchLiveData);
  const hasFetchedLiveData = useRef(false);

  // Fetch live stats for TodayGlanceCard — guarded by ref to prevent duplicate fires
  useEffect(() => {
    if (hasFetchedLiveData.current) return;
    hasFetchedLiveData.current = true;
    fetchLiveData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

      {/* Today's Status — Trigger + Action */}
      <TodayGlanceCard />

      {/* Recent Activity — Variable Reward */}
      <WinFeed />
    </div>
  );
};

export default DashboardPage;
