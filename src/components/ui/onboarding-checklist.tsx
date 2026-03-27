"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, PartyPopper, Zap, X } from "lucide-react";
import { Button } from "./Button";
import confetti from "canvas-confetti";


export type Step = {
  id: string;
  title: string;
  description?: string;
  targetSelector: string;
  completed?: boolean;
};

export interface InteractiveOnboardingChecklistProps {
  steps: Step[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?(open: boolean): void;
  onCompleteStep?(id: string): void;
  onFinish?(): void;
}


const getElementPosition = (selector: string) => {
  const element = document.querySelector(selector) as HTMLElement;
  if (!element) return null;

  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height,
    element
  };
};


const CoachmarkOverlay = ({
  step,
  onNext,
  onPrev,
  onComplete,
  onClose,
  isFirst,
  isLast,
  stepIndex,
  totalSteps
}: {
  step: Step;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
  onClose: () => void;
  isFirst: boolean;
  isLast: boolean;
  stepIndex: number;
  totalSteps: number;
}) => {
  const [targetPosition, setTargetPosition] = useState(getElementPosition(step.targetSelector));
  const overlayRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    setTargetPosition(getElementPosition(step.targetSelector));
  }, [step.targetSelector]);

  useEffect(() => {
    updatePosition();

    const handleResize = () => updatePosition();
    const handleScroll = () => updatePosition();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    const resizeObserver = new ResizeObserver(updatePosition);
    const targetElement = document.querySelector(step.targetSelector);
    if (targetElement) {
      resizeObserver.observe(targetElement);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, [step.targetSelector, updatePosition]);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight" && !isLast) {
        onNext();
      } else if (e.key === "ArrowLeft" && !isFirst) {
        onPrev();
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (isLast) onComplete();
        else onNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev, onComplete, isFirst, isLast]);

  if (!targetPosition) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] bg-black/50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="coachmark-title"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-[#1a1a1f] border border-gray-200 dark:border-[#2a2a30] rounded-xl p-6 max-w-md mx-4 shadow-lg"
        >
          <h3 id="coachmark-title" className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
            {step.title}
          </h3>
          <p className="text-gray-500 mb-4">
            This element isn't visible right now. Skip to the next step.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Skip Tour
            </Button>
            {!isLast ? (
              <Button size="sm" onClick={onNext} className="bg-blue-600 text-white hover:bg-blue-700">
                Next
              </Button>
            ) : (
              <Button size="sm" onClick={onComplete} className="bg-blue-600 text-white hover:bg-blue-700">
                Done
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  }

  const { top, left, width, height } = targetPosition;
  const spotlightPadding = 8;

  return (
    <motion.div
      ref={overlayRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9998] pointer-events-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="coachmark-title"
      style={{
        background: `radial-gradient(circle at ${left + width/2}px ${top + height/2}px, transparent ${Math.max(width, height)/2 + spotlightPadding}px, rgba(0,0,0,0.7) ${Math.max(width, height)/2 + spotlightPadding + 1}px)`
      }}
    >
      {/* Skip button top-right */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 pointer-events-auto z-[10000] text-white/70 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
        aria-label="Skip tour"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Spotlight border ring */}
      <div
        className="absolute border-2 border-white rounded-lg z-[9999]"
        style={{
          top: top - spotlightPadding,
          left: left - spotlightPadding,
          width: width + spotlightPadding * 2,
          height: height + spotlightPadding * 2,
          boxShadow: `0 0 0 2px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.15)`
        }}
      />

      {/* Tooltip card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 10 }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 400,
          opacity: { duration: 0.15 }
        }}
        className="absolute bg-white dark:bg-[#1a1a1f] border border-gray-200 dark:border-[#2a2a30] rounded-xl p-4 shadow-2xl max-w-sm pointer-events-auto z-[9999]"
        style={(() => {
          const cardWidth = 340;
          const cardHeight = 180;
          const margin = 16;

          const positions = [
            { top: top + height + margin, left: left + (width / 2) - (cardWidth / 2), priority: 1 },
            { top: top - cardHeight - margin, left: left + (width / 2) - (cardWidth / 2), priority: 2 },
            { top: top + (height / 2) - (cardHeight / 2), left: left + width + margin, priority: 3 },
            { top: top + (height / 2) - (cardHeight / 2), left: left - cardWidth - margin, priority: 4 }
          ];

          const bestPosition = positions
            .map(pos => ({
              ...pos,
              fitsHorizontally: pos.left >= margin && pos.left + cardWidth <= window.innerWidth - margin,
              fitsVertically: pos.top >= margin && pos.top + cardHeight <= window.innerHeight - margin,
            }))
            .filter(pos => pos.fitsHorizontally && pos.fitsVertically)
            .sort((a, b) => a.priority - b.priority)[0];

          if (bestPosition) {
            return { top: bestPosition.top, left: bestPosition.left };
          }

          return {
            top: Math.max(margin, Math.min(top + height + margin, window.innerHeight - cardHeight - margin)),
            left: Math.max(margin, Math.min(left + (width / 2) - (cardWidth / 2), window.innerWidth - cardWidth - margin))
          };
        })()}
      >
        <div className="mb-3">
          <h3 id="coachmark-title" className="font-semibold text-base mb-1 text-gray-900 dark:text-white">
            {step.title}
          </h3>
          <p className="text-xs text-gray-400">
            Step {stepIndex + 1} of {totalSteps}
          </p>
        </div>

        {step.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {step.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === stepIndex ? 'bg-blue-600' : i < stepIndex ? 'bg-blue-300' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Nav buttons */}
          <div className="flex items-center gap-2">
            {!isFirst && (
              <Button
                variant="outline"
                size="sm"
                onClick={onPrev}
                aria-label="Previous step"
                className="h-8 px-3 text-xs text-black"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1 text-black" />
                Prev
              </Button>
            )}
            {isLast ? (
              <Button
                size="sm"
                onClick={onComplete}
                aria-label="Complete onboarding"
                className="h-8 px-4 text-xs bg-blue-600 text-white hover:bg-blue-700"
              >
                Done
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={onNext}
                aria-label="Next step"
                className="h-8 px-3 text-xs text-black border border-gray-300 bg-white hover:bg-gray-50"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5 ml-1 text-black" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};


export function InteractiveOnboardingChecklist({
  steps,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  onCompleteStep,
  onFinish,
}: InteractiveOnboardingChecklistProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [showCelebration, setShowCelebration] = useState(false);
  const [internalCompletedSteps, setInternalCompletedSteps] = useState<Set<string>>(new Set());

  const completedSteps = new Set([
    ...steps.filter(step => step.completed).map(step => step.id),
    ...internalCompletedSteps
  ]);
  const [activeCoachmark, setActiveCoachmark] = useState<string | null>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const advanceToNextStep = useCallback((completedStepId: string) => {
    const newCompletedSteps = new Set([
      ...steps.filter(step => step.completed).map(step => step.id),
      ...internalCompletedSteps,
      completedStepId
    ]);

    const currentStepIndex = steps.findIndex(step => step.id === completedStepId);
    const nextIncompleteStep = steps.slice(currentStepIndex + 1).find(step => !newCompletedSteps.has(step.id));

    if (nextIncompleteStep) {
      setActiveCoachmark(nextIncompleteStep.id);
    } else {
      setActiveCoachmark(null);
    }

    const completedAllSteps = steps.filter(step => newCompletedSteps.has(step.id));

    if (completedAllSteps.length === steps.length) {
      const end = Date.now() + 3 * 1000;
      const colors = ["#2563EB", "#3B82F6", "#60A5FA", "#93C5FD", "#DBEAFE"];
      const frame = () => {
        if (Date.now() > end) return;
        confetti({ particleCount: 2, angle: 60, spread: 55, startVelocity: 60, origin: { x: 0, y: 0.5 }, colors });
        confetti({ particleCount: 2, angle: 120, spread: 55, startVelocity: 60, origin: { x: 1, y: 0.5 }, colors });
        requestAnimationFrame(frame);
      };
      frame();
      setShowCelebration(true);
    }
  }, [steps, internalCompletedSteps]);

  // Auto-start first step when opened
  useEffect(() => {
    if (open && !activeCoachmark) {
      const firstIncompleteStep = steps.find(step => !completedSteps.has(step.id));
      if (firstIncompleteStep) {
        const timer = setTimeout(() => {
          setActiveCoachmark(firstIncompleteStep.id);
        }, 400);
        return () => clearTimeout(timer);
      }
    }
  }, [open, activeCoachmark, steps, completedSteps]);

  // Skip completed steps
  useEffect(() => {
    if (activeCoachmark) {
      const activeStep = steps.find(s => s.id === activeCoachmark);
      if (activeStep && activeStep.completed) {
        setTimeout(() => {
          advanceToNextStep(activeCoachmark);
        }, 500);
      }
    }
  }, [steps, activeCoachmark, advanceToNextStep]);

  const handleClose = () => {
    setActiveCoachmark(null);
    if (!isControlled) {
      setInternalOpen(false);
    }
    onOpenChange?.(false);
  };

  const handleCompleteStep = (stepId: string) => {
    setInternalCompletedSteps(prev => new Set([...prev, stepId]));
    onCompleteStep?.(stepId);
    setTimeout(() => {
      advanceToNextStep(stepId);
    }, 500);
  };

  const activeStep = activeCoachmark ? steps.find(s => s.id === activeCoachmark) : null;
  const activeStepIndex = activeStep ? steps.indexOf(activeStep) : -1;
  const totalSteps = steps.length;

  const hasPrevIncompleteStep = activeStepIndex > 0 &&
    steps.slice(0, activeStepIndex).some(step => !completedSteps.has(step.id));
  const hasNextIncompleteStep = activeStepIndex < totalSteps - 1 &&
    steps.slice(activeStepIndex + 1).some(step => !completedSteps.has(step.id));

  if (!open) return null;

  return (
    <>
      {/* Coachmark spotlight overlay */}
      <AnimatePresence>
        {activeStep && (
          <CoachmarkOverlay
            step={activeStep}
            stepIndex={activeStepIndex}
            totalSteps={totalSteps}
            isFirst={!hasPrevIncompleteStep}
            isLast={!hasNextIncompleteStep}
            onNext={() => {
              for (let i = activeStepIndex + 1; i < totalSteps; i++) {
                if (!completedSteps.has(steps[i].id)) {
                  setActiveCoachmark(steps[i].id);
                  return;
                }
              }
            }}
            onPrev={() => {
              for (let i = activeStepIndex - 1; i >= 0; i--) {
                if (!completedSteps.has(steps[i].id)) {
                  setActiveCoachmark(steps[i].id);
                  return;
                }
              }
            }}
            onComplete={() => handleCompleteStep(activeStep.id)}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>

      {/* Celebration overlay — portaled to body to escape parent transforms */}
      {createPortal(
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full mx-4 text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <PartyPopper className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-black mb-3">
                  You're All Set!
                </h3>
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <Zap className="w-4 h-4" />
                  You earned 50 free credits!
                </div>
                <p className="text-lg text-black/70 mb-8 leading-relaxed">
                  Your AI receptionist is ready to handle calls, book appointments, and delight your customers.
                </p>
                <button
                  onClick={() => {
                    setShowCelebration(false);
                    onFinish?.();
                    handleClose();
                  }}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-base"
                >
                  Go to Dashboard
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
