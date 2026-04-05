/**
 * Usage & plan gating flow tests.
 * Tests the critical path: user hits limit → modal shown → upgrade path.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useUsageStore } from '../../stores/usageStore';
import { getPlanLimit, isAtLimit, isApproachingLimit, getNextPlan } from '../../lib/plan-limits';

// Mock Supabase so the store can be used without a real DB
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
          maybeSingle: () => Promise.resolve({ data: null, error: null }),
          gte: () => Promise.resolve({ data: [], error: null }),
          order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }),
        }),
      }),
    }),
  },
}));

describe('Usage gating flow — free plan user', () => {
  beforeEach(() => {
    useUsageStore.setState({
      usage: {
        ai_voice_minutes: 0,
        ai_chat_messages: 0,
        sms_sent: 0,
        phone_numbers: 0,
        team_members: 1,
        kb_storage_mb: 0,
      },
      planTier: 'free',
      showLimitModal: false,
      limitModalResource: null,
      warningShownFor: new Set(),
    });
  });

  it('starts with all resources available', () => {
    const store = useUsageStore.getState();
    expect(store.canUse('ai_voice_minutes')).toBe(true);
    expect(store.canUse('ai_chat_messages')).toBe(true);
    expect(store.canUse('sms_sent')).toBe(true);
  });

  it('blocks usage when limit is reached', () => {
    // Free plan: 10 voice minutes
    useUsageStore.setState({
      usage: { ...useUsageStore.getState().usage, ai_voice_minutes: 10 },
    });
    expect(useUsageStore.getState().canUse('ai_voice_minutes')).toBe(false);
  });

  it('shows limit modal when trackUsage hits limit', async () => {
    // Set usage to just under limit
    useUsageStore.setState({
      usage: { ...useUsageStore.getState().usage, ai_voice_minutes: 9 },
    });

    // Try to use 2 more (would exceed limit of 10)
    const result = await useUsageStore.getState().trackUsage('u1', 'ai_voice_minutes', 2);

    expect(result).toBe(false);
    expect(useUsageStore.getState().showLimitModal).toBe(true);
    expect(useUsageStore.getState().limitModalResource).toBe('ai_voice_minutes');
  });

  it('allows usage when under limit', async () => {
    const result = await useUsageStore.getState().trackUsage('u1', 'ai_voice_minutes', 1);

    expect(result).toBe(true);
    expect(useUsageStore.getState().usage.ai_voice_minutes).toBe(1);
    expect(useUsageStore.getState().showLimitModal).toBe(false);
  });

  it('getResourceUsage returns correct percentages', () => {
    useUsageStore.setState({
      usage: { ...useUsageStore.getState().usage, ai_voice_minutes: 8 },
    });

    const usage = useUsageStore.getState().getResourceUsage('ai_voice_minutes');
    expect(usage.current).toBe(8);
    expect(usage.limit).toBe(10); // free plan
    expect(usage.percentage).toBe(80);
    expect(usage.isApproaching).toBe(true);
    expect(usage.isAtLimit).toBe(false);
  });

  it('getAllResourceUsages returns all 6 resources', () => {
    const all = useUsageStore.getState().getAllResourceUsages();
    expect(all).toHaveLength(6);
    expect(all.map((r) => r.resource)).toEqual([
      'ai_voice_minutes', 'ai_chat_messages', 'sms_sent',
      'phone_numbers', 'team_members', 'kb_storage_mb',
    ]);
  });

  it('free plan has 0 phone numbers — always at limit', () => {
    expect(getPlanLimit('free', 'phone_numbers')).toBe(0);
    expect(isAtLimit('free', 'phone_numbers', 0)).toBe(true);
  });
});

describe('Usage gating flow — plan upgrade path', () => {
  it('free → starter → pro → ultimate → enterprise', () => {
    expect(getNextPlan('free')).toBe('starter');
    expect(getNextPlan('starter')).toBe('pro');
    expect(getNextPlan('pro')).toBe('ultimate');
    expect(getNextPlan('ultimate')).toBe('enterprise');
    expect(getNextPlan('enterprise')).toBeNull();
  });

  it('upgrading plan increases limits', () => {
    expect(getPlanLimit('free', 'ai_voice_minutes')).toBe(10);
    expect(getPlanLimit('starter', 'ai_voice_minutes')).toBe(100);
    expect(getPlanLimit('pro', 'ai_voice_minutes')).toBe(500);
    expect(getPlanLimit('ultimate', 'ai_voice_minutes')).toBe(2000);
    expect(getPlanLimit('enterprise', 'ai_voice_minutes')).toBe(-1); // unlimited
  });

  it('enterprise user is never at limit', () => {
    useUsageStore.setState({
      planTier: 'enterprise',
      usage: {
        ai_voice_minutes: 99999,
        ai_chat_messages: 99999,
        sms_sent: 99999,
        phone_numbers: 999,
        team_members: 999,
        kb_storage_mb: 9999,
      },
    });

    expect(useUsageStore.getState().canUse('ai_voice_minutes')).toBe(true);
    expect(useUsageStore.getState().canUse('sms_sent')).toBe(true);
  });
});

describe('Usage gating flow — warning system', () => {
  beforeEach(() => {
    useUsageStore.setState({
      planTier: 'starter',
      usage: {
        ai_voice_minutes: 0,
        ai_chat_messages: 0,
        sms_sent: 0,
        phone_numbers: 0,
        team_members: 1,
        kb_storage_mb: 0,
      },
      warningShownFor: new Set(),
    });
  });

  it('isApproachingLimit at 80%+', () => {
    expect(isApproachingLimit('starter', 'ai_voice_minutes', 80)).toBe(true);
    expect(isApproachingLimit('starter', 'ai_voice_minutes', 79)).toBe(false);
  });

  it('markWarningShown prevents duplicate warnings', () => {
    useUsageStore.getState().markWarningShown('ai_voice_minutes');
    expect(useUsageStore.getState().warningShownFor.has('ai_voice_minutes')).toBe(true);

    useUsageStore.getState().markWarningShown('sms_sent');
    expect(useUsageStore.getState().warningShownFor.size).toBe(2);
  });

  it('resetWarnings clears all warnings', () => {
    useUsageStore.getState().markWarningShown('ai_voice_minutes');
    useUsageStore.getState().markWarningShown('sms_sent');
    useUsageStore.getState().resetWarnings();
    expect(useUsageStore.getState().warningShownFor.size).toBe(0);
  });

  it('setShowLimitModal controls modal state', () => {
    useUsageStore.getState().setShowLimitModal(true, 'sms_sent');
    expect(useUsageStore.getState().showLimitModal).toBe(true);
    expect(useUsageStore.getState().limitModalResource).toBe('sms_sent');

    useUsageStore.getState().setShowLimitModal(false);
    expect(useUsageStore.getState().showLimitModal).toBe(false);
  });
});
