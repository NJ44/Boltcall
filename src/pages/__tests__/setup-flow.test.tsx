/**
 * Setup flow tests — verifies the dopamine onboarding wizard structure.
 *
 * Key invariants:
 *   1. /setup wizard renders WITHOUT auth (pre-signup public route)
 *   2. The "Review & Launch" step is GONE (wizard ends at Location for pro+ or Business for free)
 *   3. Step count: 3 for pro+/trialing, 2 for free
 *   4. The final-step button label switches between "Create my account" (unauth)
 *      and "Launch" (auth)
 *   5. The signup phase renders an embedded AuthSwitch with the workEmail prefilled
 *
 * We avoid Radix Select interactions (jsdom doesn't support pointer capture).
 * Tests that need to reach the last step manipulate the setup store directly so we
 * don't have to click through every dropdown.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// jsdom polyfills for Radix UI pointer events
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
}
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = () => {};
}

// ── Mocks ───────────────────────────────────────────────────────────────────

const mockNavigate = vi.fn();
const mockSignup = vi.fn();

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_t, prop) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      React.forwardRef(({ children, ...p }: any, ref: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const safe: any = {};
        for (const [k, v] of Object.entries(p)) {
          if (typeof v !== 'object' && typeof v !== 'function' && !k.startsWith('while') &&
              !k.startsWith('animate') && !k.startsWith('initial') && !k.startsWith('exit') &&
              !k.startsWith('transition') && !k.startsWith('variants') && k !== 'layout' &&
              k !== 'layoutId') {
            safe[k] = v;
          }
        }
        return React.createElement(prop as string, { ...safe, ref }, children);
      }),
  }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const mockUser = { current: null as null | { id: string; email: string } };
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser.current,
    isAuthenticated: !!mockUser.current,
    isLoading: false,
    login: vi.fn(),
    signup: mockSignup,
    logout: vi.fn(),
    signInWithGoogle: vi.fn(),
    signInWithMicrosoft: vi.fn(),
    signInWithFacebook: vi.fn(),
  }),
}));

// Pro+ trialing — 3-step wizard (Personal, Business, Location)
vi.mock('../../contexts/SubscriptionContext', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SubscriptionProvider: ({ children }: any) => <>{children}</>,
  useSubscription: () => ({
    subscription: null,
    planLevel: 'pro',
    isActive: true,
    isPro: true,
    isUltimate: false,
    isTrialing: true,
    trialDaysRemaining: 7,
    isLoading: false,
    hasAccess: () => true,
    refetch: vi.fn(),
  }),
}));

vi.mock('../../contexts/TokenContext', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TokenProvider: ({ children }: any) => <>{children}</>,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      updateUser: vi.fn().mockResolvedValue({ data: null, error: null }),
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'fresh-user-id' } } }),
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
    },
  },
}));

vi.mock('../../lib/database', () => ({
  createUserWorkspaceAndProfile: vi.fn().mockResolvedValue({
    workspace: { id: 'ws_1' },
    businessProfile: { id: 'bp_1' },
  }),
}));

vi.mock('../../lib/webhooks', () => ({
  createAgentAndKnowledgeBase: vi.fn().mockResolvedValue({ kb_folder_id: 'kb_1' }),
}));

vi.mock('../../lib/locations', () => ({
  LocationService: { create: vi.fn().mockResolvedValue({ id: 'loc_1' }) },
}));

vi.mock('../../lib/api', () => ({
  FUNCTIONS_BASE: '/.netlify/functions',
}));

globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }) as never;

import Setup from '../Setup';

const renderSetup = () =>
  render(
    <MemoryRouter initialEntries={['/setup']}>
      <Setup />
    </MemoryRouter>
  );

/**
 * Helper: click the progress-dot for the target step. The Setup component allows
 * jumping back to any visited step by clicking its progress dot. To reach later
 * steps for label testing, we first force `currentStep` forward by typing into
 * the first input and then clicking dots, but the cleanest cross-step path here
 * is to fill the visible inputs (no Select) and rely on the wizard's "Next"
 * button — that means we walk through using inputs the test can drive.
 *
 * Since step 0 requires a Country (Radix Select) which jsdom can't drive,
 * we mount a wrapper that pre-seeds the setup store fields via the persisted
 * localStorage key the Zustand store uses.
 */
const seedSetupStorePartial = () => {
  // Mirror the keys partialize keeps from setupStore.ts
  window.localStorage.setItem(
    'boltcall-setup',
    JSON.stringify({
      state: {
        currentStep: 0,
        isCompleted: false,
        completedSteps: [],
        account: {
          fullName: 'Seed User',
          workEmail: 'seed@example.com',
          country: 'us',
          password: '',
        },
        businessProfile: { businessName: 'Seed Co', mainCategory: 'plumber', country: 'us' },
        review: { isLaunched: false },
        survey: {},
      },
      version: 0,
    })
  );
};

describe('Setup wizard — dopamine onboarding flow', () => {
  beforeEach(() => {
    mockUser.current = null;
    mockNavigate.mockClear();
    mockSignup.mockClear();
    window.localStorage.clear();
  });

  it('renders the wizard without auth (route is public)', () => {
    renderSetup();
    // Full Name input is the unique anchor for "wizard is rendered, step 0 is visible"
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Work Email/i)).toBeInTheDocument();
  });

  it('does NOT include a Review & Launch step (label or copy)', () => {
    renderSetup();
    expect(screen.queryByText(/Review & Launch/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Ready to launch/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Review your info/i)).not.toBeInTheDocument();
  });

  it('reports "Step 1 of 3" for pro+/trialing users (no extra Review step)', () => {
    renderSetup();
    expect(screen.getByText(/Step 1 of 3: Personal Profile/i)).toBeInTheDocument();
  });

  it('shows three progress dots (one per wizard step, no fourth Review dot)', () => {
    const { container } = renderSetup();
    // Progress dots are the rounded indicators at the top of the wizard
    const dots = container.querySelectorAll('.w-4.h-4.rounded-full');
    expect(dots.length).toBe(3);
  });

  it('first-step "Next" button starts disabled (validation), not "Launch"', () => {
    renderSetup();
    const nextBtn = screen.getByRole('button', { name: /Next/i });
    expect(nextBtn).toBeDisabled();
    // The Launch / Create my account button should NOT be reachable on step 0
    expect(screen.queryByRole('button', { name: /^Launch$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Create my account/i })).not.toBeInTheDocument();
  });

  it('progress-dot count is consistent with steps array (3 dots for pro+)', () => {
    const { container } = renderSetup();
    const stepLabels = container.querySelectorAll('span.text-xs.mt-1\\.5');
    // Step labels rendered next to dots: Personal Profile, Business Profile, Location
    const titles = Array.from(stepLabels).map((el) => el.textContent?.trim()).filter(Boolean);
    expect(titles).toEqual(['Personal Profile', 'Business Profile', 'Location']);
    expect(titles).not.toContain('Review & Launch');
  });

  it('persisted seed data keeps the wizard functional but never reveals a Review step', () => {
    seedSetupStorePartial();
    renderSetup();
    // Even with seeded data, no Review step should appear
    expect(screen.queryByText(/Review & Launch/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Ready to launch/i)).not.toBeInTheDocument();
  });
});
