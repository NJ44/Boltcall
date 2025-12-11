import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { updateMetaDescription } from '../lib/utils';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';

const Sitemap: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Sitemap | Boltcall';
    updateMetaDescription('Complete sitemap of all pages on Boltcall. Find features, blog posts, tools, and resources.');
  }, []);

  const sitemapStructure = {
    main: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Contact', href: '/contact' },
    ],
    features: [
      { label: 'AI Receptionist', href: '/features/ai-receptionist' },
      { label: 'Instant Form Reply', href: '/features/instant-form-reply' },
      { label: 'SMS Booking Assistant', href: '/features/sms-booking-assistant' },
      { label: 'Automated Reminders', href: '/features/automated-reminders' },
      { label: 'AI Follow-Up System', href: '/features/ai-follow-up-system' },
      { label: 'Website Chat/Voice Widget', href: '/features/website-widget' },
      { label: 'Lead Reactivation', href: '/features/lead-reactivation' },
      { label: 'Smart Website', href: '/features/smart-website' },
    ],
    resources: {
      content: [
        { label: 'Blog', href: '/blog' },
        { label: 'AI Guide for Businesses', href: '/blog/ai-guide-for-businesses' },
        { label: 'Comparisons', href: '/comparisons' },
        { label: 'Newsletter', href: '/newsletter' },
      ],
      tools: [
        { label: 'SEO Audit', href: '/seo-audit' },
        { label: 'Speed Test', href: '/speed-test' },
        { label: 'AI Revenue Audit', href: '/ai-revenue-calculator' },
        { label: 'Website Optimiser', href: '/conversion-rate-optimizer' },
        { label: 'AI Visibility Check', href: '/ai-visibility-check' },
      ],
    },
    blog: {
      guides: [
        { label: 'The New Reality for Local Businesses', href: '/blog/the-new-reality-for-local-businesses' },
        { label: 'Why Speed Matters', href: '/blog/why-speed-matters' },
        { label: 'Why Website Speed Is Everything', href: '/blog/why-website-speed-is-everything' },
        { label: 'Complete Guide to SEO', href: '/blog/complete-guide-to-seo' },
        { label: 'AI Guide for Businesses', href: '/blog/ai-guide-for-businesses' },
      ],
      aiReceptionist: [
        { label: 'How AI Receptionist Works', href: '/blog/how-ai-receptionist-works' },
        { label: 'Is AI Receptionist Worth It?', href: '/blog/is-ai-receptionist-worth-it' },
        { label: 'How to Make AI Receptionist', href: '/blog/how-to-make-ai-receptionist' },
        { label: 'Will Receptionists Be Replaced by AI?', href: '/blog/will-receptionists-be-replaced-by-ai' },
        { label: 'Top 10 AI Receptionist Agencies', href: '/blog/top-10-ai-receptionist-agencies' },
      ],
      leadGeneration: [
        { label: 'What Does Instant Lead Reply Mean?', href: '/blog/what-does-instant-lead-reply-mean' },
        { label: 'How to Set Up Instant Lead Reply', href: '/blog/setup-instant-lead-reply' },
        { label: 'How Does Instant Lead Reply Work?', href: '/blog/how-instant-lead-reply-works' },
        { label: 'How to Schedule Text', href: '/blog/how-to-schedule-text' },
      ],
    },
    comparisons: [
      { label: 'Traditional Call Centers vs Boltcall', href: '/comparisons/call-centers-vs-boltcall' },
      { label: 'Receptionist vs Boltcall', href: '/comparisons/receptionist-vs-boltcall' },
      { label: 'Voicemail vs Boltcall', href: '/comparisons/voicemail-vs-boltcall' },
      { label: 'Answering Services vs Boltcall', href: '/comparisons/answering-services-vs-boltcall' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
      { label: 'Help Center', href: '/help-center' },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sitemap</h1>
          <p className="text-lg text-gray-600">
            Find all pages and resources on Boltcall. Use this sitemap to navigate our website.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Main Pages */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Main Pages</h2>
            <ul className="space-y-2">
              {sitemapStructure.main.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Features */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
            <ul className="space-y-2">
              {sitemapStructure.features.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Resources - Content */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Resources - Content</h2>
            <ul className="space-y-2">
              {sitemapStructure.resources.content.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Resources - Tools */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Resources - Free Tools</h2>
            <ul className="space-y-2">
              {sitemapStructure.resources.tools.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Blog - Guides */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog - Guides</h2>
            <ul className="space-y-2">
              {sitemapStructure.blog.guides.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Blog - AI Receptionist */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog - AI Receptionist</h2>
            <ul className="space-y-2">
              {sitemapStructure.blog.aiReceptionist.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Blog - Lead Generation */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog - Lead Generation</h2>
            <ul className="space-y-2">
              {sitemapStructure.blog.leadGeneration.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Comparisons */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Comparisons</h2>
            <ul className="space-y-2">
              {sitemapStructure.comparisons.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Legal */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Legal & Support</h2>
            <ul className="space-y-2">
              {sitemapStructure.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sitemap;

