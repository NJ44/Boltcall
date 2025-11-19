import React, { useState, useEffect } from 'react';
import { AlertTriangle, HelpCircle, X, Send, MessageSquare, Zap, Phone, Globe, Bell, Users, ArrowRight } from 'lucide-react';
import { EmptyState } from '../../components/ui/empty-state';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import SetupCompletionPopup from '../../components/SetupCompletionPopup';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  setupLink: string;
  isActive: boolean;
  assignedAgentId: string | null;
  assignedAgentName: string | null;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showHelpChat, setShowHelpChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{text: string, sender: 'user' | 'bot'}>>([]);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoadingFeatures, setIsLoadingFeatures] = useState(true);

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

  // Fetch features configuration
  useEffect(() => {
    const fetchFeatures = async () => {
      if (!user?.id) {
        setIsLoadingFeatures(false);
        return;
      }

      try {
        setIsLoadingFeatures(true);

        // Fetch all relevant configurations
        const [agentsResult, , websiteWidgetsResult] = await Promise.all([
          supabase.from('agents').select('id, name, agent_type, status').eq('user_id', user.id),
          supabase.from('phone_numbers').select('id, assigned_agent_id, status').eq('user_id', user.id),
          supabase.from('website_widgets').select('id, assigned_agent_id, is_active').eq('user_id', user.id)
        ]);

        const agentsData = agentsResult.data || [];
        const websiteWidgetsData = websiteWidgetsResult.data || [];
        const activeWebsiteWidget = websiteWidgetsData.find(w => w.is_active);
        
        // Helper function to get agent name by ID
        const getAgentName = (agentId: string | null) => {
          if (!agentId) return null;
          return agentsData.find(a => a.id === agentId)?.name || null;
        };

        // Build features list
        const featuresList: Feature[] = [
          {
            id: 'sms-booking',
            name: 'SMS Booking',
            description: 'Automated SMS appointment booking',
            icon: <MessageSquare className="w-5 h-5" />,
            setupLink: '/dashboard/sms-booking',
            isActive: false, // Will be determined by checking if SMS booking is configured
            assignedAgentId: null,
            assignedAgentName: null
          },
          {
            id: 'speed-to-lead',
            name: 'Speed to Lead',
            description: 'Instant lead response and qualification',
            icon: <Zap className="w-5 h-5" />,
            setupLink: '/dashboard/speed-to-lead',
            isActive: false,
            assignedAgentId: null,
            assignedAgentName: null
          },
          {
            id: 'instant-lead-reply',
            name: 'Instant Lead Reply',
            description: 'Automatic responses to new leads',
            icon: <MessageSquare className="w-5 h-5" />,
            setupLink: '/dashboard/instant-lead-reply',
            isActive: false,
            assignedAgentId: null,
            assignedAgentName: null
          },
          {
            id: 'ai-receptionist',
            name: 'AI Receptionist',
            description: 'AI-powered call handling and routing',
            icon: <Phone className="w-5 h-5" />,
            setupLink: '/dashboard/assistant',
            isActive: agentsData.some(a => a.agent_type === 'ai_receptionist' && a.status === 'active'),
            assignedAgentId: agentsData.find(a => a.agent_type === 'ai_receptionist' && a.status === 'active')?.id || null,
            assignedAgentName: agentsData.find(a => a.agent_type === 'ai_receptionist' && a.status === 'active')?.name || null
          },
          {
            id: 'website-bubble',
            name: 'Website Bubble',
            description: 'AI chat widget for your website',
            icon: <Globe className="w-5 h-5" />,
            setupLink: '/dashboard/website-bubble',
            isActive: websiteWidgetsData.some(w => w.is_active),
            assignedAgentId: activeWebsiteWidget?.assigned_agent_id || null,
            assignedAgentName: getAgentName(activeWebsiteWidget?.assigned_agent_id || null)
          },
          {
            id: 'reminders',
            name: 'Reminders',
            description: 'Automated appointment reminders',
            icon: <Bell className="w-5 h-5" />,
            setupLink: '/dashboard/reminders',
            isActive: false, // Will be determined by checking reminders configuration
            assignedAgentId: null,
            assignedAgentName: null
          },
          {
            id: 'lead-reactivation',
            name: 'Lead Reactivation',
            description: 'Re-engage with previous leads',
            icon: <Users className="w-5 h-5" />,
            setupLink: '/dashboard/lead-reactivation',
            isActive: false,
            assignedAgentId: null,
            assignedAgentName: null
          },
          {
            id: 'whatsapp',
            name: 'WhatsApp',
            description: 'WhatsApp messaging integration',
            icon: <MessageSquare className="w-5 h-5" />,
            setupLink: '/dashboard/whatsapp',
            isActive: false,
            assignedAgentId: null,
            assignedAgentName: null
          },
          {
            id: 'sms',
            name: 'SMS',
            description: 'SMS messaging service',
            icon: <MessageSquare className="w-5 h-5" />,
            setupLink: '/dashboard/sms',
            isActive: agentsData.some(a => a.agent_type === 'sms_agent' && a.status === 'active'),
            assignedAgentId: agentsData.find(a => a.agent_type === 'sms_agent' && a.status === 'active')?.id || null,
            assignedAgentName: agentsData.find(a => a.agent_type === 'sms_agent' && a.status === 'active')?.name || null
          }
        ];

        setFeatures(featuresList);
      } catch (error) {
        console.error('Error fetching features:', error);
      } finally {
        setIsLoadingFeatures(false);
      }
    };

    if (user?.id) {
      fetchFeatures();
    }
  }, [user?.id]);

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

      {/* Features Section */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">Features</h2>
          <p className="text-sm text-gray-600 mt-1">Manage and configure your Boltcall features</p>
        </div>
        
        <div className="p-6">
          {isLoadingFeatures ? (
            <div className="text-center py-8 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm mt-2">Loading features...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className={`p-3 rounded-lg ${feature.isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <div className={feature.isActive ? 'text-blue-600' : 'text-gray-400'}>
                      {feature.icon}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{feature.name}</p>
                      {feature.isActive ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-2 truncate">{feature.description}</p>
                    {feature.assignedAgentName && (
                      <p className="text-xs text-gray-600">
                        Agent: <span className="font-medium">{feature.assignedAgentName}</span>
                      </p>
                    )}
                    {!feature.assignedAgentName && feature.isActive && (
                      <p className="text-xs text-gray-400">No agent assigned</p>
                    )}
                  </div>
                  
                  <Link
                    to={feature.setupLink}
                    className="flex-shrink-0 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
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
