import React, { useLayoutEffect, useRef, useState, useEffect } from "react";

type AnimationModules = {
  gsap: typeof import("gsap")["gsap"];
  ScrollTrigger: typeof import("gsap/ScrollTrigger")["ScrollTrigger"];
};

// Share pending imports across headings and start both before either resolves.
let animationModules: Promise<AnimationModules> | undefined;
const loadGSAP = () => {
  animationModules ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
    .then(([{ gsap }, { ScrollTrigger }]) => ({ gsap, ScrollTrigger }))
    .catch(error => { animationModules = undefined; throw error; });
  return animationModules;
};

interface WhisperTextProps {
  text: string;
  className?: string;
  delay?: number; 
  duration?: number; 
  x?: number;   
  y?: number;  
  triggerStart?: string;
  style?: React.CSSProperties;
  wordStyles?: { [key: string]: React.CSSProperties };
}

const WhisperText: React.FC<WhisperTextProps> = ({
  text,
  className = "",
  delay = 80,
  duration = 0.4,
  x = 0,
  y = 0,
  triggerStart = "top 90%",
  style,
  wordStyles = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gsap, setGsap] = useState<AnimationModules["gsap"] | null>(null);

  useEffect(() => {
    let active = true;
    loadGSAP().then(({ gsap, ScrollTrigger }) => {
      if (!active) return;
      gsap.registerPlugin(ScrollTrigger);
      setGsap(gsap);
    }).catch(error => {
      if (active) console.warn("WhisperText animation unavailable; displaying static text.", error);
    });
    return () => { active = false; };
  }, []);

  useLayoutEffect(() => {
    if (!gsap) return;

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray("[data-word]") as HTMLElement[];

      gsap.set(targets, { opacity: 0, x, y });

      gsap.to(targets, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: triggerStart,
          toggleActions: "play none none none",
          once: true,
        },
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        ease: "power2.out",
        stagger: delay / 1000,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [text, delay, duration, x, y, triggerStart, gsap]);

  const renderWords = () =>
    text.split(" ").map((word, i) => (
      <span
        key={i}
        data-word
        className="inline-block whitespace-nowrap"
        style={{ 
          position: "relative",
          ...wordStyles[word]
        }}
      >
        {word}
      </span>
    ));

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex flex-wrap gap-x-2 ${className}`}
      style={{ overflow: "visible", ...style }}
    >
      {renderWords()}
    </div>
  );
};

export default WhisperText;

