/**
 * Setup wizard flow tests — step navigation, form state, validation.
 * Tests the store-driven wizard flow without rendering the full component
 * (which needs ToastProvider, Auth, Supabase, etc.).
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useSetupStore } from '../../stores/setupStore';

describe('Setup wizard flow — store integration', () => {
  beforeEach(() => {
    useSetupStore.getState().reset();
  });

  it('starts on step 1', () => {
    expect(useSetupStore.getState().currentStep).toBe(1);
  });

  it('full wizard progression: step 1 → step 2 → complete', () => {
    const store = useSetupStore;

    // Step 1: Fill business profile
    store.getState().updateBusinessProfile({
      businessName: 'Acme Dentistry',
      mainCategory: 'dentist',
      country: 'us',
      languages: 'en',
      websiteUrl: 'https://acmedentistry.com',
    });

    const bp = store.getState().businessProfile;
    expect(bp.businessName).toBe('Acme Dentistry');
    expect(bp.mainCategory).toBe('dentist');
    expect(bp.country).toBe('us');

    // Mark step 1 complete and move to step 2
    store.getState().markStepCompleted(1);
    store.getState().updateStep(2);
    expect(store.getState().currentStep).toBe(2);
    expect(store.getState().completedSteps).toContain(1);

    // Step 2: Fill knowledge base
    store.getState().updateKnowledgeBase({
      services: [
        { name: 'Cleaning', duration: 60, price: 200 },
        { name: 'Whitening', duration: 90, price: 500 },
      ],
      faqs: [
        { question: 'Do you accept insurance?', answer: 'Yes, most major providers.' },
      ],
    });

    const kb = store.getState().knowledgeBase;
    expect(kb.services).toHaveLength(2);
    expect(kb.faqs).toHaveLength(1);

    // Mark step 2 complete
    store.getState().markStepCompleted(2);
    expect(store.getState().completedSteps).toContain(2);

    // Complete the setup
    store.getState().complete();
    expect(store.getState().isCompleted).toBe(true);
  });

  it('preserves business profile across step changes', () => {
    const store = useSetupStore;

    store.getState().updateBusinessProfile({ businessName: 'My Clinic' });
    store.getState().updateStep(2);
    store.getState().updateStep(1);

    expect(store.getState().businessProfile.businessName).toBe('My Clinic');
  });

  it('account data persists across steps', () => {
    const store = useSetupStore;

    store.getState().updateAccount({
      fullName: 'John Doe',
      workEmail: 'john@clinic.com',
      businessName: 'Doe Clinic',
    });

    store.getState().updateStep(2);

    expect(store.getState().account.fullName).toBe('John Doe');
    expect(store.getState().account.workEmail).toBe('john@clinic.com');
  });

  it('opening hours default to Mon-Sun 9-5', () => {
    const hours = useSetupStore.getState().businessProfile.openingHours;
    expect(hours.monday).toEqual({ open: '09:00', close: '17:00', closed: false });
    expect(hours.sunday).toEqual({ open: '09:00', close: '17:00', closed: false });
  });

  it('can update opening hours for specific days', () => {
    useSetupStore.getState().updateBusinessProfile({
      openingHours: {
        ...useSetupStore.getState().businessProfile.openingHours,
        saturday: { open: '10:00', close: '14:00', closed: false },
        sunday: { open: '', close: '', closed: true },
      },
    });

    const hours = useSetupStore.getState().businessProfile.openingHours;
    expect(hours.saturday.open).toBe('10:00');
    expect(hours.sunday.closed).toBe(true);
  });

  it('knowledge base starts empty', () => {
    const kb = useSetupStore.getState().knowledgeBase;
    expect(kb.services).toEqual([]);
    expect(kb.faqs).toEqual([]);
    expect(kb.uploadedFiles).toEqual([]);
  });

  it('call flow defaults to friendly_concise tone', () => {
    expect(useSetupStore.getState().callFlow.tone).toBe('friendly_concise');
  });

  it('agent config defaults to inbound type', () => {
    expect(useSetupStore.getState().agentConfig.agentType).toBe('inbound');
  });

  it('reset clears all wizard state', () => {
    const store = useSetupStore;

    store.getState().updateBusinessProfile({ businessName: 'Test' });
    store.getState().updateStep(2);
    store.getState().markStepCompleted(1);

    store.getState().reset();

    expect(store.getState().currentStep).toBe(1);
    expect(store.getState().businessProfile.businessName).toBe('');
    expect(store.getState().completedSteps).toEqual([]);
    expect(store.getState().isCompleted).toBe(false);
  });
});
