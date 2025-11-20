import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Phone, CheckCircle, TrendingUp, Zap, Users, HelpCircle, Clock as ClockIcon, AlertCircle, Globe } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';

const AIAgentComparison: React.FC = () => {
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
              <span className="font-semibold">Comparison Guide</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              AI Agent Comparison: <span className="text-blue-600">Boltcall</span> vs. Traditional Call Centers
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>February 10, 2025</span>
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
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Boltcall AI Agent</th>
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Traditional Call Center</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Cost per month</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">$99-200/month</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">$2,000-5,000/month</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Response time</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">
                    <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                      <Zap className="w-4 h-4" />
                      Instant (0-5 seconds)
                    </span>
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">
                    <span className="inline-flex items-center gap-1 text-orange-600 font-semibold">
                      <ClockIcon className="w-4 h-4" />
                      2-5 minutes average
                    </span>
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Quality</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Consistent, professional, never tired</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Varies by agent, training, and time of day</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Availability</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">
                    <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                      <Globe className="w-4 h-4" />
                      24/7/365
                    </span>
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Business hours only (typically 8am-6pm)</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Missed-lead rate</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">
                    <span className="text-green-600 font-semibold">0% (never misses a call)</span>
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">
                    <span className="text-red-600 font-semibold">30-50% during peak hours</span>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Setup time</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">30 minutes</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">2-4 weeks</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">Multi-channel support</td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">
                    <span className="text-green-600 font-semibold">Calls, SMS, forms, follow-ups</span>
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-700">Phone calls only</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Pros and Cons */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            Pros and Cons
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* AI Agents */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">AI Agents</h3>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Pros
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">•</span>
                    <span>Instant response (0-5 seconds)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">•</span>
                    <span>24/7 availability, never closes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">•</span>
                    <span>Affordable ($99-200/month)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">•</span>
                    <span>Handles multiple channels (calls, SMS, forms)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">•</span>
                    <span>Consistent quality, never tired or stressed</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">•</span>
                    <span>Automated follow-ups and reminders</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">•</span>
                    <span>Quick setup (30 minutes)</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Cons
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2 mt-1">•</span>
                    <span>May struggle with very complex, multi-step sales processes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2 mt-1">•</span>
                    <span>Less personal touch than human agents</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2 mt-1">•</span>
                    <span>Requires initial setup and configuration</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Call Centers */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Call Centers</h3>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Pros
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">•</span>
                    <span>Human touch and empathy</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">•</span>
                    <span>Can handle very complex sales processes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">•</span>
                    <span>Good for long qualification calls</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">•</span>
                    <span>Can adapt to unique situations</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Cons
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2 mt-1">•</span>
                    <span>Expensive ($2,000-5,000/month + per-minute fees)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2 mt-1">•</span>
                    <span>Business hours only (misses after-hours leads)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2 mt-1">•</span>
                    <span>Wait times (2-5 minutes average)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2 mt-1">•</span>
                    <span>High missed-call rate (30-50% during peak)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2 mt-1">•</span>
                    <span>Quality varies by agent and training</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2 mt-1">•</span>
                    <span>Long setup time (2-4 weeks)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2 mt-1">•</span>
                    <span>Phone calls only (no SMS, forms, or automated follow-ups)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2 mt-1">•</span>
                    <span>Agent turnover affects consistency</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* When Boltcall Wins */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            When Boltcall Wins
          </h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Immediate Response</h3>
                  <p className="text-gray-700 leading-relaxed">
                    While call centers make customers wait 2-5 minutes (or longer during peak times), Boltcall's AI 
                    answers every call instantly—within 0-5 seconds. Research shows that responding within 60 seconds 
                    increases conversion rates by 391%. With Boltcall, you never miss that critical window.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Availability</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Traditional call centers operate during business hours (typically 8am-6pm). That means 66% of 
                    the day, your leads are going unanswered. Boltcall works 24/7/365—answering calls at 11 PM on Sunday, 
                    on holidays, and during lunch breaks. Your business never closes, so your customer service shouldn't either.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Automated Follow-ups</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Call centers handle the initial call, but then what? Someone has to manually follow up, send reminders, 
                    and nurture leads. Boltcall automates all of this—sending SMS reminders, following up on form submissions, 
                    and keeping conversations warm. It's like having a full customer service team that never sleeps.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Works with Forms, SMS, Calls</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Call centers only handle phone calls. Boltcall handles calls, SMS messages, form submissions, and 
                    website chat—all in one platform. When a lead fills out a form on your website at 2 AM, Boltcall 
                    responds instantly via SMS. When someone texts you, Boltcall handles it. It's a complete customer 
                    engagement system, not just a phone service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* When Call Centers Might Be Better */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            When Call Centers Might Be Better
          </h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Very Complex Sales Processes</h3>
                  <p className="text-gray-700 leading-relaxed">
                    If your sales process requires multiple back-and-forth conversations, extensive customization, or 
                    complex negotiations that can't be automated, a human call center might be better. However, for most 
                    local service businesses (dental, HVAC, auto repair, etc.), AI agents handle the vast majority of 
                    inquiries perfectly.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ClockIcon className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Long Qualification Calls</h3>
                  <p className="text-gray-700 leading-relaxed">
                    If your typical sales call takes 30+ minutes and requires deep relationship building, human agents 
                    might be more effective. But for most businesses, the majority of calls are quick inquiries that AI 
                    handles excellently—and AI can always transfer complex calls to your team.
                  </p>
                </div>
              </div>
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
            <div>
              <div className="flex items-start gap-4">
                <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Does an AI agent replace a receptionist?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    For most local businesses, yes—AI agents can handle 80-90% of receptionist tasks. They answer calls, 
                    schedule appointments, answer questions, and handle follow-ups. However, AI agents work best when they 
                    can transfer complex calls to your team. Think of it as having a receptionist that never sleeps, never 
                    takes breaks, and never misses a call—but can still hand off to humans when needed.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-4">
                <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Is AI reliable with accents and languages?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Modern AI agents, including Boltcall, are trained on diverse accents and can handle multiple languages. 
                    They're often more consistent than human agents who might struggle with unfamiliar accents. Boltcall 
                    supports multiple languages and can be configured for your specific customer base. If you serve a 
                    multilingual community, AI agents can actually be more reliable than call centers that may not have 
                    agents fluent in all languages you need.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-4">
                <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Can I use both AI and a call center?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Absolutely. Many businesses use AI agents for initial contact and basic inquiries, then transfer 
                    complex calls to human agents or call centers. This hybrid approach gives you the best of both worlds: 
                    instant response and 24/7 coverage from AI, plus human touch for complex situations. Boltcall can 
                    seamlessly transfer calls to your team or a call center when needed.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-4">
                <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    What happens if the AI can't answer a question?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Boltcall is designed to handle most common inquiries, but when it encounters something it can't handle, 
                    it can transfer the call to your team, take a message, or schedule a callback. You can also configure 
                    it to escalate specific types of inquiries automatically. The goal is to handle 80-90% of calls 
                    automatically, freeing your team to focus on the complex cases that truly need human attention.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </article>

      <Footer />
    </div>
  );
};

export default AIAgentComparison;

