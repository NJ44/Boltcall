import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VoicePicker } from './ui/voice-picker';
import { AgentAvatar } from './ui/AgentAvatar';
import { useRetellVoices } from '../hooks/useRetellVoices';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// ─── Config ───────────────────────────────────────────────────────────────────

const EMOJI_OPTIONS = ['🤖', '⚡', '🎯', '🔥', '🦾', '💎', '🚀', '🌟', '🎪', '✨'];

const COLOR_OPTIONS = [
  { label: 'Blue',    value: '#3B82F6' },
  { label: 'Violet',  value: '#8B5CF6' },
  { label: 'Emerald', value: '#10B981' },
  { label: 'Amber',   value: '#F59E0B' },
  { label: 'Rose',    value: '#F43F5E' },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface SetupCompletionPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalState = 'form' | 'saving' | 'success';

// ─── Component ────────────────────────────────────────────────────────────────

const SetupCompletionPopup: React.FC<SetupCompletionPopupProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { voices } = useRetellVoices();

  const [modalState, setModalState] = useState<ModalState>('form');
  const [selectedEmoji, setSelectedEmoji] = useState<string>('🤖');
  const [selectedColor, setSelectedColor] = useState<string>('#3B82F6');
  const [agentName, setAgentName] = useState('');
  const [voiceId, setVoiceId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!agentName.trim()) {
      setError('Give your agent a name.');
      return;
    }
    if (!voiceId) {
      setError('Pick a voice for your agent.');
      return;
    }

    setError(null);
    setModalState('saving');

    try {
      if (user?.id) {
        const { data: agents } = await supabase
          .from('agents')
          .select('id')
          .eq('user_id', user.id)
          .eq('direction', 'inbound')
          .order('created_at', { ascending: true })
          .limit(1);

        if (agents?.[0]) {
          await supabase
            .from('agents')
            .update({
              name: agentName.trim(),
              avatar: selectedEmoji,
              color: selectedColor,
              voice_id: voiceId,
            })
            .eq('id', agents[0].id);
        }
      }
    } catch {
      // Non-fatal — celebrate regardless
    }

    setModalState('success');

    confetti({
      particleCount: 180,
      spread: 120,
      gravity: 0.4,
      origin: { y: 0.5 },
      colors: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#F43F5E'],
    });
    setTimeout(() => {
      confetti({ particleCount: 80, angle: 60,  spread: 55, origin: { x: 0, y: 0.6 } });
      confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1, y: 0.6 } });
    }, 300);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setModalState('form');
      setSelectedEmoji('🤖');
      setSelectedColor('#3B82F6');
      setAgentName('');
      setVoiceId('');
      setError(null);
    }, 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
            onClick={modalState !== 'saving' ? handleClose : undefined}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative bg-white dark:bg-[#111114] rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden">

              {/* Close button */}
              {modalState !== 'saving' && (
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors z-10"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* ── FORM / SAVING STATE ── */}
              <AnimatePresence mode="wait">
                {(modalState === 'form' || modalState === 'saving') && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2 }}
                    className="p-7"
                  >
                    {/* Header */}
                    <div className="mb-6">
                      <span className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400">
                        Almost Done!
                      </span>
                      <h2 className="mt-1 text-[22px] font-bold text-gray-900 dark:text-white leading-tight">
                        Complete your first AI Agent
                      </h2>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Give it a name, a face, and a voice — it goes live the moment you submit.
                      </p>
                    </div>

                    <div className="space-y-5">
                      {/* Avatar + Color */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          Agent Avatar
                        </label>

                        {/* Preview row */}
                        <div className="flex items-center gap-4 mb-3">
                          <AgentAvatar
                            avatar={selectedEmoji}
                            color={selectedColor}
                            name={agentName || 'Agent'}
                            size="lg"
                          />
                          <div className="flex-1">
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-2 font-medium uppercase tracking-wider">Color</p>
                            <div className="flex gap-2">
                              {COLOR_OPTIONS.map((c) => (
                                <button
                                  key={c.value}
                                  onClick={() => setSelectedColor(c.value)}
                                  title={c.label}
                                  className="w-6 h-6 rounded-full transition-transform hover:scale-110 focus:outline-none"
                                  style={{
                                    background: c.value,
                                    boxShadow: selectedColor === c.value
                                      ? `0 0 0 2px white, 0 0 0 4px ${c.value}`
                                      : 'none',
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Emoji grid */}
                        <div className="grid grid-cols-10 gap-1">
                          {EMOJI_OPTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => setSelectedEmoji(emoji)}
                              className={[
                                'h-9 rounded-lg text-xl flex items-center justify-center transition-all',
                                selectedEmoji === emoji
                                  ? 'bg-blue-50 dark:bg-blue-500/15 ring-2 ring-blue-400 scale-105'
                                  : 'hover:bg-gray-100 dark:hover:bg-white/5',
                              ].join(' ')}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Agent Name */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          Agent Name
                        </label>
                        <input
                          type="text"
                          value={agentName}
                          onChange={(e) => setAgentName(e.target.value)}
                          placeholder="e.g. Nova, Max, Aria…"
                          maxLength={40}
                          className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                        />
                      </div>

                      {/* Voice */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          Voice
                        </label>
                        <VoicePicker
                          voices={voices}
                          value={voiceId}
                          onValueChange={setVoiceId}
                          placeholder="Pick a voice…"
                        />
                      </div>

                      {/* Inline error */}
                      {error && (
                        <p className="text-xs text-red-500 font-medium -mt-1">{error}</p>
                      )}

                      {/* Submit */}
                      <button
                        onClick={handleSubmit}
                        disabled={modalState === 'saving'}
                        className="w-full h-11 rounded-xl bg-gradient-to-r from-brand-blue to-brand-sky text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
                      >
                        {modalState === 'saving' ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Launching…
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Launch My Agent
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── SUCCESS STATE ── */}
                {modalState === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="p-8 flex flex-col items-center text-center"
                  >
                    <motion.div
                      initial={{ scale: 0.4, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.05 }}
                      className="mb-5"
                    >
                      <AgentAvatar
                        avatar={selectedEmoji}
                        color={selectedColor}
                        name={agentName || 'Agent'}
                        size="lg"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {agentName || 'Your agent'} is live.
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-7">
                        The next call that comes in — your agent has it. Every lead responded to, instantly.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="w-full space-y-3"
                    >
                      <button
                        onClick={handleClose}
                        className="w-full h-11 rounded-xl bg-gradient-to-r from-brand-blue to-brand-sky text-white font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-md"
                      >
                        Open Dashboard
                      </button>
                      <a
                        href="/dashboard/agents"
                        className="block text-sm text-brand-blue hover:underline"
                        onClick={handleClose}
                      >
                        Set up Lead Reactivation →
                      </a>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SetupCompletionPopup;
