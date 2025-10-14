import React, { useState } from 'react';
import { Users, Plus, X, Sparkles, FileText } from 'lucide-react';
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

const AgentsPage: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
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

  // Empty array to show no agents state, or populate with agents
  const agents: Agent[] = [];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Agents</h1>
      </div>

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
              onClick={() => setShowCreateModal(true)}
              className="group bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-gray-400 hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-900 transition-colors">
                <FileText className="w-8 h-8 text-gray-900 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Browse our Templates</h3>
              <p className="text-gray-600">Get inspired by our templates to get started</p>
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
            <div className="px-6 py-4 border-b border-zinc-200">
              <h2 className="text-lg font-semibold text-zinc-900">Active Agents</h2>
            </div>
            
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

    </div>
  );
};

export default AgentsPage;
