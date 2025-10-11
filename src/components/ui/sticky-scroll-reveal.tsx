"use client";

import React, { useRef } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { TrendingUp, Clock, Target, Heart } from "lucide-react";

export const StickyScroll = ({ content, contentClassName }: { content: { title: string; description: string; content?: React.ReactNode | any; }[]; contentClassName?: string; }) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.6", "end 0.4"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });


  return (
    <motion.div
      className="min-h-screen flex justify-center relative space-x-10 rounded-md p-10"
      ref={ref}
    >
      <div className="div relative flex items-start px-4">
        <div className="max-w-2xl">
          {content.map((item, index) => {
            const icons = [TrendingUp, Clock, Target, Heart];
            const Icon = icons[index];
            
            return (
              <div key={item.title + index} className="my-12 min-h-[48vh] flex flex-col justify-center">
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: activeCard === index ? 1 : 0.3,
                  }}
                  className="p-8 rounded-2xl shadow-2xl transition-all duration-500 bg-gradient-to-br from-black/90 via-gray-900/90 to-gray-800/90 backdrop-blur-sm"
                >
                  <div className="mb-4">
                    <Icon className="w-10 h-10 text-white/80" strokeWidth={1.5} />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {item.title}
                  </h2>
                  <p className="text-lg text-white/90 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              </div>
            );
          })}
          {/* Extra space to allow last section to reach center */}
          <div className="h-[50vh]" />
        </div>
      </div>
      <div
        className={cn(
          "hidden lg:block h-[488px] w-[488px] sticky top-1/2 -translate-y-1/2 mt-52",
          contentClassName
        )}
      >
        {content[activeCard].content ?? null}
      </div>
    </motion.div>
  );
};
