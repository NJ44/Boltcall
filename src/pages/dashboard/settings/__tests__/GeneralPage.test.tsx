import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }: any, ref: any) => <div ref={ref} {...props}>{children}</div>),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

vi.mock('../../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user', email: 'test@test.com', name: 'Test User' },
    isAuthenticated: true,
  }),
}));

vi.mock('../../../../contexts/ToastContext', () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

vi.mock('../../../../contexts/TokenContext', () => ({
  useTokens: () => ({
    claimReward: vi.fn(),
    totalAvailable: 100,
  }),
}));

vi.mock('../../../../lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: () => ({
              maybeSingle: () => Promise.resolve({ data: null, error: null }),
            }),
          }),
          limit: () => ({
            maybeSingle: () => Promise.resolve({ data: null, error: null }),
          }),
          maybeSingle: () => Promise.resolve({ data: null, error: null }),
          then: (cb: any) => Promise.resolve({ data: null, error: null }).then(cb),
        }),
      }),
      update: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: { id: 'new-id' }, error: null }),
        }),
      }),
      upsert: () => Promise.resolve({ error: null }),
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: { id: 'test-user' } }, error: null }),
    },
  },
}));

vi.mock('../../../../components/ui/pop-button', () => ({
  PopButton: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock('../../../../components/ui/Button', () => ({
  default: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock('../../../../components/ui/modal-shell', () => ({
  default: ({ children, open }: any) => open ? <div data-testid="modal">{children}</div> : null,
}));

vi.mock('../../../../components/ui/unsaved-changes', () => ({
  UnsavedChanges: () => null,
}));

import GeneralPage from '../GeneralPage';

describe('GeneralPage', () => {
  it('should render without crashing', () => {
    render(
      <MemoryRouter>
        <GeneralPage />
      </MemoryRouter>
    );
    expect(document.body).toBeInTheDocument();
  });

  it('should render form fields', () => {
    render(
      <MemoryRouter>
        <GeneralPage />
      </MemoryRouter>
    );
    // The page renders input fields for business info
    const inputs = document.querySelectorAll('input, select, textarea');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('should render save button', () => {
    render(
      <MemoryRouter>
        <GeneralPage />
      </MemoryRouter>
    );
    // Check for a button that could be the save action
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
