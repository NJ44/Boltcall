"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, PartyPopper, Zap } from "lucide-react";
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
    // Element not visible — auto-skip to next step
    if (!isLast) onNext();
    else onComplete();
    return null;
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
    >
      {/* Rectangular spotlight mask */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <mask id={`spotlight-mask-${stepIndex}`}>
            <rect width="100%" height="100%" fill="white" />
            <rect
              x={left - spotlightPadding}
              y={top - spotlightPadding}
              width={width + spotlightPadding * 2}
              height={height + spotlightPadding * 2}
              rx={8}
              ry={8}
              fill="black"
            />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.7)"
          mask={`url(#spotlight-mask-${stepIndex})`}
        />
      </svg>

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

      {/* Bottom center nav bar — dots + Prev/Next */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto z-[9999] flex items-center gap-4 bg-white rounded-full px-4 py-2 shadow-2xl">
        {!isFirst && (
          <button
            onClick={onPrev}
            aria-label="Previous step"
            className="flex items-center gap-1 text-sm font-medium text-black hover:text-gray-600 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-black" />
            Prev
          </button>
        )}

        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === stepIndex ? 'bg-blue-600' : i < stepIndex ? 'bg-blue-300' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {isLast ? (
          <button
            onClick={onComplete}
            aria-label="Complete onboarding"
            className="flex items-center gap-1 text-sm font-medium text-black hover:text-gray-600 transition-colors"
          >
            Done
          </button>
        ) : (
          <button
            onClick={onNext}
            aria-label="Next step"
            className="flex items-center gap-1 text-sm font-medium text-black hover:text-gray-600 transition-colors"
          >
            Next
            <ChevronRight className="h-4 w-4 text-black" />
          </button>
        )}
      </div>
    </motion.div>
  );
};


export function InteractiveOnboardingChecklist({
  steps,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  onFinish,
}: InteractiveOnboardingChecklistProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [showCelebration, setShowCelebration] = useState(false);
  const [activeCoachmark, setActiveCoachmark] = useState<string | null>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  // Auto-start first step when opened (skip if celebration is showing)
  useEffect(() => {
    if (open && !activeCoachmark && !showCelebration) {
      const timer = setTimeout(() => {
        setActiveCoachmark(steps[0]?.id ?? null);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [open, activeCoachmark, showCelebration, steps]);

  const handleClose = () => {
    setActiveCoachmark(null);
    if (!isControlled) {
      setInternalOpen(false);
    }
    onOpenChange?.(false);
  };

  const handleFinishTour = () => {
    setActiveCoachmark(null);
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
  };

  const activeStep = activeCoachmark ? steps.find(s => s.id === activeCoachmark) : null;
  const activeStepIndex = activeStep ? steps.indexOf(activeStep) : -1;
  const totalSteps = steps.length;

  const isFirstStep = activeStepIndex === 0;
  const isLastStep = activeStepIndex === totalSteps - 1;

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
            isFirst={isFirstStep}
            isLast={isLastStep}
            onNext={() => {
              if (activeStepIndex < totalSteps - 1) {
                setActiveCoachmark(steps[activeStepIndex + 1].id);
              }
            }}
            onPrev={() => {
              if (activeStepIndex > 0) {
                setActiveCoachmark(steps[activeStepIndex - 1].id);
              }
            }}
            onComplete={handleFinishTour}
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
