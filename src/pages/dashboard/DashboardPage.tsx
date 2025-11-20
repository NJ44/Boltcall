import React, { useState, useEffect } from 'react';
import { AlertTriangle, HelpCircle, X, Send, Check, LoaderCircle } from 'lucide-react';
import { EmptyState } from '../../components/ui/empty-state';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import SetupCompletionPopup from '../../components/SetupCompletionPopup';
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '../../components/ui/stepper';
const DashboardPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showHelpChat, setShowHelpChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{text: string, sender: 'user' | 'bot'}>>([]);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Check if setup was just completed
  useEffect(() => {
    const setupCompleted = searchParams.get('setupCompleted');
    if (setupCompleted === 'true') {
      setShowCompletionPopup(true);
      setShowConfetti(true);
      // Remove the query parameter from URL
      setSearchParams({});
      
      // Stop confetti after 5 seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
  }, [searchParams, setSearchParams]);

  // Update window size for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setChatHistory([...chatHistory, { text: chatMessage, sender: 'user' }]);
      setChatMessage('');
      
      // Simulate bot response
      setTimeout(() => {
        setChatHistory(prev => [...prev, { 
          text: "Thanks for reaching out! I'm here to help. What can I assist you with?", 
          sender: 'bot' 
        }]);
      }, 1000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}

      {/* Setup Completion Popup */}
      <SetupCompletionPopup 
        isOpen={showCompletionPopup} 
        onClose={() => setShowCompletionPopup(false)} 
      />

      {/* Setup Guide Section */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">Setup Guide</h2>
          <p className="text-sm text-gray-600 mt-1">Follow these steps to get your AI assistant up and running</p>
        </div>
        
        <div className="p-6">
          <div className="bg-gray-100 rounded-lg p-6 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Steps 1-3 */}
              <div className="flex-1">
                <Stepper
                  className="flex flex-col items-start justify-center gap-6"
                  defaultValue={1}
                  orientation="vertical"
                  indicators={{
                    completed: <Check className="size-4" />,
                    loading: <LoaderCircle className="size-4 animate-spin" />,
                  }}
                >
                  <StepperNav>
                    {[
                      { title: 'Create Agent', description: 'Set up your AI agent', link: '/dashboard/agents' },
                      { title: 'Connect Cal.com', description: 'Link your calendar', link: '/dashboard/calcom' },
                      { title: 'Setup AI Receptionist', description: 'Configure your receptionist', link: '/dashboard/agents' },
                    ].map((step, index) => (
                      <StepperItem
                        key={index}
                        step={index + 1}
                        loading={index === 2}
                        className="relative items-start not-last:flex-1"
                      >
                        <div className="flex items-start gap-4 w-full">
                          <StepperTrigger className="items-start pb-4 last:pb-0 gap-2.5 text-black flex-1">
                            <StepperIndicator className="data-[state=completed]:bg-green-500 data-[state=completed]:text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-500">
                              {index + 1}
                            </StepperIndicator>
                            <div className="mt-0.5 text-left">
                              <StepperTitle className="text-black">
                                {index === 1 || index === 2 ? (
                                  <Link to={step.link} className="hover:underline text-blue-600">
                                    {step.title}
                                  </Link>
                                ) : (
                                  step.title
                                )}
                              </StepperTitle>
                              <StepperDescription className="text-black text-sm">{step.description}</StepperDescription>
                            </div>
                          </StepperTrigger>
                          <Link
                            to={step.link}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap mt-0.5"
                          >
                            Go
                          </Link>
                        </div>
                        {index < 2 && (
                          <StepperSeparator className="absolute inset-y-0 top-7 left-3 -order-1 m-0 -translate-x-1/2 group-data-[orientation=vertical]/stepper-nav:h-[calc(100%-1rem)] group-data-[state=completed]/step:bg-green-500" />
                        )}
                      </StepperItem>
                    ))}
                  </StepperNav>
                </Stepper>
              </div>

              {/* Right Column - Steps 4-6 */}
              <div className="flex-1">
                <Stepper
                  className="flex flex-col items-start justify-center gap-6"
                  defaultValue={4}
                  orientation="vertical"
                  indicators={{
                    completed: <Check className="size-4" />,
                    loading: <LoaderCircle className="size-4 animate-spin" />,
                  }}
                >
                  <StepperNav>
                    {[
                      { title: 'Configure Phone Numbers', description: 'Set up your phone numbers', link: '/dashboard/phone-numbers' },
                      { title: 'Setup Knowledge Base', description: 'Add your business information', link: '/dashboard/knowledge-base' },
                      { title: 'Test Your Agent', description: 'Test and verify your setup', link: '/dashboard/agents' },
                    ].map((step, index) => (
                      <StepperItem
                        key={index}
                        step={index + 4}
                        loading={index === 2}
                        className="relative items-start not-last:flex-1"
                      >
                        <div className="flex items-start gap-4 w-full">
                          <StepperTrigger className="items-start pb-4 last:pb-0 gap-2.5 text-black flex-1">
                            <StepperIndicator className="data-[state=completed]:bg-green-500 data-[state=completed]:text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-500">
                              {index + 4}
                            </StepperIndicator>
                            <div className="mt-0.5 text-left">
                              <StepperTitle className="text-black">
                                {step.title}
                              </StepperTitle>
                              <StepperDescription className="text-black text-sm">{step.description}</StepperDescription>
                            </div>
                          </StepperTrigger>
                          <Link
                            to={step.link}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap mt-0.5"
                          >
                            Go
                          </Link>
                        </div>
                        {index < 2 && (
                          <StepperSeparator className="absolute inset-y-0 top-7 left-3 -order-1 m-0 -translate-x-1/2 group-data-[orientation=vertical]/stepper-nav:h-[calc(100%-1rem)] group-data-[state=completed]/step:bg-green-500" />
                        )}
                      </StepperItem>
                    ))}
                  </StepperNav>
                </Stepper>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">Alerts</h2>
          <p className="text-sm text-gray-600 mt-1">Important notifications and system alerts</p>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Alert items will go here */}
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm">No alerts at this time</p>
          </div>
        </div>
      </div>



      {/* Help Chat Side Panel */}
      <AnimatePresence>
        {showHelpChat && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed -inset-[200px] bg-black/30 z-40"
              onClick={() => setShowHelpChat(false)}
            />

            {/* Side Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full md:w-[400px] bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="bg-blue-600 text-white p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Help & Support</h3>
                    <p className="text-sm text-blue-100">Ask us anything</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowHelpChat(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {chatHistory.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <EmptyState
                      title="How can we help you today?"
                      description="Start a conversation by asking any questions about BoltCall or your account."
                      icons={[HelpCircle]}
                      action={{
                        label: "View Help Center",
                        onClick: () => console.log("Help center clicked")
                      }}
                      className="max-w-sm"
                    />
                  </div>
                ) : (
                  chatHistory.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your question..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;
