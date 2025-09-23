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

## 🔧 API Integration

### Current Setup
The project includes a mock API for development (`src/server/mockApi.ts`) that logs form submissions to the console.

### Production Integration

**TODO**: Replace mock API with one of these options:

#### Option 1: Supabase
```typescript
// Install: npm install @supabase/supabase-js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// In FinalCTA.tsx, replace handleLeadSubmission with:
const result = await supabase
  .from('leads')
  .insert([formData])
```

#### Option 2: Airtable
```typescript
// Install: npm install airtable
import Airtable from 'airtable'

const base = new Airtable({apiKey: 'YOUR_API_KEY'}).base('YOUR_BASE_ID')

// In FinalCTA.tsx:
const result = await base('Leads').create([formData])
```

#### Option 3: Email Service
```typescript
// Install: npm install @sendgrid/mail
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const msg = {
  to: 'leads@yourcompany.com',
  from: 'noreply@yourcompany.com',
  subject: 'New Lead Submission',
  html: `<p>Name: ${formData.name}</p>...`
}

await sgMail.send(msg)
```

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