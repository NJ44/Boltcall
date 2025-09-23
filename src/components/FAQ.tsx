import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import Section from './ui/Section';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How quickly does Boltcall respond to leads?',
      answer: 'Boltcall typically responds to leads within 30 seconds, with our fastest responses happening in under 10 seconds. This ensures you never miss a potential customer, even during peak hours or after business hours.'
    },
    {
      question: 'What channels does Boltcall support?',
      answer: 'Boltcall integrates with SMS, WhatsApp, phone calls, website chat, and social media platforms including Instagram, Facebook, and LinkedIn. We can handle leads from any channel your customers prefer to use.'
    },
    {
      question: 'How does the AI know what to say to prospects?',
      answer: 'Our AI is trained on your specific business information, services, and common customer questions. You can customize responses, set up conversation flows, and the AI learns from your successful interactions to improve over time.'
    },
    {
      question: 'Can Boltcall book appointments directly into my calendar?',
      answer: 'Yes! Boltcall integrates with Google Calendar, Outlook, and most major calendar systems. It can check your availability, book appointments, send confirmations, and even handle rescheduling automatically.'
    },
    {
      question: 'What if I don\'t get 15 qualified leads in 30 days?',
      answer: 'We guarantee 15 qualified leads in 30 days or we work free until you do. This is our promise to ensure you see real value from our service. We\'re confident in our ability to deliver results.'
    },
    {
      question: 'How does Boltcall qualify leads?',
      answer: 'Our AI uses advanced qualification criteria you can customize, including budget, timeline, decision-making authority, and specific needs. It asks the right questions to ensure only high-quality leads reach your sales team.'
    },
    {
      question: 'Can I customize the AI responses?',
      answer: 'Absolutely! You can customize all AI responses, set up different conversation flows for different services, and even create industry-specific templates. The AI adapts to your brand voice and business needs.'
    },
    {
      question: 'What kind of reporting do I get?',
      answer: 'You receive detailed weekly reports including lead volume, conversion rates, response times, booking rates, and ROI metrics. You can also access real-time dashboards to monitor performance as it happens.'
    },
    {
      question: 'How long does it take to set up Boltcall?',
      answer: 'Setup typically takes 5-10 minutes. We handle the technical integration, and you just need to provide your business information and preferences. Our team is available to help with any custom requirements.'
    },
    {
      question: 'What happens if the AI can\'t answer a question?',
      answer: 'When the AI encounters a question it can\'t handle, it can either escalate to a human team member, schedule a callback, or collect the customer\'s information for follow-up. You control the escalation process.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section id="faq" background="gray">
      <div className="text-center mb-16">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-text-main mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Frequently Asked Questions
        </motion.h2>
        <motion.p
          className="text-lg text-text-muted max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Everything you need to know about Boltcall
        </motion.p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-inset"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="text-lg font-semibold text-text-main pr-4">
                    {faq.question}
                  </span>
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <Minus className="w-5 h-5 text-brand-blue" />
                    ) : (
                      <Plus className="w-5 h-5 text-text-muted" />
                    )}
                  </div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4">
                        <p className="text-text-muted leading-relaxed">
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

        {/* Contact CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-brand-blue/10 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-text-main mb-2">
              Still have questions?
            </h3>
            <p className="text-text-muted mb-6">
              Our team is here to help. Get in touch and we'll answer any questions you have.
            </p>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center px-6 py-3 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blueDark transition-colors duration-200"
            >
              Contact Us
            </button>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default FAQ;
