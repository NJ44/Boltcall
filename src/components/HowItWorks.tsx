import React from 'react';
import { motion } from 'framer-motion';
import WhisperText from './ui/whisper-text';
import { ContainerScroll, CardSticky } from './ui/cards-stack';


const PROCESS_PHASES = [
  {
    id: "process-1",
    title: "Capture the lead",
      description:
        "Your helper answers the phone all day and all night. It talks to people who call you. It talks to people who fill out forms on your website. It talks to people who see your ads. It gets their name and phone number. It never misses anyone.",
    animationUrl: "/AI_assistant.lottie"
  },
  {
    id: "process-2",
    title: "Find serious buyers",
      description:
        "Your helper talks to people like a real person. It asks them questions. It finds out what they need, when they want help, and if they're ready to move forward. It separates the serious buyers from the tire-kickers — so you only spend time on people who are ready.",
    animationUrl: "/statistics_on_tab.lottie"
  },
  {
    id: "process-3",
    title: "Book appointments",
      description:
        "When someone wants to meet with you, your helper books them. It looks at your calendar. It finds a time that works. It tells them when to come. It sends them a reminder so they don't forget.",
    animationUrl: "/sms_agent.lottie"
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section 
      id="how-it-works" 
      className="relative py-16 bg-transparent mt-[200px]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid md:grid-cols-2 md:gap-8 xl:gap-12">
          {/* Section Header - Sticky Sidebar */}
          <div className="left-0 md:sticky ml-4 pt-12 md:pt-0 pr-2" style={{ top: '150px', height: 'fit-content' }}>
            <motion.h5 
              className="text-sm uppercase tracking-wide font-medium text-white/70 mb-4 ml-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              How It Works
            </motion.h5>
            <h2 className="font-bold mb-5 ml-5 text-3xl md:text-[44px] leading-tight">
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
              Your helper works all day and all night. It talks to people right away. It books appointments for you. You never miss a chance to get a new customer.
            </motion.p>
          </div>

          {/* Sticky Cards */}
          <ContainerScroll className="space-y-[40vh] py-4 ml-0 md:ml-16 -mt-[50px]" style={{ minHeight: '200vh' }}>
            {PROCESS_PHASES.map((phase, index) => (
              <CardSticky
                key={phase.id}
                index={index + 2}
                incrementY={14}
                className={`rounded-2xl border-2 border-gray-200 bg-white shadow-2xl overflow-hidden max-w-full md:max-w-[440px] ${index === 0 ? 'mt-20 md:mt-0' : ''}`}
                style={{ top: `${150 + index * 20}px`, bottom: 'auto', minHeight: '280px' }}
              >
                <div className="relative z-10 p-4 md:p-7 h-full">
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
                    <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-5">{phase.description}</p>
                  </div>
                </div>
                {/* Blue gradient from bottom */}
                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-blue-100 via-blue-50/60 to-transparent pointer-events-none z-0" />
              </CardSticky>
            ))}
          </ContainerScroll>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;