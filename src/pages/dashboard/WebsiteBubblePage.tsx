import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, X, Code, Settings, MessageCircle, Palette, Image, Type } from 'lucide-react';
import CardTable from '../../components/ui/CardTable';

interface ClientAgent {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  widgetId: string;
  color: string;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  createdAt: string;
}

const WebsiteBubblePage: React.FC = () => {
  const [showIntegrationCode, setShowIntegrationCode] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>('');

  // Mock client agents data
  const [clientAgents, setClientAgents] = useState<ClientAgent[]>([
    {
      id: '1',
      name: 'Sales Agent',
      status: 'active',
      widgetId: 'boltcall-sales-001',
      color: '#3B82F6',
      position: 'bottom-right',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Support Agent',
      status: 'active',
      widgetId: 'boltcall-support-002',
      color: '#10B981',
      position: 'bottom-left',
      createdAt: '2024-01-20'
    },
    {
      id: '3',
      name: 'Lead Capture',
      status: 'inactive',
      widgetId: 'boltcall-leads-003',
      color: '#F59E0B',
      position: 'top-right',
      createdAt: '2024-01-25'
    }
  ]);

  const generateIntegrationCode = (agentId: string) => {
    const agent = clientAgents.find(a => a.id === agentId);
    if (!agent) return '';

    return `<script
    id="retell-widget"
    src="https://dashboard.retellai.com/retell-widget.js"
    type="module"
    data-public-key="YOUR_RETELL_PUBLIC_KEY"
    data-agent-id="YOUR_CHAT_AGENT_ID"
    data-agent-version="YOUR_AGENT_VERSION"
    data-title="YOUR_CUSTOM_TITLE"
    data-logo-url="YOUR_LOGO_URL"
    data-color="YOUR_CUSTOM_COLOR"
    data-bot-name="YOUR_BOT_NAME"
    data-popup-message="YOUR_POPUP_MESSAGE"
    data-show-ai-popup="true"
    data-show-ai-popup-time="5"
    data-auto-open="false"
    data-dynamic='{"key": "value"}'
    data-recaptcha-key="YOUR_GOOGLE_RECAPTCHA_SITE_KEY"
></script>`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };


  const toggleAgentStatus = (id: string) => {
    setClientAgents(clientAgents.map(agent => 
      agent.id === id 
        ? { ...agent, status: agent.status === 'active' ? 'inactive' : 'active' }
        : agent
    ));
  };

  return (
    <div className="space-y-6">

      {/* Client Agents Card Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <CardTable
          columns={[
            { key: 'name', label: 'Agent Name', width: '40%' },
            { key: 'status', label: 'Status', width: '20%' },
            { key: 'createdAt', label: 'Created', width: '20%' },
            { key: 'actions', label: 'Actions', width: '20%' }
          ]}
          data={clientAgents}
          renderRow={(agent) => (
            <div className="flex items-center gap-6">
              {/* Checkbox */}
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              
              {/* Agent Name */}
              <div className="flex items-center gap-3 flex-1">
                <div className="font-medium text-gray-900">{agent.name}</div>
              </div>
              
              {/* Status */}
              <div className="flex-1">
                <button
                  onClick={() => toggleAgentStatus(agent.id)}
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    agent.status === 'active'
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {agent.status}
                </button>
              </div>
              
              {/* Created Date */}
              <div className="text-sm text-gray-500 flex-1">
                {new Date(agent.createdAt).toLocaleDateString()}
              </div>
              
              {/* Action Icons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedAgent(agent.id);
                    setShowIntegrationCode(true);
                  }}
                  className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                >
                  <Code className="w-4 h-4" />
                  Get Code
                </button>
                <button className="text-gray-600 hover:text-gray-900">
                  <Settings className="w-4 h-4" />
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
          onAddNew={() => console.log('Add new agent')}
          addNewText="Create Agent"
        />
      </motion.div>

      {/* Bubble Widget Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-lg border border-gray-200 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Widget Settings</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Color Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Palette className="w-4 h-4 inline mr-1" />
              Widget Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                defaultValue="#3B82F6"
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                defaultValue="#3B82F6"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="#3B82F6"
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Image className="w-4 h-4 inline mr-1" />
              Logo Upload
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Bot Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Type className="w-4 h-4 inline mr-1" />
              Bot Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="AI Assistant"
            />
          </div>

          {/* Popup Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageCircle className="w-4 h-4 inline mr-1" />
              Popup Message
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Hi! How can I help you today?"
            />
          </div>

        </div>

        <div className="mt-6 flex justify-end">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Save Settings
          </button>
        </div>
      </motion.div>

      {/* Integration Code Modal */}
      {showIntegrationCode && selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0 m-0">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Integration Code</h2>
                <button
                  onClick={() => setShowIntegrationCode(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agent: {clientAgents.find(a => a.id === selectedAgent)?.name}
                </label>
                <p className="text-sm text-gray-600 mb-4">
                  Copy this Retell widget code and paste it into your website's HTML, just before the closing &lt;/body&gt; tag.
                </p>
              </div>

              {/* Integration Instructions - moved before code */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Integration Instructions:</h3>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Copy the Retell widget code below</li>
                  <li>Replace the placeholder values with your actual configuration</li>
                  <li>Paste the code into your website's HTML before the closing &lt;/body&gt; tag</li>
                  <li>Save and publish your website</li>
                  <li>The AI chat bubble will appear on your website</li>
                </ol>
              </div>

              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{generateIntegrationCode(selectedAgent)}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(generateIntegrationCode(selectedAgent))}
                  className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default WebsiteBubblePage;
