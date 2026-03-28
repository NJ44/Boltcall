import { describe, it, expect, vi } from 'vitest';
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

vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user', email: 'test@test.com' },
    isAuthenticated: true,
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
    isLoading: false,
  }),
}));

// Build a deeply chainable supabase mock
function createDeepChain(resolveWith: any = { data: null, error: null }): any {
  const handler: ProxyHandler<any> = {
    get(_target, prop) {
      if (prop === 'then') {
        return (onResolve: any) => Promise.resolve(resolveWith).then(onResolve);
      }
      if (prop === Symbol.toPrimitive || prop === Symbol.toStringTag) return undefined;
      // Return a function that returns another proxy
      return (..._args: any[]) => new Proxy({}, handler);
    },
  };
  return new Proxy({}, handler);
}

vi.mock('../../../lib/supabase', () => ({
  supabase: {
    from: () => createDeepChain({ data: null, error: null }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: { id: 'test-user' } }, error: null }),
      getSession: () => Promise.resolve({ data: { session: { user: { id: 'test-user' } } } }),
    },
    storage: {
      from: () => createDeepChain({ data: null, error: null }),
    },
  },
}));

vi.mock('../../../components/ui/loading-skeleton', () => ({
  KnowledgeBaseSkeleton: () => <div data-testid="kb-skeleton">Loading...</div>,
}));

vi.mock('../../../components/ui/modal-shell', () => ({
  default: ({ children, open }: any) => open ? <div data-testid="modal">{children}</div> : null,
}));

vi.mock('@/components/ui/file-upload', () => ({
  FileUpload: () => <div data-testid="file-upload">File Upload</div>,
}));

vi.mock('../../../components/ui/CardTableWithPanel', () => ({
  default: ({ data }: any) => <div data-testid="card-table-panel">Table ({data?.length || 0} items)</div>,
}));

vi.mock('../../../components/ui/pop-button', () => ({
  PopButton: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

import KnowledgeBasePage from '../KnowledgeBasePage';

describe('KnowledgeBasePage', () => {
  it('should render without crashing', () => {
    render(
      <MemoryRouter>
        <KnowledgeBasePage />
      </MemoryRouter>
    );
    expect(document.body).toBeInTheDocument();
  });

  it('should render the page content', () => {
    render(
      <MemoryRouter>
        <KnowledgeBasePage />
      </MemoryRouter>
    );
    // The page should have some content rendered
    expect(document.body.textContent).toBeTruthy();
  });
});
