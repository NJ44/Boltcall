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

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              How AI Follow-Up System Works
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Step 1: Lead Capture & Analysis
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  When a new lead is captured (from forms, calls, website interactions, or any source), 
                  the AI Follow-Up System immediately analyzes the lead's information, behavior, and 
                  engagement history. It determines the lead's stage in the sales funnel, buying intent, 
                  and optimal follow-up strategy. This analysis happens instantly, ensuring no time is 
                  wasted before beginning the nurturing process.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  The system considers multiple factors: how the lead found you, what information they 
                  provided, their engagement level, previous interactions, and industry-specific signals. 
                  This comprehensive analysis ensures follow-ups are relevant, timely, and effective.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Step 2: Personalized Message Creation
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  The AI creates personalized follow-up messages based on the lead's profile, needs, 
                  and stage in the buyer's journey. Each message is tailored to address specific 
                  pain points, provide relevant value, and move the lead closer to a purchase decision. 
                  The personalization goes beyond just using the lead's name—it includes industry-specific 
                  insights, relevant case studies, and targeted offers.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  Messages are crafted to feel natural and human, not like automated marketing emails. 
                  The AI uses conversational language, addresses the lead's specific situation, and 
                  provides genuine value in each communication. This approach builds trust and maintains 
                  engagement throughout the nurturing process.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Step 3: Optimal Timing Determination
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  The system uses machine learning to determine the optimal time to send each follow-up. 
                  It analyzes the lead's engagement patterns, response times, and behavior to identify 
                  when they're most likely to be receptive. This timing optimization significantly 
                  increases open rates, response rates, and conversion rates compared to generic 
                  follow-up schedules.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  The AI considers factors like time of day, day of week, time since last interaction, 
                  and lead activity patterns. It adapts in real-time, sending follow-ups when the 
                  lead is most engaged rather than following a rigid schedule. This intelligent timing 
                  ensures your messages are seen and acted upon.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Step 4: Multi-Channel Delivery
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Follow-ups are sent via the lead's preferred channel—SMS, email, or both. The system 
                  tracks which channels get the best response for each lead and adjusts accordingly. 
                  Multi-channel follow-ups ensure your message reaches the lead even if they're not 
                  checking one channel regularly.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  The system maintains conversation continuity across channels, ensuring the lead 
                  experiences a cohesive journey regardless of which channel they use. This integrated 
                  approach prevents confusion and maintains engagement throughout the nurturing process.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Step 5: Response Tracking & Adaptation
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  The system tracks every interaction: opens, clicks, responses, and engagement levels. 
                  Based on this data, it adapts the follow-up strategy in real-time. If a lead shows 
                  high engagement, it may accelerate the sequence or offer more direct calls-to-action. 
                  If engagement is low, it may adjust the messaging or timing to re-engage.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  When a lead responds or shows buying signals, the system can automatically notify your 
                  sales team, schedule a call, or move the lead to a different nurturing track. This 
                  intelligent routing ensures hot leads get immediate attention while warm leads continue 
                  to be nurtured appropriately.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Real-World Results
            </h2>
            
            <div className="space-y-8">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">B2B Service Company</h3>
                <p className="text-gray-600 leading-relaxed mb-3">
                  A B2B service company was losing 70% of leads because they couldn't follow up consistently. 
                  After implementing AI Follow-Up System, they saw a 45% increase in lead conversion rates. 
                  The system automatically nurtured leads for weeks, providing value and building relationships 
                  until leads were ready to buy.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  The company's sales team now focuses on hot leads while the AI handles nurturing for 
                  warm and cold leads. This division of labor increased overall sales productivity by 60% 
                  and reduced the sales cycle length by 30%, as leads were better qualified and more 
                  engaged when they reached the sales team.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">E-commerce Business</h3>
                <p className="text-gray-600 leading-relaxed mb-3">
                  An e-commerce business used AI Follow-Up System to re-engage customers who abandoned 
                  shopping carts. The system sent personalized follow-ups with product recommendations, 
                  special offers, and helpful information. Cart abandonment recovery increased from 5% 
                  to 18%, generating $45,000 in additional monthly revenue.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  The follow-ups weren't just promotional—they provided value through product tips, 
                  usage guides, and customer success stories. This value-first approach built trust and 
                  encouraged purchases without feeling pushy or salesy.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Best Practices Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Best Practices for Follow-Up Success
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Provide Value First</h3>
                <p className="text-gray-600">
                  Every follow-up should provide value to the lead, whether it's helpful information, 
                  industry insights, case studies, or useful resources. Leads are more likely to engage 
                  with content that helps them rather than just promotional messages.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Vary Your Messages</h3>
                <p className="text-gray-600">
                  Don't send the same message repeatedly. Vary the content, format, and approach to 
                  keep leads engaged. Mix educational content, case studies, special offers, and direct 
                  calls-to-action to maintain interest.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Respect Opt-Outs</h3>
                <p className="text-gray-600">
                  Always provide easy opt-out options and respect them immediately. Maintaining a 
                  positive relationship with leads who aren't ready is important—they may become 
                  customers in the future or refer others.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Track & Optimize</h3>
                <p className="text-gray-600">
                  Monitor which follow-ups get the best response and optimize your sequences accordingly. 
                  The AI system learns from results and improves over time, but you can also manually 
                  adjust based on your insights and business goals.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How many follow-ups should I send?</h3>
                <p className="text-gray-600">
                  Research shows that 80% of sales require 5 follow-ups, yet most businesses give up 
                  after 2. The AI Follow-Up System can continue nurturing leads for as long as needed, 
                  adapting the frequency and content based on engagement levels. The system will 
                  automatically reduce frequency if a lead isn't engaging and increase it if they show 
                  interest.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Will leads know it's automated?</h3>
                <p className="text-gray-600">
                  The messages are designed to feel natural and human-like. However, you can choose to 
                  be transparent about using AI assistance or present it as your team. Many businesses 
                  find that being transparent builds trust, while others prefer a more human presentation. 
                  The choice is yours.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I customize follow-up sequences?</h3>
                <p className="text-gray-600">
                  Yes. You can create custom follow-up sequences for different lead types, industries, 
                  or stages in the buyer's journey. The system allows full customization while providing 
                  AI-powered optimization suggestions based on best practices and your results.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What happens when a lead responds?</h3>
                <p className="text-gray-600">
                  When a lead responds or shows buying signals, the system can automatically notify your 
                  sales team, schedule a call, move the lead to a different nurturing track, or continue 
                  the conversation via AI. You configure how different types of responses are handled based 
                  on your sales process.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AIFollowUpSystemPage;

