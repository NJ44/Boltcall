import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'boltcall_icon.png',
        'boltcall_full_logo.png',
        'apple-touch-icon-180x180.png',
        'robots.txt',
      ],
      manifest: {
        name: 'Boltcall - AI Receptionist',
        short_name: 'Boltcall',
        description: 'AI receptionist for local businesses. Never miss a call or lead.',
        theme_color: '#2563EB',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/dashboard',
        categories: ['business', 'productivity'],
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        globIgnores: ['**/*.lottie', '**/Loading_animation_blue.json', '**/retell-voices.json'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/auth\/.*/i,
            handler: 'NetworkOnly',
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60,
              },
              networkTimeoutSeconds: 10,
            },
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/realtime\/.*/i,
            handler: 'NetworkOnly',
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^\/.netlify\/functions\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'netlify-functions',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 5 * 60,
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [
          /^\/api/,
          /^\/.netlify/,
          /^\/auth\/callback/,
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // React core — shared by everything, cache-friendly as its own chunk
            if (id.includes('react-dom')) return 'react-dom';
            if (id.includes('react-router')) return 'react-router';
            // Heavy animation libs — split so they only load when lazy components need them
            if (id.includes('framer-motion')) return 'framer-motion';
            if (id.includes('@lottiefiles') || id.includes('lottie')) return 'lottie';
            // Radix UI primitives — used broadly but heavy together
            if (id.includes('@radix-ui')) return 'radix';
            // Supabase client
            if (id.includes('@supabase')) return 'supabase';
            // Charts — only used in analytics dashboard
            if (id.includes('recharts')) return 'recharts';
            // i18n
            if (id.includes('i18next')) return 'i18n';
            // React Hook Form + Zod — only used in forms/setup
            if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) return 'forms';
            // Lucide icons — tree-shaken but still sizeable
            if (id.includes('lucide-react')) return 'icons';
          }
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
