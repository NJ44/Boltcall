import React from 'react';
import { motion } from 'framer-motion';
import WhisperText from './ui/whisper-text';
import { ContainerScroll, CardSticky } from './ui/cards-stack';
import DatabaseWithRestApi from './ui/database-with-rest-api';


const PROCESS_PHASES = [
  {
    id: "process-1",
    title: "AI Receptionist",
    description:
      "Your AI receptionist answers calls 24/7, qualifies leads, and schedules appointments automatically.",
    animationUrl: "/AI_assistant.lottie"
  },
  {
    id: "process-2",
    title: "Instant Ads Replies",
    description:
      "Respond to ads instantly with personalized messages that convert visitors into qualified leads.",
    animationUrl: "/statistics_on_tab.lottie"
  },
  {
    id: "process-3",
    title: "SMS Booking",
    description:
      "Convert SMS inquiries into booked appointments with automated scheduling and reminders.",
    animationUrl: "/sms_agent.lottie"
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section 
      id="how-it-works" 
      className="relative py-16 bg-transparent -mt-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid md:grid-cols-2 md:gap-8 xl:gap-12">
          {/* Section Header - Sticky Sidebar */}
          <div className="left-0 md:sticky ml-4 pt-24 pr-2" style={{ top: '64px', height: 'fit-content' }}>
            <motion.h5 
              className="text-sm uppercase tracking-wide font-medium text-white/70 mb-4 ml-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              How It Works
            </motion.h5>
            <h2 className="font-bold mb-5 ml-5" style={{ fontSize: '54px', lineHeight: '0.9' }}>
              <WhisperText
                text="Close leads in "
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white inline-block"
                delay={125}
                duration={0.625}
                x={-20}
                y={0}
                triggerStart="top 85%"
                style={{ fontSize: '1.155em' }}
              /><WhisperText
                text="lightning speed."
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-500 inline-block"
                delay={125}
                duration={0.625}
                x={-20}
                y={0}
                triggerStart="top 85%"
                style={{ fontSize: '1.155em' }}
              />
            </h2>
            <motion.p 
              className="max-w-prose text-base md:text-lg leading-relaxed text-white/80 mt-5 ml-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              BoltCall transforms how you capture and convert leads. Our AI-powered system works 24/7 to ensure you never miss an opportunity, responding instantly to every inquiry and booking qualified appointments automatically.
            </motion.p>
          </div>

          {/* Sticky Cards */}
          <ContainerScroll className="space-y-11 py-11 ml-16" style={{ minHeight: '100vh' }}>
            {PROCESS_PHASES.map((phase, index) => (
              <CardSticky
                key={phase.id}
                index={index + 2}
                incrementY={14}
                className="rounded-2xl border-2 border-gray-200 bg-white shadow-2xl overflow-hidden"
                style={{ maxWidth: '440px', top: '128px', bottom: 'auto', minHeight: '320px' }}
              >
                <div className="p-5 md:p-7 h-full">
                  {/* Full width content */}
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">
                        {phase.title}
                      </h2>
                      <div className="bg-blue-600 text-white rounded-full w-11 h-11 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-5">{phase.description}</p>
                  </div>
                  
                  {/* Right side - Animation removed */}
                  <div className="flex-shrink-0 w-48 h-48">
                    {/* Animation removed */}
                  </div>
                </div>
              </CardSticky>
            ))}
          </ContainerScroll>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;