import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Clock, Shield, Phone, Lock, ArrowRight,
  Zap, Award,
  PhoneCall, RefreshCw, CheckCircle2, CheckCircle,
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
  const [step, setStep] = useState<'email' | 'options' | 'ai-calling-form' | 'calling' | 'ai-calling' | 'submit' | 'result'>('email');
  const [phone, setPhone] = useState('');
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


    const bcScript = document.createElement('script');
    bcScript.type = 'application/ld+json';
    bcScript.id = 'breadcrumb-jsonld';
    bcScript.text = JSON.stringify({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://boltcall.org"}, {"@type": "ListItem", "position": 2, "name": "Challenge", "item": "https://boltcall.org/challenge"}]});
    document.head.appendChild(bcScript);

    const personScript = document.createElement('script');
    personScript.type = 'application/ld+json';
    personScript.id = 'person-schema';
    personScript.text = JSON.stringify({"@context": "https://schema.org", "@type": "Person", "name": "Boltcall Team", "url": "https://boltcall.org/about", "worksFor": {"@type": "Organization", "name": "Boltcall", "url": "https://boltcall.org"}});
    document.head.appendChild(personScript);
    return () => {
      document.getElementById('person-schema')?.remove();
      document.getElementById('breadcrumb-jsonld')?.remove();
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
    setStep('options');
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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.15 }}
            >
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl overflow-hidden shadow-[0_35px_60px_-12px_rgba(0,0,0,0.6)]">

                {/* ── Left: dark info panel ───────────────────────────── */}
                <div className="bg-gray-900 text-white p-10 md:p-12 flex flex-col justify-between">
                  <div>
                    <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-400 rounded-full -ml-[8px]">
                      Weekly Challenge
                    </span>
                    <h2 className="mt-3 text-2xl md:text-3xl font-extrabold text-white leading-tight">
                      <span className="text-white">Crack the Code.</span>
                      <br />
                      <span className="text-blue-500">Win $2,500.</span>
                    </h2>

                    <p className="mt-6 text-white/80 text-sm leading-6">
                      Our AI receptionist guards a secret code. Extract it in 60 seconds using any social engineering technique.
                    </p>

                    <ul className="mt-6 space-y-3 text-white/90 text-sm">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-blue-500 flex-shrink-0" strokeWidth={2.5} />
                        <span>60 seconds per call — any technique allowed</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-blue-500 flex-shrink-0" strokeWidth={2.5} />
                        <span>Social engineering, persuasion, prompt hacking</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-blue-500 flex-shrink-0" strokeWidth={2.5} />
                        <span>New secret code every Monday</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-blue-500 flex-shrink-0" strokeWidth={2.5} />
                        <span>One winner per week — prize resets too</span>
                      </li>
                    </ul>

                    {/* Prize box */}
                    <div className="mt-8 bg-gray-800 rounded-xl p-4 border border-gray-700">
                      <div className="flex items-center gap-3">
                        <Trophy className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <div>
                          <p className="text-white font-bold text-sm">Crack It → Free Professional Website</p>
                          <p className="text-gray-400 text-xs mt-0.5">$2,500 value · Set up by our team</p>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    {allTimeStats && (
                      <div className="mt-6 flex items-center gap-6">
                        <div>
                          <p className="text-2xl font-bold text-white">{allTimeStats.totalAttempts.toLocaleString()}</p>
                          <p className="text-xs text-gray-400 uppercase tracking-wider">Attempts</p>
                        </div>
                        <div className="h-8 w-px bg-gray-700" />
                        <div>
                          <p className="text-2xl font-bold text-blue-400">{allTimeStats.aiDefenseRate}%</p>
                          <p className="text-xs text-gray-400 uppercase tracking-wider">AI Wins</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Right: interactive steps panel ─────────────────── */}
                <div className="bg-gradient-to-b from-brand-blue to-brand-sky text-white p-10 md:p-12">
                  <AnimatePresence mode="wait">

                    {/* Step 1: Email */}
                    {step === 'email' && (
                      <motion.div
                        key="email"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        className="flex flex-col justify-center h-full"
                      >
                        <p className="text-xs uppercase tracking-widest text-white/70 mb-2">Step 1 of 2</p>
                        <h3 className="text-2xl font-extrabold text-white mb-2">Enter your email</h3>
                        <p className="text-white/80 text-sm mb-8">
                          We'll notify you if you win and send your prize details.
                        </p>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!email.trim()) return;
                            setStep('options');
                          }}
                          className="space-y-4"
                        >
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            autoFocus
                            className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                          />
                          <button
                            type="submit"
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-brand-blue font-bold rounded-md hover:bg-gray-50 transition-colors"
                          >
                            Unlock the Challenge
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </form>
                        <p className="text-xs text-white/50 mt-6">No spam. Just prize notifications.</p>
                      </motion.div>
                    )}

                    {/* Step 2: Call options */}
                    {step === 'options' && (
                      <motion.div
                        key="options"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        className="flex flex-col justify-center h-full"
                      >
                        <p className="text-xs uppercase tracking-widest text-white/70 mb-2">Step 2 of 2</p>
                        <h3 className="text-2xl font-extrabold text-white mb-2">How do you want to call?</h3>
                        <p className="text-white/80 text-sm mb-8">
                          Pick your method — you have 60 seconds once connected.
                        </p>

                        {/* Option A: I'll call the AI */}
                        <a
                          href={`tel:${CHALLENGE_PHONE_NUMBER}`}
                          onClick={handleStartCall}
                          className="w-full flex items-center gap-4 p-4 bg-white/10 border border-white/30 rounded-xl hover:bg-white/20 transition-colors mb-3"
                        >
                          <div className="w-10 h-10 bg-white/20 rounded-lg grid place-items-center flex-shrink-0">
                            <Phone className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-left flex-1">
                            <p className="text-white font-bold text-sm">I'll call the AI</p>
                            <p className="text-white/70 text-xs">{CHALLENGE_PHONE_DISPLAY}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-white/60 flex-shrink-0" />
                        </a>

                        {/* Option B: AI calls me */}
                        <button
                          onClick={() => setStep('ai-calling-form')}
                          className="w-full flex items-center gap-4 p-4 bg-white/10 border border-white/30 rounded-xl hover:bg-white/20 transition-colors"
                        >
                          <div className="w-10 h-10 bg-white/20 rounded-lg grid place-items-center flex-shrink-0">
                            <PhoneCall className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-left flex-1">
                            <p className="text-white font-bold text-sm">Have the AI call me</p>
                            <p className="text-white/70 text-xs">We'll call you within 30 seconds</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-white/60 flex-shrink-0" />
                        </button>

                        <button
                          onClick={() => setStep('submit')}
                          className="mt-6 w-full text-center text-white/60 hover:text-white text-sm transition-colors"
                        >
                          Already have the code? Submit it here
                        </button>
                      </motion.div>
                    )}

                    {/* Step 2b: AI calls me — enter phone */}
                    {step === 'ai-calling-form' && (
                      <motion.div
                        key="ai-calling-form"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        className="flex flex-col justify-center h-full"
                      >
                        <h3 className="text-2xl font-extrabold text-white mb-2">We'll call you</h3>
                        <p className="text-white/80 text-sm mb-8">
                          Enter your number and we'll connect you to the AI within 30 seconds.
                        </p>
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            if (!phone.trim()) return;
                            try {
                              await fetch(`${API_BASE}/call-me`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ email: email.trim(), phone: phone.trim() }),
                              });
                            } catch { /* silent */ }
                            setStep('ai-calling');
                          }}
                          className="space-y-4"
                        >
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 555 000 0000"
                            required
                            autoFocus
                            className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                          />
                          <button
                            type="submit"
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-brand-blue font-bold rounded-md hover:bg-gray-50 transition-colors"
                          >
                            Call Me Now
                            <PhoneCall className="w-4 h-4" />
                          </button>
                        </form>
                        <button
                          onClick={() => setStep('options')}
                          className="mt-4 w-full text-center text-white/60 hover:text-white text-sm transition-colors"
                        >
                          Go back
                        </button>
                      </motion.div>
                    )}

                    {/* Step 3: Active call timer (user called AI) */}
                    {step === 'calling' && (
                      <motion.div
                        key="calling"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center text-center h-full"
                      >
                        <div className="mb-6">
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 border border-white/30 rounded-full">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            <span className="text-white font-bold text-sm">CALL IN PROGRESS</span>
                          </div>
                        </div>

                        <div className="w-24 h-24 bg-white/20 border-2 border-white/40 rounded-full grid place-items-center mb-4">
                          <Phone className="w-10 h-10 text-white" />
                        </div>

                        <p className="text-5xl font-mono font-bold text-white mb-2">{formatTimer(callTimer)}</p>
                        <p className="text-white/70 text-sm mb-8">
                          {callTimer < 60 ? 'Try to extract the code...' : 'Time is up. Did you get it?'}
                        </p>

                        <button
                          onClick={handleEndCall}
                          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-brand-blue font-bold rounded-md hover:bg-gray-50 transition-colors mb-3"
                        >
                          I'm Done — Submit My Code
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleReset}
                          className="text-white/60 hover:text-white text-sm transition-colors"
                        >
                          Cancel
                        </button>
                      </motion.div>
                    )}

                    {/* Step 3b: AI is calling the user */}
                    {step === 'ai-calling' && (
                      <motion.div
                        key="ai-calling"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center text-center h-full"
                      >
                        <div className="w-20 h-20 bg-white/20 border-2 border-white/40 rounded-full grid place-items-center mb-6">
                          <PhoneCall className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Calling you now...</h3>
                        <p className="text-white/80 text-sm mb-8 max-w-xs">
                          Pick up — you have 60 seconds to extract the secret code from our AI receptionist.
                        </p>
                        <button
                          onClick={handleEndCall}
                          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-brand-blue font-bold rounded-md hover:bg-gray-50 transition-colors mb-3"
                        >
                          I Got the Code — Submit It
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleReset}
                          className="text-white/60 hover:text-white text-sm transition-colors"
                        >
                          Cancel
                        </button>
                      </motion.div>
                    )}

                    {/* Step 4: Submit code */}
                    {step === 'submit' && (
                      <motion.div
                        key="submit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col justify-center h-full"
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-white/20 border border-white/30 rounded-lg grid place-items-center">
                            <Lock className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-white">Submit Your Code</h3>
                        </div>

                        {callTimer > 0 && (
                          <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 mb-6 inline-flex items-center gap-2">
                            <Clock className="w-4 h-4 text-white/70" />
                            <span className="text-white/90 text-sm">Call duration: {formatTimer(callTimer)}</span>
                          </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div>
                            <label className="text-white/70 text-xs font-bold uppercase tracking-wider">Your Name *</label>
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Your name"
                              className="mt-1 w-full px-4 py-3 bg-white/10 border border-white/30 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                              required
                            />
                          </div>

                          <div>
                            <label className="text-white/70 text-xs font-bold uppercase tracking-wider">Secret Code *</label>
                            <input
                              type="text"
                              value={code}
                              onChange={(e) => setCode(e.target.value)}
                              placeholder="Enter the code you extracted..."
                              className="mt-1 w-full px-4 py-3 bg-white/10 border border-white/30 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm font-mono tracking-widest uppercase"
                              autoFocus
                              required
                            />
                          </div>

                          <div>
                            <label className="text-white/70 text-xs font-bold uppercase tracking-wider">Technique used?</label>
                            <input
                              type="text"
                              value={technique}
                              onChange={(e) => setTechnique(e.target.value)}
                              placeholder="e.g. impersonated tech support..."
                              className="mt-1 w-full px-4 py-3 bg-white/10 border border-white/30 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                            />
                          </div>

                          {error && <p className="text-red-200 text-sm">{error}</p>}

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full inline-flex items-center justify-center px-6 py-3 bg-white text-brand-blue font-bold rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? 'Checking...' : 'Submit Code'}
                          </button>

                          <button
                            type="button"
                            onClick={handleReset}
                            className="w-full text-center text-white/60 hover:text-white text-sm transition-colors"
                          >
                            Go back
                          </button>
                        </form>
                      </motion.div>
                    )}

                    {/* Step 5: Result */}
                    {step === 'result' && result && (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center text-center h-full"
                      >
                        {result.winner ? (
                          <>
                            <div className="w-20 h-20 bg-white/20 border-2 border-white/40 rounded-full grid place-items-center mb-6">
                              <Trophy className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-2">You Cracked It!</h3>
                            <p className="text-white/80 mb-6">{result.message}</p>
                            <div className="bg-white/10 border border-white/30 rounded-xl p-6 mb-6 w-full">
                              <Award className="w-8 h-8 text-white mx-auto mb-2" />
                              <p className="text-white font-bold text-lg">Free Professional Website</p>
                              <p className="text-white/70 text-sm mt-1">$2,500 value. We'll reach out within 24 hours.</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-20 h-20 bg-white/20 border-2 border-white/40 rounded-full grid place-items-center mb-6">
                              <Shield className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-2">AI Held Strong</h3>
                            <p className="text-white/80 mb-2">{result.message}</p>
                            {result.attempts && (
                              <p className="text-white/60 text-sm mb-6">Your attempts this week: {result.attempts}</p>
                            )}
                            <div className="bg-white/10 border border-white/30 rounded-xl p-6 mb-6 w-full">
                              <p className="text-white font-bold">Imagine this protecting YOUR business.</p>
                              <p className="text-white/70 text-sm mt-1">Same AI. Your business name. Set up in 5 minutes.</p>
                            </div>
                          </>
                        )}

                        <div className="flex flex-col gap-3 w-full">
                          <Link
                            to="/free-website"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-brand-blue font-semibold rounded-md hover:bg-gray-50 transition-colors"
                          >
                            Get Your Free Website
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={handleReset}
                            className="inline-flex items-center justify-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Try Again
                          </button>
                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>

              </div>
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
                  title: 'Protect Every Business Call',
                  desc: 'Win a $2,500 website by breaking our AI — or prove to yourself that it will shield your business from manipulation and information leaks 24/7.',
                },
                {
                  icon: Phone,
                  title: 'Never Lose a Lead to a Bad Call',
                  desc: 'No matter how difficult the caller, your business stays professional and on-script — so you capture every lead without lifting a finger.',
                },
                {
                  icon: Zap,
                  title: 'Answer Every Call, Win Every Opportunity',
                  desc: 'Stop missing revenue after hours. Every call answered in under 1 second — weekends, holidays, and overnight — so no opportunity slips through.',
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

      {/* Social Proof */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Trusted by Local Business Owners</h2>
        <p className="text-gray-500 text-center mb-8 text-sm">Join 500+ businesses using Boltcall to capture more leads and grow revenue.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { quote: "Boltcall paid for itself in the first week. We stopped losing calls after hours and our bookings jumped 40%.", name: "Marcus T.", role: "HVAC Owner, Texas" },
            { quote: "I was skeptical about AI, but it just works. Our front desk handles 30% fewer interruptions now.", name: "Priya S.", role: "Dental Practice Manager, California" },
            { quote: "We were losing 15-20 calls a week to voicemail. Boltcall captures every single one now.", name: "James R.", role: "Plumbing Business Owner, Florida" },
          ].map((item) => (
            <div key={item.name} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <p className="text-gray-700 text-sm leading-relaxed mb-4">"{item.quote}"</p>
              <div>
                <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-gray-50 border-t border-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>100% Free — no credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>Used by 500+ local businesses</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>Results in 30 days or your money back</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>Your data is never sold or shared</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefit-focused section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Why This Matters for Your Business</h2>
          <p className="text-gray-500 text-center mb-6 text-sm">See exactly how Boltcall protects your leads — and why it works.</p>
          <ul className="space-y-3 max-w-xl mx-auto">
            {[
              "Capture every lead 24/7 — without lifting a finger — while competitors send callers to voicemail",
              "Never miss a revenue opportunity with AI that answers calls even on nights and weekends",
              "Protect your business from caller manipulation with security-first AI training",
              "See the AI in action before you commit — no credit card, no risk",
              "Discover how Boltcall turns every caller into a qualified lead automatically",
            ].map((benefit, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mt-0.5 text-xs font-bold">✓</span>
                <span className="text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Challenge;
