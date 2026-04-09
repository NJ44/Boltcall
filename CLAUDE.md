# Boltcall – Claude Project Context

AI phone receptionist & lead engagement SaaS for local businesses.

## Stack
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v3, Radix UI primitives, `class-variance-authority`, `clsx`, `tailwind-merge`
- **Routing**: React Router DOM v7 — all routes defined in `src/routes/AppRoutes.tsx`
- **State**: Zustand stores in `src/stores/`
- **Auth/DB**: Supabase (`@supabase/supabase-js`) — client in `src/lib/`
- **AI Voice**: Retell SDK (`retell-sdk`) — API in `src/api/retell/`
- **Animations**: Framer Motion, GSAP, Lottie (`.lottie` files in `public/`)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Deployment**: Netlify (serverless functions in `netlify/functions/`, config in `netlify.toml`)

## Project Structure
```
src/
  api/           # External API integrations (facebook/, retell/)
  components/    # Reusable UI components
    dashboard/   # Dashboard-specific components (Sidebar, Topbar, etc.)
    pricing/     # Pricing section components
    setup/       # Onboarding wizard (WizardShell, steps/, forms/)
    ui/          # Shadcn-style base UI components
    hooks/       # Component-level hooks
  contexts/      # React contexts (AuthContext)
  data/          # Static data/constants
  hooks/         # App-level hooks (useLenis, etc.)
  lib/           # Supabase client and utilities
  pages/
    dashboard/   # Authenticated dashboard pages
      settings/  # Settings sub-pages (General, Members, Billing, etc.)
    features/    # Feature landing pages
    speed-test/  # Speed test funnel pages
    comparisons/ # Competitor comparison pages
  routes/        # AppRoutes.tsx — single routing file
  server/        # api.ts, mockApi.ts
  stores/        # Zustand: dashboardStore, setupStore, speedTestStore
  styles/        # nav.css
  types/         # TypeScript types (dashboard, callbacks, chats, retell)
  utils/         # chatkit.ts and other utilities
public/          # Static assets, Lottie animations, images
netlify/
  functions/     # Netlify serverless functions
dist/            # Build output (do not edit)
```

## Key Pages
| Route area | Entry point |
|---|---|
| Home/marketing | `src/pages/Home.tsx` |
| Auth | `src/pages/Login.tsx`, `src/pages/Signup.tsx` |
| Dashboard shell | `src/components/dashboard/DashboardLayout.tsx` |
| Main dashboard | `src/pages/dashboard/DashboardPage.tsx` |
| Settings | `src/pages/dashboard/settings/` |
| Onboarding wizard | `src/pages/Setup.tsx` + `src/components/setup/` |
| Pricing | `src/pages/PricingPage.tsx` |
| Speed-to-lead funnel | `src/pages/speed-test/` |

## Important Files
- `src/routes/AppRoutes.tsx` — all route definitions
- `src/contexts/AuthContext.tsx` — auth state
- `src/components/dashboard/DashboardLayout.tsx` — dashboard layout wrapper
- `src/components/dashboard/Sidebar.tsx` — sidebar nav
- `netlify.toml` — deployment + redirect config
- `.env` — environment variables (Supabase URL/key, Retell key, etc.)

## Conventions
- Components use `.tsx`, utilities use `.ts`
- Tailwind for all styling — no CSS modules
- Lottie animations served from `public/` as `.lottie` files
- Dashboard pages live in `src/pages/dashboard/`, their sub-components in `src/components/dashboard/`
- Netlify functions handle server-side logic (webhooks, proxied API calls)

## MANDATORY: Blog Page Creation Rule

**BEFORE writing any blog page** (any file matching `Blog*.tsx` in `src/pages/` or any new `/blog/*` route), you MUST first invoke the Skill tool with `skill: "boltcall-blog-writer"`. This loads the full Searchable 10-section framework, title patterns, visual components, and boilerplate requirements.

No blog page may be written without this skill active. This applies to every new blog post — no exceptions.
