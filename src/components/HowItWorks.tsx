import React, { useEffect, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import { MessageSquare, Bot, Calendar, ArrowDown } from 'lucide-react';
import Card from './ui/Card';
import Section from './ui/Section';

const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { scrollYProgress } = useScroll();

  const steps = [
    {
      icon: MessageSquare,
      title: 'Lead Capture',
      description: 'Potential customers reach out via phone, website, or social media. Our AI instantly recognizes and categorizes each lead.',
      step: '1',
      image: '/api/placeholder/400/300',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      color: 'blue'
    },
    {
      icon: Bot,
      title: 'AI Answers',
      description: 'Our advanced AI responds instantly with personalized, helpful information tailored to each customer\'s specific needs and questions.',
      step: '2',
      image: '/api/placeholder/400/300',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      color: 'purple'
    },
    {
      icon: Calendar,
      title: 'Booking & Reporting',
      description: 'Leads are automatically qualified and booked into your calendar, with detailed reports and analytics provided in real-time.',
      step: '3',
      image: '/api/placeholder/400/300',
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      color: 'green'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const sectionElement = document.getElementById('how-it-works');
      if (sectionElement) {
        const sectionTop = sectionElement.offsetTop;
        const sectionHeight = sectionElement.offsetHeight;
        const relativeScroll = scrollPosition - sectionTop;
        const progress = relativeScroll / (sectionHeight * 0.7);
        
        if (progress >= 0 && progress <= 1) {
          const newActiveStep = Math.min(Math.floor(progress * steps.length), steps.length - 1);
          setActiveStep(newActiveStep);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Section id="how-it-works" className="relative">
      <div className="text-center mb-20">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-text-main mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          How It Works
        </motion.h2>
        <motion.p
          className="text-xl text-text-muted max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Three simple steps to transform your lead management with AI-powered automation
        </motion.p>
      </div>

      {/* Vertical Timeline Container */}
      <div className="relative max-w-4xl mx-auto">
        {/* Progress Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-gray-200 to-gray-300 rounded-full">
          <motion.div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-brand-blue via-brand-sky to-brand-blue rounded-full origin-top"
            style={{ scaleY: scrollYProgress }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-32">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className={`relative flex items-center ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              {/* Step Content */}
              <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12' : 'pl-12'}`}>
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <Card className={`relative overflow-hidden bg-gradient-to-br ${step.bgGradient} border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group`}>
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    
                    {/* Step Number */}
                    <div className="absolute -top-6 -left-6 z-10">
                      <motion.div
                        className={`w-12 h-12 bg-gradient-to-br ${step.gradient} text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg`}
                        whileHover={{ rotate: 360 }}
                      >
                        {step.step}
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="p-8 pt-12">
                      {/* Icon */}
                      <motion.div
                        className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 shadow-lg`}
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                      >
                        <step.icon className="w-8 h-8 text-white" />
                      </motion.div>

                      <h3 className="text-2xl font-bold text-text-main mb-4 text-center">
                        {step.title}
                      </h3>
                      <p className="text-text-muted leading-relaxed text-center">
                        {step.description}
                      </p>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 w-20 h-20 bg-white/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
                    <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full blur-lg group-hover:scale-125 transition-transform duration-500" />
                  </Card>
                </motion.div>
              </div>

              {/* Step Image */}
              <div className={`w-1/2 ${index % 2 === 0 ? 'pl-12' : 'pr-12'}`}>
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`relative rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br ${step.bgGradient} p-4`}>
                    {/* Placeholder Image */}
                    <div className={`aspect-video rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center relative overflow-hidden`}>
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        animate={{ 
                          x: ['-100%', '100%'],
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          repeatType: 'reverse',
                          ease: 'linear'
                        }}
                      />
                      <step.icon className="w-16 h-16 text-white/80 z-10" />
                    </div>
                    
                    {/* Floating Elements */}
                    <motion.div
                      className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br ${step.gradient} rounded-full shadow-lg`}
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    />
                    <motion.div
                      className={`absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br ${step.gradient} rounded-full shadow-lg`}
                      animate={{ 
                        y: [0, 10, 0],
                        rotate: [0, -180, -360]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Connection Dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 z-20">
                <motion.div
                  className={`w-6 h-6 bg-gradient-to-br ${step.gradient} rounded-full shadow-lg border-4 border-white`}
                  animate={activeStep >= index ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Arrow (except for last step) */}
              {index < steps.length - 1 && (
                <motion.div
                  className="absolute left-1/2 transform -translate-x-1/2 -bottom-16 z-10"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center shadow-lg`}>
                    <ArrowDown className="w-6 h-6 text-white" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-brand-blue to-brand-sky rounded-2xl p-8 text-white shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Lead Management?</h3>
            <p className="text-lg opacity-90 mb-6">
              Join thousands of businesses already using Boltcall to capture and convert more leads.
            </p>
            <motion.button
              className="bg-white text-brand-blue px-8 py-3 rounded-xl font-semibold text-lg shadow-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Today
            </motion.button>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default HowItWorks;