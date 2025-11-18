import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, BarChart3, AlertCircle, CheckCircle, Loader, Mail, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';

const SEOAnalyzer: React.FC = () => {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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
              Analyze Your Website's SEO
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get a comprehensive SEO analysis of any website. Enter a URL below to get started.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8 md:p-12"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* URL Input */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
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
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    disabled={isAnalyzing}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isAnalyzing || !url.trim() || !email.trim()}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-semibold text-lg"
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
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Audit Ready!
              </h3>
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

      <Footer />
    </div>
  );
};

export default SEOAnalyzer;

