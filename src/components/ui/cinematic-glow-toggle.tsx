"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CinematicSwitchProps {
  className?: string;
}

export default function CinematicSwitch({ className }: CinematicSwitchProps) {
  const [isOn, setIsOn] = useState(false);

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-2xl bg-zinc-900/70 border border-zinc-800 backdrop-blur-sm shadow-md cursor-pointer",
        className
      )}
      onClick={() => setIsOn(!isOn)}
    >
      {/* 'OFF' Label */}
      <span
        className={cn(
          "text-[10px] font-bold tracking-wider transition-colors duration-300",
          !isOn ? "text-zinc-300" : "text-zinc-600"
        )}
      >
        OFF
      </span>

      {/* Switch Track */}
      <motion.div
        className="relative w-12 h-6 rounded-full shadow-inner"
        initial={false}
        animate={{
          backgroundColor: isOn ? "#064e3b" : "#27272a", // Emerald-900 vs Zinc-800
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Switch Thumb */}
        <motion.div
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full border border-white/10 shadow-md"
          initial={false}
          animate={{
            x: isOn ? 24 : 0,
            backgroundColor: isOn ? "#34d399" : "#52525b", // Emerald-400 vs Zinc-600
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          whileTap={{ scale: 0.9 }}
        >
          {/* Thumb Highlight (Gloss) */}
          <div className="absolute top-1 left-1.5 w-2 h-1 bg-white/30 rounded-full blur-[1px]" />
        </motion.div>
      </motion.div>

      {/* 'ON' Label */}
      <span
        className={cn(
          "text-[10px] font-bold tracking-wider transition-colors duration-300",
          isOn
            ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
            : "text-zinc-600"
        )}
      >
        ON
      </span>
    </div>
  );
}


