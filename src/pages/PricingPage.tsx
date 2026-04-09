import React, { useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import GiveawayBar from '../components/GiveawayBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Pricing from '../components/Pricing';
import { DollarSign, CheckCircle, Zap, Phone, Calendar, Star } from 'lucide-react';

const PricingPage: React.FC = () => {
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

    return () => {
      const el = document.querySelector("link[rel='canonical']");
      if (el) el.remove();
      speakableScript.remove();
    };
  }, []);

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
              Why Boltcall Pays For Itself
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
              Boltcall's AI receptionist answers every call — during business hours, after hours, on weekends, and on holidays — and converts a significant percentage of those callers into booked appointments. At $179 per month for the Pro plan, recovering even two additional jobs or appointments per month typically generates 5 to 10 times the subscription cost. Most of our customers see positive ROI within 48 hours of going live.
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Trusted by Local Business Owners</h2>
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
      <Footer />
    </div>
  );
};

export default PricingPage;

