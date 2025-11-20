import React, { useState, useEffect } from 'react';
import { AlertTriangle, HelpCircle, X, Send } from 'lucide-react';
import { EmptyState } from '../../components/ui/empty-state';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import Confetti from 'react-confetti';
import SetupCompletionPopup from '../../components/SetupCompletionPopup';
import { useAuth } from '../../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
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
