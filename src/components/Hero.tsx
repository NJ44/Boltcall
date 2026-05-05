import React, { useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, LayoutGroup } from 'framer-motion';
import { TextRotate } from './ui/text-rotate';
import Floating, { FloatingElement } from './ui/parallax-floating';

const ModalVideo = React.lazy(() => import('./ModalVideo'));

const floatingImages = [
  {
    url: "https://images.unsplash.com/photo-1758876201450-cf77ab8b95bc?q=80&w=800&auto=format&fit=crop",
    alt: "Phone call being answered",
  },
  {
    url: "https://images.unsplash.com/photo-1522202195465-df8a5f26fa15?q=80&w=800&auto=format&fit=crop",
    alt: "Local business website on laptop",
  },
  {
    url: "https://images.unsplash.com/photo-1606495813362-8efff01b8573?q=80&w=800&auto=format&fit=crop",
    alt: "SMS text conversation",
  },
  {
    url: "https://images.unsplash.com/photo-1745848413078-f85af10e5bf2?q=80&w=800&auto=format&fit=crop",
    alt: "Social media ad on phone",
  },
  {
    url: "https://images.unsplash.com/photo-1631972757546-a9c28c924c2b?q=80&w=800&auto=format&fit=crop",
    alt: "Appointment calendar booking",
  },
];

const Hero: React.FC = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
      <section
        id="hero"
        className="relative -mt-32 pb-32 md:pb-64 lg:-mt-40 lg:pb-96 overflow-hidden z-[1] bg-white"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 92%, 0 100%)' }}
      >
        {/* Parallax floating images */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <Floating sensitivity={-0.5} className="h-full">
            {/* Top-left small */}
            <FloatingElement
              depth={0.5}
              className="top-[18%] left-[2%] md:top-[22%] md:left-[4%]"
            >
              <motion.img
                src={floatingImages[0].url}
                alt={floatingImages[0].alt}
                className="w-16 h-12 sm:w-24 sm:h-16 md:w-28 md:h-20 lg:w-32 lg:h-24 object-cover rounded-2xl shadow-2xl -rotate-[3deg] hover:scale-105 transition-transform duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              />
            </FloatingElement>

            {/* Top-left large */}
            <FloatingElement
              depth={1}
              className="top-[3%] left-[6%] md:top-[8%] md:left-[9%]"
            >
              <motion.img
                src={floatingImages[1].url}
                alt={floatingImages[1].alt}
                className="w-36 h-24 sm:w-44 sm:h-32 md:w-52 md:h-40 lg:w-56 lg:h-44 object-cover rounded-2xl shadow-2xl -rotate-12 hover:scale-105 transition-transform duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              />
            </FloatingElement>

            {/* Bottom-left */}
            <FloatingElement
              depth={4}
              className="top-[72%] left-[4%] md:top-[65%] md:left-[6%]"
            >
              <motion.img
                src={floatingImages[2].url}
                alt={floatingImages[2].alt}
                className="w-36 h-36 sm:w-44 sm:h-44 md:w-56 md:h-56 lg:w-60 lg:h-60 object-cover rounded-2xl shadow-2xl -rotate-[4deg] hover:scale-105 transition-transform duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              />
            </FloatingElement>

            {/* Top-right */}
            <FloatingElement
              depth={2}
              className="top-[2%] left-[84%] md:top-[4%] md:left-[80%]"
            >
              <motion.img
                src={floatingImages[3].url}
                alt={floatingImages[3].alt}
                className="w-36 h-32 sm:w-44 sm:h-40 md:w-56 md:h-48 lg:w-60 lg:h-52 object-cover rounded-2xl shadow-2xl rotate-[6deg] hover:scale-105 transition-transform duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              />
            </FloatingElement>

            {/* Bottom-right */}
            <FloatingElement
              depth={1}
              className="top-[68%] left-[80%] md:top-[60%] md:left-[80%]"
            >
              <motion.img
                src={floatingImages[4].url}
                alt={floatingImages[4].alt}
                className="w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 object-cover rounded-2xl shadow-2xl rotate-[14deg] hover:scale-105 transition-transform duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              />
            </FloatingElement>
          </Floating>
        </div>

        {/* Center content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 text-center pt-32 md:pt-44 lg:pt-52 pb-12">

            {/* Animated Headline */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-text-main flex flex-col items-center justify-center leading-tight space-y-1 md:space-y-2 mb-6"
              style={{ fontFamily: "'Sora', sans-serif" }}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
            >
              <span className="speakable-intro">NEVER MISS A</span>

              <LayoutGroup>
                <motion.span layout className="flex items-center whitespace-pre">
                  <TextRotate
                    texts={["CALL", "LEAD", "TEXT", "REVIEW", "REPLY"]}
                    mainClassName="overflow-hidden text-blue-600 py-0 pb-1 md:pb-2 rounded-xl"
                    staggerDuration={0.04}
                    staggerFrom="last"
                    rotationInterval={1750}
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  />
                </motion.span>
              </LayoutGroup>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-base md:text-xl text-text-muted mb-8 max-w-2xl mx-auto px-2 md:px-0 leading-relaxed"
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 }}
            >
              Every lead responded to instantly. Every opportunity booked on your calendar. 24/7, on autopilot.
            </motion.p>

            {/* CTA Buttons — primary action first */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4"
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.7 }}
            >
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200"
              >
                Start For Free
              </Link>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200"
              >
                See How It Works
              </button>
            </motion.div>

          </div>
        </div>

        {/* Video Modal — lazy loaded */}
        {isVideoOpen && (
          <Suspense fallback={null}>
            <ModalVideo
              isOpen={isVideoOpen}
              onClose={() => setIsVideoOpen(false)}
            />
          </Suspense>
        )}
      </section>
    </>
  );
};

export default Hero;
