import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { ResourceType, PlanTier } from '../lib/plan-limits';
import {
  getPlanLimit,
  isAtLimit,
  getUsagePercentage,
  isApproachingLimit,
} from '../lib/plan-limits';

export interface ResourceUsage {
  resource: ResourceType;
  current: number;
  limit: number;
  percentage: number;
  isAtLimit: boolean;
  isApproaching: boolean;
}

export interface UsageTrendPoint {
  date: string;
  ai_voice_minutes: number;
  ai_chat_messages: number;
  sms_sent: number;
}

interface UsageState {
  // Data
  usage: Record<ResourceType, number>;
  trend: UsageTrendPoint[];
  planTier: PlanTier;
  periodStart: string | null;
  periodEnd: string | null;
  lastFetchedAt: string | null;

  // UI
  isLoading: boolean;
  error: string | null;
  showLimitModal: boolean;
  limitModalResource: ResourceType | null;
  warningShownFor: Set<string>; // track which warnings have been shown this session

  // Actions
  fetchUsage: (userId: string, plan: PlanTier) => Promise<void>;
  fetchTrend: (userId: string) => Promise<void>;
  canUse: (resource: ResourceType) => boolean;
  trackUsage: (userId: string, resource: ResourceType, amount?: number) => Promise<boolean>;
  getResourceUsage: (resource: ResourceType) => ResourceUsage;
  getAllResourceUsages: () => ResourceUsage[];
  setShowLimitModal: (show: boolean, resource?: ResourceType | null) => void;
  markWarningShown: (resource: ResourceType) => void;
  resetWarnings: () => void;
}

const DEFAULT_USAGE: Record<ResourceType, number> = {
  ai_voice_minutes: 0,
  ai_chat_messages: 0,
  sms_sent: 0,
  phone_numbers: 0,
  team_members: 0,
  kb_storage_mb: 0,
};

// Map from token_transactions categories to resource types
const CATEGORY_TO_RESOURCE: Record<string, ResourceType> = {
  ai_voice_minute: 'ai_voice_minutes',
  ai_chat_message: 'ai_chat_messages',
  sms_sent: 'sms_sent',
};

export const useUsageStore = create<UsageState>()((set, get) => ({
  usage: { ...DEFAULT_USAGE },
  trend: [],
  planTier: 'free',
  periodStart: null,
  periodEnd: null,
  lastFetchedAt: null,
  isLoading: false,
  error: null,
  showLimitModal: false,
  limitModalResource: null,
  warningShownFor: new Set(),

  fetchUsage: async (userId: string, plan: PlanTier) => {
    set({ isLoading: true, error: null, planTier: plan });

    try {
      // Get token balance for period info
      const { data: balance } = await supabase
        .from('token_balances')
        .select('period_start, period_end')
        .eq('user_id', userId)
        .maybeSingle();

      const periodStart = balance?.period_start || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const periodEnd = balance?.period_end || null;

      // Get usage aggregates from token_transactions for current period
      const { data: transactions } = await supabase
        .from('token_transactions')
        .select('category, amount')
        .eq('user_id', userId)
        .eq('type', 'debit')
        .gte('created_at', periodStart);

      // Aggregate by resource type
      const usage = { ...DEFAULT_USAGE };

      if (transactions) {
        for (const tx of transactions) {
          const resource = CATEGORY_TO_RESOURCE[tx.category];
          if (resource === 'ai_voice_minutes') {
            // Each ai_voice_minute transaction represents tokens (10 per minute)
            // We need to convert back to minutes
            usage.ai_voice_minutes += Math.ceil(tx.amount / 10);
          } else if (resource === 'ai_chat_messages') {
            usage.ai_chat_messages += tx.amount; // 1 token per message
          } else if (resource === 'sms_sent') {
            usage.sms_sent += Math.ceil(tx.amount / 5); // 5 tokens per SMS
          }
        }
      }

      // Get phone numbers count — wrapped to gracefully handle 503 / table-not-found errors
      try {
        const { count: phoneCount, error: phoneErr } = await supabase
          .from('phone_numbers')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId);

        if (!phoneErr) {
          usage.phone_numbers = phoneCount || 0;
        }
      } catch {
        // Non-blocking: treat as 0 if the table is unavailable
      }

      // Get team members count — wrapped to gracefully handle 503 / table-not-found errors
      try {
        const { count: memberCount, error: memberErr } = await supabase
          .from('workspace_members')
          .select('id', { count: 'exact', head: true })
          .eq('workspace_id', userId)
          .in('status', ['active', 'accepted']);

        // At minimum 1 (the owner) — only update if the query succeeded
        if (!memberErr) {
          usage.team_members = Math.max(memberCount || 0, 1);
        }
      } catch {
        // Non-blocking: keep default of 1 (owner) if the table is unavailable
        usage.team_members = 1;
      }

      // Get KB storage (sum of file sizes)
      const { data: kbFiles } = await supabase
        .from('knowledge_base')
        .select('file_size')
        .eq('user_id', userId);

      if (kbFiles) {
        const totalBytes = kbFiles.reduce((sum, f) => sum + (f.file_size || 0), 0);
        usage.kb_storage_mb = Math.round(totalBytes / (1024 * 1024));
      }

      set({
        usage,
        planTier: plan,
        periodStart,
        periodEnd,
        isLoading: false,
        lastFetchedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching usage:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch usage',
      });
    }
  },

  fetchTrend: async (userId: string) => {
    try {
      // Get last 30 days of usage data
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: transactions } = await supabase
        .from('token_transactions')
        .select('category, amount, created_at')
        .eq('user_id', userId)
        .eq('type', 'debit')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      if (!transactions || transactions.length === 0) {
        set({ trend: [] });
        return;
      }

      // Aggregate by day
      const dailyMap = new Map<string, UsageTrendPoint>();

      // Initialize all 30 days
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const key = date.toISOString().split('T')[0];
        dailyMap.set(key, {
          date: key,
          ai_voice_minutes: 0,
          ai_chat_messages: 0,
          sms_sent: 0,
        });
      }

      for (const tx of transactions) {
        const dateKey = new Date(tx.created_at).toISOString().split('T')[0];
        const point = dailyMap.get(dateKey);
        if (!point) continue;

        if (tx.category === 'ai_voice_minute') {
          point.ai_voice_minutes += Math.ceil(tx.amount / 10);
        } else if (tx.category === 'ai_chat_message') {
          point.ai_chat_messages += tx.amount;
        } else if (tx.category === 'sms_sent') {
          point.sms_sent += Math.ceil(tx.amount / 5);
        }
      }

      set({ trend: Array.from(dailyMap.values()) });
    } catch (error) {
      console.error('Error fetching usage trend:', error);
    }
  },

  canUse: (resource: ResourceType): boolean => {
    const { usage, planTier } = get();
    return !isAtLimit(planTier, resource, usage[resource]);
  },

  trackUsage: async (_userId: string, resource: ResourceType, amount = 1): Promise<boolean> => {
    const { usage, planTier } = get();
    const newAmount = usage[resource] + amount;

    if (isAtLimit(planTier, resource, newAmount)) {
      set({ showLimitModal: true, limitModalResource: resource });
      return false;
    }

    // Update local state immediately
    set({
      usage: { ...usage, [resource]: newAmount },
    });

    return true;
  },

  getResourceUsage: (resource: ResourceType): ResourceUsage => {
    const { usage, planTier } = get();
    const current = usage[resource];
    const limit = getPlanLimit(planTier, resource);
    const percentage = getUsagePercentage(planTier, resource, current);

    return {
      resource,
      current,
      limit,
      percentage,
      isAtLimit: isAtLimit(planTier, resource, current),
      isApproaching: isApproachingLimit(planTier, resource, current),
    };
  },

  getAllResourceUsages: (): ResourceUsage[] => {
    const resources: ResourceType[] = [
      'ai_voice_minutes',
      'ai_chat_messages',
      'sms_sent',
      'phone_numbers',
      'team_members',
      'kb_storage_mb',
    ];
    return resources.map((r) => get().getResourceUsage(r));
  },

  setShowLimitModal: (show: boolean, resource: ResourceType | null = null) => {
    set({ showLimitModal: show, limitModalResource: resource });
  },

  markWarningShown: (resource: ResourceType) => {
    const { warningShownFor } = get();
    const updated = new Set(warningShownFor);
    updated.add(resource);
    set({ warningShownFor: updated });
  },

  resetWarnings: () => {
    set({ warningShownFor: new Set() });
  },
}));
