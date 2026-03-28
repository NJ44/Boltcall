import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }: any, ref: any) => (
      <div ref={ref} {...props}>{children}</div>
    )),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Variable mock data for useUsageTracking
let mockUsageData: any = {
  getAllResourceUsages: () => [],
  planTier: 'free',
};

vi.mock('../../../hooks/useUsageTracking', () => ({
  useUsageTracking: () => mockUsageData,
}));

vi.mock('../../../lib/plan-limits', async () => {
  const actual = await vi.importActual('../../../lib/plan-limits');
  return actual;
});

import UsageBanner from '../UsageBanner';

const renderBanner = () => {
  return render(
    <BrowserRouter>
      <UsageBanner />
    </BrowserRouter>
  );
};

describe('UsageBanner', () => {
  beforeEach(() => {
    mockUsageData = {
      getAllResourceUsages: () => [],
      planTier: 'free',
    };
  });

  it('should render nothing when no resources are at or approaching limit', () => {
    mockUsageData.getAllResourceUsages = () => [
      { resource: 'ai_voice_minutes', current: 2, limit: 10, percentage: 20, isAtLimit: false, isApproaching: false },
    ];
    const { container } = renderBanner();
    // No warning banners should be visible
    expect(screen.queryByText(/limit reached/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Approaching/)).not.toBeInTheDocument();
  });

  it('should render nothing for enterprise plan', () => {
    mockUsageData = {
      getAllResourceUsages: () => [
        { resource: 'ai_voice_minutes', current: 100, limit: -1, percentage: 0, isAtLimit: true, isApproaching: false },
      ],
      planTier: 'enterprise',
    };
    const { container } = renderBanner();
    expect(screen.queryByText(/limit reached/)).not.toBeInTheDocument();
  });

  it('should show red banner when resource is at limit', () => {
    mockUsageData.getAllResourceUsages = () => [
      { resource: 'ai_voice_minutes', current: 10, limit: 10, percentage: 100, isAtLimit: true, isApproaching: false },
    ];
    renderBanner();
    expect(screen.getByText(/AI Voice Minutes limit reached/)).toBeInTheDocument();
    // There may be multiple "Upgrade" links; just confirm at least one exists
    expect(screen.getAllByText(/Upgrade/).length).toBeGreaterThanOrEqual(1);
  });

  it('should show usage numbers in the at-limit banner', () => {
    mockUsageData.getAllResourceUsages = () => [
      { resource: 'sms_sent', current: 20, limit: 20, percentage: 100, isAtLimit: true, isApproaching: false },
    ];
    renderBanner();
    expect(screen.getByText(/20/)).toBeInTheDocument();
  });

  it('should show amber banner when resource is approaching limit', () => {
    mockUsageData.getAllResourceUsages = () => [
      { resource: 'ai_chat_messages', current: 45, limit: 50, percentage: 90, isAtLimit: false, isApproaching: true },
    ];
    renderBanner();
    expect(screen.getByText(/Approaching.*AI Chat Messages limit/i)).toBeInTheDocument();
    expect(screen.getByText(/View Usage/)).toBeInTheDocument();
  });

  it('should show "multiple limits" when multiple resources are approaching', () => {
    mockUsageData.getAllResourceUsages = () => [
      { resource: 'ai_voice_minutes', current: 9, limit: 10, percentage: 90, isAtLimit: false, isApproaching: true },
      { resource: 'sms_sent', current: 17, limit: 20, percentage: 85, isAtLimit: false, isApproaching: true },
    ];
    renderBanner();
    expect(screen.getByText(/multiple limits/)).toBeInTheDocument();
  });

  it('should have an Upgrade link pointing to plan-billing', () => {
    mockUsageData.getAllResourceUsages = () => [
      { resource: 'ai_voice_minutes', current: 10, limit: 10, percentage: 100, isAtLimit: true, isApproaching: false },
    ];
    renderBanner();
    const upgradeLink = screen.getByText('Upgrade').closest('a');
    expect(upgradeLink).toHaveAttribute('href', '/dashboard/settings/plan-billing');
  });

  it('should dismiss at-limit banner when X is clicked', () => {
    mockUsageData.getAllResourceUsages = () => [
      { resource: 'ai_voice_minutes', current: 10, limit: 10, percentage: 100, isAtLimit: true, isApproaching: false },
    ];
    renderBanner();
    expect(screen.getByText(/AI Voice Minutes limit reached/)).toBeInTheDocument();

    // Find and click the dismiss button (the X button next to upgrade)
    const dismissButtons = screen.getAllByRole('button');
    const xButton = dismissButtons.find((btn) => btn.querySelector('svg'));
    if (xButton) fireEvent.click(xButton);

    expect(screen.queryByText(/AI Voice Minutes limit reached/)).not.toBeInTheDocument();
  });
});
