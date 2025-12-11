import React, { useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Search, TrendingUp, BarChart3, CheckCircle, Users, Phone } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';
import ReadingProgress from '../components/ReadingProgress';

const BlogSEO: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Complete Guide to SEO for Local Businesses | Boltcall';
    updateMetaDescription('Complete SEO guide for local businesses. Learn how to rank higher on Google and attract more local customers.');
    
    // Add Article schema markup
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Why SEO Can't Be Ignored",
      "description": "Complete SEO guide for local businesses. Learn how to rank higher on Google and attract more local customers.",
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
      "datePublished": "2025-01-30",
      "dateModified": "2025-01-30",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://boltcall.org/blog/complete-guide-to-seo"
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
              <Search className="w-4 h-4" />
              <span className="font-semibold">SEO Strategy</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Why <span className="text-blue-600">SEO</span> Can't Be Ignored
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>January 30, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>9 min read</span>
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
            Your potential customers are searching for your services right now. The question is: 
            will they find you or your competitor? SEO isn't just about ranking higher—it's about 
            being visible when it matters most. Here's why it's critical for your business.
          </p>
        </motion.div>

        {/* Section 1 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            The Hidden Cost of Being Invisible
          </h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              Think about the last time you searched for a local service. Did you scroll past 
              the first page? Probably not. Research shows that 75% of users never go beyond the 
              first page of search results, and the top 3 positions capture 75% of all clicks.
            </p>
            
            <div className="my-8">
              <p className="text-gray-800 font-medium mb-3">
                The Search Behavior Reality:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">Position 1:</span>
                  <span>31.7% of all clicks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">Position 2:</span>
                  <span>24.7% of all clicks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">Position 3:</span>
                  <span>18.7% of all clicks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">Positions 4-10:</span>
                  <span>Only 24.9% of clicks combined</span>
                </li>
              </ul>
            </div>

            <p>
              If your business isn't ranking in the top 3, you're essentially invisible to 75% 
              of your potential customers. That's not just lost traffic—that's lost revenue, 
              lost opportunities, and lost growth.
            </p>
          </div>
        </motion.section>

        {/* Section 2 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            Why SEO Matters More Than Ever
          </h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              SEO has evolved from a nice-to-have to a business-critical strategy. Here's why:
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Organic Traffic is Free (After Initial Investment)
                </h3>
                <p className="text-gray-700">
                  Unlike paid advertising, SEO brings in customers without ongoing ad spend. 
                  Once you rank well, you get consistent traffic without paying per click. 
                  The initial investment pays dividends for months and years to come.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Higher Quality Leads
                </h3>
                <p className="text-gray-700">
                  People searching for your services are actively looking to buy. They're not 
                  just browsing—they have intent. SEO brings you customers who are ready to 
                  make a decision, not just window shoppers.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  Builds Trust and Credibility
                </h3>
                <p className="text-gray-700">
                  Ranking high in search results signals to potential customers that you're a 
                  legitimate, established business. It's like having a trusted recommendation 
                  from Google itself.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 3 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            The SEO Fundamentals Every Business Needs
          </h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              Effective SEO isn't about gaming the system—it's about creating a website that 
              genuinely serves your customers and search engines. Here are the core elements:
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">1. Technical SEO</h3>
                <p className="mb-3">
                  Your website needs to be fast, mobile-friendly, and easy for search engines 
                  to crawl. This includes:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                  <li>Page load speed optimization</li>
                  <li>Mobile responsiveness</li>
                  <li>Proper site structure and navigation</li>
                  <li>Secure HTTPS connection</li>
                  <li>Clean, crawlable code</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">2. On-Page SEO</h3>
                <p className="mb-3">
                  Every page should be optimized for both users and search engines:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                  <li>Keyword-optimized titles and headings</li>
                  <li>High-quality, relevant content</li>
                  <li>Meta descriptions that encourage clicks</li>
                  <li>Internal linking structure</li>
                  <li>Image optimization with alt text</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">3. Content Quality</h3>
                <p className="mb-3">
                  Google rewards websites that provide value. Your content should:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                  <li>Answer your customers' questions</li>
                  <li>Be original and valuable</li>
                  <li>Be regularly updated</li>
                  <li>Be well-structured and easy to read</li>
                  <li>Include relevant keywords naturally</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">4. Local SEO (For Local Businesses)</h3>
                <p className="mb-3">
                  If you serve a local area, local SEO is crucial:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                  <li>Google Business Profile optimization</li>
                  <li>Local keyword targeting</li>
                  <li>Customer reviews and ratings</li>
                  <li>Local citations and directories</li>
                  <li>Location-specific content</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 4 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            Common SEO Mistakes That Kill Your Rankings
          </h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              Many businesses unknowingly sabotage their SEO efforts. Here are the most common 
              mistakes to avoid:
            </p>

            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-lg my-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 font-bold">✗</span>
                  <span><strong>Keyword stuffing:</strong> Overusing keywords makes content unreadable and can get you penalized</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 font-bold">✗</span>
                  <span><strong>Ignoring mobile users:</strong> With mobile-first indexing, a poor mobile experience hurts rankings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 font-bold">✗</span>
                  <span><strong>Slow page speed:</strong> Users and Google both penalize slow-loading sites</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 font-bold">✗</span>
                  <span><strong>Thin or duplicate content:</strong> Google favors unique, valuable content</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 font-bold">✗</span>
                  <span><strong>Neglecting local SEO:</strong> Local businesses miss out on "near me" searches</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 font-bold">✗</span>
                  <span><strong>Not tracking results:</strong> You can't improve what you don't measure</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Section 5 - CTA with SEO Analyzer */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            Start Your SEO Journey Today
          </h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              The best time to start optimizing your website for search engines was yesterday. 
              The second best time is now. SEO is a long-term investment, and every day you wait 
              is another day your competitors are capturing your potential customers.
            </p>

            <p>
              But before you can improve, you need to know where you stand. That's why we've 
              created a comprehensive SEO analyzer tool that will give you a complete picture 
              of your website's SEO health.
            </p>

            <div className="my-12">
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
            </div>

            <p>
              Once you have your audit results, you'll know exactly what needs to be fixed. 
              From there, you can prioritize the changes that will have the biggest impact on 
              your search rankings and, ultimately, your bottom line.
            </p>
          </div>
        </motion.section>

        {/* Conclusion */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-16"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              The Bottom Line
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              SEO isn't optional anymore—it's essential. Your customers are searching for you. 
              The question is whether they'll find you or your competitor. By investing in SEO 
              now, you're investing in your business's future visibility, credibility, and growth. 
              Start with a free SEO audit, identify your weaknesses, and begin the journey to 
              better search rankings today.
            </p>
          </div>
        </motion.section>
      </article>

      <Footer />
    </div>
  );
};

export default BlogSEO;

