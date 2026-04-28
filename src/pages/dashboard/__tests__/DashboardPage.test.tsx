import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }: any, ref: any) => <div ref={ref} {...props}>{children}</div>),
    span: React.forwardRef(({ children, ...props }: any, ref: any) => <span ref={ref} {...props}>{children}</span>),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock SubscriptionContext
vi.mock('../../../contexts/SubscriptionContext', () => ({
  useSubscription: () => ({
    subscription: null,
    planLevel: 'pro',
    isActive: true,
    isPro: true,
    isUltimate: false,
    isTrialing: true,
    trialDaysRemaining: 5,
    isLoading: false,
    hasAccess: () => true,
    refetch: vi.fn(),
  }),
  SubscriptionProvider: ({ children }: any) => <>{children}</>,
}));

// Mock Auth
vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user', email: 'test@test.com', name: 'Test User' },
    isAuthenticated: true,
    isLoading: false,
  }),
}));

// Mock Supabase — chain proxy supports arbitrary method sequences
function makeChain(): any {
  const resolved = Promise.resolve({ data: [], error: null, count: 0 });
  return new Proxy({}, {
    get(_t, prop) {
      if (prop === 'then') return resolved.then.bind(resolved);
      if (prop === 'catch') return resolved.catch.bind(resolved);
      if (prop === 'finally') return resolved.finally.bind(resolved);
      if (prop === 'single' || prop === 'maybeSingle')
        return () => Promise.resolve({ data: null, error: null });
      return (..._a: any[]) => makeChain();
    },
  });
}

vi.mock('../../../lib/supabase', () => ({
  supabase: {
    from: () => ({ select: (..._a: any[]) => makeChain(), insert: (..._a: any[]) => makeChain(), update: (..._a: any[]) => makeChain() }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: { id: 'test-user' } }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
    channel: () => ({ on: () => ({ subscribe: vi.fn() }) }),
    removeChannel: vi.fn(),
  },
}));

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'dashboard.setupGuide': 'Setup Guide',
      };
      return translations[key] || key;
    },
    i18n: { language: 'en' },
  }),
}));

// Mock confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

// Mock sub-components that have complex dependencies
vi.mock('../../../components/SetupCompletionPopup', () => ({
  default: () => null,
}));

vi.mock('../../../components/dashboard/FeatureHub', () => ({
  default: () => <div data-testid="feature-hub">Feature Hub</div>,
}));

vi.mock('../../../components/ui/onboarding-checklist', () => ({
  InteractiveOnboardingChecklist: () => null,
}));

vi.mock('../../../components/TalkToAgentModal', () => ({
  default: () => null,
}));

vi.mock('../../../components/ui/empty-state', () => ({
  EmptyState: ({ title }: any) => <div>{title}</div>,
}));

import DashboardPage from '../DashboardPage';

const renderPage = () => {
  return render(
    <MemoryRouter>
      <DashboardPage />
    </MemoryRouter>
  );
};

describe('DashboardPage', () => {
  beforeEach(() => {
    // Mock localStorage
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
  });

  it('should render without crashing', () => {
    renderPage();
    // The page should be in the document
    expect(document.body).toBeInTheDocument();
  });

  it('should render the Setup Guide section', () => {
    renderPage();
    expect(screen.getByText('Setup Guide')).toBeInTheDocument();
  });

  it('should render setup steps', () => {
    renderPage();
    expect(screen.getByText('Create Agent')).toBeInTheDocument();
    expect(screen.getByText('Connect Cal.com')).toBeInTheDocument();
    expect(screen.getByText('Setup Knowledge Base')).toBeInTheDocument();
    expect(screen.getByText('Test Your Agent')).toBeInTheDocument();
  });

  it('should render the Feature Hub', () => {
    renderPage();
    expect(screen.getByTestId('feature-hub')).toBeInTheDocument();
  });

  it('should render the Alerts section', () => {
    renderPage();
    expect(screen.getByText('Alerts')).toBeInTheDocument();
    expect(screen.getByText('No alerts at this time')).toBeInTheDocument();
  });

  it('should render the dock component', () => {
    renderPage();
    expect(screen.getByTestId('apple-dock')).toBeInTheDocument();
  });

  it('should show time estimates for incomplete steps', () => {
    renderPage();
    expect(screen.getAllByText('About 1 min').length).toBeGreaterThan(0);
  });

  it('should have setup step links', () => {
    renderPage();
    const links = screen.getAllByRole('link');
    const agentLink = links.find((l) => l.getAttribute('href') === '/dashboard/agents');
    expect(agentLink).toBeDefined();
  });
});
