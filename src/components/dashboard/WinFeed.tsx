import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

dayjs.extend(relativeTime);

interface FeedEvent {
  id: string;
  client_name: string;
  status: string;
  created_at: string;
}

function describeEvent(event: FeedEvent): string {
  const name = event.client_name || 'A lead';
  switch (event.status) {
    case 'completed':  return `Booking confirmed with ${name}`;
    case 'scheduled':  return `AI booked ${name} for an appointment`;
    case 'pending':    return `New lead captured — ${name} waiting for callback`;
    default:           return `Lead captured: ${name}`;
  }
}

function statusDot(status: string): string {
  switch (status) {
    case 'completed': return 'bg-emerald-400';
    case 'scheduled': return 'bg-blue-400';
    case 'pending':   return 'bg-amber-400';
    default:          return 'bg-foreground/20';
  }
}

const WinFeed: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('callbacks')
      .select('id, client_name, status, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data) setEvents(data as FeedEvent[]);
        setLoading(false);
      });
  }, [user?.id]);

  if (loading) {
    return (
      <div className="rounded-lg border border-border/30 bg-background/40 px-5 py-4 backdrop-blur-sm space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground/10 animate-pulse shrink-0" />
            <span className="h-3 rounded bg-foreground/10 animate-pulse" style={{ width: `${55 + i * 10}%` }} />
            <span className="h-3 w-12 rounded bg-foreground/10 animate-pulse ml-auto shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.1 }}
      className="rounded-lg border border-border/30 bg-background/40 px-5 py-4 backdrop-blur-sm"
    >
      <ul className="space-y-3" aria-label="Recent AI activity">
        {events.map((event) => (
          <li key={event.id} className="flex items-center gap-3">
            <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusDot(event.status)}`} aria-hidden="true" />
            <span className="text-sm text-foreground/75 truncate">{describeEvent(event)}</span>
            <span className="ml-auto text-[10px] text-foreground/40 shrink-0 tabular-nums">
              {dayjs(event.created_at).fromNow()}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default WinFeed;
