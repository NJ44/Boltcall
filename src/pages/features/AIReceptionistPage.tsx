import React, { useEffect } from 'react';
import { updateMetaDescription } from '../../lib/utils';
import { motion } from 'framer-motion';
import { Phone, Users, Calendar } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import GiveawayBar from '../../components/GiveawayBar';
import Breadcrumbs from '../../components/Breadcrumbs';
import { Link } from 'react-router-dom';
import { WavePath } from '../../components/ui/wave-path';

const AIReceptionistPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'AI Receptionist for Calls & Messages | Boltcall';
    updateMetaDescription('AI receptionist handles calls and messages 24/7. Never miss a call, book appointments automatically, capture leads. Start free today.');
  }, []);
  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs items={[
            { label: 'Home', href: '/' },
            { label: 'Features', href: '/features' },
            { label: 'AI Receptionist', href: '/features/ai-receptionist' }
          ]} />
          <div className="text-center">
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 flex items-start gap-3">
              <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
              <span>What is AI Receptionist?</span>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
              <span>Why AI Receptionist is Critical</span>
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
              <span>How AI Receptionist Helps Your Business</span>
            </h2>
            
            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
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

      {/* Use Cases Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
              <span>Real-World Use Cases</span>
            </h2>
            
            <div className="space-y-8">
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Dental Practice</h3>
                <p className="text-gray-600 leading-relaxed mb-3">
                  A dental practice receives 200 calls per month. Before implementing an AI receptionist, 
                  they missed 30% of calls during peak hours and after hours. The AI now answers every call, 
                  schedules appointments, sends reminders, and handles insurance questions. Result: 100% call 
                  answer rate, 25% increase in new patient bookings, and $15,000 saved annually on receptionist costs.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  The AI handles common questions about services, insurance acceptance, office hours, and 
                  appointment availability. It can also provide directions to the office, explain preparation 
                  requirements for procedures, and send post-appointment follow-up messages. This comprehensive 
                  coverage ensures patients always get the information they need, when they need it.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Legal Firm</h3>
                <p className="text-gray-600 leading-relaxed mb-3">
                  A small law firm was losing potential clients because calls went to voicemail after hours. 
                  The AI receptionist now answers calls 24/7, qualifies leads by asking about case type and 
                  urgency, and schedules consultations. The firm saw a 40% increase in consultation bookings 
                  and converted 15% more leads into clients.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  The AI can handle initial intake questions, explain the consultation process, provide 
                  information about practice areas, and even collect basic case information before routing 
                  to an attorney. For urgent matters, it can immediately connect callers to the on-call 
                  attorney or schedule same-day consultations when available.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Home Services Business</h3>
                <p className="text-gray-600 leading-relaxed mb-3">
                  A home services company was missing calls during service appointments when staff were 
                  on-site. The AI receptionist now handles all incoming calls, schedules service appointments, 
                  provides quotes, and even handles emergency calls. This resulted in 50% more bookings and 
                  eliminated the need for a dedicated call center.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  The system can provide service area information, explain different service packages, 
                  schedule appointments based on technician availability, and send confirmation messages 
                  with service details. For emergency calls, it can immediately route to the appropriate 
                  technician or schedule urgent appointments.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
              <span>How AI Receptionist Works</span>
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Step 1: Call Reception
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  When a call comes in, the AI receptionist answers immediately with a professional greeting. 
                  It identifies itself and your business name, creating a welcoming first impression. The system 
                  uses natural language processing to understand the caller's intent, whether they're looking to 
                  schedule an appointment, ask a question, or speak with someone specific.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  The AI can recognize different types of calls: new customer inquiries, existing customer 
                  questions, appointment requests, billing inquiries, and more. It adapts its approach based 
                  on the call type, ensuring each caller receives appropriate and relevant assistance.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Step 2: Intelligent Conversation
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  The AI engages in natural conversation, asking relevant questions to understand the caller's 
                  needs. It can answer frequently asked questions, provide information about your services, 
                  explain pricing, and handle common inquiries without human intervention. The conversation feels 
                  natural and human-like, not robotic.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  Advanced natural language understanding allows the AI to handle complex queries, understand 
                  context, and maintain conversation flow. It can remember information mentioned earlier in the 
                  conversation, follow up on previous points, and adapt its responses based on the caller's 
                  responses and tone.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Step 3: Lead Qualification
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  For potential customers, the AI asks qualifying questions to determine buying intent, budget, 
                  timeline, and specific needs. This information is automatically logged in your CRM, helping 
                  you prioritize follow-ups and focus on the most promising leads. The qualification process 
                  is conversational and non-intrusive, gathering information naturally during the conversation.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  The system can score leads based on their responses, identifying high-value prospects that 
                  need immediate attention. It can also identify low-quality leads or spam calls, saving your 
                  team time and resources. All qualification data is stored and accessible for your sales team 
                  to review and act upon.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Step 4: Appointment Scheduling
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  When a caller wants to schedule an appointment, the AI checks your calendar in real-time, 
                  identifies available time slots, and offers options that work for both you and the customer. 
                  It can handle rescheduling requests, cancellations, and even suggest alternative times if 
                  the preferred slot isn't available.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  The scheduling process is seamless and efficient. The AI confirms appointment details, sends 
                  automatic confirmation messages via SMS or email, and adds the appointment to your calendar. 
                  It can also send reminder messages before appointments to reduce no-shows and ensure customers 
                  are prepared.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Step 5: Call Routing & Escalation
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  For calls that require human attention, the AI can intelligently route to the right person 
                  or department. It can also take detailed messages, schedule callbacks, or escalate urgent 
                  matters. The system learns from your preferences and routing rules, improving its routing 
                  decisions over time.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  The AI can determine when a call should be transferred based on complexity, customer request, 
                  or predefined rules. It provides context to the human agent when transferring, ensuring a 
                  smooth handoff and avoiding the need for customers to repeat information. This creates a 
                  seamless experience that combines the efficiency of AI with the personal touch of human 
                  interaction when needed.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features & Capabilities Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
              <span>Key Features & Capabilities</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Natural Language Understanding</h3>
                <p className="text-gray-600 text-sm">
                  Understands context, intent, and nuance in conversations. Handles complex queries and 
                  maintains natural conversation flow.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Language Support</h3>
                <p className="text-gray-600 text-sm">
                  Communicate with customers in multiple languages, expanding your reach and serving 
                  diverse customer bases.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">CRM Integration</h3>
                <p className="text-gray-600 text-sm">
                  Automatically syncs call data, lead information, and appointment details with your 
                  existing CRM system.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Transcription</h3>
                <p className="text-gray-600 text-sm">
                  Every call is transcribed and stored, providing a searchable record of all customer 
                  interactions for review and analysis.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics & Insights</h3>
                <p className="text-gray-600 text-sm">
                  Detailed analytics on call volume, call duration, conversion rates, and customer 
                  satisfaction help you optimize your operations.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Customizable Voice & Tone</h3>
                <p className="text-gray-600 text-sm">
                  Choose from different voice options and customize the tone to match your brand 
                  personality and industry standards.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
              <span>Return on Investment</span>
            </h2>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 border border-blue-100">
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Let's calculate the ROI for a typical business. Assume you receive 150 calls per month, 
                with an average customer value of $400. Before implementing an AI receptionist, you were 
                missing 25% of calls (37.5 calls per month), resulting in $15,000 in lost revenue monthly 
                ($180,000 annually).
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                With an AI receptionist answering 100% of calls, you capture all those leads. Even if only 
                30% convert (11.25 customers), that's $4,500 in additional monthly revenue ($54,000 annually). 
                Additionally, you save $35,000 annually on receptionist costs. Total benefit: $89,000 per year.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                The AI receptionist pays for itself many times over, while providing better service coverage 
                than a human receptionist could ever provide. The investment is minimal compared to the returns, 
                making it one of the highest-ROI investments you can make for your business.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
              <span>Frequently Asked Questions</span>
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can the AI handle complex questions?</h3>
                <p className="text-gray-600">
                  Yes. The AI uses advanced natural language processing to understand context and handle 
                  complex queries. For questions it can't answer, it can take detailed messages, schedule 
                  callbacks, or route to a human agent with full context.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What if a customer wants to speak to a real person?</h3>
                <p className="text-gray-600">
                  The AI can transfer calls to human agents at any time. You can set rules for when transfers 
                  should happen (e.g., during business hours, for urgent matters, or when requested). The AI 
                  provides context to the human agent, ensuring smooth handoffs.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How does it integrate with my existing systems?</h3>
                <p className="text-gray-600">
                  The AI receptionist integrates with popular calendar systems (Google Calendar, Outlook), 
                  CRM platforms (Salesforce, HubSpot), and phone systems. It can also integrate with custom 
                  systems via API, ensuring seamless workflow integration.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Is it difficult to set up?</h3>
                <p className="text-gray-600">
                  Not at all. Setup takes about 5 minutes. You provide basic information about your business, 
                  connect your calendar, and customize the AI's responses. No technical expertise required. 
                  The system is ready to start answering calls immediately after setup.
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
              to="/coming-soon"
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

