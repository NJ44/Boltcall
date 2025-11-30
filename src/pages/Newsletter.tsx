import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, ArrowRight, Zap, Target, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';
import { CategoryList } from '../components/ui/category-list';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Call webhook with email
      const response = await fetch('https://n8n.srv974118.hstgr.cloud/webhook/7212532d-a208-4970-b962-83df7a66501b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe to newsletter');
      }

      setIsSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      alert('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />
      
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Boltcall Newsletter
            </h1>
            <p className="text-xl text-gray-600">
              Stay updated with the latest news, tips, and updates from Boltcall
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Past Newsletters Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <CategoryList
                  title="Past"
                  subtitle="Newsletters"
                  headerIcon={<Mail className="w-8 h-8" />}
                  categories={[
                    {
                      id: 1,
                      title: 'AI Receptionist Best Practices',
                      subtitle: 'January 15, 2025 • Learn how to maximize your AI receptionist performance and boost customer satisfaction.',
                      icon: <ArrowRight className="w-8 h-8" />,
                      onClick: () => {
                        // Navigate to newsletter or open it
                        console.log('Opening: AI Receptionist Best Practices');
                      },
                      featured: true,
                    },
                    {
                      id: 2,
                      title: 'Speed to Lead: The 391% Advantage',
                      subtitle: 'January 8, 2025 • Discover why responding to leads within 5 minutes can increase conversion rates by 391%.',
                      icon: <Zap className="w-8 h-8" />,
                      onClick: () => {
                        console.log('Opening: Speed to Lead');
                      },
                    },
                    {
                      id: 3,
                      title: 'Automated Follow-Ups That Convert',
                      subtitle: 'January 1, 2025 • Master the art of automated follow-ups and turn more leads into customers.',
                      icon: <Target className="w-8 h-8" />,
                      onClick: () => {
                        console.log('Opening: Automated Follow-Ups');
                      },
                    },
                    {
                      id: 4,
                      title: '2025 Trends in AI for Local Businesses',
                      subtitle: 'December 25, 2024 • Stay ahead with the latest AI trends and technologies for local businesses.',
                      icon: <TrendingUp className="w-8 h-8" />,
                      onClick: () => {
                        console.log('Opening: 2025 Trends in AI');
                      },
                    },
                  ]}
                  className="bg-white"
                />
              </motion.div>
            </div>

            {/* Right: Subscribe Section (Sticky) */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
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
                    <p className="text-gray-600">
                      You've successfully subscribed to our newsletter. Check your email for a confirmation message.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Newsletter;

