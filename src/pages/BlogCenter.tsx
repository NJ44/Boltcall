import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';

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
    slug: '/the-new-reality-for-local-businesses',
    excerpt: 'The local business landscape has transformed dramatically. What worked yesterday won\'t work tomorrow. And the businesses that are thriving? They\'re the ones that embraced AI services early.',
    date: 'January 15, 2025',
    readTime: '8 min read',
    category: 'Business Strategy'
  },
  {
    title: 'The <span class="text-blue-600">391%</span> Advantage: Responding in 60 Seconds',
    slug: '/why-speed-matters-391-percent-advantage',
    excerpt: 'Research shows that contacting a lead within 60 seconds increases conversion rates by 391%. Discover why speed is the ultimate competitive advantage in lead generation.',
    date: 'January 20, 2025',
    readTime: '6 min read',
    category: 'Lead Generation'
  },
  {
    title: 'Why <span class="text-blue-600">Website Speed</span> Is Everything',
    slug: '/why-website-speed-is-everything',
    excerpt: '53% of users abandon sites that take longer than 3 seconds to load. Discover why website speed is critical and how it impacts your bottom line.',
    date: 'January 25, 2025',
    readTime: '7 min read',
    category: 'Website Performance'
  },
  {
    title: 'Why <span class="text-blue-600">SEO</span> Can\'t Be Ignored',
    slug: '/complete-guide-to-seo',
    excerpt: '75% of users never go beyond the first page of search results. Discover why SEO is critical for your business and how to get started with a free SEO audit.',
    date: 'January 30, 2025',
    readTime: '9 min read',
    category: 'SEO Strategy'
  },
  {
    title: 'The Complete Guide to <span class="text-blue-600">AI for Local Businesses</span>',
    slug: '/complete-guide-to-ai-for-local-businesses',
    excerpt: 'Discover what AI can automate for service businesses, understand the costs vs benefits, and learn where to start. A comprehensive guide to transforming your local business with AI.',
    date: 'February 1, 2025',
    readTime: '12 min read',
    category: 'Complete Guide'
  },
  {
    title: 'Best <span class="text-blue-600">AI Receptionist Tools</span> for Small Businesses (Top 5 Compared)',
    slug: '/best-ai-receptionist-tools-for-small-businesses',
    excerpt: 'Compare the top 5 AI receptionist tools for small businesses. Detailed reviews of Boltcall, Smith.ai, Numa, Creovai, and OpenPhone AI Receptionist to help you choose the right solution.',
    date: 'February 5, 2025',
    readTime: '10 min read',
    category: 'Tool Comparison'
  },
  // Add more blog posts here as they are created
];

const BlogCenter: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
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
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Boltcall Blog
            </h1>
          </motion.div>
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

