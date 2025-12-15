import React, { useEffect } from 'react';
import { updateMetaDescription } from '../../lib/utils';
import { motion } from 'framer-motion';
import { Calendar, Clock, Zap, Clock as ClockIcon, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import GiveawayBar from '../../components/GiveawayBar';

const TraditionalCallCentersVsBoltcall: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Traditional Call Centers vs Boltcall AI Receptionist';
    updateMetaDescription('Traditional call centers vs Boltcall AI receptionist. Compare costs, features, and service quality. See why AI wins.');
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
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
              <Link to="/comparisons" className="hover:text-blue-600 transition-colors">
                Comparisons
              </Link>
              <span>/</span>
              <span className="text-gray-900">Traditional Call Centers vs Boltcall</span>
            </nav>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Traditional Call Centers vs <span className="text-blue-600">Boltcall</span>
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>February 10, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>8 min read</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16">
        {/* Quick Comparison Table */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-start gap-3">
            <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
            Quick Comparison Table
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Feature</th>
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Boltcall</th>
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Traditional Call Center</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Cost per month</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">$99-200/month</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">$2,000-5,000/month</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Response time</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">
                    <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                      <Zap className="w-4 h-4" />
                      Instant (0-5 seconds)
                    </span>
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">
                    <span className="inline-flex items-center gap-1 text-orange-600 font-semibold">
                      <ClockIcon className="w-4 h-4" />
                      2-5 minutes average
                    </span>
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Quality</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Consistent, professional, never tired</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Varies by agent, training, and time of day</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Availability</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">
                    <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                      <Globe className="w-4 h-4" />
                      24/7/365
                    </span>
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Business hours only (typically 8am-6pm)</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Missed-lead rate</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">
                    <span className="text-green-600 font-semibold">0% (never misses a call)</span>
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">
                    <span className="text-red-600 font-semibold">30-50% during peak hours</span>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Setup time</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">30 minutes</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">2-4 weeks</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Multi-channel support</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">
                    <span className="text-green-600 font-semibold">Calls, SMS, forms, follow-ups</span>
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Phone calls only</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Pros and Cons */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-start gap-3">
            <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
            Pros and Cons
          </h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Boltcall</h3>
              
              <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Pros</h4>
              <ul className="space-y-2 text-gray-700 ml-4">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Instant response (0-5 seconds)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>24/7 availability, never closes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Affordable ($99-200/month)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Handles multiple channels (calls, SMS, forms)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Consistent quality, never tired or stressed</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Automated follow-ups and reminders</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Quick setup (30 minutes)</span>
                </li>
              </ul>
              
              <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Cons</h4>
              <ul className="space-y-2 text-gray-700 ml-4">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>May struggle with very complex, multi-step sales processes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Less personal touch than human agents</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Requires initial setup and configuration</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Call Centers</h3>
              
              <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Pros</h4>
              <ul className="space-y-2 text-gray-700 ml-4">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Human touch and empathy</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Can handle very complex sales processes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Good for long qualification calls</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Can adapt to unique situations</span>
                </li>
              </ul>
              
              <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Cons</h4>
              <ul className="space-y-2 text-gray-700 ml-4">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Expensive ($2,000-5,000/month + per-minute fees)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Business hours only (misses after-hours leads)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Wait times (2-5 minutes average)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>High missed-call rate (30-50% during peak)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Quality varies by agent and training</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Long setup time (2-4 weeks)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Phone calls only (no SMS, forms, or automated follow-ups)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Agent turnover affects consistency</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* When Boltcall Wins */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-start gap-3">
            <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
            When Boltcall Wins
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Immediate Response</h3>
              <p className="text-gray-700 leading-relaxed">
                While call centers make customers wait 2-5 minutes (or longer during peak times), Boltcall's AI 
                answers every call instantly—within 0-5 seconds. Research shows that responding within 60 seconds 
                increases conversion rates by 391%. With Boltcall, you never miss that critical window.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Availability</h3>
              <p className="text-gray-700 leading-relaxed">
                Traditional call centers operate during business hours (typically 8am-6pm). That means 66% of 
                the day, your leads are going unanswered. Boltcall works 24/7/365—answering calls at 11 PM on Sunday, 
                on holidays, and during lunch breaks. Your business never closes, so your customer service shouldn't either.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Automated Follow-ups</h3>
              <p className="text-gray-700 leading-relaxed">
                Call centers handle the initial call, but then what? Someone has to manually follow up, send reminders, 
                and nurture leads. Boltcall automates all of this—sending SMS reminders, following up on form submissions, 
                and keeping conversations warm. It's like having a full customer service team that never sleeps.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Works with Forms, SMS, Calls</h3>
              <p className="text-gray-700 leading-relaxed">
                Call centers only handle phone calls. Boltcall handles calls, SMS messages, form submissions, and 
                website chat—all in one platform. When a lead fills out a form on your website at 2 AM, Boltcall 
                responds instantly via SMS. When someone texts you, Boltcall handles it. It's a complete customer 
                engagement system, not just a phone service.
              </p>
            </div>
          </div>
        </motion.section>
      </article>

      <Footer />
    </div>
  );
};

export default TraditionalCallCentersVsBoltcall;

