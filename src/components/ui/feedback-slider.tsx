import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const animationStates = [
  {
    bgColor: "#fc7359",
    indicatorColor: "#790b02",
    pathColor: "#fc7359",
    smileColor: "#790b02",
    titleColor: "#790b02",
    trackColor: "#fc5b3e",
    eyeWidth: 56,
    eyeHeight: 56,
    eyeBorderRadius: "100%",
    eyeBg: "#790b02",
    smileRotate: 180,
    indicatorRotate: 180,
    noteText: "BAD",
    noteColor: "#e33719",
    noteX: "0%",
    indicatorLeft: "0%",
  },
  {
    bgColor: "#dfa342",
    indicatorColor: "#482103",
    pathColor: "#dfa342",
    smileColor: "#482103",
    titleColor: "#482103",
    trackColor: "#b07615",
    eyeWidth: 100,
    eyeHeight: 20,
    eyeBorderRadius: "36px",
    eyeBg: "#482103",
    smileRotate: 180,
    indicatorRotate: 180,
    noteText: "NOT BAD",
    noteColor: "#b37716",
    noteX: "-100%",
    indicatorLeft: "50%",
  },
  {
    bgColor: "#9fbe59",
    indicatorColor: "#0b2b03",
    pathColor: "#9fbe59",
    smileColor: "#0b2b03",
    titleColor: "#0b2b03",
    trackColor: "#698b1b",
    eyeWidth: 120,
    eyeHeight: 120,
    eyeBorderRadius: "100%",
    eyeBg: "#0b2b03",
    smileRotate: 0,
    indicatorRotate: 0,
    noteText: "GOOD",
    noteColor: "#6e901d",
    noteX: "-200%",
    indicatorLeft: "100%",
  },
];

const HandDrawnSmileIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <motion.svg
    width="100%"
    height="100%"
    viewBox="0 0 100 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <motion.path
      d="M10 30 Q50 70 90 30"
      strokeWidth="12"
      strokeLinecap="round"
    />
  </motion.svg>
);

export interface FeedbackSliderProps {
  onSubmit?: (rating: "bad" | "not_bad" | "good") => void;
}

const ratingMap = ["bad", "not_bad", "good"] as const;

export default function FeedbackSlider({ onSubmit }: FeedbackSliderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const currentAnim = animationStates[selectedIndex];
  const transition = { type: "spring", stiffness: 300, damping: 30 };

  const handleSubmit = () => {
    onSubmit?.(ratingMap[selectedIndex]);
    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setTimeout(() => setSubmitted(false), 400);
    }, 1500);
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-20 z-40 flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl active:scale-95"
      >
        <MessageSquarePlus className="h-4 w-4" />
        Feedback
      </button>

      {/* Bottom-sliding panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 overflow-hidden rounded-t-3xl shadow-2xl"
            >
              <motion.div
                className="relative flex w-full items-center justify-center"
                animate={{ backgroundColor: currentAnim.bgColor }}
                transition={transition}
              >
                {/* Close button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute right-4 top-4 z-10 rounded-full bg-black/10 p-2 transition-colors hover:bg-black/20"
                >
                  <X className="h-5 w-5" style={{ color: currentAnim.titleColor }} />
                </button>

                <div className="flex w-full max-w-[400px] flex-col items-center justify-center px-4 py-8">
                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center gap-3 py-12"
                    >
                      <motion.div
                        className="text-5xl"
                        initial={{ rotate: -20 }}
                        animate={{ rotate: 0 }}
                        transition={transition}
                      >
                        {selectedIndex === 2 ? "\u{1F389}" : selectedIndex === 1 ? "\u{1F44D}" : "\u{1F64F}"}
                      </motion.div>
                      <motion.h3
                        className="text-xl font-semibold"
                        animate={{ color: currentAnim.titleColor }}
                      >
                        Thanks for your feedback!
                      </motion.h3>
                    </motion.div>
                  ) : (
                    <>
                      <motion.h3
                        className="mb-8 w-72 text-center text-xl font-semibold"
                        animate={{ color: currentAnim.titleColor }}
                        transition={transition}
                      >
                        How's your experience with Boltcall?
                      </motion.h3>

                      {/* Face */}
                      <div className="flex h-[140px] flex-col items-center justify-center">
                        <div className="flex items-center justify-center gap-8">
                          <motion.div
                            animate={{
                              width: currentAnim.eyeWidth,
                              height: currentAnim.eyeHeight,
                              borderRadius: currentAnim.eyeBorderRadius,
                              backgroundColor: currentAnim.eyeBg,
                            }}
                            transition={transition}
                          />
                          <motion.div
                            animate={{
                              width: currentAnim.eyeWidth,
                              height: currentAnim.eyeHeight,
                              borderRadius: currentAnim.eyeBorderRadius,
                              backgroundColor: currentAnim.eyeBg,
                            }}
                            transition={transition}
                          />
                        </div>
                        <motion.div
                          className="flex h-14 w-14 items-center justify-center"
                          animate={{ rotate: currentAnim.smileRotate }}
                          transition={transition}
                        >
                          <HandDrawnSmileIcon
                            animate={{ stroke: currentAnim.smileColor }}
                            transition={transition}
                          />
                        </motion.div>
                      </div>

                      {/* Rating text */}
                      <div className="flex w-full items-center justify-start overflow-hidden pb-8 pt-4">
                        <motion.div
                          className="flex w-full shrink-0"
                          animate={{ x: currentAnim.noteX }}
                          transition={transition}
                        >
                          {animationStates.map((state, i) => (
                            <div
                              key={i}
                              className="flex w-full shrink-0 items-center justify-center"
                            >
                              <h1
                                className="text-5xl font-black md:text-6xl"
                                style={{ color: state.noteColor }}
                              >
                                {state.noteText}
                              </h1>
                            </div>
                          ))}
                        </motion.div>
                      </div>

                      {/* Slider track */}
                      <div className="w-full">
                        <div className="relative flex w-full items-center justify-between">
                          {animationStates.map((_, i) => (
                            <button
                              key={i}
                              className="z-[2] h-6 w-6 rounded-full"
                              onClick={() => setSelectedIndex(i)}
                              style={{ backgroundColor: currentAnim.trackColor }}
                            />
                          ))}
                          <motion.div
                            className="absolute top-1/2 h-1 w-full -translate-y-1/2"
                            animate={{ backgroundColor: currentAnim.trackColor }}
                            transition={transition}
                          />
                          <motion.div
                            className="absolute z-[3] flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full p-2"
                            animate={{
                              left: currentAnim.indicatorLeft,
                              rotate: currentAnim.indicatorRotate,
                              backgroundColor: currentAnim.indicatorColor,
                            }}
                            transition={transition}
                          >
                            <HandDrawnSmileIcon
                              animate={{ stroke: currentAnim.pathColor }}
                              transition={transition}
                            />
                          </motion.div>
                        </div>
                        <div className="flex w-full items-center justify-between pt-4">
                          {["Bad", "Not Bad", "Good"].map((text, i) => (
                            <motion.span
                              key={text}
                              className="w-full text-center text-sm font-medium"
                              animate={{
                                color: currentAnim.titleColor,
                                opacity: selectedIndex === i ? 1 : 0.6,
                              }}
                              transition={transition}
                            >
                              {text}
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      {/* Submit button */}
                      <motion.button
                        onClick={handleSubmit}
                        className="mt-8 rounded-xl px-8 py-3 text-sm font-bold transition-all active:scale-95"
                        animate={{
                          backgroundColor: currentAnim.indicatorColor,
                          color: currentAnim.bgColor,
                        }}
                        transition={transition}
                      >
                        Submit Feedback
                      </motion.button>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

FeedbackSlider.displayName = "FeedbackSlider";
