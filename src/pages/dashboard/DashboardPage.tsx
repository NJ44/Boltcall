import React from 'react';
import { Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Plan from '../../components/ui/agent-plan';

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Agent Plan Component */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Plan />
      </div>

      {/* Agents Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Agents</h3>
              <p className="text-sm text-gray-600">Manage your AI receptionist agents</p>
            </div>
          </div>
          <Link
            to="/dashboard/agents"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Users className="w-4 h-4" />
            Manage Agents
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No agents created yet</h4>
          <p className="text-gray-600 mb-4">Create your first AI agent to start handling calls</p>
          <Link
            to="/dashboard/agents"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Users className="w-4 h-4" />
            Create Your First Agent
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
