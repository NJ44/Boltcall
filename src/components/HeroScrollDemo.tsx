import { useState, useMemo } from "react";
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

  const currentContent = useMemo(() => 
    contentData[activeTab as keyof typeof contentData], 
    [activeTab]
  );

  return (
    <div className="flex flex-col overflow-hidden pb-[100px] -mt-[200px]">
      <ContainerScroll
        titleComponent={null}
      >
        <div className="flex flex-col h-full text-center">
          {/* Professional Modern Buttons at the very top */}
          <div className="flex flex-wrap justify-center gap-4 mb-6 -mt-5">
            <button
              onClick={() => setActiveTab('ai-assistant')}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeTab === 'ai-assistant'
                  ? 'bg-white text-gray-900 shadow-lg border-2 border-blue-500 scale-105'
                  : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              AI Assistant
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeTab === 'analytics'
                  ? 'bg-white text-gray-900 shadow-lg border-2 border-blue-500 scale-105'
                  : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('automation')}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeTab === 'automation'
                  ? 'bg-white text-gray-900 shadow-lg border-2 border-blue-500 scale-105'
                  : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              Automation
            </button>
            <button
              onClick={() => setActiveTab('receptionist')}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeTab === 'receptionist'
                  ? 'bg-white text-gray-900 shadow-lg border-2 border-blue-500 scale-105'
                  : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              Receptionist
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="mb-6">
            <DotLottieReact
              src={currentContent.animation}
              loop
              autoplay
              style={{ 
                width: '200px', 
                height: '200px'
              }}
            />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            {currentContent.title}
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto">
            {currentContent.description}
          </p>
          </div>
        </div>
      </ContainerScroll>
    </div>
  );
}
