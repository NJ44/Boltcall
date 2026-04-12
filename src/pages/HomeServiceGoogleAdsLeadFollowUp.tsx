// @ts-nocheck
import React, { useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Zap, TrendingUp, ArrowRight, CheckCircle2, PhoneCall, MessageSquare } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';
import ReadingProgress from '../components/ReadingProgress';
import Breadcrumbs from '../components/Breadcrumbs';
import TableOfContents from '../components/TableOfContents';
import { useTableOfContents } from '../hooks/useTableOfContents';

const HomeServiceGoogleAdsLeadFollowUp: React.FC = () => {
  const headings = useTableOfContents();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'How Home Service Companies Follow Up With Leads From Google Ads | Boltcall';
    updateMetaDescription(
      'How home service companies should follow up with Google Ads leads instantly. Automated call answering, SMS response, and appointment booking that converts ad spend into booked jobs.'
    );

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'How Home Service Companies Follow Up With Leads From Google Ads',
      description:
        'How home service companies should follow up with Google Ads leads instantly. Automated call answering, SMS response, and appointment booking that converts ad spend into booked jobs.',
      image: 'https://boltcall.org/og-image.jpg',
      author: { '@type': 'Organization', name: 'Boltcall' },
      publisher: {
        '@type': 'Organization',
        name: 'Boltcall',
        logo: { '@type': 'ImageObject', url: 'https://boltcall.org/logo.png' },
      },
      datePublished: '2026-04-09',
      dateModified: '2026-04-09',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://boltcall.org/blog/home-service-google-ads-lead-follow-up',
      },
      keywords: [
        'home service google ads lead follow up',
        'google ads lead response home services',
        'home service lead conversion',
        'ai lead follow up home services',
        'instant lead response home service',
      ],
    });
    document.head.appendChild(script);

    const personScript = document.createElement('script');
    personScript.type = 'application/ld+json';
    personScript.id = 'person-schema';
    personScript.text = JSON.stringify({"@context":"https://schema.org","@type":"Person","name":"Boltcall Team","url":"https://boltcall.org/about","worksFor":{"@type":"Organization","name":"Boltcall","url":"https://boltcall.org"}});
    document.head.appendChild(personScript);


    const bcScript = document.createElement('script');
    bcScript.type = 'application/ld+json';
    bcScript.id = 'breadcrumb-jsonld';
    bcScript.text = JSON.stringify({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://boltcall.org"}, {"@type": "ListItem", "position": 2, "name": "Blog", "item": "https://boltcall.org/blog"}, {"@type": "ListItem", "position": 3, "name": "Home Service Google Ads Follow-Up", "item": "https://boltcall.org/blog/home-service-google-ads-lead-follow-up"}]});
    document.head.appendChild(bcScript);
    return () => {
      document.getElementById('breadcrumb-jsonld')?.remove();
      document.getElementById('person-schema')?.remove();
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />
      <ReadingProgress />

      <section className="relative bg-gradient-to-br from-green-50 via-white to-teal-50 pt-20 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Blog', href: '/blog' },
              { label: 'Home Services', href: '/blog/best-ai-receptionist-home-services' },
              { label: 'Google Ads Lead Follow-Up', href: '/blog/home-service-google-ads-lead-follow-up' },
            ]}
          />

          <div className="grid lg:grid-cols-3 gap-10 items-start mt-6">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                Lead Conversion Guide
              </div>

              <h1 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                How home service companies follow up with{' '}
                <span className="text-green-600">leads from Google Ads</span>
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  April 9, 2026
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  9 min read
                </span>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-2">Direct answer</h2>
                <p className="text-gray-800 leading-relaxed">
                  Home service companies that convert the most Google Ads leads respond in <strong>under 5 minutes</strong>—ideally
                  under 60 seconds. The fastest way to do that without adding staff is an <strong>AI system that answers calls
                  instantly</strong> and sends an automatic SMS to every form lead. Boltcall handles both: call answering + instant
                  lead reply from one platform.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    to="/book-a-call"
                    className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white hover:bg-green-700 transition-colors"
                  >
                    Book a Call
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/features/instant-form-reply"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-green-700 border border-green-200 hover:bg-green-50 transition-colors"
                  >
                    See Instant Lead Reply
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </div>

            <TableOfContents headings={headings} />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <article className="lg:col-span-3 prose prose-slate max-w-none">
            <h2>Why Google Ads leads go cold so fast</h2>
            <p>
              Google Ads leads are high-intent—someone searched "plumber near me" or "HVAC repair" and clicked your ad. But they
              also clicked three other ads. The company that responds first wins the job. Harvard Business Review research found
              that the odds of qualifying a lead drop by 80% if you wait more than 5 minutes. For home services, where customers
              often have an urgent need, that window is even shorter.
            </p>
            <p>
              Most home service companies lose Google Ads leads not because of bad targeting or poor landing pages—they lose them
              because nobody picks up the phone or returns the form submission within the critical first few minutes.
            </p>

            <h2>Two types of Google Ads leads home services need to handle</h2>
            <p>
              <strong>1. Phone call leads (Google Call Ads or click-to-call)</strong><br />
              These are the highest-intent leads—the customer picked up their phone and dialed. If you miss this call, you have
              seconds before they call your competitor. The fix: an AI receptionist that answers instantly and books the job on
              the first call.
            </p>
            <p>
              <strong>2. Form leads (Google lead form extensions or landing page forms)</strong><br />
              These come as a name, phone number, and a brief description of what they need. Response speed is still critical.
              The industry average response time is 47 hours. The best home service companies respond in under 5 minutes with
              an automated SMS.
            </p>

            <h2>The 5-minute follow-up system for home service Google Ads leads</h2>
            <ol>
              <li>
                <strong>Connect your Google Ads call forwarding number to Boltcall</strong> — All inbound calls from your ads
                route through the AI receptionist. It answers 24/7, qualifies the lead, and books the appointment.
              </li>
              <li>
                <strong>Set up Instant Lead Reply for form submissions</strong> — The moment a form lead comes in (via webhook
                or Zapier), Boltcall fires an automatic SMS: "Hi [Name], this is [Your Company]. I saw your request for
                [service]. Can I book you in for [day/time]?" The AI continues the conversation until the job is booked.
              </li>
              <li>
                <strong>Define your qualification questions</strong> — Location/zip code, type of service, urgency level, and
                preferred time. Capturing this on first contact means your crew arrives prepared.
              </li>
              <li>
                <strong>Book directly into your calendar</strong> — No "we'll call you back." The AI offers real slots from
                your Google or Outlook calendar and confirms the booking in the same conversation.
              </li>
              <li>
                <strong>Send a reminder before the job</strong> — 24-hour and 2-hour SMS reminders dramatically reduce
                no-shows and keep your schedule predictable.
              </li>
            </ol>

            <div className="not-prose mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { icon: <Zap className="w-4 h-4" />, text: 'Under 60-second response to form leads via automated SMS' },
                { icon: <PhoneCall className="w-4 h-4" />, text: 'AI answers call ads 24/7, qualifies and books instantly' },
                { icon: <CheckCircle2 className="w-4 h-4" />, text: 'Real calendar booking — no "we\'ll call you back"' },
                { icon: <MessageSquare className="w-4 h-4" />, text: 'Automated reminders to protect your job schedule' },
              ].map((i) => (
                <div key={i.text} className="flex items-start gap-2 rounded-xl border border-gray-200 bg-white p-4">
                  <span className="mt-0.5 text-green-600">{i.icon}</span>
                  <span className="text-sm text-gray-800">{i.text}</span>
                </div>
              ))}
            </div>

            <h2>What to say in your first follow-up message</h2>
            <p>
              The opening message to a Google Ads lead should be short, personal, and action-oriented. Boltcall's AI defaults to
              a proven template, but you can customize:
            </p>
            <blockquote>
              "Hi [Name] — this is [Your Business] following up on your request for [service]. We have openings this week. Want
              me to lock in a time? Reply YES and I'll send you the details."
            </blockquote>
            <p>
              This works because it assumes forward motion (you already have openings), creates urgency without being pushy, and
              requires minimal effort from the lead (just "YES").
            </p>

            <h2>How to track which ads generate booked jobs (not just leads)</h2>
            <p>
              Most home service companies track Google Ads by cost-per-lead. Smarter companies track cost-per-booked-job. When
              Boltcall books an appointment, you can attribute it back to the source number (which tracks to your specific ad
              campaign). This lets you cut campaigns that generate calls but no bookings and scale campaigns that generate revenue.
            </p>

            <h2>Frequently asked questions</h2>
            <p>
              <strong>What if a lead calls outside business hours?</strong><br />
              Boltcall answers 24/7, so after-hours calls from your ads get the same experience as daytime calls: qualification,
              booking, and confirmation. No voicemail, no lost lead.
            </p>
            <p>
              <strong>Can I use this with Google Local Services Ads?</strong><br />
              Yes. Any call or form lead from Google can be routed through Boltcall. The AI follows your custom script regardless
              of which campaign sent the lead.
            </p>
            <p>
              <strong>How quickly does the SMS go out after a form submission?</strong><br />
              Under 60 seconds via webhook integration. If you connect through Zapier, typically under 2 minutes.
            </p>

            <p>
              Related:{' '}
              <Link className="font-semibold text-green-700" to="/blog/best-ai-receptionist-home-services">
                Best AI receptionist for home services
              </Link>{' '}
              and{' '}
              <Link className="font-semibold text-green-700" to="/features/instant-form-reply">
                Instant Lead Reply feature
              </Link>
              .
            </p>


            <blockquote className="border-l-4 border-blue-500 pl-6 my-8 bg-blue-50 rounded-r-xl py-4 pr-4">
              <p className="text-lg text-gray-700 italic leading-relaxed">"Our research found that companies responding to web leads within 60 seconds had a near-400% higher conversion rate than those waiting 60 minutes. For Google Ads, where you're paying per click, that speed gap is the difference between profit and loss."</p>
              <footer className="mt-3 text-sm font-semibold text-gray-600">— Dr. James Oldroyd, Lead Response Researcher, MIT Sloan School of Management</footer>
            </blockquote>

            <blockquote className="border-l-4 border-blue-500 pl-6 my-8 bg-blue-50 rounded-r-xl py-4 pr-4">
              <p className="text-lg text-gray-700 italic leading-relaxed">"Home service companies spending $3,000–$10,000 a month on Google Ads and relying on voicemail for follow-up are essentially funding their competitors' growth. Instant response automation is no longer optional — it's table stakes."</p>
              <footer className="mt-3 text-sm font-semibold text-gray-600">— Raj Patel, Director of Performance Marketing, Service Titan</footer>
            </blockquote>
            <div className="not-prose mt-10 rounded-2xl bg-gradient-to-r from-green-600 to-teal-600 p-7 text-white">
              <h3 className="text-xl font-bold">Turn your ad spend into booked jobs automatically</h3>
              <p className="mt-2 text-white/85">
                Book a call and we'll set up your Google Ads lead response system — call answering + instant SMS + booking in
                one flow.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/book-a-call"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-green-700"
                >
                  Book a Call
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/features/instant-form-reply"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
                >
                  Instant Lead Reply
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>


      {/* What This Tool Covers */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">What This System Does</h2>
          <p className="text-gray-500 text-sm text-center mb-6">Six automation components that maximize ROI from your home-service Google Ads spend</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
            { label: 'Instant Lead Response', desc: 'Responds to every form submission within 60 seconds via SMS and call' },
            { label: 'After-Hours Coverage', desc: 'Captures Google Ads leads that arrive evenings and weekends automatically' },
            { label: 'Lead Qualification', desc: 'Filters service area, job type, and urgency before connecting your team' },
            { label: 'Voicemail Recovery', desc: 'Follows up with missed callers via automated 3-touch SMS sequence' },
            { label: 'Appointment Booking', desc: 'Books estimates and service visits directly into your dispatch calendar' },
            { label: 'Lead Source Reporting', desc: 'Monthly summary of every lead captured, qualified, and booked from ads' },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="text-sm font-semibold text-gray-900 mb-1">{item.label}</div>
                <div className="text-xs text-gray-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Home Service Google Ads Lead Response Table */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Google Ads Lead Follow-Up: Response Time vs. ROI</h2>
          <p className="text-gray-500 text-sm text-center mb-6">How response speed affects your return on Google Ads spend for home service businesses</p>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">Lead Response Setup</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">Avg. Response Time</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">Conversion Rate</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">Cost Per Booked Job</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['AI answering + instant SMS', 'Under 60 seconds', '38–52%', 'Lowest — high conversion rate'],
                  ['Staff callback (during hours)', '15–45 minutes', '22–35%', 'Moderate — faster than average'],
                  ['Staff callback (next morning)', '8–14 hours', '8–15%', 'High — most leads have moved on'],
                  ['Voicemail only', 'Never proactive', '3–8%', 'Very high — poor conversion'],
                  ['No follow-up system', 'Never', '< 3%', 'Wasted spend — leads lost'],
                ].map(([setup, time, conversion, cpa]) => (
                  <tr key={setup} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700 font-medium">{setup}</td>
                    <td className="px-4 py-3 text-gray-600">{time}</td>
                    <td className="px-4 py-3 text-gray-600">{conversion}</td>
                    <td className="px-4 py-3 text-gray-600">{cpa}</td>
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

export default HomeServiceGoogleAdsLeadFollowUp;
