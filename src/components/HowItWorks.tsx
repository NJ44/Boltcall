import React from 'react';
import WhisperText from './ui/whisper-text';
import { ContainerScroll, CardSticky } from './ui/cards-stack';

const PROCESS_PHASES = [
  {
    id: "process-1",
    title: "Lead Discovery",
    description:
      "Our AI instantly identifies and engages with potential leads from multiple channels. Whether it's ads, forms, SMS, or phone calls, we ensure no opportunity is missed.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
  },
  {
    id: "process-2",
    title: "Instant Response",
    description:
      "Speed to lead is critical. Our AI receptionist responds within seconds, qualifying prospects and booking appointments while they're still hot.",
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80"
  },
  {
    id: "process-3",
    title: "Smart Qualification",
    description:
      "The AI asks the right questions to qualify leads based on your criteria. Only serious, qualified prospects make it to your calendar.",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
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
          <div className="left-0 md:sticky md:py-12" style={{ top: '128px', height: 'fit-content' }}>
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              <WhisperText
                text="Close leads in"
                className="text-5xl md:text-7xl font-bold text-white inline-block"
                delay={125}
                duration={0.625}
                x={-20}
                y={0}
                triggerStart="top 85%"
              />
              <br />
              <WhisperText
                text="lightning speed."
                className="text-5xl md:text-7xl font-bold text-blue-500 inline-block"
                delay={125}
                duration={0.625}
                x={-20}
                y={0}
                triggerStart="top 85%"
              />
            </h2>
            <p className="max-w-prose text-lg md:text-xl leading-relaxed text-white/80 mt-6">
              BoltCall transforms how you capture and convert leads. Our AI-powered system works 24/7 to ensure you never miss an opportunity, responding instantly to every inquiry and booking qualified appointments automatically.
            </p>
          </div>

          {/* Sticky Cards */}
          <ContainerScroll className="space-y-11 py-11 ml-8" style={{ minHeight: 'calc(100vh + 800px)' }}>
            {PROCESS_PHASES.map((phase, index) => (
              <CardSticky
                key={phase.id}
                index={index + 2}
                incrementY={14}
                className="rounded-2xl border-2 border-gray-200 bg-white shadow-2xl overflow-hidden"
                style={{ maxWidth: '470px', top: '128px', bottom: 'auto' }}
              >
                <div className="p-5 md:p-7">
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
                <div className="relative h-44 md:h-52 overflow-hidden">
                  <img 
                    src={phase.imageUrl} 
                    alt={phase.title}
                    className="w-full h-full object-cover"
                  />
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