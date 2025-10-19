import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Plus, Copy, Eye, EyeOff, Code, Globe, Settings } from 'lucide-react';

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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: '',
    color: '#3B82F6',
    position: 'bottom-right' as const
  });

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

    return `<!-- Boltcall Website Bubble Integration -->
<script>
  window.BoltcallConfig = {
    widgetId: '${agent.widgetId}',
    agentName: '${agent.name}',
    color: '${agent.color}',
    position: '${agent.position}',
    apiKey: 'your-api-key-here'
  };
</script>
<script src="https://cdn.boltcall.com/widget.js" async></script>`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleCreateAgent = () => {
    if (newAgent.name.trim()) {
      const agent: ClientAgent = {
        id: Date.now().toString(),
        name: newAgent.name.trim(),
        status: 'active',
        widgetId: `boltcall-${newAgent.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        color: newAgent.color,
        position: newAgent.position,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setClientAgents([...clientAgents, agent]);
      setNewAgent({ name: '', color: '#3B82F6', position: 'bottom-right' });
      setShowCreateModal(false);
    }
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Website Bubble</h1>
          <p className="text-gray-600 mt-1">
            Manage your website chat bubbles and get integration code for your client agents.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Agent
        </button>
      </motion.div>

      {/* Client Agents Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-lg border border-gray-200 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Client Agents</h2>
          <p className="text-sm text-gray-600">Manage your website chat agents and their configurations.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Widget ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clientAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: agent.color }}
                      ></div>
                      <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 font-mono">{agent.widgetId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {agent.position.replace('-', ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(agent.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                      <button
                        className="text-gray-600 hover:text-gray-900"
                        title="Settings"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Integration Code Modal */}
      {showIntegrationCode && selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Integration Code</h2>
                <button
                  onClick={() => setShowIntegrationCode(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <EyeOff className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agent: {clientAgents.find(a => a.id === selectedAgent)?.name}
                </label>
                <p className="text-sm text-gray-600 mb-4">
                  Copy this code and paste it into your website's HTML, just before the closing &lt;/body&gt; tag.
                </p>
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

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Integration Instructions:</h3>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Copy the code above</li>
                  <li>Paste it into your website's HTML before the closing &lt;/body&gt; tag</li>
                  <li>Replace 'your-api-key-here' with your actual API key</li>
                  <li>Save and publish your website</li>
                  <li>The chat bubble will appear on your website</li>
                </ol>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowIntegrationCode(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Agent Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create New Agent</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <EyeOff className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agent Name
                  </label>
                  <input
                    type="text"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter agent name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bubble Color
                  </label>
                  <input
                    type="color"
                    value={newAgent.color}
                    onChange={(e) => setNewAgent({ ...newAgent, color: e.target.value })}
                    className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <select
                    value={newAgent.position}
                    onChange={(e) => setNewAgent({ ...newAgent, position: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="top-left">Top Left</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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

export default WebsiteBubblePage;
