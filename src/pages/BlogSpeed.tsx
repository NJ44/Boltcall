import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Zap } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';

const BlogSpeed: React.FC = () => {
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
            <div className="inline-flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4" />
              <span className="font-semibold">Lead Generation</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Why Speed Matters: The 391% Advantage of Responding in 60 Seconds
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>January 20, 2025</span>
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
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="prose prose-lg max-w-none mb-12"
        >
          <p className="text-xl text-gray-700 leading-relaxed font-medium">
            What if I told you that the difference between closing a deal and losing it forever 
            comes down to 60 seconds? Research shows that contacting a lead within the first 
            minute increases conversion rates by a staggering 391%. Here's why speed isn't just 
            important—it's everything.
          </p>
        </motion.div>

        {/* Section 1 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            The 391% Rule: What the Data Says
          </h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              Harvard Business Review published a study that changed how we think about lead 
              response times. They found that companies that contact leads within 60 seconds 
              are 391% more likely to convert them than those who wait just 5 minutes.
            </p>
            
            
            <p>
              But here's what's even more shocking: after 5 minutes, your chances drop 
              dramatically. After 10 minutes, you're 10 times less likely to connect. 
              After 30 minutes? You might as well not bother.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg my-8">
              <p className="text-gray-800 font-medium mb-3">
                The Speed Timeline:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">0-60 seconds:</span>
                  <span>391% higher conversion rate</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">5 minutes:</span>
                  <span>Conversion rate drops by 80%</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">10 minutes:</span>
                  <span>10x less likely to connect</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">30+ minutes:</span>
                  <span>Conversion rate near zero</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Section 2 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            Why Speed Creates Such a Massive Advantage
          </h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              Speed matters because your leads are actively shopping. When someone fills out 
              a form or calls your business, they're in "buying mode." They're comparing 
              options, reading reviews, and making decisions right now.
            </p>
            
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. First Contact Wins</h3>
            <p>
              The first business to respond gets the customer. It's that simple. When you 
              contact a lead within 60 seconds, you're not just fast—you're first. And 
              being first means you control the conversation.
            </p>
            
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Momentum Matters</h3>
            <p>
              Buying decisions are emotional. When someone reaches out, they're excited, 
              interested, and ready to act. Wait 5 minutes, and that excitement fades. 
              Wait 30 minutes, and they've already moved on to your competitor.
            </p>
            
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Perceived Value</h3>
            <p>
              Fast response times signal that you care. They show you're professional, 
              organized, and ready to serve. Slow responses? They signal the opposite. 
              Your lead assumes you're too busy, too disorganized, or simply don't care.
            </p>
          </div>
        </motion.section>

        {/* Section 3 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            The Real Cost of Being Slow
          </h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              Let's talk numbers. If you're getting 100 leads per month and responding 
              within 5 minutes instead of 60 seconds, you're losing money. Big money.
            </p>
            
            <p>
              <strong>Slow Response (5+ minutes):</strong> With 100 leads per month, you'll see about a 5% conversion rate, 
              which means 5 customers per month. At $500 per customer, that's $2,500 in monthly revenue.
            </p>
            
            <p>
              <strong>Fast Response (60 seconds):</strong> With 100 leads per month, you'll see about a 19.5% conversion 
              rate (391% higher), which means 19-20 customers per month. At $500 per customer, that's $9,750 in monthly revenue.
            </p>
            
            <p>
              That's a difference of $7,250 per month. Over a year, that's $87,000 in 
              lost revenue—just from being slow.
            </p>
          </div>
        </motion.section>

        {/* Section 4 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            How to Respond in 60 Seconds (Without Working 24/7)
          </h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              You can't be available 24/7. You can't answer every call instantly. You 
              can't respond to every form submission the moment it comes in. But AI can.
            </p>
            
            <p>
              <strong>AI-powered lead capture systems</strong> respond instantly, every time. 
              They answer calls in seconds. They reply to form submissions immediately. 
              They qualify leads and book appointments automatically—all while you sleep.
            </p>
            
            <div className="bg-gray-900 text-white p-8 rounded-2xl my-8">
              <h3 className="text-2xl font-bold mb-4">The Solution</h3>
              <p className="text-lg leading-relaxed text-gray-200">
                AI doesn't need breaks. It doesn't sleep. It doesn't get overwhelmed. 
                It responds to every lead in under 60 seconds, 24/7, giving you that 
                391% advantage automatically.
              </p>
            </div>
            
            <p>
              The businesses winning right now aren't the ones with the biggest teams. 
              They're the ones that respond fastest. And with AI, speed is no longer 
              a competitive advantage—it's a requirement.
            </p>
          </div>
        </motion.section>

        {/* Section 5 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            The Bottom Line
          </h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              Speed isn't negotiable anymore. If you're not responding to leads within 
              60 seconds, you're leaving money on the table. A lot of money.
            </p>
            
            <p>
              The 391% advantage is real. The data is clear. And the solution is here. 
              The question is: will you be fast enough to capture it?
            </p>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 md:p-12 rounded-2xl text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get the 391% Advantage?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            See how AI can help you respond to every lead in under 60 seconds, 24/7.
          </p>
          <Link
            to="/"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Get Started Free
          </Link>
        </motion.div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogSpeed;

