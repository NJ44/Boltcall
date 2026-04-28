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
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

// Mock confetti
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

// Mock store
vi.mock('../../../stores/dashboardStore', () => ({
  useDashboardStore: (selector: any) => selector({ fetchLiveData: vi.fn() }),
}));

// Mock all sub-components that DashboardPage renders
vi.mock('../../../components/SetupCompletionPopup', () => ({ default: () => null }));
vi.mock('../../../components/dashboard/TodayGlanceCard', () => ({
  default: () => <div data-testid="today-glance-card">Today Status</div>,
}));
vi.mock('../../../components/dashboard/WinFeed', () => ({
  default: () => <div data-testid="win-feed">Win Feed</div>,
}));
vi.mock('../../../components/dashboard/WhileYouWereGone', () => ({ default: () => null }));
vi.mock('../../../components/ui/agent-workflow-block', () => ({
  AgentWorkflowBlock: () => <div data-testid="agent-workflow">Agent Workflow</div>,
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
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
  });

  it('should render without crashing', () => {
    renderPage();
    expect(document.body).toBeInTheDocument();
  });

  it('should render the TodayGlanceCard', () => {
    renderPage();
    expect(screen.getByTestId('today-glance-card')).toBeInTheDocument();
  });

  it('should render the WinFeed', () => {
    renderPage();
    expect(screen.getByTestId('win-feed')).toBeInTheDocument();
  });

  it('should render the AgentWorkflowBlock', () => {
    renderPage();
    expect(screen.getByTestId('agent-workflow')).toBeInTheDocument();
  });

  it('should render page content', () => {
    renderPage();
    expect(document.body.textContent).toBeTruthy();
  });

  it('should render all main sections', () => {
    renderPage();
    expect(screen.getByTestId('today-glance-card')).toBeInTheDocument();
    expect(screen.getByTestId('win-feed')).toBeInTheDocument();
    expect(screen.getByTestId('agent-workflow')).toBeInTheDocument();
  });

  it('should not crash when user is logged in', () => {
    expect(() => renderPage()).not.toThrow();
  });

  it('should render a containing div', () => {
    const { container } = renderPage();
    expect(container.firstChild).toBeTruthy();
  });
});
