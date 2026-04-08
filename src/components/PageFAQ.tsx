import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { createFAQSchema } from '../lib/schema';

interface FAQItem {
  question: string;
  answer: string;
}

interface PageFAQProps {
  faqs: FAQItem[];
  title?: string;
  schemaId?: string;
}

const PageFAQ: React.FC<PageFAQProps> = ({ faqs, title = 'Frequently Asked Questions', schemaId = 'page-faq-schema' }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const existing = document.getElementById(schemaId);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id = schemaId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(createFAQSchema(faqs));
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById(schemaId);
      if (el) el.remove();
    };
  }, [faqs, schemaId]);

  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">{title}</h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-xl border border-gray-200/50 overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors focus:outline-none"
                  aria-expanded={openIndex === index}
                >
                  <span className="text-base font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center" style={{ minWidth: 28, minHeight: 28 }}>
                    {openIndex === index ? (
                      <Minus className="w-4 h-4 text-white" strokeWidth={2.5} />
                    ) : (
                      <Plus className="w-4 h-4 text-white" strokeWidth={2.5} />
                    )}
                  </div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4">
                        <p className="text-gray-600 leading-relaxed text-sm">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PageFAQ;
