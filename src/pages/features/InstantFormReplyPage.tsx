import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, Phone, Calendar } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import GiveawayBar from '../../components/GiveawayBar';
import { Link } from 'react-router-dom';
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
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight flex items-center justify-center gap-3">
              <div className="w-1 h-16 bg-blue-600 rounded-full"></div>
              <span>Turn Form Submissions into <span className="text-blue-600">Instant Conversations</span></span>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What is Instant Form Reply?
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                Instant Form Reply automatically responds to every form submission on your website within seconds. 
                Instead of leaving customers waiting for a response, your AI immediately acknowledges their inquiry, 
                asks qualifying questions, and can even book appointments directly.
              </p>
              <p className="text-lg">
                Whether it's a contact form, quote request, consultation booking, or any other form on your site, 
                Instant Form Reply ensures every lead gets instant attention and professional follow-up. The system 
                works seamlessly with any form platform, including contact forms, lead generation forms, quote requests, 
                consultation bookings, and more.
              </p>
              <p className="text-lg">
                When a form is submitted, the AI instantly analyzes the information provided, personalizes the response 
                based on the customer's specific inquiry, and engages them in a natural conversation. This immediate 
                interaction keeps the customer engaged while they're still on your website, significantly increasing 
                the likelihood of conversion.
              </p>
              <p className="text-lg">
                The system can also intelligently route inquiries to the right department or person, schedule appointments 
                directly into your calendar, and even provide instant answers to common questions—all without any manual 
                intervention from your team.
              </p>
            </div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Why Instant Form Reply is Critical
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  The 60-Second Rule
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Research shows that <strong>responding within 60 seconds increases conversion by 391%</strong>. 
                  Most businesses take hours or days to respond to form submissions, losing potential customers 
                  to competitors who respond faster. Instant Form Reply ensures you're always first.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  The difference between responding in 60 seconds versus 60 minutes is dramatic. Customers who receive 
                  instant responses feel valued and prioritized, which builds trust and increases their likelihood of 
                  choosing your business. The longer they wait, the more time they have to research competitors and 
                  find alternatives.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Form Abandonment is Real
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  When customers submit a form and don't hear back quickly, they assume you're not interested 
                  or too busy. <strong>68% of customers will move on to a competitor</strong> if they don't receive 
                  a response within 24 hours. Instant Form Reply eliminates this risk entirely.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  Form abandonment isn't just about losing a single lead—it's about losing potential long-term customers. 
                  When someone takes the time to fill out your form, they're showing genuine interest. If that interest 
                  isn't immediately acknowledged and nurtured, it quickly fades. Instant response keeps the momentum 
                  going and maintains the customer's engagement with your brand.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Professional First Impression
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  An instant, personalized response shows professionalism and attention to detail. 
                  It sets the tone for your entire customer relationship and demonstrates that you value 
                  their time and business.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  First impressions matter, and in the digital age, your first impression is often your form response. 
                  A professional, instant response creates a positive association with your brand from the very beginning. 
                  It shows that you're organized, responsive, and committed to customer service—qualities that customers 
                  value and remember when making purchasing decisions.
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              How Instant Form Reply Helps Your Business
            </h2>
            
            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Instant Engagement
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Respond to every form submission within seconds, keeping leads engaged and moving them 
                  through your sales funnel immediately. The instant response maintains the customer's momentum 
                  and interest, preventing them from getting distracted or moving on to a competitor.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  This immediate engagement also allows you to capture more information about the lead while they're 
                  still engaged. The AI can ask follow-up questions, clarify needs, and gather additional details 
                  that help you better serve the customer and close the sale.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Lead Qualification
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Automatically ask qualifying questions to determine lead quality and buying intent, 
                  so you focus on the most promising opportunities. The AI can intelligently assess 
                  the customer's needs, budget, timeline, and decision-making authority.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  This qualification process saves your sales team valuable time by filtering out low-quality 
                  leads and identifying high-value prospects. The system can also score leads based on their 
                  responses, helping you prioritize follow-up efforts and allocate resources more effectively.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Automatic Booking
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Book appointments directly from form submissions without any manual intervention. 
                  The AI handles scheduling and sends confirmations automatically. It can check your 
                  calendar availability, suggest optimal times, and confirm appointments instantly.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  This seamless booking process eliminates the back-and-forth typically required to schedule 
                  appointments, reducing friction in the customer journey and increasing conversion rates. 
                  Customers can book immediately while they're still engaged, rather than waiting for email 
                  responses and potentially losing interest.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  24/7 Coverage
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Forms are submitted at all hours. Instant Form Reply ensures every submission gets 
                  immediate attention, even on weekends and holidays. This 24/7 coverage means you never 
                  miss an opportunity, regardless of when a customer decides to reach out.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  Many customers research and make purchasing decisions outside of traditional business hours. 
                  By providing instant responses at any time, you capture leads that would otherwise be lost 
                  to competitors who are only available during business hours. This around-the-clock availability 
                  gives you a significant competitive advantage.
                </p>
              </div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="my-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-8 w-full max-w-[800px] group hover:bg-gray-50 transition duration-500 hover:duration-200">
            <div className="flex justify-center isolate">
              <div className="bg-white size-12 grid place-items-center rounded-xl relative left-2.5 top-1.5 -rotate-6 shadow-lg ring-1 ring-gray-200 group-hover:-translate-x-5 group-hover:-rotate-12 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div className="bg-white size-12 grid place-items-center rounded-xl relative z-10 shadow-lg ring-1 ring-gray-200 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
                <Phone className="w-6 h-6 text-blue-500" />
              </div>
              <div className="bg-white size-12 grid place-items-center rounded-xl relative right-2.5 top-1.5 rotate-6 shadow-lg ring-1 ring-gray-200 group-hover:translate-x-5 group-hover:rotate-12 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <h2 className="text-gray-900 font-medium mt-4 text-4xl">Fast. Simple. Scalable.</h2>
            <p className="text-base text-gray-600 mt-2 whitespace-pre-line">Launch an AI agent in 5 minutes at no cost. Connect it to all your business channels.</p>
            <Link
              to="/setup"
              className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start the free setup
            </Link>
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default InstantFormReplyPage;

