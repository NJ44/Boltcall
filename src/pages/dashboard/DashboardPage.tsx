import React, { useState } from 'react';
import { AlertTriangle, Power, PhoneOff, MessageSquareOff, BellOff, HelpCircle, X, Send } from 'lucide-react';
import Plan from '../../components/ui/agent-plan';
import { EmptyState } from '../../components/ui/empty-state';
import DocumentsQuickAccess from '../../components/dashboard/DocumentsQuickAccess';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardPage: React.FC = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deactivateType, setDeactivateType] = useState<string>('');
  const [showHelpChat, setShowHelpChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{text: string, sender: 'user' | 'bot'}>>([]);

  const handleDeactivate = (type: string) => {
    setDeactivateType(type);
    setShowConfirmModal(true);
  };

  const confirmDeactivate = () => {
    console.log('Deactivating:', deactivateType);
    setShowConfirmModal(false);
    // Add deactivation logic here
  };

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
      {/* Agent Plan Component */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Plan />
      </div>

      {/* Documents Quick Access */}
      <DocumentsQuickAccess />

      {/* Danger Zone */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-900 overflow-hidden">
        <div className="bg-red-50 border-b border-red-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
              <p className="text-sm text-red-700">Deactivate parts of your system</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Deactivate AI Receptionist */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Power className="w-5 h-5 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">AI Receptionist</h4>
                <p className="text-sm text-gray-600">Temporarily disable AI call handling</p>
              </div>
            </div>
            <button
              onClick={() => handleDeactivate('AI Receptionist')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Deactivate
            </button>
          </div>

          {/* Deactivate Phone System */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <PhoneOff className="w-5 h-5 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">Phone System</h4>
                <p className="text-sm text-gray-600">Stop receiving incoming calls</p>
              </div>
            </div>
            <button
              onClick={() => handleDeactivate('Phone System')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Deactivate
            </button>
          </div>

          {/* Deactivate SMS */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <MessageSquareOff className="w-5 h-5 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">SMS Messaging</h4>
                <p className="text-sm text-gray-600">Disable automated text messages</p>
              </div>
            </div>
            <button
              onClick={() => handleDeactivate('SMS Messaging')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Deactivate
            </button>
          </div>

          {/* Deactivate Notifications */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <BellOff className="w-5 h-5 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">All Notifications</h4>
                <p className="text-sm text-gray-600">Stop all email and push notifications</p>
              </div>
            </div>
            <button
              onClick={() => handleDeactivate('All Notifications')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Deactivate
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Confirm Deactivation</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to deactivate <strong>{deactivateType}</strong>? 
              This action can be reversed, but your system will stop functioning until reactivated.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeactivate}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Chat Side Panel */}
      <AnimatePresence>
        {showHelpChat && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40"
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
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
