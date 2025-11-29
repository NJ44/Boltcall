import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Phone, DollarSign, TrendingUp, CheckCircle, XCircle, Calculator, Users, Clock as ClockIcon, Zap, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';

const BlogIsAIReceptionistWorthIt: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left mb-12"
          >
            <div className="inline-flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full mb-6">
              <Calculator className="w-4 h-4" />
              <span className="font-semibold">Business Analysis</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Is an <span className="text-blue-600">AI Receptionist</span> Worth It? A Complete Cost-Benefit Analysis
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>February 15, 2025</span>
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
      <article className="w-full px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="prose prose-lg max-w-none mb-12"
        >
          <p className="text-xl text-gray-700 leading-relaxed font-medium">
            Every business owner faces the same question: Should I invest in an AI receptionist? With costs ranging from $99 to $500+ per month, it's a decision that requires careful analysis. This guide breaks down the real costs, benefits, and ROI to help you determine if an AI receptionist is worth it for your business.
          </p>
        </motion.div>

        {/* Cost Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Real Cost Comparison</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
                <h3 className="text-xl font-bold text-gray-900">Human Receptionist</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Salary:</span>
                  <span>$2,500 - $4,000/month</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Benefits:</span>
                  <span>$500 - $800/month</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Training:</span>
                  <span>$200 - $500/month</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Sick Days/Vacation:</span>
                  <span>Coverage costs</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Total:</span>
                  <span className="text-red-600 font-bold">$3,200 - $5,300/month</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">AI Receptionist</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Monthly Fee:</span>
                  <span>$99 - $299/month</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Setup:</span>
                  <span>$0 - $500 (one-time)</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">No Benefits:</span>
                  <span>$0</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">24/7 Coverage:</span>
                  <span>Included</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Total:</span>
                  <span className="text-green-600 font-bold">$99 - $299/month</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
            <p className="text-lg text-gray-800">
              <strong>Bottom Line:</strong> An AI receptionist costs <strong className="text-blue-600">90-97% less</strong> than a human receptionist, while providing 24/7 coverage that a human simply cannot match.
            </p>
          </div>
        </motion.div>

        {/* ROI Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">ROI Analysis: When It Makes Financial Sense</h2>
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
            <h3 className="text-2xl font-bold mb-6">Real-World ROI Example</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold mb-2">391%</div>
                <div className="text-blue-100 text-sm">Conversion increase when responding in 60 seconds</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold mb-2">$12,000</div>
                <div className="text-blue-100 text-sm">Additional monthly revenue from captured leads</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold mb-2">40:1</div>
                <div className="text-blue-100 text-sm">ROI ratio ($12k revenue / $299 cost)</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Scenario 1: High Call Volume Business</h3>
              <p className="text-gray-700 mb-4">
                If you receive <strong>100+ calls per month</strong> and miss even 20% of them, you're losing potential revenue. An AI receptionist that captures just 10 additional bookings per month at $200 average value equals <strong>$2,000/month in new revenue</strong>.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Monthly Calculation:</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• 10 captured bookings × $200 = $2,000 revenue</li>
                  <li>• AI Receptionist cost = $299</li>
                  <li>• <strong className="text-green-600">Net gain: $1,701/month</strong></li>
                </ul>
              </div>
            </div>

            <div className="border-l-4 border-green-600 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Scenario 2: After-Hours Coverage</h3>
              <p className="text-gray-700 mb-4">
                If you close at 5 PM but receive 30% of your calls after hours, you're missing opportunities. An AI receptionist provides 24/7 coverage, capturing leads even when you're closed.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Monthly Calculation:</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• 30 after-hours calls × 50% booking rate = 15 bookings</li>
                  <li>• 15 bookings × $150 average = $2,250 revenue</li>
                  <li>• AI Receptionist cost = $299</li>
                  <li>• <strong className="text-green-600">Net gain: $1,951/month</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Benefits Beyond Cost Savings</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <ClockIcon className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">24/7 Availability</h3>
              </div>
              <p className="text-gray-700">
                Never miss a call, even at 3 AM. Your AI receptionist works around the clock, capturing leads when human staff can't.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Instant Response</h3>
              </div>
              <p className="text-gray-700">
                Respond to leads in seconds, not hours. Research shows 391% higher conversion rates when responding within 60 seconds.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Consistent Service</h3>
              </div>
              <p className="text-gray-700">
                No bad days, no mood swings. Your AI receptionist provides consistent, professional service every single time.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Scalable Growth</h3>
              </div>
              <p className="text-gray-700">
                Handle 10 calls or 1,000 calls per day without hiring additional staff. Your AI receptionist scales with your business.
              </p>
            </div>
          </div>
        </motion.div>

        {/* When It's NOT Worth It */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">When an AI Receptionist Might NOT Be Worth It</h2>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg mb-6">
            <p className="text-gray-800 mb-4">
              An AI receptionist may not be the right fit if:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <XCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                <span>You receive fewer than 20 calls per month</span>
              </li>
              <li className="flex items-start">
                <XCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                <span>Your average booking value is under $50</span>
              </li>
              <li className="flex items-start">
                <XCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                <span>You need complex, multi-step problem-solving on every call</span>
              </li>
              <li className="flex items-start">
                <XCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                <span>You have a dedicated receptionist with minimal workload</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Decision Framework */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Decision Framework: Is It Worth It for You?</h2>
          
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Assessment</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Do you receive 30+ calls per month?</p>
                  <p className="text-sm text-gray-600">If yes, you're likely missing opportunities without 24/7 coverage.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Is your average booking value $100+?</p>
                  <p className="text-sm text-gray-600">Higher value = faster ROI. Even 2-3 captured bookings can pay for the service.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Do you miss calls or respond slowly?</p>
                  <p className="text-sm text-gray-600">If you miss even 10% of calls, an AI receptionist can capture that lost revenue.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Do you need after-hours coverage?</p>
                  <p className="text-sm text-gray-600">24/7 availability means capturing leads even when you're closed.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border-2 border-blue-600">
              <p className="text-lg font-semibold text-gray-900 mb-2">
                If you answered "yes" to 2+ questions, an AI receptionist is likely worth it for your business.
              </p>
              <p className="text-gray-600">
                The cost savings alone (compared to a human receptionist) combined with 24/7 coverage and instant response times typically provide a strong ROI within the first month.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Conclusion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Bottom Line</h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              For most service-based businesses receiving 30+ calls per month, an AI receptionist is absolutely worth it. The combination of:
            </p>
            
            <ul className="space-y-3 text-lg text-gray-700 mb-6">
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <span><strong>90-97% cost savings</strong> compared to a human receptionist</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <span><strong>24/7 availability</strong> that captures leads even when you're closed</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <span><strong>Instant response times</strong> that increase conversion rates by 391%</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <span><strong>Scalable growth</strong> without additional hiring costs</span>
              </li>
            </ul>

            <p className="text-lg text-gray-700 leading-relaxed">
              ...makes an AI receptionist one of the highest-ROI investments a service business can make. Most businesses see a positive return within the first month, with many achieving 10:1 or better ROI ratios.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Ready to See If It's Worth It for Your Business?</h3>
          <p className="text-blue-100 mb-6 text-lg">
            Calculate your potential ROI with our free AI Revenue Audit tool.
          </p>
          <Link to="/how-much-you-can-earn-with-ai">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
              Calculate Your ROI
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </motion.div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogIsAIReceptionistWorthIt;

