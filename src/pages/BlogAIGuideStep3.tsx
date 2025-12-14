import React, { useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, HelpCircle, ArrowLeft, CheckCircle, Zap, Users } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';
const BlogAIGuideStep3: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Level 3: Getting Started with AI | Boltcall';
    updateMetaDescription('Step-by-step guide to implementing AI in your business, from setup to going live in under 30 minutes.');
    
    // Add Article schema markup
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Level 3: Getting Started with AI",
      "description": "Step-by-step guide to implementing AI in your business, from setup to going live in under 30 minutes.",
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
      "datePublished": "2025-02-01",
      "dateModified": "2025-02-01",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://boltcall.org/ai-guide-for-businesses/level-3-getting-started"
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
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-8 bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left mb-4"
          >
            <Link 
              to="/blog/ai-guide-for-businesses" 
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Guide Overview</span>
            </Link>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Getting Started with <span className="text-purple-600">AI</span>
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>January 20, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>10 min read</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Introduction */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            You've learned what AI can do and which tools to choose. Now it's time to implement. This step-by-step 
            guide will walk you through setting up AI in your business in under 30 minutes.
          </p>
        </motion.section>

        {/* Setup Process */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-start gap-3">
            <div className="w-1 self-stretch bg-purple-600 rounded-full"></div>
            The 30-Minute Setup Process
          </h2>
          
          <div className="space-y-8">
            {/* Level 1 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xl">
                  1
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Create Your AI Agent</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Start by creating your AI agent using the setup wizard. You'll be asked to provide basic information 
                  about your business:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Business name and type</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Services you offer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Business hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Contact information</span>
                  </li>
                </ul>
                <p className="text-gray-600 text-sm mt-3 italic">
                  Time: ~5 minutes
                </p>
              </div>
            </div>

            {/* Level 2 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xl">
                  2
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Connect Your Calendar</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Connect your existing calendar system. Most AI tools support popular calendar apps:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Google Calendar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Cal.com</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Microsoft Outlook</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Apple Calendar</span>
                  </li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  The connection process is usually a simple OAuth flow—just click "Connect" and authorize access. 
                  Your AI will automatically check availability and book appointments directly into your calendar.
                </p>
                <p className="text-gray-600 text-sm mt-3 italic">
                  Time: ~3 minutes
                </p>
              </div>
            </div>

            {/* Level 3 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xl">
                  3
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Customize Your Greeting and Responses</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Personalize how your AI interacts with customers. You can customize:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Opening greeting and tone</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Common questions and answers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Appointment booking flow</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Business-specific information</span>
                  </li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  Many platforms offer industry-specific templates to speed this up. You can always refine these 
                  later based on real customer interactions.
                </p>
                <p className="text-gray-600 text-sm mt-3 italic">
                  Time: ~10 minutes
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xl">
                  4
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Go Live</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Once you've completed the setup, it's time to activate your AI. This typically involves:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Connecting your phone number (for call handling)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Installing website widget (if using)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Testing with a test call or message</span>
                  </li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  Most platforms offer a test mode so you can try everything before going live with real customers.
                </p>
                <p className="text-gray-600 text-sm mt-3 italic">
                  Time: ~12 minutes
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Best Practices */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-start gap-3">
            <div className="w-1 self-stretch bg-purple-600 rounded-full"></div>
            Implementation Best Practices
          </h2>
          
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Start Simple</h3>
              <p className="text-gray-700 leading-relaxed">
                Don't try to automate everything at once. Start with one feature—like AI receptionist for calls—and 
                expand from there once you're comfortable. This makes the transition smoother and helps you learn 
                what works best for your business.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Monitor and Refine</h3>
              <p className="text-gray-700 leading-relaxed">
                Review your AI's conversations regularly, especially in the first few weeks. Look for common 
                questions it's missing or areas where responses could be improved. Most AI tools learn from your 
                feedback and get better over time.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Train Your Team</h3>
              <p className="text-gray-700 leading-relaxed">
                Make sure your team knows how the AI system works and when it will transfer calls to them. Set 
                clear expectations about what the AI handles vs. what requires human attention. This ensures 
                smooth handoffs and better customer experiences.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Use Analytics</h3>
              <p className="text-gray-700 leading-relaxed">
                Most AI platforms provide analytics on call volume, booking rates, and customer satisfaction. 
                Use this data to understand your AI's performance and identify opportunities for improvement.
              </p>
            </div>
          </div>
        </motion.section>

        {/* FAQ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-start gap-3">
            <div className="w-1 self-stretch bg-purple-600 rounded-full"></div>
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <HelpCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1.5">
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
                <HelpCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1.5">
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
                <HelpCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1.5">
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

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <HelpCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1.5">
                    Can I try it before committing?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Most AI platforms offer free trials or low-cost starter plans. This lets you test the 
                    system with real calls and see how it works for your business before making a larger 
                    commitment. Take advantage of these trials to find the right fit.
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
          transition={{ duration: 0.6, delay: 0.5 }}
          className="my-16"
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-8 w-full max-w-[800px] group hover:bg-gray-50 transition duration-500 hover:duration-200">
              <div className="flex justify-center isolate">
                <div className="bg-white size-12 grid place-items-center rounded-xl relative left-2.5 top-1.5 -rotate-6 shadow-lg ring-1 ring-gray-200 group-hover:-translate-x-5 group-hover:-rotate-12 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <div className="bg-white size-12 grid place-items-center rounded-xl relative z-10 shadow-lg ring-1 ring-gray-200 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
                  <Zap className="w-6 h-6 text-blue-500" />
                </div>
                <div className="bg-white size-12 grid place-items-center rounded-xl relative right-2.5 top-1.5 rotate-6 shadow-lg ring-1 ring-gray-200 group-hover:translate-x-5 group-hover:rotate-12 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
                  <CheckCircle className="w-6 h-6 text-blue-500" />
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
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 pt-8 border-t border-gray-200"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link 
              to="/ai-guide-for-businesses/level-2-choosing-ai-tools" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous: Level 2 - Choosing AI Tools</span>
            </Link>
            <Link 
              to="/blog/ai-guide-for-businesses" 
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors"
            >
              <span>Back to Guide Overview</span>
            </Link>
          </div>
        </motion.div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogAIGuideStep3;

