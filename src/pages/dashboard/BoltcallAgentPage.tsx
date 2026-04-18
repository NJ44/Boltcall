import React, { useState, useRef } from 'react';
import { Paperclip, ArrowUp, Zap, BarChart2, Users, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const quickActions = [
  { icon: <Zap className="w-5 h-5 text-gray-400" />, label: 'Audit my leads pipeline' },
  { icon: <BarChart2 className="w-5 h-5 text-gray-400" />, label: 'Show my analytics' },
  { icon: <Users className="w-5 h-5 text-gray-400" />, label: 'Check my agents' },
  { icon: <Eye className="w-5 h-5 text-gray-400" />, label: 'Quick performance check' },
];

const BoltcallAgentPage: React.FC = () => {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const firstName = user?.name?.split(' ')[0] || 'there';

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    // TODO: connect to AI backend
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      {/* Greeting */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          {greeting} {firstName}.
        </h1>
        <p className="text-base text-gray-500 dark:text-gray-400">
          Want an update or have a question? Just chat below.
        </p>
      </div>

      {/* Chat input */}
      <div className="w-full max-w-2xl">
        <div className="rounded-2xl border border-gray-200 dark:border-[#2a2a30] bg-white dark:bg-[#111114] shadow-sm overflow-hidden">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder=""
            rows={1}
            className="w-full px-5 pt-4 pb-2 text-sm text-gray-900 dark:text-white bg-transparent resize-none outline-none placeholder-gray-400 min-h-[52px] max-h-48"
          />

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between px-4 pb-3 pt-1">
            <div className="flex items-center gap-2">
              {/* Attach */}
              <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-[#1a1a1f] transition-colors">
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Shortcuts pill */}
              <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-[#2a2a30] text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1f] transition-colors">
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="5" height="5" rx="1" fill="currentColor" opacity="0.6" />
                  <rect x="9" y="2" width="5" height="5" rx="1" fill="currentColor" opacity="0.6" />
                  <rect x="2" y="9" width="5" height="5" rx="1" fill="currentColor" opacity="0.6" />
                  <rect x="9" y="9" width="5" height="5" rx="1" fill="currentColor" opacity="0.6" />
                </svg>
                Shortcuts
              </button>

              {/* Connectors pill */}
              <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-[#2a2a30] text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1f] transition-colors">
                Connectors
                <span className="flex items-center gap-0.5 ml-0.5">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 5v6M5 8h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
            </div>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                input.trim()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 dark:bg-[#1a1a1f] text-gray-400'
              }`}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick action cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => setInput(action.label)}
              className="flex flex-col gap-2 p-3.5 rounded-xl border border-gray-200 dark:border-[#2a2a30] bg-white dark:bg-[#111114] hover:bg-gray-50 dark:hover:bg-[#1a1a1f] text-left transition-colors"
            >
              {action.icon}
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300 leading-snug">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoltcallAgentPage;
