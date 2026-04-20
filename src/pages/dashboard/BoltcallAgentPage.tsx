import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowUp, Zap, BarChart2, Globe, Activity, CheckCircle2, Paperclip } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actions?: string[];
  loading?: boolean;
}

// ─── Simple markdown renderer ─────────────────────────────────────────────────

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];
  let key = 0;

  const renderInline = (str: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    const re = /(\*\*(.+?)\*\*|`(.+?)`)/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(str)) !== null) {
      if (m.index > last) parts.push(str.slice(last, m.index));
      if (m[2] !== undefined) parts.push(<strong key={key++}>{m[2]}</strong>);
      else if (m[3] !== undefined) parts.push(<code key={key++} className="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">{m[3]}</code>);
      last = m.index + m[0].length;
    }
    if (last < str.length) parts.push(str.slice(last));
    return parts;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) {
      nodes.push(<div key={key++} className="h-2" />);
    } else if (line.startsWith('• ') || line.startsWith('- ')) {
      nodes.push(
        <div key={key++} className="flex gap-1.5 my-0.5">
          <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
          <span>{renderInline(line.slice(2))}</span>
        </div>
      );
    } else if (/^\d+\.\s/.test(line)) {
      const num = line.match(/^(\d+)\./)?.[1];
      nodes.push(
        <div key={key++} className="flex gap-1.5 my-0.5">
          <span className="text-gray-500 flex-shrink-0 font-medium">{num}.</span>
          <span>{renderInline(line.replace(/^\d+\.\s/, ''))}</span>
        </div>
      );
    } else {
      nodes.push(<p key={key++} className="my-0.5 leading-relaxed">{renderInline(line)}</p>);
    }
  }

  return nodes;
}

// ─── Quick action cards ───────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  {
    icon: <Globe className="w-5 h-5" />,
    title: 'Review my agent',
    prompt: 'Show me my current AI agent configuration and what it does.',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Optimize my agent',
    prompt: 'Help me improve my AI agent — review what it currently does and suggest improvements.',
  },
  {
    icon: <BarChart2 className="w-5 h-5" />,
    title: 'Analyze leads',
    prompt: 'Give me my business performance metrics for the last 7 days.',
  },
  {
    icon: <Activity className="w-5 h-5" />,
    title: 'Review my setup',
    prompt: 'Review my full Boltcall setup and tell me what could be improved.',
  },
];

// ─── Loading dots ─────────────────────────────────────────────────────────────

const LoadingDots: React.FC = () => (
  <span className="inline-flex items-center gap-1">
    {[0, 1, 2].map(i => (
      <span
        key={i}
        className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.9s' }}
      />
    ))}
  </span>
);

// ─── Main page ────────────────────────────────────────────────────────────────

const BoltcallAgentPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomTextareaRef = useRef<HTMLTextAreaElement>(null);
  const hasMsgs = messages.length > 0;

  const firstName = (user?.name ?? '').split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, []);

  useEffect(() => {
    resizeTextarea();
  }, [input, resizeTextarea]);

  // Send message to ai-assistant function
  const sendMessage = useCallback(
    async (text?: string) => {
      const trimmed = (text ?? input).trim();
      if (!trimmed || isLoading) return;

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: trimmed,
      };
      const loadingMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        loading: true,
      };

      setMessages(prev => [...prev, userMsg, loadingMsg]);
      setInput('');
      setIsLoading(true);

      try {
        // Build conversation history (exclude current loading placeholder)
        const history = [...messages, userMsg].map(m => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch('/.netlify/functions/ai-assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history, userId: user?.id }),
        });

        const data = await res.json();

        const assistantMsg: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.reply || (res.ok ? 'Done!' : 'Something went wrong. Please try again.'),
          actions: data.actions,
        };

        setMessages(prev => prev.slice(0, -1).concat(assistantMsg));
      } catch {
        setMessages(prev =>
          prev.slice(0, -1).concat({
            id: crypto.randomUUID(),
            role: 'assistant',
            content: 'Connection error. Please check your internet and try again.',
          })
        );
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages, user?.id]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ─── GitHub SVG ────────────────────────────────────────────────────────────

  const GitHubIcon = (
    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );

  // ─── Toolbar (shared between centered card and bottom bar) ─────────────────

  const InputToolbar = (ref: React.RefObject<HTMLTextAreaElement | null>) => (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="px-4 pt-4 pb-2">
        <textarea
          ref={ref}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What's broken?"
          rows={2}
          className="w-full bg-transparent resize-none text-sm text-gray-700 placeholder-gray-400 outline-none leading-relaxed"
          style={{ maxHeight: '120px' }}
          disabled={isLoading}
        />
      </div>
      <div className="flex items-center gap-2 px-3 pb-3">
        <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-md hover:bg-gray-50">
          <Paperclip className="w-4 h-4" />
        </button>
        <button className="flex items-center gap-1 px-2.5 py-1 text-xs text-gray-500 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors font-medium">
          <span className="text-[11px]">⌘</span>
          <span>Shortcuts</span>
        </button>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500">Connectors</span>
          <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
            {GitHubIcon}
          </div>
          <div className="w-5 h-5 rounded bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
            <span className="text-[9px] font-black text-gray-800 leading-none">N</span>
          </div>
        </div>
        <div className="flex-1" />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || isLoading}
          className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 disabled:opacity-40 flex items-center justify-center transition-colors flex-shrink-0"
          aria-label="Send"
        >
          <ArrowUp className="w-4 h-4 text-stone-700" />
        </button>
      </div>
    </div>
  );

  // ─── Empty state ───────────────────────────────────────────────────────────

  const EmptyState = (
    <div className="flex flex-col items-center justify-center flex-1 px-4 pb-8 gap-6">
      <div className="text-center">
        <h1 className="text-[2rem] font-bold text-gray-900 leading-tight mb-2">
          {greeting} {firstName}.
        </h1>
        <p className="text-gray-500 text-sm">
          Want an update or have a question? Just chat below.
        </p>
      </div>

      <div className="w-full max-w-[520px]">
        {InputToolbar(textareaRef)}
      </div>

      <div className="grid grid-cols-4 gap-3 w-full max-w-[520px]">
        {QUICK_ACTIONS.map(action => (
          <button
            key={action.title}
            onClick={() => sendMessage(action.prompt)}
            className="flex flex-col items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl text-center hover:border-gray-300 hover:shadow-sm active:scale-[0.98] transition-all duration-150 cursor-pointer"
          >
            <span className="text-gray-400">{action.icon}</span>
            <span className="text-xs font-medium text-[#8C6B52] leading-snug">{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // ─── Message thread ────────────────────────────────────────────────────────

  const MessageThread = (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      {messages.map(msg => (
        <div
          key={msg.id}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-3`}
        >
          {/* Avatar — only for assistant */}
          {msg.role === 'assistant' && (
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mb-0.5">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
          )}

          <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[75%]`}>
            {/* Bubble */}
            <div
              className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-md'
                  : 'bg-gray-100 text-gray-900 rounded-bl-md'
              }`}
            >
              {msg.loading ? (
                <LoadingDots />
              ) : msg.role === 'user' ? (
                msg.content
              ) : (
                <div className="space-y-0.5">{renderMarkdown(msg.content)}</div>
              )}
            </div>

            {/* Actions taken chips */}
            {msg.actions && msg.actions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {msg.actions.map((action, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 border border-green-200 text-green-700 text-xs rounded-full font-medium"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {action}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Avatar — only for user */}
          {msg.role === 'user' && (
            <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 mb-0.5 text-white text-xs font-semibold">
              {(user?.name ?? 'U').charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );

  // ─── Bottom input bar (when messages exist) ────────────────────────────────

  const InputBar = (
    <div className="flex-shrink-0 border-t border-gray-100 bg-white px-4 py-3">
      <div className="max-w-2xl mx-auto">
        {InputToolbar(bottomTextareaRef)}
        <p className="text-center text-xs text-gray-400 mt-2">
          Bolt can update your agent, query leads, and change settings.
        </p>
      </div>
    </div>
  );

  // ─── Layout ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full -m-3 md:-m-6">
      {hasMsgs ? (
        <>
          {MessageThread}
          {InputBar}
        </>
      ) : (
        EmptyState
      )}
    </div>
  );
};

export default BoltcallAgentPage;
