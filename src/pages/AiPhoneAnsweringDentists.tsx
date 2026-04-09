import React, { useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { motion } from 'framer-motion';
import { Calendar, Clock, Phone, DollarSign, CheckCircle, Star } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';
import ReadingProgress from '../components/ReadingProgress';
import Breadcrumbs from '../components/Breadcrumbs';
import TableOfContents from '../components/TableOfContents';
import { useTableOfContents } from '../hooks/useTableOfContents';

const AiPhoneAnsweringDentists: React.FC = () => {
  const headings = useTableOfContents();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'AI Phone Answering for Dentists: Never Lose a Patient Again | Boltcall';
    updateMetaDescription(
      'AI phone answering for dental practices answers every patient call 24/7, books appointments, and handles insurance questions. Stop losing $3,600/month to missed calls.'
    );

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'AI Phone Answering for Dentists: Never Lose a Patient Again',
      description:
        'Complete guide to AI phone answering for dental practices. Learn how to capture every patient call 24/7, automate appointment booking, and boost revenue.',
      image: {
        '@type': 'ImageObject',
        url: 'https://boltcall.org/og-image.jpg',
        width: 1200,
        height: 630,
      },
      author: {
        '@type': 'Organization',
        name: 'Boltcall',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Boltcall',
        logo: {
          '@type': 'ImageObject',
          url: 'https://boltcall.org/boltcall_full_logo.png',
        },
      },
      datePublished: '2026-04-01',
      dateModified: '2026-04-09',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://boltcall.org/blog/ai-phone-answering-dentists',
      },
      articleSection: 'Industry Guide',
      keywords: [
        'ai phone answering for dentists',
        'ai receptionist dental practice',
        'dental answering service',
        'missed calls dental office',
        'automated dental appointment booking',
      ],
    });
    document.head.appendChild(script);

    const faqScript = document.createElement('script');
    faqScript.type = 'application/ld+json';
    faqScript.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How does AI phone answering work for a dental practice?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'An AI phone system answers every incoming call instantly, 24/7. It greets patients using your practice name, collects appointment details, answers common questions about services and insurance, and books directly into your scheduling software — without any staff involvement.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can AI handle dental insurance questions?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Yes. AI systems can be trained on your accepted insurance plans, coverage FAQs, and common patient questions. They can verify basic coverage details, explain your insurance policies, and route complex questions to a staff member.",
          },
        },
        {
          '@type': 'Question',
          name: 'How much revenue do dental offices lose to missed calls?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The average dental practice misses 30% of incoming calls. With an average new patient value of $1,200–$1,800, missing just 10 new patient calls per month costs $12,000–$18,000 in potential annual revenue.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does AI phone answering integrate with dental practice management software?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Most AI phone systems integrate with popular dental software including Dentrix, Eaglesoft, Open Dental, and Carestream. Appointments booked via AI appear directly in your schedule.',
          },
        },
      ],
    });
    document.head.appendChild(faqScript);

    return () => {
      document.head.removeChild(script);
      document.head.removeChild(faqScript);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />
      <ReadingProgress />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">Industry Guide</span>
          </div>

          <Breadcrumbs
            items={[
              { label: 'Blog', href: '/blog' },
              { label: 'Industry Guide', href: '/blog/category/industry-guide' },
              { label: 'AI Phone Answering for Dentists', href: '#' },
            ]}
          />

          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                <span className="text-blue-600">AI Phone Answering for Dentists</span>: Never Lose a Patient Again
              </h1>

              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                <span className="font-medium">Written by the Boltcall Team</span>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-8">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Last updated: April 9, 2026</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>11 min read</span>
                </div>
              </div>

              {/* TL;DR Block */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 mb-6">
                <p className="text-xs font-semibold text-blue-700 mb-1">TL;DR</p>
                <p className="text-sm text-gray-800">
                  AI phone answering for dental practices answers every patient call 24/7, books appointments automatically, and handles common insurance questions — cutting missed calls by 95% and recovering thousands in lost monthly revenue.
                </p>
              </div>

              {/* Direct Answer Block */}
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded-r-lg">
                <p className="text-lg text-gray-800 font-medium leading-relaxed">
                  <strong>AI phone answering for dentists</strong> is an automated system that answers every patient call instantly — 24 hours a day, 7 days a week. It books appointments, answers insurance questions, handles appointment reminders, and routes emergencies, all without requiring your front desk staff to pick up the phone.
                </p>
              </div>

              <p className="text-xl text-gray-600 leading-relaxed">
                The average dental practice misses 30% of incoming calls. Each missed new-patient call is worth $1,200–$1,800 in lifetime value. AI phone answering eliminates missed calls completely and pays for itself within the first week.
              </p>
            </div>

            <div className="lg:col-span-1">
              <TableOfContents headings={headings} />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <main className="lg:col-span-2">

            {/* Revenue Loss Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <DollarSign className="h-8 w-8 text-red-600 mr-3" />
                How Much Revenue Are Missed Calls Costing Your Dental Practice?
              </h2>

              <p className="text-lg text-gray-700 mb-6">
                Dental practices are uniquely vulnerable to missed call revenue loss. New patients research and call multiple offices simultaneously — whoever answers first wins the appointment. With front desk staff managing check-ins, insurance verification, and in-office patients, calls regularly go unanswered.
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-red-800 mb-4">The Hidden Revenue Leak in Dental Practices</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-3">•</span>
                    <span><strong>30% of dental calls go unanswered</strong> during peak hours (Dental Economics)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-3">•</span>
                    <span><strong>New patient lifetime value:</strong> $1,200–$1,800 per patient in the first year alone</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-3">•</span>
                    <span><strong>Patient patience:</strong> 67% call a competitor rather than leave a voicemail</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-3">•</span>
                    <span><strong>After-hours calls:</strong> 35% of dental inquiries come outside business hours</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Revenue Impact Snapshot</h3>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-3xl font-bold text-red-600">30%</p>
                    <p className="text-sm text-gray-600 mt-1">Calls missed on average</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-3xl font-bold text-red-600">$1,500</p>
                    <p className="text-sm text-gray-600 mt-1">Avg new patient value</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-3xl font-bold text-red-600">$3,600+</p>
                    <p className="text-sm text-gray-600 mt-1">Lost per month (10 missed calls)</p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* How AI Works */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Phone className="h-8 w-8 text-blue-600 mr-3" />
                How AI Phone Answering Works for Dental Practices
              </h2>

              <p className="text-lg text-gray-700 mb-6">
                Modern AI phone systems for dentists are trained on dental-specific workflows. They understand scheduling, insurance terminology, and common patient concerns — speaking with patients the same way a skilled front desk coordinator would.
              </p>

              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">Example: New Patient Call Flow</h3>
                <div className="space-y-4">
                  {[
                    { step: '1', title: 'Patient calls after hours', detail: 'AI answers: "Thank you for calling Bright Smiles Dentistry. How can I help you today?"' },
                    { step: '2', title: 'AI identifies the need', detail: 'Collects name, contact info, reason for call, insurance provider, and preferred appointment times.' },
                    { step: '3', title: 'Appointment is booked', detail: 'AI books directly into your scheduling software and sends a confirmation text and email.' },
                    { step: '4', title: 'Practice is notified', detail: 'A summary of the new patient inquiry lands in your inbox before you open the next morning.' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1 flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-blue-700 text-sm">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Dental-Specific Training</h4>
                  <p className="text-gray-600 text-sm">AI learns your service menu, accepted insurance plans, cancellation policy, and FAQ answers — so it sounds like a member of your team.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Appointment Reminders</h4>
                  <p className="text-gray-600 text-sm">Automated outbound calls and texts remind patients of upcoming appointments, reducing no-shows by up to 40% without any staff effort.</p>
                </div>
              </div>
            </motion.section>

            {/* Key Features */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                Key Features Every Dental AI Phone System Should Have
              </h2>

              <div className="space-y-6">
                {[
                  {
                    title: '24/7 Call Answering',
                    body: 'Patients call when they have tooth pain — often at night or on weekends. AI answers every call immediately with zero hold time, capturing new patients your competitors miss.',
                  },
                  {
                    title: 'Dental Emergency Triage',
                    body: "AI distinguishes between a routine cleaning inquiry and a dental emergency (knocked-out tooth, severe pain, swelling). It routes emergencies to an on-call line immediately while scheduling routine requests.",
                  },
                  {
                    title: 'Insurance Verification Q&A',
                    body: "Trained on your accepted plans, the AI answers 'Do you take Delta Dental?', 'What's my copay?', and similar questions instantly — reducing front desk call volume by up to 60%.",
                  },
                  {
                    title: 'Appointment Scheduling Integration',
                    body: 'Direct integration with Dentrix, Eaglesoft, Open Dental, and other practice management systems. New appointments appear in your schedule without anyone lifting a finger.',
                  },
                  {
                    title: 'HIPAA Compliance',
                    body: 'All call recordings, transcripts, and patient data are handled in compliance with HIPAA requirements, with encrypted storage and role-based access controls.',
                  },
                ].map((feature) => (
                  <div key={feature.title} className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-700">{feature.body}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Cost Comparison */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <DollarSign className="h-8 w-8 text-green-600 mr-3" />
                Cost Comparison: AI vs. Human Receptionist vs. Voicemail
              </h2>

              <p className="text-lg text-gray-700 mb-6">
                Dental practices typically overpay for human-only front desk coverage while still missing after-hours calls. Here is how the options compare on cost, availability, and net revenue impact.
              </p>

              <div className="overflow-x-auto mb-6">
                <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Solution</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Monthly Cost</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Availability</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Calls Captured</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Net Annual Gain</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 font-medium text-gray-900">Voicemail Only</td>
                      <td className="px-6 py-4 text-center text-green-600 font-semibold">$15</td>
                      <td className="px-6 py-4 text-center text-red-600">Never live</td>
                      <td className="px-6 py-4 text-center text-red-600">25%</td>
                      <td className="px-6 py-4 text-center text-red-600">-$43,000</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">Human Receptionist</td>
                      <td className="px-6 py-4 text-center text-red-600 font-semibold">$4,800</td>
                      <td className="px-6 py-4 text-center text-yellow-600">Business hours</td>
                      <td className="px-6 py-4 text-center text-yellow-600">70%</td>
                      <td className="px-6 py-4 text-center text-yellow-600">Break even</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-gray-900">Answering Service</td>
                      <td className="px-6 py-4 text-center text-yellow-600 font-semibold">$900</td>
                      <td className="px-6 py-4 text-center text-green-600">24/7</td>
                      <td className="px-6 py-4 text-center text-yellow-600">65%</td>
                      <td className="px-6 py-4 text-center text-green-600">+$12,000</td>
                    </tr>
                    <tr className="bg-blue-50 border-2 border-blue-200">
                      <td className="px-6 py-4 font-medium text-blue-900">AI Phone System</td>
                      <td className="px-6 py-4 text-center text-blue-600 font-bold">$489</td>
                      <td className="px-6 py-4 text-center text-green-600 font-semibold">24/7</td>
                      <td className="px-6 py-4 text-center text-green-600 font-semibold">95%</td>
                      <td className="px-6 py-4 text-center text-green-600 font-bold">+$38,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.section>

            {/* Pros & Cons */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Pros &amp; Cons of AI Phone Answering for Dental Practices
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">Pros</h3>
                  <ul className="space-y-3 text-gray-700">
                    {[
                      'Answers 100% of calls — including after hours and weekends',
                      'Books appointments directly into your scheduling software',
                      'Reduces front desk workload so staff can focus on in-office patients',
                      'Costs 90% less than a full-time receptionist',
                      'No sick days, vacation, or turnover',
                      'Consistent, professional patient experience on every call',
                    ].map((pro) => (
                      <li key={pro} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-800 mb-4">Cons</h3>
                  <ul className="space-y-3 text-gray-700">
                    {[
                      'Initial setup requires training the AI on your services and policies',
                      'Complex clinical questions still need a human staff member',
                      'Some older patients prefer speaking to a human (easily handled by transfer option)',
                      'Monthly subscription cost (though ROI is typically 10x+)',
                    ].map((con) => (
                      <li key={con} className="flex items-start">
                        <span className="text-red-600 mr-2 mt-0.5 flex-shrink-0 font-bold">✕</span>
                        <span className="text-sm">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* FAQ */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions: AI Phone Answering for Dentists
              </h2>

              <div className="space-y-4">
                {[
                  {
                    q: 'How does AI phone answering work for a dental practice?',
                    a: 'An AI phone system answers every incoming call instantly, 24/7. It greets patients using your practice name, collects appointment details, answers common questions about services and insurance, and books directly into your scheduling software — without any staff involvement.',
                  },
                  {
                    q: 'Can AI handle dental insurance questions?',
                    a: "Yes. AI systems are trained on your accepted insurance plans, coverage FAQs, and common patient questions. They can explain your insurance policies and route complex questions to a staff member.",
                  },
                  {
                    q: 'How much revenue do dental offices lose to missed calls?',
                    a: 'The average dental practice misses 30% of incoming calls. With an average new patient value of $1,200–$1,800, missing just 10 new patient calls per month costs $12,000–$18,000 in potential annual revenue.',
                  },
                  {
                    q: 'Does AI phone answering integrate with dental practice management software?',
                    a: 'Most AI phone systems integrate with popular dental software including Dentrix, Eaglesoft, Open Dental, and Carestream. Appointments booked via AI appear directly in your schedule.',
                  },
                  {
                    q: 'Is AI phone answering HIPAA compliant?',
                    a: 'Reputable AI phone systems for healthcare are built with HIPAA compliance in mind, including encrypted call recordings, secure data storage, and BAA availability upon request.',
                  },
                ].map((faq) => (
                  <div key={faq.q} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.q}</h3>
                    <p className="text-gray-700">{faq.a}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Expert Quote */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <blockquote className="border-l-4 border-blue-600 pl-6 py-2">
                <p className="text-xl text-gray-700 italic mb-4">
                  "The phone is still the most important point of contact for dental patients. If you don't answer it — or answer it poorly — you lose the patient before they ever walk through the door."
                </p>
                <footer className="text-sm text-gray-500">
                  — Dental Practice Management, <cite>Dental Economics</cite>
                </footer>
              </blockquote>
            </motion.section>

            {/* CTA */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-center text-white">
                <Star className="h-10 w-10 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-3">Ready to Stop Missing Patient Calls?</h2>
                <p className="text-blue-100 mb-6 max-w-lg mx-auto">
                  Boltcall answers every call 24/7, books appointments into your schedule, and sends you a daily summary — all for less than the value of one missed new patient.
                </p>
                <a
                  href="/ai-receptionist-roi"
                  className="inline-block bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Calculate Your ROI
                </a>
              </div>
            </motion.section>

          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AiPhoneAnsweringDentists;
