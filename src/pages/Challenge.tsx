import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Clock, Shield, Phone, Lock, ArrowRight,
  Users, Flame, Target, Zap, ChevronDown, Award,
  PhoneCall, MessageSquare, RefreshCw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { updateMetaDescription } from '../lib/utils';

// ── Types ──────────────────────────────────────────────────────────────────
interface LeaderboardEntry {
  name: string;
  attempts: number;
  won: boolean;
  lastAttempt: string;
}

interface LeaderboardData {
  week: string;
  leaderboard: LeaderboardEntry[];
  stats: {
    totalAttempts: number;
    totalWins: number;
    uniquePlayers: number;
    winRate: string;
  };
}

// ── Config ─────────────────────────────────────────────────────────────────
// Replace with your actual Retell challenge agent phone number
const CHALLENGE_PHONE_NUMBER = '+441234567890';
const CHALLENGE_PHONE_DISPLAY = '+44 123 456 7890';
const API_BASE = '/.netlify/functions/break-my-ai';

// ── Component ──────────────────────────────────────────────────────────────
const Challenge: React.FC = () => {
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [technique, setTechnique] = useState('');
  const [callDuration, setCallDuration] = useState('');

  // UI state
  const [step, setStep] = useState<'rules' | 'calling' | 'submit' | 'result'>('rules');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ winner: boolean; message: string; attempts?: number } | null>(null);
  const [error, setError] = useState('');

  // Leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(true);

  // All-time stats
  const [allTimeStats, setAllTimeStats] = useState<{
    totalAttempts: number;
    aiDefenseRate: string;
  } | null>(null);

  // Timer for call phase
  const [callTimer, setCallTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    document.title = 'Break My AI Challenge | Boltcall';
    updateMetaDescription(
      'Can you trick our AI receptionist into revealing a secret code? Call now and test the most unbreakable AI in the game. Win a free website if you crack it.'
    );
    fetchLeaderboard();
    fetchStats();
  }, []);

  // Call timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerActive) {
      interval = setInterval(() => setCallTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/leaderboard`);
      if (res.ok) setLeaderboard(await res.json());
    } catch { /* silent */ }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      if (res.ok) setAllTimeStats(await res.json());
    } catch { /* silent */ }
  }, []);

  const handleStartCall = () => {
    setStep('calling');
    setCallTimer(0);
    setTimerActive(true);
  };

  const handleEndCall = () => {
    setTimerActive(false);
    setCallDuration(String(callTimer));
    setStep('submit');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      setError('Enter your name and the code you extracted.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          code: code.trim(),
          callDuration: callDuration ? parseInt(callDuration) : callTimer || null,
          technique: technique.trim(),
        }),
      });

      const data = await res.json();
      setResult(data);
      setStep('result');
      fetchLeaderboard();
      fetchStats();
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep('rules');
    setCode('');
    setTechnique('');
    setCallDuration('');
    setCallTimer(0);
    setResult(null);
    setError('');
  };

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="w-full py-6">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <Link to="/">
            <img src="/boltcall_full_logo.png" alt="Boltcall" className="h-10 w-auto brightness-0 invert" />
          </Link>
          <a
            href={`tel:${CHALLENGE_PHONE_NUMBER}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Phone className="w-4 h-4" />
            Call Now
          </a>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="pt-12 pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/15 border border-yellow-500/30 rounded-full mb-6">
              <Flame className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-bold text-sm tracking-wide">WEEKLY CHALLENGE</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
              Break My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">AI</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Our AI receptionist is guarding a secret code. You have <strong className="text-white">60 seconds</strong> on
              the phone to make her reveal it. Social engineering, persuasion, prompt
              hacking... anything goes.
            </p>
          </motion.div>

          {/* Live stats bar */}
          {allTimeStats && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-6 md:gap-10 mt-8"
            >
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-white">{allTimeStats.totalAttempts.toLocaleString()}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Attempts</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-green-400">{allTimeStats.aiDefenseRate}%</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">AI Defense Rate</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-yellow-400">
                  {leaderboard?.stats.uniquePlayers || 0}
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">This Week</p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Main Challenge Card ─────────────────────────────────────────── */}
      <section className="px-4 pb-12">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/[0.06] backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {/* ── Step 1: Rules ───────────────────────────────────────── */}
              {step === 'rules' && (
                <motion.div
                  key="rules"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 md:p-10"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg grid place-items-center">
                      <Target className="w-5 h-5 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">How It Works</h2>
                  </div>

                  <ol className="space-y-4 mb-8">
                    {[
                      { icon: PhoneCall, text: 'Call our AI receptionist at the number below' },
                      { icon: MessageSquare, text: 'You have 60 seconds to make her reveal the secret code' },
                      { icon: Lock, text: 'Come back here and enter the code to claim your prize' },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500/10 border border-blue-500/20 rounded-lg grid place-items-center">
                          <item.icon className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <span className="text-gray-400 text-xs font-bold uppercase">Step {i + 1}</span>
                          <p className="text-white text-sm mt-0.5">{item.text}</p>
                        </div>
                      </li>
                    ))}
                  </ol>

                  {/* Prizes */}
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                      <Trophy className="w-5 h-5 text-yellow-400 mb-2" />
                      <p className="text-yellow-400 font-bold text-sm">Crack the code</p>
                      <p className="text-white text-xs mt-1">Free Professional Website ($2,500 value)</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                      <Shield className="w-5 h-5 text-blue-400 mb-2" />
                      <p className="text-blue-400 font-bold text-sm">Can't crack it?</p>
                      <p className="text-white text-xs mt-1">Proof our AI will protect YOUR business too</p>
                    </div>
                  </div>

                  {/* Rules */}
                  <div className="bg-white/[0.03] border border-white/5 rounded-lg p-4 mb-8">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Ground Rules</p>
                    <ul className="space-y-1.5 text-gray-400 text-xs">
                      <li>- 60-second time limit per call</li>
                      <li>- Any social engineering technique is fair game</li>
                      <li>- New secret code every Monday</li>
                      <li>- One prize per winner per week</li>
                      <li>- The AI will try to book you a demo after each attempt</li>
                    </ul>
                  </div>

                  {/* Phone CTA */}
                  <div className="text-center">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Call this number</p>
                    <a
                      href={`tel:${CHALLENGE_PHONE_NUMBER}`}
                      onClick={handleStartCall}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5"
                    >
                      <Phone className="w-5 h-5" />
                      {CHALLENGE_PHONE_DISPLAY}
                    </a>
                    <p className="text-gray-600 text-xs mt-3">Tap to call and start the timer</p>
                  </div>

                  {/* Already have a code? */}
                  <button
                    onClick={() => setStep('submit')}
                    className="mt-6 w-full text-center text-gray-500 hover:text-gray-300 text-sm transition-colors"
                  >
                    Already have the code? Submit it here
                  </button>
                </motion.div>
              )}

              {/* ── Step 2: Active Call ─────────────────────────────────── */}
              {step === 'calling' && (
                <motion.div
                  key="calling"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 md:p-10 text-center"
                >
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full animate-pulse">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-green-400 font-bold text-sm">CALL IN PROGRESS</span>
                    </div>
                  </div>

                  <div className="w-24 h-24 mx-auto bg-blue-500/20 border-2 border-blue-500/40 rounded-full grid place-items-center mb-4">
                    <Phone className="w-10 h-10 text-blue-400 animate-bounce" />
                  </div>

                  <p className="text-5xl font-mono font-bold text-white mb-2">{formatTimer(callTimer)}</p>
                  <p className="text-gray-500 text-sm mb-8">
                    {callTimer < 60 ? 'Try to extract the code...' : 'Time is up. Did you get it?'}
                  </p>

                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={handleEndCall}
                      variant="primary"
                      size="lg"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      I'm Done — Submit My Code
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <button
                      onClick={handleReset}
                      className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── Step 3: Submit Code ─────────────────────────────────── */}
              {step === 'submit' && (
                <motion.div
                  key="submit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 md:p-10"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-lg grid place-items-center">
                      <Lock className="w-5 h-5 text-yellow-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Submit Your Code</h2>
                  </div>

                  {callTimer > 0 && (
                    <div className="bg-white/[0.03] border border-white/5 rounded-lg px-4 py-2 mb-6 inline-flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400 text-sm">Call duration: {formatTimer(callTimer)}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-500 text-xs font-bold uppercase tracking-wider">Name *</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name"
                          className="mt-1 w-full px-4 py-3 bg-white/[0.06] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-gray-500 text-xs font-bold uppercase tracking-wider">Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="For prize claims"
                          className="mt-1 w-full px-4 py-3 bg-white/[0.06] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-500 text-xs font-bold uppercase tracking-wider">Secret Code *</label>
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter the code you extracted..."
                        className="mt-1 w-full px-4 py-3 bg-white/[0.06] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono tracking-widest uppercase"
                        autoFocus
                        required
                      />
                    </div>

                    <div>
                      <label className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                        What technique did you try?
                      </label>
                      <input
                        type="text"
                        value={technique}
                        onChange={(e) => setTechnique(e.target.value)}
                        placeholder="e.g. pretended to be tech support, asked to spell it..."
                        className="mt-1 w-full px-4 py-3 bg-white/[0.06] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>

                    {error && (
                      <p className="text-red-400 text-sm">{error}</p>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Checking...' : 'Submit Code'}
                    </Button>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full text-center text-gray-500 hover:text-gray-300 text-sm transition-colors"
                    >
                      Go back
                    </button>
                  </form>
                </motion.div>
              )}

              {/* ── Step 4: Result ──────────────────────────────────────── */}
              {step === 'result' && result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 md:p-10 text-center"
                >
                  {result.winner ? (
                    <>
                      <div className="w-20 h-20 mx-auto bg-yellow-500/20 rounded-full grid place-items-center mb-6">
                        <Trophy className="w-10 h-10 text-yellow-400" />
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-2">You Cracked It!</h2>
                      <p className="text-gray-400 mb-6">
                        {result.message}
                      </p>
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 mb-6">
                        <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                        <p className="text-yellow-400 font-bold text-lg">Free Professional Website</p>
                        <p className="text-gray-400 text-sm mt-1">$2,500 value. We'll reach out within 24 hours.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 mx-auto bg-blue-500/20 rounded-full grid place-items-center mb-6">
                        <Shield className="w-10 h-10 text-blue-400" />
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-2">AI Held Strong</h2>
                      <p className="text-gray-400 mb-2">{result.message}</p>
                      {result.attempts && (
                        <p className="text-gray-600 text-sm mb-6">
                          Your attempts this week: {result.attempts}
                        </p>
                      )}
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-6">
                        <p className="text-blue-400 font-bold">Imagine this protecting YOUR business.</p>
                        <p className="text-gray-400 text-sm mt-1">
                          Same AI. Your business name. Your knowledge base. Set up in 5 minutes.
                        </p>
                      </div>
                    </>
                  )}

                  <div className="flex flex-col gap-3">
                    <Link
                      to="/free-website"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Get Your Free Website
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={handleReset}
                      className="inline-flex items-center justify-center gap-2 text-gray-500 hover:text-gray-300 text-sm transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Try Again
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── Leaderboard ─────────────────────────────────────────────────── */}
      <section className="px-4 pb-12">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className="w-full flex items-center justify-between px-6 py-4 bg-white/[0.04] hover:bg-white/[0.06] border border-white/10 rounded-t-2xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-white font-bold">
                This Week's Leaderboard
                {leaderboard && (
                  <span className="text-gray-500 font-normal text-sm ml-2">
                    ({leaderboard.stats.uniquePlayers} players)
                  </span>
                )}
              </span>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform ${showLeaderboard ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {showLeaderboard && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-white/[0.03] border border-t-0 border-white/10 rounded-b-2xl"
              >
                {leaderboard && leaderboard.leaderboard.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {leaderboard.leaderboard.map((entry, i) => (
                      <div
                        key={entry.name + i}
                        className="flex items-center justify-between px-6 py-3 hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`
                            w-6 h-6 rounded-full grid place-items-center text-xs font-bold
                            ${i === 0 ? 'bg-yellow-500/20 text-yellow-400' : ''}
                            ${i === 1 ? 'bg-gray-400/20 text-gray-400' : ''}
                            ${i === 2 ? 'bg-orange-500/20 text-orange-400' : ''}
                            ${i > 2 ? 'bg-white/5 text-gray-600' : ''}
                          `}>
                            {i + 1}
                          </span>
                          <span className="text-white text-sm font-medium">{entry.name}</span>
                          {entry.won && (
                            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-[10px] font-bold uppercase rounded-full">
                              Cracked
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{entry.attempts} attempt{entry.attempts !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-10 text-center">
                    <Zap className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">No attempts this week yet. Be the first.</p>
                  </div>
                )}

                {/* Week stats footer */}
                {leaderboard && (
                  <div className="px-6 py-3 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                    <span className="text-gray-600 text-xs">
                      Week {leaderboard.week}
                    </span>
                    <span className="text-gray-600 text-xs">
                      {leaderboard.stats.totalAttempts} total attempts
                      {leaderboard.stats.totalWins > 0 && (
                        <> — {leaderboard.stats.totalWins} winner{leaderboard.stats.totalWins !== 1 ? 's' : ''}</>
                      )}
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── What This Proves ────────────────────────────────────────────── */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            What This Challenge Proves
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: Shield,
                title: 'Unbreakable Protocols',
                desc: 'Our AI never leaks sensitive information, no matter how creative the caller gets.',
              },
              {
                icon: Phone,
                title: 'Handles Anything',
                desc: 'Aggressive callers, social engineers, confused customers... your AI stays professional.',
              },
              {
                icon: Zap,
                title: 'Always On',
                desc: '24/7/365. No sick days. No bad moods. No hold times. Every call answered in under 1 second.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-6"
              >
                <item.icon className="w-7 h-7 text-blue-400 mb-3" />
                <h3 className="text-white font-bold mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <p className="text-gray-700 text-xs">
            2026 Boltcall. New challenge code every Monday.
          </p>
          <Link to="/" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
            boltcall.org
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Challenge;
