import React, { useState } from 'react';
import { Users, Plus, X, Sparkles, FileText, Wrench, Stethoscope, Home, Car, Utensils, GraduationCap, Briefcase, ShoppingCart, Heart, Scissors } from 'lucide-react';
import VoiceGallery from '../../components/ui/VoiceGallery';

interface Agent {
  id: number;
  name: string;
  status: string;
  callsToday: number;
  avgResponseTime: string;
  successRate: string;
  lastActive: string;
}

interface CreateAgentForm {
  name: string;
  voice: string;
  timezone: string;
  knowledgeBase: string;
  phoneNumber: string;
  humanTransferPhone: string;
  direction: 'inbound' | 'outbound';
  language: string;
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [createForm, setCreateForm] = useState<CreateAgentForm>({
    name: '',
    voice: '',
    timezone: '',
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
      timezone: '',
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
      timezone: 'America/New_York',
      knowledgeBase: template.description,
      phoneNumber: '',
      humanTransferPhone: '',
      direction: 'inbound',
      language: 'English'
    });
    setShowTemplatesModal(false);
    setShowCreateModal(true);
  };

  // Empty array to show no agents state, or populate with agents
  const agents: Agent[] = [];

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

          {/* Agents table */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Agent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Calls Today
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Avg Response
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Last Active
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {agents.map((agent) => (
                    <tr key={agent.id} className="hover:bg-zinc-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-zinc-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-zinc-900">{agent.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                        {agent.callsToday}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                        {agent.avgResponseTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                        {agent.successRate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                        {agent.lastActive}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Create Agent Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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

                {/* Timezone */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Timezone *
                  </label>
                  <select
                    value={createForm.timezone}
                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select timezone</option>
                    <option value="UTC-8">Pacific Time (UTC-8)</option>
                    <option value="UTC-7">Mountain Time (UTC-7)</option>
                    <option value="UTC-6">Central Time (UTC-6)</option>
                    <option value="UTC-5">Eastern Time (UTC-5)</option>
                    <option value="UTC+0">UTC (UTC+0)</option>
                    <option value="UTC+1">Central European Time (UTC+1)</option>
                    <option value="UTC+8">China Standard Time (UTC+8)</option>
                  </select>
                </div>

                {/* Knowledge Base Choice */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Knowledge Base *
                  </label>
                  <select
                    value={createForm.knowledgeBase}
                    onChange={(e) => handleInputChange('knowledgeBase', e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select knowledge base</option>
                    <option value="general">General Business</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="legal">Legal Services</option>
                    <option value="tech">Technology</option>
                    <option value="custom">Custom Knowledge Base</option>
                  </select>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={createForm.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+1 (555) 123-4567"
                  />
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
                    <label className="flex items-center">
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
                    <label className="flex items-center">
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
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select language</option>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                    <option value="pt">Portuguese</option>
                    <option value="zh">Chinese</option>
                    <option value="ja">Japanese</option>
                    <option value="ko">Korean</option>
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
          </div>
        </div>
      )}

      {/* Templates Modal */}
      {showTemplatesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-zinc-900">Browse Industry Templates</h2>
                <button 
                  onClick={() => setShowTemplatesModal(false)}
                  className="text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <p className="text-zinc-600 mb-4 text-sm">
                Choose from our pre-built AI agent templates designed for specific industries.
              </p>

              {/* Templates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {industryTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    {/* Template Header */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 ${template.color} rounded-md flex items-center justify-center text-white text-sm`}>
                        {template.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                          {template.name}
                        </h3>
                        <p className="text-xs text-gray-500">{template.industry}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-xs mb-2 line-clamp-2">{template.description}</p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {template.features.slice(0, 2).map((feature, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {feature}
                        </span>
                      ))}
                      {template.features.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          +{template.features.length - 2}
                        </span>
                      )}
                    </div>

                    {/* Use Template Button */}
                    <button className="w-full px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors">
                      Use Template
                    </button>
                  </div>
                ))}
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-zinc-200">
                <button
                  onClick={() => setShowTemplatesModal(false)}
                  className="px-3 py-2 text-zinc-700 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AgentsPage;
