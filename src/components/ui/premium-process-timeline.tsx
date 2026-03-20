"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Zap, Star, BarChart3 } from 'lucide-react';

// A simple utility function to merge class names, replacing the need for an external file.
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

// --- Component Props & Data Types ---

interface ProcessStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
}

interface QuantumTimelineProps {
  steps?: ProcessStep[];
  defaultStep?: string;
}

// --- Default Data ---
const DEMO_STEPS: ProcessStep[] = [
  {
    id: "01",
    title: "AI Receptionist",
    subtitle: "",
    description: "Your AI receptionist answers every call 24/7 with a natural human voice. It books appointments, answers FAQs, and transfers urgent calls \u2014 so you never lose a lead.",
    details: ["24/7 Call Answering", "Natural Voice AI", "Appointment Booking", "Call Transfer"],
  },
  {
    id: "02",
    title: "Instant Lead Response",
    subtitle: "",
    description: "When a new lead comes in from your website, Facebook Ads, or missed call \u2014 Boltcall responds instantly via SMS, email, or callback. Beat your competition by being first.",
    details: ["Instant SMS Response", "Auto Email Follow-up", "Missed Call Text-back", "Facebook Lead Capture"],
  },
  {
    id: "03",
    title: "Review Automation",
    subtitle: "",
    description: "Automatically send review requests after every appointment. Happy customers get directed to Google, unhappy ones get routed to you first \u2014 protecting your reputation.",
    details: ["Google Review Requests", "Smart Routing", "Review Monitoring", "Reputation Dashboard"],
  },
  {
    id: "04",
    title: "Analytics",
    subtitle: "",
    description: "Track every call, message, lead, and booking in one dashboard. See which channels drive the most revenue and optimize your marketing spend.",
    details: ["Call Analytics", "Lead Source Tracking", "Revenue Attribution", "Token Usage Dashboard"],
  },
];


// --- Main Timeline Component ---

export const QuantumTimeline = ({ steps = DEMO_STEPS, defaultStep }: QuantumTimelineProps) => {
  const [activeStep, setActiveStep] = useState(defaultStep || steps[0]?.id);

  const activeStepData = steps.find(step => step.id === activeStep);

  return (
    <div className="w-full max-w-[calc(70rem+200px)] mx-auto pt-4 px-5 pb-0 -mb-[100px] -mt-[105px] font-sans bg-white dark:bg-black rounded-2xl shadow-2xl" style={{ width: 'calc(100% + 80px)', maxWidth: 'calc(70rem + 200px)', marginLeft: '-40px', marginRight: '-40px' }}>
      {/* Top Navigation */}
      <TimelineNav steps={steps} activeStep={activeStep} onStepClick={setActiveStep} />

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {activeStepData && (
          <motion.div
            key={activeStepData.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 grid md:grid-cols-2 gap-8"
          >
            <TimelineContent step={activeStepData} />
            <TimelineAnimation stepId={activeStepData.id} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Sub-components ---

const TimelineNav = ({ steps, activeStep, onStepClick }: { steps: ProcessStep[], activeStep: string, onStepClick: (id: string) => void }) => (
  <div className="flex items-center justify-center">
    <div className="hidden md:flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-full">
      {steps.map(step => (
        <button
          key={step.id}
          onClick={() => onStepClick(step.id)}
          className={cn(
            "px-4 py-1 rounded-full text-sm font-semibold transition-colors",
            activeStep === step.id
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700"
          )}
        >
          {step.title.split(' ').slice(0, 2).join(' ')}
        </button>
      ))}
    </div>
  </div>
);

const TimelineContent = ({ step }: { step: ProcessStep }) => (
  <div className="text-left mt-16">
    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">{step.title}</h2>
    <p className="mt-3 text-slate-700 dark:text-slate-300">{step.description}</p>
    <div className="mt-4 grid sm:grid-cols-2 gap-4">
      {step.details.map((detail, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-5 h-5 bg-green-500/10 dark:bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-xs">{'\u2713'}</div>
          <span className="text-sm text-slate-700 dark:text-slate-300">{detail}</span>
        </div>
      ))}
    </div>
  </div>
);

const TimelineAnimation = ({ stepId }: { stepId: string }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 10,
      },
    },
  };

  // AI Receptionist - Phone with sound waves and conversation bubbles
  if (stepId === "01") {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative w-full h-[400px] flex items-center justify-center"
        >
          {/* Phone Icon Center */}
          <motion.div
            variants={itemVariants}
            className="relative z-10 w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Phone className="w-10 h-10 text-white" />
          </motion.div>

          {/* Sound Waves */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`wave-${i}`}
              className="absolute w-20 h-20 rounded-2xl border-2 border-blue-400/40"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{
                scale: [1, 1.6 + i * 0.4],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.5,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Conversation Bubbles */}
          <motion.div
            variants={itemVariants}
            className="absolute top-[15%] right-[10%] bg-white dark:bg-slate-800 rounded-2xl rounded-br-sm px-4 py-3 shadow-lg max-w-[180px]"
          >
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{'\u201C'}Hi, I\u2019d like to book an appointment for Thursday.{'\u201D'}</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="absolute bottom-[15%] left-[10%] bg-blue-600 rounded-2xl rounded-bl-sm px-4 py-3 shadow-lg max-w-[200px]"
          >
            <p className="text-xs text-white font-medium">{'\u201C'}Of course! I have 2pm and 4pm available. Which works best?{'\u201D'}</p>
          </motion.div>

          {/* Floating badges */}
          <motion.div
            className="absolute top-[10%] left-[15%] bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-[10px] font-bold px-2 py-1 rounded-full"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            24/7 Active
          </motion.div>

          <motion.div
            className="absolute bottom-[10%] right-[15%] bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-2 py-1 rounded-full"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, delay: 1, repeat: Infinity, ease: "easeInOut" }}
          >
            Natural Voice
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Speed to Lead - Lightning bolt with notification badges
  if (stepId === "02") {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative w-full h-[400px] flex items-center justify-center"
        >
          {/* Central Lightning Bolt */}
          <motion.div
            variants={itemVariants}
            className="relative z-10 w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/30"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Zap className="w-10 h-10 text-white" fill="white" />
          </motion.div>

          {/* Energy Burst */}
          <motion.div
            className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-amber-400/20 to-orange-400/20"
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.4, 0, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />

          {/* Notification Cards flying in */}
          {[
            { label: "SMS Sent", icon: "💬", pos: "top-[12%] right-[8%]", delay: 0, color: "from-green-500 to-emerald-500" },
            { label: "Email Sent", icon: "📧", pos: "top-[35%] left-[5%]", delay: 0.4, color: "from-blue-500 to-blue-600" },
            { label: "Callback Queued", icon: "📞", pos: "bottom-[18%] right-[12%]", delay: 0.8, color: "from-purple-500 to-indigo-500" },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className={`absolute ${item.pos} flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl px-3 py-2 shadow-lg`}
            >
              <div className={`w-8 h-8 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center text-sm`}>
                {item.icon}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.label}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Just now</p>
              </div>
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, delay: item.delay, repeat: Infinity }}
              />
            </motion.div>
          ))}

          {/* Speed indicator */}
          <motion.div
            className="absolute bottom-[8%] left-[15%] bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-[10px] font-bold px-3 py-1 rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            Avg response: 3 seconds
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Review Automation - Stars and Google review animation
  if (stepId === "03") {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative w-full h-[400px] flex items-center justify-center"
        >
          {/* Review Card */}
          <motion.div
            variants={itemVariants}
            className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-5 w-[260px] border border-slate-200 dark:border-slate-700"
          >
            {/* Google-style header */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-red-500 to-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">G</div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Google Reviews</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Your Business</p>
              </div>
            </div>

            {/* Stars animation */}
            <div className="flex items-center gap-1 mb-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.5 + i * 0.2,
                    type: "spring",
                    stiffness: 200,
                    damping: 10,
                  }}
                >
                  <Star className="w-6 h-6 text-yellow-400" fill="#facc15" />
                </motion.div>
              ))}
            </div>

            {/* Rating number */}
            <motion.div
              className="flex items-baseline gap-1 mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <span className="text-2xl font-bold text-slate-900 dark:text-white">4.9</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">out of 5</span>
            </motion.div>

            {/* Recent review */}
            <motion.div
              className="bg-slate-50 dark:bg-slate-700 rounded-xl p-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
            >
              <div className="flex items-center gap-1 mb-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-400" fill="#facc15" />
                ))}
              </div>
              <p className="text-[10px] text-slate-600 dark:text-slate-300">{'\u201C'}Amazing service! They responded so fast and were very professional.{'\u201D'}</p>
              <p className="text-[9px] text-slate-400 mt-1">- Sarah M., 2 hours ago</p>
            </motion.div>
          </motion.div>

          {/* Floating badges */}
          <motion.div
            className="absolute top-[8%] right-[10%] bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Star className="w-3 h-3" fill="currentColor" /> Auto-Sent
          </motion.div>

          <motion.div
            className="absolute bottom-[10%] left-[8%] bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-[10px] font-bold px-3 py-1 rounded-full"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, delay: 1, repeat: Infinity, ease: "easeInOut" }}
          >
            +47 reviews this month
          </motion.div>

          {/* Smart routing indicator */}
          <motion.div
            className="absolute top-[12%] left-[5%] bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-2 py-1 rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
          >
            Smart Routing
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Analytics - Animated charts and KPIs
  if (stepId === "04") {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative w-full h-[400px] flex items-center justify-center"
        >
          {/* Dashboard Card */}
          <motion.div
            variants={itemVariants}
            className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-5 w-[300px] border border-slate-200 dark:border-slate-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Dashboard</p>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">This Month</p>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: "Calls", value: "342", change: "+12%", color: "text-blue-600" },
                { label: "Leads", value: "89", change: "+23%", color: "text-emerald-600" },
                { label: "Booked", value: "67", change: "+18%", color: "text-purple-600" },
              ].map((kpi, i) => (
                <motion.div
                  key={i}
                  className="bg-slate-50 dark:bg-slate-700 rounded-lg p-2 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.2 }}
                >
                  <p className={`text-lg font-bold ${kpi.color} dark:text-white`}>{kpi.value}</p>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400">{kpi.label}</p>
                  <p className="text-[9px] text-green-500 font-semibold">{kpi.change}</p>
                </motion.div>
              ))}
            </div>

            {/* Animated Bar Chart */}
            <div className="flex items-end gap-1.5 h-[80px] px-1">
              {[45, 65, 40, 80, 55, 70, 90].map((height, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-purple-600 to-indigo-400 rounded-t-sm"
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{
                    duration: 0.8,
                    delay: 1 + i * 0.1,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between px-1 mt-1">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                <span key={i} className="flex-1 text-center text-[8px] text-slate-400">{day}</span>
              ))}
            </div>
          </motion.div>

          {/* Floating badges */}
          <motion.div
            className="absolute top-[6%] left-[5%] bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <BarChart3 className="w-3 h-3" /> Real-time
          </motion.div>

          <motion.div
            className="absolute bottom-[8%] right-[8%] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold px-3 py-1 rounded-full"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, delay: 1, repeat: Infinity, ease: "easeInOut" }}
          >
            Revenue: $12,400
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return null;
};
