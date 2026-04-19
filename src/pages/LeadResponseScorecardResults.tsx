import React, { useState, useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, ArrowRight, TrendingUp, Phone, Clock, RefreshCw } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import type { ScorecardResults } from './LeadResponseScorecard';

const gradeColors: Record<string, string> = {
  A: 'text-green-600',
  B: 'text-blue-600',
  C: 'text-yellow-500',
  D: 'text-orange-500',
  F: 'text-red-600',
};

const gradeBg: Record<string, string> = {
  A: 'bg-green-50 border-green-200',
  B: 'bg-blue-50 border-blue-200',
  C: 'bg-yellow-50 border-yellow-200',
  D: 'bg-orange-50 border-orange-200',
  F: 'bg-red-50 border-red-200',
};

const gradeMessages: Record<string, { title: string; message: string }> = {
  A: {
    title: 'Best in Class',
    message: "Your lead response system is operating at peak performance. You're answering fast, following up with multiple channels, and likely winning the majority of leads you touch. There's still room to automate further and protect this grade as volume grows.",
  },
  B: {
    title: 'Above Average — But Gaps Exist',
    message: "You're performing better than most local service businesses, but there are 1–2 specific gaps costing you real deals every month. The good news: plugging them is straightforward. Focus on response speed and follow-up automation.",
  },
  C: {
    title: "Average — You're Losing to Faster Competitors",
    message: "Your current setup is inconsistent. You may be answering most calls but your response speed or follow-up cadence is leaving leads on the table. Businesses that respond within 5 minutes win 78% of jobs — you're likely not in that group.",
  },
  D: {
    title: 'Below Average — Significant Revenue Leaking',
    message: "There are major holes in your lead response system. Whether it's missed calls, slow response times, or no follow-up process — a meaningful chunk of the revenue you're generating in marketing is slipping away before conversion.",
  },
  F: {
    title: 'At Risk — Most Leads Going to Competitors',
    message: "Your lead response system has critical gaps. The majority of leads your business generates are likely being captured by faster-responding competitors. Speed-to-lead and call coverage are the two most urgent fixes.",
  },
};

const subScoreLabel = (score: number): string => {
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'F';
};

const answerRateDisplay: Record<string, string> = {
  under40: 'Under 40%',
  '40to55': '40–55%',
  '55to70': '55–70%',
  '70to85': '70–85%',
  over85: '85%+',
};

const responseTimeDisplay: Record<string, string> = {
  under5: 'Under 5 minutes',
  '5to15': '5–15 minutes',
  '15to60': '15–60 minutes',
  '1to4h': '1–4 hours',
  nextday: 'Next day or longer',
};

const ScoreBar: React.FC<{ score: number; label: string; color: string }> = ({ score, label, color }) => (
  <div>
    <div className="flex justify-between items-center mb-1.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className={`text-sm font-bold ${color}`}>{subScoreLabel(score)}</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <motion.div
        className={`h-2.5 rounded-full ${score >= 85 ? 'bg-green-500' : score >= 70 ? 'bg-blue-500' : score >= 55 ? 'bg-yellow-400' : score >= 40 ? 'bg-orange-400' : 'bg-red-500'}`}
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  </div>
);

const LeadResponseScorecardResults: React.FC = () => {
  const [results, setResults] = useState<ScorecardResults | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Your Lead Response Score | Boltcall';
    updateMetaDescription('Your personalized lead response scorecard — see your grade, revenue at risk, and what to fix first.');

    const stored = localStorage.getItem('leadResponseScorecardResults');
    if (!stored) {
      navigate('/lead-response-scorecard');
      return;
    }
    try {
      setResults(JSON.parse(stored));
    } catch {
      navigate('/lead-response-scorecard');
    }

    return () => {
      document.querySelector("link[rel='canonical']")?.remove();
    };
  }, [navigate]);

  if (!results) return null;

  const { overallGrade, answerRateScore, responseScore, recoveryScore, revenueAtRisk, inputs } = results;
  const gradeInfo = gradeMessages[overallGrade] ?? gradeMessages['C'];
  const isGoodGrade = overallGrade === 'A' || overallGrade === 'B';

  const formatCurrency = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero result */}
        <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {inputs.name && (
                <p className="text-gray-500 text-sm mb-4">Results for {inputs.name} — {inputs.industry}</p>
              )}

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                Your Lead Response Score
              </h1>

              {/* Overall grade card */}
              <div className={`rounded-2xl border-2 p-8 mb-8 text-center ${gradeBg[overallGrade]}`}>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Overall Grade</p>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                  className={`text-[100px] font-black leading-none mb-3 ${gradeColors[overallGrade]}`}
                >
                  {overallGrade}
                </motion.div>
                <p className="text-lg font-bold text-gray-800 mb-2">{gradeInfo.title}</p>
                <p className="text-sm text-gray-600 leading-relaxed max-w-lg mx-auto">{gradeInfo.message}</p>
              </div>

              {/* Revenue at risk */}
              <div className="bg-gray-900 text-white rounded-2xl p-6 mb-8">
                <div className="flex items-start gap-4">
                  <TrendingUp className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Estimated Revenue at Risk</p>
                    <p className="text-4xl font-black text-white mb-2">{formatCurrency(revenueAtRisk)}<span className="text-xl font-normal text-gray-400">/month</span></p>
                    <p className="text-sm text-gray-400">
                      Based on {inputs.monthlyLeads} leads/month, {answerRateDisplay[inputs.answerRate] ?? inputs.answerRate} answer rate, {responseTimeDisplay[inputs.responseTime] ?? inputs.responseTime} response time, and ${inputs.avgJobValue} average job value.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sub-scores */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-5">Score Breakdown</h2>
              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Answer Rate (40% of score)</span>
                  </div>
                  <ScoreBar score={answerRateScore} label={`You answer ${answerRateDisplay[inputs.answerRate] ?? ''} of leads`} color={gradeColors[subScoreLabel(answerRateScore)]} />
                  <p className="text-xs text-gray-400 mt-1.5">Industry top performers answer 85%+ of inbound calls</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Response Speed (40% of score)</span>
                  </div>
                  <ScoreBar score={responseScore} label={`Your response time: ${responseTimeDisplay[inputs.responseTime] ?? ''}`} color={gradeColors[subScoreLabel(responseScore)]} />
                  <p className="text-xs text-gray-400 mt-1.5">Benchmark: Under 5 minutes = 73% booking rate</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <RefreshCw className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Lead Recovery (20% of score)</span>
                  </div>
                  <ScoreBar score={recoveryScore} label={inputs.followUpMethods.includes('none') ? 'No follow-up system in place' : `Follow-up: ${inputs.followUpMethods.filter(m => m !== 'none').join(', ')}`} color={gradeColors[subScoreLabel(recoveryScore)]} />
                  <p className="text-xs text-gray-400 mt-1.5">Best-in-class: Phone + SMS + automated system</p>
                </div>
              </div>
            </motion.div>

            {/* What to fix */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {isGoodGrade ? 'Keep This Grade — Automate It' : 'What to Fix First'}
              </h2>
              <div className="space-y-3">
                {answerRateScore < 70 && (
                  <div className="flex gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Answer Rate: {answerRateDisplay[inputs.answerRate]}</p>
                      <p className="text-xs text-gray-600 mt-0.5">You're missing too many leads. An AI receptionist answers every call instantly, 24/7 — no voicemail, no missed leads.</p>
                    </div>
                  </div>
                )}
                {responseScore < 70 && (
                  <div className="flex gap-3 bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Response Speed: {responseTimeDisplay[inputs.responseTime]}</p>
                      <p className="text-xs text-gray-600 mt-0.5">You're losing 40–70% of bookings to competitors who respond faster. Speed-to-lead automation responds in under 60 seconds, every time.</p>
                    </div>
                  </div>
                )}
                {recoveryScore < 70 && (
                  <div className="flex gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Lead Recovery: Weak follow-up system</p>
                      <p className="text-xs text-gray-600 mt-0.5">Leads who don't book on first contact aren't lost — they're warm. An automated SMS + email follow-up sequence recovers 30–50% of them.</p>
                    </div>
                  </div>
                )}
                {isGoodGrade && (
                  <div className="flex gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Solid foundation — now automate it</p>
                      <p className="text-xs text-gray-600 mt-0.5">Your manual process is working, but it depends on your team. Automating it ensures your A-grade performance scales as volume grows — without adding headcount.</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="bg-blue-600 rounded-2xl p-8 text-center text-white mb-8"
            >
              <p className="text-sm font-semibold text-blue-200 mb-2">Ready to fix it?</p>
              <h3 className="text-2xl font-bold mb-3">
                {isGoodGrade
                  ? 'Automate Your A-Grade System with Boltcall'
                  : `Go from ${overallGrade} to A with Boltcall`}
              </h3>
              <p className="text-blue-100 text-sm mb-6 max-w-md mx-auto leading-relaxed">
                Boltcall answers every call in under 60 seconds, follows up automatically by SMS and email, and books appointments directly into your calendar — 24/7.
              </p>
              <a
                href="https://boltcall.org/book-a-call"
                className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-8 py-3 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-transform"
              >
                See How Boltcall Works
                <ArrowRight className="w-4 h-4" />
              </a>
              <p className="text-xs text-blue-200 mt-4">No commitment. 15-minute call. We'll show you exactly what to fix.</p>
            </motion.div>

            {/* Benchmark table */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Industry Benchmarks: Where Do You Stand?</h2>
              <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="text-left px-4 py-3 font-semibold">Metric</th>
                      <th className="text-left px-4 py-3 font-semibold">Industry Average</th>
                      <th className="text-left px-4 py-3 font-semibold">Your Score</th>
                      <th className="text-left px-4 py-3 font-semibold">Best in Class</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        metric: 'Call answer rate',
                        avg: '38%',
                        yours: answerRateDisplay[inputs.answerRate] ?? inputs.answerRate,
                        best: '85%+',
                      },
                      {
                        metric: 'Response time',
                        avg: '47 hours',
                        yours: responseTimeDisplay[inputs.responseTime] ?? inputs.responseTime,
                        best: 'Under 5 min',
                      },
                      {
                        metric: 'Booking rate',
                        avg: '23%',
                        yours: `~${Math.round(([{ k: 'under5', v: 73 }, { k: '5to15', v: 45 }, { k: '15to60', v: 20 }, { k: '1to4h', v: 10 }, { k: 'nextday', v: 4 }].find(x => x.k === inputs.responseTime)?.v ?? 20))}%`,
                        best: '73%',
                      },
                      {
                        metric: 'Lead recovery system',
                        avg: 'Manual/none',
                        yours: inputs.followUpMethods.includes('none') ? 'None' : inputs.followUpMethods.filter(m => m !== 'none').join(', '),
                        best: 'Automated multi-channel',
                      },
                    ].map((row, i) => (
                      <tr key={row.metric} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 font-medium text-gray-900">{row.metric}</td>
                        <td className="px-4 py-3 text-gray-600">{row.avg}</td>
                        <td className="px-4 py-3 font-semibold text-blue-700">{row.yours}</td>
                        <td className="px-4 py-3 text-green-700 font-semibold">{row.best}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Retake */}
            <div className="text-center">
              <button
                onClick={() => {
                  localStorage.removeItem('leadResponseScorecardResults');
                  navigate('/lead-response-scorecard');
                }}
                className="text-sm text-gray-400 hover:text-gray-600 underline"
              >
                Retake the scorecard
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LeadResponseScorecardResults;
