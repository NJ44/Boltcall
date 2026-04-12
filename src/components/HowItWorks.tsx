import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import WhisperText from './ui/whisper-text';

const PROCESS_PHASES = [
  {
    id: "process-1",
    title: "Capture every lead",
    description:
      "Your AI receptionist picks up every call — day, night, weekends, holidays. It responds to website forms and ad inquiries instantly. It collects the caller's name, number, and what they need. No lead slips through.",
  },
  {
    id: "process-2",
    title: "Qualify serious buyers",
    description:
      "It asks the right questions, just like your best front-desk person would. It figures out what the caller needs, how urgent it is, and whether they're ready to move forward. You only spend time on people who are ready to buy.",
  },
  {
    id: "process-3",
    title: "Book the appointment",
    description:
      "When a caller is ready, your AI receptionist checks your calendar, finds an open slot, and books them in. It confirms the time, sends a reminder, and reduces no-shows by 40%.",
  },
];

const HowItWorks: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let ctx: any;

    const init = async () => {
      const gsapModule = await import('gsap');
      const stModule = await import('gsap/ScrollTrigger');
      const gsap = gsapModule.gsap;
      const ScrollTrigger = stModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      // Connect Lenis to ScrollTrigger if active
      if (window.lenis) {
        window.lenis.on('scroll', ScrollTrigger.update);
      }

      ctx = gsap.context(() => {
        const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
        const cardsContainer = cardsContainerRef.current;

        // Pin the sidebar header for the entire cards scroll duration
        if (sidebarRef.current && cardsContainer) {
          ScrollTrigger.create({
            trigger: sidebarRef.current,
            start: 'top 150px',
            endTrigger: cardsContainer,
            end: 'bottom bottom',
            pin: true,
            pinSpacing: false,
            pinType: 'transform',
          });
        }

        cards.forEach((card, i) => {
          const pinTop = 150 + i * 30;

          // Pin each card using transforms (immune to overflow:hidden on ancestors)
          ScrollTrigger.create({
            trigger: card,
            start: `top ${pinTop}px`,
            end: `+=${window.innerHeight * 0.5}`,
            pin: true,
            pinSpacing: true,
            pinType: 'transform',
          });

          // Fade + slide in as card enters viewport
          gsap.fromTo(
            card,
            { y: 80, opacity: 0, scale: 0.95 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                end: 'top 60%',
                scrub: 1,
              },
            }
          );
        });
      }, sectionRef);
    };

    init();

    return () => {
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative py-16 bg-transparent mt-[200px]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid md:grid-cols-2 md:gap-8 xl:gap-12">
          {/* Section Header - Pinned Sidebar */}
          <div ref={sidebarRef} className="left-0 ml-4 pt-12 md:pt-0 pr-2" style={{ height: 'fit-content' }}>
            <motion.h5
              className="text-sm uppercase tracking-wide font-medium text-white/70 mb-4 ml-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              How It Works
            </motion.h5>
            <h2 className="font-bold mb-5 ml-5 text-3xl md:text-[44px] leading-tight">
              <WhisperText
                text="Close leads in "
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white inline-block"
                delay={125}
                duration={0.625}
                x={-20}
                y={0}
                triggerStart="top 85%"
                style={{ fontSize: '1.155em' }}
              /><WhisperText
                text="lightning speed."
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-500 inline-block"
                delay={125}
                duration={0.625}
                x={-20}
                y={0}
                triggerStart="top 85%"
                style={{ fontSize: '1.155em' }}
              />
            </h2>
            <motion.p
              className="max-w-prose text-base md:text-lg leading-relaxed text-white/80 mt-5 ml-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Your helper works all day and all night. It talks to people right away. It books appointments for you. You never miss a chance to get a new customer.
            </motion.p>
          </div>

          {/* Scroll-Pinned Stacking Cards */}
          <div ref={cardsContainerRef} className="py-4 ml-0 md:ml-16">
            {PROCESS_PHASES.map((phase, index) => (
              <div
                key={phase.id}
                ref={(el) => { cardsRef.current[index] = el; }}
                className={`rounded-2xl border-2 border-gray-200 bg-white shadow-2xl overflow-hidden max-w-full md:max-w-[440px] relative ${index < PROCESS_PHASES.length - 1 ? 'mb-16' : ''} ${index === 0 ? 'mt-20 md:mt-0' : ''}`}
                style={{ minHeight: '280px', zIndex: index + 1 }}
              >
                <div className="relative z-10 p-4 md:p-7 h-full">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-[calc(1.25rem*0.97*0.97*0.97)] md:text-[calc(1.875rem*0.97*0.97*0.97)] lg:text-[calc(2.25rem*0.97*0.97*0.97)] font-bold tracking-tight text-gray-900">
                        {phase.title}
                      </h2>
                      <div className="bg-blue-600 text-white rounded-full w-9 h-9 md:w-11 md:h-11 flex items-center justify-center flex-shrink-0">
                        <span className="text-base md:text-lg font-bold">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-5">{phase.description}</p>
                  </div>
                </div>
                {/* Blue gradient from bottom */}
                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-blue-100 via-blue-50/60 to-transparent pointer-events-none z-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
