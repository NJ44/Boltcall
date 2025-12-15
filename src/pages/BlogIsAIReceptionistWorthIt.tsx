import React, { useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, TrendingUp, CheckCircle, XCircle, Calculator, Users, Clock as ClockIcon, Zap, Phone } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';
import ReadingProgress from '../components/ReadingProgress';

const BlogIsAIReceptionistWorthIt: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Is AI Receptionist Worth It? Cost-Benefit Analysis';
    updateMetaDescription('Is an AI receptionist worth it? Complete cost-benefit analysis comparing AI vs traditional receptionist services. Read now.');
    
    // Add Article schema markup
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Is an AI Receptionist Worth It? A Complete Cost-Benefit Analysis",
      "description": "Is an AI receptionist worth it? Complete cost-benefit analysis comparing AI vs traditional receptionist services.",
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
      "datePublished": "2025-02-15",
      "dateModified": "2025-02-15",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://boltcall.org/blog/is-ai-receptionist-worth-it"
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
              <Calculator className="w-4 h-4" />
              <span className="font-semibold">Business Analysis</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Is an <span className="text-blue-600">AI Receptionist</span> Worth It? A Complete Cost-Benefit Analysis
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>February 15, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>8 min read</span>
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
            Every business owner faces the same question: Should I invest in an AI receptionist? With costs ranging from $99 to $500+ per month, it's a decision that requires careful analysis. This guide breaks down the real costs, benefits, and ROI to help you determine if an AI receptionist is worth it for your business.
          </p>
        </motion.div>

        {/* Cost Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-start gap-3">
            <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>The Real Cost Comparison</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
                <h3 className="text-xl font-bold text-gray-900">Human Receptionist</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Salary:</span>
                  <span>$2,500 - $4,000/month</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Benefits:</span>
                  <span>$500 - $800/month</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Training:</span>
                  <span>$200 - $500/month</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Sick Days/Vacation:</span>
                  <span>Coverage costs</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Total:</span>
                  <span className="text-red-600 font-bold">$3,200 - $5,300/month</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">AI Receptionist</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Monthly Fee:</span>
                  <span>$99 - $299/month</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Setup:</span>
                  <span>$0 - $500 (one-time)</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">No Benefits:</span>
                  <span>$0</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">24/7 Coverage:</span>
                  <span>Included</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Total:</span>
                  <span className="text-green-600 font-bold">$99 - $299/month</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
            <p className="text-lg text-gray-800">
              <strong>Bottom Line:</strong> An AI receptionist costs <strong className="text-blue-600">90-97% less</strong> than a human receptionist, while providing 24/7 coverage that a human simply cannot match.
            </p>
          </div>
        </motion.div>

        {/* ROI Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-start gap-3">
            <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>ROI Analysis: When It Makes Financial Sense</h2>
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
            <h3 className="text-2xl font-bold mb-6">Real-World ROI Example</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold mb-2">391%</div>
                <div className="text-blue-100 text-sm">Conversion increase when responding in 60 seconds</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold mb-2">$12,000</div>
                <div className="text-blue-100 text-sm">Additional monthly revenue from captured leads</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold mb-2">40:1</div>
                <div className="text-blue-100 text-sm">ROI ratio ($12k revenue / $299 cost)</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Scenario 1: High Call Volume Business</h3>
              <p className="text-gray-700 mb-4">
                If you receive <strong>100+ calls per month</strong> and miss even 20% of them, you're losing potential revenue. An AI receptionist that captures just 10 additional bookings per month at $200 average value equals <strong>$2,000/month in new revenue</strong>.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Monthly Calculation:</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• 10 captured bookings × $200 = $2,000 revenue</li>
                  <li>• AI Receptionist cost = $299</li>
                  <li>• <strong className="text-green-600">Net gain: $1,701/month</strong></li>
                </ul>
              </div>
            </div>

            <div className="border-l-4 border-green-600 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Scenario 2: After-Hours Coverage</h3>
              <p className="text-gray-700 mb-4">
                If you close at 5 PM but receive 30% of your calls after hours, you're missing opportunities. An AI receptionist provides 24/7 coverage, capturing leads even when you're closed.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Monthly Calculation:</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• 30 after-hours calls × 50% booking rate = 15 bookings</li>
                  <li>• 15 bookings × $150 average = $2,250 revenue</li>
                  <li>• AI Receptionist cost = $299</li>
                  <li>• <strong className="text-green-600">Net gain: $1,951/month</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-start gap-3">
            <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>Key Benefits Beyond Cost Savings</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3 mb-4">
                <ClockIcon className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">24/7 Availability</h3>
              </div>
              <p className="text-gray-700">
                Never miss a call, even at 3 AM. Your AI receptionist works around the clock, capturing leads when human staff can't.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3 mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Instant Response</h3>
              </div>
              <p className="text-gray-700">
                Respond to leads in seconds, not hours. Research shows 391% higher conversion rates when responding within 60 seconds.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3 mb-4">
                <Users className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Consistent Service</h3>
              </div>
              <p className="text-gray-700">
                No bad days, no mood swings. Your AI receptionist provides consistent, professional service every single time.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Scalable Growth</h3>
              </div>
              <p className="text-gray-700">
                Handle 10 calls or 1,000 calls per day without hiring additional staff. Your AI receptionist scales with your business.
              </p>
            </div>
          </div>
        </motion.div>

        {/* When It's NOT Worth It */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-start gap-3">
            <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>When an AI Receptionist Might NOT Be Worth It</h2>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg mb-6">
            <p className="text-gray-800 mb-4">
              An AI receptionist may not be the right fit if:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <XCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                <span>You receive fewer than 20 calls per month</span>
              </li>
              <li className="flex items-start">
                <XCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                <span>Your average booking value is under $50</span>
              </li>
              <li className="flex items-start">
                <XCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                <span>You need complex, multi-step problem-solving on every call</span>
              </li>
              <li className="flex items-start">
                <XCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                <span>You have a dedicated receptionist with minimal workload</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Decision Framework */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-start gap-3">
            <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>Decision Framework: Is It Worth It for You?</h2>
          
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Assessment</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Do you receive 30+ calls per month?</p>
                  <p className="text-sm text-gray-600">If yes, you're likely missing opportunities without 24/7 coverage.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Is your average booking value $100+?</p>
                  <p className="text-sm text-gray-600">Higher value = faster ROI. Even 2-3 captured bookings can pay for the service.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Do you miss calls or respond slowly?</p>
                  <p className="text-sm text-gray-600">If you miss even 10% of calls, an AI receptionist can capture that lost revenue.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Do you need after-hours coverage?</p>
                  <p className="text-sm text-gray-600">24/7 availability means capturing leads even when you're closed.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border-2 border-blue-600">
              <p className="text-lg font-semibold text-gray-900 mb-2">
                If you answered "yes" to 2+ questions, an AI receptionist is likely worth it for your business.
              </p>
              <p className="text-gray-600">
                The cost savings alone (compared to a human receptionist) combined with 24/7 coverage and instant response times typically provide a strong ROI within the first month.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Conclusion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-start gap-3">
            <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>The Bottom Line</h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              For most service-based businesses receiving 30+ calls per month, an AI receptionist is absolutely worth it. The combination of:
            </p>
            
            <ul className="space-y-3 text-lg text-gray-700 mb-6">
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <span><strong>90-97% cost savings</strong> compared to a human receptionist</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <span><strong>24/7 availability</strong> that captures leads even when you're closed</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <span><strong>Instant response times</strong> that increase conversion rates by 391%</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <span><strong>Scalable growth</strong> without additional hiring costs</span>
              </li>
            </ul>

            <p className="text-lg text-gray-700 leading-relaxed">
              ...makes an AI receptionist one of the highest-ROI investments a service business can make. Most businesses see a positive return within the first month, with many achieving 10:1 or better ROI ratios.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="my-16"
        >
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
        </motion.div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogIsAIReceptionistWorthIt;

