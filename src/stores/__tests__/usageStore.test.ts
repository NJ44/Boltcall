import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: () => ({ data: null, error: null }),
          gte: () => ({ data: [], error: null }),
          not: () => ({ data: [], error: null }),
          in: () => ({ data: [], error: null, count: 0 }),
          single: () => ({ data: null, error: null }),
        }),
        count: 'exact',
        head: true,
      }),
    }),
    auth: {
      getUser: () => ({ data: { user: { id: 'test' } }, error: null }),
    },
  },
}));

vi.mock('../../lib/plan-limits', async () => {
  const actual = await vi.importActual('../../lib/plan-limits');
  return actual;
});

import { useUsageStore } from '../usageStore';

describe('usageStore', () => {
  beforeEach(() => {
    // Reset store state
    useUsageStore.setState({
      usage: {
        ai_voice_minutes: 0,
        ai_chat_messages: 0,
        sms_sent: 0,
        phone_numbers: 0,
        team_members: 0,
        kb_storage_mb: 0,
      },
      planTier: 'free',
      showLimitModal: false,
      limitModalResource: null,
      warningShownFor: new Set(),
      isLoading: false,
      error: null,
    });
  });

  describe('canUse', () => {
    it('should return true when usage is below limit', () => {
      useUsageStore.setState({
        usage: { ai_voice_minutes: 5, ai_chat_messages: 0, sms_sent: 0, phone_numbers: 0, team_members: 0, kb_storage_mb: 0 },
        planTier: 'free',
      });
      expect(useUsageStore.getState().canUse('ai_voice_minutes')).toBe(true);
    });

    it('should return false when at limit', () => {
      useUsageStore.setState({
        usage: { ai_voice_minutes: 10, ai_chat_messages: 0, sms_sent: 0, phone_numbers: 0, team_members: 0, kb_storage_mb: 0 },
        planTier: 'free', // free limit is 10
      });
      expect(useUsageStore.getState().canUse('ai_voice_minutes')).toBe(false);
    });

    it('should return false when over limit', () => {
      useUsageStore.setState({
        usage: { ai_voice_minutes: 15, ai_chat_messages: 0, sms_sent: 0, phone_numbers: 0, team_members: 0, kb_storage_mb: 0 },
        planTier: 'free',
      });
      expect(useUsageStore.getState().canUse('ai_voice_minutes')).toBe(false);
    });

    it('should return true for enterprise (unlimited)', () => {
      useUsageStore.setState({
        usage: { ai_voice_minutes: 99999, ai_chat_messages: 0, sms_sent: 0, phone_numbers: 0, team_members: 0, kb_storage_mb: 0 },
        planTier: 'enterprise',
      });
      expect(useUsageStore.getState().canUse('ai_voice_minutes')).toBe(true);
    });

    it('should check each resource type independently', () => {
      useUsageStore.setState({
        usage: { ai_voice_minutes: 10, ai_chat_messages: 5, sms_sent: 0, phone_numbers: 0, team_members: 0, kb_storage_mb: 0 },
        planTier: 'free',
      });
      expect(useUsageStore.getState().canUse('ai_voice_minutes')).toBe(false); // at limit
      expect(useUsageStore.getState().canUse('ai_chat_messages')).toBe(true); // below limit
    });
  });

  describe('getResourceUsage', () => {
    it('should return correct usage data for a resource', () => {
      useUsageStore.setState({
        usage: { ai_voice_minutes: 8, ai_chat_messages: 0, sms_sent: 0, phone_numbers: 0, team_members: 0, kb_storage_mb: 0 },
        planTier: 'free',
      });
      const result = useUsageStore.getState().getResourceUsage('ai_voice_minutes');
      expect(result.resource).toBe('ai_voice_minutes');
      expect(result.current).toBe(8);
      expect(result.limit).toBe(10);
      expect(result.percentage).toBe(80);
      expect(result.isAtLimit).toBe(false);
      expect(result.isApproaching).toBe(true); // 80% threshold
    });

    it('should show isAtLimit when at limit', () => {
      useUsageStore.setState({
        usage: { ai_voice_minutes: 10, ai_chat_messages: 0, sms_sent: 0, phone_numbers: 0, team_members: 0, kb_storage_mb: 0 },
        planTier: 'free',
      });
      const result = useUsageStore.getState().getResourceUsage('ai_voice_minutes');
      expect(result.isAtLimit).toBe(true);
      expect(result.percentage).toBe(100);
    });

    it('should handle enterprise unlimited resources', () => {
      useUsageStore.setState({
        usage: { ai_voice_minutes: 5000, ai_chat_messages: 0, sms_sent: 0, phone_numbers: 0, team_members: 0, kb_storage_mb: 0 },
        planTier: 'enterprise',
      });
      const result = useUsageStore.getState().getResourceUsage('ai_voice_minutes');
      expect(result.limit).toBe(-1);
      expect(result.percentage).toBe(0);
      expect(result.isAtLimit).toBe(false);
      expect(result.isApproaching).toBe(false);
    });

    it('should return correct data for different plan tiers', () => {
      useUsageStore.setState({
        usage: { ai_voice_minutes: 80, ai_chat_messages: 0, sms_sent: 0, phone_numbers: 0, team_members: 0, kb_storage_mb: 0 },
        planTier: 'starter', // limit is 100
      });
      const result = useUsageStore.getState().getResourceUsage('ai_voice_minutes');
      expect(result.limit).toBe(100);
      expect(result.percentage).toBe(80);
      expect(result.isApproaching).toBe(true);
    });
  });

  describe('getAllResourceUsages', () => {
    it('should return usage data for all 6 resource types', () => {
      const results = useUsageStore.getState().getAllResourceUsages();
      expect(results).toHaveLength(6);
      const resourceNames = results.map((r) => r.resource);
      expect(resourceNames).toContain('ai_voice_minutes');
      expect(resourceNames).toContain('ai_chat_messages');
      expect(resourceNames).toContain('sms_sent');
      expect(resourceNames).toContain('phone_numbers');
      expect(resourceNames).toContain('team_members');
      expect(resourceNames).toContain('kb_storage_mb');
    });

    it('should reflect current usage values', () => {
      useUsageStore.setState({
        usage: { ai_voice_minutes: 5, ai_chat_messages: 25, sms_sent: 10, phone_numbers: 0, team_members: 1, kb_storage_mb: 3 },
        planTier: 'free',
      });
      const results = useUsageStore.getState().getAllResourceUsages();
      const voiceUsage = results.find((r) => r.resource === 'ai_voice_minutes');
      expect(voiceUsage?.current).toBe(5);
      const chatUsage = results.find((r) => r.resource === 'ai_chat_messages');
      expect(chatUsage?.current).toBe(25);
    });
  });

  describe('setShowLimitModal', () => {
    it('should show limit modal with resource', () => {
      useUsageStore.getState().setShowLimitModal(true, 'ai_voice_minutes');
      const state = useUsageStore.getState();
      expect(state.showLimitModal).toBe(true);
      expect(state.limitModalResource).toBe('ai_voice_minutes');
    });

    it('should hide limit modal', () => {
      useUsageStore.getState().setShowLimitModal(true, 'sms_sent');
      useUsageStore.getState().setShowLimitModal(false);
      const state = useUsageStore.getState();
      expect(state.showLimitModal).toBe(false);
      expect(state.limitModalResource).toBeNull();
    });

    it('should default resource to null when not provided', () => {
      useUsageStore.getState().setShowLimitModal(true);
      expect(useUsageStore.getState().limitModalResource).toBeNull();
    });
  });

  describe('markWarningShown', () => {
    it('should add resource to warningShownFor set', () => {
      useUsageStore.getState().markWarningShown('ai_voice_minutes');
      expect(useUsageStore.getState().warningShownFor.has('ai_voice_minutes')).toBe(true);
    });

    it('should track multiple warnings', () => {
      useUsageStore.getState().markWarningShown('ai_voice_minutes');
      useUsageStore.getState().markWarningShown('sms_sent');
      const warnings = useUsageStore.getState().warningShownFor;
      expect(warnings.has('ai_voice_minutes')).toBe(true);
      expect(warnings.has('sms_sent')).toBe(true);
    });

    it('should not duplicate entries', () => {
      useUsageStore.getState().markWarningShown('ai_voice_minutes');
      useUsageStore.getState().markWarningShown('ai_voice_minutes');
      expect(useUsageStore.getState().warningShownFor.size).toBe(1);
    });
  });

  describe('resetWarnings', () => {
    it('should clear all warnings', () => {
      useUsageStore.getState().markWarningShown('ai_voice_minutes');
      useUsageStore.getState().markWarningShown('sms_sent');
      useUsageStore.getState().resetWarnings();
      expect(useUsageStore.getState().warningShownFor.size).toBe(0);
    });
  });

  describe('trackUsage', () => {
    it('should increment usage and return true when within limit', async () => {
      useUsageStore.setState({
        usage: { ai_voice_minutes: 5, ai_chat_messages: 0, sms_sent: 0, phone_numbers: 0, team_members: 0, kb_storage_mb: 0 },
        planTier: 'free',
      });
      const result = await useUsageStore.getState().trackUsage('user-1', 'ai_voice_minutes', 1);
      expect(result).toBe(true);
      expect(useUsageStore.getState().usage.ai_voice_minutes).toBe(6);
    });

    it('should show limit modal and return false when exceeding limit', async () => {
      useUsageStore.setState({
        usage: { ai_voice_minutes: 9, ai_chat_messages: 0, sms_sent: 0, phone_numbers: 0, team_members: 0, kb_storage_mb: 0 },
        planTier: 'free',
      });
      const result = await useUsageStore.getState().trackUsage('user-1', 'ai_voice_minutes', 2);
      expect(result).toBe(false);
      expect(useUsageStore.getState().showLimitModal).toBe(true);
      expect(useUsageStore.getState().limitModalResource).toBe('ai_voice_minutes');
    });
  });
});
