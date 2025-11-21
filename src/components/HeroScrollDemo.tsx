import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ContainerScroll } from "./ui/container-scroll-animation";
import { Phone, Megaphone, MessageSquare, BarChart3 } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface ContentData {
  image: string;
  animation?: string;
  title: string;
  description: string;
  layout: string;
  features?: string[];
}

export function HeroScrollDemo() {
  const [activeTab, setActiveTab] = useState('ai-receptionist');

  const contentData: Record<string, ContentData> = {
    'ai-receptionist': {
      image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=500&h=500&fit=crop',
      animation: '/AI_assistant.lottie',
      title: 'AI Receptionist',
      description: 'Transform every call into an opportunity with intelligent conversation handling and seamless customer experience.',
      layout: 'new-layout',
      features: [
        '24/7 call answering',
        'Lead qualification',
        'Appointment scheduling',
        'Call transcription'
      ]
    },
    'speed-to-lead': {
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=500&fit=crop',
      animation: '/statistics_on_tab.lottie',
      title: 'Instant Forms Reply',
      description: 'Capture and convert leads instantly with automated responses that engage prospects the moment they show interest.',
      layout: 'new-layout',
      features: [
        'Instant response to ads',
        'Personalized messaging',
        'Lead capture forms',
        'Follow-up automation'
      ]
    },
    'sms-whatsapp': {
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&h=500&fit=crop',
      animation: '/sms_agent.lottie',
      title: 'SMS Booking Agent',
      description: 'Engage with leads through SMS and WhatsApp with intelligent automated responses and seamless conversation flow.',
      layout: 'new-layout',
      features: [
        'SMS lead capture',
        'Automated scheduling',
        'Appointment reminders',
        'Calendar integration'
      ]
    },
    'dashboard-analytics': {
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=500&fit=crop',
      title: 'Dashboard Analytics',
      description: 'Track all your key metrics, monitor performance, and gain valuable insights into your business with our comprehensive analytics dashboard.',
      layout: 'features'
    }
  };

  const currentContent = useMemo(() => 
    contentData[activeTab as keyof typeof contentData], 
    [activeTab]
  );

  // Preload all images when component mounts
  useEffect(() => {
    Object.values(contentData).forEach((content) => {
      if (content.image) {
        const img = new Image();
        img.src = content.image;
      }
    });
  }, []);

  return (
    <div className="flex flex-col overflow-hidden pb-[100px] -mt-[271px] pointer-events-none">
      <ContainerScroll
        titleComponent={null}
      >
        <div className="flex flex-col h-full text-center pointer-events-auto">
          {/* Professional Modern Buttons at the very top */}
          <div className="flex flex-wrap justify-center gap-5 mb-3 -mt-[15px] relative z-50 w-full max-w-[2200px] mx-auto px-2">
            <button
              onClick={() => setActiveTab('ai-receptionist')}
              className={`px-[24px] py-[12px] rounded-2xl text-base transition-all duration-75 flex items-center gap-2 ${
                activeTab === 'ai-receptionist'
                  ? 'bg-white text-gray-900 shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-white hover:shadow-md'
              }`}
              style={{ 
                backfaceVisibility: 'hidden', 
                WebkitFontSmoothing: 'antialiased',
                opacity: activeTab === 'ai-receptionist' ? 1 : 0.85
              }}
            >
              <Phone className={`w-5 h-5 ${activeTab === 'ai-receptionist' ? 'text-blue-500' : 'text-gray-700'}`} />
              AI Receptionist
            </button>
            <button
              onClick={() => setActiveTab('speed-to-lead')}
              className={`px-[24px] py-[12px] rounded-2xl text-base transition-all duration-75 flex items-center gap-2 ${
                activeTab === 'speed-to-lead'
                  ? 'bg-white text-gray-900 shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-white hover:shadow-md'
              }`}
              style={{ 
                backfaceVisibility: 'hidden', 
                WebkitFontSmoothing: 'antialiased',
                opacity: activeTab === 'speed-to-lead' ? 1 : 0.85
              }}
            >
              <Megaphone className={`w-5 h-5 ${activeTab === 'speed-to-lead' ? 'text-blue-500' : 'text-gray-700'}`} />
              <span className="whitespace-nowrap">Instant Forms replies</span>
            </button>
            <button
              onClick={() => setActiveTab('sms-whatsapp')}
              className={`px-[24px] py-[12px] rounded-2xl text-base transition-all duration-75 flex items-center gap-2 ${
                activeTab === 'sms-whatsapp'
                  ? 'bg-white text-gray-900 shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-white hover:shadow-md'
              }`}
              style={{ 
                backfaceVisibility: 'hidden', 
                WebkitFontSmoothing: 'antialiased',
                opacity: activeTab === 'sms-whatsapp' ? 1 : 0.85
              }}
            >
              <MessageSquare className={`w-5 h-5 ${activeTab === 'sms-whatsapp' ? 'text-blue-500' : 'text-gray-700'}`} />
              SMS Booking
            </button>
            <button
              onClick={() => setActiveTab('dashboard-analytics')}
              className={`px-[24px] py-[12px] rounded-2xl text-base transition-all duration-75 flex items-center gap-2 ${
                activeTab === 'dashboard-analytics'
                  ? 'bg-white text-gray-900 shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-white hover:shadow-md'
              }`}
              style={{ 
                backfaceVisibility: 'hidden', 
                WebkitFontSmoothing: 'antialiased',
                opacity: activeTab === 'dashboard-analytics' ? 1 : 0.85
              }}
            >
              <BarChart3 className={`w-5 h-5 ${activeTab === 'dashboard-analytics' ? 'text-blue-500' : 'text-gray-700'}`} />
              Dashboard Analytics
            </button>
          </div>

          {/* Semi-transparent container for flipping screen content */}
          <div className="flex-1 bg-white/87 backdrop-blur-sm rounded-3xl p-10 mx-2 mt-4 mb-6">
            <div className="h-full flex flex-col items-center justify-center px-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="w-full"
                >
              {currentContent.layout === 'new-layout' ? (
              // New Layout - Header/Text on left, Animation on right
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-center">
                <div className="text-left">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 whitespace-nowrap">
                    {currentContent.title}
                  </h2>
                  <p className="text-base md:text-lg text-white mb-6">
                    {currentContent.description}
                  </p>
                  {/* V sign list */}
                  <ul className="space-y-3">
                    {currentContent.features?.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-white">
                        <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-center">
                  {currentContent.animation ? (
                    <DotLottieReact
                      src={currentContent.animation}
                      loop
                      autoplay
                      className="w-[300px] h-[300px]"
                    />
                  ) : (
                    <img
                      src={currentContent.image}
                      alt={currentContent.title}
                      className="w-[300px] h-[300px] rounded-lg shadow-lg object-cover"
                      loading="eager"
                      fetchPriority="high"
                    />
                  )}
                </div>
              </div>
            ) : currentContent.layout === 'features' ? (
              // Dashboard Analytics - Features Layout with Image
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {currentContent.title}
                  </h2>
                  <p className="text-sm text-white mb-4">
                    {currentContent.description}
                  </p>
                  <ul className="space-y-0 py-4">
                    <li className="flex items-center gap-3 text-white py-3 border-b border-white/20">
                      <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      Real-time notifications
                    </li>
                    <li className="flex items-center gap-3 text-white py-3 border-b border-white/20">
                      <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                      Instant insights
                    </li>
                    <li className="flex items-center gap-3 text-white py-3 border-b border-white/20">
                      <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                      </svg>
                      Performance tracking
                    </li>
                    <li className="flex items-center gap-3 text-white py-3">
                      <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Custom reports
                    </li>
                  </ul>
                </div>
                <div className="flex justify-center">
                  <img 
                    src={currentContent.image}
                    alt={currentContent.title}
                    className="rounded-lg shadow-lg w-full max-w-md object-cover"
                    loading="eager"
                    fetchPriority="high"
                  />
                </div>
              </div>
            ) : (
              // Default Layout - Centered
              <>
            <div className="mb-6">
            <img
              src={currentContent.image}
              alt={currentContent.title}
              className="w-[200px] h-[200px] rounded-lg shadow-lg object-cover mx-auto"
            />
          </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {currentContent.title}
          </h2>
                <p className="text-base md:text-lg text-white max-w-xl mx-auto">
            {currentContent.description}
          </p>
              </>
            )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </ContainerScroll>
    </div>
  );
}
