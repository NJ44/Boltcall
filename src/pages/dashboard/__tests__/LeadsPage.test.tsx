import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

// Mock the sub-pages to isolate testing
vi.mock('../SpeedToLeadPage', () => ({
  default: () => <div data-testid="speed-to-lead-page">Speed to Lead Content</div>,
}));

vi.mock('../MissedCallsPage', () => ({
  default: () => <div data-testid="missed-calls-page">Missed Calls Content</div>,
}));

vi.mock('../LeadReactivationPage', () => ({
  default: () => <div data-testid="reactivation-page">Reactivation Content</div>,
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

  it('should render without crashing', () => {
    renderPage();
    expect(document.body).toBeInTheDocument();
  });

  it('should render all three tab labels', () => {
    renderPage();
    expect(screen.getByText('Speed to Lead')).toBeInTheDocument();
    expect(screen.getByText('Missed Calls')).toBeInTheDocument();
    expect(screen.getByText('Reactivation')).toBeInTheDocument();
  });

  it('should show Speed to Lead tab content by default', () => {
    renderPage();
    expect(screen.getByTestId('speed-to-lead-page')).toBeInTheDocument();
  });

  it('should not show Missed Calls tab content by default', () => {
    renderPage();
    expect(screen.queryByTestId('missed-calls-page')).not.toBeInTheDocument();
  });

  it('should switch to Missed Calls tab when clicked', () => {
    renderPage();
    fireEvent.click(screen.getByText('Missed Calls'));
    expect(screen.getByTestId('missed-calls-page')).toBeInTheDocument();
    expect(screen.queryByTestId('speed-to-lead-page')).not.toBeInTheDocument();
  });

  it('should switch to Reactivation tab when clicked', () => {
    renderPage();
    fireEvent.click(screen.getByText('Reactivation'));
    expect(screen.getByTestId('reactivation-page')).toBeInTheDocument();
  });

  it('should switch back to Speed to Lead tab', () => {
    renderPage();
    fireEvent.click(screen.getByText('Missed Calls'));
    fireEvent.click(screen.getByText('Speed to Lead'));
    expect(screen.getByTestId('speed-to-lead-page')).toBeInTheDocument();
  });

  it('should highlight active tab', () => {
    renderPage();
    const speedToLeadBtn = screen.getByText('Speed to Lead').closest('button');
    expect(speedToLeadBtn?.className).toContain('text-blue-600');
  });

  it('should render tab icons', () => {
    const { container } = renderPage();
    // Each tab has an icon (svg)
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(3);
    buttons.forEach((btn) => {
      expect(btn.querySelector('svg')).toBeInTheDocument();
    });
  });
});
