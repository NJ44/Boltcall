import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Phone, Calendar, MessageSquare, Users, Target, Clock } from 'lucide-react';
import Button from './ui/Button';
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
  { id: 1, icon: IconPhone, className: 'top-[10%] left-[10%]' },
  { id: 2, icon: IconCalendar, className: 'top-[20%] right-[8%]' },
  { id: 3, icon: IconSMS, className: 'top-[70%] left-[10%]' },
  { id: 6, icon: IconUsers, className: 'top-[40%] left-[15%]' },
  { id: 7, icon: IconTarget, className: 'top-[65%] right-[25%]' },
  { id: 8, icon: IconSMS2, className: 'top-[50%] right-[5%]' },
  { id: 9, icon: IconClock, className: 'top-[55%] left-[5%]' },
];

// A single icon component with its own motion logic
const FloatingIcon = ({
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

  useEffect(() => {
    const handleMouseMove = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const distance = Math.sqrt(
          Math.pow(mouseX.current - (rect.left + rect.width / 2), 2) +
          Math.pow(mouseY.current - (rect.top + rect.height / 2), 2)
        );

        // If the cursor is close enough, repel the icon
        if (distance < 150) {
          const angle = Math.atan2(
            mouseY.current - (rect.top + rect.height / 2),
            mouseX.current - (rect.left + rect.width / 2)
          );

          // The closer the cursor, the stronger the repulsion
          const force = (1 - distance / 150) * 50;
          x.set(-Math.cos(angle) * force);
          y.set(-Math.sin(angle) * force);
        } else {
          // Return to original position when cursor is away
          x.set(0);
          y.set(0);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y, mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      key={iconData.id}
      style={{
        x: springX,
        y: springY,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.08,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn('absolute', iconData.className)}
    >
      {/* Inner wrapper for the continuous floating animation */}
      <motion.div
        className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 p-3 rounded-3xl shadow-xl bg-white/90 backdrop-blur-md border border-gray-200/50"
        animate={{
          y: [0, -8, 0, 8, 0],
          x: [0, 6, 0, -6, 0],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 5 + Math.random() * 5,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      >
        <iconData.icon className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
      </motion.div>
    </motion.div>
  );
};

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
      <section
        id="hero"
        className="relative -mt-24 pb-64 lg:-mt-32 lg:pb-96 overflow-visible z-[1] bg-gradient-to-b from-white to-light-blue dark:from-gray-900 dark:to-gray-800 py-16 lg:py-24"
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

        <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
          <div className="relative z-10 text-center pt-24 md:pt-16 lg:pt-20">
            {/* Animated Headline */}
            <div className="flex justify-center mb-6 relative z-10">
              <div className="flex gap-4 flex-col items-center w-full max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-5xl lg:text-6xl max-w-4xl tracking-tighter font-bold text-text-main flex items-center justify-center gap-1 md:gap-2 flex-nowrap ml-4 md:ml-56 scale-110 md:scale-100 translate-x-5 md:translate-x-0">
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.625, delay: 0.2, ease: "easeOut" }}
                  >
                    NEVER
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.625, delay: 0.3, ease: "easeOut" }}
                  >
                    MISS
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.625, delay: 0.4, ease: "easeOut" }}
                  >
                    A
                  </motion.span>

                  <span className="relative inline-flex items-center justify-start overflow-hidden min-w-[180px] md:min-w-[380px] h-[1.2em] min-h-[1.2em]" style={{ contain: 'layout style paint' }}>
                    {titles.map((title, index) => (
                      <motion.span
                        key={index}
                        className="absolute text-3xl md:text-5xl lg:text-6xl font-bold text-blue-600 whitespace-nowrap"
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
            </div>

            {/* Subheadline */}
            <motion.p
              className="text-lg md:text-xl text-text-muted mb-8 max-w-2xl mx-auto leading-relaxed relative z-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              We answer calls 24/7, respond to website visitors instantly, and book appointments for you.
            </motion.p>


            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 relative z-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0 }}
            >
              <Button
                onClick={() => {
                  const howItWorksSection = document.getElementById('how-it-works');
                  if (howItWorksSection) {
                    howItWorksSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                variant="squarespace-outline"
                size="lg"
                className="w-[85%] sm:w-auto"
              >
                Learn more
              </Button>
              <Button
                onClick={() => navigate('/coming-soon')}
                variant="squarespace"
                size="lg"
                className="w-[85%] sm:w-auto"
              >
                5-Min Free Setup
              </Button>
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
