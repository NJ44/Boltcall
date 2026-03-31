// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { updateMetaDescription } from '../lib/utils';
import { motion } from 'framer-motion';
import {
  Phone, Clock, Calendar, Shield, Zap, CheckCircle,
  ChevronRight, ChevronDown, ArrowRight, Star, DollarSign, Droplets, Wrench, AlertTriangle
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';
import FinalCTA, { BLOG_CTA } from '../components/FinalCTA';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FAQAIReceptionistPlumber: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'AI Receptionist for Plumbing Companies: 20 Questions Answered | Boltcall';
    updateMetaDescription(
      'Everything plumbing business owners need to know about AI receptionists — emergency dispatch, after-hours calls, booking, and ROI.'
    );

    const schemas = [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "AI Receptionist for Plumbing Companies: 20 Questions Answered",
        "description": "Everything plumbing business owners need to know about AI receptionists — emergency dispatch, after-hours calls, booking, and ROI.",
        "author": { "@type": "Organization", "name": "Boltcall" },
        "datePublished": "2026-03-31",
        "dateModified": "2026-03-31",
        "publisher": {
          "@type": "Organization",
          "name": "Boltcall",
          "logo": { "@type": "ImageObject", "url": "https://boltcall.org/logo.png" }
        },
        "url": "https://boltcall.org/blog/ai-receptionist-plumber-faq",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://boltcall.org/blog/ai-receptionist-plumber-faq"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How much does an AI receptionist cost for a plumbing company?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "AI receptionists for plumbing companies cost $99-$249 per month with no per-call or per-minute fees. Traditional answering services charge $1-2 per call, which adds up to $800-1,500 per month for a busy plumbing company. The AI provides 24/7 coverage at a flat rate regardless of call volume."
            }
          },
          {
            "@type": "Question",
            "name": "How long does it take to set up an AI receptionist for a plumbing business?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Basic setup takes under 10 minutes. You provide your company name, hours, service area, and phone number. Full customization with emergency triage rules, service types, dispatch protocols, and pricing ranges takes 1-2 hours. Most plumbing companies are live the same day."
            }
          },
          {
            "@type": "Question",
            "name": "Can the AI triage emergency plumbing calls like burst pipes?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. The AI asks targeted questions to classify urgency: burst pipe or active flooding triggers immediate dispatch to your on-call plumber with caller details. A dripping faucet or running toilet is booked for the next available slot. This triage prevents false emergencies from waking your team at 2 AM while ensuring real emergencies get instant response."
            }
          },
          {
            "@type": "Question",
            "name": "How does the AI handle after-hours plumbing calls?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The AI answers every call 24/7 and triages by urgency. True emergencies like burst pipes, sewage backups, or gas line issues are routed immediately to your on-call plumber with a text and phone call. Non-urgent requests like faucet replacements are scheduled for the next business day with a confirmation text to the homeowner."
            }
          },
          {
            "@type": "Question",
            "name": "Can the AI validate whether a caller is in our plumbing service area?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. The AI asks for the caller's zip code or address and checks it against your defined service area. If the caller is outside your coverage zone, the AI politely explains and can suggest they search for a provider closer to them. This prevents wasted dispatch trips and disappointed customers."
            }
          },
          {
            "@type": "Question",
            "name": "Can the AI provide plumbing quotes or estimates over the phone?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The AI provides price ranges based on your configured rates. For example, it can say a drain cleaning typically costs $150-$250 depending on severity and location. For complex jobs requiring an on-site assessment, the AI books a diagnostic visit and sets expectations about the assessment fee. This transparency reduces sticker shock and increases booking rates."
            }
          },
          {
            "@type": "Question",
            "name": "Does the AI schedule around plumber availability and route optimization?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. When integrated with your field service software, the AI checks which plumbers are available, their current locations, and their skill sets. It books jobs into open slots that minimize drive time between appointments, improving daily job capacity by 15-20% compared to manual scheduling."
            }
          },
          {
            "@type": "Question",
            "name": "Can the AI handle calls for multiple plumbing service types?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. The AI distinguishes between drain cleaning, water heater repair, leak detection, pipe repair, sewer line work, fixture installation, water treatment, and any other service you offer. It asks the right qualifying questions for each type and books the appropriate appointment duration and technician."
            }
          },
          {
            "@type": "Question",
            "name": "Does the AI integrate with plumbing CRM and field service software?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Most AI receptionists integrate with ServiceTitan, Housecall Pro, Jobber, FieldEdge, and other popular platforms. New leads are automatically created in your system, existing customer records are updated, and jobs are dispatched without anyone touching a keyboard."
            }
          },
          {
            "@type": "Question",
            "name": "Can the AI handle customer callbacks and follow-ups for plumbing jobs?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. The AI can make outbound calls and texts for appointment confirmations, post-job follow-ups, and satisfaction surveys. It can also trigger automated review requests after completed jobs, helping your plumbing company build a stronger online reputation on Google and Yelp."
            }
          }
        ]
      }
    ];

    const scripts = schemas.map(schema => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
      return script;
    });

    return () => scripts.forEach(s => s.remove());
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const faqs = [
    {
      question: 'How much does an AI receptionist cost for a plumbing company?',
      answer:
        'AI receptionists for plumbing companies cost $99-$249 per month with no per-call or per-minute fees. Traditional answering services charge $1-2 per call, which adds up to $800-1,500 per month for a busy plumbing company. The AI provides 24/7 coverage at a flat monthly rate regardless of how many calls you receive.',
    },
    {
      question: 'How long does it take to set up an AI receptionist for a plumbing business?',
      answer:
        'Basic setup takes under 10 minutes. You provide your company name, business hours, service area zip codes, and phone number. Full customization with emergency triage rules, service type definitions, dispatch protocols, and pricing ranges takes 1-2 hours. Most plumbing companies are answering calls with AI the same day they sign up.',
    },
    {
      question: 'Can the AI triage emergency plumbing calls like burst pipes?',
      answer:
        'Yes. The AI asks targeted questions to classify urgency. A burst pipe with active flooding triggers immediate dispatch to your on-call plumber with the caller\'s name, address, and situation details sent via text and phone. A dripping faucet or slow drain is booked for the next available routine slot. This triage prevents false emergencies from disrupting your team while ensuring real emergencies get an instant response.',
    },
    {
      question: 'How does the AI handle after-hours plumbing calls?',
      answer:
        'The AI answers every call 24/7 and classifies urgency automatically. True emergencies like burst pipes, sewage backups, gas line issues, or water heater failures with flooding are routed immediately to your on-call plumber with full caller details. Non-urgent requests like faucet replacements or toilet upgrades are scheduled for the next business day with a confirmation text sent to the homeowner.',
    },
    {
      question: 'Can the AI validate whether a caller is in our service area?',
      answer:
        'Yes. The AI asks for the caller\'s zip code or street address and checks it against your defined service area boundaries. Callers inside your zone get booked immediately. Callers outside your coverage receive a polite explanation. This prevents wasted dispatch trips to locations 45 minutes away and keeps your plumbers productive in high-density areas.',
    },
    {
      question: 'Can the AI provide plumbing quotes or estimates over the phone?',
      answer:
        'The AI provides price ranges based on your configured service rates. For example, it can tell a caller that drain cleaning typically costs $150-$250 depending on severity and access. For complex jobs requiring an on-site assessment, the AI books a diagnostic visit and explains the assessment fee upfront. This transparency reduces sticker shock and increases booking rates by 20-30%.',
    },
    {
      question: 'Does the AI schedule around plumber availability and location?',
      answer:
        'Yes. When integrated with your field service software, the AI checks which plumbers are available, their current job locations, and their specializations. It books appointments into open slots that minimize drive time between jobs, improving daily job capacity by 15-20% compared to a dispatcher manually juggling a paper calendar.',
    },
    {
      question: 'Can the AI handle calls for multiple plumbing service types?',
      answer:
        'Yes. The AI distinguishes between drain cleaning, water heater repair and installation, leak detection, pipe repair and repiping, sewer line work, fixture installation, water treatment systems, and any other service you offer. It asks the right qualifying questions for each type and books the appropriate appointment duration with the correct technician.',
    },
    {
      question: 'Does the AI integrate with plumbing CRM and field service software?',
      answer:
        'Most AI receptionists integrate with ServiceTitan, Housecall Pro, Jobber, FieldEdge, ServiceFusion, and other popular platforms. New leads are automatically created in your system, existing customer records are pulled up and updated, and jobs are dispatched to technicians without anyone touching a keyboard.',
    },
    {
      question: 'Can the AI handle customer callbacks and follow-ups?',
      answer:
        'Yes. The AI makes outbound calls and sends texts for appointment confirmations, "on the way" notifications, post-job follow-ups, and satisfaction surveys. It can also trigger automated review requests after completed jobs, helping your plumbing company build a stronger online reputation on Google, Yelp, and Angi.',
    },
    {
      question: 'Can the AI automate review collection for my plumbing business?',
      answer:
        'Yes. After a job is marked complete, the AI sends an automated text with a direct link to your Google Business Profile review page. Satisfied customers can leave a review in two taps. Plumbing companies using automated review requests see a 3-5x increase in monthly reviews, which directly improves local search rankings and booking volume.',
    },
    {
      question: 'How does the AI handle seasonal demand spikes for plumbing?',
      answer:
        'The AI scales to unlimited simultaneous calls with no degradation. During winter freeze season when burst pipe calls spike 300-400%, every caller still gets an immediate answer. During summer water heater season, no one hits voicemail while your team is on the truck. Your cost stays flat regardless of volume, unlike answering services that charge per call.',
    },
    {
      question: 'How does an AI receptionist compare to a traditional answering service for plumbers?',
      answer:
        'Traditional answering services cost $1-2 per call with human operators who read from scripts, frequently misspell names, and cannot book appointments in your system. An AI receptionist costs a flat $99-249 per month, handles unlimited calls, books directly into your calendar, triages emergencies with consistent accuracy, and sends confirmation texts automatically.',
    },
    {
      question: 'What ROI can a plumbing company expect from an AI receptionist?',
      answer:
        'Most plumbing companies see a 4-8x return in the first month. The average plumbing service call is worth $250-450, and emergency jobs run $500-1,500. Capturing just 3-4 calls per week that previously went to voicemail or a competitor pays for the entire year of AI service. After-hours emergency capture alone often covers the monthly cost twice over.',
    },
    {
      question: 'Does the AI receptionist support multiple languages for plumbing calls?',
      answer:
        'Yes. The AI detects the caller\'s language and responds automatically in Spanish, French, Portuguese, and other supported languages. For plumbing companies serving diverse communities, this eliminates the language barrier that causes homeowners to hang up and call a competitor who speaks their language.',
    },
    {
      question: 'Does the AI record plumbing service calls?',
      answer:
        'Yes. Every call is recorded and transcribed automatically. You can search transcripts by keyword to find specific conversations, review how the AI handled a disputed call, or analyze patterns in customer complaints. Recordings are stored securely on encrypted servers and accessible through your dashboard anytime.',
    },
    {
      question: 'Can the AI transfer calls to an on-call plumber?',
      answer:
        'Yes. For confirmed emergencies, the AI immediately calls your on-call plumber and connects both parties with a warm handoff. The plumber receives a text with the caller\'s name, address, phone number, and a summary of the issue before the call connects. This gives your tech full context so they can prepare equipment and provide an accurate ETA.',
    },
    {
      question: 'How does the AI protect my plumbing company\'s customer data?',
      answer:
        'Customer data is encrypted at rest using AES-256 and in transit using TLS 1.3. Infrastructure is hosted on SOC 2 Type II compliant servers with regular security audits. Access is restricted to authorized users with multi-factor authentication. You own all your data and can export or delete it at any time.',
    },
    {
      question: 'What monthly reporting does the AI provide for plumbing companies?',
      answer:
        'You receive detailed analytics including total calls handled, calls by hour and day of week, jobs booked by service type, emergency dispatch count, average call duration, conversion rate from call to booking, and top caller questions. This data reveals your peak call windows, most-requested services, and marketing channel performance.',
    },
    {
      question: 'What is the cancellation policy for a plumbing AI receptionist?',
      answer:
        'Most providers, including Boltcall, offer month-to-month plans with no long-term contracts or cancellation fees. You can cancel anytime with no penalties. Your call recordings, transcripts, and customer data remain available for download after cancellation so you never lose historical information.',
    },
  ];

  const relatedResources = [
    {
      href: '/tools/plumber-revenue-calculator',
      title: 'Plumber Revenue Calculator',
      description: 'Calculate how much revenue your plumbing company loses to missed calls and slow response times.',
      icon: Droplets,
    },
    {
      href: '/features/ai-receptionist',
      title: 'How Our AI Receptionist Works',
      description: 'See the technology behind AI-powered phone answering for service businesses.',
      icon: Zap,
    },
    {
      href: '/blog/ai-receptionist-hvac-faq',
      title: 'AI Receptionist for HVAC Companies',
      description: 'See how HVAC companies use AI receptionists for peak season call handling.',
      icon: Phone,
    },
    {
      href: '/pricing',
      title: 'See Pricing Plans',
      description: 'Transparent pricing for every plumbing business size. No per-call fees, no surprises.',
      icon: DollarSign,
    },
  ];

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 h-1 bg-blue-600 z-50" style={{ width: `${progress}%` }} />

      <GiveawayBar />
      <Header />

      <main className="flex-grow bg-white">
        {/* Hero Section */}
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumbs */}
            <nav className="flex items-center text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              <Link to="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              <span className="text-gray-900 font-medium">AI Receptionist for Plumbing Companies: 20 Questions Answered</span>
            </nav>

            {/* Badge */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-full mb-6"
            >
              <Wrench className="h-4 w-4 mr-2" />
              FAQ for Plumbing Companies
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
            >
              AI Receptionist for Plumbing Companies: 20 Questions Answered
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial="hidden"
              animate="visible"
              variants={{ ...fadeIn, visible: { ...fadeIn.visible, transition: { duration: 0.5, delay: 0.1 } } }}
              className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed"
            >
              Emergency dispatch, after-hours coverage, quote handling, and every other question plumbing business owners ask before switching to AI phone answering.
            </motion.p>

            {/* Author line */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ ...fadeIn, visible: { ...fadeIn.visible, transition: { duration: 0.5, delay: 0.2 } } }}
              className="flex items-center text-sm text-gray-500 mb-8"
            >
              <span>By Boltcall Team</span>
              <span className="mx-2">·</span>
              <Calendar className="h-4 w-4 mr-1" />
              <span>March 31, 2026</span>
              <span className="mx-2">·</span>
              <Clock className="h-4 w-4 mr-1" />
              <span>10 min read</span>
            </motion.div>

            {/* Info box */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ ...fadeIn, visible: { ...fadeIn.visible, transition: { duration: 0.5, delay: 0.3 } } }}
              className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-blue-800 text-sm leading-relaxed"
            >
              Plumbing companies miss 30-40% of incoming calls because technicians are on the job and cannot answer. Each missed call represents $250-1,500 in lost revenue. This FAQ covers everything you need to know about using AI to capture every call, triage emergencies, and book more jobs.
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                20 Questions Plumbing Owners Ask About AI Receptionists
              </h2>
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-20px' }}
                    variants={{ ...fadeIn, visible: { ...fadeIn.visible, transition: { duration: 0.4, delay: index * 0.03 } } }}
                    className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                          openFaq === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openFaq === index && (
                      <div className="px-6 pb-5">
                        <p className="text-gray-600 text-base leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Related Resources */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Related Resources</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedResources.map((resource, index) => {
                  const Icon = resource.icon;
                  return (
                    <Link
                      key={index}
                      to={resource.href}
                      className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 hover:border-blue-300 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {resource.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{resource.description}</p>
                      <div className="mt-3 flex items-center text-sm font-medium text-blue-600">
                        Learn more <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <FinalCTA {...BLOG_CTA} />
      </main>

      <Footer />
    </>
  );
};

export default FAQAIReceptionistPlumber;
