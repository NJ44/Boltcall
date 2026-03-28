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

vi.mock('../../../lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          not: () => ({ data: [], error: null }),
        }),
      }),
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: { id: 'test-user' } }, error: null }),
    },
  },
}));

vi.mock('../../../lib/retell', () => ({
  getRetellCallHistory: vi.fn().mockResolvedValue({ calls: [] }),
}));

vi.mock('../../../components/ui/loading-skeleton', () => ({
  CallHistorySkeleton: () => <div data-testid="call-history-skeleton">Loading...</div>,
}));

vi.mock('../../../components/ui/modal-shell', () => ({
  default: ({ children, open }: any) => open ? <div>{children}</div> : null,
}));

import CallHistoryPage from '../CallHistoryPage';

describe('CallHistoryPage', () => {
  it('should render without crashing', () => {
    render(
      <MemoryRouter>
        <CallHistoryPage />
      </MemoryRouter>
    );
    expect(document.body).toBeInTheDocument();
  });

  it('should render stats cards', () => {
    render(
      <MemoryRouter>
        <CallHistoryPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Total Calls')).toBeInTheDocument();
    expect(screen.getByText('Successful')).toBeInTheDocument();
    expect(screen.getByText('Avg Duration')).toBeInTheDocument();
    expect(screen.getByText('Call Quality')).toBeInTheDocument();
  });

  it('should render filter inputs', () => {
    render(
      <MemoryRouter>
        <CallHistoryPage />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText('Search calls...')).toBeInTheDocument();
  });

  it('should render status filter dropdown', () => {
    render(
      <MemoryRouter>
        <CallHistoryPage />
      </MemoryRouter>
    );
    expect(screen.getByText('All Status')).toBeInTheDocument();
    expect(screen.getByText('All Directions')).toBeInTheDocument();
  });

  it('should show loading skeleton initially', () => {
    render(
      <MemoryRouter>
        <CallHistoryPage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('call-history-skeleton')).toBeInTheDocument();
  });
});
