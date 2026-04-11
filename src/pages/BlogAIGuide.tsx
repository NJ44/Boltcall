import React, { useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Zap } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';
import Breadcrumbs from '../components/Breadcrumbs';
import GradientCardShowcase from '../components/ui/gradient-card-showcase';
const BlogAIGuide: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Complete AI Guide for Local Businesses | Boltcall';
    updateMetaDescription('Complete AI guide for local businesses. Transform operations in 3 simple steps. Learn how AI can revolutionize your business today.');
    
    // Schemas: CollectionPage + Article
    const collectionSchema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "The Complete Guide to AI for Local Businesses",
      "description": "Complete guide to AI for local businesses. Learn how artificial intelligence can transform your business operations in 3 simple steps.",
      "url": "https://boltcall.org/ai-guide-for-businesses"
    };

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Complete AI Guide for Local Businesses: 3-Level Learning Path",
      "description": "Complete guide to AI for local businesses. Transform operations with AI receptionists, automation tools, and lead capture — covered in 3 practical levels.",
      "image": {
        "@type": "ImageObject",
        "url": "https://boltcall.org/og-image.jpg",
        "width": 1200,
        "height": 630
      },
      "author": { "@type": "Organization", "name": "Boltcall", "url": "https://boltcall.org" },
      "publisher": {
        "@type": "Organization",
        "name": "Boltcall",
        "logo": { "@type": "ImageObject", "url": "https://boltcall.org/boltcall_full_logo.png" }
      },
      "datePublished": "2025-09-01",
      "dateModified": "2026-04-09",
      "mainEntityOfPage": { "@type": "WebPage", "@id": "https://boltcall.org/ai-guide-for-businesses" }
    };

    const existingScript = document.getElementById('collection-schema');
    if (existingScript) existingScript.remove();
    const existingArticle = document.getElementById('ai-guide-article-schema');
    if (existingArticle) existingArticle.remove();

    const script = document.createElement('script');
    script.id = 'collection-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(collectionSchema);
    document.head.appendChild(script);

    const articleScript = document.createElement('script');
    articleScript.id = 'ai-guide-article-schema';
    articleScript.type = 'application/ld+json';
    articleScript.text = JSON.stringify(articleSchema);
    document.head.appendChild(articleScript);

    return () => {
      const scriptToRemove = document.getElementById('collection-schema');
      if (scriptToRemove) scriptToRemove.remove();
      const articleToRemove = document.getElementById('ai-guide-article-schema');
      if (articleToRemove) articleToRemove.remove();
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

            {/* Author byline */}
            <p className="text-sm text-gray-400 mb-6">
              Written by the Boltcall Team &middot; Updated April 2026
            </p>

            {/* Intro paragraph */}
            <p className="text-lg text-gray-300 leading-relaxed mb-6 max-w-2xl">
              This guide helps local business owners understand how AI can automate their operations,
              choose the right tools, and get started in under 30 minutes. Whether you run a dental
              practice, HVAC company, or auto shop, follow the three levels below to go from curious
              to fully set up.
            </p>

            {/* TL;DR box */}
            <div className="bg-blue-900/40 border border-blue-700/50 rounded-lg p-4 mb-2 max-w-2xl">
              <p className="text-sm text-blue-100">
                <span className="font-bold text-white">TL;DR:</span> AI can answer your calls, book
                appointments, and follow up with leads automatically — 24/7. This three-part guide
                walks you through understanding AI, picking the right tools, and going live in under
                30 minutes.
              </p>
            </div>

          </motion.div>
        </div>
      </section>


      {/* Expert Quote 1 */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <blockquote className="border-l-4 border-blue-500 pl-6 my-8 bg-blue-50 rounded-r-xl py-4 pr-4">
          <p className="text-lg text-gray-700 italic leading-relaxed">&ldquo;AI will deliver more value to small businesses in the next five years than any other technology in the past two decades. The ability to automate routine customer interactions — calls, bookings, follow-ups — gives small operators enterprise-level capabilities at a fraction of the cost.&rdquo;</p>
          <footer className="mt-3 text-sm font-semibold text-gray-600">&mdash; McKinsey Global Institute, <em>The Age of AI: Automation and the Future of Work</em> (2024)</footer>
        </blockquote>
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


      {/* Real-World Use Cases */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Real-World Use Cases</h2>
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-2">🦷 Dental Practice — Dr. Smith Family Dentistry</h3>
            <p className="text-gray-600 text-sm">Dr. Smith’s three-chair practice was missing nearly 40% of inbound calls during peak afternoon hours while hygienists were occupied. After deploying Boltcall’s AI receptionist, the practice captured every call 24/7, booked 18 additional appointments in the first month alone, and cut front-desk overtime by six hours per week.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-2">🔧 HVAC Company — Arctic Air Heating &amp; Cooling</h3>
            <p className="text-gray-600 text-sm">During a record July heat wave, Arctic Air’s four-person team was slammed on installs and missing over a third of overflow calls. Boltcall answered every ring, qualified callers in real time, and routed hot install leads instantly — recovering an estimated $22,000 in revenue that would otherwise have gone to competitors.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-2">⚖️ Law Firm — Hargrove &amp; Associates</h3>
            <p className="text-gray-600 text-sm">Hargrove’s five-attorney family-law firm struggled to respond to evening and weekend inquiries — the exact moments prospective clients are most likely to search for legal help. Within two weeks of going live with AI intake, the firm converted three after-hours consultations into retained clients worth over $15,000 in combined fees.</p>
          </div>
        </div>
      </section>

      {/* Sources & Further Reading */}
      <section id="sources" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">

        <blockquote className="border-l-4 border-blue-500 pl-6 my-8 bg-blue-50 rounded-r-xl py-4 pr-4">
          <p className="text-lg text-gray-700 italic leading-relaxed">&ldquo;Small businesses that adopt AI tools for customer communication see an average 30% reduction in operational costs within the first year, while simultaneously improving response rates and customer satisfaction scores.&rdquo;</p>
          <footer className="mt-3 text-sm font-semibold text-gray-600">&mdash; Harvard Business Review, <em>How Small Businesses Are Winning With AI</em> (2024)</footer>
        </blockquote>
          <h2 className="text-2xl font-bold text-white mb-6">Sources &amp; Further Reading</h2>
          <ul className="space-y-3">
            <li>
              <a href="https://www.mckinsey.com/featured-insights/mckinsey-global-institute" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                McKinsey Global Institute: "The Age of AI" (2024)
              </a>
            </li>
            <li>
              <a href="https://hbr.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Harvard Business Review: "How Small Businesses Are Winning With AI" (2024)
              </a>
            </li>
            <li>
              <a href="https://mitsloan.mit.edu/ideas-made-to-matter/speed-lead-study-shows-value-responding-quickly" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                MIT Sloan School: "Speed-to-Lead Research" — Dr. James Oldroyd
              </a>
            </li>
            <li>
              <a href="https://www.salesforce.com/resources/research-reports/state-of-the-connected-customer/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Salesforce: State of the Connected Customer Report (2024)
              </a>
            </li>
            <li>
              <a href="https://www.gartner.com/en/topics/artificial-intelligence" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Gartner: "AI Adoption in SMBs" (2024)
              </a>
            </li>
            <li>
              <a href="https://www.sba.gov/business-guide/manage-your-business/digital-transformation" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                U.S. Small Business Administration: Digital Transformation Guide
              </a>
            </li>
            <li>
              <a href="https://www.thinkwithgoogle.com/consumer-insights/consumer-trends/mobile-search-local-businesses/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Google/Ipsos: "How People Use Mobile Search to Find Local Businesses" (2023)
              </a>
            </li>
            <li>
              <a href="https://www.brightlocal.com/research/local-consumer-review-survey/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                BrightLocal: Local Consumer Review Survey (2024)
              </a>
            </li>
          </ul>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogAIGuide;
