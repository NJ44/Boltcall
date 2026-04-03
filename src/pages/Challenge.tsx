import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Clock, Shield, Phone, Lock, ArrowRight,
  Users, Zap, Award,
  PhoneCall, MessageSquare, RefreshCw, CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
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
const CHALLENGE_PHONE_NUMBER = '+441234567890';
const CHALLENGE_PHONE_DISPLAY = '+44 123 456 7890';
const API_BASE = '/.netlify/functions/break-our-ai';

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


  // All-time stats
  const [allTimeStats, setAllTimeStats] = useState<{
    totalAttempts: number;
    aiDefenseRate: string;
  } | null>(null);

  // Timer for call phase
  const [callTimer, setCallTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    document.title = 'Break Our AI Challenge: Can You Trick Our AI Receptionist? (2026) | Boltcall';
    updateMetaDescription(
      'Call our AI receptionist and try to extract the secret code in 60 seconds. Social engineering, persuasion, prompt hacking welcome. Win a free $2,500 website.'
    );

    // WebPage + Event schema
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Break Our AI Challenge",
      "description": "A weekly interactive challenge where callers try to trick Boltcall's AI receptionist into revealing a secret code. Tests AI security and social engineering resistance.",
      "url": "https://boltcall.org/challenge",
      "publisher": {
        "@type": "Organization",
        "name": "Boltcall",
        "url": "https://boltcall.org",
        "logo": {
          "@type": "ImageObject",
          "url": "https://boltcall.org/boltcall-logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://boltcall.org/challenge"
      }
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the Break Our AI Challenge?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Break Our AI Challenge is a weekly contest where you call Boltcall's AI receptionist and try to make it reveal a secret code within 60 seconds. You can use any social engineering technique, persuasion tactic, or prompt hacking method. If you extract the code, you win a free professional website worth $2,500."
          }
        },
        {
          "@type": "Question",
          "name": "How do I participate in the challenge?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Call the challenge phone number displayed on the page. You have 60 seconds to try to extract the secret code from the AI. Then return to the page and submit the code you got. If correct, you win."
          }
        },
        {
          "@type": "Question",
          "name": "What do I win if I crack the code?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Winners receive a free professional website valued at $2,500. One prize per winner per week. The secret code resets every Monday."
          }
        },
        {
          "@type": "Question",
          "name": "What techniques are allowed?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Any social engineering technique is fair game: persuasion, impersonation, prompt injection, confusion tactics, authority claims, and more. The only limit is the 60-second time window."
          }
        },
        {
          "@type": "Question",
          "name": "What does this challenge prove about AI receptionists?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The challenge demonstrates that Boltcall's AI receptionist can handle aggressive callers, social engineers, and manipulation attempts while staying professional. If hundreds of people cannot break it, it proves the AI is secure enough to protect your business calls 24/7."
          }
        }
      ]
    };

    const s1 = document.createElement('script');
    s1.id = 'challenge-schema';
    s1.type = 'application/ld+json';
    s1.text = JSON.stringify(schema);
    document.head.appendChild(s1);

    const s2 = document.createElement('script');
    s2.id = 'challenge-faq-schema';
    s2.type = 'application/ld+json';
    s2.text = JSON.stringify(faqSchema);
    document.head.appendChild(s2);

    fetchLeaderboard();
    fetchStats();

    return () => {
      document.getElementById('challenge-schema')?.remove();
      document.getElementById('challenge-faq-schema')?.remove();
    };
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
    <div className="bg-white min-h-screen">
      <Header />

      <main>
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <h1 className="text-3xl md:text-5xl font-bold text-[#0B1220] mb-4 leading-tight">
                  Break Our AI: Can You Trick Our Receptionist?
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Our AI receptionist guards a secret code. You have 60 seconds on the phone to extract it.
                  Social engineering, persuasion, prompt hacking... anything goes. Crack it and win a free $2,500 website.
                </p>
              </motion.div>

              {/* Live stats bar */}
              {allTimeStats && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center gap-6 md:gap-10 mt-10"
                >
                  <div className="text-center">
                    <p className="text-2xl md:text-3xl font-bold text-[#0B1220]">{allTimeStats.totalAttempts.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Attempts</p>
                  </div>
                  <div className="h-8 w-px bg-gray-200" />
                  <div className="text-center">
                    <p className="text-2xl md:text-3xl font-bold text-blue-600">{allTimeStats.aiDefenseRate}%</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">AI Defense Rate</p>
                  </div>
                  <div className="h-8 w-px bg-gray-200" />
                  <div className="text-center">
                    <p className="text-2xl md:text-3xl font-bold text-[#0B1220]">
                      {leaderboard?.stats.uniquePlayers || 0}
                    </p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">This Week</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* ── Main Challenge Card ─────────────────────────────────────── */}
        <section className="pb-16 lg:pb-24">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {/* ── Step 1: Rules ─────────────────────────────────────── */}
                {step === 'rules' && (
                  <motion.div
                    key="rules"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-8 md:p-10"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-lg grid place-items-center">
                        <Target className="w-5 h-5 text-blue-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-[#0B1220]">How It Works</h2>
                    </div>

                    <ol className="space-y-4 mb-8">
                      {[
                        { icon: PhoneCall, text: 'Call our AI receptionist at the number below' },
                        { icon: MessageSquare, text: 'You have 60 seconds to make her reveal the secret code' },
                        { icon: Lock, text: 'Come back here and enter the code to claim your prize' },
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-50 border border-blue-100 rounded-lg grid place-items-center">
                            <item.icon className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs font-bold uppercase">Step {i + 1}</span>
                            <p className="text-[#0B1220] text-sm mt-0.5">{item.text}</p>
                          </div>
                        </li>
                      ))}
                    </ol>

                    {/* Prizes */}
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <Trophy className="w-5 h-5 text-blue-600 mb-2" />
                        <p className="text-blue-600 font-bold text-sm">Crack the code</p>
                        <p className="text-gray-700 text-xs mt-1">Free Professional Website ($2,500 value)</p>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <Shield className="w-5 h-5 text-gray-600 mb-2" />
                        <p className="text-gray-900 font-bold text-sm">Can't crack it?</p>
                        <p className="text-gray-600 text-xs mt-1">Proof our AI will protect YOUR business too</p>
                      </div>
                    </div>

                    {/* Rules */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Ground Rules</p>
                      <ul className="space-y-1.5 text-gray-600 text-xs">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                          60-second time limit per call
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                          Any social engineering technique is fair game
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                          New secret code every Monday
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                          One prize per winner per week
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                          The AI will try to book you a demo after each attempt
                        </li>
                      </ul>
                    </div>

                    {/* Phone CTA */}
                    <div className="text-center">
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Call this number</p>
                      <a
                        href={`tel:${CHALLENGE_PHONE_NUMBER}`}
                        onClick={handleStartCall}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200"
                      >
                        <Phone className="w-5 h-5" />
                        {CHALLENGE_PHONE_DISPLAY}
                      </a>
                      <p className="text-gray-500 text-xs mt-3">Tap to call and start the timer</p>
                    </div>

                    <button
                      onClick={() => setStep('submit')}
                      className="mt-6 w-full text-center text-gray-500 hover:text-blue-600 text-sm transition-colors"
                    >
                      Already have the code? Submit it here
                    </button>
                  </motion.div>
                )}

                {/* ── Step 2: Active Call ───────────────────────────────── */}
                {step === 'calling' && (
                  <motion.div
                    key="calling"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-8 md:p-10 text-center"
                  >
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                        <span className="text-blue-600 font-bold text-sm">CALL IN PROGRESS</span>
                      </div>
                    </div>

                    <div className="w-24 h-24 mx-auto bg-blue-50 border-2 border-blue-200 rounded-full grid place-items-center mb-4">
                      <Phone className="w-10 h-10 text-blue-600" />
                    </div>

                    <p className="text-5xl font-mono font-bold text-[#0B1220] mb-2">{formatTimer(callTimer)}</p>
                    <p className="text-gray-500 text-sm mb-8">
                      {callTimer < 60 ? 'Try to extract the code...' : 'Time is up. Did you get it?'}
                    </p>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={handleEndCall}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200"
                      >
                        I'm Done — Submit My Code
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleReset}
                        className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── Step 3: Submit Code ───────────────────────────────── */}
                {step === 'submit' && (
                  <motion.div
                    key="submit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-8 md:p-10"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-lg grid place-items-center">
                        <Lock className="w-5 h-5 text-blue-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-[#0B1220]">Submit Your Code</h2>
                    </div>

                    {callTimer > 0 && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 mb-6 inline-flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600 text-sm">Call duration: {formatTimer(callTimer)}</span>
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
                            className="mt-1 w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-[#0B1220] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                            className="mt-1 w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-[#0B1220] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                          className="mt-1 w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-[#0B1220] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono tracking-widest uppercase"
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
                          className="mt-1 w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-[#0B1220] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>

                      {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Checking...' : 'Submit Code'}
                      </button>

                      <button
                        type="button"
                        onClick={handleReset}
                        className="w-full text-center text-gray-500 hover:text-gray-700 text-sm transition-colors"
                      >
                        Go back
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* ── Step 4: Result ────────────────────────────────────── */}
                {step === 'result' && result && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 md:p-10 text-center"
                  >
                    {result.winner ? (
                      <>
                        <div className="w-20 h-20 mx-auto bg-blue-50 border-2 border-blue-200 rounded-full grid place-items-center mb-6">
                          <Trophy className="w-10 h-10 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-[#0B1220] mb-2">You Cracked It!</h2>
                        <p className="text-gray-600 mb-6">
                          {result.message}
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                          <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                          <p className="text-blue-600 font-bold text-lg">Free Professional Website</p>
                          <p className="text-gray-600 text-sm mt-1">$2,500 value. We'll reach out within 24 hours.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-20 h-20 mx-auto bg-blue-50 border-2 border-blue-200 rounded-full grid place-items-center mb-6">
                          <Shield className="w-10 h-10 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-[#0B1220] mb-2">AI Held Strong</h2>
                        <p className="text-gray-600 mb-2">{result.message}</p>
                        {result.attempts && (
                          <p className="text-gray-500 text-sm mb-6">
                            Your attempts this week: {result.attempts}
                          </p>
                        )}
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
                          <p className="text-[#0B1220] font-bold">Imagine this protecting YOUR business.</p>
                          <p className="text-gray-600 text-sm mt-1">
                            Same AI. Your business name. Your knowledge base. Set up in 5 minutes.
                          </p>
                        </div>
                      </>
                    )}

                    <div className="flex flex-col gap-3">
                      <Link
                        to="/free-website"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200"
                      >
                        Get Your Free Website
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={handleReset}
                        className="inline-flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 text-sm transition-colors"
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


        {/* ── What This Challenge Proves ─────────────────────────────── */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-4xl font-bold text-[#0B1220] text-center mb-4">
                What Does This Challenge Prove About AI Receptionists?
              </h2>
              <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
                If hundreds of people using every trick in the book cannot break through,
                your business calls are in safe hands. Here is what our AI demonstrates every week.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  title: 'Unbreakable Protocols',
                  desc: 'Our AI never leaks sensitive information, no matter how creative the caller gets. It follows your rules, every time.',
                },
                {
                  icon: Phone,
                  title: 'Handles Any Caller',
                  desc: 'Aggressive callers, social engineers, confused customers... your AI stays professional and on-script without breaking.',
                },
                {
                  icon: Zap,
                  title: 'Always On, Always Ready',
                  desc: '24/7/365. No sick days. No bad moods. No hold times. Every call answered in under 1 second, including weekends and holidays.',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-lg grid place-items-center mb-4">
                    <item.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-[#0B1220] font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ Section ────────────────────────────────────────────── */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-4xl font-bold text-[#0B1220] text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: 'What is the Break Our AI Challenge?',
                  a: 'A weekly contest where you call our AI receptionist and try to extract a secret code within 60 seconds. Use any social engineering technique you like. If you crack it, you win a free professional website worth $2,500.',
                },
                {
                  q: 'How do I participate?',
                  a: 'Call the challenge phone number on this page. You have 60 seconds. Then come back here and submit whatever code you managed to extract. If it matches the secret code, you win.',
                },
                {
                  q: 'What techniques are allowed?',
                  a: 'Anything goes. Persuasion, impersonation, prompt injection, confusion tactics, authority claims, emotional manipulation. The only limit is the 60-second call window.',
                },
                {
                  q: 'What do I win?',
                  a: 'A free professional website valued at $2,500. One winner per week. The secret code resets every Monday, so you get a fresh chance each week.',
                },
                {
                  q: 'What if I cannot crack the code?',
                  a: 'That is the point. If you cannot break our AI, imagine what it can do protecting your business. The same AI handles calls, books appointments, and qualifies leads 24/7.',
                },
              ].map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <h3 className="text-lg font-semibold text-[#0B1220] mb-2">{faq.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ─────────────────────────────────────────────── */}
        <section className="py-16 lg:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-4xl font-bold text-[#0B1220] mb-4">
                Want This AI Answering Your Calls?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                The same AI that holds up against social engineers, prompt hackers, and hundreds of challengers every week
                can answer your business calls 24/7. Set up in 5 minutes.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/free-website"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200"
                >
                  Get Your Free Website
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200"
                >
                  See Pricing
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Challenge;
