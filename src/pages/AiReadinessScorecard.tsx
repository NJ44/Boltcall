// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Mail,
  User,
  Loader2,
  Zap,
  Phone,
  MessageSquare,
  Clock,
  Star,
  BarChart3,
  TrendingUp,
  Shield,
  Target,
  ChevronRight,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';

// ── Quiz questions ──────────────────────────────────────────────────────────
const questions = [
  {
    id: 1,
    text: 'Do you miss customer calls regularly (evenings, weekends, lunch)?',
    icon: Phone,
  },
  {
    id: 2,
    text: 'Does your business have a website that captures leads?',
    icon: Target,
  },
  {
    id: 3,
    text: 'Do you respond to new leads within 5 minutes?',
    icon: Clock,
  },
  {
    id: 4,
    text: 'Do you have automated appointment booking?',
    icon: Zap,
  },
  {
    id: 5,
    text: 'Do you send follow-up messages to leads who don\'t book?',
    icon: MessageSquare,
  },
  {
    id: 6,
    text: 'Do you automatically request Google reviews from customers?',
    icon: Star,
  },
  {
    id: 7,
    text: 'Can customers reach you via chat on your website?',
    icon: MessageSquare,
  },
  {
    id: 8,
    text: 'Do you have automated appointment reminders (SMS/email)?',
    icon: Clock,
  },
  {
    id: 9,
    text: 'Do you track where your leads come from?',
    icon: BarChart3,
  },
  {
    id: 10,
    text: 'Are you spending more than $2,000/month on a receptionist or answering service?',
    icon: TrendingUp,
  },
];

// ── Answer options ──────────────────────────────────────────────────────────
const answerOptions = [
  { label: 'Yes', value: 3 },
  { label: 'Somewhat', value: 1 },
  { label: 'No', value: 0 },
];

// ── Score ranges ────────────────────────────────────────────────────────────
const getScoreData = (score: number) => {
  if (score <= 10) {
    return {
      label: 'Not Ready',
      color: '#EF4444',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-600',
      ringColor: 'stroke-red-500',
      icon: XCircle,
      description:
        'Your business is missing critical AI automation opportunities. You\'re likely losing significant revenue to missed calls, slow response times, and manual processes.',
    };
  }
  if (score <= 20) {
    return {
      label: 'Getting There',
      color: '#F59E0B',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-600',
      ringColor: 'stroke-amber-500',
      icon: AlertTriangle,
      description:
        'You have some systems in place, but there are still major gaps costing you customers. A few key automations could dramatically improve your results.',
    };
  }
  return {
    label: 'AI Ready',
    color: '#10B981',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-600',
    ringColor: 'stroke-emerald-500',
    icon: CheckCircle,
    description:
      'Great job! Your business has strong foundations. AI can help you optimize what you already have and unlock the next level of growth.',
  };
};

// ── Recommendations by score range ──────────────────────────────────────────
const getRecommendations = (score: number) => {
  if (score <= 10) {
    return [
      {
        title: 'Set Up an AI Receptionist',
        description:
          'Stop missing calls after hours, during lunch, and on weekends. An AI receptionist answers 100% of calls, books appointments, and captures every lead — 24/7.',
        icon: Phone,
      },
      {
        title: 'Add Speed-to-Lead Automation',
        description:
          'Respond to new inquiries in under 60 seconds with automated SMS and email. Businesses that respond within 5 minutes are 391% more likely to convert.',
        icon: Zap,
      },
      {
        title: 'Automate Your Follow-Ups',
        description:
          'Most leads need 5-7 touchpoints before booking. Set up automated follow-up sequences so no lead falls through the cracks.',
        icon: MessageSquare,
      },
    ];
  }
  if (score <= 20) {
    return [
      {
        title: 'Close the After-Hours Gap',
        description:
          'You\'re handling business hours well, but 62% of calls happen outside 9-5. An AI receptionist ensures you never miss a single opportunity.',
        icon: Clock,
      },
      {
        title: 'Automate Review Collection',
        description:
          'Turn happy customers into 5-star reviews automatically. Businesses with 50+ reviews get 266% more leads from Google.',
        icon: Star,
      },
      {
        title: 'Add a Website Chat Widget',
        description:
          'Capture website visitors who prefer texting over calling. A chat widget can increase conversions by 45% without any extra effort.',
        icon: MessageSquare,
      },
    ];
  }
  return [
    {
      title: 'Optimize Your AI Stack',
      description:
        'You\'re ahead of the curve. Fine-tune your automations with AI-powered lead scoring, smart routing, and predictive scheduling.',
      icon: TrendingUp,
    },
    {
      title: 'Scale with Data-Driven Decisions',
      description:
        'Use AI analytics to identify your highest-converting channels, optimize ad spend, and predict revenue with accuracy.',
      icon: BarChart3,
    },
    {
      title: 'Reduce Costs with Full Automation',
      description:
        'Replace manual receptionist tasks with AI to save $2,000-$4,000/month while providing faster, more consistent customer experiences.',
      icon: Shield,
    },
  ];
};

// ── Circular Score Component ────────────────────────────────────────────────
const CircularScore = ({ score, maxScore = 30 }: { score: number; maxScore?: number }) => {
  const scoreData = getScoreData(score);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / maxScore) * circumference;
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 300);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Progress circle */}
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={scoreData.color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - animatedProgress }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-5xl font-bold font-['Poppins']"
          style={{ color: scoreData.color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-sm text-gray-500 font-['Poppins']">out of {maxScore}</span>
      </div>
    </div>
  );
};

// ── Main Component ──────────────────────────────────────────────────────────
const AiReadinessScorecard: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const quizRef = useRef<HTMLDivElement>(null);

  const totalScore = answers.reduce((sum, val) => sum + val, 0);

  useEffect(() => {
    document.title = 'AI Readiness Scorecard — Is Your Business Ready? | Boltcall';
    updateMetaDescription(
      'Take the free 2-minute AI readiness quiz. Get a personalized score and action plan for your local business.'
    );

    let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = 'https://boltcall.org/ai-readiness-scorecard/';

    return () => {
      const el = document.querySelector("link[rel='canonical']");
      if (el) el.remove();
    };
  }, []);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setTimeout(() => {
      quizRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setDirection(1);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      // All questions answered — show email gate
      setTimeout(() => {
        setShowEmailGate(true);
      }, 300);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setDirection(-1);
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;

    setIsSubmitting(true);

    try {
      await fetch('https://n8n.srv974118.hstgr.cloud/webhook/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          source: 'ai-readiness-scorecard',
          score: totalScore,
          answers: answers,
        }),
      });
    } catch (err) {
      // Still show results even if webhook fails
      console.error('Webhook error:', err);
    }

    setIsSubmitting(false);
    setSubmitted(true);
    setShowEmailGate(false);
    setShowResults(true);
  };

  // ── Scroll reveal animation variants ─────────────────────────────────────
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  const scoreData = getScoreData(totalScore);
  const recommendations = getRecommendations(totalScore);

  return (
    <div className="min-h-screen bg-white font-['Poppins']">
      <GiveawayBar />
      <Header />

      {/* ─── Hero Section ─────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-white to-[#DDE2EE] pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl mx-auto"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 mb-6"
            >
              <Zap className="w-4 h-4 text-[#2563EB]" />
              <span className="text-sm font-medium text-[#2563EB]">Free 2-Minute Assessment</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0B1220] leading-tight mb-6"
            >
              Is Your Business{' '}
              <span className="text-[#2563EB]">Ready for AI?</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
            >
              Take the 2-minute AI Readiness Scorecard. Get a personalized score + action plan
              to stop losing customers and start growing with AI.
            </motion.p>

            {!quizStarted && !showResults && (
              <motion.div variants={fadeInUp}>
                <button
                  onClick={handleStartQuiz}
                  className="inline-flex items-center gap-2 bg-[#2563EB] text-white font-semibold text-lg px-8 py-4 rounded-lg border-2 border-[#0B1220] shadow-[4px_4px_0px_0px_#0B1220] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200"
                >
                  Start the Scorecard
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* Trust indicators */}
            <motion.div
              variants={fadeInUp}
              className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#2563EB]" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#2563EB]" />
                <span>Takes only 2 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#2563EB]" />
                <span>Instant results</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Quiz Section ─────────────────────────────────────────────── */}
      {quizStarted && !showEmailGate && !showResults && (
        <section ref={quizRef} className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              {/* Progress bar */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-500">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span className="text-sm font-medium text-[#2563EB]">
                    {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                  <motion.div
                    className="h-full bg-[#2563EB] rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                    }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>

              {/* Question card */}
              <div className="relative min-h-[320px]">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentQuestion}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className="bg-white border-2 border-[#0B1220] rounded-2xl p-8 md:p-10 shadow-[6px_6px_0px_0px_#0B1220]"
                  >
                    {/* Question icon */}
                    <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-6">
                      {React.createElement(questions[currentQuestion].icon, {
                        className: 'w-7 h-7 text-[#2563EB]',
                      })}
                    </div>

                    {/* Question text */}
                    <h2 className="text-xl md:text-2xl font-bold text-[#0B1220] mb-8 leading-snug">
                      {questions[currentQuestion].text}
                    </h2>

                    {/* Answer buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {answerOptions.map((option) => {
                        const isSelected = answers[currentQuestion] === option.value;
                        return (
                          <button
                            key={option.label}
                            onClick={() => handleAnswer(option.value)}
                            className={`flex-1 py-4 px-6 rounded-lg border-2 font-semibold text-base transition-all duration-200 ${
                              isSelected
                                ? 'bg-[#2563EB] text-white border-[#0B1220] shadow-[3px_3px_0px_0px_#0B1220] translate-x-0 translate-y-0'
                                : 'bg-white text-[#0B1220] border-[#0B1220] shadow-[3px_3px_0px_0px_#0B1220] hover:bg-blue-50 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none'
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Back button */}
                    {currentQuestion > 0 && (
                      <button
                        onClick={handleBack}
                        className="mt-6 inline-flex items-center gap-2 text-gray-500 hover:text-[#2563EB] transition-colors text-sm font-medium"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Previous question
                      </button>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Question dots */}
              <div className="flex items-center justify-center gap-2 mt-8">
                {questions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      idx === currentQuestion
                        ? 'bg-[#2563EB] scale-125'
                        : idx < answers.length && answers[idx] !== undefined
                        ? 'bg-[#2563EB]/40'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Email Gate Section ───────────────────────────────────────── */}
      {showEmailGate && !showResults && (
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-lg mx-auto"
            >
              <div className="bg-white border-2 border-[#0B1220] rounded-2xl p-8 md:p-10 shadow-[6px_6px_0px_0px_#0B1220] text-center">
                {/* Celebration icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-20 h-20 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-[#2563EB]" />
                </motion.div>

                <h2 className="text-2xl md:text-3xl font-bold text-[#0B1220] mb-3">
                  Your AI Readiness Score is Ready!
                </h2>
                <p className="text-gray-600 mb-8">
                  Enter your email to get your personalized score + action plan.
                </p>

                <form onSubmit={handleSubmitEmail} className="space-y-4">
                  {/* Name input */}
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                      className="w-full pl-12 pr-4 py-3.5 rounded-lg border-2 border-gray-200 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-[#0B1220] font-medium placeholder:text-gray-400"
                    />
                  </div>

                  {/* Email input */}
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full pl-12 pr-4 py-3.5 rounded-lg border-2 border-gray-200 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-[#0B1220] font-medium placeholder:text-gray-400"
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !email.trim() || !name.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-[#2563EB] text-white font-semibold text-lg px-8 py-4 rounded-lg border-2 border-[#0B1220] shadow-[4px_4px_0px_0px_#0B1220] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_#0B1220]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      <>
                        Get My Score
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                <p className="mt-4 text-xs text-gray-400">
                  No spam. Unsubscribe anytime.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── Results Section ──────────────────────────────────────────── */}
      {showResults && (
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Score Display */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-2xl mx-auto text-center mb-16"
            >
              <motion.div variants={fadeInUp} className="mb-6">
                <CircularScore score={totalScore} />
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-full ${scoreData.bgColor} ${scoreData.borderColor} border mb-4`}
              >
                {React.createElement(scoreData.icon, {
                  className: `w-5 h-5 ${scoreData.textColor}`,
                })}
                <span className={`font-bold text-lg ${scoreData.textColor}`}>
                  {scoreData.label}
                </span>
              </motion.div>

              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold text-[#0B1220] mb-4"
              >
                Your AI Readiness Score: {totalScore}/30
              </motion.h2>

              <motion.p variants={fadeInUp} className="text-gray-600 text-lg max-w-xl mx-auto">
                {scoreData.description}
              </motion.p>
            </motion.div>

            {/* Recommendation Cards */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
              className="max-w-4xl mx-auto mb-16"
            >
              <motion.h3
                variants={fadeInUp}
                className="text-2xl md:text-3xl font-bold text-[#0B1220] text-center mb-10"
              >
                Your Personalized Action Plan
              </motion.h3>

              <div className="grid md:grid-cols-3 gap-6">
                {recommendations.map((rec, idx) => (
                  <motion.div
                    key={idx}
                    variants={fadeInUp}
                    className="bg-white border-2 border-[#0B1220] rounded-2xl p-6 shadow-[4px_4px_0px_0px_#0B1220] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-4">
                      {React.createElement(rec.icon, {
                        className: 'w-6 h-6 text-[#2563EB]',
                      })}
                    </div>
                    <h4 className="text-lg font-bold text-[#0B1220] mb-2">{rec.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{rec.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeInUp}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] border-2 border-[#0B1220] rounded-2xl p-8 md:p-12 shadow-[6px_6px_0px_0px_#0B1220]">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Want Boltcall to Handle This for You?
                </h3>
                <p className="text-blue-100 mb-8 text-lg">
                  Get an AI receptionist, speed-to-lead automation, and review collection —
                  all set up in under 24 hours.
                </p>
                <a
                  href="/signup"
                  className="inline-flex items-center gap-2 bg-white text-[#2563EB] font-semibold text-lg px-8 py-4 rounded-lg border-2 border-[#0B1220] shadow-[4px_4px_0px_0px_#0B1220] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200"
                >
                  Get Started Free
                  <ChevronRight className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── Social Proof Section ─────────────────────────────────────── */}
      {(showResults || showEmailGate || quizStarted) && (
        <section className="py-16 md:py-20 bg-gradient-to-b from-white to-[#DDE2EE]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
              className="text-center"
            >
              <motion.p
                variants={fadeInUp}
                className="text-sm font-medium text-[#2563EB] uppercase tracking-wider mb-4"
              >
                The Numbers Don't Lie
              </motion.p>
              <motion.h3
                variants={fadeInUp}
                className="text-2xl md:text-3xl font-bold text-[#0B1220] mb-12"
              >
                2,000+ businesses have taken this assessment
              </motion.h3>

              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {[
                  {
                    stat: '62%',
                    label: 'of calls missed',
                    description: 'by small businesses happen outside business hours',
                    icon: Phone,
                  },
                  {
                    stat: '$50K',
                    label: 'lost to missed calls/year',
                    description: 'the average revenue lost by businesses without AI',
                    icon: TrendingUp,
                  },
                  {
                    stat: '391%',
                    label: 'higher conversion',
                    description: 'when you respond to leads within 1 minute',
                    icon: Zap,
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    variants={fadeInUp}
                    className="bg-white border-2 border-[#0B1220] rounded-2xl p-6 shadow-[4px_4px_0px_0px_#0B1220]"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto mb-4">
                      {React.createElement(item.icon, {
                        className: 'w-6 h-6 text-[#2563EB]',
                      })}
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-[#2563EB] mb-1">
                      {item.stat}
                    </div>
                    <div className="text-base font-semibold text-[#0B1220] mb-2">{item.label}</div>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default AiReadinessScorecard;
