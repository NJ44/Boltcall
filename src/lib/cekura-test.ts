// Cekura full agent testing — proxied through Netlify function
// Runs automated voice simulations against Retell agents

const FUNCTIONS_BASE = import.meta.env.DEV
  ? 'http://localhost:8888/.netlify/functions'
  : '/.netlify/functions';

export interface CekuraTestRun {
  id: number;
  status: string;
  scenario_name: string;
}

export interface CekuraFullTestResult {
  success: boolean;
  cekura_agent_id?: number;
  evaluators_created?: number;
  result_id?: number;
  status?: string;
  total_runs?: number;
  runs?: CekuraTestRun[];
  error?: string;
}

export interface CekuraTestStatus {
  id: number;
  status: string; // pending | running | completed | failed | evaluating | in_queue | timeout | cancelled
  success_rate: number | null;
  total_runs: number;
  completed_runs: number;
  success_runs: number;
  failed_runs: number;
  total_duration: string | null;
  overall_evaluation: any;
  failed_reasons: any;
  runs: any;
}

/**
 * Run a full test suite against a Retell agent:
 * 1. Registers the agent in Cekura
 * 2. Creates 5 default test scenarios (greeting, hours, services, booking, edge case)
 * 3. Runs all scenarios as voice simulations
 * 4. Returns a result_id to poll for status
 */
export async function runFullAgentTest(params: {
  retellAgentId: string;
  agentName: string;
  businessName: string;
  phoneNumber?: string;
  language?: string;
}): Promise<CekuraFullTestResult> {
  const response = await fetch(`${FUNCTIONS_BASE}/cekura-test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'full_test',
      retell_agent_id: params.retellAgentId,
      agent_name: params.agentName,
      business_name: params.businessName,
      phone_number: params.phoneNumber,
      language: params.language,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Test failed' }));
    return { success: false, error: err.details || err.error || `Test failed (${response.status})` };
  }

  return response.json();
}

/**
 * Poll for test result status
 */
export async function getTestResult(resultId: number): Promise<CekuraTestStatus> {
  const response = await fetch(`${FUNCTIONS_BASE}/cekura-test?result_id=${resultId}`);

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Failed to get result' }));
    throw new Error(err.details || err.error || `Failed (${response.status})`);
  }

  return response.json();
}

/**
 * Poll until test completes (with timeout)
 * Returns the final test status
 */
export async function waitForTestCompletion(
  resultId: number,
  options?: { maxWaitMs?: number; pollIntervalMs?: number; onProgress?: (status: CekuraTestStatus) => void }
): Promise<CekuraTestStatus> {
  const maxWait = options?.maxWaitMs || 300000; // 5 min default
  const pollInterval = options?.pollIntervalMs || 10000; // 10s default
  const startTime = Date.now();

  while (Date.now() - startTime < maxWait) {
    const status = await getTestResult(resultId);
    options?.onProgress?.(status);

    if (['completed', 'failed', 'timeout', 'cancelled'].includes(status.status)) {
      return status;
    }

    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }

  throw new Error('Test timed out after ' + Math.round(maxWait / 1000) + 's');
}
