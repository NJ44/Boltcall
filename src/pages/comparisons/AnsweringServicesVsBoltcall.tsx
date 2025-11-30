import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, TrendingUp, Zap, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import GiveawayBar from '../../components/GiveawayBar';

const AnsweringServicesVsBoltcall: React.FC = () => {
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
              Answering Services vs <span className="text-blue-600">Boltcall</span>
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>February 10, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>7 min read</span>
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
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Answering Services</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Monthly cost</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">$99-200/month</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">$300-800/month + per-minute fees</td>
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
                    <span className="text-orange-600 font-semibold">1-3 minutes average</span>
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Availability</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">
                    <span className="text-green-600 font-semibold">24/7/365</span>
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Business hours or limited 24/7 (extra cost)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Integration</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">
                    <span className="text-green-600 font-semibold">Calendar, CRM, SMS, forms</span>
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Limited, phone calls primarily</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Multi-channel</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">
                    <span className="text-green-600 font-semibold">Calls, SMS, forms, chat, follow-ups</span>
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Phone calls only</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Customization</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Full control, easy to update</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Requires service provider changes</td>
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
            Why Boltcall is Better
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lower Cost, More Features</h3>
              <p className="text-gray-700 leading-relaxed">
                Answering services charge $300-800/month plus per-minute fees that can add hundreds more. Boltcall costs 
                $99-200/month with no per-minute charges. Plus, Boltcall includes SMS, form handling, automated follow-ups, 
                and website chat—features that answering services don't offer.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Better Integration</h3>
              <p className="text-gray-700 leading-relaxed">
                Boltcall integrates directly with your calendar, CRM, and business systems. Answering services typically 
                just take messages and email them to you—requiring manual work to book appointments or update your systems. 
                Boltcall does it all automatically.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Full Control</h3>
              <p className="text-gray-700 leading-relaxed">
                With answering services, you're dependent on their agents and scripts. Boltcall gives you full control—you 
                can update scripts, change responses, and customize behavior instantly, without waiting for a service provider 
                to make changes.
              </p>
            </div>
          </div>
        </motion.section>
      </article>

      <Footer />
    </div>
  );
};

export default AnsweringServicesVsBoltcall;

