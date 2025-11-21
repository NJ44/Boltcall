import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import GiveawayBar from '../../components/GiveawayBar';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { WavePath } from '../../components/ui/wave-path';

const InstantFormReplyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
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
              <FileText className="w-4 h-4" />
              <span className="font-semibold">Instant Form Reply</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Turn Form Submissions into <span className="text-blue-600">Instant Conversations</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Automatically respond to every form submission within seconds, qualify leads, and book appointments—all without manual work.
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
              What is Instant Form Reply?
            </h2>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Instant Form Reply automatically responds to every form submission on your website within seconds. 
              Instead of leaving customers waiting for a response, your AI immediately acknowledges their inquiry, 
              asks qualifying questions, and can even book appointments directly.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Whether it's a contact form, quote request, consultation booking, or any other form on your site, 
              Instant Form Reply ensures every lead gets instant attention and professional follow-up.
            </p>
          </motion.div>

          {/* Wave Path Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="my-16"
          >
            <div className="flex w-[70vw] max-w-2xl flex-col">
              <WavePath className="mb-8 text-blue-600" />
              <div className="flex w-full flex-col">
                <div className="flex">
                  <p className="text-gray-500 text-sm mt-2">Instant response flow</p>
                  <p className="text-gray-800 ml-8 w-3/4 text-lg md:text-xl">
                    From form submission to qualified lead in seconds—that's the power of instant automation.
                  </p>
                </div>
              </div>
            </div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
              Why Instant Form Reply is Critical
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  The 60-Second Rule
                </h3>
                <p className="text-gray-600">
                  Research shows that <strong>responding within 60 seconds increases conversion by 391%</strong>. 
                  Most businesses take hours or days to respond to form submissions, losing potential customers 
                  to competitors who respond faster. Instant Form Reply ensures you're always first.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Form Abandonment is Real
                </h3>
                <p className="text-gray-600">
                  When customers submit a form and don't hear back quickly, they assume you're not interested 
                  or too busy. <strong>68% of customers will move on to a competitor</strong> if they don't receive 
                  a response within 24 hours. Instant Form Reply eliminates this risk entirely.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Professional First Impression
                </h3>
                <p className="text-gray-600">
                  An instant, personalized response shows professionalism and attention to detail. 
                  It sets the tone for your entire customer relationship and demonstrates that you value 
                  their time and business.
                </p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
              How Instant Form Reply Helps Your Business
            </h2>
            
            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Instant Engagement
                </h3>
                <p className="text-gray-600">
                  Respond to every form submission within seconds, keeping leads engaged and moving them 
                  through your sales funnel immediately.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Lead Qualification
                </h3>
                <p className="text-gray-600">
                  Automatically ask qualifying questions to determine lead quality and buying intent, 
                  so you focus on the most promising opportunities.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Automatic Booking
                </h3>
                <p className="text-gray-600">
                  Book appointments directly from form submissions without any manual intervention. 
                  The AI handles scheduling and sends confirmations automatically.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  24/7 Coverage
                </h3>
                <p className="text-gray-600">
                  Forms are submitted at all hours. Instant Form Reply ensures every submission gets 
                  immediate attention, even on weekends and holidays.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <div className="w-1 h-10 bg-blue-600 rounded-full"></div>
                Start Responding Instantly
              </h3>
              <p className="text-blue-100 mb-6">
                Turn every form submission into a qualified lead with instant responses.
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

export default InstantFormReplyPage;

