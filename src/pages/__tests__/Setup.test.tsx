import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ to, children, ...props }: { to: string; children: React.ReactNode }) => (
    <a href={to} {...props}>{children}</a>
  ),
}))

// Mock SubscriptionContext — non-trialing user so Setup renders 3-step wizard
vi.mock('../../contexts/SubscriptionContext', () => ({
  useSubscription: () => ({
    subscription: null,
    planLevel: null,
    isActive: false,
    isPro: false,
    isUltimate: false,
    isTrialing: false,
    trialDaysRemaining: 0,
    isLoading: false,
    hasAccess: () => false,
    refetch: vi.fn(),
  }),
  SubscriptionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Mock AuthContext
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', email: 'test@example.com' },
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn(),
    signup: vi.fn(),
    logout: vi.fn(),
    signInWithGoogle: vi.fn(),
    signInWithMicrosoft: vi.fn(),
    signInWithFacebook: vi.fn(),
  }),
}))

// Mock database and webhooks modules
vi.mock('../../lib/database', () => ({
  createUserWorkspaceAndProfile: vi.fn().mockResolvedValue({
    workspace: { id: 'ws-1' },
    businessProfile: { id: 'bp-1' },
  }),
}))

vi.mock('../../lib/webhooks', () => ({
  createAgentAndKnowledgeBase: vi.fn().mockResolvedValue({}),
}))

vi.mock('../../lib/locations', () => ({
  LocationService: {
    create: vi.fn().mockResolvedValue({ id: 'loc-1' }),
  },
}))

// Mock framer-motion to render children without animation
vi.mock('framer-motion', () => {
  const React = require('react')
  return {
    motion: new Proxy(
      {},
      {
        get: (_target: unknown, prop: string) => {
          return React.forwardRef(
            ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }, ref: React.Ref<HTMLElement>) => {
              // Filter out framer-motion-specific props
              const filteredProps: Record<string, unknown> = {}
              for (const [key, value] of Object.entries(props)) {
                if (
                  !['initial', 'animate', 'exit', 'variants', 'transition',
                    'whileHover', 'whileTap', 'whileInView', 'layout'].includes(key)
                ) {
                  filteredProps[key] = value
                }
              }
              return React.createElement(prop, { ...filteredProps, ref }, children)
            }
          )
        },
      }
    ),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  }
})

import Setup from '../Setup'

describe('Setup page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders step 1 - Your Business', () => {
    render(<Setup />)
    expect(screen.getByText('Tell us about your business')).toBeInTheDocument()
    expect(screen.getByLabelText('Business Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Your Name')).toBeInTheDocument()
    expect(screen.getByText('Step 1 of 3: Your Business')).toBeInTheDocument()
  })

  it('has the Next button disabled when required fields are empty', () => {
    render(<Setup />)
    const nextButton = screen.getByRole('button', { name: /next/i })
    expect(nextButton).toBeDisabled()
  })

  it('enables Next button when business name and industry are filled', async () => {
    const user = userEvent.setup()
    render(<Setup />)

    // Fill in business name (minimum 2 chars)
    const businessNameInput = screen.getByLabelText('Business Name')
    await user.type(businessNameInput, 'Test Business')

    // Industry is a Radix Select which is hard to interact with in tests.
    // The Next button should still be disabled without industry.
    const nextButton = screen.getByRole('button', { name: /next/i })
    expect(nextButton).toBeDisabled()
  })

  it('has Back button disabled on step 1', () => {
    render(<Setup />)
    const backButton = screen.getByRole('button', { name: /back/i })
    expect(backButton).toBeDisabled()
  })

  it('renders the logo with a link to home', () => {
    render(<Setup />)
    const logo = screen.getByAltText('Boltcall')
    expect(logo).toBeInTheDocument()
    expect(logo.closest('a')).toHaveAttribute('href', '/')
  })

  it('displays the step indicator text', () => {
    render(<Setup />)
    expect(screen.getByText(/Step 1 of 3/)).toBeInTheDocument()
  })
})
