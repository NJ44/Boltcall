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

// LeadsPage now delegates entirely to SpeedToLeadPage
vi.mock('../SpeedToLeadPage', () => ({
  default: () => <div data-testid="speed-to-lead-page">Speed to Lead Content</div>,
}));

import LeadsPage from '../LeadsPage';

describe('LeadsPage', () => {
  const renderPage = () => {
    return render(
      <MemoryRouter>
        <LeadsPage />
      </MemoryRouter>
    );
  };

  it('renders without crashing', () => {
    renderPage();
    expect(document.body).toBeInTheDocument();
  });

  it('renders SpeedToLeadPage', () => {
    renderPage();
    expect(screen.getByTestId('speed-to-lead-page')).toBeInTheDocument();
  });
});
