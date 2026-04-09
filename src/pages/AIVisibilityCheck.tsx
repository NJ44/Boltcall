import React, { useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { motion } from 'framer-motion';
import { Eye, CheckCircle, Search, Bot, Globe, BarChart3 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';

const AIVisibilityCheck: React.FC = () => {
  useEffect(() => {
    document.title = 'Free AI Visibility Check - Analyze Your AI Presence';
    updateMetaDescription('Free AI visibility check analyzes your website AI presence. Get detailed report on AI visibility and optimization opportunities. Start now.');
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />
      
      {/* Coming Soon Section */}
      <section className="relative pt-32 pb-64 bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full mb-4">
              <Eye className="w-4 h-4" />
              <span className="font-semibold">AI Visibility Analysis</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Check Your <span className="text-blue-600">AI Visibility</span>
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-gray-600">
              Coming Soon
            </p>
          </motion.div>
        </div>
      </section>

      {/* What Is AI Visibility */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">What Is AI Visibility — and Why Does It Matter?</h2>
        <div className="prose prose-gray max-w-none space-y-4 text-gray-700 leading-relaxed">
          <p>
            AI visibility refers to how prominently your business appears when customers use AI-powered tools to find local services. When someone asks ChatGPT, Google's AI Overviews, Perplexity, or Bing Copilot "who is the best plumber near me?" or "find a dentist that accepts Aetna in Austin," the AI surfaces a handful of businesses and ignores the rest. If your business isn't one of the ones mentioned, you're invisible to an entire category of potential customers — even if you rank well on traditional Google search.
          </p>
          <p>
            This shift is happening fast. According to search industry data, AI-generated answers now appear for over 40% of local service queries on Google. These AI answers pull from a combination of structured data on your website, your Google Business Profile, third-party directory listings, review signals, and how well your website content answers the specific questions customers ask. Businesses that optimize for these signals get their name mentioned. Businesses that don't, disappear.
          </p>
          <p>
            Our upcoming AI Visibility Check tool will analyze your business across all the major AI answer engines — including Google's AI Overviews, ChatGPT, Perplexity, and Bing Copilot. You'll get a score for each platform, a list of specific gaps preventing your business from being recommended by AI, and a prioritized action plan to improve your visibility without needing to hire an SEO agency. The tool is being built specifically for local service businesses: plumbers, HVAC companies, dentists, lawyers, roofers, and any business that depends on customers finding them when they need help.
          </p>
        </div>
      </section>

      {/* What We'll Check */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">What the AI Visibility Check Will Cover</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: Bot, title: 'ChatGPT & Perplexity Mentions', desc: 'Does your business get recommended when customers ask AI chatbots for local service providers in your category and city?' },
            { icon: Search, title: "Google AI Overviews Presence", desc: 'Are you appearing in Google\'s AI-generated answer boxes that now appear above traditional blue-link results for local queries?' },
            { icon: Globe, title: 'Structured Data & Entity Signals', desc: 'Does your website have the schema markup, FAQ content, and entity signals that AI engines use to identify and trust local businesses?' },
            { icon: BarChart3, title: 'Directory & Citation Consistency', desc: 'Are your NAP (name, address, phone) listings consistent across Google, Yelp, Facebook, and the other directories that AI engines cross-reference?' },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 bg-blue-50 rounded-xl p-5 border border-blue-100">
              <item.icon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Trusted by Local Business Owners</h2>
        <p className="text-gray-500 text-center mb-8 text-sm">Join 500+ businesses using Boltcall to capture more leads and grow revenue.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { quote: "Boltcall paid for itself in the first week. We stopped losing calls after hours and our bookings jumped 40%.", name: "Marcus T.", role: "HVAC Owner, Texas" },
            { quote: "I was skeptical about AI, but it just works. Our front desk handles 30% fewer interruptions now.", name: "Priya S.", role: "Dental Practice Manager, California" },
            { quote: "We were losing 15-20 calls a week to voicemail. Boltcall captures every single one now.", name: "James R.", role: "Plumbing Business Owner, Florida" },
          ].map((item) => (
            <div key={item.name} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <p className="text-gray-700 text-sm leading-relaxed mb-4">"{item.quote}"</p>
              <div>
                <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-gray-50 border-t border-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>100% Free — no credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>Used by 500+ local businesses</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>Results in 30 days or your money back</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>Your data is never sold or shared</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AIVisibilityCheck;

