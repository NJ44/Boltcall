import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { updateMetaDescription } from '../lib/utils';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';
import Breadcrumbs from '../components/Breadcrumbs';

const WhatHappensPlumberMissesCall: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'What Happens When a Plumber Misses a Customer Call | Boltcall';
    updateMetaDescription(
      'When a plumber misses an urgent customer call, 80% of callers never leave a voicemail — they call the next plumber. Learn how to stop losing jobs to missed calls.'
    );

    const articleScript = document.createElement('script');
    articleScript.type = 'application/ld+json';
    articleScript.id = 'article-schema-plumber-missed';
    articleScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'What Happens When a Plumber Misses a Customer Call for Urgent Service',
      description: 'When a plumber misses a customer call for urgent service, the customer immediately calls the next plumber. Over 80% of callers do not leave voicemail — they move on within seconds.',
      author: { '@type': 'Organization', name: 'Boltcall', url: 'https://boltcall.org' },
      publisher: {
        '@type': 'Organization',
        name: 'Boltcall',
        logo: { '@type': 'ImageObject', url: 'https://boltcall.org/boltcall_full_logo.png' },
      },
      datePublished: '2026-04-29',
      dateModified: '2026-05-15',
      image: { '@type': 'ImageObject', url: 'https://boltcall.org/og-image.jpg' },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://boltcall.org/blog/what-happens-plumber-misses-customer-call-urgent-service',
      },
    });
    document.head.appendChild(articleScript);

    const bcScript = document.createElement('script');
    bcScript.type = 'application/ld+json';
    bcScript.id = 'breadcrumb-jsonld-plumber-missed';
    bcScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://boltcall.org' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://boltcall.org/blog' },
        { '@type': 'ListItem', position: 3, name: 'What Happens When a Plumber Misses a Call', item: 'https://boltcall.org/blog/what-happens-plumber-misses-customer-call-urgent-service' },
      ],
    });
    document.head.appendChild(bcScript);

    const faqScript = document.createElement('script');
    faqScript.type = 'application/ld+json';
    faqScript.id = 'faq-schema-plumber-missed';
    faqScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What happens when a plumber misses an urgent customer call?',
          acceptedAnswer: { '@type': 'Answer', text: 'The customer immediately calls the next plumber on their list. Over 80% of callers do not leave a voicemail for a missed call — they move on within seconds. The original plumber never hears from that customer again.' },
        },
        {
          '@type': 'Question',
          name: 'How much does one missed plumbing call cost?',
          acceptedAnswer: { '@type': 'Answer', text: 'A single missed emergency call costs $300–$800 in immediate lost revenue. Including lifetime customer value and referrals, one missed call can represent $2,000–$5,000 in total lost revenue over a few years.' },
        },
        {
          '@type': 'Question',
          name: 'How can a plumber answer calls when on a job?',
          acceptedAnswer: { '@type': 'Answer', text: 'AI phone answering systems like Boltcall answer every call 24/7 — even when the plumber is under a sink or on a roof. The AI qualifies the lead, books the appointment, and texts the plumber with the job details.' },
        },
        {
          '@type': 'Question',
          name: 'Do customers really call multiple plumbers at once?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes. Studies show that when a caller reaches voicemail, 75–80% immediately dial the next business. During emergencies like burst pipes, customers often have 2–3 plumbers called within 5 minutes of their first attempt.' },
        },
        {
          '@type': 'Question',
          name: 'What is the best solution to prevent missed plumbing calls?',
          acceptedAnswer: { '@type': 'Answer', text: 'An AI receptionist like Boltcall answers every call within 2 rings, 24/7. It handles emergency triage, appointment booking, and lead qualification — so the plumber never loses a job to a missed call again.' },
        },
      ],
    });
    document.head.appendChild(faqScript);

    return () => {
      document.getElementById('article-schema-plumber-missed')?.remove();
      document.getElementById('breadcrumb-jsonld-plumber-missed')?.remove();
      document.getElementById('faq-schema-plumber-missed')?.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-blue-50 via-white to-indigo-50/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            Plumbing Business Guide
          </div>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: 'What Happens When a Plumber Misses a Call', href: '/blog/what-happens-plumber-misses-customer-call-urgent-service' },
            ]}
          />
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            What Happens When a Plumber Misses a Customer Call for Urgent Service
          </h1>
          <p className="text-gray-500 text-sm mb-4">Updated May 2026 &bull; 6 min read</p>
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl px-5 py-4">
            <p className="text-gray-800 text-base leading-relaxed">
              When a plumber misses a customer call for urgent service, the customer immediately calls the next plumber on their list. Over 80% of callers who reach voicemail do not leave a message — they are searching under urgency and move on within seconds to a competitor who answers.
            </p>
          </div>
        </div>
      </section>

      {/* Main Article */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">

        {/* Section 1 */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">What the Customer Does Next</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The moment a plumbing call goes to voicemail, the customer experiences a flash of frustration and immediately picks up the phone again. They go back to Google, tap the second result, and dial. If that plumber answers — even with an automated voice — they have the job. The original plumber who missed the call will likely never hear from that customer again.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Studies from Harvard Business Review and MIT Sloan found that <Link to="/blog/speed-to-lead-local-business" className="text-blue-600 hover:underline">response speed is the single biggest factor in whether a service business converts an inbound lead</Link>. Businesses that respond within one minute are 391% more likely to close the customer than businesses that respond five minutes later. In a plumbing emergency, the window is even tighter — often under 60 seconds before the customer moves to a competitor.
          </p>

          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {[
              { stat: '80%', label: 'of callers who hit voicemail do NOT leave a message' },
              { stat: '60 sec', label: 'typical window before an urgent caller dials the next plumber' },
              { stat: '391%', label: 'more conversions when responding within 1 minute vs. 5 minutes' },
            ].map((item) => (
              <div key={item.label} className="bg-blue-50 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{item.stat}</div>
                <div className="text-sm text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">The Revenue Impact of One Missed Plumbing Call</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            A plumber who misses a single emergency call does not just lose one job. The average plumbing emergency job is worth $300 to $800 depending on the issue and the market. Beyond the immediate job, the customer who finds a fast-responding plumber often becomes a repeat customer and refers neighbors and colleagues.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            The lifetime value of a single plumbing customer can exceed $2,000 to $5,000 over a few years — multiple service calls, potentially a water heater replacement, recommending the plumber to friends. A missed call at 7 PM on a Tuesday is not just a lost $400 job. It is a lost relationship worth thousands.
          </p>

          <div className="mt-6 bg-red-50 rounded-xl p-6 border border-red-100">
            <h3 className="font-bold text-red-900 mb-4">Annual Revenue Loss from Missed Calls</h3>
            <div className="space-y-3">
              {[
                ['5 missed calls/week at $450 avg', '$117,000/year'],
                ['8 missed calls/week at $450 avg', '$187,200/year'],
                ['Including lifetime value (6x multiplier)', '$702,000 in lost LTV'],
              ].map(([scenario, loss]) => (
                <div key={scenario} className="flex justify-between items-center py-2 border-b border-red-100 last:border-0 text-sm">
                  <span className="text-gray-700">{scenario}</span>
                  <span className="font-bold text-red-600">{loss}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">Based on PHCC industry data and average plumbing job values.</p>
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Why Plumbers Miss Calls Even When Trying Not To</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Plumbing is a hands-on trade. A technician under a sink, on a roof, or at the meter cannot safely answer a phone call. The business owner who is also doing jobs cannot split their attention. Dispatch staff, when they exist, get overwhelmed during busy periods. After-hours calls arrive when the office is closed.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            None of this is failure — it is the physical reality of running a field service business. The problem is that customers do not adjust their expectations based on your workload. They call when they need help and expect immediate response regardless of what your team is doing.
          </p>

          <blockquote className="border-l-4 border-blue-500 pl-6 my-8 bg-blue-50 rounded-r-xl py-4 pr-4">
            <p className="text-lg text-gray-700 italic leading-relaxed">"Customers today expect near-instant response. In trades like plumbing, if you don't answer within the first two or three tries, you've already lost the job to the competitor who did."</p>
            <footer className="mt-3 text-sm font-semibold text-gray-600">— Tom Howard, Co-founder, Nexstar Network (Trades Business Coaching)</footer>
          </blockquote>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">How AI Changes the Outcome of a Missed Plumbing Call</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            When a plumber uses an <Link to="/features/ai-receptionist" className="text-blue-600 hover:underline">AI receptionist</Link> connected to their main phone line, a missed call does not mean a lost customer. The AI answers the call within one ring, greets the caller with the company name, asks about the issue, collects the caller's address and contact details, and checks real-time availability to offer appointment windows.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            The caller gets a real conversation — not a voicemail, not a recorded message — and leaves the call with a confirmed booking. The plumber gets a text notification with all the details. The job is filled before any competitor even knows the lead existed.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            For truly urgent situations like active leaks or sewage emergencies, the AI can be configured to immediately send the owner a priority text alert and offer the caller an emergency dispatch window. Every scenario gets handled — routine booking, urgent dispatch, after-hours inquiry — without the plumber having to stop their work.
          </p>

          <div className="mt-6 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">How Boltcall Handles Each Call Type</h3>
            <div className="space-y-4">
              {[
                { type: 'Routine service call', handling: 'Books into the next available calendar slot — drain cleaning, fixture install, water heater check.' },
                { type: 'Emergency call (burst pipe, flooding)', handling: 'Escalates with priority text to owner + offers same-day emergency booking window.' },
                { type: 'After-hours inquiry', handling: 'Acknowledges urgency, collects information, books next-day slot or triggers after-hours escalation.' },
                { type: 'Multiple simultaneous calls', handling: 'Handles unlimited calls at once — no queue, no hold music, no dropped calls during rush periods.' },
              ].map((row) => (
                <div key={row.type} className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <div>
                    <span className="font-semibold text-gray-900">{row.type}: </span>
                    <span className="text-gray-600 text-sm">{row.handling}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-xl font-bold mb-3">Never lose another plumbing job to a missed call</h3>
            <p className="text-blue-100 mb-6 max-w-lg mx-auto">
              Boltcall answers every call in under 2 seconds, 24/7 — booking jobs while you work.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
              >
                Start free trial
              </a>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
              >
                See pricing
              </Link>
            </div>
          </div>
        </section>

        {/* Related Reading */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Reading</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/blog/ai-phone-answering-plumbers" className="block p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition">
              <h3 className="font-bold text-gray-900 mb-1">AI Phone Answering for Plumbers</h3>
              <p className="text-sm text-gray-600">The complete guide to how AI handles calls for plumbing businesses — emergency triage, booking, and more.</p>
            </Link>
            <Link to="/blog/why-local-service-businesses-lose-customers-not-answering-calls" className="block p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition">
              <h3 className="font-bold text-gray-900 mb-1">Why Local Businesses Lose Customers</h3>
              <p className="text-sm text-gray-600">The full research on why response speed beats price, reviews, and reputation for local service businesses.</p>
            </Link>
            <Link to="/blog/speed-to-lead-local-business" className="block p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition">
              <h3 className="font-bold text-gray-900 mb-1">Speed-to-Lead for Local Businesses</h3>
              <p className="text-sm text-gray-600">How the first business to respond wins — and how to automate that advantage.</p>
            </Link>
            <Link to="/blog/best-ai-receptionist-small-business" className="block p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition">
              <h3 className="font-bold text-gray-900 mb-1">Best AI Receptionist for Small Business</h3>
              <p className="text-sm text-gray-600">How to choose the right AI receptionist for a plumbing or trades business in 2026.</p>
            </Link>
          </div>
        </section>
      </article>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">What happens when a plumber misses an urgent customer call?</h3>
            <p className="text-gray-600 leading-relaxed">The customer immediately calls the next plumber on their list. Over 80% of callers do not leave a voicemail for a missed call — they move on within seconds. The original plumber likely never hears from that customer again.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">How much does one missed plumbing call cost?</h3>
            <p className="text-gray-600 leading-relaxed">A single missed emergency call costs $300–$800 in immediate lost revenue. Including lifetime customer value — repeat calls, referrals, water heater replacements — one missed call can represent $2,000–$5,000 in total lost revenue.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">How can a plumber answer calls when on a job?</h3>
            <p className="text-gray-600 leading-relaxed">AI phone answering systems like Boltcall answer every call 24/7 — even when the plumber is under a sink or on a roof. The AI qualifies the lead, books the appointment, and texts the plumber with all job details.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Do customers really call multiple plumbers at once?</h3>
            <p className="text-gray-600 leading-relaxed">Yes. Studies show 75–80% of callers who reach voicemail immediately dial the next business. During emergencies like burst pipes, customers often have 2–3 plumbers called within 5 minutes of their first attempt.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">What is the best solution to prevent missed plumbing calls?</h3>
            <p className="text-gray-600 leading-relaxed">An AI receptionist like Boltcall answers every call within 2 rings, 24/7. It handles emergency triage, appointment booking, and lead qualification — so the plumber never loses a job to a missed call again.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WhatHappensPlumberMissesCall;
