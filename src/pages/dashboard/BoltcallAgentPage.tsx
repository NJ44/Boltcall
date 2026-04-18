import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Zap, BarChart2, Bot, Users, CheckCircle2 } from 'lucide-react';
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
    icon: <Bot className="w-5 h-5 text-blue-600" />,
    title: 'Review my agent',
    desc: 'See what your AI agent currently does',
    prompt: 'Show me my current AI agent configuration and what it does.',
  },
  {
    icon: <Users className="w-5 h-5 text-violet-600" />,
    title: 'Show my leads',
    desc: 'See recent leads and their status',
    prompt: 'Show me my recent leads from the last 7 days.',
  },
  {
    icon: <BarChart2 className="w-5 h-5 text-emerald-600" />,
    title: 'Dashboard metrics',
    desc: 'How is my business performing?',
    prompt: 'Give me my business performance metrics for the last 7 days.',
  },
  {
    icon: <Zap className="w-5 h-5 text-amber-500" />,
    title: 'Fix my agent',
    desc: 'Tune agent tone or behavior',
    prompt: 'Help me improve my AI agent — review what it currently does and suggest improvements.',
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
          content: res.ok
            ? (data.reply || 'Done!')
            : 'Something went wrong. Please try again.',
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

  // ─── Empty state ───────────────────────────────────────────────────────────

  const EmptyState = (
    <div className="flex flex-col items-center justify-center flex-1 px-4 pb-8">
      {/* Greeting */}
      <div className="mb-8 text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          {greeting}, {firstName}.
        </h1>
        <p className="text-gray-500 text-sm">
          Want an update or have a question? Just chat below.
        </p>
      </div>

      {/* Quick action cards */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
        {QUICK_ACTIONS.map(action => (
          <button
            key={action.title}
            onClick={() => sendMessage(action.prompt)}
            className="flex flex-col items-start gap-2 p-4 bg-white border border-gray-200 rounded-xl text-left hover:border-blue-300 hover:shadow-sm transition-all group"
          >
            <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-blue-50 transition-colors">
              {action.icon}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">{action.title}</div>
              <div className="text-xs text-gray-500 mt-0.5">{action.desc}</div>
            </div>
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

  // ─── Input bar ─────────────────────────────────────────────────────────────

  const InputBar = (
    <div className="flex-shrink-0 border-t border-gray-100 bg-white px-4 py-3">
      <div className="flex items-end gap-3 max-w-2xl mx-auto">
        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 focus-within:border-blue-400 focus-within:bg-white transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your dashboard…"
            rows={1}
            className="w-full bg-transparent resize-none text-sm text-gray-900 placeholder-gray-400 outline-none leading-relaxed"
            style={{ maxHeight: '160px' }}
            disabled={isLoading}
          />
        </div>
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || isLoading}
          className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
          aria-label="Send"
        >
          <Send className="w-4 h-4 text-white disabled:text-gray-400" />
        </button>
      </div>
      <p className="text-center text-xs text-gray-400 mt-2">
        Bolt can update your agent, query leads, and change settings.
      </p>
    </div>
  );

  // ─── Layout ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full -m-3 md:-m-6">
      {hasMsgs ? MessageThread : EmptyState}
      {InputBar}
    </div>
  );
};

export default BoltcallAgentPage;
