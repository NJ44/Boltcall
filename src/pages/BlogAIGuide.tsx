import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Phone, MessageSquare, RotateCw, Bell, CheckCircle, Zap, Globe, TrendingUp, HelpCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';

const BlogAIGuide: React.FC = () => {
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
              <span className="font-semibold">Complete Guide</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              The Complete Guide to <span className="text-blue-600">AI for Local Businesses</span>
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>January 20, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>12 min read</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Key Points Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Key Points Summary</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">What AI Can Automate</h3>
                <ul className="space-y-2 text-blue-50">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Calls, SMS, follow-ups, reminders, and lead qualification</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">Costs vs Benefits</h3>
                <ul className="space-y-2 text-blue-50">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Small monthly investment saves hours daily and captures more leads</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">Where to Start</h3>
                <ul className="space-y-2 text-blue-50">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Begin with AI receptionist or SMS booking—setup takes under 30 minutes</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* What AI Can Automate */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            What AI Can Automate for Service Businesses
          </h2>
          
          <div className="space-y-8">
            {/* Calls */}
            <div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Calls</h3>
                  <p className="text-gray-700 leading-relaxed">
                    AI receptionists answer every call, 24/7. They handle inquiries, schedule appointments, 
                    answer common questions, and transfer complex issues to your team. No more missed calls, 
                    no more voicemails that never get returned. Your AI receptionist works around the clock, 
                    ensuring every customer gets immediate attention.
                  </p>
                </div>
              </div>
            </div>

            {/* SMS */}
            <div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">SMS</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Automated SMS booking lets customers schedule appointments via text message. 
                    Your AI agent handles the entire conversation, confirms availability, books the slot, 
                    and sends reminders—all without you lifting a finger. Perfect for customers who prefer 
                    texting over calling.
                  </p>
                </div>
              </div>
            </div>

            {/* Follow-ups */}
            <div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <RotateCw className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Follow-ups</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Keep conversations warm with automated follow-up sequences. Your AI reaches out to leads 
                    at the perfect time, nurtures relationships, and moves prospects through your sales funnel. 
                    Set up multi-touch campaigns that engage leads via SMS, email, or phone—all automatically.
                  </p>
                </div>
              </div>
            </div>

            {/* Reminders */}
            <div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bell className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Reminders</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Reduce no-shows by up to 90% with automated appointment reminders. Your AI sends personalized 
                    reminders via SMS or email, confirming appointments and reducing last-minute cancellations. 
                    Customize timing and messaging to match your business needs.
                  </p>
                </div>
              </div>
            </div>

            {/* Lead Qualification */}
            <div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Lead Qualification</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Instantly qualify leads as they come in. Your AI asks the right questions, determines 
                    urgency, identifies budget, and routes qualified leads directly to your calendar. 
                    No more wasting time on tire-kickers or unqualified inquiries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Benefits Explained Simply */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            Benefits Explained Simply
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Save Time</h3>
              <p className="text-gray-700 leading-relaxed">
                Automate repetitive tasks and free up 10-15 hours per week. Focus on what you do best 
                while AI handles the routine work.
              </p>
            </div>

            <div>
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Stop Missing Leads</h3>
              <p className="text-gray-700 leading-relaxed">
                Answer every call, respond to every message instantly. Never lose a lead because you 
                were too busy or it was after hours.
              </p>
            </div>

            <div>
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Book More Appointments</h3>
              <p className="text-gray-700 leading-relaxed">
                Convert more leads into booked appointments with instant responses and automated follow-ups. 
                Studies show businesses that respond in under 60 seconds book 391% more appointments.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Case Study Style Mini-Stories */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            Real Results from Real Businesses
          </h2>
          
          <div className="space-y-6">
            <div>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong className="text-gray-900">Dental Practice, Chicago:</strong> "We were losing 3-4 patients 
                per week to missed calls. After implementing Boltcall's AI receptionist, we haven't missed a single 
                call in 6 months. Our appointment bookings increased by 28%."
              </p>
            </div>

            <div>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong className="text-gray-900">HVAC Company, Dallas:</strong> "The SMS booking feature changed 
                everything. Our customers love being able to text us at any time. We've reduced no-shows by 85% 
                thanks to automated reminders, and our team saves 12 hours per week on scheduling."
              </p>
            </div>

            <div>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong className="text-gray-900">Auto Repair Shop, Phoenix:</strong> "Before AI, we'd get 20-30 
                calls per day and miss about 40% of them. Now our AI handles everything, qualifies leads, and 
                books appointments. We've increased revenue by $15,000 per month just from capturing leads we 
                used to miss."
              </p>
            </div>
          </div>
        </motion.section>

        {/* Boltcall's AI Suite */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            Boltcall's AI Suite
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">AI Receptionist</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                24/7 call handling, appointment scheduling, and customer support. Never miss a call again.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">SMS Agent</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Automated SMS conversations that book appointments, answer questions, and engage customers.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <RotateCw className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Multi-channel Follow-ups</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Automated follow-up sequences across SMS, email, and phone to nurture leads and close more deals.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Instant Form Replies</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Automatically respond to form submissions within seconds, qualifying leads and booking appointments instantly.
              </p>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Website Widget</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                AI chat widget for your website that answers visitor questions, captures leads, and books appointments 
                directly from your site—24/7.
              </p>
            </div>
          </div>
        </motion.section>

        {/* FAQ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Is AI too complicated for small businesses?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Not at all. Modern AI tools like Boltcall are designed specifically for small businesses. 
                    You don't need technical knowledge or IT support. Setup takes under 30 minutes, and our 
                    team provides free onboarding to get you started. Most business owners are up and running 
                    the same day they sign up.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    How fast can I set it up?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Most businesses are fully operational within 30 minutes. Here's what you'll do: 
                    (1) Create your AI agent with our simple setup wizard, (2) Connect your calendar 
                    (Cal.com, Google Calendar, etc.), (3) Customize your greeting and responses, 
                    (4) Go live. Our team offers free setup assistance if you need help, and we have 
                    industry-specific templates to speed things up even more.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Will customers know they're talking to AI?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our AI is designed to sound natural and professional. Many customers can't tell the 
                    difference, and those who do appreciate the instant response and 24/7 availability. 
                    You can customize the greeting to be transparent about using AI, or keep it natural—it's 
                    your choice. Either way, customers value the immediate service.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    What if I need to make changes later?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Everything is fully customizable and can be updated anytime. Change your greeting, 
                    update responses, modify business hours, or adjust settings—all from your dashboard 
                    in minutes. No need to call support or wait for updates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">
            Join thousands of local businesses using AI to save time, capture more leads, and grow their revenue.
          </p>
          <Link
            to="/dashboard"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            Start Free Trial
          </Link>
        </motion.div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogAIGuide;

