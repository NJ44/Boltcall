import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { updateMetaDescription } from '../lib/utils';

interface Question {
  id: number;
  text: string;
  options: { label: string; score: number }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'How quickly do you typically respond to a new web form lead?',
    options: [
      { label: 'Under 5 minutes (automated or dedicated person)', score: 10 },
      { label: '5–30 minutes', score: 7 },
      { label: '30–60 minutes', score: 4 },
      { label: '1–4 hours', score: 2 },
      { label: '4+ hours or next day', score: 0 },
    ],
  },
  {
    id: 2,
    text: 'Do you respond to inbound leads outside of business hours?',
    options: [
      { label: 'Yes — automated system fires immediately', score: 10 },
      { label: 'Yes — someone checks and responds manually', score: 6 },
      { label: 'Sometimes — depends on who\'s on call', score: 3 },
      { label: 'No — wait until next business day', score: 0 },
    ],
  },
  {
    id: 3,
    text: 'When a new lead comes in, what is your first outreach method?',
    options: [
      { label: 'Immediate phone call + SMS simultaneously', score: 10 },
      { label: 'Phone call first', score: 7 },
      { label: 'SMS first', score: 7 },
      { label: 'Email first', score: 4 },
      { label: 'We wait for them to call us back', score: 0 },
    ],
  },
  {
    id: 4,
    text: 'If a prospect leaves a voicemail, how quickly do you call back?',
    options: [
      { label: 'Within 30 minutes', score: 10 },
      { label: 'Within 2 hours', score: 7 },
      { label: 'Same day, within 8 hours', score: 4 },
      { label: 'Next business day', score: 1 },
      { label: 'We often miss callbacks', score: 0 },
    ],
  },
  {
    id: 5,
    text: 'Do you have a CRM or system that instantly notifies you of new leads?',
    options: [
      { label: 'Yes — instant push notification or alert to the right person', score: 10 },
      { label: 'Yes — but there\'s a delay (email, daily digest)', score: 5 },
      { label: 'No — we check manually throughout the day', score: 2 },
      { label: 'No system in place', score: 0 },
    ],
  },
  {
    id: 6,
    text: 'How many follow-up attempts do you make before giving up on a lead?',
    options: [
      { label: '6+ touches with an automated follow-up sequence', score: 10 },
      { label: '4–5 touches over 1–2 weeks', score: 7 },
      { label: '2–3 touches', score: 4 },
      { label: '1 call and that\'s it', score: 1 },
    ],
  },
  {
    id: 7,
    text: 'When you miss a phone call from a lead, what happens?',
    options: [
      { label: 'Auto-SMS fires within 60 seconds', score: 10 },
      { label: 'Someone manually texts or calls back within 30 minutes', score: 7 },
      { label: 'We check missed calls at the end of the day', score: 3 },
      { label: 'Usually nothing until we notice', score: 0 },
    ],
  },
  {
    id: 8,
    text: 'Who is responsible for answering new inbound leads at your company?',
    options: [
      { label: 'Dedicated AI or receptionist — 24/7', score: 10 },
      { label: 'Dedicated sales person, business hours only', score: 7 },
      { label: 'Shared — whoever is available', score: 4 },
      { label: 'The owner handles it personally', score: 3 },
      { label: 'No clear owner', score: 0 },
    ],
  },
  {
    id: 9,
    text: 'What percentage of your leads do you estimate you never successfully reach?',
    options: [
      { label: 'Under 10%', score: 10 },
      { label: '10–20%', score: 7 },
      { label: '20–35%', score: 3 },
      { label: 'Over 35%', score: 0 },
    ],
  },
  {
    id: 10,
    text: 'How do you handle leads that come in after 6pm or on weekends?',
    options: [
      { label: 'AI or automation responds and qualifies immediately', score: 10 },
      { label: 'On-call person responds within the hour', score: 7 },
      { label: 'Auto-reply only ("we\'ll get back to you")', score: 3 },
      { label: 'They wait until the next business day', score: 0 },
    ],
  },
];

function getGrade(score: number): { grade: string; label: string; color: string; bg: string; border: string; description: string } {
  if (score >= 80) return {
    grade: 'A',
    label: 'Speed Leader',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    description: 'Your response speed is in the top 10% of the industry. You\'re winning leads your competitors don\'t even know they lost.',
  };
  if (score >= 60) return {
    grade: 'B',
    label: 'Faster Than Average',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    description: 'You\'re ahead of most solar installers, but there are specific gaps — likely after-hours or missed-call handling — costing you real revenue.',
  };
  if (score >= 40) return {
    grade: 'C',
    label: 'Room to Improve',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    description: 'You\'re responding, but not fast enough or consistently enough. Estimates suggest 20–30% of your leads are choosing a competitor who answered first.',
  };
  if (score >= 20) return {
    grade: 'D',
    label: 'High Risk',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    description: 'Significant leads are slipping through. Your slow or inconsistent response is likely costing you $50K–$200K+ annually depending on your volume.',
  };
  return {
    grade: 'F',
    label: 'Critical',
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-300',
    description: 'Major response gaps detected. Based on industry data, over 40% of your leads are likely going to a competitor who answered faster. Immediate fixes needed.',
  };
}

const SolarSpeedScoreQuiz: React.FC = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Solar Speed Score — How Fast Is Your Lead Response? | Boltcall';
    updateMetaDescription(
      'Take the 10-question Solar Speed Score quiz and see exactly where your lead response process breaks down — with an A–F grade and personalized fix plan.'
    );
  }, []);

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const maxScore = QUESTIONS.length * 10;
  const scorePercent = Math.round((totalScore / maxScore) * 100);
  const result = getGrade(scorePercent);
  const answered = Object.keys(answers).length;
  const progress = Math.round((answered / QUESTIONS.length) * 100);

  function handleAnswer(score: number) {
    const newAnswers = { ...answers, [currentQ]: score };
    setAnswers(newAnswers);
    if (currentQ < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(q => q + 1), 200);
    } else {
      setTimeout(() => setShowResults(true), 300);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    // In production: POST to lead capture endpoint / Supabase
  }

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 mb-6">
                Free Assessment — 2 Minutes
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-[#0B1220] mb-4">
                Your Solar Speed Score
              </h1>
              <p className="text-lg text-slate-600">
                10 questions. Get your A–F grade on lead response speed and see exactly where you're losing jobs to faster competitors.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Quiz or Results */}
        <section className="pb-16 lg:pb-24 bg-gray-50">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              {!showResults ? (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Progress */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">Question {currentQ + 1} of {QUESTIONS.length}</span>
                      <span className="text-sm font-medium text-blue-600">{progress}% complete</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-600 rounded-full"
                        animate={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  {/* Question card */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentQ}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8"
                    >
                      <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-4">
                        Question {currentQ + 1}
                      </p>
                      <h2 className="text-xl md:text-2xl font-semibold text-[#0B1220] mb-8">
                        {QUESTIONS[currentQ].text}
                      </h2>
                      <div className="space-y-3">
                        {QUESTIONS[currentQ].options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleAnswer(opt.score)}
                            className="w-full text-left px-5 py-4 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-sm text-gray-700 font-medium flex items-center justify-between group"
                          >
                            <span>{opt.label}</span>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 flex-shrink-0 ml-3" />
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Score card */}
                  <div className={`bg-white rounded-2xl border-2 shadow-lg p-8 mb-6 ${result.border}`}>
                    <div className="text-center mb-8">
                      <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-4 ${result.bg} ${result.border} mb-4`}>
                        <span className={`text-5xl font-bold ${result.color}`}>{result.grade}</span>
                      </div>
                      <h2 className="text-2xl font-bold text-[#0B1220] mb-1">
                        Speed Score: {scorePercent}/100
                      </h2>
                      <p className={`text-base font-semibold ${result.color}`}>{result.label}</p>
                    </div>

                    <div className={`rounded-xl p-5 ${result.bg} mb-6`}>
                      <p className="text-gray-700 text-sm leading-relaxed">{result.description}</p>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-2">
                      {QUESTIONS.map((q, i) => {
                        const score = answers[i] ?? 0;
                        const pct = (score / 10) * 100;
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <span className="text-xs text-gray-400 w-4 flex-shrink-0">{i + 1}</span>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${score >= 8 ? 'bg-emerald-400' : score >= 5 ? 'bg-blue-400' : score >= 3 ? 'bg-yellow-400' : 'bg-red-400'}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-500 w-8 text-right">{score}/10</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Lead capture or thank you */}
                  {!submitted ? (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-bold text-[#0B1220]">Get Your Full Industry Comparison</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-6">
                        Enter your email and we'll send the full 2026 Solar Speed-to-Lead Benchmark — including how your score compares to 500 installers in your state.
                      </p>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                          type="text"
                          placeholder="Your company name"
                          value={company}
                          onChange={e => setCompany(e.target.value)}
                          required
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        />
                        <input
                          type="email"
                          placeholder="Your email address"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-6 py-3 shadow-[4px_4px_0px_0px_#000] border-2 border-black hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200"
                        >
                          Send Me the Benchmark Report <ArrowRight className="w-4 h-4" />
                        </button>
                        <p className="text-xs text-center text-gray-400">No spam. Unsubscribe any time.</p>
                      </form>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center"
                    >
                      <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-[#0B1220] mb-2">You're on the list</h3>
                      <p className="text-sm text-gray-600 mb-6">
                        We'll send the full benchmark report to {email} when it's published. In the meantime:
                      </p>
                      <a
                        href="/solar-speed-playbook"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-6 py-3 shadow-[4px_4px_0px_0px_#000] border-2 border-black hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200"
                      >
                        Download the Solar Speed Playbook <ArrowRight className="w-4 h-4" />
                      </a>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-16" />
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Want to Go From Your Grade to an A?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Boltcall installs an 11-second AI response layer on your solar business — handles leads 24/7, books appointments, and never misses a callback.
            </p>
            <a
              href="/pricing"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-8 py-4 shadow-[4px_4px_0px_0px_#000] border-2 border-black hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200"
            >
              See How It Works <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SolarSpeedScoreQuiz;
