import React, { useState, useEffect, useMemo } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { motion } from 'framer-motion';
import {
  Armchair,
  TrendingDown,
  TrendingUp,
  Clock,
  Users,
  DollarSign,
  Bell,
  CalendarX,
  ShieldCheck,
  MessageSquare,
  Mail,

  CheckCircle,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  BarChart3,
  Zap,

  RefreshCcw,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FinalCTA, { CALCULATOR_CTA } from '../components/FinalCTA';
import GiveawayBar from '../components/GiveawayBar';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);


const DentistChairCalculator: React.FC = () => {
  // Card 1: Practice Revenue
  const [revenuePerVisit, setRevenuePerVisit] = useState(350);
  const [hygieneValue, setHygieneValue] = useState(175);
  const [appointmentsPerDay, setAppointmentsPerDay] = useState(18);
  const [workingDays, setWorkingDays] = useState(21);

  // Card 2: No-Show & Cancellation Reality
  const [noShowRate, setNoShowRate] = useState(15);
  const [sameDayCancelRate, setSameDayCancelRate] = useState(10);
  const [rescheduleRate, setRescheduleRate] = useState(30);
  const [daysUntilReschedule, setDaysUntilReschedule] = useState(30);

  // Card 3: Recovery Potential
  const [automatedReminders, setAutomatedReminders] = useState(true);
  const [currentMethod, setCurrentMethod] = useState('staff_calls');
  const [staffHoursWeek, setStaffHoursWeek] = useState(5);
  const [staffHourlyCost, setStaffHourlyCost] = useState(22);

  // Email capture
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPracticeName, setFormPracticeName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Empty Chair Cost Calculator for Dental Practices | Boltcall';
    updateMetaDescription(
      'Calculate how much revenue your dental practice loses to no-shows and late cancellations. Free empty chair cost calculator for dentists.'
    );
  }, []);

  const calc = useMemo(() => {
    const totalAppointmentsMonth = appointmentsPerDay * workingDays;

    // No-show losses
    const noShowsPerMonth = totalAppointmentsMonth * (noShowRate / 100);
    const noShowsRecoveredLater = noShowsPerMonth * (rescheduleRate / 100);
    const noShowsTrulyLost = noShowsPerMonth - noShowsRecoveredLater;

    // Cancellation losses
    const cancellationsPerMonth = totalAppointmentsMonth * (sameDayCancelRate / 100);

    // Split roughly 40% hygiene / 60% treatment
    const hygieneRatio = 0.4;
    const treatmentRatio = 0.6;

    // Revenue from no-shows (chairs that sat empty)
    const noShowRevenueHygiene = noShowsTrulyLost * hygieneRatio * hygieneValue;
    const noShowRevenueTreatment = noShowsTrulyLost * treatmentRatio * revenuePerVisit;
    const noShowRevenueLost = noShowRevenueHygiene + noShowRevenueTreatment;

    // Revenue from same-day cancellations (most can't be refilled)
    const cancelFillRate = 0.15; // only 15% of same-day cancellations get filled
    const cancelsTrulyLost = cancellationsPerMonth * (1 - cancelFillRate);
    const cancelRevenueHygiene = cancelsTrulyLost * hygieneRatio * hygieneValue;
    const cancelRevenueTreatment = cancelsTrulyLost * treatmentRatio * revenuePerVisit;
    const cancelRevenueLost = cancelRevenueHygiene + cancelRevenueTreatment;

    // Staff time cost
    const staffMonthlyCost = staffHoursWeek * 4.33 * staffHourlyCost;

    // Total monthly/annual loss
    const monthlyLoss = noShowRevenueLost + cancelRevenueLost + staffMonthlyCost;
    const annualLoss = monthlyLoss * 12;

    // Chairs empty per day
    const emptyChairsPerDay =
      (noShowsPerMonth + cancellationsPerMonth * (1 - cancelFillRate)) / workingDays;

    // Patients lost per month
    const patientsLostPerMonth = noShowsTrulyLost + cancelsTrulyLost;

    // Hygiene vs treatment losses
    const hygieneMonthlyLoss = noShowRevenueHygiene + cancelRevenueHygiene;
    const treatmentMonthlyLoss = noShowRevenueTreatment + cancelRevenueTreatment;

    // Recovery with Boltcall
    const reminderReduction = 0.38; // 38% reduction in no-shows
    const recoveredNoShows = noShowsTrulyLost * reminderReduction;
    const recoveredCancels = cancelsTrulyLost * reminderReduction * 0.6; // slightly less for cancels
    const recoveredRevenueMonth =
      recoveredNoShows * (hygieneRatio * hygieneValue + treatmentRatio * revenuePerVisit) +
      recoveredCancels * (hygieneRatio * hygieneValue + treatmentRatio * revenuePerVisit);

    const staffHoursSaved = automatedReminders ? staffHoursWeek * 0.8 : 0;
    const staffSavings = staffHoursSaved * 4.33 * staffHourlyCost;

    const boltcallCost = 179;
    const netGain = recoveredRevenueMonth + staffSavings - boltcallCost;
    const roi = boltcallCost > 0 ? ((netGain / boltcallCost) * 100) : 0;
    const additionalPatients = Math.round(recoveredNoShows + recoveredCancels);

    return {
      monthlyLoss,
      annualLoss,
      emptyChairsPerDay,
      patientsLostPerMonth,
      noShowRevenueLost,
      cancelRevenueLost,
      hygieneMonthlyLoss,
      treatmentMonthlyLoss,
      staffMonthlyCost,
      recoveredRevenueMonth,
      staffHoursSaved,
      staffSavings,
      netGain,
      roi,
      additionalPatients,
      noShowsPerMonth,
      cancellationsPerMonth,
    };
  }, [
    revenuePerVisit,
    hygieneValue,
    appointmentsPerDay,
    workingDays,
    noShowRate,
    sameDayCancelRate,
    rescheduleRate,
    daysUntilReschedule,
    automatedReminders,
    currentMethod,
    staffHoursWeek,
    staffHourlyCost,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmail) {
      setFormError('Please enter your email address.');
      return;
    }
    setIsSubmitting(true);
    setFormError('');

    try {
      const payload = {
        name: formName,
        email: formEmail,
        business_name: formPracticeName,
        niche: 'dentist',
        source: 'empty-chair-calculator',
        metrics: {
          monthly_loss: Math.round(calc.monthlyLoss),
          annual_loss: Math.round(calc.annualLoss),
          empty_chairs_per_day: Math.round(calc.emptyChairsPerDay * 10) / 10,
          no_show_rate: noShowRate,
          recovery_potential: Math.round(calc.recoveredRevenueMonth),
          roi: Math.round(calc.roi),
        },
      };

      const res = await fetch('https://n8n.srv974118.hstgr.cloud/webhook/niche-lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to submit');
      setFormSuccess(true);
    } catch {
      setFormError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const SliderInput = ({
    label,
    value,
    onChange,
    min,
    max,
    step = 1,
    prefix = '',
    suffix = '',
    hint,
  }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    min: number;
    max: number;
    step?: number;
    prefix?: string;
    suffix?: string;
    hint?: string;
  }) => (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-slate-300">{label}</label>
        <span className="text-sm font-bold text-teal-400">
          {prefix}
          {value.toLocaleString()}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-700
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-400
          [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(20,184,166,0.5)] [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-teal-300
          [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-teal-400 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-teal-300
          [&::-moz-range-thumb]:cursor-pointer"
        style={{
          background: `linear-gradient(to right, #14B8A6 0%, #14B8A6 ${((value - min) / (max - min)) * 100}%, #334155 ${((value - min) / (max - min)) * 100}%, #334155 100%)`,
        }}
      />
      {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950">
      <GiveawayBar />
      <Header />

      <main className="pt-20">
        {/* ========== HERO ========== */}
        <section
          className="relative px-6 pt-20 pb-16 text-center overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #020617 0%, #0a1628 40%, #0c4a4a 70%, #020617 100%)',
          }}
        >
          <div
            className="absolute inset-0 animate-pulse"
            style={{
              background: 'radial-gradient(ellipse at 50% 30%, rgba(20,184,166,0.08) 0%, transparent 60%)',
              animationDuration: '4s',
            }}
          />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="relative max-w-3xl mx-auto"
          >
            <motion.div variants={fadeUp} className="mb-6">
              <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 px-4 py-1.5 rounded-full text-[13px] font-semibold text-teal-400">
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                Free Calculator for Dental Practices
              </div>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-5"
            >
              <span className="text-white">How Much Are Empty Chairs </span>
              <span className="bg-gradient-to-r from-teal-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                Costing Your Practice?
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Every no-show is a chair that can't be resold. Every late cancellation is revenue that vanishes.
              Calculate exactly what this costs your dental practice every month.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-3 bg-red-500/10 border border-red-500/25 rounded-xl px-6 py-3"
            >
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-red-300 text-sm md:text-base font-medium">
                The average dental practice loses $120,000 - $200,000/year to no-shows
              </span>
            </motion.div>
          </motion.div>
        </section>

        {/* ========== CALCULATOR ========== */}
        <section className="px-4 md:px-6 py-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* LEFT: INPUTS (3 cols) */}
            <div className="lg:col-span-3 space-y-6">
              {/* Card 1: Practice Revenue */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-7 transition-all duration-300 hover:border-teal-500/20 hover:shadow-[0_0_30px_rgba(20,184,166,0.08)]"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/15 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Practice Revenue</h3>
                    <p className="text-xs text-slate-500">Your appointment economics</p>
                  </div>
                </div>

                <SliderInput
                  label="Average revenue per patient visit"
                  value={revenuePerVisit}
                  onChange={setRevenuePerVisit}
                  min={150}
                  max={800}
                  step={10}
                  prefix="$"
                  hint="Includes all procedures for a typical visit"
                />
                <SliderInput
                  label="Hygiene appointment value"
                  value={hygieneValue}
                  onChange={setHygieneValue}
                  min={100}
                  max={400}
                  step={5}
                  prefix="$"
                  hint="Cleaning, exam, X-rays"
                />
                <SliderInput
                  label="Appointments scheduled per day"
                  value={appointmentsPerDay}
                  onChange={setAppointmentsPerDay}
                  min={5}
                  max={40}
                  hint="Across all chairs and providers"
                />
                <SliderInput
                  label="Working days per month"
                  value={workingDays}
                  onChange={setWorkingDays}
                  min={15}
                  max={25}
                />
              </motion.div>

              {/* Card 2: No-Show & Cancellation Reality */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-7 transition-all duration-300 hover:border-teal-500/20 hover:shadow-[0_0_30px_rgba(20,184,166,0.08)]"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
                    <CalendarX className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">No-Show & Cancellation Reality</h3>
                    <p className="text-xs text-slate-500">What's actually happening at your practice</p>
                  </div>
                </div>

                <SliderInput
                  label="No-show rate"
                  value={noShowRate}
                  onChange={setNoShowRate}
                  min={3}
                  max={40}
                  suffix="%"
                  hint="Industry average: 10-23%"
                />
                <SliderInput
                  label="Same-day cancellation rate"
                  value={sameDayCancelRate}
                  onChange={setSameDayCancelRate}
                  min={3}
                  max={30}
                  suffix="%"
                  hint="Cancellations within 24 hours"
                />
                <SliderInput
                  label="% that reschedule (of no-shows)"
                  value={rescheduleRate}
                  onChange={setRescheduleRate}
                  min={10}
                  max={70}
                  suffix="%"
                  hint="How many eventually come back"
                />
                <SliderInput
                  label="Average days until reschedule"
                  value={daysUntilReschedule}
                  onChange={setDaysUntilReschedule}
                  min={7}
                  max={90}
                  suffix=" days"
                  hint="Delayed revenue = lost chair time"
                />
              </motion.div>

              {/* Card 3: Recovery Potential */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-7 transition-all duration-300 hover:border-teal-500/20 hover:shadow-[0_0_30px_rgba(20,184,166,0.08)]"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Recovery Potential</h3>
                    <p className="text-xs text-slate-500">Your current approach to combating no-shows</p>
                  </div>
                </div>

                {/* Toggle */}
                <div className="mb-5">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-300">
                      Would automated reminders help?
                    </label>
                  </div>
                  <button
                    onClick={() => setAutomatedReminders(!automatedReminders)}
                    className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
                      automatedReminders ? 'bg-teal-500' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${
                        automatedReminders ? 'translate-x-7' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className="ml-3 text-sm text-slate-400">
                    {automatedReminders ? 'Yes' : 'No'}
                  </span>
                </div>

                {/* Dropdown */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Current reminder method
                  </label>
                  <select
                    value={currentMethod}
                    onChange={(e) => setCurrentMethod(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 14px center',
                    }}
                  >
                    <option value="none">None</option>
                    <option value="staff_calls">Staff calls</option>
                    <option value="text_once">Text once</option>
                    <option value="email_only">Email only</option>
                  </select>
                </div>

                <SliderInput
                  label="Staff hours/week on confirmation calls"
                  value={staffHoursWeek}
                  onChange={setStaffHoursWeek}
                  min={0}
                  max={20}
                  suffix=" hrs"
                  hint="Time your team spends calling to confirm"
                />
                <SliderInput
                  label="Staff hourly cost"
                  value={staffHourlyCost}
                  onChange={setStaffHourlyCost}
                  min={15}
                  max={35}
                  prefix="$"
                  hint="Loaded cost including benefits"
                />
              </motion.div>
            </div>

            {/* RIGHT: RESULTS DASHBOARD (2 cols, sticky) */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-28 space-y-6">
                {/* Main Loss Number */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-7"
                >
                  <div className="text-center mb-6">
                    <p className="text-sm text-slate-400 mb-2 font-medium">Your Practice Loses</p>
                    <p className="text-4xl md:text-5xl font-black bg-gradient-to-r from-teal-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent leading-tight">
                      {fmt(calc.monthlyLoss)}
                      <span className="text-lg font-semibold text-slate-400">/month</span>
                    </p>
                    <p className="text-sm text-slate-500 mt-1">to Empty Chairs</p>
                    <div className="mt-3 inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                      <TrendingDown className="w-4 h-4 text-red-400" />
                      <span className="text-red-300 text-sm font-semibold">
                        {fmt(calc.annualLoss)}/year
                      </span>
                    </div>
                  </div>

                  {/* 4 Metric Cards */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-slate-800/80 rounded-xl p-4 text-center border border-slate-700/50">
                      <Armchair className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
                      <p className="text-2xl font-bold text-white">
                        {calc.emptyChairsPerDay.toFixed(1)}
                      </p>
                      <p className="text-xs text-slate-400">Empty chairs/day</p>
                    </div>
                    <div className="bg-slate-800/80 rounded-xl p-4 text-center border border-slate-700/50">
                      <Users className="w-5 h-5 text-blue-400 mx-auto mb-1.5" />
                      <p className="text-2xl font-bold text-white">
                        {Math.round(calc.patientsLostPerMonth)}
                      </p>
                      <p className="text-xs text-slate-400">Patients lost/mo</p>
                    </div>
                    <div className="bg-slate-800/80 rounded-xl p-4 text-center border border-slate-700/50">
                      <CalendarX className="w-5 h-5 text-red-400 mx-auto mb-1.5" />
                      <p className="text-2xl font-bold text-white">
                        {fmt(calc.noShowRevenueLost)}
                      </p>
                      <p className="text-xs text-slate-400">No-show losses</p>
                    </div>
                    <div className="bg-slate-800/80 rounded-xl p-4 text-center border border-slate-700/50">
                      <Clock className="w-5 h-5 text-orange-400 mx-auto mb-1.5" />
                      <p className="text-2xl font-bold text-white">
                        {fmt(calc.cancelRevenueLost)}
                      </p>
                      <p className="text-xs text-slate-400">Cancellation losses</p>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-3 mb-6">
                    <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                      Loss Breakdown
                    </h4>
                    <div className="flex justify-between items-center py-2 border-b border-slate-800">
                      <span className="text-sm text-slate-400">Hygiene chair losses</span>
                      <span className="text-sm font-semibold text-red-300">
                        {fmt(calc.hygieneMonthlyLoss)}/mo
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-800">
                      <span className="text-sm text-slate-400">Treatment chair losses</span>
                      <span className="text-sm font-semibold text-red-300">
                        {fmt(calc.treatmentMonthlyLoss)}/mo
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-800">
                      <span className="text-sm text-slate-400">Staff time on manual calls</span>
                      <span className="text-sm font-semibold text-red-300">
                        {fmt(calc.staffMonthlyCost)}/mo
                      </span>
                    </div>
                  </div>

                  {/* Recovery Section */}
                  <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-teal-400" />
                      <h4 className="text-sm font-bold text-teal-300 uppercase tracking-wider">
                        With AI-Powered Patient Follow-Up
                      </h4>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg px-4 py-2.5 mb-4 flex items-start gap-2">
                      <BarChart3 className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-slate-300">
                        <span className="font-semibold text-teal-300">Industry data:</span>{' '}
                        Automated reminders reduce no-shows by 38%
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Revenue recovered</span>
                        <span className="text-sm font-bold text-emerald-400">
                          +{fmt(calc.recoveredRevenueMonth)}/mo
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Staff hours saved</span>
                        <span className="text-sm font-bold text-emerald-400">
                          {calc.staffHoursSaved.toFixed(1)} hrs/week
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-teal-500/20">
                        <span className="text-sm text-slate-400">
                          Net gain after Boltcall ($179/mo)
                        </span>
                        <span className="text-lg font-black text-teal-300">
                          +{fmt(calc.netGain)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">ROI</span>
                        <span className="text-sm font-bold text-teal-400">
                          {calc.roi.toLocaleString(undefined, { maximumFractionDigits: 0 })}%
                        </span>
                      </div>
                      <div className="mt-3 bg-teal-500/10 rounded-lg px-4 py-3 text-center">
                        <p className="text-teal-300 text-sm font-semibold">
                          That's{' '}
                          <span className="text-teal-200 text-lg font-black">
                            {calc.additionalPatients}
                          </span>{' '}
                          additional patients seen per month
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== EMAIL CAPTURE ========== */}
        <section className="px-4 md:px-6 py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            className="max-w-3xl mx-auto bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/30 border border-teal-500/20 rounded-2xl p-8 md:p-12"
          >
            {formSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto bg-teal-500/15 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-teal-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Your Report Is On Its Way!</h3>
                <p className="text-slate-400">Check your inbox for your personalized Practice Revenue Report.</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    Get Your Free Practice Revenue Report
                  </h2>
                  <p className="text-slate-400 max-w-lg mx-auto">
                    We'll send you a detailed breakdown with actionable strategies to fill every chair.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                  {[
                    'Personalized no-show analysis',
                    'Chair utilization optimization guide',
                    'Reminder sequence templates for dental',
                    '3-month patient retention plan',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-teal-400 flex-shrink-0" />
                      <span className="text-sm text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30"
                    />
                    <input
                      type="email"
                      placeholder="Email Address *"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Practice Name (optional)"
                    value={formPracticeName}
                    onChange={(e) => setFormPracticeName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30"
                  />
                  {formError && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {formError}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Mail className="w-5 h-5" />
                        Send My Free Report
                      </>
                    )}
                  </button>
                  <p className="text-xs text-slate-500 text-center">
                    No spam. Unsubscribe anytime. Your data stays private.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </section>

        {/* ========== SOCIAL PROOF ========== */}
        <section className="px-4 md:px-6 py-16 bg-slate-900/50">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="max-w-5xl mx-auto"
          >
            <motion.h2
              variants={fadeUp}
              className="text-2xl md:text-3xl font-bold text-white text-center mb-10"
            >
              The Numbers Don't Lie
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  stat: '67%',
                  text: 'of no-shows say they simply forgot',
                  icon: <Users className="w-6 h-6 text-amber-400" />,
                  color: 'amber',
                },
                {
                  stat: '38%',
                  text: '3-step reminders (48h + 24h + 2h) reduce no-shows by 38%',
                  icon: <Bell className="w-6 h-6 text-teal-400" />,
                  color: 'teal',
                },
                {
                  stat: '$175',
                  text: 'Each empty hygiene chair = $175 in lost recurring revenue',
                  icon: <Armchair className="w-6 h-6 text-red-400" />,
                  color: 'red',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center hover:border-teal-500/20 transition-all duration-300"
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-slate-800 flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <p
                    className={`text-4xl font-black mb-2 ${
                      item.color === 'amber'
                        ? 'text-amber-400'
                        : item.color === 'teal'
                        ? 'text-teal-400'
                        : 'text-red-400'
                    }`}
                  >
                    {item.stat}
                  </p>
                  <p className="text-slate-400 text-sm">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ========== VALUE CONTENT (3 Tips) ========== */}
        <section className="px-4 md:px-6 py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="max-w-5xl mx-auto"
          >
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                3 Ways to Fill Every Chair, Every Day
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                Proven strategies top-performing practices use to virtually eliminate empty chairs.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  num: '01',
                  title: 'Triple-Touch Reminders',
                  description:
                    'SMS + email + call at 48h, 24h, and 2h before the appointment. Three touchpoints catch patients at different moments and reduce forgetfulness by up to 67%.',
                  icon: <MessageSquare className="w-6 h-6 text-teal-400" />,
                },
                {
                  num: '02',
                  title: 'Smart Waitlist',
                  description:
                    'When a cancellation happens, automatically notify patients on your waitlist. The chair gets filled within minutes, not hours. No staff intervention needed.',
                  icon: <Zap className="w-6 h-6 text-amber-400" />,
                },
                {
                  num: '03',
                  title: 'Reactivation Campaigns',
                  description:
                    "Patients who haven't visited in 6+ months get personalized outreach. AI-powered sequences bring them back with the right message at the right time.",
                  icon: <RefreshCcw className="w-6 h-6 text-emerald-400" />,
                },
              ].map((tip, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-teal-500/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(20,184,166,0.08)]"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold text-teal-500 bg-teal-500/10 px-2.5 py-1 rounded-lg">
                      {tip.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                      {tip.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{tip.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{tip.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ========== SOFT CTA ========== */}
        <section className="px-4 md:px-6 py-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            className="max-w-3xl mx-auto text-center"
          >
            <div
              className="bg-gradient-to-br from-slate-900 via-teal-950/20 to-slate-900 border border-teal-500/20 rounded-2xl p-10 md:p-14"
            >
              <div className="w-14 h-14 mx-auto bg-teal-500/15 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-teal-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Ready to Fill{' '}
                <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                  {fmt(calc.recoveredRevenueMonth)}
                </span>{' '}
                Worth of Empty Chairs?
              </h2>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                See how Boltcall automates patient reminders, follow-ups, and reactivation — so every
                chair stays filled.
              </p>
              <a
                href="/features/automated-reminders"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 hover:-translate-y-0.5"
              >
                See It In Action
                <ArrowRight className="w-5 h-5" />
              </a>
              <p className="text-slate-500 text-sm mt-4">
                Starting at $99/month &bull; No contracts &bull; Set up in 24 hours
              </p>
            </div>
          </motion.div>
        </section>
      </main>

      <FinalCTA {...CALCULATOR_CTA} />
      <Footer />
    </div>
  );
};

export default DentistChairCalculator;
