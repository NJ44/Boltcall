import React, { useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, TrendingUp, Phone, Zap } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';
import ReadingProgress from '../components/ReadingProgress';
import TableOfContents from '../components/TableOfContents';
import { useTableOfContents } from '../hooks/useTableOfContents';
import Breadcrumbs from '../components/Breadcrumbs';

const BlogSpeedToLeadStatistics: React.FC = () => {
  const headings = useTableOfContents();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Speed to Lead Statistics for Home Service Businesses (2026) | Boltcall';
    updateMetaDescription(
      '17 speed-to-lead statistics every contractor needs to see. How response time affects revenue for HVAC, plumbing, roofing, and solar businesses — with industry benchmarks.'
    );

    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Speed to Lead Statistics for Home Service Businesses (2026)',
      description:
        '17 speed-to-lead statistics every contractor needs to see. How response time impacts revenue for HVAC, plumbing, roofing, and solar businesses.',
      author: { '@type': 'Organization', name: 'Boltcall' },
      publisher: {
        '@type': 'Organization',
        name: 'Boltcall',
        logo: { '@type': 'ImageObject', url: 'https://boltcall.org/boltcall_full_logo.png' },
      },
      datePublished: '2026-04-22',
      dateModified: '2026-04-22',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://boltcall.org/blog/speed-to-lead-statistics-home-service-business',
      },
      image: { '@type': 'ImageObject', url: 'https://boltcall.org/og-image.jpg' },
    };

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is the average lead response time for home service businesses?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The average lead response time across industries is over 29 hours. For home service businesses specifically, more than half of contractors take five days or longer to respond to new inquiries. Only 17% of HVAC businesses respond to a lead within the hour.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much does slow lead response cost a contractor?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Waiting more than 5 minutes to respond to a lead reduces your chance of qualifying that lead by 80%. For a home service business receiving 50 leads per month with an average job value of $400, slow response can cost $8,000–$15,000 in lost revenue monthly.',
          },
        },
        {
          '@type': 'Question',
          name: 'What percentage of businesses never respond to leads?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '63% of companies never respond to a lead at all. For home service businesses, over 60% of inbound calls go unanswered, and 85% of callers who do not get through will not call back.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the 5-minute rule in speed to lead?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The 5-minute rule states that responding to a lead within 5 minutes makes you 21 times more likely to qualify that lead than responding within 30 minutes. Companies that respond within 5 minutes are 100 times more likely to make contact than those that wait 30 minutes.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does AI improve speed to lead for home service businesses?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '62.5% of businesses using AI for lead response meet the under-15-minute standard, compared to 39.1% of businesses using manual-only processes. AI systems respond within seconds to every inbound call, form, or text — 24 hours a day including after-hours leads.',
          },
        },
      ],
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://boltcall.org' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://boltcall.org/blog' },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Speed to Lead Statistics',
          item: 'https://boltcall.org/blog/speed-to-lead-statistics-home-service-business',
        },
      ],
    };

    ['article-schema', 'faq-schema', 'breadcrumb-jsonld'].forEach((id) =>
      document.getElementById(id)?.remove()
    );

    const addScript = (id: string, data: object) => {
      const s = document.createElement('script');
      s.id = id;
      s.type = 'application/ld+json';
      s.text = JSON.stringify(data);
      document.head.appendChild(s);
    };

    addScript('article-schema', articleSchema);
    addScript('faq-schema', faqSchema);
    addScript('breadcrumb-jsonld', breadcrumbSchema);

    return () => {
      ['article-schema', 'faq-schema', 'breadcrumb-jsonld'].forEach((id) =>
        document.getElementById(id)?.remove()
      );
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />
      <ReadingProgress />

      {/* Hero */}
      <section className="relative pt-32 pb-8 bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
        <div className="max-w-4xl px-4 sm:px-6 lg:px-8" style={{ marginLeft: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left mb-4"
          >
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Blog', href: '/blog' },
                {
                  label: 'Speed to Lead Statistics',
                  href: '/blog/speed-to-lead-statistics-home-service-business',
                },
              ]}
            />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight text-left">
              17 Speed to Lead Statistics Every{' '}
              <span className="text-blue-600">Home Service Business</span> Needs to See (2026)
            </h1>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>April 22, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>10 min read</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div className="flex gap-8">
          <article className="flex-1 max-w-4xl">

            {/* Intro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="prose prose-lg max-w-none mb-12"
            >
              <p className="text-xl text-gray-700 leading-relaxed font-medium">
                For plumbers, HVAC technicians, roofers, and solar installers, every lead is a job.
                The data on speed to lead is unambiguous: the contractor who responds first wins the job.
                Not the cheapest one. Not the one with the most reviews. The first one to pick up the phone.
                Below are 17 statistics that prove it — pulled from recent studies across the home service industry.
              </p>
            </motion.div>

            {/* Table of Contents */}
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 mb-12">
              <h2 className="text-base font-bold text-gray-900 mb-4">In This Article</h2>
              <ol className="space-y-2 list-decimal list-inside">
                <li><a href="#the-core-numbers" className="text-blue-600 hover:underline text-sm">The Core Numbers: Response Time vs. Revenue</a></li>
                <li><a href="#the-reality-gap" className="text-blue-600 hover:underline text-sm">The Reality Gap: What Contractors Are Actually Doing</a></li>
                <li><a href="#industry-by-industry" className="text-blue-600 hover:underline text-sm">Industry-by-Industry Benchmarks</a></li>
                <li><a href="#after-hours" className="text-blue-600 hover:underline text-sm">After-Hours: The Hidden Revenue Leak</a></li>
                <li><a href="#missed-calls" className="text-blue-600 hover:underline text-sm">Missed Calls: The Stats That Hurt</a></li>
                <li><a href="#ai-advantage" className="text-blue-600 hover:underline text-sm">The AI Advantage in Speed to Lead</a></li>
                <li><a href="#roi-calculator" className="text-blue-600 hover:underline text-sm">What Slow Response Costs You Per Month</a></li>
                <li><a href="#faq" className="text-blue-600 hover:underline text-sm">FAQ: Speed to Lead for Contractors</a></li>
              </ol>
            </div>

            {/* Section 1 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-16"
            >
              <h2 id="the-core-numbers" className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-start gap-3">
                <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
                The Core Numbers: Response Time vs. Revenue
              </h2>

              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  Every minute a lead goes unanswered, your competition is getting closer to booking
                  the job. Here are the numbers that define why speed to lead is the most important
                  metric a home service business can track.
                </p>

                <div className="space-y-5 mt-6">
                  <div className="border-l-4 border-blue-600 pl-5">
                    <p className="text-lg font-bold text-gray-900">
                      <span className="text-blue-600">Stat #1:</span> Responding within 60 seconds
                      increases conversion rates by 391%.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Source: Lead Response Management study, Harvard Business Review
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-600 pl-5">
                    <p className="text-lg font-bold text-gray-900">
                      <span className="text-blue-600">Stat #2:</span> Businesses that respond within
                      5 minutes see 3.5x higher conversion rates compared to those that respond
                      after 30 minutes.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Source: InsideSales Lead Response Study</p>
                  </div>

                  <div className="border-l-4 border-blue-600 pl-5">
                    <p className="text-lg font-bold text-gray-900">
                      <span className="text-blue-600">Stat #3:</span> Calling a lead within 1 minute
                      of their inquiry increases conversion by 391% vs. calling after 2 minutes.
                      Waiting just 5 minutes drops that chance by 80%.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Source: MIT / Kellogg School of Management</p>
                  </div>

                  <div className="border-l-4 border-blue-600 pl-5">
                    <p className="text-lg font-bold text-gray-900">
                      <span className="text-blue-600">Stat #4:</span> Contractors who respond within
                      5 minutes are 21 times more likely to qualify a lead than those who respond
                      within 30 minutes.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Source: Lead Response Management Research</p>
                  </div>

                  <div className="border-l-4 border-blue-600 pl-5">
                    <p className="text-lg font-bold text-gray-900">
                      <span className="text-blue-600">Stat #5:</span> 78% of customers go with the
                      first company that responds. Not the cheapest. Not the most reviewed.
                      The first.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Source: Salesforce State of Sales Report</p>
                  </div>
                </div>

                <p>
                  For home service businesses buying leads from Google Local Services Ads, Yelp, or
                  Angi — a $50 lead responded to in 60 seconds has fundamentally different ROI than
                  the same lead responded to in 30 minutes. The lead cost is identical. The conversion
                  rate is not.
                </p>
              </div>
            </motion.section>

            {/* Speed Timeline Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 mb-16">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">Response Time</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">Conversion Impact</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">Lead Qualification Odds</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Under 60 seconds', '+391% vs. 5-minute response', '21x more likely than 30-min response'],
                    ['1–5 minutes', '+100% vs. baseline', '4x more likely than 30-min response'],
                    ['5–30 minutes', '–80% drop from peak', 'Qualification chance falls sharply'],
                    ['30 min – 1 hour', 'Baseline for comparison', '10x more likely than 24-hour response'],
                    ['1–24 hours', '–60% vs. baseline', 'Most leads have already called a competitor'],
                    ['24+ hours or never', '–90%+ vs. baseline', 'Lead is effectively lost'],
                  ].map(([time, impact, odds]) => (
                    <tr key={time} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-700 font-medium">{time}</td>
                      <td className="px-4 py-3 text-blue-700 font-semibold">{impact}</td>
                      <td className="px-4 py-3 text-gray-600">{odds}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-gray-400 px-4 py-3">
                Sources: Lead Response Management Study, InsideSales Research, MIT/Harvard Business Review.
              </p>
            </div>

            {/* Section 2 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-16"
            >
              <h2 id="the-reality-gap" className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-start gap-3">
                <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
                The Reality Gap: What Contractors Are Actually Doing
              </h2>

              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  The data on why fast response wins is not new. Business owners know it. And yet
                  response times across the home service industry remain catastrophically slow.
                  Here is what the research shows.
                </p>

                <div className="space-y-5 mt-6">
                  <div className="border-l-4 border-blue-600 pl-5">
                    <p className="text-lg font-bold text-gray-900">
                      <span className="text-blue-600">Stat #6:</span> The average lead response time
                      across industries is over 29 hours.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Source: Prospeo Lead Response Benchmark 2026</p>
                  </div>

                  <div className="border-l-4 border-blue-600 pl-5">
                    <p className="text-lg font-bold text-gray-900">
                      <span className="text-blue-600">Stat #7:</span> 63% of companies never respond
                      to a lead at all.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Source: Harvard Business Review</p>
                  </div>

                  <div className="border-l-4 border-blue-600 pl-5">
                    <p className="text-lg font-bold text-gray-900">
                      <span className="text-blue-600">Stat #8:</span> More than half of contractors
                      take five days or longer to respond to a new inquiry.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Source: CustomerFlows Home Service Business Statistics 2026</p>
                  </div>

                  <div className="border-l-4 border-blue-600 pl-5">
                    <p className="text-lg font-bold text-gray-900">
                      <span className="text-blue-600">Stat #9:</span> 35% of business owners say
                      responding within 5 minutes is essential — but 38% of those same business
                      owners admit they fail to meet their own standard.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Source: LeadResponse.co Speed-to-Lead Benchmarks 2026</p>
                  </div>
                </div>

                <p>
                  The gap between knowing speed matters and actually achieving it is the opportunity.
                  Every contractor who is slow is handing jobs to whoever responds first. If you can
                  respond in under 5 minutes consistently — automatically — you win by default in most
                  markets.
                </p>

                <p>
                  Read more on why this gap is costing local businesses thousands per month in our{' '}
                  <Link to="/blog/why-speed-matters" className="text-blue-600 hover:underline">
                    deep dive on the 391% speed-to-lead advantage
                  </Link>
                  .
                </p>
              </div>
            </motion.section>

            {/* Section 3 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mb-16"
            >
              <h2 id="industry-by-industry" className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-start gap-3">
                <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
                Industry-by-Industry Benchmarks
              </h2>

              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  The problem is not evenly distributed. Some trades are slower than others. Here is
                  where each home service vertical stands — and what the opportunity looks like if
                  you move faster than the average competitor.
                </p>

                <div className="space-y-5 mt-6">
                  <div className="border-l-4 border-blue-600 pl-5">
                    <p className="text-lg font-bold text-gray-900">
                      <span className="text-blue-600">Stat #10:</span> Only 17% of HVAC businesses
                      respond to a lead within one hour — the slowest response rate of any home
                      service category surveyed.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Source: Home Service Business Statistics 2026, CustomerFlows</p>
                  </div>

                  <div className="border-l-4 border-blue-600 pl-5">
                    <p className="text-lg font-bold text-gray-900">
                      <span className="text-blue-600">Stat #11:</span> In a 2025 analysis of
                      contractor leads across HVAC, plumbing, electrical, and tree services — text
                      responses under 60 seconds achieved a 73% appointment booking rate. Responses
                      after 30 minutes achieved 4%.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Source: Apten Speed-to-Lead Benchmarks 2026</p>
                  </div>
                </div>

                <p>
                  The opportunity for HVAC businesses is enormous. If 83% of your competitors are not
                  responding within an hour, beating them is not about being exceptional — it is about
                  having a system. See how{' '}
                  <Link to="/blog/ai-appointment-scheduling-hvac" className="text-blue-600 hover:underline">
                    AI appointment scheduling is transforming HVAC lead response
                  </Link>
                  .
                </p>
              </div>
            </motion.section>

            {/* Section 4 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-16"
            >
              <h2 id="after-hours" className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-start gap-3">
                <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
                After-Hours: The Hidden Revenue Leak
              </h2>

              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  Most contractors think about lead response during business hours. The data says that
                  is exactly the wrong place to focus. The bigger revenue leak is what happens at 7 PM
                  when someone searches for an emergency plumber, calls three companies, and the first
                  one to text back wins the job.
                </p>

                <div className="space-y-5 mt-6">
                  <div className="border-l-4 border-blue-600 pl-5">
                    <p className="text-lg font-bold text-gray-900">
                      <span className="text-blue-600">Stat #12:</span> 41% of jobs booked online
                      for home service businesses come in after business hours.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Source: Jobber Home Service Trends Report 2026</p>
                  </div>

                  <div className="border-l-4 border-blue-600 pl-5">
                    <p className="text-lg font-bold text-gray-900">
                      <span className="text-blue-600">Stat #13:</span> 70%+ of customers expect a
                      same-day response from a home service business. More than half expect it within
                      the hour.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Source: WebFX Home Services Marketing Benchmarks 2026</p>
                  </div>
                </div>

                <p>
                  If you are not set up to respond after hours, you are competing for only 59% of the
                  available market — and losing almost half the jobs before the work day begins. Read
                  our full breakdown:{' '}
                  <Link to="/blog/after-hours-lead-response-home-services" className="text-blue-600 hover:underline">
                    After-hours leads are killing your home service business
                  </Link>
                  .
                </p>
              </div>
            </motion.section>

            {/* Section 5 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mb-16"
            >
              <h2 id="missed-calls" className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-start gap-3">
                <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
                Missed Calls: The Stats That Hurt
              </h2>

              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  A missed call is not a neutral event. It is an active transfer of that lead to your
                  competitor. Here is what the data says happens after a call goes unanswered.
                </p>

                <div className="space-y-5 mt-6">
                  <div className="border-l-4 border-blue-600 pl-5">
                    <p className="text-lg font-bold text-gray-900">
                      <span className="text-blue-600">Stat #14:</span> 85% of callers who do not
                      reach a business on their first attempt will not call back.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Source: NorthText, Signpost Missed Call Research</p>
                  </div>

                  <div className="border-l-4 border-blue-600 pl-5">
                    <p className="text-lg font-bold text-gray-900">
                      <span className="text-blue-600">Stat #15:</span> Over 60% of calls to small
                      businesses go unanswered. Of those, only 20% leave a voicemail.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Source: Grasshopper Small Business Phone Study</p>
                  </div>

                  <div className="border-l-4 border-blue-600 pl-5">
                    <p className="text-lg font-bold text-gray-900">
                      <span className="text-blue-600">Stat #16:</span> Text messages sent as a
                      missed-call follow-up have a 98% open rate. 90% are read within 3 minutes.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Source: NorthText SMS Industry Report</p>
                  </div>
                </div>

                <p>
                  The missed-call text-back approach — sending an automatic SMS the moment a call goes
                  unanswered — recovers a significant portion of those lost leads. An HVAC contractor
                  who implemented this reported 5 to 8 additional bookings per month from leads who
                  replied to the follow-up text, adding $2,000–$3,200 in monthly revenue.
                </p>
              </div>
            </motion.section>

            {/* Section 6 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-16"
            >
              <h2 id="ai-advantage" className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-start gap-3">
                <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
                The AI Advantage in Speed to Lead
              </h2>

              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  The reason most contractors respond slowly is not laziness — it is that the manual
                  process does not scale. You cannot be on a job and answering the phone at the same
                  time. AI changes this equation entirely.
                </p>

                <div className="space-y-5 mt-6">
                  <div className="border-l-4 border-blue-600 pl-5">
                    <p className="text-lg font-bold text-gray-900">
                      <span className="text-blue-600">Stat #17:</span> 62.5% of businesses using
                      AI for lead response meet the under-15-minute standard. Only 39.1% of businesses
                      using manual-only processes meet it.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Source: LeadResponse.co Speed-to-Lead Benchmarks 2026</p>
                  </div>
                </div>

                <p>
                  AI does not take breaks. It answers at 11 PM on a Sunday. It texts back the missed
                  call at 6 AM before the owner wakes up. It qualifies the lead, collects the job
                  details, and books the appointment — all before a manual process would have even
                  seen the notification.
                </p>

                <p>
                  For contractors who compete on price because they cannot compete on speed, AI
                  changes the playing field. You do not have to be the cheapest option if you are
                  the first to respond.
                </p>
              </div>
            </motion.section>

            {/* Section 7: ROI */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mb-16"
            >
              <h2 id="roi-calculator" className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-start gap-3">
                <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
                What Slow Response Costs You Per Month
              </h2>

              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  Here is a practical example for a typical home service business. Run the math
                  against your own numbers.
                </p>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mt-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Example: Roofing Contractor, 60 Leads/Month, $2,500 Average Job
                  </h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Current response time</span>
                      <span className="font-semibold text-gray-900">4–6 hours</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Current conversion rate (slow)</span>
                      <span className="font-semibold text-gray-900">~8%</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Jobs booked per month (slow)</span>
                      <span className="font-semibold text-gray-900">≈ 5 jobs</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Monthly revenue (slow)</span>
                      <span className="font-semibold text-gray-900">$12,500</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200 mt-4">
                      <span className="text-gray-600">With sub-60-second AI response</span>
                      <span className="font-semibold text-blue-600">≈ 20–22% conversion</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Jobs booked per month (fast)</span>
                      <span className="font-semibold text-blue-600">≈ 12–13 jobs</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600 font-bold">Monthly revenue gain</span>
                      <span className="font-bold text-blue-600 text-base">+$17,500–$20,000</span>
                    </div>
                  </div>
                </div>

                <p>
                  Same ad spend. Same lead volume. Same market. The only variable is how fast you
                  respond. The contractor with the fastest response time is effectively operating
                  with a 2–3x higher ROI on their marketing spend.
                </p>

                <p>
                  Use our free{' '}
                  <Link to="/ai-revenue-calculator" className="text-blue-600 hover:underline">
                    AI revenue calculator
                  </Link>{' '}
                  to run this math for your specific business.
                </p>
              </div>
            </motion.section>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="my-16"
            >
              <div className="flex flex-col items-center justify-center text-center">
                <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-8 w-full max-w-[800px] group hover:bg-gray-50 transition duration-500 hover:duration-200">
                  <div className="flex justify-center isolate">
                    <div className="bg-white size-12 grid place-items-center rounded-xl relative left-2.5 top-1.5 -rotate-6 shadow-lg ring-1 ring-gray-200 group-hover:-translate-x-5 group-hover:-rotate-12 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
                      <Zap className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="bg-white size-12 grid place-items-center rounded-xl relative z-10 shadow-lg ring-1 ring-gray-200 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
                      <Phone className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="bg-white size-12 grid place-items-center rounded-xl relative right-2.5 top-1.5 rotate-6 shadow-lg ring-1 ring-gray-200 group-hover:translate-x-5 group-hover:rotate-12 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
                      <TrendingUp className="w-6 h-6 text-blue-500" />
                    </div>
                  </div>
                  <h2 className="text-gray-900 font-medium mt-4 text-4xl">
                    Stop Losing Jobs to Slower Competitors
                  </h2>
                  <p className="text-base text-gray-600 mt-2">
                    Boltcall responds to every lead in under 60 seconds — calls, texts, forms,
                    after-hours — automatically. No staff. No missed jobs.
                  </p>
                  <Link
                    to="/signup"
                    className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 hover:text-gray-900 h-10 px-4 py-2 shadow-sm active:shadow-none"
                  >
                    Start the free setup
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* FAQ */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="mb-16"
            >
              <h2 id="faq" className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-start gap-3">
                <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
                FAQ: Speed to Lead for Home Service Businesses
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    What is the average lead response time for home service businesses?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    The average lead response time across all industries is over 29 hours. For home
                    service businesses specifically, more than half of contractors take five days or
                    longer to respond to new inquiries. HVAC companies are among the slowest — only
                    17% respond within one hour of a new lead.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    How much does slow lead response cost a contractor?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Waiting more than 5 minutes reduces your chance of qualifying a lead by 80%. For
                    a contractor receiving 50 leads per month with an average job value of $400, slow
                    response can cost $8,000–$15,000 in lost revenue every month — from the same
                    marketing spend that a faster competitor would convert.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    What percentage of businesses never respond to leads?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    63% of companies never respond to a lead at all. For home service businesses,
                    over 60% of inbound calls go unanswered, and 85% of callers who do not get
                    through will not call back.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    What is the 5-minute rule in speed to lead?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    The 5-minute rule comes from Lead Response Management research showing that
                    responding to a lead within 5 minutes makes you 21 times more likely to qualify
                    that lead than responding within 30 minutes. Companies that respond within 5
                    minutes are 100 times more likely to make contact than those that wait 30 minutes.
                    After 5 minutes, your qualification probability drops by 80%.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    How does AI improve speed to lead for home service businesses?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    62.5% of businesses using AI for lead response meet the under-15-minute standard,
                    compared to 39.1% of businesses using manual-only processes. AI systems respond
                    within seconds to every inbound call, form submission, or text — 24 hours a day,
                    including after-hours leads. Since 41% of jobs booked online come in after hours,
                    AI removes the single biggest gap in a contractor's lead response system.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Related Reading */}
            <div className="border-t border-gray-100 pt-10 mt-10">
              <p className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Related Reading</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="/blog/why-speed-matters"
                  className="group p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                    The 391% Advantage: Responding in 60 Seconds
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Why 60 seconds is the number that matters</p>
                </Link>
                <Link
                  to="/blog/after-hours-lead-response-home-services"
                  className="group p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                    After-Hours Leads Are Killing Your Home Service Business
                  </p>
                  <p className="text-xs text-gray-500 mt-1">42% of home service leads arrive after hours</p>
                </Link>
                <Link
                  to="/blog/missed-calls-statistics-local-business-2026"
                  className="group p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                    Missed Call Statistics for Local Businesses (2026)
                  </p>
                  <p className="text-xs text-gray-500 mt-1">The real cost of every missed call</p>
                </Link>
                <Link
                  to="/blog/ai-appointment-scheduling-hvac"
                  className="group p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                    AI Appointment Scheduling for HVAC Companies
                  </p>
                  <p className="text-xs text-gray-500 mt-1">How HVAC contractors automate bookings</p>
                </Link>
              </div>
            </div>

          </article>

          <TableOfContents headings={headings} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogSpeedToLeadStatistics;
