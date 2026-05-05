import React, { useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, LayoutGroup } from 'framer-motion';
import { Phone, Calendar, MessageSquare, Users, Star } from 'lucide-react';
import { TextRotate } from './ui/text-rotate';
import Floating, { FloatingElement } from './ui/parallax-floating';

const ModalVideo = React.lazy(() => import('./ModalVideo'));

const Hero: React.FC = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
      <section
        id="hero"
        className="relative -mt-32 pb-32 md:pb-64 lg:-mt-40 lg:pb-96 overflow-hidden z-[1] bg-white"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 92%, 0 100%)' }}
      >
        {/* Parallax floating icon boxes */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <Floating sensitivity={-0.5} className="h-full">

            {/* Top-left — Phone */}
            <FloatingElement depth={0.5} className="top-[14%] left-[8%] md:top-[15%] md:left-[10%]">
              <motion.div
                className="-rotate-[6deg] hover:scale-105 transition-transform duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-3xl shadow-xl bg-white border border-gray-100">
                  <Phone className="w-8 h-8 md:w-10 md:h-10 text-blue-600" strokeWidth={2.5} />
                </div>
              </motion.div>
            </FloatingElement>

            {/* Middle-left — Users */}
            <FloatingElement depth={1} className="top-[52%] left-[10%] md:top-[48%] md:left-[12%]">
              <motion.div
                className="-rotate-[3deg] hover:scale-105 transition-transform duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-3xl shadow-xl bg-white border border-gray-100">
                  <Users className="w-8 h-8 md:w-10 md:h-10 text-blue-600" strokeWidth={2.5} />
                </div>
              </motion.div>
            </FloatingElement>

            {/* Bottom-left — Star */}
            <FloatingElement depth={4} className="top-[68%] left-[6%] md:top-[65%] md:left-[8%]">
              <motion.div
                className="rotate-[5deg] hover:scale-105 transition-transform duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-3xl shadow-xl bg-white border border-gray-100">
                  <Star className="w-7 h-7 md:w-8 md:h-8 text-blue-600" strokeWidth={2.5} />
                </div>
              </motion.div>
            </FloatingElement>

            {/* Top-right — Calendar */}
            <FloatingElement depth={2} className="top-[12%] left-[78%] md:top-[15%] md:left-[76%]">
              <motion.div
                className="rotate-[6deg] hover:scale-105 transition-transform duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-3xl shadow-xl bg-white border border-gray-100">
                  <Calendar className="w-8 h-8 md:w-10 md:h-10 text-blue-600" strokeWidth={2.5} />
                </div>
              </motion.div>
            </FloatingElement>

            {/* Bottom-right — MessageSquare */}
            <FloatingElement depth={1} className="top-[55%] left-[70%] md:top-[50%] md:left-[68%]">
              <motion.div
                className="-rotate-[8deg] hover:scale-105 transition-transform duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-3xl shadow-xl bg-white border border-gray-100">
                  <MessageSquare className="w-8 h-8 md:w-10 md:h-10 text-blue-600" strokeWidth={2.5} />
                </div>
              </motion.div>
            </FloatingElement>

          </Floating>
        </div>

        {/* Center content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 text-center pt-32 md:pt-44 lg:pt-52 pb-12">

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-text-main flex flex-col items-center justify-center leading-tight space-y-1 md:space-y-2 mb-6"
              style={{ fontFamily: "'Sora', sans-serif" }}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
            >
              <span className="speakable-intro">NEVER MISS</span>
              <LayoutGroup>
                <motion.span layout className="flex items-center whitespace-pre">
                  <span>A </span>
                  <TextRotate
                    texts={["CALL", "LEAD", "TEXT", "REVIEW", "REPLY"]}
                    mainClassName="text-blue-600 py-0 pb-1 md:pb-2 rounded-xl"
                    staggerDuration={0.04}
                    staggerFrom="last"
                    rotationInterval={1750}
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  />
                </motion.span>
              </LayoutGroup>
            </motion.h1>

            <motion.p
              className="text-base md:text-xl text-text-muted mb-8 max-w-2xl mx-auto px-2 md:px-0 leading-relaxed"
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 }}
            >
              The Speed To Lead System for local businesses
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4"
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.7 }}
            >
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200"
              >
                Start For Free
              </Link>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200"
              >
                See How It Works
              </button>
            </motion.div>

          </div>
        </div>

        {isVideoOpen && (
          <Suspense fallback={null}>
            <ModalVideo isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
          </Suspense>
        )}
      </section>
    </>
  );
};

export default Hero;
