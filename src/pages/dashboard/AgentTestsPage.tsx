import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Play,
  Loader2,
  AlertCircle,
  Shield,
  ChevronDown,
  ChevronUp,
  Wrench,
  Zap,
  Activity,
  RefreshCw,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Agent {
  id: string;
  name: string;
  retell_agent_id: string;
  agent_type?: string;
}

interface TestScenarioResult {
  scenarioId: string;
  scenarioName: string;
  chatId: string;
  conversation: Array<{ role: string; content: string }>;
  analysis: any;
  successCriteria: string;
}

interface TestRunResult {
  success: boolean;
  agentId: string;
  summary: {
    total: number;
    passed: number;
    failed: number;
    unknown: number;
  };
  results: TestScenarioResult[];
}

interface SelfHealRecord {
  id: string;
  agent_id: string;
  failure_type: string;
  failure_summary: string;
  root_cause: string;
  severity: string;
  reproduced_count: number;
  prompt_fix_applied: string | null;
  fix_verified: boolean;
  fix_success_rate: number;
  prompt_reverted: boolean;
  elapsed_ms: number;
  status: string;
  created_at: string;
}

interface TestRunRecord {
  id: string;
  agent_id: string;
  test_type: string;
  scenarios_total: number;
  scenarios_passed: number;
  scenarios_failed: number;
  results: any;
  elapsed_ms: number;
  status: string;
  created_at: string;
}

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------

const FUNCTIONS_BASE = import.meta.env.DEV
  ? 'http://localhost:8888/.netlify/functions'
  : '/.netlify/functions';

async function runAgentTests(agentId: string): Promise<TestRunResult> {
  const res = await fetch(`${FUNCTIONS_BASE}/agent-test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'run-tests', agentId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Test failed' }));
    throw new Error(err.error || 'Test failed');
  }
  return res.json();
}

async function fetchSelfHealHistory(userId: string): Promise<SelfHealRecord[]> {
  const { data, error } = await supabase
    .from('agent_self_heal_log')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return data || [];
}

async function fetchTestRunHistory(userId: string): Promise<TestRunRecord[]> {
  const { data, error } = await supabase
    .from('agent_test_runs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return data || [];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getSeverityBadge(severity: string) {
  const map: Record<string, string> = {
    critical: 'bg-red-100 text-red-700',
    high: 'bg-orange-100 text-orange-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-gray-100 text-gray-600',
  };
  return map[severity] || 'bg-gray-100 text-gray-600';
}

function getStatusBadge(status: string) {
  const map: Record<string, string> = {
    fixed: 'bg-green-100 text-green-700',
    reverted: 'bg-red-100 text-red-700',
    analyzing: 'bg-blue-100 text-blue-700',
    testing: 'bg-indigo-100 text-indigo-700',
    failed: 'bg-red-100 text-red-700',
    completed: 'bg-green-100 text-green-700',
    running: 'bg-blue-100 text-blue-700',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
}

function getPassRateColor(passed: number, total: number): string {
  if (total === 0) return 'text-gray-500';
  const rate = (passed / total) * 100;
  if (rate >= 80) return 'text-green-600';
  if (rate >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

const AgentTestsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'tests' | 'self-heal'>('tests');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selfHealRecords, setSelfHealRecords] = useState<SelfHealRecord[]>([]);
  const [testRunRecords, setTestRunRecords] = useState<TestRunRecord[]>([]);

  // Test running state
  const [runningAgent, setRunningAgent] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<TestRunResult | null>(null);
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null);
  const [expandedHeal, setExpandedHeal] = useState<string | null>(null);

  // -----------------------------------------------------------------------
  // Load data
  // -----------------------------------------------------------------------

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [agentRows, healRecords, testRecords] = await Promise.all([
        supabase
          .from('agents')
          .select('id, name, retell_agent_id, agent_type')
          .eq('user_id', user.id)
          .not('retell_agent_id', 'is', null)
          .then(({ data }) => data || []),
        fetchSelfHealHistory(user.id),
        fetchTestRunHistory(user.id),
      ]);

      setAgents(agentRows);
      setSelfHealRecords(healRecords);
      setTestRunRecords(testRecords);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // -----------------------------------------------------------------------
  // Run test
  // -----------------------------------------------------------------------

  const handleRunTest = async (agent: Agent) => {
    if (runningAgent) return;
    setRunningAgent(agent.id);
    setTestResult(null);
    setExpandedScenario(null);

    try {
      const result = await runAgentTests(agent.retell_agent_id);
      setTestResult(result);

      // Store in Supabase
      if (user) {
        await supabase.from('agent_test_runs').insert({
          agent_id: agent.retell_agent_id,
          user_id: user.id,
          test_type: 'manual',
          scenarios_total: result.summary.total,
          scenarios_passed: result.summary.passed,
          scenarios_failed: result.summary.failed,
          scenarios_unknown: result.summary.unknown,
          results: result.results,
          trigger_source: 'dashboard',
          status: 'completed',
        });
      }

      showToast({
        message: result.summary.failed === 0
          ? `All ${result.summary.total} scenarios passed!`
          : `${result.summary.passed}/${result.summary.total} passed, ${result.summary.failed} issues found`,
        variant: result.summary.failed === 0 ? 'success' : 'warning',
      });

      // Refresh history
      fetchData();
    } catch (err: any) {
      showToast({ message: err.message || 'Test failed', variant: 'error' });
    } finally {
      setRunningAgent(null);
    }
  };

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  const tabs = [
    { id: 'tests' as const, label: 'Agent Testing', icon: Play, count: agents.length },
    { id: 'self-heal' as const, label: 'Self-Healing', icon: Wrench, count: selfHealRecords.length },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Shield className="w-7 h-7 text-brand-blue" />
            <h1 className="text-2xl font-bold text-gray-900">Agent Testing & Self-Healing</h1>
          </div>
          <p className="text-gray-500 ml-10">
            Test your AI agents and monitor automatic prompt fixes
          </p>
        </div>
        <button
          onClick={fetchData}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          icon={<Activity className="w-5 h-5 text-blue-600" />}
          label="Total Tests"
          value={String(testRunRecords.length)}
          bg="bg-blue-50"
        />
        <KpiCard
          icon={<CheckCircle className="w-5 h-5 text-green-600" />}
          label="Tests Passed"
          value={String(testRunRecords.filter(r => r.scenarios_failed === 0).length)}
          bg="bg-green-50"
        />
        <KpiCard
          icon={<Wrench className="w-5 h-5 text-orange-600" />}
          label="Auto-Fixes"
          value={String(selfHealRecords.filter(r => r.fix_verified).length)}
          bg="bg-orange-50"
        />
        <KpiCard
          icon={<Zap className="w-5 h-5 text-purple-600" />}
          label="Fix Rate"
          value={
            selfHealRecords.length > 0
              ? `${Math.round((selfHealRecords.filter(r => r.fix_verified).length / selfHealRecords.length) * 100)}%`
              : '--'
          }
          bg="bg-purple-50"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count > 0 && (
              <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-brand-blue mr-3" />
          <span className="text-gray-600">Loading...</span>
        </div>
      ) : activeTab === 'tests' ? (
        /* ─── Testing Tab ───────────────────────────────────────────────── */
        <div className="space-y-4">
          {agents.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <Shield className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No agents to test</p>
              <p className="text-gray-400 text-sm mt-1">Create a voice agent first.</p>
            </div>
          ) : (
            agents.map((agent) => {
              const isRunning = runningAgent === agent.id;
              const agentHistory = testRunRecords.filter(r => r.agent_id === agent.retell_agent_id);
              const agentHeals = selfHealRecords.filter(r => r.agent_id === agent.retell_agent_id);

              return (
                <div key={agent.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  {/* Agent Header */}
                  <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-blue-50 rounded-lg">
                        <Shield className="w-5 h-5 text-brand-blue" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                        <div className="flex items-center gap-3 mt-0.5 text-sm text-gray-500">
                          {agent.agent_type && <span className="capitalize">{agent.agent_type}</span>}
                          <span>{agentHistory.length} tests run</span>
                          {agentHeals.length > 0 && (
                            <>
                              <span className="text-gray-300">|</span>
                              <span className="text-orange-600">{agentHeals.filter(h => h.fix_verified).length} auto-fixes</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRunTest(agent)}
                      disabled={!!runningAgent}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        runningAgent
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-brand-blue text-white hover:bg-blue-700'
                      }`}
                    >
                      {isRunning ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Testing 8 scenarios...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Run Tests
                        </>
                      )}
                    </button>
                  </div>

                  {/* Live test results */}
                  {isRunning && !testResult && (
                    <div className="px-5 pb-4">
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-blue-900">Running 8 test scenarios...</p>
                            <p className="text-xs text-blue-600 mt-0.5">
                              Cloning agent, sending test messages, analyzing responses
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Test Results */}
                  {testResult && testResult.agentId === agent.retell_agent_id && (
                    <div className="border-t">
                      {/* Summary */}
                      <div className="px-5 py-4 bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`text-2xl font-bold ${getPassRateColor(testResult.summary.passed, testResult.summary.total)}`}>
                            {testResult.summary.passed}/{testResult.summary.total}
                          </div>
                          <div className="text-sm text-gray-600">scenarios passed</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {testResult.summary.failed > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              <XCircle className="w-3 h-3" />
                              {testResult.summary.failed} failed
                            </span>
                          )}
                          {testResult.summary.passed === testResult.summary.total && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              <CheckCircle className="w-3 h-3" />
                              All passed
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Scenario list */}
                      <div className="divide-y">
                        {testResult.results.map((scenario) => {
                          const passed = scenario.analysis?.call_successful === true;
                          const failed = scenario.analysis?.call_successful === false;
                          const isExpanded = expandedScenario === scenario.scenarioId;

                          return (
                            <div key={scenario.scenarioId}>
                              <button
                                onClick={() => setExpandedScenario(isExpanded ? null : scenario.scenarioId)}
                                className="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  {passed ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                  ) : failed ? (
                                    <XCircle className="w-5 h-5 text-red-500" />
                                  ) : (
                                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                                  )}
                                  <span className="text-sm font-medium text-gray-900">{scenario.scenarioName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {scenario.analysis?.user_sentiment && (
                                    <span className="text-xs text-gray-500">
                                      Sentiment: {scenario.analysis.user_sentiment}
                                    </span>
                                  )}
                                  {isExpanded ? (
                                    <ChevronUp className="w-4 h-4 text-gray-400" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                  )}
                                </div>
                              </button>

                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="px-5 pb-4 space-y-3">
                                      {/* Success criteria */}
                                      <div className="text-xs text-gray-500">
                                        <strong>Success criteria:</strong> {scenario.successCriteria}
                                      </div>

                                      {/* Call summary */}
                                      {scenario.analysis?.call_summary && (
                                        <div className={`text-sm p-3 rounded-lg ${passed ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                                          {scenario.analysis.call_summary}
                                        </div>
                                      )}

                                      {/* Transcript */}
                                      <div className="bg-gray-50 rounded-lg p-3 max-h-64 overflow-y-auto">
                                        <h5 className="text-xs font-semibold text-gray-400 uppercase mb-2">Transcript</h5>
                                        <div className="space-y-2">
                                          {scenario.conversation.map((msg, i) => (
                                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                              <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                                                msg.role === 'user'
                                                  ? 'bg-blue-600 text-white'
                                                  : msg.role === 'agent'
                                                  ? 'bg-white text-gray-900 border'
                                                  : 'bg-red-100 text-red-700'
                                              }`}>
                                                <p className="text-xs font-medium opacity-70 mb-0.5">
                                                  {msg.role === 'user' ? 'Caller' : msg.role === 'agent' ? 'AI Agent' : 'System'}
                                                </p>
                                                {msg.content}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* ─── Self-Healing Tab ──────────────────────────────────────────── */
        <div className="space-y-4">
          {selfHealRecords.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <Wrench className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No self-healing activity yet</p>
              <p className="text-gray-400 text-sm mt-1">
                When a call fails, the system automatically diagnoses and fixes the issue.
              </p>
            </div>
          ) : (
            selfHealRecords.map((record) => {
              const isExpanded = expandedHeal === record.id;
              const agent = agents.find(a => a.retell_agent_id === record.agent_id);

              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedHeal(isExpanded ? null : record.id)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`p-2.5 rounded-lg flex-shrink-0 ${record.fix_verified ? 'bg-green-50' : 'bg-red-50'}`}>
                        {record.fix_verified ? (
                          <Wrench className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {record.failure_summary}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span>{agent?.name || record.agent_id.slice(0, 12)}</span>
                          <span className="text-gray-300">|</span>
                          <span>{timeAgo(record.created_at)}</span>
                          <span className={`inline-flex px-2 py-0.5 rounded-full font-medium ${getSeverityBadge(record.severity)}`}>
                            {record.severity}
                          </span>
                          <span className={`inline-flex px-2 py-0.5 rounded-full font-medium ${getStatusBadge(record.status)}`}>
                            {record.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <p className={`text-lg font-bold ${record.fix_verified ? 'text-green-600' : 'text-red-600'}`}>
                          {record.fix_success_rate}%
                        </p>
                        <p className="text-xs text-gray-400">fix rate</p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t px-5 py-4 space-y-4">
                          {/* Stats row */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <MiniStat label="Failure Type" value={record.failure_type.replace(/_/g, ' ')} />
                            <MiniStat label="Reproduced" value={`${record.reproduced_count}/3 runs`} />
                            <MiniStat label="Fix Verified" value={`${record.fix_success_rate}% (${record.fix_verified ? 'Yes' : 'Reverted'})`} />
                            <MiniStat label="Time Taken" value={`${Math.round((record.elapsed_ms || 0) / 1000)}s`} />
                          </div>

                          {/* Root cause */}
                          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                            <h5 className="text-xs font-semibold text-yellow-700 uppercase mb-1">Root Cause</h5>
                            <p className="text-sm text-yellow-900">{record.root_cause}</p>
                          </div>

                          {/* Prompt fix */}
                          {record.prompt_fix_applied && (
                            <div className={`border rounded-lg p-3 ${record.fix_verified ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                              <h5 className={`text-xs font-semibold uppercase mb-1 ${record.fix_verified ? 'text-green-700' : 'text-red-700'}`}>
                                {record.fix_verified ? 'Prompt Fix Applied' : 'Prompt Fix (Reverted)'}
                              </h5>
                              <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono bg-white/50 rounded p-2 mt-1">
                                {record.prompt_fix_applied}
                              </pre>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>
      )}
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const KpiCard: React.FC<{ icon: React.ReactNode; label: string; value: string; bg: string }> = ({ icon, label, value, bg }) => (
  <div className="bg-white rounded-lg shadow-sm border p-4">
    <div className="flex items-center gap-3">
      <div className={`p-2.5 rounded-lg ${bg}`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const MiniStat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-gray-50 rounded-lg p-2.5">
    <p className="text-xs text-gray-400">{label}</p>
    <p className="text-sm font-semibold text-gray-900 capitalize">{value}</p>
  </div>
);

export default AgentTestsPage;
