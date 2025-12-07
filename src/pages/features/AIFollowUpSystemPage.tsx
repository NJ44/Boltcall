import React, { useEffect } from 'react';
import { updateMetaDescription } from '../../lib/utils';
import { motion } from 'framer-motion';
import { RefreshCw, TrendingUp, Target, CheckCircle, ArrowRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import GiveawayBar from '../../components/GiveawayBar';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const AIFollowUpSystemPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'AI Follow-Up System for Lead Nurturing | Boltcall';
    updateMetaDescription('AI follow-up system sends personalized messages automatically. Nurture leads, move prospects through sales funnel.');
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
              <RefreshCw className="w-4 h-4" />
              <span className="font-semibold">AI Follow-Up System</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Never Lose a Lead with <span className="text-blue-600">AI Follow-Ups</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Automatically nurture leads with personalized follow-up messages, keeping conversations warm 
              and moving prospects through your sales funnel.
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
              What is AI Follow-Up System?
            </h2>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              AI Follow-Up System automatically sends personalized follow-up messages to leads and customers 
              at optimal times. It nurtures relationships, answers questions, provides value, and moves prospects 
              through your sales funnel without requiring manual effort.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              The system intelligently determines when to follow up, what to say, and how to personalize messages 
              based on customer behavior, previous interactions, and lead status.
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
              Why AI Follow-Ups are Critical
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                      Most Sales Require Follow-Up
                    </h3>
                    <p className="text-gray-600">
                      Research shows that <strong>80% of sales require 5 follow-up contacts</strong>, yet most 
                      businesses give up after just 2 attempts. AI Follow-Up System ensures you never give up 
                      on a lead, automatically nurturing them until they're ready to buy.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                      Timing is Everything
                    </h3>
                    <p className="text-gray-600">
                      The best time to follow up varies by customer and situation. AI Follow-Up System analyzes 
                      customer behavior and engagement to send follow-ups at the <strong>optimal moment</strong>, 
                      maximizing response rates and conversions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                      Keep Conversations Warm
                    </h3>
                    <p className="text-gray-600">
                      Leads go cold quickly without regular contact. Automated follow-ups keep your business 
                      top-of-mind and maintain engagement, ensuring you're there when the customer is ready to buy.
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
              How AI Follow-Ups Help Your Business
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                    Increase Conversions
                  </h3>
                </div>
                <p className="text-gray-600">
                  Consistent follow-ups can increase conversion rates by up to 50%. 
                  Never lose a lead due to lack of follow-up.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                    Personalized Messaging
                  </h3>
                </div>
                <p className="text-gray-600">
                  AI personalizes each follow-up based on customer data, previous interactions, 
                  and lead status for maximum relevance and engagement.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                    Multi-Channel Follow-Ups
                  </h3>
                </div>
                <p className="text-gray-600">
                  Follow up via SMS, email, or both. Reach customers on their preferred channel 
                  for better engagement and response rates.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                    Save Time
                  </h3>
                </div>
                <p className="text-gray-600">
                  Automate the entire follow-up process. No more manual tracking, scheduling, 
                  or remembering to follow up—the AI handles everything.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <div className="w-1 h-10 bg-blue-600 rounded-full"></div>
                Start Nurturing Leads Automatically
              </h3>
              <p className="text-blue-100 mb-6">
                Never lose a lead again with automated, intelligent follow-ups.
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

export default AIFollowUpSystemPage;

