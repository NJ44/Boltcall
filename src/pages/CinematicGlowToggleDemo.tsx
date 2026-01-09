"use client";

import React from "react";
import CinematicSwitch from "@/components/ui/cinematic-glow-toggle";

const CinematicGlowToggleDemo: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center">
      <CinematicSwitch />
    </div>
  );
};

export default CinematicGlowToggleDemo;


