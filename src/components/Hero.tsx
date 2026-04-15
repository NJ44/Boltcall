import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Calendar, MessageSquare, Users, Target, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

// Lazy-load ModalVideo since it's only shown on user interaction
const ModalVideo = React.lazy(() => import('./ModalVideo'));

// Business-related icon components using lucide-react
const IconPhone = (props: React.SVGProps<SVGSVGElement>) => <Phone {...props} strokeWidth={2.5} />;
const IconCalendar = (props: React.SVGProps<SVGSVGElement>) => <Calendar {...props} strokeWidth={2.5} />;
const IconSMS = (props: React.SVGProps<SVGSVGElement>) => <MessageSquare {...props} strokeWidth={2.5} />;
const IconUsers = (props: React.SVGProps<SVGSVGElement>) => <Users {...props} strokeWidth={2.5} />;
const IconTarget = (props: React.SVGProps<SVGSVGElement>) => <Target {...props} strokeWidth={2.5} />;
const IconSMS2 = (props: React.SVGProps<SVGSVGElement>) => <MessageSquare {...props} strokeWidth={2.5} />;
const IconClock = (props: React.SVGProps<SVGSVGElement>) => <Clock {...props} strokeWidth={2.5} />;

interface IconData {
  id: number;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  className: string;
}

// Define the icons with their unique positions
const heroIcons: IconData[] = [
  { id: 1, icon: IconPhone, className: 'top-[55%] md:top-[15%] left-[2%] md:left-[3%]' },
  { id: 2, icon: IconCalendar, className: 'top-[60%] md:top-[20%] right-[2%] md:right-[3%]' },
  { id: 3, icon: IconSMS, className: 'top-[75%] md:top-[70%] left-[5%]' },
  { id: 6, icon: IconUsers, className: 'top-[68%] md:top-[45%] left-[3%] md:left-[5%]' },
  { id: 7, icon: IconTarget, className: 'top-[80%] md:top-[65%] right-[15%] md:right-[20%]' },
  { id: 8, icon: IconSMS2, className: 'top-[72%] md:top-[50%] right-[1%] md:right-[2%]' },
  { id: 9, icon: IconClock, className: 'top-[82%] md:top-[70%] right-[5%] md:right-[4%]' },
];

// Stable float durations per icon
const floatDurations = heroIcons.map((_, i) => 5 + ((i * 3.7) % 5));

// CSS keyframes injected once
const styleId = 'hero-float-keyframes';
if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    @keyframes heroFadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes heroFadeInScale {
      from { opacity: 0; transform: scale(0.5); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes heroFloat {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      25% { transform: translate(6px, -8px) rotate(5deg); }
      50% { transform: translate(0, 0) rotate(0deg); }
      75% { transform: translate(-6px, 8px) rotate(-5deg); }
    }
    @keyframes heroWordFadeUp {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}

// A single floating icon — pure CSS animation
const FloatingIcon = React.memo(({
  iconData,
  index,
}: {
  iconData: IconData;
  index: number;
}) => {
  return (
    <div
      className={cn('absolute', iconData.className)}
      style={{
        opacity: 0,
        animation: `heroFadeInScale 0.7s cubic-bezier(0.25, 0.1, 0.25, 1) ${1.2 + index * 0.1}s forwards`,
        willChange: 'transform, opacity',
      }}
    >
      <div
        className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 p-3 rounded-3xl shadow-xl bg-white/90 backdrop-blur-md border border-gray-200/50"
        style={{
          animation: `heroFloat ${floatDurations[index]}s ease-in-out infinite alternate`,
          willChange: 'transform',
        }}
      >
        <iconData.icon className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
      </div>
    </div>
  );
});

const Hero: React.FC = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [titleNumber, setTitleNumber] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const titles = useMemo(
    () => ["CALL", "LEAD", "TEXT", "REVIEW", "REPLY"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 1750);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <>
      <section
        id="hero"
        className="relative -mt-32 pb-32 md:pb-64 lg:-mt-40 lg:pb-96 overflow-visible z-[1] bg-white py-12 md:py-16 lg:py-24"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 92%, 0 100%)' }}
      >
        {/* Container for the background floating icons */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {heroIcons.slice(0, isMobile ? 3 : heroIcons.length).map((iconData, index) => (
            <FloatingIcon
              key={iconData.id}
              iconData={iconData}
              index={index}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 text-center pt-8 md:pt-12 lg:pt-16">
            {/* Animated Headline */}
            <div
              className="flex justify-center mb-6 relative z-10"
              style={{
                opacity: 0,
                animation: 'heroFadeInUp 0.7s cubic-bezier(0.25, 0.1, 0.25, 1) 0.1s forwards',
              }}
            >
              <div className="flex gap-4 flex-col items-center w-full max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl lg:text-6xl max-w-4xl tracking-tighter font-bold text-text-main flex items-center justify-center gap-1 md:gap-2 flex-nowrap pl-8 md:pl-16">
                  <span
                    style={{
                      opacity: 0,
                      animation: 'heroWordFadeUp 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) 0.2s forwards',
                    }}
                  >
                    NEVER
                  </span>
                  <span
                    style={{
                      opacity: 0,
                      animation: 'heroWordFadeUp 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) 0.35s forwards',
                    }}
                  >
                    MISS
                  </span>
                  <span
                    style={{
                      opacity: 0,
                      animation: 'heroWordFadeUp 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) 0.5s forwards',
                    }}
                  >
                    A
                  </span>

                  <span className="relative inline-flex items-center justify-start overflow-hidden h-[1.2em] min-h-[1.2em]" style={{ contain: 'layout style paint', width: '4.5em' }}>
                    {titles.map((title, index) => (
                      <span
                        key={index}
                        className="absolute left-0 text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600 whitespace-nowrap"
                        style={{
                          transition: 'transform 0.8s cubic-bezier(0.22, 0.68, 0, 1)',
                          transform: titleNumber === index
                            ? 'translateY(0)'
                            : titleNumber > index
                              ? 'translateY(-150px)'
                              : 'translateY(150px)',
                          willChange: 'transform',
                        }}
                      >
                        {title}
                      </span>
                    ))}
                  </span>
                </h1>
              </div>
            </div>

            {/* Subheadline — "What is this?" */}
            <p
              className="text-base md:text-xl text-text-muted mb-3 max-w-2xl mx-auto px-2 md:px-0 leading-relaxed relative z-10"
              style={{
                opacity: 0,
                animation: 'heroFadeInUp 0.7s cubic-bezier(0.25, 0.1, 0.25, 1) 0.7s forwards',
              }}
            >
              Every lead responded to instantly. Every opportunity booked on your calendar. 24/7, on autopilot.
            </p>

            {/* CTA Buttons — primary action first */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4 relative z-10"
              style={{
                opacity: 0,
                animation: 'heroFadeInUp 0.7s cubic-bezier(0.25, 0.1, 0.25, 1) 0.95s forwards',
              }}
            >
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200"
              >
                Start For Free
              </Link>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200"
              >
                See How It Works
              </button>
            </div>


          </div>
        </div>

        {/* Video Modal — lazy loaded */}
        {isVideoOpen && (
          <React.Suspense fallback={null}>
            <ModalVideo
              isOpen={isVideoOpen}
              onClose={() => setIsVideoOpen(false)}
            />
          </React.Suspense>
        )}
      </section>
    </>
  );
};

export default Hero;
