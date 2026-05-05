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
            {/* Top-left small — phone call */}
            <FloatingElement
              depth={0.5}
              className="top-[20%] left-[8%] md:top-[24%] md:left-[12%]"
            >
              <motion.img
                src={floatingImages[0].url}
                alt={floatingImages[0].alt}
                className="w-14 h-10 sm:w-20 sm:h-14 md:w-24 md:h-16 lg:w-28 lg:h-20 object-cover rounded-2xl shadow-2xl -rotate-[3deg] hover:scale-105 transition-transform duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              />
            </FloatingElement>

            {/* Top-left large — local business website */}
            <FloatingElement
              depth={1}
              className="top-[4%] left-[10%] md:top-[8%] md:left-[14%]"
            >
              <motion.img
                src={floatingImages[1].url}
                alt={floatingImages[1].alt}
                className="w-28 h-20 sm:w-36 sm:h-24 md:w-40 md:h-28 lg:w-44 lg:h-32 object-cover rounded-2xl shadow-2xl -rotate-12 hover:scale-105 transition-transform duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              />
            </FloatingElement>

            {/* Bottom-left — SMS conversation */}
            <FloatingElement
              depth={4}
              className="top-[74%] left-[8%] md:top-[66%] md:left-[12%]"
            >
              <motion.img
                src={floatingImages[2].url}
                alt={floatingImages[2].alt}
                className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-48 lg:h-48 object-cover rounded-2xl shadow-2xl -rotate-[4deg] hover:scale-105 transition-transform duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              />
            </FloatingElement>

            {/* Top-right — social media ad */}
            <FloatingElement
              depth={2}
              className="top-[2%] left-[76%] md:top-[4%] md:left-[72%]"
            >
              <motion.img
                src={floatingImages[3].url}
                alt={floatingImages[3].alt}
                className="w-28 h-24 sm:w-36 sm:h-32 md:w-44 md:h-36 lg:w-48 lg:h-40 object-cover rounded-2xl shadow-2xl rotate-[6deg] hover:scale-105 transition-transform duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              />
            </FloatingElement>

            {/* Bottom-right — calendar booking */}
            <FloatingElement
              depth={1}
              className="top-[70%] left-[70%] md:top-[62%] md:left-[68%]"
            >
              <motion.img
                src={floatingImages[4].url}
                alt={floatingImages[4].alt}
                className="w-32 h-32 sm:w-44 sm:h-44 md:w-52 md:h-52 lg:w-56 lg:h-56 object-cover rounded-2xl shadow-2xl rotate-[14deg] hover:scale-105 transition-transform duration-200"
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
              The Speed To Lead System for local businesses
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
