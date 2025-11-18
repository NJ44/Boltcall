import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Gauge } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';

const BlogSpeedWebsite: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left mb-12"
          >
            <div className="inline-flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full mb-6">
              <Gauge className="w-4 h-4" />
              <span className="font-semibold">Website Performance</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Why Website Speed Is Everything: The Hidden Cost of Slow Loading Pages
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>January 25, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>7 min read</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="prose prose-lg max-w-none mb-12"
        >
          <p className="text-xl text-gray-700 leading-relaxed font-medium">
            Your website loads in 3 seconds. Your competitor's loads in 1 second. 
            Guess who gets the customer? Speed isn't just nice to have—it's the difference 
            between winning and losing in today's digital world.
          </p>
        </motion.div>

        {/* Section 1 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            The 3-Second Rule: When Speed Becomes Critical
          </h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              Google research shows that 53% of mobile users abandon sites that take longer 
              than 3 seconds to load. But here's what's even more telling: for every second 
              your site takes to load, your conversion rate drops by 7%.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg my-8">
              <p className="text-gray-800 font-medium mb-3">
                The Speed Impact:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">1 second:</span>
                  <span>Optimal loading time, maximum conversions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">2 seconds:</span>
                  <span>7% drop in conversion rate</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">3 seconds:</span>
                  <span>14% drop in conversion rate, 53% of users leave</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">5+ seconds:</span>
                  <span>35% drop in conversion rate, most users abandon</span>
                </li>
              </ul>
            </div>
            
            <p>
              Think about it: if your site takes 5 seconds to load and your competitor's 
              takes 1 second, they're converting at 28% higher rates. That's not a small 
              difference—that's the difference between a thriving business and one that's 
              struggling.
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            Why Speed Matters More Than Ever
          </h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              We live in an instant world. Amazon delivers in hours. Netflix streams instantly. 
              Google answers in milliseconds. Your customers expect the same speed from your 
              website. Anything slower feels broken.
            </p>
            
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. First Impressions Are Everything</h3>
            <p>
              Your website is often the first interaction a customer has with your business. 
              If it's slow, they assume you're slow. If it's fast, they assume you're efficient, 
              modern, and professional. Speed is a reflection of your entire business.
            </p>
            
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Mobile Users Won't Wait</h3>
            <p>
              More than 60% of web traffic is mobile. Mobile users are often on slower connections, 
              in a hurry, or multitasking. They have zero patience for slow sites. If your site 
              doesn't load instantly on mobile, you're losing customers before they even see 
              what you offer.
            </p>
            
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Google Ranks Speed</h3>
            <p>
              Google uses page speed as a ranking factor. Slow sites rank lower. Lower rankings 
              mean less traffic. Less traffic means fewer customers. It's that simple. Speed 
              isn't just about user experience—it's about visibility.
            </p>
          </div>
        </motion.section>

        {/* Section 3 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            The Real Cost of a Slow Website
          </h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              Let's put this in real numbers. If you're getting 1,000 visitors per month and 
              your site takes 5 seconds to load instead of 1 second, you're losing money.
            </p>
            
            <p>
              <strong>Slow Site (5 seconds):</strong> With a 35% drop in conversion rate, you're 
              losing 35% of your potential customers. If you normally convert at 3%, you're now 
              converting at 1.95%. That's 19-20 customers instead of 30. At $500 per customer, 
              that's $5,000 in lost monthly revenue.
            </p>
            
            <p>
              <strong>Fast Site (1 second):</strong> You maintain your full conversion rate. 
              You get all 30 customers. That's $15,000 in monthly revenue.
            </p>
            
            <p>
              The difference? $10,000 per month. Over a year, that's $120,000 in lost revenue— 
              just from having a slow website.
            </p>
          </div>
        </motion.section>

        {/* Section 4 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            What Makes a Website Slow?
          </h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              Understanding what slows down your site is the first step to fixing it. Here are 
              the most common culprits:
            </p>
            
            <p>
              <strong>Large Images:</strong> Unoptimized images are the number one cause of slow 
              loading times. A single high-resolution photo can be 5MB or more. That's enough to 
              slow down your entire site.
            </p>
            
            <p>
              <strong>Too Many Plugins:</strong> Every plugin adds code. More code means more 
              to download and process. Too many plugins can turn a fast site into a slow one.
            </p>
            
            <p>
              <strong>Unoptimized Code:</strong> Bloated CSS, JavaScript, and HTML all add up. 
              Clean, optimized code loads faster.
            </p>
            
            <p>
              <strong>Poor Hosting:</strong> Cheap hosting often means slow servers. Your site 
              can only be as fast as the server it's running on.
            </p>
            
            <p>
              <strong>No Caching:</strong> Caching stores parts of your site so they don't need 
              to be rebuilt every time. Without it, every page load is slower than it needs to be.
            </p>
          </div>
        </motion.section>

        {/* Section 5 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            How to Make Your Website Fast
          </h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              The good news? Making your site fast isn't complicated. Here's what you need to do:
            </p>
            
            <p>
              <strong>Optimize Images:</strong> Compress images before uploading. Use modern formats 
              like WebP. Resize images to the exact size you need, not larger.
            </p>
            
            <p>
              <strong>Minimize Plugins:</strong> Remove plugins you don't use. Choose lightweight 
              alternatives when possible. Every plugin should earn its place.
            </p>
            
            <p>
              <strong>Use a CDN:</strong> Content Delivery Networks serve your site from servers 
              closer to your visitors. This reduces loading time, especially for international 
              visitors.
            </p>
            
            <p>
              <strong>Enable Caching:</strong> Set up caching so your site doesn't rebuild every 
              page on every visit. This can cut loading times in half.
            </p>
            
            <p>
              <strong>Choose Fast Hosting:</strong> Invest in quality hosting. Fast servers mean 
              fast sites. It's worth the extra cost.
            </p>
            
            <p>
              <strong>Optimize Code:</strong> Minify CSS and JavaScript. Remove unused code. 
              Keep your codebase clean and efficient.
            </p>
          </div>
        </motion.section>

        {/* Section 6 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            The Bottom Line
          </h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              Website speed isn't optional anymore. It's not a nice-to-have feature. It's a 
              requirement. Slow sites lose customers. Fast sites win them.
            </p>
            
            <p>
              Every second counts. Every millisecond matters. In a world where customers have 
              infinite options, speed is often the deciding factor. Make sure your site is fast, 
              or watch your competitors take your customers.
            </p>
            
            <div className="bg-gray-900 text-white p-8 rounded-2xl my-8">
              <h3 className="text-2xl font-bold mb-4">Don't Guess—Test</h3>
              <p className="text-lg leading-relaxed text-gray-200">
                You can't improve what you don't measure. Test your website speed to see where 
                you stand and what needs to be fixed. Knowledge is the first step to improvement.
              </p>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 md:p-12 rounded-2xl text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Test Your Website Speed Now
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Find out how fast your website really is and get actionable recommendations to improve it.
          </p>
          <Link
            to="/speed-test"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Test Your Website Speed
          </Link>
        </motion.div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogSpeedWebsite;

