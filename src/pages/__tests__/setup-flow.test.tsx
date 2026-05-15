/**
 * Setup flow tests — wizard order, signup gate, post-auth provisioning hand-off.
 *
 * Verifies the dopamine onboarding flow:
 *   1. /setup wizard works WITHOUT auth (pre-signup)
 *   2. Review & Launch step is gone — wizard ends at Location (pro+) or Business (free)
 *   3. Last step button says "Create my account" for unauth users
 *   4. Clicking it pivots to embedded AuthSwitch (signup mode)
 *   5. Authenticated users see "Launch" instead and skip signup
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// jsdom polyfills for Radix UI pointer events (Select trigger uses hasPointerCapture)
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

// Mocked auth context — toggle user via mockUser ref
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

// Pro+ tier so we get the full 3-step wizard (Personal, Business, Location)
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
  LocationService: {
    create: vi.fn().mockResolvedValue({ id: 'loc_1' }),
  },
}));

vi.mock('../../lib/api', () => ({
  FUNCTIONS_BASE: '/.netlify/functions',
}));

// Stub fetch for the setup-launch network call at the tail of runProvisioning
globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }) as never;

import Setup from '../Setup';

const renderSetup = () =>
  render(
    <MemoryRouter initialEntries={['/setup']}>
      <Setup />
    </MemoryRouter>
  );

describe('Setup wizard — dopamine onboarding flow', () => {
  beforeEach(() => {
    mockUser.current = null;
    mockNavigate.mockClear();
    mockSignup.mockClear();
    // Clear any persisted wizard data
    window.localStorage.clear();
  });

  it('renders the wizard without auth (route is public)', () => {
    renderSetup();
    expect(screen.getByText(/Personal Profile/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
  });

  it('does NOT include a Review & Launch step', () => {
    renderSetup();
    // The progress indicator shows step titles. The wizard should have only 3 steps for pro+
    // (Personal, Business, Location) — no "Review & Launch".
    expect(screen.queryByText(/Review & Launch/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Ready to launch/i)).not.toBeInTheDocument();
    // Final step indicator: "Step 1 of 3" for pro+ trialing users
    expect(screen.getByText(/Step 1 of 3/i)).toBeInTheDocument();
  });

  it('shows "Create my account" CTA on the final step when user is unauthenticated', async () => {
    const user = userEvent.setup();
    renderSetup();

    // Step 0: Personal Profile
    await user.type(screen.getByLabelText(/Full Name/i), 'Test User');
    await user.type(screen.getByLabelText(/Work Email/i), 'test@example.com');
    // Country select — radix select component
    const countryTrigger = screen.getByLabelText(/Country/i);
    await user.click(countryTrigger);
    await user.click(await screen.findByText('United States'));
    await user.click(screen.getByRole('button', { name: /Next/i }));

    // Step 1: Business Profile
    await user.type(screen.getByLabelText(/Business Name/i), 'Acme Co');
    const industryTrigger = screen.getByLabelText(/Industry/i);
    await user.click(industryTrigger);
    await user.click(await screen.findByText('Plumber'));
    await user.click(screen.getByRole('button', { name: /Next/i }));

    // Step 2: Location (last step). Button should now say "Create my account" — not "Launch".
    expect(screen.getByRole('button', { name: /Create my account/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Launch$/i })).not.toBeInTheDocument();
  });

  it('shows "Launch" CTA on the final step when user IS authenticated', async () => {
    const user = userEvent.setup();
    mockUser.current = { id: 'existing-user-id', email: 'user@example.com' };
    renderSetup();

    // Same path through wizard
    await user.type(screen.getByLabelText(/Full Name/i), 'Test User');
    await user.type(screen.getByLabelText(/Work Email/i), 'test@example.com');
    await user.click(screen.getByLabelText(/Country/i));
    await user.click(await screen.findByText('United States'));
    await user.click(screen.getByRole('button', { name: /Next/i }));

    await user.type(screen.getByLabelText(/Business Name/i), 'Acme Co');
    await user.click(screen.getByLabelText(/Industry/i));
    await user.click(await screen.findByText('Plumber'));
    await user.click(screen.getByRole('button', { name: /Next/i }));

    // Last step for authenticated users shows "Launch"
    expect(screen.getByRole('button', { name: /^Launch$/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Create my account/i })).not.toBeInTheDocument();
  });

  it('pivots to embedded AuthSwitch (signup mode) when unauthenticated user clicks "Create my account"', async () => {
    const user = userEvent.setup();
    renderSetup();

    // Walk through wizard to last step
    await user.type(screen.getByLabelText(/Full Name/i), 'Test User');
    await user.type(screen.getByLabelText(/Work Email/i), 'test@example.com');
    await user.click(screen.getByLabelText(/Country/i));
    await user.click(await screen.findByText('United States'));
    await user.click(screen.getByRole('button', { name: /Next/i }));

    await user.type(screen.getByLabelText(/Business Name/i), 'Acme Co');
    await user.click(screen.getByLabelText(/Industry/i));
    await user.click(await screen.findByText('Plumber'));
    await user.click(screen.getByRole('button', { name: /Next/i }));

    // Click "Create my account" → AuthSwitch should render in signup mode
    await user.click(screen.getByRole('button', { name: /Create my account/i }));

    // AuthSwitch shows email/password fields with the work email prefilled
    const emailInput = await screen.findByPlaceholderText(/^Email$/i);
    expect((emailInput as HTMLInputElement).value).toBe('test@example.com');
    expect(screen.getByPlaceholderText(/^Password$/i)).toBeInTheDocument();
    // Signup button visible
    expect(screen.getByRole('button', { name: /SIGN UP/i })).toBeInTheDocument();
  });
});
