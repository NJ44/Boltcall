import React, { useEffect } from 'react';
import { updateMetaDescription } from '../../lib/utils';
import { motion } from 'framer-motion';
import { Sparkles, Globe, Zap, CheckCircle, ArrowRight, TrendingUp } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import GiveawayBar from '../../components/GiveawayBar';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const SmartWebsitePage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Smart Website Optimization & AI-Powered Lead Generation | Boltcall';
    updateMetaDescription('Smart website optimization improves speed and conversions automatically. AI optimizes performance, enhances user experience.');
  }, []);
  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="font-semibold">Smart Website</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Your Website into a <span className="text-blue-600">Smart Lead Machine</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              AI-powered website optimization that automatically improves performance, 
              enhances user experience, and converts more visitors into customers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What It Is Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What is Smart Website?
            </h2>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Smart Website is an AI-powered optimization system that continuously analyzes and improves 
              your website's performance, user experience, and conversion rates. It automatically identifies 
              bottlenecks, optimizes page speed, enhances mobile responsiveness, and implements conversion 
              best practices—all without requiring technical expertise.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              The system learns from user behavior, A/B tests different elements, and makes data-driven 
              improvements that increase engagement, reduce bounce rates, and boost sales. It's like having 
              a team of web optimization experts working on your site 24/7.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why It's Important Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Why Smart Website Optimization is Critical
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                      Speed Directly Impacts Revenue
                    </h3>
                    <p className="text-gray-600">
                      <strong>53% of mobile users abandon sites that take longer than 3 seconds to load.</strong> 
                      A 1-second delay in page load time can result in a 7% reduction in conversions. 
                      Smart Website automatically optimizes your site speed, improving both user experience 
                      and search engine rankings.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                      Conversion Rate Optimization
                    </h3>
                    <p className="text-gray-600">
                      Most websites convert less than 3% of visitors. Smart Website uses AI to test 
                      different layouts, headlines, CTAs, and user flows, automatically implementing 
                      changes that <strong>increase conversion rates by 20-40%</strong> on average.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                      Mobile-First Experience
                    </h3>
                    <p className="text-gray-600">
                      Over 60% of web traffic comes from mobile devices, yet many sites aren't optimized 
                      for mobile users. Smart Website ensures your site is fully responsive, loads quickly 
                      on all devices, and provides an excellent mobile experience that converts visitors into customers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Helps Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              How Smart Website Helps Your Business
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                    Automatic Performance Optimization
                  </h3>
                </div>
                <p className="text-gray-600">
                  Continuously monitors and optimizes page speed, image compression, 
                  code minification, and caching strategies without manual intervention.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                    AI-Powered A/B Testing
                  </h3>
                </div>
                <p className="text-gray-600">
                  Automatically tests different page elements, layouts, and content variations 
                  to find what converts best, then implements winning changes.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                    SEO Enhancement
                  </h3>
                </div>
                <p className="text-gray-600">
                  Improves search engine rankings through technical SEO fixes, 
                  meta tag optimization, and structured data implementation.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                    Security & Compliance
                  </h3>
                </div>
                <p className="text-gray-600">
                  Automatically implements security best practices, SSL optimization, 
                  and ensures compliance with web standards and accessibility guidelines.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Make Your Website Smarter</h3>
              <p className="text-blue-100 mb-6">
                Let AI optimize your website automatically and watch your conversions grow.
              </p>
              <Link to="/setup">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SmartWebsitePage;

