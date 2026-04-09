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
              Improve your website's visibility with a comprehensive 30-factor SEO analysis — uncover what's costing you traffic and get a prioritized action plan to rank higher and get found by AI answer engines.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What's Included */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Search, label: 'Rank Higher on Google', desc: 'Fix meta tags, headings & content to drive more traffic' },
            { icon: Shield, label: 'Remove Technical Barriers', desc: 'Speed, SSL & sitemap issues costing you visitors' },
            { icon: Bot, label: 'Get Found by AI Engines', desc: 'Score your readiness for AI-driven search results' },
            { icon: BarChart3, label: 'Unlock Rich Results', desc: 'Structured data that wins more clicks from search' },
            { icon: Sparkles, label: 'Expert Insights, Instantly', desc: 'AI analysis of exactly what to fix first' },
            { icon: FileText, label: 'A Clear Growth Roadmap', desc: 'Week-by-week steps to measurably improve rankings' },
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

      {/* How the SEO & AEO Audit Works */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">How the SEO & AEO Audit Works</h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          Traditional SEO audits only check Google rankings. Our report goes further — it scores your site against the 30 factors that determine whether you show up in both search engine results and AI-generated answers from tools like ChatGPT, Perplexity, and Google AI Overviews.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {[
            { step: '1', title: 'Website Crawl', desc: 'We crawl your site the same way Google does — checking meta tags, headings, content depth, internal linking structure, and indexability signals that affect ranking.' },
            { step: '2', title: 'Technical SEO Check', desc: 'Page speed, mobile responsiveness, SSL certificates, sitemap health, and structured data markup are all evaluated against current Google Core Web Vitals standards.' },
            { step: '3', title: 'AEO Readiness Score', desc: 'AI answer engines favor pages with clear authority signals: FAQ schema, concise factual answers, citation-worthy content, and topical depth. We score all of these.' },
            { step: '4', title: 'Prioritized Action Plan', desc: 'Every finding is ranked by estimated impact. Your PDF report tells you exactly what to fix first, with specific instructions — not vague recommendations.' },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 bg-gray-50 rounded-xl p-5 border border-gray-200">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{item.step}</div>
              <div>
                <div className="font-semibold text-gray-900 text-sm mb-1">{item.title}</div>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-500">
          The report is generated by AI trained on current SEO best practices and delivered as a branded PDF to your inbox within approximately 5 minutes of submission.
        </p>
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

      <FAQ />
      <Footer />
    </div>
  );
};

export default SEOAuditPDF;
