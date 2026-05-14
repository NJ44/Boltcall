import React, { useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Phone, CheckCircle, Zap, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';
import ReadingProgress from '../components/ReadingProgress';
import Breadcrumbs from '../components/Breadcrumbs';

const BlogAIReceptionistChiropractors: React.FC = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'AI Receptionist for Chiropractors: Stop Losing New Patients to Missed Calls (2026) | Boltcall';
    updateMetaDescription(
      'Chiropractic practices lose up to 35% of new patient calls to voicemail and slow follow-up. Learn how AI receptionists answer 24/7, book appointments, and grow your practice automatically.'
    );

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "AI Receptionist for Chiropractors: Stop Losing New Patients to Missed Calls",
      "description": "Chiropractic practices lose up to 35% of new patient calls to voicemail and slow follow-up. Learn how AI receptionists answer 24/7, book appointments, and grow your practice automatically.",
      "author": {
        "@type": "Organization",
        "name": "Boltcall",
        "url": "https://boltcall.org"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Boltcall",
        "logo": {
          "@type": "ImageObject",
          "url": "https://boltcall.org/boltcall_full_logo.png"
        }
      },
      "datePublished": "2026-05-14",
      "dateModified": "2026-05-14",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://boltcall.org/blog/ai-receptionist-for-chiropractors"
      },
      "image": {
        "@type": "ImageObject",
        "url": "https://boltcall.org/og-image.jpg"
      },
      "keywords": [
        "ai receptionist for chiropractors",
        "chiropractic ai answering service",
        "chiropractic phone answering",
        "ai for chiropractic practice",
        "chiropractic appointment booking automation"
      ]
    };

    const existingArticle = document.getElementById('article-schema');
    if (existingArticle) existingArticle.remove();
    const script = document.createElement('script');
    script.id = 'article-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(articleSchema);
    document.head.appendChild(script);

    const bcScript = document.createElement('script');
    bcScript.type = 'application/ld+json';
    bcScript.id = 'breadcrumb-jsonld';
    bcScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://boltcall.org" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://boltcall.org/blog" },
        { "@type": "ListItem", "position": 3, "name": "AI Receptionist for Chiropractors", "item": "https://boltcall.org/blog/ai-receptionist-for-chiropractors" }
      ]
    });
    document.head.appendChild(bcScript);

    const personScript = document.createElement('script');
    personScript.type = 'application/ld+json';
    personScript.id = 'person-schema';
    personScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Boltcall Team",
      "url": "https://boltcall.org/about",
      "worksFor": { "@type": "Organization", "name": "Boltcall", "url": "https://boltcall.org" }
    });
    document.head.appendChild(personScript);

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Can an AI receptionist book chiropractic appointments automatically?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. An AI receptionist can answer every inbound call 24/7, collect the patient's name, contact details, and reason for calling, and schedule appointments directly into your calendar using real-time availability. It handles new patient intake, existing patient re-bookings, and after-hours calls without requiring any staff involvement."
          }
        },
        {
          "@type": "Question",
          "name": "How does an AI receptionist help a chiropractic practice grow?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "An AI receptionist captures new patient calls that would otherwise go to voicemail — the primary source of lost growth for most chiropractic practices. By answering every call immediately, booking appointments on the spot, and following up with SMS confirmations, it converts more inquiries into actual patients. Research shows that responding within one minute of a new inquiry makes a business 391% more likely to convert the lead."
          }
        },
        {
          "@type": "Question",
          "name": "What happens to calls when the front desk is busy with patients?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "When your front desk staff is occupied with in-office patients, the AI receptionist handles overflow calls simultaneously. There is no hold music, no missed calls, and no voicemail. Every caller gets an immediate, natural conversation. The AI collects their information, answers common questions about services and pricing, and books them into your next available slot."
          }
        },
        {
          "@type": "Question",
          "name": "Is an AI receptionist compliant with HIPAA for a chiropractic practice?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A properly configured AI receptionist for healthcare handles intake information in accordance with HIPAA requirements. The AI collects scheduling information and basic intake data — name, contact details, reason for visit — without storing protected health information (PHI) in non-compliant systems. Boltcall is designed for healthcare use cases where data handling standards are critical."
          }
        },
        {
          "@type": "Question",
          "name": "How much revenue does a chiropractic practice lose per missed new patient call?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A single new chiropractic patient is worth $800 to $2,500 in care plan revenue over 6 to 12 months, plus referrals. If a practice misses 5 new patient calls per week and converts them at even 30%, that is 1.5 new patients per week lost — or roughly $1,200 to $3,750 in weekly revenue. Annually, this represents $60,000 to $195,000 in missed revenue from calls that went to voicemail."
          }
        },
        {
          "@type": "Question",
          "name": "Does Boltcall work with chiropractic practice management software?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Boltcall connects to calendar systems including Google Calendar, Outlook, and Cal.com for appointment booking. Intake data collected during calls can be forwarded via email, SMS, or webhook to popular chiropractic practice management platforms. Contact the Boltcall team for details on specific integrations."
          }
        }
      ]
    };

    const faqScript = document.createElement('script');
    faqScript.type = 'application/ld+json';
    faqScript.id = 'faq-schema';
    faqScript.text = JSON.stringify(faqSchema);
    document.head.appendChild(faqScript);

    return () => {
      document.getElementById('article-schema')?.remove();
      document.getElementById('breadcrumb-jsonld')?.remove();
      document.getElementById('person-schema')?.remove();
      document.getElementById('faq-schema')?.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />
      <ReadingProgress />

      {/* Hero Section */}
      <section className="relative pt-32 pb-8 bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
        <div className="max-w-4xl px-4 sm:px-6 lg:px-8" style={{ marginLeft: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left mb-4"
          >
            <Breadcrumbs items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: 'AI Receptionist for Chiropractors', href: '/blog/ai-receptionist-for-chiropractors' }
            ]} />

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight text-left">
              AI Receptionist for <span className="text-blue-600">Chiropractors</span>: Stop Losing New Patients to Missed Calls
            </h1>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>May 14, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>9 min read</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div className="flex gap-8">
          <article className="flex-1 max-w-4xl">

            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="prose prose-lg max-w-none mb-12"
            >
              <p className="text-xl text-gray-700 leading-relaxed font-medium">
                A prospective patient calls your chiropractic office at 6:30pm after experiencing back pain
                for the first time. Your front desk left at 5pm. They hit voicemail, hang up, and Google
                the next chiropractor on the list. That practice answers. They book the appointment.
                You never know the call happened. An AI receptionist for chiropractors eliminates exactly
                this scenario — answering every call 24/7, booking new patients automatically, and recovering
                the revenue that voicemail silently loses every week.
              </p>
            </motion.div>

            {/* Table of Contents */}
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 mb-12">
              <h2 className="text-base font-bold text-gray-900 mb-4">In This Article</h2>
              <ol className="space-y-2 list-decimal list-inside">
                <li><a href="#why-chiro-practices-lose-patients" className="text-blue-600 hover:underline text-sm">Why Chiropractic Practices Lose New Patients to Missed Calls</a></li>
                <li><a href="#what-ai-receptionist-does" className="text-blue-600 hover:underline text-sm">What an AI Receptionist Does for a Chiropractic Practice</a></li>
                <li><a href="#the-most-expensive-missed-calls" className="text-blue-600 hover:underline text-sm">The Most Expensive Missed Calls in a Chiropractic Office</a></li>
                <li><a href="#how-to-set-up" className="text-blue-600 hover:underline text-sm">How to Set Up AI Call Handling for Your Practice</a></li>
                <li><a href="#revenue-impact" className="text-blue-600 hover:underline text-sm">Revenue Impact: What Each Missed New Patient Call Is Actually Worth</a></li>
                <li><a href="#faq" className="text-blue-600 hover:underline text-sm">Frequently Asked Questions</a></li>
              </ol>
            </div>

            {/* Section 1 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-16"
              id="why-chiro-practices-lose-patients"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-start gap-3">
                <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
                Why Chiropractic Practices Lose New Patients to Missed Calls
              </h2>

              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  Most chiropractic practices run lean. There is one front desk coordinator — maybe two —
                  handling check-ins, insurance verification, co-pay collection, scheduling, and inbound calls
                  simultaneously. When a patient is standing at the desk and the phone rings, something
                  gets ignored. Most of the time, it is the phone.
                </p>

                <p>
                  Research from Harvard Business Review found that leads contacted within 5 minutes are
                  21 times more likely to convert than those contacted after 30 minutes. In chiropractic,
                  where patients are often in acute pain and shopping between two or three local offices,
                  the response window is even tighter. The first practice that answers wins the patient.
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">35%</div>
                  <p className="text-gray-700">of new patient calls to chiropractic offices reach voicemail or go unanswered — representing the single largest source of practice revenue loss.</p>
                </div>

                <p>
                  The problem compounds after business hours. The average chiropractic office closes between
                  5pm and 6pm. A significant portion of new patient inquiries arrive precisely during the
                  window when potential patients are home from work, researching solutions to pain they have
                  been managing all day. That 6pm to 9pm window is rich with motivated, ready-to-book prospects
                  — and most practices have zero coverage for it.
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">28%</div>
                  <p className="text-gray-700">of new patient chiropractic inquiries are made outside of standard business hours, according to practice management industry surveys.</p>
                </div>

                <p>
                  The invisible nature of this problem makes it worse. Missed calls leave no trace in your
                  practice management system. You do not receive an alert that someone called, had back pain,
                  was ready to book, and left because no one answered. You just never see that patient.
                  The revenue loss is silent, ongoing, and growing.
                </p>
              </div>
            </motion.section>

            {/* Section 2 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-16"
              id="what-ai-receptionist-does"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-start gap-3">
                <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
                What an AI Receptionist Does for a Chiropractic Practice
              </h2>

              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  An AI receptionist for a chiropractic office answers every inbound call within one ring,
                  conducts a natural intake conversation, and books the patient directly into your calendar.
                  It does not replace your front desk for in-office care — it fills the gaps they cannot
                  cover and handles the overflow they would otherwise miss.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">New patient intake and scheduling</h3>
                <p>
                  When a new patient calls, the AI greets them by practice name, asks about their concern,
                  and collects the intake information your team needs: name, contact number, primary complaint
                  (back pain, neck pain, sports injury, etc.), whether they have been to a chiropractor before,
                  and insurance status if applicable. It then checks your real-time availability and books
                  the first appointment — new patient assessment, initial consultation, or whatever intake
                  visit your practice uses.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Overflow coverage during busy hours</h3>
                <p>
                  Even during peak clinic hours, the AI handles calls that come in while your front desk
                  is occupied with in-office patients. There is no hold music, no missed calls during the
                  10am–12pm and 3pm–6pm rushes when both your front desk and your treatment rooms are full.
                  Every caller gets an immediate response.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">After-hours and weekend coverage</h3>
                <p>
                  The AI handles all calls after your office closes. Saturday afternoons, Sunday mornings,
                  evenings — every new patient inquiry gets answered and booked. Existing patients who need
                  to reschedule outside office hours can do so without leaving a voicemail that waits to
                  be returned the next day.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Common question handling</h3>
                <p>
                  Callers asking about insurance acceptance, services offered, appointment duration, pricing
                  for new patient specials, or office location get accurate, immediate answers. The AI is
                  trained on your practice's specific services, pricing, and policies — so it never sends
                  a patient to a competitor because it could not answer a simple question.
                </p>

                <div className="grid md:grid-cols-2 gap-4 mt-8">
                  <div className="flex items-start gap-3 p-5 rounded-xl bg-blue-50 border border-blue-100">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div><p className="font-semibold text-gray-900 mb-1">Answers in under 3 seconds</p><p className="text-sm text-gray-600">No hold time, no voicemail, no missed opportunities</p></div>
                  </div>
                  <div className="flex items-start gap-3 p-5 rounded-xl bg-blue-50 border border-blue-100">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div><p className="font-semibold text-gray-900 mb-1">Books directly into your calendar</p><p className="text-sm text-gray-600">Real-time availability, zero double-booking risk</p></div>
                  </div>
                  <div className="flex items-start gap-3 p-5 rounded-xl bg-blue-50 border border-blue-100">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div><p className="font-semibold text-gray-900 mb-1">Sends SMS confirmations</p><p className="text-sm text-gray-600">Reduces no-shows with automatic appointment reminders</p></div>
                  </div>
                  <div className="flex items-start gap-3 p-5 rounded-xl bg-blue-50 border border-blue-100">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div><p className="font-semibold text-gray-900 mb-1">Delivers intake summaries instantly</p><p className="text-sm text-gray-600">Your team walks into each visit fully prepared</p></div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 3 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-16"
              id="the-most-expensive-missed-calls"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-start gap-3">
                <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
                The Most Expensive Missed Calls in a Chiropractic Office
              </h2>

              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  Not all missed calls carry the same revenue risk. Understanding which types of callers
                  are most affected — and what each represents financially — clarifies why this is
                  not a minor operational inconvenience.
                </p>

                <div className="space-y-6">
                  <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-gray-900">The first-time back pain patient</h3>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      This is the most valuable caller type. A new patient experiencing acute or chronic back
                      pain for the first time is highly motivated and price-insensitive in the moment. They
                      are calling because they are ready to start care now. If they hit voicemail, they call
                      the next chiropractor within 60 seconds. These patients typically enter multi-visit care
                      plans worth $800 to $2,500 over their first 3 months.
                    </p>
                    <p className="text-sm text-blue-600 font-medium">Risk: High — converts immediately if answered, almost never returns after voicemail</p>
                  </div>

                  <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-gray-900">The post-accident referral</h3>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      Patients referred after a car accident, workplace injury, or sports injury often have
                      personal injury attorney relationships or insurance coverage that funds extended care.
                      These patients can represent 20 to 40 visits over 3 to 6 months, with full insurance
                      reimbursement. A single missed call from this segment can mean $3,000 to $8,000 in lost
                      billable visits.
                    </p>
                    <p className="text-sm text-blue-600 font-medium">Risk: Very high — time-sensitive, referred by someone who gave a specific recommendation</p>
                  </div>

                  <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-gray-900">The after-hours new patient inquiry</h3>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      Evening callers — the 6pm to 9pm window — are typically employed adults researching
                      on their own time. They have already made the decision to try chiropractic care. They
                      want to book tonight. A practice that answers at 7pm books the patient that a practice
                      closed for the day permanently loses.
                    </p>
                    <p className="text-sm text-blue-600 font-medium">Risk: High — motivated buyer with no office coverage to capture them</p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 4 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-16"
              id="how-to-set-up"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-start gap-3">
                <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
                How to Set Up AI Call Handling for Your Practice
              </h2>

              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  Setting up an AI receptionist for a chiropractic practice is a one-time configuration
                  process that typically takes less than 24 hours. No technical expertise is required.
                  The steps below represent the standard path for a solo practitioner or small group practice.
                </p>

                <ol className="list-decimal list-outside pl-6 space-y-4">
                  <li>
                    <strong>Connect your existing phone number.</strong> Your current business number
                    forwards to the AI when calls go unanswered or the line is busy. Alternatively,
                    the AI can answer all calls directly and escalate to staff as needed. No hardware
                    installation, no new number required.
                  </li>
                  <li>
                    <strong>Define your intake questions.</strong> Tell the AI what to collect from
                    new patients: name, contact number, reason for visit (back pain, neck pain, headaches,
                    sports injury, wellness), whether they have chiropractic insurance, and any other
                    information your intake form requires.
                  </li>
                  <li>
                    <strong>Train the AI on your practice details.</strong> Services offered, new patient
                    special pricing, accepted insurances, adjustment styles if asked, office location
                    and parking, and your standard intake visit structure. The AI answers these questions
                    accurately on every call.
                  </li>
                  <li>
                    <strong>Connect your scheduling system.</strong> Link Google Calendar, Outlook, or
                    your practice management software's calendar. The AI checks real-time availability
                    and books patients without double-booking or overbooking.
                  </li>
                  <li>
                    <strong>Set your notification preferences.</strong> Receive intake summaries by
                    email, SMS, or both. Know who called, what their complaint is, and when they are
                    scheduled before you start your day.
                  </li>
                </ol>

                <p>
                  Most chiropractic practices are fully live within 24 hours of starting setup.
                  Use our <Link to="/tools/chiropractor-patient-recovery-calculator" className="text-blue-600 hover:underline">chiropractor patient recovery calculator</Link> to
                  estimate how many new patients you are currently losing to missed calls before you begin.
                </p>
              </div>
            </motion.section>

            {/* Section 5 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mb-16"
              id="revenue-impact"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-start gap-3">
                <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
                Revenue Impact: What Each Missed New Patient Call Is Actually Worth
              </h2>

              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  The true cost of a missed chiropractic call is not the value of one appointment.
                  It is the value of a new patient relationship — which, for the average chiropractic
                  practice, is significantly higher than most practitioners realize.
                </p>

                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Average new chiropractic patient value breakdown
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">Initial new patient assessment</span>
                      <span className="font-semibold text-gray-900">$75 – $150</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">First care plan (12–24 visits)</span>
                      <span className="font-semibold text-gray-900">$800 – $2,500</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">Ongoing wellness/maintenance care (annual)</span>
                      <span className="font-semibold text-gray-900">$500 – $1,500</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-700 font-semibold">Total 2-year patient value</span>
                      <span className="font-bold text-blue-600 text-lg">$1,800 – $5,500</span>
                    </div>
                  </div>
                </div>

                <p>
                  Consider a practice that receives 15 new patient calls per week and currently misses
                  5 of them due to front desk overflow and after-hours gaps. At a 35% conversion rate
                  on answered calls, those 5 missed calls represent roughly 1.75 new patients per week
                  that never enter the practice.
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">$163,000+</div>
                  <p className="text-gray-700">Annual revenue at risk from 5 missed new patient calls per week — calculated at an average 2-year patient value of $1,800 and a 35% conversion rate.</p>
                </div>

                <p>
                  This calculation does not include referrals. Chiropractic patients who complete care
                  plans refer an average of 1.2 new patients each. Every missed new patient call also
                  represents the referrals that patient would have generated — multiplying the long-term
                  cost far beyond the direct revenue figure.
                </p>

                <p>
                  An AI receptionist costs a fraction of what a single missed new patient represents.
                  The math for most practices does not require a complex ROI model — it resolves
                  on the first week of captured calls.
                </p>
              </div>
            </motion.section>

            {/* Mid CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="my-16"
            >
              <div className="flex flex-col items-center justify-center text-center">
                <div className="bg-blue-600 rounded-2xl p-8 w-full max-w-[800px] text-white">
                  <Zap className="w-10 h-10 mx-auto mb-4 text-yellow-300" />
                  <h3 className="text-2xl font-bold mb-3">Stop losing new patients to voicemail</h3>
                  <p className="text-blue-100 mb-6 leading-relaxed">
                    Every unanswered call at your chiropractic practice is a new patient choosing a competitor.
                    Boltcall answers every call in under 3 seconds — day, evening, and weekend — and books
                    them directly into your schedule.
                  </p>
                  <Link
                    to="/signup"
                    className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors"
                  >
                    Start capturing every new patient call →
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="mb-16"
              id="faq"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-start gap-3">
                <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-3">Can an AI receptionist book chiropractic appointments automatically?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Yes. An AI receptionist answers every inbound call 24/7, collects the patient's name,
                    contact details, and reason for visiting, and schedules appointments directly into your
                    calendar using real-time availability. It handles new patient intake, existing patient
                    re-bookings, and after-hours calls without requiring any staff involvement.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-3">What happens to calls when the front desk is busy with patients?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    When your front desk staff is occupied with in-office patients, the AI receptionist handles
                    overflow calls simultaneously. There is no hold music, no missed calls, and no voicemail.
                    Every caller gets an immediate, natural conversation and leaves with a confirmed appointment
                    or the information they needed.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-3">Is an AI receptionist HIPAA-compliant for a chiropractic practice?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    A properly configured AI receptionist for healthcare handles intake information in accordance
                    with HIPAA requirements. The AI collects scheduling and basic intake data — name, contact details,
                    reason for visit — without storing protected health information in non-compliant systems.
                    Boltcall is designed for healthcare use cases where data handling standards are critical.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-3">How much revenue does a chiropractic practice lose per missed new patient call?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    A single new chiropractic patient is worth $800 to $2,500 in care plan revenue over their
                    first 3 to 6 months, plus ongoing maintenance care and referrals. If a practice misses 5 new
                    patient calls per week and converts at 35%, that is roughly 1.75 patients per week — or
                    $60,000 to $195,000 in annual revenue that went to voicemail.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-3">How quickly can I set up an AI receptionist for my chiropractic office?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    With Boltcall, setup takes less than 24 hours. You provide your practice details, services,
                    intake questions, and connect your calendar — the AI is trained and live on your phone number
                    the same day. There is no hardware to install, no staff training required, and no disruption
                    to your existing office flow.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-3">Does Boltcall work with chiropractic practice management software?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Boltcall connects to calendar systems including Google Calendar, Outlook, and Cal.com for
                    appointment booking. Intake data collected during calls is delivered via email, SMS, or
                    webhook and can be forwarded to your practice management platform. Contact the Boltcall
                    team for details on specific integrations with chiropractic software.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Related Articles */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Link to="/blog/ai-receptionist-for-dentists" className="p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                  <p className="font-semibold text-gray-900 group-hover:text-blue-600 mb-1">AI Receptionist for Dentists</p>
                  <p className="text-sm text-gray-600">How dental practices capture new patients and reduce no-shows with AI call handling.</p>
                </Link>
                <Link to="/blog/never-miss-a-call-after-business-hours" className="p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                  <p className="font-semibold text-gray-900 group-hover:text-blue-600 mb-1">Never Miss a Call After Business Hours</p>
                  <p className="text-sm text-gray-600">The complete guide to handling after-hours calls for local service businesses.</p>
                </Link>
                <Link to="/blog/missed-calls-statistics-local-business-2026" className="p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                  <p className="font-semibold text-gray-900 group-hover:text-blue-600 mb-1">Missed Call Statistics 2026</p>
                  <p className="text-sm text-gray-600">The data behind how many calls local businesses miss — and what it costs them.</p>
                </Link>
                <Link to="/tools/chiropractor-patient-recovery-calculator" className="p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                  <p className="font-semibold text-gray-900 group-hover:text-blue-600 mb-1">Chiropractor Revenue Calculator</p>
                  <p className="text-sm text-gray-600">Estimate exactly how much your practice is losing to missed calls per year.</p>
                </Link>
              </div>
            </motion.section>

          </article>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogAIReceptionistChiropractors;
