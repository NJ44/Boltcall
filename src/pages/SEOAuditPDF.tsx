import React, { useState, useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { motion } from 'framer-motion';
import {
  Search, Globe, BarChart3, AlertCircle, Loader, Mail,
  FileText, Bot, Shield, Sparkles, CheckCircle2, Loader2,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';
import FAQ from '../components/FAQ';
import Breadcrumbs from '../components/Breadcrumbs';
import { useNavigate } from 'react-router-dom';

// ── Loading step messages ──
const loadingSteps = [
  { icon: Globe, text: 'Crawling your website...' },
  { icon: Search, text: 'Analyzing on-page SEO...' },
  { icon: Shield, text: 'Checking technical SEO...' },
  { icon: Bot, text: 'Evaluating AEO readiness...' },
  { icon: Sparkles, text: 'AI writing your report...' },
  { icon: FileText, text: 'Generating branded PDF...' },
];

const WEBHOOK_URL = 'https://n8n.srv974118.hstgr.cloud/webhook/seo-aeo-audit';

const SEOAuditPDF: React.FC = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Free SEO & AEO Audit Tool - Get Your PDF Report | Boltcall';
    updateMetaDescription(
      'Enter your URL for a free SEO and AEO (AI Engine Optimization) audit. Get a branded PDF report with scores, keyword rankings, and an action plan.'
    );
  }, []);

  // Animate loading steps
  useEffect(() => {
    if (!isAnalyzing) return;
    const interval = setInterval(() => {
      setLoadingStepIndex((prev) => {
        if (prev >= loadingSteps.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

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

    if (!url.trim()) {
      setError('Please enter a website URL');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    if (!validateUrl(formattedUrl)) {
      setError('Please enter a valid URL (e.g., example.com)');
      return;
    }

    setIsAnalyzing(true);
    setLoadingStepIndex(0);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: formattedUrl,
          email: email.trim(),
        }),
      });

      if (!response.ok) throw new Error('Submission failed');

      // Brief pause so loading animation feels complete
      await new Promise((r) => setTimeout(r, 2000));
      navigate('/seo-aeo-audit/thank-you');
    } catch {
      setError('Something went wrong. Please try again.');
      setIsAnalyzing(false);
    }
  };

  // ── Loading screen ──
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-white">
        <GiveawayBar />
        <Header />
        <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 className="w-16 h-16 text-blue-600" />
                </motion.div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Generating Your SEO & AEO Report...
              </h2>
              <p className="text-gray-500 mb-10">
                Our AI is analyzing your website right now. This takes 2-3 minutes.
              </p>

              <div className="space-y-3 text-left">
                {loadingSteps.map((step, idx) => {
                  const Icon = step.icon;
                  const isDone = idx < loadingStepIndex;
                  const isActive = idx === loadingStepIndex;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: idx <= loadingStepIndex ? 1 : 0.3,
                        x: 0,
                      }}
                      transition={{ delay: idx * 0.1, duration: 0.3 }}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        isActive
                          ? 'bg-blue-50 border border-blue-200'
                          : isDone
                          ? 'bg-green-50'
                          : 'bg-gray-50'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : isActive ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        >
                          <Loader2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        </motion.div>
                      ) : (
                        <Icon className="w-5 h-5 text-gray-300 flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          isActive
                            ? 'text-blue-700'
                            : isDone
                            ? 'text-green-700'
                            : 'text-gray-400'
                        }`}
                      >
                        {step.text}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  // ── Main form ──
  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-4 bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-4"
          >
            <div className="inline-flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full mb-4">
              <FileText className="w-4 h-4" />
              <span className="font-semibold">Free PDF Report</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              SEO & <span className="text-blue-600">AEO</span> Audit Report
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-2">
              Get a professional 6-page PDF analyzing your website for both search engines and AI answer engines.
            </p>
            <p className="text-gray-500 max-w-xl mx-auto">
              We crawl your site, check 30+ SEO factors, evaluate AEO readiness, and deliver a branded report with scores and an action plan.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What's Included */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Search, label: 'On-Page SEO Analysis', desc: 'Meta tags, headings, content' },
            { icon: Shield, label: 'Technical SEO Check', desc: 'Speed, SSL, sitemap, robots' },
            { icon: Bot, label: 'AEO Readiness Score', desc: 'AI engine optimization' },
            { icon: BarChart3, label: 'Schema Coverage', desc: 'Structured data audit' },
            { icon: Sparkles, label: 'AI-Written Insights', desc: 'Expert analysis by Claude' },
            { icon: FileText, label: '30-Day Action Plan', desc: 'Prioritized weekly steps' },
          ].map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-gray-200 rounded-xl p-4 text-center"
            >
              <item.icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-semibold text-gray-900">{item.label}</div>
              <div className="text-xs text-gray-500">{item.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">
              Get Your Free Report
            </h2>
            <p className="text-sm text-gray-500 mb-6 text-center">
              Enter your website URL and we'll deliver a PDF to your inbox
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* URL */}
              <div>
                <label
                  htmlFor="audit-url"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Website URL
                </label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="audit-url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    disabled={isAnalyzing}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="audit-email"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="audit-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    disabled={isAnalyzing}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">
                  Your branded PDF report will be sent to this email
                </p>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <p className="text-red-800 text-sm">{error}</p>
                </motion.div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isAnalyzing || !url.trim() || !email.trim()}
                className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-semibold text-base"
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Generate My Free Report
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-400">
                Free · No credit card · Report delivered in ~5 minutes
              </p>
            </form>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default SEOAuditPDF;
