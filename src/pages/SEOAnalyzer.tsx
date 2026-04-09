import React, { useState, useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { motion } from 'framer-motion';
import { Search, Globe, BarChart3, AlertCircle, CheckCircle, Loader, Mail, X, TrendingUp, Clock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';

const SEOAnalyzer: React.FC = () => {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    document.title = 'Free SEO Audit Tool - Analyze Your Website SEO';
    updateMetaDescription('Free SEO audit tool analyzes your website SEO. Get detailed report on rankings, keywords, and optimization opportunities. Try free.');

    // Add canonical link
    let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = 'https://boltcall.org/seo-audit';

    return () => {
      const el = document.querySelector("link[rel='canonical']");
      if (el) el.remove();
    };
  }, []);

  const validateUrl = (urlString: string): boolean => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validateEmail = (emailString: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailString);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowSuccessPopup(false);

    // Validate URL
    if (!url.trim()) {
      setError('Please enter a website URL');
      return;
    }

    // Validate Email
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    // Add https:// if no protocol is specified
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    if (!validateUrl(formattedUrl)) {
      setError('Please enter a valid URL (e.g., example.com or https://example.com)');
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch('https://n8n.srv974118.hstgr.cloud/webhook/a2ecf792-bbad-4667-9223-fef18bfda0df', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: formattedUrl,
          email: email.trim(),
        }),
      });

      if (response.ok) {
        // Show success popup
        setShowSuccessPopup(true);
        setUrl('');
        setEmail('');
        // Hide popup after 8 seconds
        setTimeout(() => setShowSuccessPopup(false), 8000);
      } else {
        let errorText = 'Unknown error';
        try {
          errorText = await response.text();
        } catch {
          // Ignore if we can't read error text
        }
        console.error('Webhook error response:', response.status, errorText);
        setError(`Failed to analyze website (Status: ${response.status}). Please try again.`);
      }
    } catch (err: any) {
      console.error('Error calling webhook:', err);
      if (err.message) {
        setError(`Network error: ${err.message}. Please check your connection and try again.`);
      } else {
        setError('An error occurred while analyzing your website. Please try again.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />
      <main>
      {/* Hero Section */}
      <section className="relative pt-32 pb-4 bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-4"
          >
            <div className="inline-flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full mb-4">
              <BarChart3 className="w-4 h-4" />
              <span className="font-semibold">SEO Analysis Tool</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Analyze Your Website's <span className="text-blue-600">SEO</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get a comprehensive SEO analysis of any website. Enter a URL below to get started.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* URL Input */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    disabled={isAnalyzing}
                  />
                </div>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    disabled={isAnalyzing}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isAnalyzing || !url.trim() || !email.trim()}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-semibold text-base"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Analyze
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                We'll send your SEO audit report to this email address
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-800 text-sm">{error}</p>
              </motion.div>
            )}

          </form>
        </motion.div>
      </section>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative"
          >
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Audit Ready!
              </h2>
              <p className="text-gray-600 mb-6">
                Your SEO audit has been completed and sent to your email address. Please check your inbox for the detailed report.
              </p>
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">How the Free SEO Audit Works</h2>
        <p className="text-gray-500 text-center mb-8 text-sm max-w-xl mx-auto">
          Enter your website URL and email. Our tool crawls your site the same way Google does, checks 30+ ranking factors, and delivers a plain-English report to your inbox — usually within minutes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Globe, title: 'We Crawl Your Site', desc: 'We analyze your page titles, meta descriptions, headings, internal links, page speed, and mobile friendliness — the exact signals Google uses to rank pages.' },
            { icon: TrendingUp, title: 'We Score 30+ Factors', desc: 'Every factor is scored on a 0-100 scale. You\'ll see exactly what\'s holding your site back and which fixes will have the biggest impact on your traffic.' },
            { icon: Clock, title: 'Report in Your Inbox', desc: 'Your detailed SEO report lands in your inbox within minutes — no software to install, no login required, and completely free with no credit card needed.' },
          ].map((item) => (
            <div key={item.title} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <item.icon className="w-6 h-6 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who It's For */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Who This SEO Audit Is For</h2>
          <div className="prose prose-gray max-w-none space-y-4 text-gray-700 leading-relaxed text-sm">
            <p>
              This tool is built for local business owners who want to understand why their website isn't showing up on Google — without hiring an SEO agency or spending hours reading technical documentation. If you're a plumber, HVAC company, dentist, lawyer, or any service-area business, this audit will pinpoint the exact technical and on-page issues preventing your site from ranking for the searches your customers are already making.
            </p>
            <p>
              Most local business websites have 8 to 15 fixable SEO issues. Common problems include missing meta descriptions, slow page load times, unoptimized images, no structured data markup, and missing local SEO signals like your address and phone number. Fixing even half of these issues can move you from page 3 to page 1 within 60 to 90 days — without paying for ads.
            </p>
            <p>
              The audit is completely free because we believe every local business deserves a fair shot at ranking on Google. There's no catch, no upsell in the report itself, and your email will only be used to send you the audit results and occasional tips about growing your business online.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Trusted by Local Business Owners</h2>
        <p className="text-gray-500 text-center mb-8 text-sm">Join 500+ businesses using Boltcall to capture more leads and grow revenue.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { quote: "The SEO audit flagged 12 issues we had no idea about. After fixing them, our Google ranking jumped from page 3 to page 1 for our main keyword.", name: "Lisa M.", role: "Roofing Company Owner, Ohio" },
            { quote: "Free, instant, and actually useful. I used the report to guide our website redesign and saw 60% more organic traffic in 90 days.", name: "Carlos R.", role: "HVAC Business Owner, Texas" },
            { quote: "I sent this audit to my web developer and it saved hours of guesswork. Very clear and actionable.", name: "Janet K.", role: "Dental Practice Manager, Georgia" },
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
            <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" /><span>100% Free — no credit card required</span></div>
            <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" /><span>Used by 500+ local businesses</span></div>
            <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" /><span>Report delivered to your inbox in minutes</span></div>
            <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" /><span>Your data is never sold or shared</span></div>
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </div>
  );
};

export default SEOAnalyzer;

