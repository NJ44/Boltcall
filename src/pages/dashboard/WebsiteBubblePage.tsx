import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, X, Code, Settings } from 'lucide-react';

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


  const toggleAgentStatus = (id: string) => {
    setClientAgents(clientAgents.map(agent => 
      agent.id === id 
        ? { ...agent, status: agent.status === 'active' ? 'inactive' : 'active' }
        : agent
    ));
  };

  return (
    <div className="space-y-6">

      {/* Client Agents Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-lg border border-gray-200 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200">
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
                  Status
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
                  <X className="w-6 h-6" />
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

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default WebsiteBubblePage;
