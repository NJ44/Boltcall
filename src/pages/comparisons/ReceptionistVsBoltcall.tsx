import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, TrendingUp, Zap, Users, HelpCircle, Clock as ClockIcon, AlertCircle, DollarSign, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import GiveawayBar from '../../components/GiveawayBar';

const ReceptionistVsBoltcall: React.FC = () => {
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            Cost Comparison
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Boltcall</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-3xl font-bold text-blue-600 mb-1">$99-200/month</p>
                  <p className="text-sm text-gray-600">No additional costs</p>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>No salary, benefits, or payroll taxes</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>No training costs</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>No equipment or office space needed</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-gray-600" />
                <h3 className="text-xl font-bold text-gray-900">Human Receptionist</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">$2,500-4,000/month</p>
                  <p className="text-sm text-gray-600">Plus benefits, taxes, equipment</p>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <AlertCircle className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Salary: $30,000-48,000/year</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Benefits: $5,000-8,000/year</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Training: $1,000-2,000 initial</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Equipment/space: $2,000-5,000/year</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-green-50 rounded-xl p-6 border border-green-200">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Annual Savings with Boltcall</h3>
            <p className="text-2xl font-bold text-green-600 mb-2">$25,000 - $40,000+ per year</p>
            <p className="text-gray-700">
              By switching from a human receptionist to Boltcall, you save on salary, benefits, training, equipment, 
              and office space—while getting 24/7 coverage and never missing a call.
            </p>
          </div>
        </motion.section>

        {/* Key Advantages */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            Why Boltcall Beats a Human Receptionist
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Coverage</h3>
                  <p className="text-gray-700 leading-relaxed">
                    A human receptionist works 40 hours a week. Boltcall works 168 hours a week—that's 4x more coverage. 
                    Your AI never takes lunch breaks, never calls in sick, and never goes on vacation. Every call, every 
                    day, every hour gets answered.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Never Misses a Call</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Even the best receptionist misses calls—when they're on another call, at lunch, in the bathroom, or 
                    overwhelmed. Boltcall handles unlimited simultaneous calls. While a receptionist can only answer one 
                    call at a time, Boltcall answers them all instantly.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Consistent Quality</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Human receptionists have good days and bad days. They get tired, stressed, or distracted. Boltcall 
                    is always professional, always friendly, and always accurate. Every customer gets the same high-quality 
                    experience, every single time.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Handles More Than Calls</h3>
                  <p className="text-gray-700 leading-relaxed">
                    A receptionist primarily handles phone calls. Boltcall handles calls, SMS messages, form submissions, 
                    website chat, automated follow-ups, and reminders—all automatically. It's like having a receptionist, 
                    customer service rep, and follow-up specialist all in one.
                  </p>
                </div>
              </div>
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
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

