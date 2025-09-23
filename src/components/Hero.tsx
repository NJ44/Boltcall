import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Play } from 'lucide-react';
import Button from './ui/Button';
import Section from './ui/Section';
import ModalVideo from './ModalVideo';

const Hero: React.FC = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const trustBadges = [
    '30-second response time',
    '24/7 availability',
    '15 qualified leads guaranteed'
  ];

  return (
    <Section id="hero" className="pt-20 pb-16 lg:pt-32 lg:pb-24">
      <div className="text-center">
        {/* Main Headline */}
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-text-main mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Never lose a lead again
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-xl md:text-2xl text-text-muted mb-8 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          We answer in 30 seconds, 24/7, and book the slot. If you don't get 15 qualified leads in 30 days, we work free until you do.
        </motion.p>

        {/* Trust Badges */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-border"
            >
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-text-main">{badge}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
          >
            Start now
          </Button>
          <Button
            onClick={() => setIsVideoOpen(true)}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Play className="w-5 h-5 mr-2" />
            See 60-sec demo
          </Button>
        </motion.div>

        {/* Hero Image/Visual */}
        <motion.div
          className="relative max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <div className="bg-gradient-to-br from-brand-blue/10 to-brand-sky/20 rounded-2xl p-8 lg:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-brand-blue/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-semibold text-text-main mb-2">Speed to Lead</h3>
                <p className="text-sm text-text-muted">Auto-reply in under 30 seconds</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-brand-blue/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="font-semibold text-text-main mb-2">24/7 Booking</h3>
                <p className="text-sm text-text-muted">Answers FAQs and books appointments</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-brand-blue/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="font-semibold text-text-main mb-2">Proof & Reports</h3>
                <p className="text-sm text-text-muted">Weekly summaries with metrics</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      <ModalVideo
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
      />
    </Section>
  );
};

export default Hero;
