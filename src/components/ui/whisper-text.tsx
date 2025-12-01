import React, { useLayoutEffect, useRef, useState, useEffect } from "react";

// Lazy load GSAP to reduce initial bundle size
let gsap: any;
let ScrollTrigger: any;
let gsapLoaded = false;

const loadGSAP = async () => {
  if (gsapLoaded) return;
  const gsapModule = await import("gsap");
  const scrollTriggerModule = await import("gsap/ScrollTrigger");
  gsap = gsapModule.gsap;
  ScrollTrigger = scrollTriggerModule.ScrollTrigger;
gsap.registerPlugin(ScrollTrigger);
  gsapLoaded = true;
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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadGSAP().then(() => setIsLoaded(true));
  }, []);

  useLayoutEffect(() => {
    if (!isLoaded || !gsap || !ScrollTrigger) return;

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
  }, [text, delay, duration, x, y, triggerStart, isLoaded]);

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

