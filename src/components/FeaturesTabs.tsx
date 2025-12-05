import React from 'react';
import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Section from './ui/Section';

const FeaturesTabs: React.FC = () => {
  return (
    <Section id="features" background="brand">
      <div className="text-center mb-8">
        <motion.h2
          className="text-4xl md:text-6xl font-bold text-text-main mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          KEEPING YOU CLEAN AND SHINY
        </motion.h2>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="relative">
          {/* Main Animation - 10% smaller */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center items-center"
          >
            <div 
              className="w-[540px] h-[540px] md:w-[720px] md:h-[720px] lg:w-[900px] lg:h-[900px]"
              style={{
                imageRendering: 'crisp-edges',
                WebkitImageRendering: 'crisp-edges',
                willChange: 'transform',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
              } as React.CSSProperties & Record<string, string>}
            >
              <DotLottieReact
                src="/Clean_tooth.lottie"
                loop
                autoplay
                style={{
                  width: '100%',
                  height: '100%',
                  imageRendering: 'auto',
                  WebkitImageRendering: 'auto'
                } as React.CSSProperties & Record<string, string>}
              />
            </div>
          </motion.div>

          {/* 4 Professional Cards around the animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full max-w-4xl max-h-4xl">
              {/* Top Card - Track all your metrics */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4"
              >
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 w-64 text-center border border-white/30 hover:shadow-3xl transition-all duration-300">
                  <div className="w-20 h-20 mx-auto mb-4">
                    <DotLottieReact
                      src="/statistics_on_tab.lottie"
                      loop
                      autoplay
                      style={{
                        width: '100%',
                        height: '100%'
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Track all your metrics</h3>
                </div>
              </motion.div>

              {/* Right Card - AI Receptionist */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4"
              >
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 w-64 text-center border border-white/30 hover:shadow-3xl transition-all duration-300">
                  <div className="w-20 h-20 mx-auto mb-4">
                    <DotLottieReact
                      src="/Dentist_Checking_Teeth.lottie"
                      loop
                      autoplay
                      style={{
                        width: '100%',
                        height: '100%'
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">AI receptionist that answer calls 24/7</h3>
                </div>
              </motion.div>

              {/* Bottom Card - Dashboard Interface */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4"
              >
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 w-64 text-center border border-white/30 hover:shadow-3xl transition-all duration-300">
                  <div className="w-20 h-20 mx-auto mb-4">
                    <DotLottieReact
                      src="/Dental_Care_anim.lottie"
                      loop
                      autoplay
                      style={{
                        width: '100%',
                        height: '100%'
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Easy and simple dashboard interface to manage all features</h3>
                </div>
              </motion.div>

              {/* Left Card - Auto-texts/calls */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                viewport={{ once: true }}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4"
              >
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 w-64 text-center border border-white/30 hover:shadow-3xl transition-all duration-300">
                  <div className="w-20 h-20 mx-auto mb-4">
                    <DotLottieReact
                      src="/Dentist_Surgery.lottie"
                      loop
                      autoplay
                      style={{
                        width: '100%',
                        height: '100%'
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Auto-texts/calls new leads within seconds, qualifies them, and books them straight to your calendar</h3>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default FeaturesTabs;