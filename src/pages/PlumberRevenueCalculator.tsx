import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Droplets,
  Phone,
  PhoneOff,
  Clock,
  DollarSign,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Wrench,
  Zap,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Send,
  ShieldCheck,
  Users,
  Target,
} from 'lucide-react';
import { updateMetaDescription } from '../lib/utils';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FinalCTA, { CALCULATOR_CTA } from '../components/FinalCTA';
import GiveawayBar from '../components/GiveawayBar';

const fmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const fmtPct = (v: number) => `${Math.round(v).toLocaleString()}%`;

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.5 },
};

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  icon?: React.ReactNode;
}

const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
  icon,
}) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-300 flex items-center gap-2">
          {icon}
          {label}
        </span>
        <span className="text-sm font-semibold text-white tabular-nums">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${pct}%, #334155 ${pct}%, #334155 100%)`,
        }}
      />
    </div>
  );
};

interface CardSectionProps {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const CardSection: React.FC<CardSectionProps> = ({
  title,
  icon,
  defaultOpen = true,
  children,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <motion.div
      {...fadeUp}
      className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-colors duration-300"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        {open ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </motion.div>
  );
};

const PlumberRevenueCalculator: React.FC = () => {
  // Card 1: Emergency Call Volume
  const [avgJobValue, setAvgJobValue] = useState(1200);
  const [afterHoursCallsPerWeek, setAfterHoursCallsPerWeek] = useState(5);
  const [weekendCallsPerMonth, setWeekendCallsPerMonth] = useState(6);

  // Card 2: Response Reality
  const [voicemailPct, setVoicemailPct] = useState(65);
  const [avgReturnTime, setAvgReturnTime] = useState(3);
  const [callerLeavePct, setCallerLeavePct] = useState(78);

  // Card 3: Business Operations
  const [monthlyMarketingSpend, setMonthlyMarketingSpend] = useState(2000);
  const [customerAcquisitionCost, setCustomerAcquisitionCost] = useState(185);
  const [repeatCustomerRate, setRepeatCustomerRate] = useState(20);

  // Email capture
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Plumber Revenue Calculator — How Much Are You Losing? | Boltcall';
    updateMetaDescription(
      'Free calculator for plumbing businesses: see how much revenue you lose from missed after-hours emergency calls. Get a personalized revenue recovery report.'
    );
  }, []);

  const calc = useMemo(() => {
    const totalAfterHoursCallsMonth = afterHoursCallsPerWeek * 4.33 + weekendCallsPerMonth;
    const missedCallsMonth = totalAfterHoursCallsMonth * (voicemailPct / 100);
    const lostJobsMonth = missedCallsMonth * (callerLeavePct / 100);
    const emergencyRevenueLost = lostJobsMonth * avgJobValue;

    // Repeat customer lifetime value lost
    const repeatValueLost = lostJobsMonth * (repeatCustomerRate / 100) * avgJobValue * 2;

    // Marketing waste: cost to re-acquire those lost customers
    const marketingWaste = lostJobsMonth * customerAcquisitionCost;

    const monthlyLoss = emergencyRevenueLost + repeatValueLost * 0.25 + marketingWaste;
    const annualLoss = monthlyLoss * 12;

    // AI recovery (90% answer rate)
    const aiAnswerRate = 0.9;
    const recoveredCalls = missedCallsMonth * aiAnswerRate;
    const recoveredJobs = recoveredCalls * (callerLeavePct / 100) * 0.85; // 85% conversion when answered
    const recoveredRevenue = recoveredJobs * avgJobValue;
    const boltcallCost = 179;
    const netGain = recoveredRevenue - boltcallCost;
    const roi = boltcallCost > 0 ? ((netGain) / boltcallCost) * 100 : 0;
    const paybackDays = recoveredRevenue > 0 ? Math.ceil((boltcallCost / recoveredRevenue) * 30) : 999;

    // Bar chart data
    const barMax = Math.max(emergencyRevenueLost, repeatValueLost * 0.25, marketingWaste, 1);

    return {
      totalAfterHoursCallsMonth: Math.round(totalAfterHoursCallsMonth),
      missedCallsMonth: Math.round(missedCallsMonth),
      lostJobsMonth: Math.round(lostJobsMonth * 10) / 10,
      emergencyRevenueLost,
      repeatValueLost: repeatValueLost * 0.25,
      marketingWaste,
      monthlyLoss,
      annualLoss,
      recoveredRevenue,
      netGain,
      roi,
      paybackDays,
      barMax,
    };
  }, [
    avgJobValue,
    afterHoursCallsPerWeek,
    weekendCallsPerMonth,
    voicemailPct,
    avgReturnTime,
    callerLeavePct,
    monthlyMarketingSpend,
    customerAcquisitionCost,
    repeatCustomerRate,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setFormStatus('sending');
    try {
      await fetch('https://n8n.srv974118.hstgr.cloud/webhook/niche-lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          business_name: businessName,
          niche: 'plumber',
          source: 'burst-pipe-calculator',
          metrics: {
            monthly_loss: Math.round(calc.monthlyLoss),
            annual_loss: Math.round(calc.annualLoss),
            missed_calls: calc.missedCallsMonth,
            lost_jobs: Math.round(calc.lostJobsMonth),
            roi: Math.round(calc.roi),
          },
        }),
      });
      setFormStatus('success');
    } catch {
      setFormStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-[Poppins]">
      <GiveawayBar />
      <Header />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-slate-950 to-slate-950" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div {...fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              <Droplets className="w-4 h-4" />
              Free Tool for Plumbing Businesses
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            How Much Revenue Are You Losing to{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Missed Emergency Calls?
            </span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            A burst pipe at 2am. A water heater failure on Sunday. Your phone rings&nbsp;&mdash; but
            nobody answers. Calculate exactly how much that costs your plumbing business.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-sm sm:text-base"
          >
            <Phone className="w-5 h-5 text-blue-400 shrink-0" />
            <span>
              <strong className="text-white">72%</strong> of emergency callers hire the first
              plumber who answers
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── About This Calculator ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
        <motion.div
          {...fadeUp}
          className="bg-slate-900/80 border border-blue-500/20 rounded-2xl p-6 sm:p-8 space-y-4 text-slate-300 leading-relaxed"
        >
          <h2 className="text-xl font-bold text-white">About This Calculator</h2>
          <p>
            The Plumber Revenue Calculator quantifies the dollar cost of missed emergency calls for plumbing businesses. It accounts for three compounding losses: the direct revenue from the job that went to a competitor, the repeat customer lifetime value that evaporates when a caller books elsewhere and never returns, and the marketing spend wasted generating a lead that was then lost to voicemail. Most plumbing companies dramatically underestimate the third category.
          </p>
          <p>
            Enter your average emergency call job value, how many after-hours and weekend calls you receive, what percentage go to voicemail, and how quickly callers move on to call another plumber. The results panel updates in real time to show your total monthly and annual revenue loss. The "Recovery with AI" section then models what happens when 90% of those missed calls are answered immediately — and calculates the net monthly gain after the cost of an AI receptionist.
          </p>
          <p>
            Use the default values as a starting point if you don't track these numbers precisely. The defaults reflect national averages from plumbing industry research, so the output will give you a reasonable estimate of your potential losses. Adjust the sliders to reflect your specific market — rural operations often see lower call volume but higher per-job values, while urban plumbers may see the opposite. After running your numbers, enter your email to receive a personalized revenue recovery report.
          </p>
        </motion.div>
      </section>

      {/* ── Calculator ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* LEFT — Inputs (3/5) */}
          <div className="lg:col-span-3 space-y-6">
            <CardSection
              title="Emergency Call Volume"
              icon={<Phone className="w-5 h-5" />}
              defaultOpen={true}
            >
              <Slider
                label="Average emergency call job value"
                value={avgJobValue}
                min={500}
                max={3000}
                step={50}
                onChange={setAvgJobValue}
                format={(v) => fmt.format(v)}
                icon={<DollarSign className="w-4 h-4 text-blue-400" />}
              />
              <Slider
                label="After-hours calls per week"
                value={afterHoursCallsPerWeek}
                min={1}
                max={20}
                onChange={setAfterHoursCallsPerWeek}
                icon={<Clock className="w-4 h-4 text-blue-400" />}
              />
              <Slider
                label="Weekend / holiday calls per month"
                value={weekendCallsPerMonth}
                min={2}
                max={15}
                onChange={setWeekendCallsPerMonth}
                icon={<AlertTriangle className="w-4 h-4 text-blue-400" />}
              />
            </CardSection>

            <CardSection
              title="Your Response Reality"
              icon={<PhoneOff className="w-5 h-5" />}
              defaultOpen={true}
            >
              <Slider
                label="% of after-hours calls going to voicemail"
                value={voicemailPct}
                min={0}
                max={100}
                onChange={setVoicemailPct}
                format={(v) => `${v}%`}
                icon={<PhoneOff className="w-4 h-4 text-blue-400" />}
              />
              <Slider
                label="Average time to return missed calls (hours)"
                value={avgReturnTime}
                min={0.5}
                max={12}
                step={0.5}
                onChange={setAvgReturnTime}
                format={(v) => `${v}h`}
                icon={<Clock className="w-4 h-4 text-blue-400" />}
              />
              <Slider
                label="% of callers who call another plumber while waiting"
                value={callerLeavePct}
                min={30}
                max={95}
                onChange={setCallerLeavePct}
                format={(v) => `${v}%`}
                icon={<TrendingDown className="w-4 h-4 text-blue-400" />}
              />
            </CardSection>

            <CardSection
              title="Business Operations"
              icon={<BarChart3 className="w-5 h-5" />}
              defaultOpen={true}
            >
              <Slider
                label="Monthly marketing spend"
                value={monthlyMarketingSpend}
                min={500}
                max={10000}
                step={100}
                onChange={setMonthlyMarketingSpend}
                format={(v) => fmt.format(v)}
                icon={<Target className="w-4 h-4 text-blue-400" />}
              />
              <Slider
                label="Average cost to acquire one customer"
                value={customerAcquisitionCost}
                min={50}
                max={500}
                step={5}
                onChange={setCustomerAcquisitionCost}
                format={(v) => fmt.format(v)}
                icon={<DollarSign className="w-4 h-4 text-blue-400" />}
              />
              <Slider
                label="Repeat customer rate"
                value={repeatCustomerRate}
                min={5}
                max={50}
                onChange={setRepeatCustomerRate}
                format={(v) => `${v}%`}
                icon={<Users className="w-4 h-4 text-blue-400" />}
              />
            </CardSection>
          </div>

          {/* RIGHT — Results Dashboard (2/5, sticky) */}
          <div className="lg:col-span-2 lg:sticky lg:top-24">
            <motion.div
              {...fadeUp}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6"
            >
              {/* Hero number */}
              <div className="text-center">
                <p className="text-sm text-slate-400 uppercase tracking-wider mb-1">
                  You&rsquo;re Losing
                </p>
                <p className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent tabular-nums">
                  {fmt.format(Math.round(calc.monthlyLoss))}
                  <span className="text-xl font-medium text-slate-400">/mo</span>
                </p>
                <p className="text-slate-400 mt-1">
                  <span className="text-white font-semibold">{fmt.format(Math.round(calc.annualLoss))}</span>{' '}
                  per year
                </p>
              </div>

              <div className="h-px bg-slate-800" />

              {/* Metric cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: 'Missed Calls / mo',
                    value: calc.missedCallsMonth.toString(),
                    icon: <PhoneOff className="w-4 h-4" />,
                    color: 'text-red-400',
                  },
                  {
                    label: 'Lost Jobs / mo',
                    value: Math.round(calc.lostJobsMonth).toString(),
                    icon: <TrendingDown className="w-4 h-4" />,
                    color: 'text-orange-400',
                  },
                  {
                    label: 'Revenue Leaked / mo',
                    value: fmt.format(Math.round(calc.emergencyRevenueLost)),
                    icon: <DollarSign className="w-4 h-4" />,
                    color: 'text-red-400',
                  },
                  {
                    label: 'Marketing Wasted',
                    value: fmt.format(Math.round(calc.marketingWaste)),
                    icon: <Target className="w-4 h-4" />,
                    color: 'text-amber-400',
                  },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50"
                  >
                    <div className={`flex items-center gap-1.5 mb-1 ${m.color}`}>
                      {m.icon}
                      <span className="text-[11px] uppercase tracking-wider text-slate-400">
                        {m.label}
                      </span>
                    </div>
                    <p className={`text-lg font-bold ${m.color} tabular-nums`}>{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Bar breakdown */}
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-wider text-slate-500">Loss Breakdown</p>
                {[
                  {
                    label: 'Emergency Revenue Lost',
                    value: calc.emergencyRevenueLost,
                    color: 'bg-red-500',
                  },
                  {
                    label: 'Repeat Customer Value Lost',
                    value: calc.repeatValueLost,
                    color: 'bg-orange-500',
                  },
                  {
                    label: 'Marketing Waste',
                    value: calc.marketingWaste,
                    color: 'bg-amber-500',
                  },
                ].map((bar) => {
                  const w = Math.max(4, (bar.value / calc.barMax) * 100);
                  return (
                    <div key={bar.label}>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>{bar.label}</span>
                        <span className="text-white tabular-nums">
                          {fmt.format(Math.round(bar.value))}
                        </span>
                      </div>
                      <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${bar.color} rounded-full transition-all duration-500`}
                          style={{ width: `${w}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="h-px bg-slate-800" />

              {/* AI Recovery */}
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-blue-400 mb-1">
                  <Zap className="w-5 h-5" />
                  <p className="text-sm font-semibold">Recovery with AI Receptionist</p>
                </div>
                <p className="text-xs text-slate-400">
                  If 90% of those calls were answered by AI&hellip;
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] text-slate-500 uppercase">Revenue Recovered</p>
                    <p className="text-lg font-bold text-green-400 tabular-nums">
                      {fmt.format(Math.round(calc.recoveredRevenue))}
                      <span className="text-xs text-slate-500">/mo</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 uppercase">Net Gain (after $179)</p>
                    <p className="text-lg font-bold text-green-400 tabular-nums">
                      {fmt.format(Math.round(calc.netGain))}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 uppercase">ROI</p>
                    <p className="text-lg font-bold text-green-400 tabular-nums">
                      {fmtPct(calc.roi)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 uppercase">Payback Period</p>
                    <p className="text-lg font-bold text-green-400 tabular-nums">
                      {calc.paybackDays} days
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Email Capture ── */}
      <section className="bg-slate-900/50 border-y border-slate-800 py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Get Your Free Plumbing Business Revenue Report
            </h2>
            <p className="text-slate-400 text-lg mb-6">
              We&rsquo;ll send you a detailed PDF with:
            </p>
            <ul className="inline-grid sm:grid-cols-2 gap-x-8 gap-y-3 text-left text-slate-300">
              {[
                'Personalized loss breakdown',
                'After-hours optimization guide',
                'AI receptionist comparison for plumbers',
                '90-day action plan',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.form
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4"
          >
            {formStatus === 'success' ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle className="w-14 h-14 text-green-400 mx-auto" />
                <p className="text-xl font-semibold text-white">Check your inbox!</p>
                <p className="text-slate-400">Your report is on the way.</p>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="John Smith"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="john@smithplumbing.com"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">
                    Business Name{' '}
                    <span className="text-slate-600">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Smith Plumbing & HVAC"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors"
                >
                  <Send className="w-5 h-5" />
                  {formStatus === 'sending' ? 'Sending...' : 'Send My Free Report'}
                </button>
                {formStatus === 'error' && (
                  <p className="text-red-400 text-sm text-center">
                    Something went wrong. Please try again.
                  </p>
                )}
              </>
            )}
          </motion.form>
        </div>
      </section>

      {/* ── Social Proof ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
        <motion.h2
          {...fadeUp}
          className="text-3xl sm:text-4xl font-bold text-white text-center mb-12"
        >
          What Other Plumbing Companies Are Doing
        </motion.h2>

        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              stat: '73%',
              description: 'of plumbing emergencies happen outside business hours',
              icon: <Clock className="w-6 h-6" />,
            },
            {
              stat: '$4,200',
              description: 'average monthly revenue plumbers lose to missed calls',
              icon: <DollarSign className="w-6 h-6" />,
            },
            {
              stat: '78%',
              description: 'of the time, the first plumber to answer wins the job',
              icon: <TrendingUp className="w-6 h-6" />,
            },
          ].map((card, i) => (
            <motion.div
              key={card.stat}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center hover:border-blue-500/30 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mx-auto mb-4">
                {card.icon}
              </div>
              <p className="text-4xl font-bold text-white mb-2">{card.stat}</p>
              <p className="text-slate-400 text-sm">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Value Content ── */}
      <section className="bg-slate-900/30 border-y border-slate-800 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.h2
            {...fadeUp}
            className="text-3xl sm:text-4xl font-bold text-white text-center mb-4"
          >
            3 Ways to Stop Losing Emergency Revenue
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-slate-400 text-center mb-12 max-w-2xl mx-auto"
          >
            Proven strategies plumbing companies use to capture every dollar from after-hours calls.
          </motion.p>

          <div className="space-y-8">
            {[
              {
                number: '01',
                title: 'Capture 90% of Emergency Calls — Increase Monthly Revenue by $12,869',
                icon: <Phone className="w-6 h-6" />,
                description:
                  'AI answers every emergency call instantly — day, night, weekends, and holidays. It collects the caller\'s name, address, and problem details, then dispatches your on-call technician in seconds. Stop losing $12,869/month to competitors who simply pick up the phone.',
              },
              {
                number: '02',
                title: 'Be First in 60 Seconds — Before Homeowners Call Your Competitor',
                icon: <Zap className="w-6 h-6" />,
                description:
                  'When a pipe bursts at 2am, homeowners call every plumber they can find. An automated response within 60 seconds puts you first in line — locking in the job before competitors even see the missed call notification.',
              },
              {
                number: '03',
                title: 'Turn a $1,200 Repair Into a $3,600/Year Customer',
                icon: <Wrench className="w-6 h-6" />,
                description:
                  'Automated follow-up sequences send a check-in 30 days after service, offer seasonal maintenance plans, and request Google reviews — tripling the lifetime value of every emergency call you capture.',
              },
            ].map((tip, i) => (
              <motion.div
                key={tip.number}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-5 sm:gap-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 hover:border-blue-500/30 transition-colors duration-300"
              >
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    {tip.icon}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-blue-500 font-bold text-sm">{tip.number}</span>
                    <h3 className="text-xl font-semibold text-white">{tip.title}</h3>
                  </div>
                  <p className="text-slate-400 leading-relaxed">{tip.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Soft CTA ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 lg:py-24 text-center">
        <motion.div {...fadeUp}>
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mx-auto mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Stop Losing{' '}
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              {fmt.format(Math.round(calc.monthlyLoss))}
            </span>{' '}
            Every Month?
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            See how Boltcall&rsquo;s AI receptionist handles emergency plumbing calls — qualifying
            the issue, collecting details, and dispatching your team in seconds.
          </p>
          <a
            href="/features/ai-receptionist"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg"
          >
            See It In Action
            <TrendingUp className="w-5 h-5" />
          </a>
          <p className="text-slate-500 text-sm mt-4">
            Starting at $99/month &bull; No contracts &bull; Set up in 24 hours
          </p>
        </motion.div>
      </section>

      <FinalCTA {...CALCULATOR_CTA} />
      <Footer />
    </div>
  );
};

export default PlumberRevenueCalculator;
