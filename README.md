# Boltcall - AI-Powered Lead Capture

A production-ready marketing website for an AI services business built with Vite, React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Design**: Clean, professional UI with brand-focused color scheme
- **Responsive**: Mobile-first design that works on all devices
- **Animations**: Subtle Framer Motion animations for enhanced UX
- **SEO Optimized**: Complete meta tags and structured data
- **Accessibility**: WCAG AA compliant with keyboard navigation
- **Performance**: Optimized for Lighthouse scores ≥95

## 🛠 Tech Stack

- **Frontend**: Vite + React + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Forms**: Custom validation with TypeScript

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Design System

### Brand Colors
- **Primary Blue**: `#2563EB`
- **Dark Blue**: `#1E40AF`
- **Sky Blue**: `#93C5FD`
- **Text Main**: `#0B1220`
- **Text Muted**: `#475569`

### Customization

To change colors, update the `tailwind.config.ts` file:

```typescript
theme: {
  extend: {
    colors: {
      brand: {
        blue: "#YOUR_COLOR",
        blueDark: "#YOUR_DARK_COLOR",
        sky: "#YOUR_SKY_COLOR",
      }
    }
  }
}
```

## 📝 Content Management

### Pricing Plans
Update pricing in `src/components/Pricing.tsx`:

```typescript
const plans = [
  {
    name: 'Starter',
    monthlyPrice: 297,
    annualPrice: 2970,
    setupPrice: 497,
    // ... other properties
  }
];
```

### Copy Updates
- Hero section: `src/components/Hero.tsx`
- Value propositions: `src/components/ValueProps.tsx`
- Features: `src/components/FeaturesTabs.tsx`
- Testimonials: `src/components/Testimonials.tsx`

## 🔧 Supabase Integration

### Current Setup
The project is now integrated with Supabase for authentication and database operations:

- **Authentication**: User signup, login, and session management
- **Database**: Lead submissions and user profiles
- **Real-time**: Auth state changes and session persistence

### Environment Setup

Create a `.env` file in your project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Schema

The following tables are required in your Supabase database:

#### Users Table
```sql
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Leads Table
```sql
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  website TEXT,
  phone TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Authentication Features

- User registration with email verification
- Secure login/logout
- Session persistence
- Real-time auth state updates
- Protected routes


## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically on push

### Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add redirect rules for SPA routing in `public/_redirects`:

```
/*    /index.html   200
```

### Manual Deployment
```bash
# Build the project
npm run build

# Upload the 'dist' folder to your hosting provider
```

## 📱 Mobile Optimization

The website is optimized for:
- **Mobile**: 390px and up
- **Tablet**: 768px and up  
- **Desktop**: 1280px and up

## ♿ Accessibility

- Keyboard navigation support
- Screen reader compatibility
- High contrast ratios (WCAG AA)
- Focus indicators
- Semantic HTML structure

## 🔍 SEO Features

- Meta tags for all pages
- Open Graph tags for social sharing
- Twitter Card support
- Structured data markup
- Sitemap generation (add to public/sitemap.xml)

## 📊 Performance

- Optimized images and assets
- Code splitting with React.lazy
- Minimal bundle size
- Fast loading times
- Lighthouse score ≥95

## 🛡 Security

- Form validation and sanitization
- CSRF protection
- Secure headers
- Environment variable management

## 📞 Support

For questions or support:
- Email: hello@boltcall.ai
- Phone: +1 (555) 123-4567

## 📄 License

© 2024 Boltcall. All rights reserved.