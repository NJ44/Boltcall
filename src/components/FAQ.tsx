import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import Section from './ui/Section';
import WhisperText from './ui/whisper-text';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What exactly does Boltcall do?',
      answer: 'Boltcall is an AI receptionist that answers your calls 24/7, books appointments, captures leads, sends follow-up texts, and reminds customers about upcoming visits. It works even when you\'re busy or closed.'
    },
    {
      question: 'Can it transfer calls to a real person?',
      answer: 'Yes. You set the rules — transfer during business hours, for VIP customers, or urgent calls. If no one picks up, it takes a message and books a callback.'
    },
    {
      question: 'Does it sound like a real person?',
      answer: 'Yes. You choose the voice and tone — friendly, calm, or professional. Callers often can\'t tell it\'s AI.'
    },
    {
      question: 'Can I keep my current phone number?',
      answer: 'Yes. You can forward your existing number to Boltcall, or get a new local number in the app.'
    },
    {
      question: 'How long does setup take?',
      answer: 'About 5 minutes. Enter your business details, pick a voice, and your AI receptionist is live. No technical skills needed.'
    },
    {
      question: 'Does it connect to my CRM or calendar?',
      answer: 'Yes. Boltcall integrates with HubSpot, Google Sheets, Zapier, Cal.com, and more. Every lead and booking syncs automatically to the tools you already use.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <Section id="faq" background="white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-4xl font-bold text-text-main mb-4">
          <WhisperText
            text="Frequently Asked"
            className="text-2xl md:text-4xl font-bold text-text-main inline-block"
            delay={125}
            duration={0.625}
            x={-20}
            y={0}
            triggerStart="top 85%"
          />{' '}
          <WhisperText
            text="Questions"
            className="text-2xl md:text-4xl font-bold text-blue-500 inline-block"
            delay={125}
            duration={0.625}
            x={-20}
            y={0}
            triggerStart="top 85%"
          />
        </h2>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="group bg-white rounded-xl border border-gray-200/50 overflow-hidden shadow-sm transition-all duration-300" style={{ contain: 'layout style' }}>
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-300 focus:outline-none rounded-t-xl"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="text-base font-semibold text-gray-900 pr-4 group-hover:text-blue-600 transition-colors duration-300">
                    {faq.question}
                  </span>
                  <motion.div
                    className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shadow-sm transition-shadow duration-300"
                    style={{ minWidth: '28px', minHeight: '28px' }}
                  >
                    {openIndex === index ? (
                      <Minus className="w-4 h-4 text-white" strokeWidth={2.5} />
                    ) : (
                      <Plus className="w-4 h-4 text-white" strokeWidth={2.5} />
                    )}
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.4,
                        ease: [0.04, 0.62, 0.23, 0.98],
                        type: "spring"
                      }}
                      className="overflow-hidden"
                      style={{ willChange: 'height, opacity' }}
                    >
                      <div className="px-5 pb-4 bg-white">
                        <p className="text-gray-600 leading-relaxed text-sm">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default FAQ;
