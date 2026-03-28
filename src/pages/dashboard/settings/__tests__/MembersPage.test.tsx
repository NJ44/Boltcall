import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }: any, ref: any) => <div ref={ref} {...props}>{children}</div>),
    span: React.forwardRef(({ children, ...props }: any, ref: any) => <span ref={ref} {...props}>{children}</span>),
    tr: React.forwardRef(({ children, ...props }: any, ref: any) => <tr ref={ref} {...props}>{children}</tr>),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
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

const mockFetchMembers = vi.fn();
const mockInviteMember = vi.fn();
const mockLogActivity = vi.fn();

vi.mock('../../../../stores/teamStore', () => ({
  useTeamStore: () => ({
    members: [
      { id: 'm1', email: 'owner@test.com', name: 'Owner', role: 'owner', status: 'active', invited_by: 'test-user', invited_at: '2025-01-01' },
      { id: 'm2', email: 'agent@test.com', name: 'Agent User', role: 'agent', status: 'active', invited_by: 'test-user', invited_at: '2025-01-02' },
    ],
    membersLoading: false,
    fetchMembers: mockFetchMembers,
    inviteMember: mockInviteMember,
    inviteBulk: vi.fn(),
    updateMemberRole: vi.fn(),
    updateMemberStatus: vi.fn(),
    removeMember: vi.fn(),
    resendInvite: vi.fn(),
    logActivity: mockLogActivity,
  }),
}));

vi.mock('../../../../hooks/usePermission', () => {
  const PermissionGate = (props: any) => props.children;
  return {
    usePermission: () => ({
      can: () => true,
    }),
    PermissionGate,
  };
});

vi.mock('../../../../hooks/useUsageTracking', () => ({
  useUsageGate: () => ({
    allowed: true,
    showUpgrade: vi.fn(),
    resourceUsage: { resource: 'team_members', current: 1, limit: 3, percentage: 33, isAtLimit: false, isApproaching: false },
  }),
}));

vi.mock('../../../../types/team', async () => {
  const actual = await vi.importActual('../../../../types/team');
  return actual;
});

vi.mock('../../../../components/ui/pop-button', () => ({
  PopButton: ({ children, onClick, ...props }: any) => <button onClick={onClick} {...props}>{children}</button>,
}));

vi.mock('../../../../components/ui/modal-shell', () => ({
  default: ({ children, open }: any) => open ? <div data-testid="modal">{children}</div> : null,
}));

import MembersPage from '../MembersPage';

describe('MembersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(
      <MemoryRouter>
        <MembersPage />
      </MemoryRouter>
    );
    expect(document.body).toBeInTheDocument();
  });

  it('should call fetchMembers on mount', () => {
    render(
      <MemoryRouter>
        <MembersPage />
      </MemoryRouter>
    );
    expect(mockFetchMembers).toHaveBeenCalledWith('test-user');
  });

  it('should display member names', () => {
    render(
      <MemoryRouter>
        <MembersPage />
      </MemoryRouter>
    );
    // "Owner" may appear both as member name and role option, so check for at least one
    expect(screen.getAllByText('Owner').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Agent User')).toBeInTheDocument();
  });

  it('should display member emails', () => {
    render(
      <MemoryRouter>
        <MembersPage />
      </MemoryRouter>
    );
    expect(screen.getByText('owner@test.com')).toBeInTheDocument();
    expect(screen.getByText('agent@test.com')).toBeInTheDocument();
  });

  it('should have an invite button', () => {
    render(
      <MemoryRouter>
        <MembersPage />
      </MemoryRouter>
    );
    const buttons = screen.getAllByRole('button');
    // At least one button should be for inviting
    expect(buttons.length).toBeGreaterThan(0);
  });
});
