import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Phone, Calendar, MessageSquare, Users, Target, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import ModalVideo from './ModalVideo';
import { cn } from '../lib/utils';

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
  { id: 9, icon: IconClock, className: 'top-[82%] md:top-[60%] left-[15%] md:left-[2%]' },
];

// Stable random durations per icon (avoids recalculation on re-render)
const floatDurations = heroIcons.map((_, i) => 5 + ((i * 3.7) % 5));

// A single icon component with its own motion logic
const FloatingIcon = React.memo(({
  mouseX,
  mouseY,
  iconData,
  index,
}: {
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
  iconData: IconData;
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Motion values for the icon's position, with spring physics for smooth movement
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  // Single RAF-throttled mousemove listener instead of one per icon
  useEffect(() => {
    let rafId: number | null = null;

    const update = () => {
      rafId = null;
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const dx = mouseX.current - (rect.left + rect.width / 2);
        const dy = mouseY.current - (rect.top + rect.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          const angle = Math.atan2(dy, dx);
          const force = (1 - distance / 150) * 50;
          x.set(-Math.cos(angle) * force);
          y.set(-Math.sin(angle) * force);
        } else {
          x.set(0);
          y.set(0);
        }
      }
    };

    const handleMouseMove = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(update);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [x, y, mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      key={iconData.id}
      style={{
        x: springX,
        y: springY,
        willChange: 'transform',
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: 1.2 + index * 0.1,
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn('absolute', iconData.className)}
    >
      {/* Inner wrapper for the continuous floating animation */}
      <motion.div
        className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 p-3 rounded-3xl shadow-xl bg-white/90 backdrop-blur-md border border-gray-200/50"
        style={{ willChange: 'transform' }}
        animate={{
          y: [0, -8, 0, 8, 0],
          x: [0, 6, 0, -6, 0],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: floatDurations[index],
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      >
        <iconData.icon className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
      </motion.div>
    </motion.div>
  );
});

const Hero: React.FC = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const navigate = useNavigate();
  const [titleNumber, setTitleNumber] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Refs to track the raw mouse position
  const mouseX = useRef(0);
  const mouseY = useRef(0);

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
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    mouseX.current = event.clientX;
    mouseY.current = event.clientY;
  };

  return (
    <>
      {/* White cover to hide the blue body background above the hero */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-white z-[0]" />
      <section
        id="hero"
        className="relative -mt-32 pb-32 md:pb-64 lg:-mt-40 lg:pb-96 overflow-visible z-[1] bg-white py-12 md:py-16 lg:py-24"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 92%, 0 100%)' }}
        onMouseMove={handleMouseMove}
      >
        {/* Container for the background floating icons */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {heroIcons.slice(0, isMobile ? 3 : heroIcons.length).map((iconData, index) => (
            <FloatingIcon
              key={iconData.id}
              mouseX={mouseX}
              mouseY={mouseY}
              iconData={iconData}
              index={index}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 text-center pt-8 md:pt-12 lg:pt-16">
            {/* Animated Headline */}
            <motion.div
              className="flex justify-center mb-6 relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="flex gap-4 flex-col items-center w-full max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl lg:text-6xl max-w-4xl tracking-tighter font-bold text-text-main flex items-center justify-center gap-1 md:gap-2 flex-nowrap pl-8 md:pl-16">
                  <motion.span
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    NEVER
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    MISS
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    A
                  </motion.span>

                  <span className="relative inline-flex items-center justify-start overflow-hidden h-[1.2em] min-h-[1.2em]" style={{ contain: 'layout style paint', width: '4.5em' }}>
                    {titles.map((title, index) => (
                      <motion.span
                        key={index}
                        className="absolute left-0 text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600 whitespace-nowrap"
                        initial={{ opacity: 0, y: "-100" }}
                        transition={{ type: "spring", stiffness: 50 }}
                        animate={
                          titleNumber === index
                            ? {
                              y: 0,
                              opacity: 1,
                            }
                            : {
                              y: titleNumber > index ? -150 : 150,
                              opacity: 0,
                            }
                        }
                        style={{ willChange: 'transform, opacity' }}
                      >
                        {title}
                      </motion.span>
                    ))}
                  </span>
                </h1>
              </div>
            </motion.div>

            {/* Subheadline */}
            <motion.p
              className="text-base md:text-xl text-text-muted mb-8 max-w-2xl mx-auto px-2 md:px-0 leading-relaxed relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            >
              We answer calls 24/7, respond to website visitors instantly, and book appointments for you.
            </motion.p>


            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.95, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <PopButton
                color="blue"
                size="lg"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="min-h-11 w-48"
              >
                Learn More
              </PopButton>
              <InteractiveHoverButton
                text="Start free"
                onClick={() => navigate('/signup')}
                className="min-h-11 w-48 border-gray-300 bg-white text-gray-900 py-2.5 px-6"
                hoverBgClass="bg-brand-blue"
                hoverTextClass="text-white"
              />
            </motion.div>

          </div>
        </div>

        {/* Video Modal */}
        <ModalVideo
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
        />
      </section>
    </>
  );
};

export default Hero;
