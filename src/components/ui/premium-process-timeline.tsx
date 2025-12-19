"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// A simple utility function to merge class names, replacing the need for an external file.
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

// --- Component Props & Data Types ---

interface ProcessStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  duration: string;
  image: string; // URL to the image for the phone mockup
}

interface QuantumTimelineProps {
  steps?: ProcessStep[];
  defaultStep?: string;
}

// --- Default Data ---
const DEMO_STEPS: ProcessStep[] = [
  {
    id: "01",
    title: "Discovery & Planning",
    subtitle: "Understanding Your Vision",
    description: "We begin by diving deep into your business goals, target audience, and technical requirements to build a comprehensive project roadmap.",
    details: ["Architecture Design", "Integration Planning", "Requirement Analysis", "Success Metrics"],
    duration: "1-2 weeks",
    image: "https://placehold.co/300x600/1e293b/ffffff?text=Discovery",
  },
  {
    id: "02",
    title: "Custom Solution Design",
    subtitle: "Architecting Your AI Future",
    description: "A dedicated team of AI experts builds and rigorously tests custom solutions designed to scale with your business.",
    details: ["Custom AI Model Development", "Security & Compliance Setup", "User Experience Design", "API Development"],
    duration: "2-4 weeks",
    image: "https://placehold.co/300x600/4a00e0/ffffff?text=Design",
  },
  {
    id: "03",
    title: "Implementation",
    subtitle: "Bringing Your Vision to Life",
    description: "Our development team brings the designs to life, building a robust and scalable solution with clean, efficient code.",
    details: ["Frontend Development", "Backend Development", "Database Integration", "CI/CD Setup"],
    duration: "4-6 weeks",
    image: "https://placehold.co/300x600/8e2de2/ffffff?text=Implement",
  },
  {
    id: "04",
    title: "Optimization & Launch",
    subtitle: "Ensuring Peak Performance",
    description: "We conduct rigorous testing and performance optimization to ensure a flawless launch and a seamless user experience.",
    details: ["Performance Tuning", "Security Audits", "User Acceptance Testing", "Deployment"],
    duration: "1-2 weeks",
    image: "https://placehold.co/300x600/1e90ff/ffffff?text=Launch",
  },
];


// --- Main Timeline Component ---

export const QuantumTimeline = ({ steps = DEMO_STEPS, defaultStep }: QuantumTimelineProps) => {
  const [activeStep, setActiveStep] = useState(defaultStep || steps[0]?.id);

  const activeStepData = steps.find(step => step.id === activeStep);

  return (
    <div className="w-full max-w-[calc(62rem+60px)] mx-auto pt-4 px-5 pb-0 -mb-[50px] -mt-[15px] font-sans bg-white dark:bg-black rounded-2xl shadow-2xl">
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
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center font-bold">Q</div>
      <span className="text-xl font-bold text-slate-800 dark:text-white">Quantum Process</span>
    </div>
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
          {step.title.split(' ')[0]}
        </button>
      ))}
    </div>
  </div>
);

const TimelineContent = ({ step }: { step: ProcessStep }) => (
  <div className="text-left">
    <span className="text-sm font-bold text-blue-500">{step.id}</span>
    <h2 className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">{step.title}</h2>
    <p className="mt-3 text-slate-700 dark:text-slate-300">{step.description}</p>
    <div className="mt-4 grid sm:grid-cols-2 gap-4">
      {step.details.map((detail, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-5 h-5 bg-green-500/10 dark:bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-xs">✓</div>
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

  // Discovery & Planning - Animated charts and documents
  if (stepId === "01") {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative w-full h-[400px] flex items-center justify-center"
        >
          {/* Animated Chart Bars */}
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="absolute"
              style={{
                left: `${20 + i * 20}%`,
                bottom: '20%',
              }}
            >
              <motion.div
                className="w-12 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg"
                initial={{ height: 0 }}
                animate={{ height: `${40 + i * 20}px` }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            </motion.div>
          ))}
          
          {/* Floating Documents */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`doc-${i}`}
              variants={itemVariants}
              className="absolute w-16 h-20 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-lg shadow-lg"
              style={{
                left: `${30 + i * 25}%`,
                top: `${20 + i * 15}%`,
                rotate: -10 + i * 10,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [-10 + i * 10, -15 + i * 10, -10 + i * 10],
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>
    );
  }

  // Custom Solution Design - Animated design elements
  if (stepId === "02") {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative w-full h-[400px] flex items-center justify-center"
        >
          {/* Rotating Design Elements */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="absolute w-24 h-24 border-4 border-blue-500 rounded-lg"
              style={{
                rotate: i * 45,
              }}
              animate={{
                rotate: 360 + i * 45,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: {
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "linear",
                },
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            />
          ))}
          
          {/* Pulsing Center Circle */}
          <motion.div
            className="absolute w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    );
  }

  // Implementation - Animated code blocks
  if (stepId === "03") {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative w-full h-[400px] flex flex-col items-center justify-center gap-4"
        >
          {/* Animated Code Lines */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="w-3/4 h-4 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded"
              initial={{ width: 0 }}
              animate={{ width: "75%" }}
              transition={{
                duration: 1,
                delay: i * 0.3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
          
          {/* Floating Code Blocks */}
          {[0, 1].map((i) => (
            <motion.div
              key={`block-${i}`}
              className="absolute w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg shadow-xl"
              style={{
                left: `${20 + i * 60}%`,
                top: `${30 + i * 40}%`,
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 2 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>
    );
  }

  // Optimization & Launch - Animated rocket and success indicators
  if (stepId === "04") {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative w-full h-[400px] flex items-center justify-center"
        >
          {/* Rocket */}
          <motion.div
            variants={itemVariants}
            className="absolute"
            animate={{
              y: [0, -50, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-16 h-24 bg-gradient-to-b from-blue-500 to-blue-600 rounded-t-full relative">
              {/* Rocket Body */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[20px] border-r-[20px] border-t-[30px] border-l-transparent border-r-transparent border-t-orange-500" />
            </div>
          </motion.div>
          
          {/* Success Checkmarks */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl"
              style={{
                left: `${20 + i * 30}%`,
                top: `${60 + i * 10}%`,
              }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: [0, 1.2, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 0.8,
                delay: i * 0.3,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            >
              ✓
            </motion.div>
          ))}
          
          {/* Stars */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{
                left: `${15 + i * 20}%`,
                top: `${20 + (i % 2) * 30}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>
    );
  }

  return null;
};



