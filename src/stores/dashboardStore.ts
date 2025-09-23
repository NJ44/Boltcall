import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import dayjs from 'dayjs';
import { mockData } from '../data/mock';
import type { Lead, Kpis, TimeSeriesPoint, ChannelPerf, Faq, Transcript, Alert, FunnelStep, Channel, Intent } from '../types/dashboard';

interface DashboardFilters {
  dateRange: {
    start: string;
    end: string;
  };
  channels: Channel[];
  intents: Intent[];
  sources: string[];
  staff: string[];
  tags: string[];
}

interface DashboardState {
  // Filters
  filters: DashboardFilters;
  selectedClient: string;
  
  // Data
  kpis: Kpis;
  timeSeries: TimeSeriesPoint[];
  channelPerf: ChannelPerf[];
  leads: Lead[];
  faqs: Faq[];
  transcripts: Transcript[];
  alerts: Alert[];
  funnelSteps: FunnelStep[];
  
  // UI State
  loading: boolean;
  sidebarCollapsed: boolean;
  selectedLead: Lead | null;
  
  // Actions
  setFilters: (filters: Partial<DashboardFilters>) => void;
  setSelectedClient: (client: string) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSelectedLead: (lead: Lead | null) => void;
  resetFilters: () => void;
  applyQuickDateRange: (range: 'today' | '7d' | '30d' | 'custom') => void;
}

const defaultFilters: DashboardFilters = {
  dateRange: {
    start: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
    end: dayjs().format('YYYY-MM-DD'),
  },
  channels: [],
  intents: [],
  sources: [],
  staff: [],
  tags: [],
};

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      // Initial state
      filters: defaultFilters,
      selectedClient: 'default-client',
      kpis: mockData.kpis,
      timeSeries: mockData.timeSeries,
      channelPerf: mockData.channelPerf,
      leads: mockData.leads,
      faqs: mockData.faqs,
      transcripts: mockData.transcripts,
      alerts: mockData.alerts,
      funnelSteps: mockData.funnelSteps,
      loading: false,
      sidebarCollapsed: false,
      selectedLead: null,
      
      // Actions
      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }));
      },
      
      setSelectedClient: (client) => {
        set({ selectedClient: client });
      },
      
      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
      },
      
      setSelectedLead: (lead) => {
        set({ selectedLead: lead });
      },
      
      resetFilters: () => {
        set({ filters: defaultFilters });
      },
      
      applyQuickDateRange: (range) => {
        const today = dayjs();
        let start: string;
        let end: string;
        
        switch (range) {
          case 'today':
            start = today.format('YYYY-MM-DD');
            end = today.format('YYYY-MM-DD');
            break;
          case '7d':
            start = today.subtract(7, 'day').format('YYYY-MM-DD');
            end = today.format('YYYY-MM-DD');
            break;
          case '30d':
            start = today.subtract(30, 'day').format('YYYY-MM-DD');
            end = today.format('YYYY-MM-DD');
            break;
          case 'custom':
            // Custom range handling would be implemented in the UI
            return;
        }
        
        set((state) => ({
          filters: {
            ...state.filters,
            dateRange: { start, end },
          },
        }));
      },
    }),
    {
      name: 'dashboard-store',
      partialize: (state) => ({
        filters: state.filters,
        selectedClient: state.selectedClient,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
