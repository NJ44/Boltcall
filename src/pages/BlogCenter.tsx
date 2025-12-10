import React, { useEffect, useState } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';
import { AppleSpotlight } from '../components/ui/apple-spotlight';

interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
}

const blogPosts: BlogPost[] = [
  {
    title: 'Why <span class="text-blue-600">AI Services</span> Are No Longer Optional',
    slug: '/blog/the-new-reality-for-local-businesses',
    excerpt: 'The local business landscape has transformed dramatically. What worked yesterday won\'t work tomorrow. And the businesses that are thriving? They\'re the ones that embraced AI services early.',
    date: 'January 15, 2025',
    readTime: '8 min read',
    category: 'Business Strategy'
  },
  {
    title: 'The <span class="text-blue-600">391%</span> Advantage: Responding in 60 Seconds',
    slug: '/blog/why-speed-matters',
    excerpt: 'Research shows that contacting a lead within 60 seconds increases conversion rates by 391%. Discover why speed is the ultimate competitive advantage in lead generation.',
    date: 'January 20, 2025',
    readTime: '6 min read',
    category: 'Lead Generation'
  },
  {
    title: 'Why <span class="text-blue-600">Website Speed</span> Is Everything',
    slug: '/blog/why-website-speed-is-everything',
    excerpt: '53% of users abandon sites that take longer than 3 seconds to load. Discover why website speed is critical and how it impacts your bottom line.',
    date: 'January 25, 2025',
    readTime: '7 min read',
    category: 'Website Performance'
  },
  {
    title: 'Why <span class="text-blue-600">SEO</span> Can\'t Be Ignored',
    slug: '/blog/complete-guide-to-seo',
    excerpt: '75% of users never go beyond the first page of search results. Discover why SEO is critical for your business and how to get started with a free SEO audit.',
    date: 'January 30, 2025',
    readTime: '9 min read',
    category: 'SEO Strategy'
  },
  {
    title: 'The Complete Guide to <span class="text-blue-600">AI for Local Businesses</span>',
    slug: '/blog/ai-guide-for-businesses',
    excerpt: 'Discover what AI can automate for service businesses, understand the costs vs benefits, and learn where to start. A comprehensive guide to transforming your local business with AI.',
    date: 'February 1, 2025',
    readTime: '12 min read',
    category: 'Complete Guide'
  },
  {
    title: 'Best <span class="text-blue-600">AI Receptionist Tools</span> for Small Businesses (Top 5 Compared)',
    slug: '/blog/best-ai-receptionist-tools',
    excerpt: 'Compare the top 5 AI receptionist tools for small businesses. Detailed reviews of Boltcall, Smith.ai, Numa, Creovai, and OpenPhone AI Receptionist to help you choose the right solution.',
    date: 'February 5, 2025',
    readTime: '10 min read',
    category: 'Tool Comparison'
  },
  {
    title: 'How Does an <span class="text-blue-600">AI Receptionist</span> Work? A Complete Technical Guide',
    slug: '/blog/how-ai-receptionist-works',
    excerpt: 'Discover the technology behind AI receptionists: speech recognition, natural language understanding, large language models, and how they learn your business to provide intelligent customer service.',
    date: 'February 10, 2025',
    readTime: '5 min read',
    category: 'AI Technology'
  },
  {
    title: 'Is an <span class="text-blue-600">AI Receptionist</span> Worth It? A Complete Cost-Benefit Analysis',
    slug: '/blog/is-ai-receptionist-worth-it',
    excerpt: 'Every business owner faces the same question: Should I invest in an AI receptionist? This guide breaks down the real costs, benefits, and ROI to help you determine if an AI receptionist is worth it for your business.',
    date: 'February 15, 2025',
    readTime: '8 min read',
    category: 'Business Analysis'
  },
  {
    title: 'How to Make an <span class="text-blue-600">AI Receptionist</span>: A Complete Step-by-Step Guide',
    slug: '/blog/how-to-make-ai-receptionist',
    excerpt: 'Building an AI receptionist from scratch requires combining multiple technologies. This guide walks you through the complete process, from choosing the right tools to deploying your AI receptionist.',
    date: 'February 20, 2025',
    readTime: '10 min read',
    category: 'Technical Guide'
  },
  {
    title: 'Will <span class="text-blue-600">Receptionists</span> Be Replaced by AI? The Future of Front Desk Work',
    slug: '/blog/will-receptionists-be-replaced-by-ai',
    excerpt: 'It\'s the question on every receptionist\'s mind: Will AI replace my job? While AI receptionists are transforming how businesses handle calls, they\'re not eliminating human receptionists entirely—they\'re changing the role.',
    date: 'February 25, 2025',
    readTime: '9 min read',
    category: 'Industry Analysis'
  },
  {
    title: 'What Does <span class="text-blue-600">Instant Lead Reply</span> Mean? A Complete Guide',
    slug: '/blog/instant-lead-reply-guide',
    excerpt: 'Instant lead reply means responding to potential customers within seconds of them showing interest. This guide explains what it is, why it matters, and how it works.',
    date: 'March 1, 2025',
    readTime: '6 min read',
    category: 'Lead Generation'
  },
  {
    title: 'How to Set Up <span class="text-blue-600">Instant Lead Reply</span> in Your Website/Ads with Boltcall',
    slug: '/blog/setup-instant-lead-reply',
    excerpt: 'Setting up instant lead reply with Boltcall is straightforward and can be done in 1-2 hours. This step-by-step guide walks you through connecting your website forms, Facebook Ads, Google Ads, and other lead sources.',
    date: 'March 1, 2025',
    readTime: '8 min read',
    category: 'Setup Guide'
  },
  {
    title: 'How Does <span class="text-blue-600">Instant Lead Reply</span> Work? The Technology Behind the Magic',
    slug: '/blog/how-instant-lead-reply-works',
    excerpt: 'You submit a form on a website and receive a reply within seconds. How is that possible? This guide breaks down exactly how the technology works—from webhooks to AI processing to multi-channel delivery.',
    date: 'March 2, 2025',
    readTime: '7 min read',
    category: 'Technology'
  },
  {
    title: 'Top 10 <span class="text-blue-600">AI Receptionist Agencies</span>: Complete Comparison Guide',
    slug: '/blog/top-10-ai-receptionist-agencies',
    excerpt: 'Compare the top 10 AI receptionist agencies. Find features, pricing, and choose the best AI receptionist service for your business. Comprehensive guide with detailed comparisons.',
    date: 'March 15, 2025',
    readTime: '15 min read',
    category: 'Tool Comparison'
  },
  // Add more blog posts here as they are created
];

const BlogCenter: React.FC = () => {
  useEffect(() => {
    document.title = 'Blog - AI Business Tips & Guides | Boltcall';
    updateMetaDescription('Boltcall blog: AI business tips, guides, and insights. Learn how to grow your business with artificial intelligence.');
  }, []);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close
      if (e.key === 'Escape') {
        setIsSpotlightOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              <span className="text-blue-600">Boltcall</span> Blog
            </h1>
          </motion.div>
          
          {/* Search Spotlight */}
          <div className="flex justify-center">
            <AppleSpotlight 
              isOpen={isSpotlightOpen} 
              handleClose={() => setIsSpotlightOpen(false)}
              blogPosts={blogPosts}
            />
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {blogPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
              >
                <Link to={post.slug} className="block h-full">
                  <div className="p-6 h-full flex flex-col">
                    {/* Category Badge */}
                    <div className="inline-flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4 w-fit">
                      <span className="font-semibold">{post.category}</span>
                    </div>
                    
                    {/* Title */}
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors" dangerouslySetInnerHTML={{ __html: post.title }} />
                    
                    {/* Excerpt */}
                    <p className="text-gray-600 mb-6 flex-grow line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
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
            <p className="text-gray-600 text-lg">No blog posts available yet. Check back soon!</p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default BlogCenter;

