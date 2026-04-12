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
    updateMetaDescription('Compare Boltcall AI receptionist with alternatives. See how Boltcall compares to traditional answering services. View now.');

    const bcScript = document.createElement('script');
    bcScript.type = 'application/ld+json';
    bcScript.id = 'breadcrumb-jsonld';
    bcScript.text = JSON.stringify({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://boltcall.org"}, {"@type": "ListItem", "position": 2, "name": "Comparisons", "item": "https://boltcall.org/comparisons"}]});
    document.head.appendChild(bcScript);
    return () => { document.getElementById('breadcrumb-jsonld')?.remove(); };
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

  const competitors = [
    {
      title: 'Boltcall vs <span class="text-blue-600">GoHighLevel</span>',
      description: 'Compare Boltcall\'s AI receptionist with GoHighLevel\'s all-in-one marketing platform. See which delivers better ROI for local businesses.',
      href: '/compare/boltcall-vs-gohighlevel',
      category: 'CRM Platform',
      date: 'April 8, 2026',
      readTime: '8 min read'
    },
    {
      title: 'Boltcall vs <span class="text-blue-600">Podium</span>',
      description: 'See how Boltcall stacks up against Podium for lead conversion, messaging, and customer communication.',
      href: '/compare/boltcall-vs-podium',
      category: 'Messaging Platform',
      date: 'April 8, 2026',
      readTime: '7 min read'
    },
    {
      title: 'Boltcall vs <span class="text-blue-600">Birdeye</span>',
      description: 'Compare Boltcall\'s AI-powered solution with Birdeye\'s reputation and customer experience platform.',
      href: '/compare/boltcall-vs-birdeye',
      category: 'Reputation Platform',
      date: 'April 8, 2026',
      readTime: '7 min read'
    },
    {
      title: 'Boltcall vs <span class="text-blue-600">Emitrr</span>',
      description: 'Compare Boltcall with Emitrr\'s customer interaction platform for appointment scheduling and communication.',
      href: '/compare/boltcall-vs-emitrr',
      category: 'Communication Platform',
      date: 'April 8, 2026',
      readTime: '6 min read'
    },
    {
      title: 'Boltcall vs <span class="text-blue-600">Calomation</span>',
      description: 'See how Boltcall\'s AI receptionist compares to Calomation\'s automation tools for local businesses.',
      href: '/compare/boltcall-vs-calomation',
      category: 'Automation Platform',
      date: 'April 8, 2026',
      readTime: '6 min read'
    },
    {
      title: 'Boltcall vs <span class="text-blue-600">Smith.ai</span>',
      description: 'Compare Boltcall\'s AI receptionist with Smith.ai\'s virtual receptionist and intake services.',
      href: '/compare/boltcall-vs-smith-ai',
      category: 'Virtual Receptionist',
      date: 'April 8, 2026',
      readTime: '8 min read'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <p className="text-gray-700">
          This page compares Boltcall's AI receptionist with traditional call centers, human receptionists, and other answering services, highlighting the advantages and disadvantages of each option.
        </p>
      </section>

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

      {/* Head-to-Head Competitor Comparisons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            See How <span className="text-blue-600">Boltcall</span> Compares
          </h2>
          <p className="text-gray-600 mt-2">Head-to-head breakdowns against the top platforms in the space.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {competitors.map((competitor, index) => (
            <motion.article
              key={competitor.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
            >
              <Link to={competitor.href} className="block h-full">
                <div className="p-6 h-full flex flex-col">
                  {/* Category Badge */}
                  <div className="inline-flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4 w-fit">
                    <span className="font-semibold">{competitor.category}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors" dangerouslySetInnerHTML={{ __html: competitor.title }} />

                  {/* Excerpt */}
                  <p className="text-gray-600 mb-6 flex-grow line-clamp-3">
                    {competitor.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{competitor.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{competitor.readTime}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>


      {/* AI Receptionist Comparison Summary Table */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Boltcall vs. Competitors: Quick Comparison</h2>
          <p className="text-gray-500 text-sm text-center mb-6">How Boltcall compares to the most common alternatives for local business phone handling</p>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">Feature</th>
                  <th className="px-4 py-3 font-semibold text-indigo-700 border-b border-gray-200 bg-indigo-50 text-center">Boltcall</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200 text-center">Smith.ai</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200 text-center">Podium</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200 text-center">GoHighLevel</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['AI phone answering', '\u2713', '\u2713', '\u2717', 'Partial'],
                  ['24/7 coverage', '\u2713', '\u2713', '\u2713', '\u2713'],
                  ['Live appointment booking', '\u2713', 'Message only', '\u2717', '\u2713'],
                  ['SMS follow-up automation', '\u2713', '\u2717', '\u2713', '\u2713'],
                  ['No-show reminders', '\u2713', '\u2717', '\u2717', '\u2713'],
                  ['Google review automation', '\u2713', '\u2717', '\u2713', '\u2717'],
                  ['Setup time', '30 min', '1-2 days', '1-2 weeks', '2-4 weeks'],
                  ['Starting price', '$79/mo', '$292.50/mo', '$399/mo', '$97/mo'],
                  ['Per-minute fees', 'None', '$7-9/call', 'None', 'None'],
                ].map(([feature, boltcall, smith, podium, ghl]) => (
                  <tr key={feature} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700 font-medium">{feature}</td>
                    <td className="px-4 py-3 text-center bg-indigo-50/30 text-indigo-700 font-semibold">{boltcall}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{smith}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{podium}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{ghl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Comparisons;

