import React from 'react';
import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Section from './ui/Section';

const FeaturesTabs: React.FC = () => {
  return (
    <Section id="features" background="brand">
      <div className="text-center mb-16">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-text-main mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Features
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
            <div className="w-[540px] h-[540px] md:w-[720px] md:h-[720px] lg:w-[900px] lg:h-[900px]">
              <DotLottieReact
                src="/Clean_tooth.lottie"
                loop
                autoplay
                style={{
                  width: '100%',
                  height: '100%'
                }}
              />
            </div>
          </motion.div>

          {/* 4 Small Cards around the animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full max-w-4xl max-h-4xl">
              {/* Top Card */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4"
              >
                <div className="bg-white rounded-xl shadow-lg p-4 w-48 text-center border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Speed to Lead</h3>
                  <p className="text-sm text-gray-600">30-second response time</p>
                </div>
              </motion.div>

              {/* Right Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4"
              >
                <div className="bg-white rounded-xl shadow-lg p-4 w-48 text-center border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">24/7 Booking</h3>
                  <p className="text-sm text-gray-600">Never miss an opportunity</p>
                </div>
              </motion.div>

              {/* Bottom Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4"
              >
                <div className="bg-white rounded-xl shadow-lg p-4 w-48 text-center border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">AI Receptionist</h3>
                  <p className="text-sm text-gray-600">Professional virtual assistant</p>
                </div>
              </motion.div>

              {/* Left Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                viewport={{ once: true }}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4"
              >
                <div className="bg-white rounded-xl shadow-lg p-4 w-48 text-center border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Dashboard Analytics</h3>
                  <p className="text-sm text-gray-600">Real-time insights</p>
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