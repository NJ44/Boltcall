import React, { useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Brain, Zap, CheckCircle, Mic, TrendingUp, Users, Phone } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';
import ReadingProgress from '../components/ReadingProgress';

const BlogAIReceptionistHowItWorks: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'How Does an AI Receptionist Work? Complete Technical Guide | Boltcall';
    updateMetaDescription('How does an AI receptionist work? Complete technical guide explaining natural language processing and automation.');
    
    // Add Article schema markup
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "How Does an AI Receptionist Work? A Complete Technical Guide",
      "description": "How does an AI receptionist work? Complete technical guide explaining natural language processing and automation.",
      "author": {
        "@type": "Organization",
        "name": "Boltcall"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Boltcall",
        "logo": {
          "@type": "ImageObject",
          "url": "https://boltcall.org/boltcall_full_logo.png"
        }
      },
      "datePublished": "2025-02-10",
      "dateModified": "2025-02-10",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://boltcall.org/blog/how-ai-receptionist-works"
      },
      "image": {
        "@type": "ImageObject",
        "url": "https://boltcall.org/og-image.jpg"
      }
    };

    const existingScript = document.getElementById('article-schema');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.id = 'article-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(articleSchema);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('article-schema');
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />
      <ReadingProgress />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-8 bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left mb-4"
          >
            <div className="inline-flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full mb-6">
              <Brain className="w-4 h-4" />
              <span className="font-semibold">AI Technology</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              How Does an <span className="text-blue-600">AI Receptionist</span> Work? A Complete Technical Guide
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>February 10, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>5 min read</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="prose prose-lg max-w-none mb-12"
        >
          <p className="text-xl text-gray-700 leading-relaxed font-medium">
            You've heard about AI receptionists answering calls, booking appointments, and handling customer inquiries—but how do they actually work? This guide breaks down the technology and processes that power modern AI receptionist systems, from speech recognition to intelligent response generation.
          </p>
        </motion.div>

        {/* Key Points Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-start gap-3">
            <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
            How AI Receptionists Work: At a Glance
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-gray-900">
                <Mic className="w-5 h-5 text-blue-600" />
                Voice Processing
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Converts speech to text in real-time</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Natural language understanding</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Context-aware conversation flow</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-gray-900">
                <Brain className="w-5 h-5 text-blue-600" />
                AI Intelligence
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Large Language Models (LLMs) for reasoning</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Knowledge base integration</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Dynamic response generation</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-gray-900">
                <Zap className="w-5 h-5 text-blue-600" />
                Action Execution
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Calendar integration for bookings</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>CRM updates and lead capture</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Real-time notifications to you</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Section 1: The Call Flow */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-start gap-3">
            <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
            What Happens When a Call Comes In
          </h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              When someone calls your business, the AI receptionist processes the call through several integrated steps that happen in real-time:
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-2 flex items-center gap-2">
              <Mic className="w-6 h-6 text-blue-600" />
              1. Speech Recognition & Understanding
            </h3>
            <p>
              As the caller speaks, Automatic Speech Recognition (ASR) technology converts their words into text using neural networks trained on millions of hours of speech. The system handles accents, background noise, and natural conversation flow.
            </p>
            <p>
              Natural Language Understanding (NLU) then analyzes the text to determine intent, extract key information (dates, services, names), and understand context. For example, "I need to reschedule for next week" is understood as: modify existing appointment, timeframe is next week, and the caller already has a booking.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-2 flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-600" />
              2. Knowledge Base Search & Response Generation
            </h3>
            <p>
              The AI searches your business knowledge base using semantic search—understanding meaning, not just keywords. If someone asks "What are your hours?" it finds information about business hours even if those exact words aren't in your database.
            </p>
            <p>
              Large Language Models (LLMs) like GPT-4 then generate natural, conversational responses that match your business tone, include relevant details, and maintain professional conversation. The response is converted to speech using Text-to-Speech (TTS) technology that sounds genuinely human.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-2 flex items-center gap-2">
              <Zap className="w-6 h-6 text-blue-600" />
              3. Action Execution
            </h3>
            <p>
              When the conversation requires action, the AI executes tasks automatically through API integrations:
            </p>
            <ul className="space-y-2 text-gray-700 my-4 ml-4">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Calendar Integration:</strong> Checks availability, books appointments, sends confirmations</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>CRM Updates:</strong> Creates customer records with conversation details</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Notifications:</strong> Alerts you via SMS, email, or app notifications</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Follow-ups:</strong> Schedules reminders and automated follow-up messages</span>
              </li>
            </ul>
            <p>
              By the time the call ends, appointments are booked, leads are captured, and you're notified—all seamlessly integrated into your existing systems.
            </p>
          </div>
        </motion.section>

        {/* Section 2: How AI Learns Your Business */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-start gap-3">
            <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
            How AI Receptionists Learn Your Business
          </h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              AI receptionists learn your business through initial setup and continuous improvement:
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-2">Initial Setup</h3>
            <p>
              When you first set up an AI receptionist, you provide your business information: services, pricing, hours, location, FAQs, and conversation scripts. This creates your knowledge base that the AI references during calls.
            </p>
            <p>
              You also configure business rules—when to transfer calls, what questions to ask for lead qualification, and how to handle different scenarios. This initial setup typically takes 30 minutes or less.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-2">Continuous Learning</h3>
            <p>
              Every conversation becomes a learning opportunity. The AI analyzes successful interactions, identifies common questions and patterns, and adapts its responses over time. It learns your specific terminology, service names, and business processes, getting more accurate with each call.
            </p>
          </div>
        </motion.section>

        {/* Section 4: The Business Impact */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-start gap-3">
            <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
            Why This Technology Matters
          </h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              Understanding how AI receptionists work reveals their real business value:
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-2 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Speed = Revenue
            </h3>
            <p>
              Research shows responding to leads within 60 seconds increases conversion rates by 391%. AI receptionists answer instantly, 24/7, ensuring you never miss an opportunity.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-2 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-blue-600" />
              Consistency & Scalability
            </h3>
            <p>
              Every caller gets the same high-quality experience, whether you receive 10 calls or 1000. The AI is always professional, accurate, and never gets overwhelmed during busy periods.
            </p>
          </div>
        </motion.section>

        {/* Conclusion */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-start gap-3">
            <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
            The Bottom Line
          </h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              AI receptionists combine cutting-edge technology—speech recognition, natural language understanding, large language models, and semantic search—to create intelligent systems that genuinely understand and help your customers. They're not automated phone trees; they learn your business, adapt to your needs, and provide real value.
            </p>
            <p>
              The technology is sophisticated, but the result is simple: your customers get instant, helpful responses 24/7, and you get more bookings, better lead capture, and more time to focus on growing your business.
            </p>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="my-16"
        >
          <div className="flex flex-col items-center justify-center text-center">
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
                className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 hover:text-gray-900 h-10 px-4 py-2 shadow-sm active:shadow-none"
              >
                Start the free setup
              </Link>
            </div>
          </div>
        </motion.section>
      </article>

      <Footer />
    </div>
  );
};

export default BlogAIReceptionistHowItWorks;

