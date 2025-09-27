import React from 'react';
import { Users, Phone, Clock, CheckCircle } from 'lucide-react';

const AgentsPage: React.FC = () => {
  const agents = [
    {
      id: 1,
      name: 'Sarah Johnson',
      status: 'active',
      callsToday: 24,
      avgResponseTime: '28s',
      successRate: '94%',
      lastActive: '2 min ago'
    },
    {
      id: 2,
      name: 'Mike Chen',
      status: 'active',
      callsToday: 18,
      avgResponseTime: '32s',
      successRate: '89%',
      lastActive: '5 min ago'
    },
    {
      id: 3,
      name: 'Emily Davis',
      status: 'idle',
      callsToday: 12,
      avgResponseTime: '35s',
      successRate: '91%',
      lastActive: '15 min ago'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Agents</h1>
        <p className="text-zinc-600 mt-1">Manage your AI receptionist agents and their performance</p>
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

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900">Add New Agent</h3>
          </div>
          <p className="text-sm text-zinc-600 mb-4">Create a new AI agent with custom settings</p>
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Create Agent
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900">Training Center</h3>
          </div>
          <p className="text-sm text-zinc-600 mb-4">Improve agent performance with training</p>
          <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Start Training
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900">Quality Check</h3>
          </div>
          <p className="text-sm text-zinc-600 mb-4">Review agent performance and quality</p>
          <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Run Check
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentsPage;
