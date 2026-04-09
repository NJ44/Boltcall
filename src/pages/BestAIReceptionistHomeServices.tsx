// @ts-nocheck
import React, { useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Home, Wrench, Wind, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';
import ReadingProgress from '../components/ReadingProgress';
import Breadcrumbs from '../components/Breadcrumbs';
import TableOfContents from '../components/TableOfContents';
import { useTableOfContents } from '../hooks/useTableOfContents';

const BestAIReceptionistHomeServices: React.FC = () => {
  const headings = useTableOfContents();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Best AI Receptionist for Home Services (Plumbers, HVAC, Roofing) | Boltcall';
    updateMetaDescription(
      'Best AI receptionist for home services in 2026. Capture every call for plumbers, HVAC, roofing, and contractors. 24/7 answering, lead qualification, and appointment booking.'
    );

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Best AI Receptionist for Home Services (Plumbers, HVAC, Roofing)',
      description:
        'Best AI receptionist for home services in 2026. Capture every call for plumbers, HVAC, roofing, and contractors with 24/7 answering, qualification, and booking.',
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
        '@id': 'https://boltcall.org/blog/best-ai-receptionist-home-services',
      },
      keywords: [
        'best ai receptionist for home services',
        'ai receptionist for plumbers',
        'ai receptionist for hvac',
        'roofing missed calls',
        '24/7 call answering home services',
      ],
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />
      <ReadingProgress />

      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Blog', href: '/blog' },
              { label: 'Home Services', href: '/blog/best-ai-receptionist-home-services' },
            ]}
          />

          <div className="grid lg:grid-cols-3 gap-10 items-start mt-6">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                <Home className="w-4 h-4" />
                Home Services Guide
              </div>

              <h1 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                <span className="text-blue-600">Best AI Receptionist</span> for Home Services (Plumbers, HVAC, Roofing)
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  April 9, 2026
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  10 min read
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Updated for 2026 buying criteria
                </span>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-2">Quick answer</h2>
                <p className="text-gray-800 leading-relaxed">
                  For plumbers, HVAC, roofing, and contractors, the best AI receptionist is the one that{' '}
                  <strong>answers 24/7</strong>, <strong>qualifies the job</strong>, and <strong>books the appointment</strong>{' '}
                  into your calendar—without forcing you into a complex CRM. Boltcall is built for home services:
                  fast setup, natural voice calls, instant follow-up, reminders, and lead routing.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    to="/book-a-call"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-colors"
                  >
                    Book a Call
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/features/ai-receptionist"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 border border-blue-200 hover:bg-blue-50 transition-colors"
                  >
                    See AI Receptionist
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
            <h2>What home service businesses need from an AI receptionist</h2>
            <p>
              Home services is different from most industries: calls spike during emergencies, customers want immediate answers,
              and every missed call can be a lost job. The “best” AI receptionist is not the one with the most features—it is the one that
              fits real field operations: dispatch, estimates, after-hours calls, and quick scheduling.
            </p>
            <ul>
              <li><strong>24/7 phone coverage</strong> with natural voice and clear next steps</li>
              <li><strong>Job qualification</strong> (service type, urgency, address, budget expectations)</li>
              <li><strong>Appointment booking</strong> into Google/Outlook/Cal.com calendars</li>
              <li><strong>Instant follow-up</strong> by SMS/email so leads don’t go cold</li>
              <li><strong>Reminders</strong> to reduce no-shows and “forgotten” estimates</li>
            </ul>

            <h2>Best AI receptionist for plumbers</h2>
            <p>
              Plumbing leads are often urgent. Boltcall can triage emergencies (burst pipe, no hot water), collect key details,
              and book the earliest slot or escalate to a live transfer when needed.
            </p>
            <p>
              Read the plumber-specific guide:{' '}
              <Link className="font-semibold text-blue-700" to="/blog/ai-receptionist-for-plumbers">
                AI receptionist for plumbers
              </Link>
              .
            </p>

            <h2>Best AI receptionist for HVAC companies</h2>
            <p>
              HVAC seasonality means huge call surges. The AI must handle peak volume, prioritize no-cool/no-heat calls,
              and protect your team from wasting time on out-of-area or price-shopping inquiries.
            </p>
            <p>
              HVAC FAQ:{' '}
              <Link className="font-semibold text-blue-700" to="/blog/ai-receptionist-hvac-faq">
                20 questions HVAC owners ask
              </Link>
              .
            </p>

            <h2>Best AI receptionist for roofing companies</h2>
            <p>
              Roofing leads are won on speed. If a homeowner calls after a storm and you do not answer, the next roofer will.
              A good AI receptionist will capture address, roof type, leak severity, insurance status, and schedule an inspection.
            </p>

            <h2>Boltcall checklist (use this to compare tools)</h2>
            <div className="not-prose mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { icon: <Wrench className="w-4 h-4" />, text: 'Understands home-service call flows (dispatch, estimate, emergency)' },
                { icon: <Wind className="w-4 h-4" />, text: 'Handles seasonal call spikes without “call center” handoffs' },
                { icon: <CheckCircle2 className="w-4 h-4" />, text: 'Books appointments into your calendar, not just “takes a message”' },
                { icon: <ShieldCheck className="w-4 h-4" />, text: 'Lets you set service areas, hours, and escalation rules' },
              ].map((i) => (
                <div key={i.text} className="flex items-start gap-2 rounded-xl border border-gray-200 bg-white p-4">
                  <span className="mt-0.5 text-blue-700">{i.icon}</span>
                  <span className="text-sm text-gray-800">{i.text}</span>
                </div>
              ))}
            </div>

            <h2>Recommended “next step” setup for home services</h2>
            <ol>
              <li>Connect your phone number and pick a voice</li>
              <li>Connect calendar (Google/Outlook/Cal.com) to book inspections/appointments</li>
              <li>Define your service area + emergency escalation rules</li>
              <li>Turn on instant SMS follow-up for missed/after-hours callers</li>
              <li>Enable reminders and review requests after completed jobs</li>
            </ol>

            <div className="not-prose mt-10 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-7 text-white">
              <h3 className="text-xl font-bold">Want Boltcall to map this for your business?</h3>
              <p className="mt-2 text-white/85">
                Book a quick call and we’ll outline the exact call flow + follow-up system for your trade.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/book-a-call"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700"
                >
                  Book a Call
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
                >
                  View pricing
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BestAIReceptionistHomeServices;

