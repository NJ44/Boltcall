import React, { useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, BookOpen, CheckCircle, Zap, TrendingUp, Users } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';
import ReadingProgress from '../components/ReadingProgress';

const BlogAIGuide: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Complete Guide to AI for Local Businesses | Boltcall';
    updateMetaDescription('Complete guide to AI for local businesses. Learn how artificial intelligence can transform your business operations in 3 simple steps.');
    
    // Add CollectionPage schema markup
    const collectionSchema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "The Complete Guide to AI for Local Businesses",
      "description": "Complete guide to AI for local businesses. Learn how artificial intelligence can transform your business operations in 3 simple steps.",
      "url": "https://boltcall.org/blog/ai-guide-for-businesses"
    };

    const existingScript = document.getElementById('collection-schema');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.id = 'collection-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(collectionSchema);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('collection-schema');
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, []);

  const steps = [
    {
      number: 1,
      title: 'Understanding AI for Local Businesses',
      description: 'Learn what AI can automate for your business, the real benefits, and how it transforms daily operations.',
      href: '/blog/ai-guide-for-businesses/step-1-understanding-ai',
      icon: BookOpen,
      color: 'blue',
      topics: [
        'What AI can automate (calls, SMS, follow-ups)',
        'Real benefits explained simply',
        'Cost vs. value analysis',
        'Real business case studies'
      ]
    },
    {
      number: 2,
      title: 'Choosing the Right AI Tools',
      description: 'Discover the essential AI tools for local businesses and how to evaluate which ones fit your needs.',
      href: '/blog/ai-guide-for-businesses/step-2-choosing-ai-tools',
      icon: CheckCircle,
      color: 'green',
      topics: [
        'Essential AI tools for service businesses',
        'Feature comparisons',
        'Pricing considerations',
        'Integration requirements'
      ]
    },
    {
      number: 3,
      title: 'Getting Started with AI',
      description: 'Step-by-step guide to implementing AI in your business, from setup to going live in under 30 minutes.',
      href: '/blog/ai-guide-for-businesses/step-3-getting-started',
      icon: Zap,
      color: 'purple',
      topics: [
        '30-minute setup process',
        'Customization best practices',
        'Common FAQs answered',
        'Implementation tips'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />
      <ReadingProgress />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full mb-6">
              <TrendingUp className="w-4 h-4" />
              <span className="font-semibold">Complete Guide</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              The Complete Guide to <span className="text-blue-600">AI for Local Businesses</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Learn how artificial intelligence can transform your business operations in 3 simple steps. 
              From understanding what AI can do to implementing it in your business.
            </p>
            
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>January 20, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>3-Part Series</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Steps Overview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600 border-blue-200',
              green: 'bg-green-100 text-green-600 border-green-200',
              purple: 'bg-purple-100 text-purple-600 border-purple-200'
            };

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                <Link to={step.href} className="block h-full">
                  <div className="p-6 h-full flex flex-col">
                    {/* Step Number & Icon */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center border-2 ${colorClasses[step.color as keyof typeof colorClasses]}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-3xl font-bold text-gray-300">0{step.number}</div>
                    </div>
                    
                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {step.title}
                    </h2>
                    
                    {/* Description */}
                    <p className="text-gray-600 mb-6 flex-grow">
                      {step.description}
                    </p>
                    
                    {/* Topics List */}
                    <ul className="space-y-2 mb-6">
                      {step.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {/* Read More */}
                    <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                      <span>Read Article</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Quick Summary */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">What You'll Learn</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Step 1: Understanding</h3>
              <p className="text-blue-50">
                Discover what AI can automate for your business and the real-world benefits you'll see.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Step 2: Choosing</h3>
              <p className="text-blue-50">
                Learn which AI tools are essential and how to evaluate what fits your business needs.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Step 3: Implementing</h3>
              <p className="text-blue-50">
                Get step-by-step instructions to set up AI in your business in under 30 minutes.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
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
            <h2 className="text-gray-900 font-medium mt-4 text-4xl">Ready to Get Started?</h2>
            <p className="text-base text-gray-600 mt-2">Start with Step 1 to understand how AI can transform your business.</p>
            <Link
              to="/blog/ai-guide-for-businesses/step-1-understanding-ai"
              className="mt-6 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 hover:text-gray-900 h-10 px-4 py-2 shadow-sm active:shadow-none"
            >
              Start Reading Step 1
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default BlogAIGuide;
