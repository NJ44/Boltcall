import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, X, Sparkles, FileText, Wrench, Stethoscope, Home, Car, Utensils, GraduationCap, Briefcase, ShoppingCart, Heart, Scissors, MoreHorizontal, Flame, MessageCircle } from 'lucide-react';
import VoiceGallery from '../../components/ui/VoiceGallery';
import CardTable from '../../components/ui/CardTable';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Agent {
  id: string;
  name: string;
  status: string;
  callsToday: number;
  avgResponseTime: string;
  successRate: string;
  lastActive: string;
  agent_type?: string;
  description?: string;
  created_at?: string;
}

interface CreateAgentForm {
  name: string;
  voice: string;
  knowledgeBase: string;
  phoneNumber: string;
  humanTransferPhone: string;
  direction: 'inbound' | 'outbound';
  language: string;
}

interface KnowledgeBase {
  id: string;
  name: string;
}

interface PhoneNumber {
  id: string;
  number: string;
  name?: string;
}

interface IndustryTemplate {
  id: string;
  name: string;
  industry: string;
  icon: React.ReactNode;
  description: string;
  features: string[];
  voice: string;
  greeting: string;
  sampleQuestions: string[];
  color: string;
}

const AgentsPage: React.FC = () => {
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showTestChatModal, setShowTestChatModal] = useState(false);
  const [selectedAgentForTest, setSelectedAgentForTest] = useState<Agent | null>(null);
  const [userKnowledgeBases, setUserKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [userPhoneNumbers, setUserPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [createForm, setCreateForm] = useState<CreateAgentForm>({
    name: '',
    voice: '',
    knowledgeBase: '',
    phoneNumber: '',
    humanTransferPhone: '',
    direction: 'inbound',
    language: ''
  });

  // Industry-specific agent templates
  const industryTemplates: IndustryTemplate[] = [
    {
      id: 'hvac',
      name: 'HVAC Service Agent',
      industry: 'HVAC',
      icon: <Wrench className="w-8 h-8" />,
      description: 'Professional HVAC service agent for heating, cooling, and maintenance appointments',
      features: ['Emergency service scheduling', 'Maintenance reminders', 'Service quotes', 'Warranty information'],
      voice: 'Professional Male',
      greeting: 'Hello! Thank you for calling our HVAC services. How can I help you today?',
      sampleQuestions: [
        'What type of HVAC service do you need?',
        'Is this an emergency repair?',
        'Would you like to schedule a maintenance appointment?',
        'Do you need a service quote?'
      ],
      color: 'bg-blue-500'
    },
    {
      id: 'dentist',
      name: 'Dental Practice Agent',
      industry: 'Dental',
      icon: <Stethoscope className="w-8 h-8" />,
      description: 'Friendly dental practice agent for appointment scheduling and patient care',
      features: ['Appointment scheduling', 'Insurance verification', 'Treatment reminders', 'Emergency care'],
      voice: 'Friendly Female',
      greeting: 'Welcome to our dental practice! I\'m here to help you with your dental care needs.',
      sampleQuestions: [
        'What type of dental appointment do you need?',
        'Do you have dental insurance?',
        'Are you experiencing any dental pain?',
        'Would you like to schedule a cleaning?'
      ],
      color: 'bg-green-500'
    },
    {
      id: 'real-estate',
      name: 'Real Estate Agent',
      industry: 'Real Estate',
      icon: <Home className="w-8 h-8" />,
      description: 'Real estate agent for property inquiries and appointment scheduling',
      features: ['Property inquiries', 'Showing appointments', 'Market information', 'Buyer consultations'],
      voice: 'Professional Female',
      greeting: 'Hello! Thank you for your interest in our real estate services. How can I assist you?',
      sampleQuestions: [
        'Are you looking to buy or sell?',
        'What type of property are you interested in?',
        'What is your budget range?',
        'Would you like to schedule a showing?'
      ],
      color: 'bg-purple-500'
    },
    {
      id: 'auto-repair',
      name: 'Auto Repair Agent',
      industry: 'Automotive',
      icon: <Car className="w-8 h-8" />,
      description: 'Automotive service agent for repair appointments and maintenance scheduling',
      features: ['Service appointments', 'Diagnostic scheduling', 'Parts ordering', 'Warranty claims'],
      voice: 'Professional Male',
      greeting: 'Hello! Thank you for calling our auto repair shop. What can we help you with today?',
      sampleQuestions: [
        'What type of repair do you need?',
        'What is the make and model of your vehicle?',
        'Is your vehicle currently drivable?',
        'Do you need a rental car?'
      ],
      color: 'bg-orange-500'
    },
    {
      id: 'restaurant',
      name: 'Restaurant Agent',
      industry: 'Restaurant',
      icon: <Utensils className="w-8 h-8" />,
      description: 'Restaurant agent for reservations and customer service',
      features: ['Reservation management', 'Menu inquiries', 'Special events', 'Customer feedback'],
      voice: 'Friendly Female',
      greeting: 'Welcome to our restaurant! I\'m here to help you with reservations and any questions.',
      sampleQuestions: [
        'How many people is the reservation for?',
        'What date and time would you prefer?',
        'Do you have any dietary restrictions?',
        'Are you celebrating a special occasion?'
      ],
      color: 'bg-red-500'
    },
    {
      id: 'education',
      name: 'Education Agent',
      industry: 'Education',
      icon: <GraduationCap className="w-8 h-8" />,
      description: 'Educational institution agent for enrollment and student services',
      features: ['Enrollment inquiries', 'Course information', 'Student support', 'Event scheduling'],
      voice: 'Professional Female',
      greeting: 'Welcome to our educational institution! How can I help you with your educational journey?',
      sampleQuestions: [
        'Are you interested in enrolling?',
        'What program are you considering?',
        'Do you need financial aid information?',
        'Would you like to schedule a campus tour?'
      ],
      color: 'bg-indigo-500'
    },
    {
      id: 'legal',
      name: 'Legal Services Agent',
      industry: 'Legal',
      icon: <Briefcase className="w-8 h-8" />,
      description: 'Legal services agent for consultation scheduling and case inquiries',
      features: ['Consultation scheduling', 'Case inquiries', 'Document services', 'Legal advice'],
      voice: 'Professional Male',
      greeting: 'Thank you for contacting our law firm. How can we assist you with your legal needs?',
      sampleQuestions: [
        'What type of legal service do you need?',
        'Is this a new case or existing matter?',
        'Do you need a consultation?',
        'Are there any urgent deadlines?'
      ],
      color: 'bg-gray-700'
    },
    {
      id: 'retail',
      name: 'Retail Agent',
      industry: 'Retail',
      icon: <ShoppingCart className="w-8 h-8" />,
      description: 'Retail agent for customer service and product inquiries',
      features: ['Product inquiries', 'Order tracking', 'Returns processing', 'Customer support'],
      voice: 'Friendly Female',
      greeting: 'Hello! Welcome to our store. How can I help you find what you\'re looking for?',
      sampleQuestions: [
        'What product are you looking for?',
        'Do you need help with sizing?',
        'Would you like to check product availability?',
        'Do you have any questions about our return policy?'
      ],
      color: 'bg-pink-500'
    },
    {
      id: 'healthcare',
      name: 'Healthcare Agent',
      industry: 'Healthcare',
      icon: <Heart className="w-8 h-8" />,
      description: 'Healthcare agent for appointment scheduling and patient services',
      features: ['Appointment scheduling', 'Insurance verification', 'Prescription refills', 'Test results'],
      voice: 'Professional Female',
      greeting: 'Hello! Thank you for calling our healthcare clinic. How can we help you today?',
      sampleQuestions: [
        'What type of appointment do you need?',
        'Are you a new or returning patient?',
        'Do you have insurance?',
        'Is this an urgent medical concern?'
      ],
      color: 'bg-teal-500'
    },
    {
      id: 'beauty',
      name: 'Beauty Salon Agent',
      industry: 'Beauty',
      icon: <Scissors className="w-8 h-8" />,
      description: 'Beauty salon agent for appointment scheduling and service inquiries',
      features: ['Service booking', 'Stylist preferences', 'Package deals', 'Special events'],
      voice: 'Friendly Female',
      greeting: 'Welcome to our beauty salon! I\'m here to help you book your next appointment.',
      sampleQuestions: [
        'What service would you like to book?',
        'Do you have a preferred stylist?',
        'What date and time work for you?',
        'Are you celebrating a special occasion?'
      ],
      color: 'bg-rose-500'
    }
  ];

  const handleInputChange = (field: keyof CreateAgentForm, value: string) => {
    setCreateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateAgent = () => {
    // Here you would typically save the agent to your backend
    console.log('Creating agent:', createForm);
    // Reset form and close modal
    setCreateForm({
      name: '',
      voice: '',
      knowledgeBase: '',
      phoneNumber: '',
      humanTransferPhone: '',
      direction: 'inbound',
      language: ''
    });
    setShowCreateModal(false);
  };

  const handleTemplateSelect = (template: IndustryTemplate) => {
    // Pre-fill the form with template data
    setCreateForm({
      name: template.name,
      voice: template.voice,
      knowledgeBase: template.description,
      phoneNumber: '',
      humanTransferPhone: '',
      direction: 'inbound',
      language: 'English'
    });
    setShowTemplatesModal(false);
    setShowCreateModal(true);
  };

  const handleTestChat = (agent: Agent) => {
    setSelectedAgentForTest(agent);
    setShowTestChatModal(true);
  };

  // Fetch agents from Supabase
  useEffect(() => {
    const fetchAgents = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('agents')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching agents:', error);
          return;
        }

        // Transform Supabase data to Agent interface
        const transformedAgents: Agent[] = (data || []).map((agent: any) => ({
          id: agent.id,
          name: agent.name,
          status: agent.status || 'active',
          callsToday: agent.total_calls || 0,
          avgResponseTime: agent.average_call_duration 
            ? `${Math.floor(agent.average_call_duration / 60)}m ${agent.average_call_duration % 60}s`
            : '0m 0s',
          successRate: agent.conversion_rate 
            ? `${agent.conversion_rate}%`
            : '0%',
          lastActive: agent.updated_at 
            ? new Date(agent.updated_at).toLocaleDateString()
            : new Date().toLocaleDateString(),
          agent_type: agent.agent_type,
          description: agent.description,
          created_at: agent.created_at
        }));

        setAgents(transformedAgents);
      } catch (error) {
        console.error('Error fetching agents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgents();
  }, [user?.id]);

  // Fetch user's knowledge bases
  useEffect(() => {
    const fetchKnowledgeBases = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('knowledge_base')
          .select('id, title')
          .eq('user_id', user.id)
          .order('title');

        if (error) {
          console.error('Error fetching knowledge bases:', error);
          return;
        }

        setUserKnowledgeBases((data || []).map(kb => ({
          id: kb.id,
          name: kb.title
        })));
      } catch (error) {
        console.error('Error fetching knowledge bases:', error);
      }
    };

    fetchKnowledgeBases();
  }, [user?.id]);

  // Fetch user's phone numbers
  useEffect(() => {
    const fetchPhoneNumbers = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('phone_numbers')
          .select('id, number, name')
          .eq('user_id', user.id)
          .order('name');

        if (error) {
          console.error('Error fetching phone numbers:', error);
          return;
        }

        setUserPhoneNumbers(data || []);
      } catch (error) {
        console.error('Error fetching phone numbers:', error);
      }
    };

    fetchPhoneNumbers();
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading agents...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {agents.length === 0 ? (
        /* No agents - Show create options */
        <div>
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Create New Agent</h2>
            <p className="text-lg text-gray-600">Choose how you want to start working with the agent</p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {/* Start from Scratch */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="group bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-gray-400 hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-900 transition-colors">
                <Sparkles className="w-8 h-8 text-gray-900 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Start from Scratch</h3>
              <p className="text-gray-600">Build your AI Agent from the ground up</p>
            </button>

            {/* Browse Templates */}
            <button
              onClick={() => setShowTemplatesModal(true)}
              className="group bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-gray-400 hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-900 transition-colors">
                <FileText className="w-8 h-8 text-gray-900 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Browse our Templates</h3>
              <p className="text-gray-600">Get inspired by our industry-specific templates to get started</p>
            </button>
          </div>
        </div>
      ) : (
        /* Has agents - Show table and add button */
        <>
          {/* Add Agent Button */}
          <div className="flex justify-end">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Agent
            </button>
          </div>

          {/* Agents Card Table */}
          <CardTable
            columns={[
              { key: 'name', label: 'Agent', width: '25%' },
              { key: 'status', label: 'Status', width: '15%' },
              { key: 'callsToday', label: 'Calls Today', width: '15%' },
              { key: 'avgResponseTime', label: 'Avg Response', width: '15%' },
              { key: 'successRate', label: 'Success Rate', width: '15%' },
              { key: 'lastActive', label: 'Last Active', width: '15%' }
            ]}
            data={agents}
            renderRow={(agent) => (
              <div className="flex items-center gap-6">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                
                {/* Agent Name */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-zinc-600" />
                  </div>
                  <div className="font-medium text-gray-900">{agent.name}</div>
                </div>
                
                {/* Status */}
                <div className="flex-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    agent.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      agent.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'
                    }`}></div>
                    {agent.status}
                  </span>
                </div>
                
                {/* Calls Today */}
                <div className="text-sm text-gray-900 flex-1">
                  {agent.callsToday}
                </div>
                
                {/* Avg Response */}
                <div className="text-sm text-gray-900 flex-1">
                  {agent.avgResponseTime}
                </div>
                
                {/* Success Rate */}
                <div className="text-sm text-gray-900 flex-1">
                  {agent.successRate}
                </div>
                
                {/* Last Active */}
                <div className="text-sm text-gray-500 flex-1">
                  {agent.lastActive}
                </div>
                
                {/* Action Icons */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleTestChat(agent)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Test Chat"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-800">
                    <Flame className="w-4 h-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-800">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            emptyStateText="No agents found. Create your first AI agent to get started."
            searchPlaceholder="Search agents..."
            filterOptions={[
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' }
            ]}
            onAddNew={() => setShowCreateModal(true)}
            addNewText="Add Agent"
          />
        </>
      )}

      {/* Create Agent Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-zinc-900">Create New Agent</h2>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Note:</strong> You can change any of these settings later after creating the agent.
                  </p>
                </div>

                {/* Agent Name */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Agent Name *
                  </label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter agent name"
                  />
                </div>

                {/* Voice Choice */}
                <div>
                  <VoiceGallery
                    selectedVoiceId={createForm.voice}
                    onVoiceSelect={(voiceId) => handleInputChange('voice', voiceId)}
                  />
                </div>


                {/* Knowledge Base Choice */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Knowledge Base *
                  </label>
                  <select
                    value={createForm.knowledgeBase}
                    onChange={(e) => handleInputChange('knowledgeBase', e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-zinc-900"
                  >
                    <option value="" className="text-zinc-900">Select knowledge base</option>
                    {userKnowledgeBases.map((kb) => (
                      <option key={kb.id} value={kb.id} className="text-zinc-900">
                        {kb.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-blue-600 mt-2">
                    <a 
                      href="/dashboard/knowledge-base" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-blue-800 underline"
                    >
                      Create a new knowledge base
                    </a>
                  </p>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Phone Number *
                  </label>
                  <select
                    value={createForm.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-zinc-900"
                  >
                    <option value="" className="text-zinc-900">Select phone number</option>
                    {userPhoneNumbers.map((phone) => (
                      <option key={phone.id} value={phone.number} className="text-zinc-900">
                        {phone.number} {phone.name && `(${phone.name})`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Human Transfer Phone */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Human Transfer Phone
                  </label>
                  <input
                    type="tel"
                    value={createForm.humanTransferPhone}
                    onChange={(e) => handleInputChange('humanTransferPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+1 (555) 987-6543"
                  />
                </div>

                {/* Inbound/Outbound */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Call Direction *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center text-zinc-900">
                      <input
                        type="radio"
                        name="direction"
                        value="inbound"
                        checked={createForm.direction === 'inbound'}
                        onChange={(e) => handleInputChange('direction', e.target.value as 'inbound' | 'outbound')}
                        className="mr-2"
                      />
                      Inbound (Receives calls)
                    </label>
                    <label className="flex items-center text-zinc-900">
                      <input
                        type="radio"
                        name="direction"
                        value="outbound"
                        checked={createForm.direction === 'outbound'}
                        onChange={(e) => handleInputChange('direction', e.target.value as 'inbound' | 'outbound')}
                        className="mr-2"
                      />
                      Outbound (Makes calls)
                    </label>
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Language *
                  </label>
                  <select
                    value={createForm.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-zinc-900"
                  >
                    <option value="" className="text-zinc-900">Select language</option>
                    <option value="en" className="text-zinc-900">English</option>
                    <option value="es" className="text-zinc-900">Spanish</option>
                    <option value="fr" className="text-zinc-900">French</option>
                    <option value="de" className="text-zinc-900">German</option>
                    <option value="it" className="text-zinc-900">Italian</option>
                    <option value="pt" className="text-zinc-900">Portuguese</option>
                    <option value="zh" className="text-zinc-900">Chinese</option>
                    <option value="ja" className="text-zinc-900">Japanese</option>
                    <option value="ko" className="text-zinc-900">Korean</option>
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-zinc-200">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-zinc-700 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAgent}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Agent
                </button>
              </div>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Templates Modal */}
      {showTemplatesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-zinc-900">Browse Industry Templates</h2>
                <button 
                  onClick={() => setShowTemplatesModal(false)}
                  className="text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <p className="text-zinc-600 mb-6">
                Choose from our pre-built AI agent templates designed for specific industries. 
                Each template comes with industry-specific features, sample questions, and optimized settings.
              </p>

              {/* Templates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {industryTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    {/* Template Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-8 h-8 ${template.color} rounded-lg flex items-center justify-center text-white`}>
                        {template.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                          {template.name}
                        </h3>
                        <p className="text-xs text-gray-500">{template.industry}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2">{template.description}</p>

                    {/* Features */}
                    <div className="mb-3">
                      <h4 className="text-xs font-medium text-gray-900 mb-1">Features:</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {template.features.slice(0, 2).map((feature, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            {feature}
                          </li>
                        ))}
                        {template.features.length > 2 && (
                          <li className="text-gray-500 text-xs">+{template.features.length - 2} more</li>
                        )}
                      </ul>
                    </div>

                    {/* Voice */}
                    <div className="text-xs text-gray-500 mb-3">
                      <div><strong>Voice:</strong> {template.voice}</div>
                    </div>

                    {/* Use Template Button */}
                    <button className="w-full mt-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium">
                      Use Template
                    </button>
                  </div>
                ))}
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-zinc-200">
                <button
                  onClick={() => setShowTemplatesModal(false)}
                  className="px-4 py-2 text-zinc-700 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Chat Modal */}
      {showTestChatModal && selectedAgentForTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-zinc-900">Test Chat - {selectedAgentForTest.name}</h2>
                <button 
                  onClick={() => {
                    setShowTestChatModal(false);
                    setSelectedAgentForTest(null);
                  }}
                  className="text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm mb-2">
                    <strong>How it works:</strong>
                  </p>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Enter your phone number below</li>
                    <li>• Click "Call Me" to receive a call</li>
                    <li>• Test your AI agent in real-time</li>
                  </ul>
                </div>

                {/* Retell Chat Widget Container */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div id="retell-voice-widget" className="min-h-[200px] flex items-center justify-center">
                    <div className="text-center">
                      <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Test your AI agent with a phone callback</p>
                      <div className="space-y-3">
                        <input
                          type="tel"
                          placeholder="Enter your phone number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          id="phone-input"
                        />
                        <button
                          onClick={() => initializeRetellWidget(selectedAgentForTest.id)}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Call Me Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 text-center">
                  This will initiate a phone call to test your AI agent. Standard call rates may apply.
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-200">
                <button
                  onClick={() => {
                    setShowTestChatModal(false);
                    setSelectedAgentForTest(null);
                  }}
                  className="px-4 py-2 text-zinc-700 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Function to initialize Retell widget
const initializeRetellWidget = (agentId: string) => {
  const phoneInput = document.getElementById('phone-input') as HTMLInputElement;
  const phoneNumber = phoneInput?.value;

  if (!phoneNumber) {
    alert('Please enter your phone number');
    return;
  }

  // Load Retell script if not already loaded
  if (!document.querySelector('script[src="https://cdn.retellai.com/chat-widget.js"]')) {
    const script = document.createElement('script');
    script.src = 'https://cdn.retellai.com/chat-widget.js';
    script.onload = () => {
      initWidget(agentId, phoneNumber);
    };
    document.head.appendChild(script);
  } else {
    initWidget(agentId, phoneNumber);
  }
};

// Initialize the widget
const initWidget = (agentId: string, phoneNumber: string) => {
  const container = document.getElementById('retell-voice-widget');
  if (container && (window as any).RetellChatWidget) {
    // Clear existing content
    container.innerHTML = '<div id="retell-voice"></div>';
    
    // Initialize Retell widget
    (window as any).RetellChatWidget.init({
      publicKey: "public_key_c894825223963729a1ba5",
      agentId: agentId,
      mode: "callback",
      mount: document.getElementById("retell-voice"),
      phoneNumber: phoneNumber // Pre-fill the phone number
    });
  }
};

export default AgentsPage;
