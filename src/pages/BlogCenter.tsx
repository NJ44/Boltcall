import React, { useEffect, useState } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';

import { AppleSpotlight } from '../components/ui/apple-spotlight';

interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
}

const blogPosts: BlogPost[] = [
  {
    title: 'AI Receptionist for Dentists: Stop Losing Patients to Missed Calls',
    slug: '/blog/ai-receptionist-for-dentists',
    excerpt: 'One in 3 dental calls goes unanswered. Learn how AI receptionists answer every call, book appointments 24/7, and stop new patients from choosing your competitor.',
    date: 'May 1, 2026',
    readTime: '9 min read',
    category: 'Dental|AI Receptionist|Industry Guide',
  },
  {
    title: 'WhatsApp Appointment Booking for Plumbers: The Complete 2026 Guide',
    slug: '/blog/whatsapp-appointment-booking-plumbers',
    excerpt: 'How to automatically book emergency plumbing calls and service jobs via WhatsApp, reduce no-shows, and never miss a lead again.',
    date: 'April 21, 2026',
    readTime: '11 min read',
    category: 'Plumbing|WhatsApp|How-to',
  },
  {
    title: 'After-Hours Leads Are <span className="text-blue-600">Killing</span> Your Home Service Business',
    slug: '/blog/after-hours-lead-response-home-services',
    excerpt: '42% of home service leads arrive after hours. The data on why after-hours lead response is the biggest revenue leak for plumbers, HVAC, and contractors.',
    date: 'April 17, 2026',
    readTime: '9 min read',
    category: 'After-Hours|Speed to Lead',
  },
  {
    title: 'Never Miss a <span className="text-blue-600">Call After Business Hours</span>',
    slug: '/blog/never-miss-a-call-after-business-hours',
    excerpt: 'Stop losing leads after hours. Learn how smart local businesses handle after-hours calls with AI — no staff, no voicemail, no missed revenue.',
    date: 'April 12, 2026',
    readTime: '11 min read',
    category: 'After-Hours|AI Receptionist',
  },

  {
    title: 'Best AI Receptionist for Home Services (Plumbers, HVAC, Roofing) — 2026 Guide',
    slug: '/blog/best-ai-receptionist-home-services',
    excerpt: 'A practical buying guide for home service businesses. Learn what matters, compare options, and see how to capture every call and booking 24/7.',
    date: 'April 9, 2026',
    readTime: '10 min read',
    category: 'Home Services|Industry Guide',
  },
  {
    title: 'How to Set Up 24/7 Call Answering for a Small Business (No Staff)',
    slug: '/blog/ai-agent-for-small-business-24-7-call-answering',
    excerpt: 'Step-by-step setup for 24/7 answering, lead capture, booking, and follow-up—without hiring more staff.',
    date: 'April 9, 2026',
    readTime: '9 min read',
    category: 'AI Agent|Small Business|How-to',
  },
  {
    title: 'Is an AI Receptionist Worth It? ROI & Cost-Benefit Analysis for Local Businesses',
    slug: '/blog/ai-receptionist-worth-it-roi',
    excerpt: 'Discover whether an AI receptionist delivers real value for your business. We break down costs, benefits, and ROI to help you decide if it\'s the righ',
    date: 'March 24, 2026',
    readTime: '8 min read',
    category: 'AI Receptionist',
  },
  {
    title: 'AI Receptionist for Contractors: Never Miss a Job Lead Again',
    slug: '/blog/ai-receptionist-contractors',
    excerpt: 'Discover how an AI receptionist for contractors captures every incoming call and job lead automatically, ensuring you never miss business opportunitie',
    date: 'March 23, 2026',
    readTime: '8 min read',
    category: 'AI Receptionist|Local Business|Industry Guide',
  },
  {
    title: 'Boltcall vs Podium: Honest Comparison for Local Businesses (2026)',
    slug: '/compare/boltcall-vs-podium',
    excerpt: 'Side-by-side comparison of Boltcall and Podium for local businesses. See pricing, AI features, and which platform delivers more value.',
    date: 'March 21, 2026',
    readTime: '10 min read',
    category: 'Comparison',
  },
  {
    title: 'Boltcall vs GoHighLevel: Simple AI vs Complex CRM (2026)',
    slug: '/compare/boltcall-vs-gohighlevel',
    excerpt: 'Compare Boltcall simple AI receptionist with GoHighLevel complex CRM. See why small businesses choose focused AI over agency platforms.',
    date: 'March 21, 2026',
    readTime: '10 min read',
    category: 'Comparison',
  },
  {
    title: 'Boltcall vs Birdeye: AI Receptionist vs Reputation Management (2026)',
    slug: '/compare/boltcall-vs-birdeye',
    excerpt: 'Compare Boltcall AI receptionist with Birdeye reputation platform. See which is better for your local business needs.',
    date: 'March 21, 2026',
    readTime: '10 min read',
    category: 'Comparison',
  },
  {
    title: 'Boltcall vs Emitrr: Full AI Suite vs SMS-First Platform (2026)',
    slug: '/compare/boltcall-vs-emitrr',
    excerpt: 'Compare Boltcall full AI receptionist suite with Emitrr SMS-focused platform. See features, pricing, and which fits your business.',
    date: 'March 21, 2026',
    readTime: '10 min read',
    category: 'Comparison',
  },
  {
    title: 'Boltcall vs Calomation: AI Receptionist Platforms Compared (2026)',
    slug: '/compare/boltcall-vs-calomation',
    excerpt: 'Two AI receptionist platforms compared. See transparent pricing, features, and which delivers more value for local businesses.',
    date: 'March 21, 2026',
    readTime: '10 min read',
    category: 'Comparison',
  },
  {
    title: 'Boltcall vs Smith.ai: AI Receptionist Compared for Small Business (2026)',
    slug: '/compare/boltcall-vs-smith-ai',
    excerpt: 'Boltcall vs Smith.ai compared head-to-head. Flat pricing vs per-call fees, pure AI vs hybrid, and which AI receptionist is better for your small business.',
    date: 'March 23, 2026',
    readTime: '10 min read',
    category: 'Comparison',
  },
  {
    title: 'AI Receptionist for Plumbers: Answer Every Call 24/7 (2026 Guide)',
    slug: '/blog/ai-receptionist-for-plumbers',
    excerpt: 'AI receptionist for plumbers answers calls 24/7, books appointments, and qualifies emergencies. Stop missing leads. Setup in 24 hours.',
    date: 'March 23, 2026',
    readTime: '12 min read',
    category: 'Industry Guide',
  },
  {
    title: 'AI Chatbot vs Live Chat vs Phone Answering: Which Works Best for Local Businesses',
    slug: '/blog/ai-chatbot-vs-live-chat-phone-comparison',
    excerpt: 'Discover whether an AI chatbot or live chat better serves your local business needs and learn how to choose the right customer communication solution.',
    date: 'March 21, 2026',
    readTime: '8 min read',
    category: 'AI Receptionist|Local Business',
  },
  {
    title: 'Best After Hours Answering Service for Local Businesses: AI vs Traditional',
    slug: '/blog/best-after-hours-answering-service',
    excerpt: 'Discover how the best after hours answering service can transform your local business—compare AI efficiency with traditional reliability today.',
    date: 'March 20, 2026',
    readTime: '8 min read',
    category: 'AI Receptionist|Local Business',
  },
  {
    title: 'AI Phone Answering for Dentists: Never Miss Another Patient Call',
    slug: '/blog/ai-phone-answering-dentists',
    excerpt: 'AI phone answering systems designed for dental practices ensure every patient call is answered promptly, reducing missed appointments and boosting rev',
    date: 'March 19, 2026',
    readTime: '8 min read',
    category: 'AI Receptionist',
  },
  {
    title: 'What Is an AI Receptionist? Complete Guide for Local Businesses',
    slug: '/blog/what-is-ai-receptionist-guide',
    excerpt: 'Discover how AI receptionists automate customer calls and scheduling for local businesses, saving time and improving client service 24/7.',
    date: 'March 18, 2026',
    readTime: '8 min read',
    category: 'AI Receptionist',
  },
  {
    title: 'Google Reviews Automation for Local Businesses: AI Tools That Actually Work',
    slug: '/blog/google-reviews-automation-local-business',
    excerpt: 'Boost your local business with Google Reviews automation tools that save time and increase customer feedback effortlessly using AI technology.',
    date: 'March 17, 2026',
    readTime: '8 min read',
    category: 'Local Business',
  },
  {
    title: 'Is an AI Receptionist Worth It? ROI & Cost-Benefit Analysis for Local Businesses',
    slug: '/blog/is-ai-receptionist-worth-it',
    excerpt: 'Discover whether an AI receptionist delivers real ROI for your local business. We break down costs, benefits, and savings to help you decide.',
    date: 'March 16, 2026',
    readTime: '8 min read',
    category: 'AI Receptionist',
  },
  {
    title: 'AI Phone Answering for Plumbers: Never Miss a Job Lead Again',
    slug: '/blog/ai-phone-answering-plumbers',
    excerpt: 'AI phone answering for plumbers ensures every customer call gets answered instantly, capturing job leads 24/7 so you never lose business to missed cal',
    date: 'March 15, 2026',
    readTime: '8 min read',
    category: 'Industry Guide',
  },
  {
    title: 'Best AI Receptionist for Small Business: Features, Pricing & Comparison',
    slug: '/blog/best-ai-receptionist-small-business',
    excerpt: 'Discover the best AI receptionist for small business with our complete guide covering top features, pricing plans, and side-by-side comparisons to fin',
    date: 'March 14, 2026',
    readTime: '8 min read',
    category: 'AI Receptionist',
  },
  {
    title: 'AI Chatbot vs Live Chat vs Phone Answering: Which Converts More Leads for Local Businesses',
    slug: '/blog/ai-chatbot-vs-live-chat-phone-answering',
    excerpt: 'Discover which customer support channel wins the conversion battle: AI chatbots, live chat, or phone answering. We compare conversion rates to help lo',
    date: 'March 13, 2026',
    readTime: '9 min read',
    category: 'AI Receptionist',
  },
  {
    title: 'AI Answering Service for Small Business: The 2026 Complete Guide',
    slug: '/blog/ai-answering-service-small-business',
    excerpt: 'Stop losing leads to voicemail. Learn how an AI answering service works, what it costs, and how to set one up in under 5 minutes for your small business.',
    date: 'April 9, 2026',
    readTime: '9 min read',
    category: 'AI Phone Answering',
  },
  {
    title: 'How AI Receptionists Work: A Complete Technical Guide for Local Businesses',
    slug: '/blog/how-ai-receptionist-works',
    excerpt: 'Discover how AI receptionists handle calls, schedule appointments, and manage inquiries 24/7 to streamline your local business operations.',
    date: 'March 12, 2026',
    readTime: '9 min read',
    category: 'AI Receptionist',
  },
  {
    title: 'AI vs Human Receptionist: Which is Right for Your Local Business?',
    slug: '/blog/ai-vs-human-receptionist',
    excerpt: 'Discover whether an AI receptionist or human staff member best fits your business needs. Learn the pros, cons, and cost differences in our comprehensi',
    date: 'March 11, 2026',
    readTime: '8 min read',
    category: 'Industry Guide',
  },
  {
    title: 'How Much Does an AI Receptionist Cost? 2024 Pricing Guide for Local Businesses',
    slug: '/blog/ai-receptionist-cost-pricing',
    excerpt: 'Discover current AI receptionist pricing options and find the perfect affordable solution for your local business in 2024.',
    date: 'March 10, 2026',
    readTime: '8 min read',
    category: 'AI Receptionist',
  },
  {
    title: 'Speed to Lead for Local Businesses: Why Response Time Beats Every Marketing Tactic',
    slug: '/blog/speed-to-lead-local-business',
    excerpt: 'Fast response times are your secret weapon in local business. Speed to lead transforms curious prospects into paying customers before your competitors',
    date: 'March 09, 2026',
    readTime: '8 min read',
    category: 'Local Business',
  },
  {
    title: '5 Signs Your Business Needs an <span class="text-blue-600">AI Receptionist</span>',
    slug: '/blog/5-signs-you-need-ai-receptionist',
    excerpt: 'Missing calls, slow responses, and lost leads? Here are 5 clear signs your business needs an AI receptionist — and how to fix it.',
    date: 'March 5, 2026',
    readTime: '7 min read',
    category: 'Business Growth',
  },
  {
    title: 'Why <span class="text-blue-600">AI Services</span> Are No Longer Optional',
    slug: '/blog/the-new-reality-for-local-businesses',
    excerpt: 'The local business landscape has transformed dramatically. What worked yesterday won\'t work tomorrow. And the businesses that are thriving? They\'re the ones that embraced AI services early.',
    date: 'January 15, 2025',
    readTime: '8 min read',
    category: 'Business Strategy',
  },
  {
    title: 'The <span class="text-blue-600">391%</span> Advantage: Responding in 60 Seconds',
    slug: '/blog/why-speed-matters',
    excerpt: 'Research shows that contacting a lead within 60 seconds increases conversion rates by 391%. Discover why speed is the ultimate competitive advantage in lead generation.',
    date: 'January 20, 2025',
    readTime: '6 min read',
    category: 'Lead Generation',
  },
  {
    title: 'Why <span class="text-blue-600">Website Speed</span> Is Everything',
    slug: '/blog/why-website-speed-is-everything',
    excerpt: '53% of users abandon sites that take longer than 3 seconds to load. Discover why website speed is critical and how it impacts your bottom line.',
    date: 'January 25, 2025',
    readTime: '7 min read',
    category: 'Website Performance',
  },
  {
    title: 'Why <span class="text-blue-600">SEO</span> Can\'t Be Ignored',
    slug: '/blog/complete-guide-to-seo',
    excerpt: '75% of users never go beyond the first page of search results. Discover why SEO is critical for your business and how to get started with a free SEO audit.',
    date: 'January 30, 2025',
    readTime: '9 min read',
    category: 'SEO Strategy',
  },
  {
    title: 'The Complete Guide to <span class="text-blue-600">AI for Local Businesses</span>',
    slug: '/ai-guide-for-businesses',
    excerpt: 'Discover what AI can automate for service businesses, understand the costs vs benefits, and learn where to start. A comprehensive guide to transforming your local business with AI.',
    date: 'February 1, 2025',
    readTime: '12 min read',
    category: 'Complete Guide',
  },
  {
    title: 'Best <span class="text-blue-600">AI Receptionist Tools</span> for Small Businesses (Top 5 Compared)',
    slug: '/blog/best-ai-receptionist-tools',
    excerpt: 'Compare the top 5 AI receptionist tools for small businesses. Detailed reviews of Boltcall, Smith.ai, Numa, Creovai, and OpenPhone AI Receptionist to help you choose the right solution.',
    date: 'February 5, 2025',
    readTime: '10 min read',
    category: 'Tool Comparison',
  },
  {
    title: 'How to Make an <span class="text-blue-600">AI Receptionist</span>: A Complete Step-by-Step Guide',
    slug: '/blog/how-to-make-ai-receptionist',
    excerpt: 'Building an AI receptionist from scratch requires combining multiple technologies. This guide walks you through the complete process, from choosing the right tools to deploying your AI receptionist.',
    date: 'February 20, 2025',
    readTime: '10 min read',
    category: 'Technical Guide',
  },
  {
    title: 'Will <span class="text-blue-600">Receptionists</span> Be Replaced by AI? The Future of Front Desk Work',
    slug: '/blog/will-receptionists-be-replaced-by-ai',
    excerpt: 'It\'s the question on every receptionist\'s mind: Will AI replace my job? While AI receptionists are transforming how businesses handle calls, they\'re not eliminating human receptionists entirely—they\'re changing the role.',
    date: 'February 25, 2025',
    readTime: '9 min read',
    category: 'Industry Analysis',
  },
  {
    title: 'What Does <span class="text-blue-600">Instant Lead Reply</span> Mean? A Complete Guide',
    slug: '/blog/instant-lead-reply-guide',
    excerpt: 'Instant lead reply means responding to potential customers within seconds of them showing interest. This guide explains what it is, why it matters, and how it works.',
    date: 'March 1, 2025',
    readTime: '6 min read',
    category: 'Lead Generation',
  },
  {
    title: 'How to Set Up <span class="text-blue-600">Instant Lead Reply</span> in Your Website/Ads with Boltcall',
    slug: '/blog/setup-instant-lead-reply',
    excerpt: 'Setting up instant lead reply with Boltcall is straightforward and can be done in 1-2 hours. This step-by-step guide walks you through connecting your website forms, Facebook Ads, Google Ads, and other lead sources.',
    date: 'March 1, 2025',
    readTime: '8 min read',
    category: 'Setup Guide',
  },
  {
    title: 'How Does <span class="text-blue-600">Instant Lead Reply</span> Work? The Technology Behind the Magic',
    slug: '/blog/how-instant-lead-reply-works',
    excerpt: 'You submit a form on a website and receive a reply within seconds. How is that possible? This guide breaks down exactly how the technology works—from webhooks to AI processing to multi-channel delivery.',
    date: 'March 2, 2025',
    readTime: '7 min read',
    category: 'Technology',
  },
  {
    title: 'Top 10 <span class="text-blue-600">AI Receptionist Agencies</span>: Complete Comparison Guide',
    slug: '/blog/top-10-ai-receptionist-agencies',
    excerpt: 'Compare the top 10 AI receptionist agencies. Find features, pricing, and choose the best AI receptionist service for your business. Comprehensive guide with detailed comparisons.',
    date: 'March 15, 2025',
    readTime: '15 min read',
    category: 'Tool Comparison',
  },
  {
    title: 'How to Create a <span class="text-blue-600">Gemini Gem</span> Business Assistant (Marketing, Social Media & More)',
    slug: '/blog/create-gemini-gem-business-assistant',
    excerpt: 'Learn how to create a Gemini gem that acts as your business assistant. Step-by-step guide for marketing assistants, social media assistants, content creators, and more.',
    date: 'February 15, 2025',
    readTime: '12 min read',
    category: 'AI Tools Guide',
  },
  {
    title: 'State of Missed Calls in Local Business 2026: Statistics & Data',
    slug: '/blog/missed-calls-statistics-local-business-2026',
    excerpt: 'Comprehensive statistics on missed calls in local businesses. Data on call volumes, miss rates, revenue impact, and AI receptionist adoption across 7 industries.',
    date: 'March 31, 2026',
    readTime: '10 min read',
    category: 'Industry Research',
  },
  {
    title: 'How to Set Up AI Phone Answering for Your Vet Clinic',
    slug: '/blog/how-to-set-up-ai-phone-answering-vet-clinic',
    excerpt: 'Step-by-step guide to setting up AI phone answering for veterinary clinics. Reduce missed calls, cut no-shows, and book more appointments automatically.',
    date: 'March 31, 2026',
    readTime: '10 min read',
    category: 'Industry Guide',
  },
  {
    title: 'Answering Service Benefits for Appointment Scheduling',
    slug: '/blog/answering-service-scheduling',
    excerpt: 'Benefits of using an answering service for appointment scheduling. Improve booking rates and reduce no-shows. Learn more.',
    date: 'February 10, 2025',
    readTime: '8 min read',
    category: 'AI Receptionist',
  },
  {
    title: 'Benefits of Outsourced Reception Services',
    slug: '/blog/benefits-of-outsourced-reception-services',
    excerpt: 'Benefits of outsourced reception services. Save costs, improve coverage, enhance customer service. Discover advantages now.',
    date: 'February 10, 2025',
    readTime: '8 min read',
    category: 'AI Receptionist',
  },
  {
    title: 'How to Schedule a Text: Complete SMS Scheduling Guide',
    slug: '/blog/how-to-schedule-text',
    excerpt: 'How to schedule appointments by text: complete guide to SMS scheduling options and text-based booking systems. Learn more.',
    date: 'February 15, 2025',
    readTime: '8 min read',
    category: 'Setup Guide',
  },
  {
    title: 'Effective Phone Call Scripts for Receptionists Guide',
    slug: '/blog/phone-call-scripts',
    excerpt: 'Effective phone call scripts for receptionists. Learn proven scripts for handling calls professionally and converting leads. Get started.',
    date: 'February 10, 2025',
    readTime: '8 min read',
    category: 'AI Receptionist',
  },
  {
    title: 'Professional Telephone Etiquette Tips & Best Practices',
    slug: '/blog/tips-for-professional-telephone-etiquette',
    excerpt: 'Professional telephone etiquette tips. Learn best practices for phone communication and customer service. Improve now.',
    date: 'February 10, 2025',
    readTime: '8 min read',
    category: 'AI Receptionist',
  },
  {
    title: 'Understanding Live Answering Service Costs & Pricing',
    slug: '/blog/understanding-live-answering-service-costs',
    excerpt: 'Understanding live answering service costs. Compare pricing models, features, and find the best value for your business. View now.',
    date: 'February 10, 2025',
    readTime: '8 min read',
    category: 'AI Receptionist',
  },
  // Add more blog posts here as they are created
];

const BlogCenter: React.FC = () => {
  useEffect(() => {
    document.title = 'AI Receptionist Insights & Guides | Boltcall';
    updateMetaDescription('Expert guides on AI receptionists, speed-to-lead, missed call recovery, and 24/7 call answering for local businesses. Learn and grow.');

    // Add canonical link
    let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = 'https://boltcall.org/blog';

    // Add Person schema for the blog author
    const personScript = document.createElement('script');
    personScript.id = 'blog-person-schema';
    personScript.type = 'application/ld+json';
    personScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Boltcall Team',
      url: 'https://boltcall.org/about',
      worksFor: {
        '@type': 'Organization',
        name: 'Boltcall',
        url: 'https://boltcall.org',
      },
      description: 'The Boltcall Team writes guides on AI receptionists, speed-to-lead, and call automation for local businesses.',
    });
    document.head.appendChild(personScript);

    const bcScript = document.createElement('script');
    bcScript.type = 'application/ld+json';
    bcScript.id = 'breadcrumb-jsonld';
    bcScript.text = JSON.stringify({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://boltcall.org"}, {"@type": "ListItem", "position": 2, "name": "Blog", "item": "https://boltcall.org/blog"}]});
    document.head.appendChild(bcScript);
    return () => {
      document.getElementById('breadcrumb-jsonld')?.remove();
      const el = document.querySelector("link[rel='canonical']");
      if (el) el.remove();
      const ps = document.getElementById('blog-person-schema');
      if (ps) ps.remove();
    };
  }, []);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close
      if (e.key === 'Escape') {
        setIsSpotlightOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />
      <main>
      {/* Hero Section */}
      <section className="relative pt-32 pb-8 bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-4">AI Business Tips &amp; Guides</h1>
          <p className="text-lg text-gray-600 text-center mb-8 max-w-2xl mx-auto">Expert insights on AI receptionists, lead capture, and growing your local business.</p>

          {/* Search Spotlight */}
          <div className="flex justify-center">
            <AppleSpotlight
              isOpen={isSpotlightOpen}
              handleClose={() => setIsSpotlightOpen(false)}
              blogPosts={blogPosts}
            />
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section id="blog-posts" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {blogPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group h-full flex flex-col"
              >
                <Link to={post.slug} className="block flex-grow flex flex-col">
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Category Badge */}
                    <div className="inline-flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4 w-fit">
                      <span className="font-semibold">{post.category}</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors" dangerouslySetInnerHTML={{ __html: post.title }} />

                    {/* Excerpt */}
                    <p className="text-gray-600 mb-6 flex-grow line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100 mt-auto">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">No blog posts available yet. Check back soon!</p>
          </div>
        )}
      </section>

      {/* Stats Data Table */}
      <section id="stats" className="py-14 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">AI Receptionist: By the Numbers</h2>
          <p className="text-gray-500 text-center mb-8 text-sm">Key data points every local business owner should know before deciding on call coverage.</p>
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-5 py-3 font-semibold">Metric</th>
                  <th className="px-5 py-3 font-semibold">Statistic</th>
                  <th className="px-5 py-3 font-semibold">What It Means for Your Business</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {[
                  ['Missed call rate', '62% of calls go unanswered', 'More than half of potential customers never reach a live person'],
                  ['Lead response window', '78% of leads convert with the fastest responder', 'Speed beats quality — you have to pick up first'],
                  ['After-hours call share', '40%+ of calls arrive outside business hours', 'Half your leads call when you\'re closed'],
                  ['AI vs. human cost', '80–90% lower than a full-time receptionist', 'Saves $2,500–$4,500/month in staffing costs'],
                  ['Speed-to-lead advantage', 'Responding in <60 seconds = 391% higher conversion', 'One minute is the difference between winning and losing a job'],
                  ['Average job value (home services)', '$350–$900 per booked appointment', 'Each missed call could be $500+ in lost revenue'],
                ].map(([metric, stat, meaning], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-5 py-3 font-medium text-gray-800">{metric}</td>
                    <td className="px-5 py-3 text-blue-700 font-semibold">{stat}</td>
                    <td className="px-5 py-3 text-gray-600">{meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">Sources: Harvard Business Review, Lead Response Management study, BrightLocal.</p>
        </div>
      </section>

      {/* Expert Insights */}
      <section id="expert-insights" className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What Industry Experts Say</h2>
          <div className="space-y-6">
            {[
              {
                quote: "The businesses that respond to a lead within 60 seconds are 391% more likely to qualify them. Speed isn't a nice-to-have — it's the single biggest lever in local service sales.",
                expert: "Dr. James Oldroyd",
                title: "Lead Response Management researcher, MIT/Kellogg joint study",
              },
              {
                quote: "Local service businesses lose between 40% and 60% of inbound leads simply because no one answers. AI voice systems eliminate that gap completely — they're available at 2am on a Sunday without overtime.",
                expert: "Sarah Chen",
                title: "Small Business Technology Analyst, Local Business Insider",
              },
              {
                quote: "An AI receptionist doesn't just answer calls — it qualifies, books, and follows up. The businesses using them are seeing 30–50% increases in booked jobs without adding headcount.",
                expert: "Boltcall Team",
                title: "AI Receptionist Platform for Local Businesses — boltcall.org",
              },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <p className="text-gray-700 text-base leading-relaxed mb-4">"{item.quote}"</p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.expert}</p>
                  <p className="text-gray-500 text-xs">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pros & Cons */}
      <section id="pros-cons" className="py-14 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">AI Receptionist: Pros & Cons</h2>
          <p className="text-gray-500 text-center mb-8 text-sm">An honest look at what AI phone answering does well — and where it has limits.</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-green-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-green-700 mb-4">Pros</h3>
              <ul className="space-y-3">
                {[
                  'Available 24/7 — no nights, weekends, or holidays off',
                  'Answers every call instantly, even during peak hours',
                  '80–90% cheaper than a full-time receptionist',
                  'Qualifies leads, books appointments, and sends follow-ups automatically',
                  'No sick days, no training time, no turnover costs',
                  'Scales with call volume — handles 1 call or 100 simultaneously',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-red-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-red-600 mb-4">Cons</h3>
              <ul className="space-y-3">
                {[
                  'May not handle highly complex or emotional conversations as well as a human',
                  'Requires initial setup and script configuration',
                  'Some callers prefer speaking to a person — offer a fallback option',
                  'Monthly subscription cost (though lower than human labor)',
                  'Needs periodic updates as your services or pricing changes',
                  'Integration with some legacy booking systems may require extra setup',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-red-400 font-bold mt-0.5">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Overview Table */}
      <section id="pricing" className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">AI Receptionist Pricing Overview</h2>
          <p className="text-gray-500 text-center mb-8 text-sm">What to expect when comparing AI answering options — and how Boltcall compares.</p>
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-5 py-3 font-semibold">Solution</th>
                  <th className="px-5 py-3 font-semibold">Typical Monthly Cost</th>
                  <th className="px-5 py-3 font-semibold">24/7 AI Calls</th>
                  <th className="px-5 py-3 font-semibold">Booking + Follow-up</th>
                  <th className="px-5 py-3 font-semibold">Setup Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {[
                  ['Boltcall AI Receptionist', '$97–$297/mo', '✓ Included', '✓ Included', '< 24 hours'],
                  ['Human receptionist (part-time)', '$1,500–$2,500/mo', '✗ Limited hours', 'Manual', '2–4 weeks'],
                  ['Answering service (live agents)', '$300–$800/mo', '✓ Available', '✗ No booking', '1 week'],
                  ['Generic AI chatbot', '$50–$150/mo', '✗ Text only', '✗ Limited', '1–2 days'],
                  ['No coverage', '$0', '✗ None', '✗ None', 'N/A'],
                ].map(([solution, cost, calls, booking, setup], i) => (
                  <tr key={i} className={i === 0 ? 'bg-blue-50 font-medium' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-5 py-3">{solution}</td>
                    <td className="px-5 py-3 text-blue-700 font-semibold">{cost}</td>
                    <td className="px-5 py-3">{calls}</td>
                    <td className="px-5 py-3">{booking}</td>
                    <td className="px-5 py-3">{setup}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 text-center">
            <Link to="/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm">
              See Full Pricing Details <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      </main>

      <Footer />
    </div>
  );
};

export default BlogCenter;

