import React, { useEffect } from 'react';
import { updateMetaDescription } from '../../lib/utils';
import { motion } from 'framer-motion';
import { Calendar, Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import GiveawayBar from '../../components/GiveawayBar';

const ReceptionistVsBoltcall: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Human Receptionist vs Boltcall AI Receptionist';
    updateMetaDescription('Human receptionist vs Boltcall AI receptionist. Compare costs, availability, and capabilities. See the differences.');
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
              <span className="text-gray-900">Human Receptionist vs Boltcall</span>
            </nav>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Human Receptionist vs <span className="text-blue-600">Boltcall</span>
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
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Human Receptionist</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Monthly cost</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">$99-200/month</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">$2,500-4,000/month (salary + benefits)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Availability</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">
                    <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                      <Zap className="w-4 h-4" />
                      24/7/365
                    </span>
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Business hours only (typically 40 hours/week)</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Missed calls</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">
                    <span className="text-green-600 font-semibold">0% (never misses)</span>
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">
                    <span className="text-orange-600 font-semibold">15-30% (lunch, breaks, busy)</span>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Consistency</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Always professional, never tired</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Varies by mood, time of day, workload</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Multi-channel</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">
                    <span className="text-green-600 font-semibold">Calls, SMS, forms, chat</span>
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Primarily phone calls</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Sick days/Vacation</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">
                    <span className="text-green-600 font-semibold">Never takes time off</span>
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">10-15 days/year + sick days</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Automated follow-ups</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">
                    <span className="text-green-600 font-semibold">Yes, fully automated</span>
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Requires manual work</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Scalability</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Handles unlimited calls simultaneously</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">One call at a time, needs more staff to scale</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Cost Analysis */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-start gap-3">
            <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
            Cost Comparison
          </h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Boltcall</h3>
              <p className="text-xl font-bold text-blue-600 mb-2">$99-200/month</p>
              <p className="text-gray-600 mb-4">No additional costs</p>
              <ul className="space-y-2 text-gray-700 ml-4">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>No salary, benefits, or payroll taxes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>No training costs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>No equipment or office space needed</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Human Receptionist</h3>
              <p className="text-xl font-bold text-gray-900 mb-2">$2,500-4,000/month</p>
              <p className="text-gray-600 mb-4">Plus benefits, taxes, equipment</p>
              <ul className="space-y-2 text-gray-700 ml-4">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Salary: $30,000-48,000/year</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Benefits: $5,000-8,000/year</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Training: $1,000-2,000 initial</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Equipment/space: $2,000-5,000/year</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Annual Savings with Boltcall</h3>
              <p className="text-2xl font-bold text-blue-600 mb-2">$25,000 - $40,000+ per year</p>
              <p>
                By switching from a human receptionist to Boltcall, you save on salary, benefits, training, equipment, 
                and office space—while getting 24/7 coverage and never missing a call.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Key Advantages */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-start gap-3">
            <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
            Why Boltcall Beats a Human Receptionist
          </h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-2">24/7 Coverage</h3>
              <p>
                A human receptionist works 40 hours a week. Boltcall works 168 hours a week—that's 4x more coverage. 
                Your AI never takes lunch breaks, never calls in sick, and never goes on vacation. Every call, every 
                day, every hour gets answered.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-2">Never Misses a Call</h3>
              <p>
                Even the best receptionist misses calls—when they're on another call, at lunch, in the bathroom, or 
                overwhelmed. Boltcall handles unlimited simultaneous calls. While a receptionist can only answer one 
                call at a time, Boltcall answers them all instantly.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-2">Consistent Quality</h3>
              <p>
                Human receptionists have good days and bad days. They get tired, stressed, or distracted. Boltcall 
                is always professional, always friendly, and always accurate. Every customer gets the same high-quality 
                experience, every single time.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-2">Handles More Than Calls</h3>
              <p>
                A receptionist primarily handles phone calls. Boltcall handles calls, SMS messages, form submissions, 
                website chat, automated follow-ups, and reminders—all automatically. It's like having a receptionist, 
                customer service rep, and follow-up specialist all in one.
              </p>
            </div>
          </div>
        </motion.section>

        {/* When Human Receptionist Might Be Better */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-start gap-3">
            <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
            When a Human Receptionist Might Be Better
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Face-to-Face Customer Interaction</h3>
              <p className="text-gray-700 leading-relaxed">
                If your business requires in-person reception services (greeting walk-in customers, handling physical paperwork, 
                managing a front desk), you'll still need a human receptionist. However, Boltcall can handle all phone and 
                digital communication, freeing your receptionist to focus on in-person interactions.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Complex Multi-Step Processes</h3>
              <p className="text-gray-700 leading-relaxed">
                If your typical customer interaction requires extensive back-and-forth, complex problem-solving, or relationship 
                building that can't be automated, a human receptionist might be better. However, Boltcall can handle the majority 
                of routine inquiries and transfer complex cases to your team.
              </p>
            </div>
          </div>
        </motion.section>
      </article>

      <Footer />
    </div>
  );
};

export default ReceptionistVsBoltcall;

