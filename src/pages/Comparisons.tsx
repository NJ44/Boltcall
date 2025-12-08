import React, { useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Calendar } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';

const Comparisons: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'AI Receptionist Comparisons & Alternatives | Boltcall';
    updateMetaDescription('Compare AI receptionist services and alternatives. See how Boltcall compares to competitors and traditional solutions.');
  }, []);

  const comparisons = [
    {
      title: 'Traditional Call Centers vs <span class="text-blue-600">Boltcall</span>',
      description: 'Compare costs, response times, availability, and quality between traditional call centers and Boltcall\'s AI solution.',
      href: '/comparisons/call-centers-vs-boltcall',
      category: 'Call Centers',
      date: 'February 10, 2025',
      readTime: '8 min read'
    },
    {
      title: 'Human Receptionist vs <span class="text-blue-600">Boltcall</span>',
      description: 'See how Boltcall compares to hiring a human receptionist in terms of cost, reliability, and capabilities.',
      href: '/comparisons/receptionist-vs-boltcall',
      category: 'Receptionist',
      date: 'February 10, 2025',
      readTime: '7 min read'
    },
    {
      title: 'Voicemail vs <span class="text-blue-600">Boltcall</span>',
      description: 'Discover why Boltcall\'s instant response beats traditional voicemail systems for lead conversion.',
      href: '/comparisons/voicemail-vs-boltcall',
      category: 'Voicemail',
      date: 'February 10, 2025',
      readTime: '6 min read'
    },
    {
      title: 'Answering Services vs <span class="text-blue-600">Boltcall</span>',
      description: 'Compare professional answering services with Boltcall\'s AI-powered solution for your business.',
      href: '/comparisons/answering-services-vs-boltcall',
      category: 'Answering Services',
      date: 'February 10, 2025',
      readTime: '7 min read'
    },
    {
      title: 'CRM Instant Lead Reply vs <span class="text-blue-600">Boltcall</span>',
      description: 'Compare regular CRM automated responses with Boltcall\'s AI-powered instant lead reply system.',
      href: '/comparisons/crm-vs-boltcall',
      category: 'Lead Response',
      date: 'February 25, 2025',
      readTime: '7 min read'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-8 bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              <span className="text-blue-600">Boltcall</span> Comparisons
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Comparisons Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {comparisons.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {comparisons.map((comparison, index) => (
              <motion.article
                key={comparison.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
              >
                <Link to={comparison.href} className="block h-full">
                  <div className="p-6 h-full flex flex-col">
                    {/* Category Badge */}
                    <div className="inline-flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4 w-fit">
                      <span className="font-semibold">{comparison.category}</span>
                    </div>
                    
                    {/* Title */}
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors" dangerouslySetInnerHTML={{ __html: comparison.title }} />
                    
                    {/* Excerpt */}
                    <p className="text-gray-600 mb-6 flex-grow line-clamp-3">
                      {comparison.description}
                    </p>
                    
                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{comparison.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{comparison.readTime}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">No comparisons available yet. Check back soon!</p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Comparisons;

