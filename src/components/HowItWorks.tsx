import React from 'react';
import { motion } from 'framer-motion';
import WhisperText from './ui/whisper-text';
import { ContainerScroll, CardSticky } from './ui/cards-stack';


const PROCESS_PHASES = [
  {
    id: "process-1",
    title: "Capture the lead",
    description:
      "Your AI receptionist captures leads 24/7 from calls, forms, and ads, ensuring no opportunity is missed with instant response times.",
    animationUrl: "/AI_assistant.lottie"
  },
  {
    id: "process-2",
    title: "Qualify & Nurture",
    description:
      "Our AI intelligently qualifies each lead through personalized conversations, understanding their needs and determining their buying intent.",
    animationUrl: "/statistics_on_tab.lottie"
  },
  {
    id: "process-3",
    title: "Book appointments",
    description:
      "Convert qualified leads into booked appointments with automated scheduling, reminders, and seamless calendar integration.",
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
              24/7 AI captures leads, responds instantly, and books appointments automatically—so you never miss an opportunity.
            </motion.p>
          </div>

          {/* Sticky Cards */}
          <ContainerScroll className="space-y-11 py-11 ml-4 md:ml-16" style={{ minHeight: '100vh' }}>
            {PROCESS_PHASES.map((phase, index) => (
              <CardSticky
                key={phase.id}
                index={index + 2}
                incrementY={14}
                className="rounded-2xl border-2 border-gray-200 bg-white shadow-2xl overflow-hidden max-w-[280px] md:max-w-[440px]"
                style={{ top: '128px', bottom: 'auto', minHeight: '280px' }}
              >
                <div className="p-4 md:p-7 h-full">
                  {/* Full width content */}
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-[calc(1.25rem*0.97*0.97*0.97)] md:text-[calc(1.875rem*0.97*0.97*0.97)] lg:text-[calc(2.25rem*0.97*0.97*0.97)] font-bold tracking-tight text-gray-900">
                        {phase.title}
                      </h2>
                      <div className="bg-blue-600 text-white rounded-full w-9 h-9 md:w-11 md:h-11 flex items-center justify-center flex-shrink-0">
                        <span className="text-base md:text-lg font-bold">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm md:text-lg text-gray-600 leading-relaxed mb-5">{phase.description}</p>
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