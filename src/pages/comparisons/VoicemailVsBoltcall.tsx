import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, TrendingUp, Zap, Phone, HelpCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import GiveawayBar from '../../components/GiveawayBar';

const VoicemailVsBoltcall: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left mb-12"
          >
            <Link 
              to="/comparisons" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Comparisons</span>
            </Link>

            <div className="inline-flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full mb-6">
              <TrendingUp className="w-4 h-4" />
              <span className="font-semibold">Comparison Guide</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Voicemail vs <span className="text-blue-600">Boltcall</span>
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>February 10, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>6 min read</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            Quick Comparison
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Feature</th>
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Boltcall</th>
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Voicemail</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Response time</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">
                    <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                      <Zap className="w-4 h-4" />
                      Instant (0-5 seconds)
                    </span>
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">
                    <span className="text-red-600 font-semibold">Hours or days later</span>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Lead conversion</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">
                    <span className="text-green-600 font-semibold">391% higher with instant response</span>
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">
                    <span className="text-red-600 font-semibold">80% lower conversion rate</span>
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Customer experience</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Live conversation, immediate answers</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">One-way message, no interaction</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Appointment booking</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">
                    <span className="text-green-600 font-semibold">Instant booking during call</span>
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Requires callback, often missed</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Missed opportunities</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">
                    <span className="text-green-600 font-semibold">0% - every call answered</span>
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">
                    <span className="text-red-600 font-semibold">High - many voicemails never returned</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            Why Boltcall Beats Voicemail
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Response vs Delayed Response</h3>
              <p className="text-gray-700 leading-relaxed">
                Voicemail means customers leave a message and wait—sometimes hours or days—for a callback. Research shows that 
                responding within 60 seconds increases conversion rates by 391%. Boltcall answers instantly, engaging customers 
                in real-time conversation when they're most interested.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Two-Way Conversation vs One-Way Message</h3>
              <p className="text-gray-700 leading-relaxed">
                Voicemail is a one-way communication. Customers leave a message and hope you call back. Boltcall creates a 
                two-way conversation where customers can ask questions, get answers, and book appointments immediately—all in 
                the same call.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Never Miss a Lead</h3>
              <p className="text-gray-700 leading-relaxed">
                Studies show that 80% of voicemails are never returned, or are returned too late. With Boltcall, every call 
                is answered instantly, every lead is captured, and every opportunity is converted. No more lost leads sitting 
                in your voicemail inbox.
              </p>
            </div>
          </div>
        </motion.section>
      </article>

      <Footer />
    </div>
  );
};

export default VoicemailVsBoltcall;

