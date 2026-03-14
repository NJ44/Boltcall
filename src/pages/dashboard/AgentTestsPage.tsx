import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Play,
  Loader2,
  AlertCircle,
  Clock,
  Shield,
  ChevronDown,
  ChevronUp,
  Trash2,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {
  runFullAgentTest,
  waitForTestCompletion,
  getTestResult,
  type CekuraFullTestResult,
  type CekuraTestStatus,
} from '../../lib/cekura-test';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Agent {
  id: string;
  name: string;
  retell_agent_id: string;
  agent_type?: string;
}

interface StoredTestRecord {
  resultId: number;
  agentId: string;
  timestamp: number;
  status: string;
  successRate: number | null;
}

// localStorage key
const LS_KEY = 'cekura_test_results';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadStoredResults(): StoredTestRecord[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredResults(records: StoredTestRecord[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(records));
}

function upsertStoredResult(record: StoredTestRecord) {
  const records = loadStoredResults();
  const idx = records.findIndex((r) => r.resultId === record.resultId);
  if (idx >= 0) {
    records[idx] = record;
  } else {
    records.unshift(record);
  }
  // Keep last 50 results max
  saveStoredResults(records.slice(0, 50));
}

function removeStoredResult(resultId: number) {
  const records = loadStoredResults().filter((r) => r.resultId !== resultId);
  saveStoredResults(records);
}

function getSuccessRateColor(rate: number | null): string {
  if (rate === null) return 'text-gray-500';
  if (rate >= 80) return 'text-green-600';
  if (rate >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

function getSuccessRateBg(rate: number | null): string {
  if (rate === null) return 'bg-gray-100 text-gray-600';
  if (rate >= 80) return 'bg-green-100 text-green-700';
  if (rate >= 60) return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
}

function getStatusBadge(status: string) {
  const map: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-600',
    in_queue: 'bg-gray-100 text-gray-600',
    running: 'bg-blue-100 text-blue-700',
    evaluating: 'bg-indigo-100 text-indigo-700',
    completed: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    timeout: 'bg-orange-100 text-orange-700',
    cancelled: 'bg-gray-100 text-gray-500',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
}

function formatDuration(dur: string | null): string {
  if (!dur) return '--';
  return dur;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const AgentTestsPage: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string>('My Business');

  // Running tests: agentId -> progress state
  const [runningTests, setRunningTests] = useState<
    Record<string, { resultId: number; progress: CekuraTestStatus | null; error?: string }>
  >({});

  // Completed results: resultId -> full status (for expanded view)
  const [results, setResults] = useState<Record<number, CekuraTestStatus>>({});

  // Which agent's results panel is expanded
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  // Which result detail is expanded
  const [expandedResult, setExpandedResult] = useState<number | null>(null);

  // Stored result IDs grouped by agent
  const [storedResults, setStoredResults] = useState<StoredTestRecord[]>([]);

  // -----------------------------------------------------------------------
  // Load agents + stored results
  // -----------------------------------------------------------------------

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError('Please sign in to view your agents.');
        setLoading(false);
        return;
      }

      // Get business name
      const { data: profile } = await supabase
        .from('business_profiles')
        .select('id, business_name')
        .eq('user_id', user.id)
        .limit(1)
        .single();

      if (profile?.business_name) {
        setBusinessName(profile.business_name);
      }

      // Get agents with retell_agent_id
      const { data: agentRows, error: agentError } = await supabase
        .from('agents')
        .select('id, name, retell_agent_id, agent_type')
        .eq('user_id', user.id)
        .not('retell_agent_id', 'is', null);

      if (agentError) throw agentError;

      setAgents(agentRows || []);
    } catch (err: any) {
      console.error('Error fetching agents:', err);
      setError('Failed to load agents. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load stored results and refresh latest status for non-terminal ones
  const loadStoredAndRefresh = useCallback(async () => {
    const stored = loadStoredResults();
    setStoredResults(stored);

    // Refresh status for results that might still be running
    const pending = stored.filter((r) =>
      ['pending', 'running', 'evaluating', 'in_queue'].includes(r.status)
    );
    for (const record of pending) {
      try {
        const status = await getTestResult(record.resultId);
        setResults((prev) => ({ ...prev, [record.resultId]: status }));
        upsertStoredResult({
          ...record,
          status: status.status,
          successRate: status.success_rate,
        });
      } catch {
        // Silently ignore — might be expired
      }
    }
    setStoredResults(loadStoredResults());
  }, []);

  useEffect(() => {
    fetchAgents();
    loadStoredAndRefresh();
  }, [fetchAgents, loadStoredAndRefresh]);

  // -----------------------------------------------------------------------
  // Run test
  // -----------------------------------------------------------------------

  const handleRunTest = async (agent: Agent) => {
    // Prevent double-run
    if (runningTests[agent.id]) return;

    setRunningTests((prev) => ({
      ...prev,
      [agent.id]: { resultId: 0, progress: null },
    }));

    try {
      // 1. Trigger the test
      const triggerResult: CekuraFullTestResult = await runFullAgentTest({
        retellAgentId: agent.retell_agent_id,
        agentName: agent.name,
        businessName,
      });

      if (!triggerResult.success || !triggerResult.result_id) {
        setRunningTests((prev) => ({
          ...prev,
          [agent.id]: {
            resultId: 0,
            progress: null,
            error: triggerResult.error || 'Failed to start test',
          },
        }));
        return;
      }

      const resultId = triggerResult.result_id;

      // Store immediately
      upsertStoredResult({
        resultId,
        agentId: agent.id,
        timestamp: Date.now(),
        status: 'running',
        successRate: null,
      });
      setStoredResults(loadStoredResults());

      setRunningTests((prev) => ({
        ...prev,
        [agent.id]: { resultId, progress: null },
      }));

      // Expand agent panel
      setExpandedAgent(agent.id);
      setExpandedResult(resultId);

      // 2. Poll for completion
      const finalStatus = await waitForTestCompletion(resultId, {
        pollIntervalMs: 8000,
        maxWaitMs: 360000,
        onProgress: (status) => {
          setRunningTests((prev) => ({
            ...prev,
            [agent.id]: { resultId, progress: status },
          }));
          setResults((prev) => ({ ...prev, [resultId]: status }));
          upsertStoredResult({
            resultId,
            agentId: agent.id,
            timestamp: Date.now(),
            status: status.status,
            successRate: status.success_rate,
          });
          setStoredResults(loadStoredResults());
        },
      });

      // 3. Final state
      setResults((prev) => ({ ...prev, [resultId]: finalStatus }));
      upsertStoredResult({
        resultId,
        agentId: agent.id,
        timestamp: Date.now(),
        status: finalStatus.status,
        successRate: finalStatus.success_rate,
      });
      setStoredResults(loadStoredResults());
    } catch (err: any) {
      setRunningTests((prev) => ({
        ...prev,
        [agent.id]: {
          ...prev[agent.id],
          error: err.message || 'Test failed unexpectedly',
        },
      }));
    } finally {
      // Clear running state after a short delay so final progress renders
      setTimeout(() => {
        setRunningTests((prev) => {
          const next = { ...prev };
          delete next[agent.id];
          return next;
        });
      }, 1000);
    }
  };

  // -----------------------------------------------------------------------
  // Load a stored result on demand
  // -----------------------------------------------------------------------

  const handleLoadResult = async (resultId: number) => {
    if (results[resultId]) {
      setExpandedResult(expandedResult === resultId ? null : resultId);
      return;
    }
    try {
      const status = await getTestResult(resultId);
      setResults((prev) => ({ ...prev, [resultId]: status }));
      setExpandedResult(resultId);
    } catch {
      // ignore
    }
  };

  const handleDeleteResult = (resultId: number) => {
    removeStoredResult(resultId);
    setStoredResults(loadStoredResults());
    setResults((prev) => {
      const next = { ...prev };
      delete next[resultId];
      return next;
    });
    if (expandedResult === resultId) setExpandedResult(null);
  };

  // -----------------------------------------------------------------------
  // Derived data
  // -----------------------------------------------------------------------

  const getAgentStoredResults = (agentId: string) =>
    storedResults.filter((r) => r.agentId === agentId);

  const getLatestResult = (agentId: string): StoredTestRecord | undefined => {
    const agentResults = getAgentStoredResults(agentId);
    return agentResults[0]; // already sorted newest-first
  };

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Shield className="w-7 h-7 text-brand-blue" />
          <h1 className="text-2xl font-bold text-gray-900">Agent Quality Tests</h1>
        </div>
        <p className="text-gray-500 ml-10">
          Automated voice simulation testing powered by Cekura
        </p>
      </div>

      {/* Loading / Error / Empty states */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-brand-blue mr-3" />
          <span className="text-gray-600">Loading agents...</span>
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
          <span className="text-red-600">{error}</span>
        </div>
      ) : agents.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <Shield className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No agents found</p>
          <p className="text-gray-400 text-sm mt-1">
            Create a voice agent first to run quality tests.
          </p>
        </div>
      ) : (
        /* Agent cards */
        <div className="space-y-4">
          {agents.map((agent) => {
            const latest = getLatestResult(agent.id);
            const running = runningTests[agent.id];
            const agentResults = getAgentStoredResults(agent.id);
            const isExpanded = expandedAgent === agent.id;

            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border overflow-hidden"
              >
                {/* Agent header card */}
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="p-2.5 bg-blue-50 rounded-lg flex-shrink-0">
                      <Shield className="w-5 h-5 text-brand-blue" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {agent.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-0.5 text-sm text-gray-500">
                        {agent.agent_type && (
                          <span className="capitalize">{agent.agent_type}</span>
                        )}
                        {latest && (
                          <>
                            <span className="text-gray-300">|</span>
                            <span>
                              Last test:{' '}
                              {new Date(latest.timestamp).toLocaleDateString()}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getSuccessRateBg(
                                latest.successRate
                              )}`}
                            >
                              {latest.successRate !== null
                                ? `${Math.round(latest.successRate)}%`
                                : latest.status}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Expand / collapse results */}
                    {agentResults.length > 0 && (
                      <button
                        onClick={() =>
                          setExpandedAgent(isExpanded ? null : agent.id)
                        }
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="View test history"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    )}

                    {/* Run Test button */}
                    <button
                      onClick={() => handleRunTest(agent)}
                      disabled={!!running}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        running
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-brand-blue text-white hover:bg-blue-700'
                      }`}
                    >
                      {running ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Running...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Run Test
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Running test error */}
                {running?.error && (
                  <div className="mx-5 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">{running.error}</p>
                  </div>
                )}

                {/* Live progress bar while test is running */}
                {running && running.progress && !running.error && (
                  <div className="px-5 pb-4">
                    <LiveProgressBar progress={running.progress} />
                  </div>
                )}

                {/* Expanded results history */}
                <AnimatePresence>
                  {isExpanded && agentResults.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t bg-gray-50 px-5 py-4 space-y-3">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Test History
                        </h4>
                        {agentResults.map((record) => (
                          <TestResultRow
                            key={record.resultId}
                            record={record}
                            result={results[record.resultId]}
                            isExpanded={expandedResult === record.resultId}
                            onToggle={() => handleLoadResult(record.resultId)}
                            onDelete={() => handleDeleteResult(record.resultId)}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const LiveProgressBar: React.FC<{ progress: CekuraTestStatus }> = ({
  progress,
}) => {
  const pct =
    progress.total_runs > 0
      ? Math.round((progress.completed_runs / progress.total_runs) * 100)
      : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">
          {progress.completed_runs} / {progress.total_runs} scenarios
        </span>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
            progress.status
          )}`}
        >
          {progress.status}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-brand-blue rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

const TestResultRow: React.FC<{
  record: StoredTestRecord;
  result?: CekuraTestStatus;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
}> = ({ record, result, isExpanded, onToggle, onDelete }) => {
  return (
    <div className="bg-white rounded-lg border shadow-sm">
      {/* Row header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-sm text-gray-500">
            {new Date(record.timestamp).toLocaleString()}
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
              record.status
            )}`}
          >
            {record.status}
          </span>
          {record.successRate !== null && (
            <span
              className={`text-sm font-semibold ${getSuccessRateColor(
                record.successRate
              )}`}
            >
              {Math.round(record.successRate)}% pass
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
            title="Remove from history"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {isExpanded && result && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <TestResultDetail result={result} />
          </motion.div>
        )}
        {isExpanded && !result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 py-6 flex items-center justify-center"
          >
            <Loader2 className="w-5 h-5 animate-spin text-brand-blue mr-2" />
            <span className="text-sm text-gray-500">Loading result...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TestResultDetail: React.FC<{ result: CekuraTestStatus }> = ({
  result,
}) => {
  const runs: any[] = Array.isArray(result.runs) ? result.runs : [];
  const failedReasons: any[] = Array.isArray(result.failed_reasons)
    ? result.failed_reasons
    : result.failed_reasons
    ? [result.failed_reasons]
    : [];

  return (
    <div className="border-t px-4 py-4 space-y-5">
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Success Rate"
          value={
            result.success_rate !== null
              ? `${Math.round(result.success_rate)}%`
              : '--'
          }
          color={getSuccessRateColor(result.success_rate)}
          icon={
            result.success_rate !== null && result.success_rate >= 80 ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : result.success_rate !== null && result.success_rate < 60 ? (
              <XCircle className="w-4 h-4 text-red-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-500" />
            )
          }
        />
        <StatCard
          label="Passed"
          value={`${result.success_runs} / ${result.total_runs}`}
          color="text-green-600"
          icon={<CheckCircle className="w-4 h-4 text-green-500" />}
        />
        <StatCard
          label="Failed"
          value={String(result.failed_runs)}
          color={result.failed_runs > 0 ? 'text-red-600' : 'text-gray-600'}
          icon={<XCircle className="w-4 h-4 text-red-400" />}
        />
        <StatCard
          label="Duration"
          value={formatDuration(result.total_duration)}
          color="text-gray-700"
          icon={<Clock className="w-4 h-4 text-gray-400" />}
        />
      </div>

      {/* Overall evaluation */}
      {result.overall_evaluation && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
          <h5 className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
            Overall Evaluation
          </h5>
          <p className="text-sm text-blue-900 whitespace-pre-wrap">
            {typeof result.overall_evaluation === 'string'
              ? result.overall_evaluation
              : JSON.stringify(result.overall_evaluation, null, 2)}
          </p>
        </div>
      )}

      {/* Individual scenario runs */}
      {runs.length > 0 && (
        <div>
          <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Scenario Results
          </h5>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scenario
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {runs.map((run: any, idx: number) => {
                  const passed =
                    run.status === 'success' || run.status === 'passed';
                  const failed =
                    run.status === 'failed' || run.status === 'error';
                  const scenarioName =
                    run.scenario_name || run.name || `Scenario ${idx + 1}`;

                  return (
                    <tr key={run.id || idx} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 text-sm text-gray-900">
                        {scenarioName}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex items-center gap-1.5">
                          {passed ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : failed ? (
                            <XCircle className="w-4 h-4 text-red-500" />
                          ) : (
                            <Clock className="w-4 h-4 text-gray-400" />
                          )}
                          <span
                            className={`text-xs font-medium ${
                              passed
                                ? 'text-green-600'
                                : failed
                                ? 'text-red-600'
                                : 'text-gray-500'
                            }`}
                          >
                            {run.status}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-sm text-gray-500">
                        {run.duration || run.total_duration || '--'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Failed reasons */}
      {failedReasons.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-3">
          <h5 className="text-xs font-semibold text-red-700 uppercase tracking-wider mb-2">
            Failed Reasons
          </h5>
          <ul className="space-y-1">
            {failedReasons.map((reason: any, idx: number) => (
              <li
                key={idx}
                className="text-sm text-red-800 flex items-start gap-2"
              >
                <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                <span>
                  {typeof reason === 'string'
                    ? reason
                    : JSON.stringify(reason)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{
  label: string;
  value: string;
  color: string;
  icon: React.ReactNode;
}> = ({ label, value, color, icon }) => (
  <div className="bg-gray-50 rounded-lg p-3">
    <div className="flex items-center gap-1.5 mb-1">
      {icon}
      <span className="text-xs text-gray-500">{label}</span>
    </div>
    <p className={`text-lg font-bold ${color}`}>{value}</p>
  </div>
);

export default AgentTestsPage;
