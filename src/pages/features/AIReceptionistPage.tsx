import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, ArrowRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import GiveawayBar from '../../components/GiveawayBar';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { WavePath } from '../../components/ui/wave-path';

const AIReceptionistPage: React.FC = () => {
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
              <Phone className="w-4 h-4" />
              <span className="font-semibold">AI Receptionist</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Never Miss a Call with <span className="text-blue-600">AI Receptionist</span>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
              What is AI Receptionist?
            </h2>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              AI Receptionist is an intelligent virtual assistant that handles all your incoming calls automatically. 
              Using advanced natural language processing and machine learning, it understands customer inquiries, 
              answers questions, schedules appointments, and routes calls—all without human intervention.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Unlike traditional voicemail or call centers, your AI receptionist engages in natural conversations, 
              qualifies leads, and provides instant responses 24 hours a day, 7 days a week.
            </p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
              Why AI Receptionist is Critical
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  The Cost of Missed Calls
                </h3>
                <p className="text-gray-600">
                  Studies show that <strong>75% of customers won't call back</strong> if their first call goes unanswered. 
                  For a business receiving 100 calls per month, that's potentially 75 lost opportunities. 
                  At an average customer value of $500, that's $37,500 in lost revenue monthly—$450,000 annually.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  24/7 Availability Matters
                </h3>
                <p className="text-gray-600">
                  Your customers don't only call during business hours. <strong>40% of inquiries happen after hours</strong>, 
                  on weekends, or during holidays. An AI receptionist ensures every call is answered immediately, 
                  regardless of when it comes in, capturing leads that would otherwise be lost.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Competitive Advantage
                </h3>
                <p className="text-gray-600">
                  While competitors rely on voicemail or limited hours, you provide instant, professional service. 
                  This creates a <strong>significant competitive advantage</strong> and positions your business as modern, 
                  responsive, and customer-focused.
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
              How AI Receptionist Helps Your Business
            </h2>
            
            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Capture Every Lead
                </h3>
                <p className="text-gray-600">
                  Never lose a potential customer again. Every call is answered, every inquiry is handled, 
                  and every lead is captured and qualified automatically.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Instant Response
                </h3>
                <p className="text-gray-600">
                  Respond to customers in seconds, not hours. Research shows that responding within 60 seconds 
                  increases conversion rates by 391%.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Automatic Scheduling
                </h3>
                <p className="text-gray-600">
                  Book appointments directly into your calendar without any manual work. The AI handles 
                  availability checks and confirms appointments instantly.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Cost Savings
                </h3>
                <p className="text-gray-600">
                  Replace expensive call center staff or receptionists. An AI receptionist costs a fraction 
                  while providing better coverage and consistency.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <div className="w-1 h-10 bg-blue-600 rounded-full"></div>
                Ready to Never Miss a Call Again?
              </h3>
              <p className="text-blue-100 mb-6">
                Start capturing every lead with AI Receptionist. Setup takes just minutes.
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

      <Footer />
    </div>
  );
};

export default AIReceptionistPage;

