import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsSubmitting(false);
      setEmail('');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />
      
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Newsletter
            </h1>
            <p className="text-xl text-gray-600">
              Stay updated with the latest news, tips, and updates from Boltcall
            </p>
          </motion.div>

          {!isSubscribed ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Thank You!
              </h2>
              <p className="text-gray-600 mb-6">
                You've successfully subscribed to our newsletter. Check your email for a confirmation message.
              </p>
              <button
                onClick={() => setIsSubscribed(false)}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Subscribe Another Email
              </button>
            </motion.div>
          )}

          {/* Past Newsletters Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Past Newsletters
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: 'AI Receptionist Best Practices',
                  date: 'January 15, 2025',
                  description: 'Learn how to maximize your AI receptionist performance and boost customer satisfaction.',
                },
                {
                  title: 'Speed to Lead: The 391% Advantage',
                  date: 'January 8, 2025',
                  description: 'Discover why responding to leads within 5 minutes can increase conversion rates by 391%.',
                },
                {
                  title: 'Automated Follow-Ups That Convert',
                  date: 'January 1, 2025',
                  description: 'Master the art of automated follow-ups and turn more leads into customers.',
                },
                {
                  title: '2025 Trends in AI for Local Businesses',
                  date: 'December 25, 2024',
                  description: 'Stay ahead with the latest AI trends and technologies for local businesses.',
                },
              ].map((newsletter, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="border-b border-gray-200 pb-4 hover:bg-gray-50 transition-colors rounded-lg p-4 -mx-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>{newsletter.date}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {newsletter.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {newsletter.description}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Newsletter;

