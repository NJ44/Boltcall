import React, { useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Zap } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';
import GradientCardShowcase from '../components/ui/gradient-card-showcase';
const BlogAIGuide: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Complete AI Guide for Local Businesses | Boltcall';
    updateMetaDescription('Complete AI guide for local businesses. Transform operations in 3 simple steps. Learn how AI can revolutionize your business today.');
    
    // Add CollectionPage schema markup
    const collectionSchema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "The Complete Guide to AI for Local Businesses",
      "description": "Complete guide to AI for local businesses. Learn how artificial intelligence can transform your business operations in 3 simple steps.",
      "url": "https://boltcall.org/ai-guide-for-businesses"
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

  const levels = [
    {
      number: 1,
      title: 'Understanding AI for Local Businesses',
      description: 'Learn what AI can automate for your business, the real benefits, and how it transforms daily operations.',
      href: '/ai-guide-for-businesses/level-1-understanding-ai',
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
      href: '/ai-guide-for-businesses/level-2-choosing-ai-tools',
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
      href: '/ai-guide-for-businesses/level-3-getting-started',
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
    <div className="min-h-screen bg-gray-900">
      <GiveawayBar />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800">
        <div className="max-w-4xl px-4 sm:px-6 lg:px-8" style={{ marginLeft: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            <Breadcrumbs items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: 'Complete Guide to AI for Local Businesses', href: '/ai-guide-for-businesses' }
            ]} />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-left">
              The Complete Guide to <span className="text-blue-400">AI for Local Businesses</span>
            </h1>
            
          </motion.div>
        </div>
      </section>

      {/* Steps Overview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 -mt-[200px] bg-transparent">
        <GradientCardShowcase 
          cards={levels.map((level, index) => {
            const gradients = [
              { from: '#3b82f6', to: '#2563eb' },
              { from: '#2563eb', to: '#1e40af' },
              { from: '#1e40af', to: '#6b21a8' }
            ];
            return {
              title: level.title,
              desc: level.description,
              gradientFrom: gradients[index].from,
              gradientTo: gradients[index].to,
              href: level.href
            };
          })}
          showLinks={true}
        />
      </section>


      <Footer />
    </div>
  );
};

export default BlogAIGuide;
