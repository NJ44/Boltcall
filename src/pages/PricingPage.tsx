import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { updateMetaDescription } from '../lib/utils';
import { usePricingVisitorTrack } from '../hooks/usePricingVisitorTrack';
import { useSchemaInjector } from '../hooks/useSchemaInjector';
import GiveawayBar from '../components/GiveawayBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Pricing from '../components/Pricing';
import { DollarSign, CheckCircle, Zap, Phone, Calendar, Star } from 'lucide-react';

const PricingPage: React.FC = () => {
  usePricingVisitorTrack();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Boltcall Pricing - AI Receptionist Plans & Pricing';
    updateMetaDescription('Compare Boltcall pricing plans. Choose the perfect AI receptionist plan for your business. Free setup included. View plans now.');

    // Add canonical link
    let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = 'https://boltcall.org/pricing';

    const speakableScript = document.createElement('script');
    speakableScript.type = 'application/ld+json';
    speakableScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": document.title,
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".speakable-intro"]
      }
    });
    document.head.appendChild(speakableScript);

    const bcScript = document.createElement('script');
    bcScript.type = 'application/ld+json';
    bcScript.id = 'breadcrumb-jsonld';
    bcScript.text = JSON.stringify({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://boltcall.org"}, {"@type": "ListItem", "position": 2, "name": "Pricing", "item": "https://boltcall.org/pricing"}]});
    document.head.appendChild(bcScript);


    const personScript = document.createElement('script');
    personScript.type = 'application/ld+json';
    personScript.id = 'person-schema';
    personScript.text = JSON.stringify({"@context": "https://schema.org", "@type": "Person", "name": "Boltcall Team", "url": "https://boltcall.org/about", "worksFor": {"@type": "Organization", "name": "Boltcall", "url": "https://boltcall.org"}});
    document.head.appendChild(personScript);
    return () => {
      document.getElementById('person-schema')?.remove();
      document.getElementById('breadcrumb-jsonld')?.remove();
      const el = document.querySelector("link[rel='canonical']");
      if (el) el.remove();
      speakableScript.remove();
    };
  }, []);

  useSchemaInjector([
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Boltcall AI Receptionist",
      "description": "AI receptionist that answers calls 24/7, books appointments, captures leads, and sends follow-up texts for local service businesses.",
      "url": "https://boltcall.org/pricing",
      "brand": { "@type": "Brand", "name": "Boltcall" },
      "offers": [
        {
          "@type": "Offer",
          "name": "Starter",
          "price": "549",
          "priceCurrency": "USD",
          "priceSpecification": { "@type": "UnitPriceSpecification", "billingDuration": "P1M" },
          "url": "https://boltcall.org/setup",
          "availability": "https://schema.org/InStock",
          "description": "AI receptionist, missed call text-back, instant lead reply, appointment reminders, reports dashboard."
        },
        {
          "@type": "Offer",
          "name": "Pro",
          "price": "897",
          "priceCurrency": "USD",
          "priceSpecification": { "@type": "UnitPriceSpecification", "billingDuration": "P1M" },
          "url": "https://boltcall.org/setup",
          "availability": "https://schema.org/InStock",
          "description": "Everything in Starter plus full lead follow-up system, SMS conversations, website chat widget, custom AI voice."
        },
        {
          "@type": "Offer",
          "name": "Ultimate",
          "price": "4997",
          "priceCurrency": "USD",
          "priceSpecification": { "@type": "UnitPriceSpecification", "billingDuration": "P1M" },
          "url": "https://boltcall.org/setup",
          "availability": "https://schema.org/InStock",
          "description": "Everything in Pro plus multi-location support, dedicated account manager, AI audits."
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How much does Boltcall cost?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Boltcall starts at $549/month for the Starter plan, $897/month for Pro, and $4,997/month for Ultimate. All plans include free setup and a 30-day money-back guarantee. No per-call or per-minute fees."
          }
        },
        {
          "@type": "Question",
          "name": "Does Boltcall pay for itself?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Most businesses recover the full cost of their Boltcall subscription within the first week. The average missed call to a local service business represents $300–$1,500 in lost revenue. At $897/month for the Pro plan, recovering even a handful of additional appointments per month generates 5–10× the subscription cost."
          }
        },
        {
          "@type": "Question",
          "name": "What is included in every Boltcall plan?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Every Boltcall plan includes 24/7 AI call answering, appointment booking into your calendar, instant SMS follow-up, automated appointment reminders that cut no-shows by 40%+, post-appointment Google review requests, and a monthly revenue report."
          }
        },
        {
          "@type": "Question",
          "name": "Can I upgrade or cancel my Boltcall plan?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. You can upgrade from Starter to Pro or Pro to Ultimate with one click from your dashboard. There are no long-term contracts — you can cancel at any time."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between Boltcall Starter and Pro?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Starter includes the core AI receptionist, missed call text-back, instant lead reply, and appointment reminders. Pro adds a full lead follow-up system, SMS conversations, automated post-job follow-ups, a website chat widget, custom AI voice and script, CRM integration, and Google review request automation."
          }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Boltcall Pricing — AI Receptionist Plans",
      "url": "https://boltcall.org/pricing",
      "description": "Compare Boltcall pricing plans. AI receptionist starting at $549/month. Free setup included.",
      "datePublished": "2024-01-01",
      "dateModified": "2026-05-06",
      "publisher": {
        "@type": "Organization",
        "name": "Boltcall",
        "url": "https://boltcall.org",
        "logo": { "@type": "ImageObject", "url": "https://boltcall.org/logo.png" }
      }
    }
  ]);

  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />
      <main className="pt-20">
        <h1 className="speakable-intro sr-only">Boltcall AI Receptionist Pricing Plans</h1>
        <Pricing />

        {/* Why Boltcall Pays For Itself */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              <DollarSign className="w-4 h-4" />
              ROI Analysis
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Does Boltcall Pay for Itself?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Most businesses recover the full cost of their subscription within the first week — from a single appointment booked or emergency call answered after hours.
            </p>
          </div>

          <div className="space-y-5 text-gray-700 leading-relaxed mb-12">
            <p>
              The average missed call to a local service business represents $300 to $1,500 in lost revenue when you account for the full customer lifetime value. A plumber who misses an emergency call at 9 pm loses not just one repair job but potentially a $3,000-per-year repeat customer. A dental practice that sends new patients to voicemail loses a $3,200 lifetime value relationship. When you multiply those numbers across the 40 to 60 calls the average small business misses every month, the math becomes stark.
            </p>
            <p>
              Boltcall's AI receptionist answers every call — during business hours, after hours, on weekends, and on holidays — and converts a significant percentage of those callers into booked appointments. At $897 per month for the Pro plan, recovering even a handful of additional jobs or appointments per month typically generates 5 to 10 times the subscription cost. Most of our customers see positive ROI within 48 hours of going live. If you want to see how your current response time stacks up before committing, run our free <Link to="/lead-response-scorecard" className="text-indigo-600 hover:text-indigo-700 underline">lead response scorecard</Link> or read our <Link to="/speed-to-lead" className="text-indigo-600 hover:text-indigo-700 underline">speed-to-lead guide</Link>.
            </p>
            <p>
              Beyond call answering, every plan includes automated appointment reminders that reduce no-shows by an average of 40%, SMS follow-up sequences that re-engage leads who expressed interest but didn't book, and post-appointment review requests that build your Google rating over time. These features compound each other — more calls answered means more appointments booked, better reminders mean fewer empty slots, and better reviews mean more inbound calls. Boltcall is not a single tool; it is a complete revenue recovery system.
            </p>
          </div>

          {/* What's Included prose */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Star className="w-5 h-5 text-indigo-600" />
              What's Included in Every Plan
            </h3>
            <p className="text-gray-600 mb-6">
              Every Boltcall plan includes a complete setup, a dedicated AI voice trained on your business, and access to the full automation suite. Here is what you get regardless of which tier you choose:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: Phone, text: '24/7 AI call answering — no hold times, no voicemail for the caller' },
                { icon: Calendar, text: 'Appointment booking directly into your calendar system' },
                { icon: Zap, text: 'Instant SMS follow-up when a caller requests a callback' },
                { icon: CheckCircle, text: 'Automated appointment reminders to cut no-show rates by 40%+' },
                { icon: Star, text: 'Post-appointment Google review request sequences' },
                { icon: DollarSign, text: 'Monthly revenue report showing calls answered and bookings recovered' },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                  <item.icon className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      {/* Social Proof */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">What Do Boltcall Customers Say?</h2>
        <p className="text-gray-500 text-center mb-8 text-sm">Join 500+ businesses using Boltcall to capture more leads and grow revenue.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { quote: "Boltcall paid for itself in the first week. We stopped losing calls after hours and our bookings jumped 40%.", name: "Marcus T.", role: "HVAC Owner, Texas" },
            { quote: "I was skeptical about AI, but it just works. Our front desk handles 30% fewer interruptions now.", name: "Priya S.", role: "Dental Practice Manager, California" },
            { quote: "We were losing 15-20 calls a week to voicemail. Boltcall captures every single one now.", name: "James R.", role: "Plumbing Business Owner, Florida" },
          ].map((item) => (
            <div key={item.name} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <p className="text-gray-700 text-sm leading-relaxed mb-4">"{item.quote}"</p>
              <div>
                <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-gray-50 border-t border-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>100% Free — no credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>Used by 500+ local businesses</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>Results in 30 days or your money back</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>Your data is never sold or shared</span>
            </div>
          </div>
        </div>
      </section>

      </main>

      {/* Plan Comparison Table */}
      <section className="bg-white py-10 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Which Boltcall Plan Is Right for My Business?</h2>
          <p className="text-gray-500 text-sm text-center mb-6">Everything included in each Boltcall tier — no hidden fees</p>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">Feature</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200 text-center">Starter</th>
                  <th className="px-4 py-3 font-semibold text-indigo-700 border-b border-gray-200 text-center bg-indigo-50">Pro</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200 text-center">Ultimate</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['24/7 AI Call Answering', true, true, true],
                  ['Appointment Booking', true, true, true],
                  ['Instant SMS Follow-Up', true, true, true],
                  ['No-Show Reminders', true, true, true],
                  ['Google Review Requests', false, true, true],
                  ['Custom AI Voice & Script', false, true, true],
                  ['CRM Integration', false, true, true],
                  ['Multi-Location Support', false, false, true],
                  ['Dedicated Account Manager', false, false, true],
                  ['Monthly Revenue Report', true, true, true],
                ].map(([feature, starter, pro, agency]) => (
                  <tr key={String(feature)} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700 font-medium">{feature}</td>
                    <td className="px-4 py-3 text-center">{starter ? '✓' : '—'}</td>
                    <td className="px-4 py-3 text-center bg-indigo-50/30 text-indigo-700 font-semibold">{pro ? '✓' : '—'}</td>
                    <td className="px-4 py-3 text-center">{agency ? '✓' : '—'}</td>
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

export default PricingPage;

