import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }: any, ref: any) => <div ref={ref} {...props}>{children}</div>),
    tr: React.forwardRef(({ children, ...props }: any, ref: any) => <tr ref={ref} {...props}>{children}</tr>),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user', email: 'test@test.com' },
    isAuthenticated: true,
    isLoading: false,
  }),
}));

vi.mock('../../../contexts/ToastContext', () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

vi.mock('../../../contexts/TokenContext', () => ({
  useTokens: () => ({
    claimReward: vi.fn(),
    totalAvailable: 100,
    tokensUsed: 20,
    monthlyAllocation: 1000,
    bonusBalance: 0,
    isLoading: false,
  }),
}));

vi.mock('../../../lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            then: (cb: any) => Promise.resolve({ data: [], error: null }).then(cb),
          }),
          not: () => ({
            then: (cb: any) => Promise.resolve({ data: [], error: null }).then(cb),
          }),
          then: (cb: any) => Promise.resolve({ data: [], error: null }).then(cb),
        }),
      }),
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: { id: 'test-user' } }, error: null }),
    },
  },
}));

vi.mock('../../../lib/retell', () => ({
  generateAgentPrompt: vi.fn(),
  updateRetellAgent: vi.fn(),
}));

vi.mock('../../../hooks/useRetellVoices', () => ({
  useRetellVoices: () => ({ voices: [] }),
}));

vi.mock('../../../components/ui/loading-skeleton', () => ({
  AgentsSkeleton: () => <div data-testid="agents-skeleton">Loading...</div>,
}));

vi.mock('../../../components/ui/CardTable', () => ({
  default: ({ data, columns }: any) => (
    <div data-testid="card-table">
      {data?.map((item: any, i: number) => (
        <div key={i}>{item.name}</div>
      ))}
    </div>
  ),
}));

vi.mock('../../../components/ui/modal-shell', () => ({
  default: ({ children, open }: any) => open ? <div data-testid="modal">{children}</div> : null,
}));

vi.mock('../../../components/ui/voice-picker', () => ({
  VoicePicker: () => null,
}));

vi.mock('../../../components/ui/pop-button', () => ({
  PopButton: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock('../../../components/TalkToAgentModal', () => ({
  default: () => null,
}));

vi.mock('../AgentTestsPage', () => ({
  default: () => <div>Agent Tests</div>,
}));

import AgentsPage from '../AgentsPage';

describe('AgentsPage', () => {
  it('should render without crashing', () => {
    render(
      <MemoryRouter>
        <AgentsPage />
      </MemoryRouter>
    );
    expect(document.body).toBeInTheDocument();
  });

  it('should show loading skeleton initially', () => {
    render(
      <MemoryRouter>
        <AgentsPage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('agents-skeleton')).toBeInTheDocument();
  });

  it('should have page content in the DOM', () => {
    render(
      <MemoryRouter>
        <AgentsPage />
      </MemoryRouter>
    );
    // The page renders content (skeleton or tabs)
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });
});
