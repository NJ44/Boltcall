// @ts-nocheck
import React, { useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';
import Breadcrumbs from '../components/Breadcrumbs';
import FinalCTA, { BLOG_CTA } from '../components/FinalCTA';

interface Stat {
  number: string;
  context: string;
  source: string;
}

const conversionStats: Stat[] = [
  { number: '9x', context: 'Businesses responding within 5 minutes are 9x more likely to convert leads than those responding after 30 minutes.', source: 'InsideSales.com / MIT' },
  { number: '78%', context: '78% of buyers choose the first business that responds to their inquiry.', source: 'Lead Response Management Study' },
  { number: '100x', context: 'You are 100x more likely to reach and qualify a lead if you respond within 5 minutes vs. 30 minutes.', source: 'MIT Sloan' },
  { number: '400%', context: 'After 10 minutes, your probability of a meaningful conversation drops by 400% compared to responding at 5 minutes.', source: 'Harvard Business Review' },
  { number: '7x', context: 'Companies following up within 1 hour of receiving an inquiry are 7x more likely to qualify the lead than those that wait longer.', source: 'Harvard Business Review' },
  { number: '21x', context: 'Businesses responding within 5 minutes vs. 30 minutes are 21x more likely to have a meaningful qualification conversation.', source: 'Inside Sales' },
];

const costStats: Stat[] = [
  { number: '47 hours', context: 'The average response time for web leads across local businesses. During this window, most prospects have already booked a competitor.', source: 'InsideSales research' },
  { number: '35–50%', context: 'Percentage of leads that go to the first vendor to respond, regardless of price or quality.', source: 'Vendasta' },
  { number: '80%', context: 'After 5 minutes of waiting, 80% of leads say they are less likely to buy from that business.', source: 'Lead Connect' },
  { number: '$500B+', context: 'Estimated annual revenue lost by US businesses due to slow or missed lead follow-up.', source: 'Drift / Forbes' },
  { number: '5 minutes', context: 'The response time threshold after which lead conversion probability begins to fall sharply.', source: 'MIT / Harvard Business Review' },
];

const industryStats: Stat[] = [
  { number: '38%', context: 'HVAC companies miss an average of 38% of inbound calls during peak season when technicians are on job sites.', source: 'Boltcall industry research' },
  { number: '72%', context: '72% of emergency plumbing callers hire the first plumber who answers the phone.', source: 'Plumbing industry surveys' },
  { number: '45%', context: 'Dental practices lose 45% of new patient inquiry conversions due to delayed follow-up beyond 10 minutes.', source: 'Dental Economics' },
  { number: '60%', context: 'Law firms lose approximately 60% of potential clients who do not receive a response within the same business day.', source: 'Clio Legal Trends Report' },
  { number: '3 calls', context: 'The average homeowner calls 3 contractors for an emergency service and books the first one who answers.', source: 'HomeAdvisor research' },
  { number: '24–72h', context: 'Average response time for home service businesses (HVAC, plumbing, electrical). Most leads are gone within 1 hour.', source: 'Boltcall / Angi research' },
];

const aiStats: Stat[] = [
  { number: '<10 sec', context: 'AI receptionists respond to inbound calls in under 10 seconds, compared to the 47-hour industry average for web leads.', source: 'Boltcall platform data' },
  { number: '24/7', context: '40–60% of web inquiries arrive outside business hours. AI handles these instantly; human staff cannot.', source: 'Boltcall platform data' },
  { number: '90%', context: 'Businesses using AI for instant lead response recover up to 90% of leads that would otherwise go to voicemail.', source: 'Boltcall client data' },
  { number: '3.1% → 7.4%', context: 'GEO-driven leads for businesses implementing speed-to-lead automation grew from 3.1% in Q4 2024 to 7.4% in Q4 2025.', source: 'NP Digital 2025' },
];

const missedCallStats: Stat[] = [
  { number: '62%', context: '62% of calls to small businesses go unanswered or to voicemail during business hours.', source: 'Invoca research' },
  { number: '85%', context: '85% of callers who cannot reach a business on the first call will not call back.', source: 'CloudCall research' },
  { number: '1 in 5', context: '1 in 5 small business owners say they miss calls every single day because they are too busy to answer.', source: 'Boltcall survey' },
  { number: '$1,200+', context: 'Average value of a single missed emergency service call (plumbing, HVAC, electrical) including lost repeat business.', source: 'Boltcall calculation' },
];

const StatCard: React.FC<{ stat: Stat }> = ({ stat }) => (
  <div className="border border-gray-200 rounded-xl p-5 hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
    <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
    <p className="text-gray-700 text-sm leading-relaxed mb-2">{stat.context}</p>
    <span className="text-xs text-gray-400">[{stat.source}]</span>
  </div>
);

const SpeedToLeadStatistics: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Speed to Lead Statistics: 2026 Response Time Data for Local Businesses | Boltcall';
    updateMetaDescription(
      'The most comprehensive collection of speed-to-lead statistics and lead response time data for local businesses in 2026. Conversion rates, industry benchmarks, and AI performance data.'
    );

    const schemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Speed to Lead Statistics: 2026 Response Time Data for Local Businesses',
        description:
          'The most comprehensive collection of speed-to-lead statistics and lead response time data for local businesses in 2026.',
        author: { '@type': 'Organization', name: 'Boltcall' },
        publisher: {
          '@type': 'Organization',
          name: 'Boltcall',
          logo: { '@type': 'ImageObject', url: 'https://boltcall.org/logo.png' },
        },
        datePublished: '2026-04-29',
        dateModified: '2026-04-29',
        url: 'https://boltcall.org/speed-to-lead/statistics',
        mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://boltcall.org/speed-to-lead/statistics' },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://boltcall.org' },
          { '@type': 'ListItem', position: 2, name: 'Speed to Lead', item: 'https://boltcall.org/speed-to-lead' },
          { '@type': 'ListItem', position: 3, name: 'Statistics', item: 'https://boltcall.org/speed-to-lead/statistics' },
        ],
      },
    ];

    const scriptEls = schemas.map((schema) => {
      const el = document.createElement('script');
      el.type = 'application/ld+json';
      el.id = `stl-stats-schema-${Math.random()}`;
      el.text = JSON.stringify(schema);
      document.head.appendChild(el);
      return el;
    });

    return () => scriptEls.forEach((el) => el.remove());
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />

      {/* Hero */}
      <section className="relative py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Speed to Lead', href: '/speed-to-lead' },
              { label: 'Statistics' },
            ]}
          />
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-5 mt-4">
            <BarChart3 className="w-4 h-4 mr-1" />
            2026 Research Data
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Speed to Lead Statistics for Local Businesses
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Every stat on lead response time, conversion rates, missed calls, and AI performance — with sources. Updated
            April 2026.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Top 3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-12"
        >
          <h2 className="text-base font-semibold text-blue-900 mb-3">Three Stats Every Local Business Owner Should Know</h2>
          <ul className="space-y-2 text-blue-800">
            <li><strong>9x</strong> — Businesses responding within 5 minutes are 9x more likely to convert than those responding at 30+ minutes.</li>
            <li><strong>78%</strong> — 78% of buyers choose the first business that responds to their inquiry.</li>
            <li><strong>47 hours</strong> — The average local business takes 47 hours to respond to a web lead. Most leads are gone within 1 hour.</li>
          </ul>
        </motion.div>

        {/* Conversion Stats */}
        <motion.section id="conversion-statistics" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="mb-14">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Response Time and Conversion Statistics</h2>
          </div>
          <p className="text-gray-500 text-sm mb-6">How response speed directly affects conversion rates.</p>
          <div className="grid md:grid-cols-2 gap-4">
            {conversionStats.map((stat) => <StatCard key={stat.number + stat.source} stat={stat} />)}
          </div>
        </motion.section>

        {/* Cost of Slow Response */}
        <motion.section id="cost-of-slow-response" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="mb-14">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">The Cost of Slow Response</h2>
          </div>
          <p className="text-gray-500 text-sm mb-6">What happens when businesses fail to respond quickly.</p>
          <div className="grid md:grid-cols-2 gap-4">
            {costStats.map((stat) => <StatCard key={stat.number + stat.source} stat={stat} />)}
          </div>
        </motion.section>

        {/* Industry Benchmarks */}
        <motion.section id="industry-benchmarks" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="mb-14">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Industry-Specific Benchmarks</h2>
          </div>
          <p className="text-gray-500 text-sm mb-6">Response time data broken down by local service industry.</p>
          <div className="grid md:grid-cols-2 gap-4">
            {industryStats.map((stat) => <StatCard key={stat.number + stat.source} stat={stat} />)}
          </div>
        </motion.section>

        {/* AI vs Human */}
        <motion.section id="ai-response-speed" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="mb-14">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">AI vs. Human Response Speed</h2>
          </div>
          <p className="text-gray-500 text-sm mb-6">How AI automation changes the speed-to-lead equation.</p>
          <div className="grid md:grid-cols-2 gap-4">
            {aiStats.map((stat) => <StatCard key={stat.number + stat.source} stat={stat} />)}
          </div>
        </motion.section>

        {/* Missed Call Stats */}
        <motion.section id="missed-call-statistics" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="mb-14">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-bold text-gray-900">Missed Call Statistics for Local Businesses</h2>
          </div>
          <p className="text-gray-500 text-sm mb-6">How many calls go unanswered and what that costs.</p>
          <div className="grid md:grid-cols-2 gap-4">
            {missedCallStats.map((stat) => <StatCard key={stat.number + stat.source} stat={stat} />)}
          </div>
        </motion.section>

        {/* Related links */}
        <div className="border-t border-gray-200 pt-8 mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Continue Reading</h2>
          <div className="flex flex-col gap-2">
            <Link to="/speed-to-lead" className="text-blue-600 hover:underline flex items-center gap-1 text-sm">
              <ArrowRight className="w-4 h-4" /> Speed to Lead: The Complete Guide
            </Link>
            <Link to="/blog/speed-to-lead-local-business" className="text-blue-600 hover:underline flex items-center gap-1 text-sm">
              <ArrowRight className="w-4 h-4" /> In-Depth Speed to Lead Guide for Local Businesses
            </Link>
            <Link to="/blog/missed-calls-statistics-local-business-2026" className="text-blue-600 hover:underline flex items-center gap-1 text-sm">
              <ArrowRight className="w-4 h-4" /> Missed Call Statistics 2026
            </Link>
          </div>
        </div>

      </div>

      <FinalCTA {...BLOG_CTA} />
      <Footer />
    </div>
  );
};

export default SpeedToLeadStatistics;
