import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  actions?: string[];
}

const QUICK_ACTIONS = [
  { label: 'Make my agent friendlier', icon: '😊' },
  { label: 'Change my greeting', icon: '👋' },
  { label: 'Show my call stats', icon: '📊' },
  { label: 'Add a FAQ', icon: '❓' },
];

const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const callAssistant = useCallback(async (msgList: Message[]) => {
    setIsLoading(true);
    try {
      const res = await fetch('/.netlify/functions/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: msgList.map(m => ({ role: m.role, content: m.content })),
          userId: user?.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Something went wrong on our end. Please try again in a moment.',
        }]);
        return;
      }

      const assistantMsg: Message = {
        role: 'assistant',
        content: data.reply || 'Done!',
        actions: data.actions,
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Connection error. Please check your internet and try again.',
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const sendMessage = useCallback(async (text?: string) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { role: 'user', content: trimmed };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    await callAssistant(newMessages);
  }, [input, isLoading, messages, callAssistant]);

  const handleQuickAction = (label: string) => {
    const userMsg: Message = { role: 'user', content: label };
    const newMessages = [userMsg];
    setMessages(newMessages);
    callAssistant(newMessages);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-brand-blue to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow group"
          >
            <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
            <span className="font-medium text-sm">Ask Bolt</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] h-[440px] rounded-2xl overflow-hidden p-[2px]"
          >
            {/* Animated Outer Border */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-white/20"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            />

            {/* Inner Card */}
            <div className="relative flex flex-col w-full h-full rounded-xl border border-white/10 overflow-hidden bg-black/90 backdrop-blur-xl">
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-gray-800 via-black to-gray-900"
                animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                style={{ backgroundSize: '200% 200%' }}
              />

              {/* Floating Particles */}
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-white/10"
                  animate={{
                    y: ['0%', '-140%'],
                    x: [Math.random() * 200 - 100, Math.random() * 200 - 100],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 5 + Math.random() * 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: 'easeInOut',
                  }}
                  style={{ left: `${Math.random() * 100}%`, bottom: '-10%' }}
                />
              ))}

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white">Bolt AI Assistant</h2>
                    <p className="text-xs text-white/50">I can change your settings — just ask</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 px-4 py-3 overflow-y-auto space-y-3 text-sm flex flex-col relative z-10">
                {/* Empty state with quick actions */}
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center flex-1 py-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3">
                      <Sparkles className="w-6 h-6 text-blue-400" />
                    </div>
                    <h4 className="font-medium text-white mb-1">What do you need?</h4>
                    <p className="text-xs text-white/50 mb-4 max-w-[260px] text-center">
                      Tell me what you want and I'll do it. Change your greeting, update your prompt, add FAQs — just say it.
                    </p>
                    <div className="grid grid-cols-2 gap-2 w-full max-w-[300px]">
                      {QUICK_ACTIONS.map((action) => (
                        <button
                          key={action.label}
                          onClick={() => handleQuickAction(action.label)}
                          className="flex items-center gap-2 text-left text-xs px-3 py-2.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg border border-white/10 transition-colors"
                        >
                          <span>{action.icon}</span>
                          <span className="leading-tight">{action.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div key={i}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className={cn(
                        'px-3 py-2 rounded-xl max-w-[80%] shadow-md backdrop-blur-md',
                        msg.role === 'assistant'
                          ? 'bg-white/10 text-white self-start'
                          : 'bg-white/30 text-black font-semibold self-end ml-auto'
                      )}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </motion.div>
                    {/* Action badges */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {msg.actions.map((action, j) => (
                          <span
                            key={j}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            {action}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* AI Typing Indicator */}
                {isLoading && (
                  <motion.div
                    className="flex items-center gap-1 px-3 py-2 rounded-xl max-w-[30%] bg-white/10 self-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0.6, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                  >
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse delay-200"></span>
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse delay-400"></span>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex items-center gap-2 p-3 border-t border-white/10 relative z-10">
                <input
                  ref={inputRef}
                  className="flex-1 px-3 py-2 text-sm bg-black/50 rounded-lg border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-white/50"
                  placeholder="Tell me what to change..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiAssistant;
