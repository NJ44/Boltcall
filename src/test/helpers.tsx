/**
 * Shared test helpers — mocks and wrappers used across smoke tests.
 */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

// ── Common mocks ────────────────────────────────────────────────────────────

/** Mock framer-motion so animated components render as plain divs */
export function mockFramerMotion() {
  vi.mock('framer-motion', () => ({
    motion: new Proxy({}, {
      get: (_target, prop) => {
        return React.forwardRef(({ children, ...props }: any, ref: any) => {
          // Filter out framer-motion-specific props
          const htmlProps: any = {};
          for (const [k, v] of Object.entries(props)) {
            if (!k.startsWith('while') && !k.startsWith('animate') && !k.startsWith('initial') &&
                !k.startsWith('exit') && !k.startsWith('transition') && !k.startsWith('variants') &&
                k !== 'layout' && k !== 'layoutId' && k !== 'onViewportEnter' && k !== 'viewport') {
              htmlProps[k] = v;
            }
          }
          return React.createElement(prop as string, { ...htmlProps, ref }, children);
        });
      },
    }),
    AnimatePresence: ({ children }: any) => <>{children}</>,
    useMotionValue: () => ({ set: vi.fn(), get: () => 0 }),
    useTransform: () => 0,
    useSpring: () => ({ set: vi.fn(), get: () => 0 }),
    useInView: () => true,
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useAnimation: () => ({ start: vi.fn(), stop: vi.fn() }),
  }));
}

/** Mock Auth context for authenticated pages */
export function mockAuth(overrides?: Record<string, any>) {
  vi.mock('../contexts/AuthContext', () => ({
    useAuth: () => ({
      user: { id: 'test-user', email: 'test@test.com', name: 'Test User' },
      isAuthenticated: true,
      isLoading: false,
      ...overrides,
    }),
  }));
}

/** Mock Supabase client */
export function mockSupabase() {
  vi.mock('../lib/supabase', () => ({
    supabase: {
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              order: () => ({
                limit: () => ({
                  then: (cb: any) => Promise.resolve({ data: [] }).then(cb),
                }),
              }),
            }),
            single: () => Promise.resolve({ data: null, error: null }),
            order: () => ({
              limit: () => Promise.resolve({ data: [], error: null }),
            }),
            in: () => Promise.resolve({ data: [], count: 0 }),
          }),
          single: () => Promise.resolve({ data: null, error: null }),
        }),
        insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: {}, error: null }) }) }),
        update: () => ({ eq: () => Promise.resolve({ error: null }) }),
        delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
      }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: { id: 'test-user' } }, error: null }),
        getSession: () => Promise.resolve({ data: { session: { access_token: 'tok' } }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: vi.fn() } } }),
      },
      channel: () => ({ on: () => ({ subscribe: vi.fn() }) }),
    },
  }));
}

/** Mock react-i18next */
export function mockI18n() {
  vi.mock('react-i18next', () => ({
    useTranslation: () => ({
      t: (key: string) => key,
      i18n: { language: 'en', changeLanguage: vi.fn() },
    }),
    Trans: ({ children }: any) => <>{children}</>,
    initReactI18next: { type: '3rdParty', init: () => {} },
  }));
}

/** Mock common heavy dependencies */
export function mockHeavyDeps() {
  vi.mock('canvas-confetti', () => ({ default: vi.fn() }));
  vi.mock('lenis', () => ({ default: class { destroy() {} } }));
  vi.mock('@lottiefiles/dotlottie-react', () => ({
    DotLottieReact: () => null,
  }));
  vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    LineChart: () => null,
    BarChart: () => null,
    AreaChart: () => null,
    PieChart: () => null,
    Line: () => null,
    Bar: () => null,
    Area: () => null,
    Pie: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
    Legend: () => null,
    Cell: () => null,
  }));
  vi.mock('gsap', () => ({
    default: { registerPlugin: vi.fn(), to: vi.fn(), fromTo: vi.fn(), timeline: () => ({ to: vi.fn(), fromTo: vi.fn(), kill: vi.fn() }) },
    ScrollTrigger: { create: vi.fn(), refresh: vi.fn() },
  }));
  vi.mock('@gsap/react', () => ({
    useGSAP: (cb: any) => { try { cb(); } catch {} },
  }));
}

/** Wrapper that provides MemoryRouter at a given path */
export function createRouterWrapper(path = '/') {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <MemoryRouter initialEntries={[path]}>{children}</MemoryRouter>;
  };
}
