import { useState } from "react";
import { ContainerScroll } from "./ui/container-scroll-animation";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export function HeroScrollDemo() {
  const [activeTab, setActiveTab] = useState('ai-assistant');

  const contentData = {
    'ai-assistant': {
      animation: '/AI_assistant.lottie',
      title: 'AI-Powered Booking Assistant',
      description: 'Experience the future of dental practice management with our intelligent AI assistant that handles bookings, answers questions, and provides 24/7 support for your patients.'
    },
    'analytics': {
      animation: '/statistics_on_tab.lottie',
      title: 'Advanced Analytics Dashboard',
      description: 'Track all your key metrics, monitor performance, and gain valuable insights into your dental practice with our comprehensive analytics dashboard.'
    },
    'automation': {
      animation: '/Dentist_Surgery.lottie',
      title: 'Automated Lead Management',
      description: 'Auto-texts and calls new leads within seconds, qualifies them, and books them straight to your calendar without any manual intervention.'
    },
    'receptionist': {
      animation: '/Dentist_Checking_Teeth.lottie',
      title: '24/7 AI Receptionist',
      description: 'Never miss a call again with our AI receptionist that answers calls 24/7, schedules appointments, and provides instant support to your patients.'
    }
  };

  const currentContent = contentData[activeTab as keyof typeof contentData];

  return (
    <div className="flex flex-col overflow-hidden pb-[100px] -mt-[560px]">
      <ContainerScroll
        titleComponent={null}
      >
        <div className="flex flex-col items-center justify-center h-full text-center">
          {/* Buttons inside the screen */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('ai-assistant')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'ai-assistant'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md'
              }`}
            >
              AI Assistant
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('automation')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'automation'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md'
              }`}
            >
              Automation
            </button>
            <button
              onClick={() => setActiveTab('receptionist')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'receptionist'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md'
              }`}
            >
              Receptionist
            </button>
          </div>

          <div className="mb-8">
            <DotLottieReact
              src={currentContent.animation}
              loop
              autoplay
              style={{ 
                width: '300px', 
                height: '300px'
              }}
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {currentContent.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {currentContent.description}
          </p>
        </div>
      </ContainerScroll>
    </div>
  );
}
