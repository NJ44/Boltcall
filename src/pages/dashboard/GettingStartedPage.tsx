import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRight, Phone, PhoneMissed, Zap, Moon, Calendar, Inbox, BookOpen, FlaskConical, MessageSquare } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useSetupStore } from '../../stores/setupStore';
import TalkToAgentModal from '../../components/TalkToAgentModal';

type Step = {
  id: string;
  title: string;
  description: string;
  link: string;
  icon: LucideIcon;
  completed: boolean;
  timeEstimate?: string;
};

// Personalized tasks driven by survey.painPoints answered during setup
const PAIN_POINT_TASKS: Record<string, Omit<Step, 'completed'>> = {
  missed_calls: {
    id: 'missed_calls',
    title: 'Set up Missed-Call Recovery',
    description: 'Auto-text every missed call within seconds',
    link: '/dashboard/missed-calls',
    icon: PhoneMissed,
    timeEstimate: 'About 2 min',
  },
  ad_followup: {
    id: 'ad_followup',
    title: 'Connect Your Ad Lead Sources',
    description: 'Reply to Facebook & Google ad leads instantly',
    link: '/dashboard/instant-lead-response',
    icon: Zap,
    timeEstimate: 'About 3 min',
  },
  after_hours: {
    id: 'after_hours',
    title: 'Enable 24/7 AI Receptionist',
    description: 'Pick up every call after hours and on weekends',
    link: '/dashboard/ai-receptionist',
    icon: Moon,
    timeEstimate: 'About 2 min',
  },
  slow_response: {
    id: 'slow_response',
    title: 'Configure Speed-to-Lead',
    description: 'Respond to every new lead in under 60 seconds',
    link: '/dashboard/leads',
    icon: Zap,
    timeEstimate: 'About 2 min',
  },
  manual_booking: {
    id: 'manual_booking',
    title: 'Connect Your Calendar',
    description: 'Let leads book themselves via Cal.com',
    link: '/dashboard/calcom',
    icon: Calendar,
    timeEstimate: 'About 2 min',
  },
  no_system: {
    id: 'no_system',
    title: 'Set Up Lead Tracking',
    description: 'Track every lead in one centralized inbox',
    link: '/dashboard/leads',
    icon: Inbox,
    timeEstimate: 'About 1 min',
  },
};

// Always-shown core tasks (regardless of survey answers)
const CORE_TASKS: Omit<Step, 'completed'>[] = [
  { id: 'knowledge_base', title: 'Setup Knowledge Base', description: 'Add your business information', link: '/dashboard/knowledge-base', icon: BookOpen, timeEstimate: 'About 1 min' },
  { id: 'test_agent', title: 'Test Your Agent', description: 'Test and verify your setup', link: '/dashboard/agents?tab=tests', icon: FlaskConical, timeEstimate: 'About 1 min' },
  { id: 'feedback', title: 'Give Feedback', description: 'Share your experience with us', link: '/dashboard/feedback', icon: MessageSquare, timeEstimate: 'About 1 min' },
];

const GettingStartedPage: React.FC = () => {
  const { user } = useAuth();
  const [showTalkModal, setShowTalkModal] = useState(false);
  const [primaryAgent, setPrimaryAgent] = useState<{ id: string; name: string; retell_agent_id?: string } | null>(null);

  const completedCount = STEPS.filter(s => s.completed).length;
  const progressPct = Math.round((completedCount / STEPS.length) * 100);

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

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="bg-white dark:bg-[#111114] rounded-lg border border-gray-200 dark:border-[#1e1e24] overflow-hidden">
        <div className="bg-gray-50 dark:bg-[#0e0e11] border-b border-gray-200 dark:border-[#1e1e24] px-4 py-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Getting Started</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Complete these steps to go live</p>
          </div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {completedCount} of {STEPS.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100 dark:bg-[#1e1e24]">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="p-4">
          <div className="space-y-2">
            {STEPS.map((step) => (
              <Link
                key={step.id}
                to={step.link}
                className="flex items-center gap-3 bg-gray-50 dark:bg-[#0e0e11] rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-[#1a1a1f] transition-colors border border-gray-200 dark:border-[#1e1e24]"
              >
                <div className="flex-shrink-0">
                  {step.completed ? (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className={`font-medium text-sm ${step.completed ? 'text-gray-500 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                    {step.title}
                  </div>
                  {!step.completed && step.timeEstimate && (
                    <div className="text-xs text-gray-500 mt-0.5">{step.timeEstimate}</div>
                  )}
                </div>

                {!step.completed && (
                  <span className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 rounded-md whitespace-nowrap">
                    +10 tokens
                  </span>
                )}
              </Link>
            ))}
          </div>

          {primaryAgent && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#1e1e24]">
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
        </div>
      </div>

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

export default GettingStartedPage;
