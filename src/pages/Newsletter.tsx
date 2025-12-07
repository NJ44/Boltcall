import React, { useState, useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';
import { CategoryList } from '../components/ui/category-list';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Newsletter - Subscribe for AI Business Tips | Boltcall';
    updateMetaDescription('Subscribe to Boltcall newsletter for AI business tips, guides, and updates. Learn how to grow your business with AI.');
  }, []);

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
      
      {/* Blue Background Header Section - Full Width */}
      <section className="pt-32 pb-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Boltcall Newsletter
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              Stay updated with the latest news, tips, and updates from Boltcall
            </p>

            {/* Subscribe Form */}
            {!isSubscribed ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-md mx-auto"
              >
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                      className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="your@email.com"
                          />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || !email}
                    className="px-4 py-2 text-sm bg-white text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-md mx-auto"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                      Thank You!
                    </h2>
                <p className="text-blue-100">
                      You've successfully subscribed to our newsletter. Check your email for a confirmation message.
                    </p>
                  </motion.div>
                )}
          </motion.div>
              </div>
      </section>

      <main className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Past Newsletters Section - Centered */}
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <CategoryList
                title="Past Newsletters"
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
                  },
                  {
                    id: 2,
                    title: 'Speed to Lead: The 391% Advantage',
                    subtitle: 'January 8, 2025 • Discover why responding to leads within 5 minutes can increase conversion rates by 391%.',
                    icon: <ArrowRight className="w-8 h-8" />,
                    onClick: () => {
                      console.log('Opening: Speed to Lead');
                    },
                  },
                  {
                    id: 3,
                    title: 'Automated Follow-Ups That Convert',
                    subtitle: 'January 1, 2025 • Master the art of automated follow-ups and turn more leads into customers.',
                    icon: <ArrowRight className="w-8 h-8" />,
                    onClick: () => {
                      console.log('Opening: Automated Follow-Ups');
                    },
                  },
                  {
                    id: 4,
                    title: '2025 Trends in AI for Local Businesses',
                    subtitle: 'December 25, 2024 • Stay ahead with the latest AI trends and technologies for local businesses.',
                    icon: <ArrowRight className="w-8 h-8" />,
                    onClick: () => {
                      console.log('Opening: 2025 Trends in AI');
                    },
                  },
                ]}
                className="bg-white"
              />
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Newsletter;

