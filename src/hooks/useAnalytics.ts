// useAnalytics — central data-fetching hook for the deep analytics page

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchFunnelData,
  fetchRoiMetrics,
  fetchRoiTrend,
  fetchResponseTimeStats,
  fetchHeatmapData,
  fetchSourceAttribution,
  fetchAgentPerformance,
  fetchMissedOpportunities,
  fetchFunnelDrilldown,
  type FunnelStage,
  type RoiMetrics,
  type RoiTrendPoint,
  type ResponseTimeStats,
  type HeatmapCell,
  type SourceAttribution,
  type AgentPerformance,
  type MissedOpportunity,
  type AnalyticsFilters,
} from '../lib/analyticsApi';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface RoiConfig {
  avgDealValue: number;
  hourlyRate: number;
  subscriptionCost: number;
}

export interface AnalyticsData {
  // Funnel
  funnel: FunnelStage[];
  funnelLoading: boolean;
  drilldownData: any[];
  drilldownStage: string | null;
  loadDrilldown: (stageName: string) => Promise<void>;
  closeDrilldown: () => void;

  // ROI
  roiMetrics: RoiMetrics | null;
  roiTrend: RoiTrendPoint[];
  roiLoading: boolean;
  roiConfig: RoiConfig;
  updateRoiConfig: (config: RoiConfig) => void;

  // Response Time
  responseTime: ResponseTimeStats | null;
  responseTimeLoading: boolean;

  // Heatmap
  heatmap: HeatmapCell[];
  heatmapLoading: boolean;

  // Source Attribution
  sources: SourceAttribution[];
  sourcesLoading: boolean;

  // Agent Performance
  agents: AgentPerformance[];
  agentsLoading: boolean;

  // Missed Opportunities
  missed: MissedOpportunity[];
  missedLoading: boolean;

  // Global
  error: string | null;
  refreshAll: () => void;
  lastRefreshed: Date | null;
}

/* ------------------------------------------------------------------ */
/*  Default ROI config with localStorage persistence                   */
/* ------------------------------------------------------------------ */

const ROI_CONFIG_KEY = 'boltcall_roi_config';

function loadRoiConfig(): RoiConfig {
  try {
    const raw = localStorage.getItem(ROI_CONFIG_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* noop */ }
  return { avgDealValue: 500, hourlyRate: 25, subscriptionCost: 179 };
}

function saveRoiConfig(config: RoiConfig) {
  try {
    localStorage.setItem(ROI_CONFIG_KEY, JSON.stringify(config));
  } catch { /* noop */ }
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useAnalytics(filters: AnalyticsFilters): AnalyticsData {
  // Funnel state
  const [funnel, setFunnel] = useState<FunnelStage[]>([]);
  const [funnelLoading, setFunnelLoading] = useState(true);
  const [drilldownData, setDrilldownData] = useState<any[]>([]);
  const [drilldownStage, setDrilldownStage] = useState<string | null>(null);

  // ROI state
  const [roiMetrics, setRoiMetrics] = useState<RoiMetrics | null>(null);
  const [roiTrend, setRoiTrend] = useState<RoiTrendPoint[]>([]);
  const [roiLoading, setRoiLoading] = useState(true);
  const [roiConfig, setRoiConfig] = useState<RoiConfig>(loadRoiConfig);

  // Response time state
  const [responseTime, setResponseTime] = useState<ResponseTimeStats | null>(null);
  const [responseTimeLoading, setResponseTimeLoading] = useState(true);

  // Heatmap state
  const [heatmap, setHeatmap] = useState<HeatmapCell[]>([]);
  const [heatmapLoading, setHeatmapLoading] = useState(true);

  // Sources state
  const [sources, setSources] = useState<SourceAttribution[]>([]);
  const [sourcesLoading, setSourcesLoading] = useState(true);

  // Agent performance state
  const [agents, setAgents] = useState<AgentPerformance[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(true);

  // Missed opportunities state
  const [missed, setMissed] = useState<MissedOpportunity[]>([]);
  const [missedLoading, setMissedLoading] = useState(true);

  // Global
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  // Track if component is mounted to avoid stale state updates
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Serialize filters for dependency tracking
  const filtersKey = JSON.stringify(filters);

  const loadFunnel = useCallback(async () => {
    setFunnelLoading(true);
    try {
      const data = await fetchFunnelData(filters);
      if (mountedRef.current) setFunnel(data);
    } catch (err) {
      console.error('Funnel fetch failed:', err);
    } finally {
      if (mountedRef.current) setFunnelLoading(false);
    }
  }, [filtersKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadRoi = useCallback(async () => {
    setRoiLoading(true);
    try {
      const [metrics, trend] = await Promise.all([
        fetchRoiMetrics(filters, roiConfig),
        fetchRoiTrend(6),
      ]);
      if (mountedRef.current) {
        setRoiMetrics(metrics);
        setRoiTrend(trend);
      }
    } catch (err) {
      console.error('ROI fetch failed:', err);
    } finally {
      if (mountedRef.current) setRoiLoading(false);
    }
  }, [filtersKey, roiConfig]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadResponseTime = useCallback(async () => {
    setResponseTimeLoading(true);
    try {
      const data = await fetchResponseTimeStats(filters);
      if (mountedRef.current) setResponseTime(data);
    } catch (err) {
      console.error('Response time fetch failed:', err);
    } finally {
      if (mountedRef.current) setResponseTimeLoading(false);
    }
  }, [filtersKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadHeatmap = useCallback(async () => {
    setHeatmapLoading(true);
    try {
      const data = await fetchHeatmapData(filters);
      if (mountedRef.current) setHeatmap(data);
    } catch (err) {
      console.error('Heatmap fetch failed:', err);
    } finally {
      if (mountedRef.current) setHeatmapLoading(false);
    }
  }, [filtersKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadSources = useCallback(async () => {
    setSourcesLoading(true);
    try {
      const data = await fetchSourceAttribution(filters);
      if (mountedRef.current) setSources(data);
    } catch (err) {
      console.error('Sources fetch failed:', err);
    } finally {
      if (mountedRef.current) setSourcesLoading(false);
    }
  }, [filtersKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAgents = useCallback(async () => {
    setAgentsLoading(true);
    try {
      const data = await fetchAgentPerformance(filters);
      if (mountedRef.current) setAgents(data);
    } catch (err) {
      console.error('Agent performance fetch failed:', err);
    } finally {
      if (mountedRef.current) setAgentsLoading(false);
    }
  }, [filtersKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMissed = useCallback(async () => {
    setMissedLoading(true);
    try {
      const data = await fetchMissedOpportunities(filters);
      if (mountedRef.current) setMissed(data);
    } catch (err) {
      console.error('Missed opportunities fetch failed:', err);
    } finally {
      if (mountedRef.current) setMissedLoading(false);
    }
  }, [filtersKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const refreshAll = useCallback(() => {
    setError(null);
    Promise.all([
      loadFunnel(),
      loadRoi(),
      loadResponseTime(),
      loadHeatmap(),
      loadSources(),
      loadAgents(),
      loadMissed(),
    ]).then(() => {
      if (mountedRef.current) setLastRefreshed(new Date());
    }).catch(err => {
      if (mountedRef.current) setError(err instanceof Error ? err.message : 'Failed to load analytics');
    });
  }, [loadFunnel, loadRoi, loadResponseTime, loadHeatmap, loadSources, loadAgents, loadMissed]);

  // Load all data when filters change
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Drilldown
  const loadDrilldown = useCallback(async (stageName: string) => {
    try {
      const data = await fetchFunnelDrilldown(stageName, filters);
      if (mountedRef.current) {
        setDrilldownData(data);
        setDrilldownStage(stageName);
      }
    } catch (err) {
      console.error('Drilldown fetch failed:', err);
    }
  }, [filtersKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const closeDrilldown = useCallback(() => {
    setDrilldownData([]);
    setDrilldownStage(null);
  }, []);

  // ROI config update
  const updateRoiConfig = useCallback((config: RoiConfig) => {
    setRoiConfig(config);
    saveRoiConfig(config);
  }, []);

  // Re-fetch ROI when config changes
  useEffect(() => {
    loadRoi();
  }, [roiConfig]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    funnel,
    funnelLoading,
    drilldownData,
    drilldownStage,
    loadDrilldown,
    closeDrilldown,

    roiMetrics,
    roiTrend,
    roiLoading,
    roiConfig,
    updateRoiConfig,

    responseTime,
    responseTimeLoading,

    heatmap,
    heatmapLoading,

    sources,
    sourcesLoading,

    agents,
    agentsLoading,

    missed,
    missedLoading,

    error,
    refreshAll,
    lastRefreshed,
  };
}
