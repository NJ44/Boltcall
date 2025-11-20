import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, TrendingUp, Zap } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';

const Blog: React.FC = () => {
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
              <TrendingUp className="w-4 h-4" />
              <span className="font-semibold">Business Strategy</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Why <span className="text-blue-600">AI Services</span> Are No Longer Optional
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>January 15, 2025</span>
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
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="prose prose-lg max-w-none mb-12"
        >
          <p className="text-xl text-gray-700 leading-relaxed font-medium">
            The local business landscape has transformed dramatically over the past few years. 
            What worked yesterday won't work tomorrow. And the businesses that are thriving? 
            They're the ones that embraced AI services early.
          </p>
        </motion.div>

        {/* Section 1 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            The Shifting Economy: What Changed?
          </h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              Remember when customers would call your business during business hours? When they'd 
              wait patiently for a callback? When a missed call was just a missed call?
            </p>
            
            <p>
              Those days are gone. Today's customers expect instant responses. They want answers 
              at 11 PM on a Sunday. They want to book appointments without talking to anyone. 
              They want service that matches what they get from Amazon and Google.
            </p>
            
            <div className="my-8">
              <p className="text-gray-800 font-medium mb-2">
                The Reality Check:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>75% of customers expect a response within 5 minutes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>50% of leads go to the business that responds first</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Businesses lose an average of $75,000 per year to missed calls</span>
                </li>
              </ul>
            </div>
            
            <p>
              Your competitors aren't just other local businesses anymore. You're competing with 
              national chains that have 24/7 support. You're competing with online services that 
              never sleep. You're competing with customer expectations set by trillion-dollar tech companies.
            </p>
          </div>
        </motion.section>

        {/* Section 2 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            Why Traditional Methods Are Failing
          </h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              The old playbook doesn't work anymore. Hiring more staff is expensive. Training 
              them takes time. And even your best employee can't be available 24/7.
            </p>
            
            <p>
              <strong>The Staffing Problem:</strong> Hiring a receptionist costs $30,000-$50,000 per year. They need breaks, 
              vacations, and can only handle one call at a time. They make mistakes when 
              they're tired or stressed.
            </p>
            
            <p>
              <strong>The Time Problem:</strong> You can't be everywhere at once. When you're with a customer, you miss calls. 
              When you're on a call, you miss walk-ins. When you're closed, you miss everything.
            </p>
            
            <p>
              This isn't about working harder. It's about working smarter. And that's where 
              AI services come in.
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            Why AI Services Are Critical Now
          </h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              AI isn't the future anymore. It's the present. And for local businesses, it's 
              the difference between thriving and barely surviving.
            </p>
            
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 rounded-2xl my-8">
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Zap className="w-6 h-6" />
                The AI Advantage
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold mb-2">24/7</div>
                  <p className="text-blue-100">Never miss a lead, even at 3 AM</p>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">Instant</div>
                  <p className="text-blue-100">Respond in seconds, not hours</p>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">Scalable</div>
                  <p className="text-blue-100">Handle unlimited calls simultaneously</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-2">1. Never Miss a Lead Again</h3>
            <p>
              An AI receptionist answers every call. Every time. Even when you're closed. 
              Even when you're busy. Even when you're on vacation. It qualifies leads, 
              answers questions, and books appointments automatically.
            </p>
            
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-2">2. Respond Faster Than Your Competition</h3>
            <p>
              Speed wins. When someone calls your business, they're probably calling your 
              competitors too. The first business to respond gets the customer. AI responds 
              instantly, giving you the edge.
            </p>
            
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-2">3. Lower Costs, Higher Quality</h3>
            <p>
              AI doesn't need breaks, vacations, or raises. It doesn't make mistakes when 
              it's tired. It provides consistent, professional service every single time. 
              For a fraction of the cost of hiring staff.
            </p>
            
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-2">4. Scale Without Limits</h3>
            <p>
              One AI can handle 100 calls at once. It doesn't get overwhelmed. It doesn't 
              need help. As your business grows, your AI scales with you automatically.
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            The Choice Is Yours
          </h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              The local business economy has changed. Customer expectations have changed. 
              The way people find and interact with businesses has changed.
            </p>
            
            <p>
              You can either adapt or get left behind. The businesses that are thriving 
              aren't the ones with the biggest budgets or the most staff. They're the 
              ones that embraced AI services early.
            </p>
            
            <div className="bg-gray-900 text-white p-8 rounded-2xl my-8">
              <h3 className="text-2xl font-bold mb-4">The Bottom Line</h3>
              <p className="text-lg leading-relaxed text-gray-200">
                AI services aren't a luxury anymore. They're a necessity. If you want to 
                compete in today's economy, you need to provide the level of service your 
                customers expect. And that means AI.
              </p>
            </div>
            
            <p>
              The question isn't whether AI will transform local business. It already has. 
              The question is: will you be part of the transformation, or will you watch 
              from the sidelines as your competitors pull ahead?
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
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            See how AI can help you capture more leads, book more appointments, and grow your revenue.
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

export default Blog;

