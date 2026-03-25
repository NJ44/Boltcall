import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Star, Download } from 'lucide-react';
import Card from '../ui/Card';
import type { AgentPerformance } from '../../lib/analyticsApi';
import { exportToCsv } from '../../lib/exportUtils';

interface AgentPerformanceTableProps {
  agents: AgentPerformance[];
  loading?: boolean;
}

function fmtDuration(seconds: number): string {
  if (seconds === 0) return '\u2014';
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function getScoreColor(score: number): string {
  if (score === 0) return 'text-gray-400';
  if (score >= 4) return 'text-green-600';
  if (score >= 3) return 'text-amber-600';
  return 'text-red-600';
}

function getSuccessColor(rate: number): string {
  if (rate >= 80) return 'bg-green-100 text-green-700';
  if (rate >= 60) return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
}

const AgentPerformanceTable: React.FC<AgentPerformanceTableProps> = ({ agents, loading }) => {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="h-6 w-48 bg-gray-100 rounded animate-pulse mb-4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  if (agents.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-main mb-4">Agent Performance</h3>
        <div className="flex items-center justify-center h-32 text-sm text-text-muted">
          No agent data available yet.
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6" id="agent-performance">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-text-main">Agent Performance</h3>
        </div>
        <button
          onClick={() => exportToCsv(
            agents.map(a => ({
              Agent: a.agentName,
              'Calls Handled': a.callsHandled,
              'Avg Duration': fmtDuration(a.avgDurationSec),
              'Success Rate': `${a.successRate}%`,
              'Satisfaction': a.satisfactionScore || '\u2014',
            })),
            'agent-performance',
            'Agent Performance'
          )}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-muted hover:text-text-main border border-border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-text-muted border-b border-border">
              <th className="pb-3 pr-4">Agent</th>
              <th className="pb-3 pr-4 text-right">Calls</th>
              <th className="pb-3 pr-4 text-right">Avg Duration</th>
              <th className="pb-3 pr-4 text-right">Success Rate</th>
              <th className="pb-3 text-right">Satisfaction</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent, i) => (
              <motion.tr
                key={agent.agentId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-gray-50 last:border-0"
              >
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="font-medium text-text-main">{agent.agentName}</span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-right font-semibold text-text-main">{agent.callsHandled.toLocaleString()}</td>
                <td className="py-3 pr-4 text-right text-text-muted">{fmtDuration(agent.avgDurationSec)}</td>
                <td className="py-3 pr-4 text-right">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getSuccessColor(agent.successRate)}`}>{agent.successRate}%</span>
                </td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Star className={`w-3.5 h-3.5 ${getScoreColor(agent.satisfactionScore)}`} />
                    <span className={`text-sm font-medium ${getScoreColor(agent.satisfactionScore)}`}>
                      {agent.satisfactionScore > 0 ? agent.satisfactionScore.toFixed(1) : '\u2014'}
                    </span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default AgentPerformanceTable;
