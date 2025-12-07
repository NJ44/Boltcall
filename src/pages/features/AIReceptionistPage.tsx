import React, { useEffect } from 'react';
import { updateMetaDescription } from '../../lib/utils';
import { motion } from 'framer-motion';
import { Phone, Users, Calendar } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import GiveawayBar from '../../components/GiveawayBar';
import { Link } from 'react-router-dom';
import { WavePath } from '../../components/ui/wave-path';

const AIReceptionistPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'AI Receptionist for Calls & Messages | Boltcall';
    updateMetaDescription('AI receptionist answers phone calls 24/7. Handles customer questions, schedules appointments automatically, never misses a call.');
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
              <Phone className="w-4 h-4" />
              <span className="font-semibold">AI Receptionist</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight flex items-center justify-center gap-3">
              <div className="w-1 h-16 bg-blue-600 rounded-full"></div>
              <span>Never Miss a Call with <span className="text-blue-600">AI Receptionist</span></span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Your AI receptionist answers calls 24/7, schedules appointments, and provides instant support—so you never miss an opportunity.
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
              What is AI Receptionist?
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                AI Receptionist is an intelligent virtual assistant that handles all your incoming calls automatically. 
                Using advanced natural language processing and machine learning, it understands customer inquiries, 
                answers questions, schedules appointments, and routes calls—all without human intervention.
              </p>
              <p className="text-lg">
                Unlike traditional voicemail or call centers, your AI receptionist engages in natural conversations, 
                qualifies leads, and provides instant responses 24 hours a day, 7 days a week. It's powered by cutting-edge 
                artificial intelligence that learns from every interaction, continuously improving its ability to understand 
                context, handle complex requests, and provide accurate information.
              </p>
              <p className="text-lg">
                The system integrates seamlessly with your existing business tools, including your calendar, CRM, and 
                customer database. When a call comes in, the AI receptionist can access relevant information about the caller, 
                check your availability, and make intelligent decisions about how to best serve the customer—all in real-time.
              </p>
              <p className="text-lg">
                Whether it's answering frequently asked questions, scheduling appointments, qualifying leads, or routing 
                urgent calls to the right person, your AI receptionist handles it all with the professionalism and consistency 
                that builds customer trust and loyalty.
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
                  <p className="text-gray-500 text-sm mt-2">Seamless customer experience</p>
                  <p className="text-gray-800 ml-8 w-3/4 text-lg md:text-xl">
                    From the moment a call comes in, your AI receptionist provides a smooth, 
                    professional experience that converts leads into customers.
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
              Why AI Receptionist is Critical
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  The Cost of Missed Calls
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Studies show that <strong>75% of customers won't call back</strong> if their first call goes unanswered. 
                  For a business receiving 100 calls per month, that's potentially 75 lost opportunities. 
                  At an average customer value of $500, that's $37,500 in lost revenue monthly—$450,000 annually.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  Beyond the immediate financial impact, missed calls damage your reputation. Customers who can't reach you 
                  assume you're unprofessional, too busy, or don't care about their business. This negative perception spreads 
                  through word-of-mouth and online reviews, creating a ripple effect that can take months or years to repair.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  24/7 Availability Matters
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Your customers don't only call during business hours. <strong>40% of inquiries happen after hours</strong>, 
                  on weekends, or during holidays. An AI receptionist ensures every call is answered immediately, 
                  regardless of when it comes in, capturing leads that would otherwise be lost.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  Modern consumers expect instant responses, regardless of the time or day. When someone is ready to make 
                  a purchase decision, they want to act immediately. If they can't reach you, they'll move on to a competitor 
                  who is available. An AI receptionist eliminates this barrier, ensuring you never miss an opportunity because 
                  of timing.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Competitive Advantage
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  While competitors rely on voicemail or limited hours, you provide instant, professional service. 
                  This creates a <strong>significant competitive advantage</strong> and positions your business as modern, 
                  responsive, and customer-focused.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  In today's competitive marketplace, differentiation is key. An AI receptionist demonstrates that you're 
                  forward-thinking and committed to providing exceptional customer service. This technology-forward approach 
                  attracts customers who value efficiency and innovation, setting you apart from businesses that still rely 
                  on outdated communication methods.
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
              How AI Receptionist Helps Your Business
            </h2>
            
            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Capture Every Lead
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Never lose a potential customer again. Every call is answered, every inquiry is handled, 
                  and every lead is captured and qualified automatically. The AI receptionist doesn't just answer 
                  calls—it actively engages with callers, asks qualifying questions, gathers important information, 
                  and ensures that every interaction moves the customer closer to making a purchase decision.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  The system automatically logs all interactions in your CRM, creating a complete record of every customer 
                  touchpoint. This comprehensive data helps you understand your customers better, identify patterns in their 
                  needs, and tailor your marketing and sales efforts accordingly.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Instant Response
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Respond to customers in seconds, not hours. Research shows that responding within 60 seconds 
                  increases conversion rates by 391%. The AI receptionist provides this instant response consistently, 
                  ensuring that every caller receives immediate attention and professional service.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  Speed matters because customer attention spans are short. When someone calls your business, they're 
                  actively engaged and ready to make a decision. The longer they wait, the more likely they are to 
                  reconsider, get distracted, or choose a competitor. Instant response keeps the momentum going and 
                  increases the likelihood of conversion.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Automatic Scheduling
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Book appointments directly into your calendar without any manual work. The AI handles 
                  availability checks and confirms appointments instantly. It can view your calendar in real-time, 
                  identify available time slots, and offer options that work for both you and the customer.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  The system also sends automatic confirmation messages via SMS or email, reducing no-shows and ensuring 
                  customers have all the information they need. If a customer needs to reschedule, the AI can handle that 
                  too, finding alternative times and updating the calendar automatically.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Cost Savings
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Replace expensive call center staff or receptionists. An AI receptionist costs a fraction 
                  while providing better coverage and consistency. Unlike human staff, the AI never gets tired, 
                  never takes breaks, and never has an off day. It provides the same high-quality service 
                  consistently, 24/7/365.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  The cost savings are substantial. A full-time receptionist can cost $30,000-$50,000 annually, 
                  plus benefits, training, and management overhead. An AI receptionist provides better coverage 
                  (24/7 vs. 40 hours per week) at a fraction of the cost, while eliminating the challenges of 
                  staff turnover, scheduling conflicts, and performance variability.
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

export default AIReceptionistPage;

