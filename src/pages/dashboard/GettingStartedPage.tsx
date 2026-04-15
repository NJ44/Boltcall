import React, { useState, useEffect } from 'react';
import { ChevronRight, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import TalkToAgentModal from '../../components/TalkToAgentModal';

const STEPS = [
  { id: 1, title: 'Create Agent', description: 'Set up your AI agent', link: '/dashboard/agents', completed: true },
  { id: 2, title: 'Connect Cal.com', description: 'Link your calendar', link: '/dashboard/calcom', completed: true },
  { id: 3, title: 'Setup AI Receptionist', description: 'Configure your receptionist', link: '/dashboard/ai-receptionist', completed: true },
  { id: 4, title: 'Configure Phone Numbers', description: 'Set up your phone numbers', link: '/dashboard/phone', completed: true },
  { id: 5, title: 'Setup Knowledge Base', description: 'Add your business information', link: '/dashboard/knowledge-base', completed: false, timeEstimate: 'About 1 min' },
  { id: 6, title: 'Test Your Agent', description: 'Test and verify your setup', link: '/dashboard/agents?tab=agent-tests', completed: false, timeEstimate: 'About 1 min' },
  { id: 7, title: 'Give Feedback', description: 'Share your experience with us', link: '/dashboard/feedback', completed: false, timeEstimate: 'About 1 min' },
];

export const GETTING_STARTED_TOTAL = STEPS.length;
export const GETTING_STARTED_COMPLETED = STEPS.filter(s => s.completed).length;

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
