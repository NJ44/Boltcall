import React, { useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Phone, MessageSquare, RotateCw, Bell, Zap, ArrowLeft, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';
import Breadcrumbs from '../components/Breadcrumbs';
import TableOfContents from '../components/TableOfContents';
import { useTableOfContents } from '../hooks/useTableOfContents';

const BlogAIGuideStep1: React.FC = () => {
  const headings = useTableOfContents();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Level 1: Understanding AI for Local Businesses';
    updateMetaDescription('Level 1: Understanding AI for local businesses. Discover what AI can do, how it works, and why it matters. Start learning now.');
    
    // Add Article schema markup
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Level 1: Understanding AI for Local Businesses",
      "description": "Learn what AI can automate for your business, the real benefits, and how it transforms daily operations.",
      "author": {
        "@type": "Organization",
        "name": "Boltcall"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Boltcall",
        "logo": {
          "@type": "ImageObject",
          "url": "https://boltcall.org/boltcall_full_logo.png"
        }
      },
      "datePublished": "2025-02-01",
      "dateModified": "2025-02-01",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://boltcall.org/ai-guide-for-businesses/level-1-understanding-ai"
      },
      "image": {
        "@type": "ImageObject",
        "url": "https://boltcall.org/og-image.jpg"
      }
    };

    const existingScript = document.getElementById('article-schema');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.id = 'article-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(articleSchema);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('article-schema');
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-8 bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
        <div className="max-w-4xl px-4 sm:px-6 lg:px-8" style={{ marginLeft: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left mb-4"
          >
            <Breadcrumbs items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: 'Understanding AI for Local Businesses', href: '/blog/ai-guide-step-1' }
            ]} />
            <Link 
              to="/ai-guide-for-businesses" 
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Guide Overview</span>
            </Link>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight text-left">
              Understanding AI for <span className="text-blue-600">Local Businesses</span>
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>January 20, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>8 min read</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div className="flex gap-8">
          <article className="flex-1 max-w-4xl">
        {/* What AI Can Automate */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-start gap-3">
            <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
            What AI Can Automate for Service Businesses
          </h2>
          
          <div className="space-y-8">
            {/* Calls */}
            <div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Calls</h3>
                  <p className="text-gray-700 leading-relaxed">
                    AI receptionists answer every call, 24/7. They handle inquiries, schedule appointments, 
                    answer common questions, and transfer complex issues to your team. No more missed calls, 
                    no more voicemails that never get returned. Your AI receptionist works around the clock, 
                    ensuring every customer gets immediate attention.
                  </p>
                </div>
              </div>
            </div>

            {/* SMS */}
            <div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">SMS</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Automated SMS booking lets customers schedule appointments via text message. 
                    Your AI agent handles the entire conversation, confirms availability, books the slot, 
                    and sends reminders—all without you lifting a finger. Perfect for customers who prefer 
                    texting over calling.
                  </p>
                </div>
              </div>
            </div>

            {/* Follow-ups */}
            <div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <RotateCw className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Follow-ups</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Keep conversations warm with automated follow-up sequences. Your AI reaches out to leads 
                    at the perfect time, nurtures relationships, and moves prospects through your sales funnel. 
                    Set up multi-touch campaigns that engage leads via SMS, email, or phone—all automatically.
                  </p>
                </div>
              </div>
            </div>

            {/* Reminders */}
            <div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bell className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Reminders</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Reduce no-shows by up to 90% with automated appointment reminders. Your AI sends personalized 
                    reminders via SMS or email, confirming appointments and reducing last-minute cancellations. 
                    Customize timing and messaging to match your business needs.
                  </p>
                </div>
              </div>
            </div>

            {/* Lead Qualification */}
            <div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Lead Qualification</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Instantly qualify leads as they come in. Your AI asks the right questions, determines 
                    urgency, identifies budget, and routes qualified leads directly to your calendar. 
                    No more wasting time on tire-kickers or unqualified inquiries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Benefits Explained Simply */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-start gap-3">
            <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
            Benefits Explained Simply
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1.5">Save Time</h3>
              <p className="text-gray-700 leading-relaxed">
                Automate repetitive tasks and free up 10-15 hours per week. Focus on what you do best 
                while AI handles the routine work.
              </p>
            </div>

            <div>
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1.5">Stop Missing Leads</h3>
              <p className="text-gray-700 leading-relaxed">
                Answer every call, respond to every message instantly. Never lose a lead because you 
                were too busy or it was after hours.
              </p>
            </div>

            <div>
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1.5">Book More Appointments</h3>
              <p className="text-gray-700 leading-relaxed">
                Convert more leads into booked appointments with instant responses and automated follow-ups. 
                Studies show businesses that respond in under 60 seconds book 391% more appointments.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Case Study Style Mini-Stories */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-start gap-3">
            <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
            Real Results from Real Businesses
          </h2>
          
          <div className="space-y-6">
            <div>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong className="text-gray-900">Dental Practice, Chicago:</strong> "We were losing 3-4 patients 
                per week to missed calls. After implementing Boltcall's AI receptionist, we haven't missed a single 
                call in 6 months. Our appointment bookings increased by 28%."
              </p>
            </div>

            <div>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong className="text-gray-900">HVAC Company, Dallas:</strong> "The SMS booking feature changed 
                everything. Our customers love being able to text us at any time. We've reduced no-shows by 85% 
                thanks to automated reminders, and our team saves 12 hours per week on scheduling."
              </p>
            </div>

            <div>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong className="text-gray-900">Auto Repair Shop, Phoenix:</strong> "Before AI, we'd get 20-30 
                calls per day and miss about 40% of them. Now our AI handles everything, qualifies leads, and 
                books appointments. We've increased revenue by $15,000 per month just from capturing leads we 
                used to miss."
              </p>
            </div>
          </div>
        </motion.section>

        {/* Navigation to Next Step */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 pt-8 border-t border-gray-200"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link 
              to="/ai-guide-for-businesses" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Guide Overview</span>
            </Link>
            <Link 
              to="/ai-guide-for-businesses/level-2-choosing-ai-tools" 
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              <span>Next: Level 2 - Choosing the Right AI Tools</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
          </article>
          
          {/* Table of Contents */}
          <TableOfContents headings={headings} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogAIGuideStep1;

