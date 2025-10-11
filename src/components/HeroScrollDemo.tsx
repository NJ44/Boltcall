import { useState, useMemo } from "react";
import { ContainerScroll } from "./ui/container-scroll-animation";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export function HeroScrollDemo() {
  const [activeTab, setActiveTab] = useState('ai-receptionist');

  const contentData = {
    'ai-receptionist': {
      animation: '/AI_assistant.lottie',
      title: 'AI Receptionist',
      description: 'Never miss a call again with our AI receptionist that answers calls 24/7, schedules appointments, and provides instant support to your patients.',
      layout: 'split'
    },
    'speed-to-lead': {
      animation: '/Dentist_Surgery.lottie',
      title: 'Instant Ads/Forms Replay',
      description: 'Auto-texts and calls new leads within seconds, qualifies them, and books them straight to your calendar without any manual intervention.',
      layout: 'default'
    },
    'sms-whatsapp': {
      animation: '/Email.lottie',
      title: 'SMS/WhatsApp Agent',
      description: 'Engage with leads through SMS and WhatsApp with intelligent automated responses and seamless conversation flow.',
      layout: 'split'
    },
    'personal-assistant': {
      animation: '/AI_assistant.lottie',
      title: 'Personal Assistant',
      description: 'Your AI-powered personal assistant for managing tasks, communications, and automating your workflow efficiently.',
      layout: 'split'
    },
    'dashboard-analytics': {
      animation: '/statistics_on_tab.lottie',
      title: 'Dashboard Analytics',
      description: 'Track all your key metrics, monitor performance, and gain valuable insights into your business with our comprehensive analytics dashboard.',
      layout: 'features'
    }
  };

  const currentContent = useMemo(() => 
    contentData[activeTab as keyof typeof contentData], 
    [activeTab]
  );

  return (
    <div className="flex flex-col overflow-hidden pb-[100px] -mt-[271px]">
      <ContainerScroll
        titleComponent={null}
      >
        <div className="flex flex-col h-full text-center">
          {/* Professional Modern Buttons at the very top */}
          <div className="flex flex-wrap justify-center gap-4 mb-6 -mt-[15px] relative z-50">
            <button
              onClick={() => setActiveTab('ai-receptionist')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeTab === 'ai-receptionist'
                  ? 'bg-white text-gray-900 shadow-lg border-2 border-blue-500 scale-105'
                  : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              AI Receptionist
            </button>
            <button
              onClick={() => setActiveTab('speed-to-lead')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeTab === 'speed-to-lead'
                  ? 'bg-white text-gray-900 shadow-lg border-2 border-blue-500 scale-105'
                  : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              Instant Ads/forms
            </button>
            <button
              onClick={() => setActiveTab('sms-whatsapp')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeTab === 'sms-whatsapp'
                  ? 'bg-white text-gray-900 shadow-lg border-2 border-blue-500 scale-105'
                  : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              SMS/WhatsApp
            </button>
            <button
              onClick={() => setActiveTab('personal-assistant')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeTab === 'personal-assistant'
                  ? 'bg-white text-gray-900 shadow-lg border-2 border-blue-500 scale-105'
                  : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              Personal Assistant
            </button>
            <button
              onClick={() => setActiveTab('dashboard-analytics')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeTab === 'dashboard-analytics'
                  ? 'bg-white text-gray-900 shadow-lg border-2 border-blue-500 scale-105'
                  : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              Dashboard Analytics
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-6">
            {currentContent.layout === 'split' ? (
              // AI Receptionist - Split Layout
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-center">
                <div className="text-left">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    {currentContent.title}
                  </h2>
                  <p className="text-base md:text-lg text-gray-600">
                    {currentContent.description}
                  </p>
                </div>
                <div className="flex justify-center">
                  <DotLottieReact
                    src={currentContent.animation}
                    loop
                    autoplay
                    style={{ 
                      width: '250px', 
                      height: '250px'
                    }}
                  />
                </div>
              </div>
            ) : currentContent.layout === 'features' ? (
              // Dashboard Analytics - Features Layout with Image
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="text-left">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Built for Scaling teams
                  </h2>
                  <p className="text-base text-gray-300 mb-6">
                    Orrupti aut temporibus assumenda atque ab, accusamus sit, molestiae veniam laboriosam pariatur.
                  </p>
                  <ul className="space-y-3 border-y border-gray-700 py-4">
                    <li className="flex items-center gap-3 text-white">
                      <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      Email and web support
                    </li>
                    <li className="flex items-center gap-3 text-white">
                      <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                      Fast response time
                    </li>
                    <li className="flex items-center gap-3 text-white">
                      <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                      </svg>
                      Monitoring and analytics
                    </li>
                    <li className="flex items-center gap-3 text-white">
                      <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Architectural review
                    </li>
                  </ul>
                </div>
                <div className="flex justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop" 
                    alt="Dashboard Analytics" 
                    className="rounded-lg shadow-lg w-full max-w-md object-cover"
                  />
                </div>
              </div>
            ) : (
              // Default Layout - Centered
              <>
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
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {currentContent.title}
          </h2>
                <p className="text-base md:text-lg text-gray-300 max-w-xl mx-auto">
            {currentContent.description}
          </p>
              </>
            )}
          </div>
        </div>
      </ContainerScroll>
    </div>
  );
}
