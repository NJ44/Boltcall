import React, { useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, LayoutGroup } from 'framer-motion';
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
        {/* Parallax floating cards */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <Floating sensitivity={-0.5} className="h-full">

            {/* Top-left — Call answered */}
            <FloatingElement depth={0.5} className="top-[26%] left-[8%] md:top-[28%] md:left-[10%]">
              <motion.div
                className="-rotate-[3deg] hover:scale-105 transition-transform duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="bg-white rounded-2xl shadow-2xl p-3 w-40">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 text-sm">📞</div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-gray-900 leading-tight">Call Answered</p>
                      <p className="text-[10px] text-green-600 font-medium flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>Live · 0.3s
                      </p>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500">John M. · HVAC Repair</p>
                </div>
              </motion.div>
            </FloatingElement>

            {/* Top-left large — Business stats */}
            <FloatingElement depth={1} className="top-[12%] left-[4%] md:top-[14%] md:left-[6%]">
              <motion.div
                className="-rotate-12 hover:scale-105 transition-transform duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="bg-white rounded-2xl shadow-2xl p-3 w-52">
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-sm">🌐</div>
                    <div>
                      <p className="text-[11px] font-semibold text-gray-900">Mike's HVAC Tampa</p>
                      <p className="text-[10px] text-gray-400">mikeshvac.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="text-[13px] font-bold text-gray-900">4.9★</p>
                      <p className="text-[9px] text-gray-400">Rating</p>
                    </div>
                    <div className="w-px h-6 bg-gray-100"></div>
                    <div className="text-center">
                      <p className="text-[13px] font-bold text-gray-900">100%</p>
                      <p className="text-[9px] text-gray-400">Response</p>
                    </div>
                    <div className="w-px h-6 bg-gray-100"></div>
                    <div className="text-center">
                      <p className="text-[13px] font-bold text-green-600">+$12k</p>
                      <p className="text-[9px] text-gray-400">This mo.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </FloatingElement>

            {/* Bottom-left — SMS thread */}
            <FloatingElement depth={4} className="top-[60%] left-[8%] md:top-[52%] md:left-[12%]">
              <motion.div
                className="-rotate-[4deg] hover:scale-105 transition-transform duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <div className="bg-white rounded-2xl shadow-2xl p-3 w-44">
                  <p className="text-[10px] font-semibold text-gray-400 mb-2">SMS · Just now</p>
                  <div className="space-y-1.5">
                    <div className="bg-gray-100 rounded-xl rounded-bl-sm px-2.5 py-1.5 max-w-[90%]">
                      <p className="text-[10px] text-gray-800">Hi! Got your request — does 3pm Tue work?</p>
                    </div>
                    <div className="bg-blue-600 rounded-xl rounded-br-sm px-2.5 py-1.5 max-w-[75%] ml-auto">
                      <p className="text-[10px] text-white">Yes, perfect!</p>
                    </div>
                    <div className="bg-gray-100 rounded-xl rounded-bl-sm px-2.5 py-1.5 max-w-[90%]">
                      <p className="text-[10px] text-gray-800">✅ Booked for Tue 3pm. See you then!</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </FloatingElement>

            {/* Top-right — New lead notification */}
            <FloatingElement depth={2} className="top-[10%] left-[72%] md:top-[14%] md:left-[70%]">
              <motion.div
                className="rotate-[6deg] hover:scale-105 transition-transform duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                <div className="bg-white rounded-2xl shadow-2xl p-3 w-44">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0 text-sm">🔔</div>
                    <div>
                      <p className="text-[11px] font-semibold text-gray-900">New Lead</p>
                      <p className="text-[10px] text-gray-400">Via Facebook Ad</p>
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-lg px-2 py-1.5">
                    <p className="text-[10px] font-medium text-orange-800">AC Repair · Est. $1,200</p>
                  </div>
                  <p className="text-[9px] text-gray-400 mt-1.5">AI replied in 0.4s ✓</p>
                </div>
              </motion.div>
            </FloatingElement>

            {/* Bottom-right — Appointment booked */}
            <FloatingElement depth={1} className="top-[56%] left-[62%] md:top-[48%] md:left-[60%]">
              <motion.div
                className="rotate-[14deg] hover:scale-105 transition-transform duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                <div className="bg-white rounded-2xl shadow-2xl p-3 w-44">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-sm">📅</div>
                    <div>
                      <p className="text-[11px] font-semibold text-gray-900">Appointment Booked</p>
                      <p className="text-[10px] text-blue-600 font-medium">✓ Confirmed</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <p className="text-[10px] text-gray-400">Date</p>
                      <p className="text-[10px] font-medium text-gray-800">Tue, May 7 · 3pm</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-[10px] text-gray-400">Service</p>
                      <p className="text-[10px] font-medium text-gray-800">AC Checkup</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-[10px] text-gray-400">Tech</p>
                      <p className="text-[10px] font-medium text-gray-800">Mike R.</p>
                    </div>
                  </div>
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
