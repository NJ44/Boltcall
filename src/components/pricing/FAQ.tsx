import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData: FAQItem[] = [
    {
      question: "What's the difference between Pro and Elite?",
      answer: "Same AI + dashboard engine. Elite adds white-glove setup, VIP support, quarterly strategy, larger limits, and branded voice."
    },
    {
      question: "Can I upgrade later?",
      answer: "Yes—one click from Starter → Pro, or Pro → Elite anytime."
    },
    {
      question: "What about overages?",
      answer: "SMS $0.02 each. Voice $0.06/min. Extra locations $199/₪750 each. Billed monthly."
    },
    {
      question: "Do you manage ads or CRM migrations?",
      answer: "Not included. Available as add-ons."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
        <p className="text-gray-600">
          Everything you need to know about our pricing and plans.
        </p>
      </div>

      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <motion.div
            key={index}
            className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-inset"
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="font-medium text-gray-900 pr-4">
                {faq.question}
              </span>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {openIndex === index ? (
                  <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" strokeWidth={2.5} />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" strokeWidth={2.5} />
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
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4">
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;




























