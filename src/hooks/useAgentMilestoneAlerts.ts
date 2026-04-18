import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Alert } from '@/types/dashboard';

// Booking milestone thresholds (cumulative total)
const BOOKING_MILESTONES = [5, 10, 25, 50, 100, 250, 500];
// Total call milestone thresholds
const CALL_MILESTONES = [10, 50, 100, 250, 500, 1000];

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function generateMilestoneAlerts(
  agents: Array<{ id: string; name: string; total_calls: number; conversion_rate: number | null }>
): Alert[] {
  const alerts: Alert[] = [];

  for (const agent of agents) {
    const totalCalls = agent.total_calls || 0;
    const rate = agent.conversion_rate ?? 0;
    const estimatedBookings = Math.round(totalCalls * (rate / 100));

    // Booking milestones
    for (const threshold of BOOKING_MILESTONES) {
      if (estimatedBookings >= threshold) {
        alerts.push({
          id: `milestone_${agent.id}_bookings_${threshold}`,
          type: 'info',
          message: `🎯 ${agent.name} booked their ${ordinal(threshold)} lead!`,
        });
      }
    }

    // Call volume milestones
    for (const threshold of CALL_MILESTONES) {
      if (totalCalls >= threshold) {
        alerts.push({
          id: `milestone_${agent.id}_calls_${threshold}`,
          type: 'info',
          message: `📞 ${agent.name} has handled ${threshold.toLocaleString()}+ calls`,
        });
      }
    }

    // Performance warning: agent has 20+ calls but 0 bookings
    if (totalCalls >= 20 && estimatedBookings === 0) {
      alerts.push({
        id: `milestone_${agent.id}_low_conversion`,
        type: 'warning',
        message: `⚠️ ${agent.name} has ${totalCalls} calls but 0 bookings — check the script`,
      });
    }
  }

  return alerts;
}

export function useAgentMilestoneAlerts(): Alert[] {
  const { user } = useAuth();
  const [milestoneAlerts, setMilestoneAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;

    async function fetchAndGenerate() {
      const { data, error } = await supabase
        .from('agents')
        .select('id, name, total_calls, conversion_rate')
        .eq('user_id', user!.id);

      if (error || !data || cancelled) return;

      const alerts = generateMilestoneAlerts(data);
      setMilestoneAlerts(alerts);
    }

    fetchAndGenerate();
    return () => { cancelled = true; };
  }, [user?.id]);

  return milestoneAlerts;
}
