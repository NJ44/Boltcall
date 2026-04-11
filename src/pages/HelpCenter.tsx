import React, { useState, useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { motion } from 'framer-motion';
import { Search, BookOpen, AlertTriangle, Phone, HelpCircle, ArrowRight, FileText, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  articleCount: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = 'Help Center - Support & Documentation | Boltcall';
    updateMetaDescription('Boltcall help center with support articles, FAQs, and documentation. Find answers to common questions about AI receptionist. Get help.');
  }, []);

  const helpCategories: HelpCategory[] = [
    {
      id: 'getting-started',
      title: 'Step-by-Step Guide to Setting Up Your AI Receptionist',
      description: 'How to setup and best settings for customers to get started with Boltcall',
      articleCount: 5,
      icon: <BookOpen className="w-8 h-8" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'known-issues',
      title: 'Comprehensive Troubleshooting for Call Quality Issues',
      description: 'A place for all known issues that the team is working on fixing and work arounds for the time being.',
      articleCount: 4,
      icon: <AlertTriangle className="w-8 h-8" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      id: 'phone-setup',
      title: 'How to Configure Phone Numbers and Verified Caller ID',
      description: 'Phone numbers and Verified Call ID',
      articleCount: 8,
      icon: <Phone className="w-8 h-8" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 'how-to-guides',
      title: 'Practical How-To Guides for Every Boltcall Feature',
      description: 'How to Guides that you might need',
      articleCount: 11,
      icon: <HelpCircle className="w-8 h-8" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const popularArticles = [
    {
      id: '1',
      title: 'Setting up your first AI agent',
      category: 'Getting Started',
      readTime: '5 min read',
      views: '1.2k views'
    },
    {
      id: '2',
      title: 'Troubleshooting call quality issues',
      category: 'Known Issues',
      readTime: '3 min read',
      views: '890 views'
    },
    {
      id: '3',
      title: 'Configuring phone numbers',
      category: 'Phone Setup',
      readTime: '7 min read',
      views: '756 views'
    },
    {
      id: '4',
      title: 'Creating custom voice prompts',
      category: 'How To Guides',
      readTime: '4 min read',
      views: '623 views'
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality
    // TODO: implement search functionality
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Help Center - Support & Documentation | Boltcall",
    "description": "Boltcall help center with support articles, FAQs, and documentation. Find answers to common questions about AI receptionist setup, phone configuration, and troubleshooting.",
    "url": "https://boltcall.org/help-center",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Boltcall",
      "url": "https://boltcall.org"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://boltcall.org" },
        { "@type": "ListItem", "position": 2, "name": "Help Center", "item": "https://boltcall.org/help-center" }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* JSON-LD WebPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">How can we help?</h1>
            <p className="text-xl text-gray-600 mb-8">Find answers, guides, and solutions to get the most out of Boltcall</p>
            
            {/* Search Input */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="Search for help articles, guides, or solutions..."
                />
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Intro paragraph */}
        <p className="text-gray-600 text-center max-w-4xl mx-auto mb-12 text-lg leading-relaxed">
          This Help Center provides essential guides and troubleshooting tips to help users effectively utilize Boltcall's AI receptionist features and resolve common issues.
        </p>

        {/* Documentation CTA */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-12"
        >
          <Link
            to="/documentation"
            className="group block rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-xl shadow-blue-600/10 transition hover:brightness-[1.03]"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Open Boltcall Documentation</h2>
                  <p className="mt-1 text-white/85">
                    Step-by-step setup guides, integrations, features, troubleshooting, and best practices.
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 self-start rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 md:self-auto">
                Go to Documentation
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Help Categories */}
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl font-bold text-gray-900 mb-8 text-center"
          >
            Essential Guides for Setting Up Your AI Receptionist
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {helpCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow cursor-pointer group"
              >
                <div className="flex items-start gap-6">
                  <div className={`w-16 h-16 ${category.bgColor} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <div className={category.color}>
                      {category.icon}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {category.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FileText className="w-4 h-4" />
                        <span>{category.articleCount} articles</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-blue-600 group-hover:gap-2 transition-all">
                        <span className="text-sm font-medium">Browse</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Top Troubleshooting Articles for Call Quality Issues
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popularArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>{article.category}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{article.views}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Links – Related Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Related Resources</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { label: 'Documentation', to: '/documentation' },
              { label: 'About Boltcall', to: '/about' },
              { label: 'Pricing', to: '/pricing' },
              { label: 'Contact Us', to: '/contact' },
              { label: 'AI Receptionist', to: '/features/ai-receptionist' },
            ].map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-blue-400 hover:text-blue-600 hover:shadow-md"
              >
                <ArrowRight className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* What You'll Find Here */}
        <div className="mt-16 mb-10 bg-white rounded-xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What You'll Find in This Help Center</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            This Help Center is organized into four core areas so you can quickly find the answer you need — whether you're just getting started, configuring your AI receptionist, or running into a technical issue.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {[
              {
                title: 'Getting Started',
                desc: 'Step-by-step guides for setting up your Boltcall account, connecting your phone number, and launching your AI receptionist for the first time. Most businesses are live within 30 minutes.',
              },
              {
                title: 'AI Receptionist Setup',
                desc: 'Configure your AI's voice, script, business hours, and call-handling rules. Learn how to customize responses for your specific services and frequently asked questions.',
              },
              {
                title: 'Appointment Booking & SMS',
                desc: 'Connect your calendar, set booking rules, and configure SMS follow-up sequences. Covers Google Calendar, Calendly, and direct booking integrations.',
              },
              {
                title: 'Billing & Account',
                desc: 'Manage your subscription, update payment methods, and understand your plan limits. Includes guidance on upgrading, downgrading, and canceling.',
              },
            ].map((item) => (
              <div key={item.title} className="flex flex-col gap-1 p-4 bg-gray-50 rounded-lg">
                <span className="font-semibold text-gray-900">{item.title}</span>
                <span className="text-sm text-gray-600 leading-relaxed">{item.desc}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-6 leading-relaxed">
            Can't find what you need? Our support team responds to all inquiries within 2 business hours Monday–Friday, 9am–6pm ET. Use the Contact Support button below to reach us directly.
          </p>
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-10 bg-blue-50 rounded-xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still need help?</h2>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our support team is here to help you succeed.
            You can also explore{' '}
            <a
              href="https://www.nngroup.com/articles/contact-us-pages/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
            >
              best practices for reaching support teams
            </a>{' '}
            or review the{' '}
            <a
              href="https://www.twilio.com/docs/voice/tutorials"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
            >
              Twilio Voice documentation
            </a>{' '}
            for telephony-related questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Contact Support
            </Link>
            <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Schedule a Call
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpCenter;
