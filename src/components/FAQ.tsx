import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import Section from './ui/Section';
import WhisperText from './ui/whisper-text';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What exactly Boltcall offers?',
      answer: 'Boltcall helps your business. It talks to new customers right away. It answers your phone calls. It answers your messages. It books appointments for you. It talks to people again so they don\'t forget. It sends reminders. It tells you what is happening. It works even when you are busy or closed.'
    },
    {
      question: 'Can it transfer the call to a real person?',
      answer: 'Yes. You can tell it to give the call to a real person. You can say to do this during work hours. Or only for important customers. If no one answers, it books an appointment or takes a message. Then it tells you.'
    },
    {
      question: 'How good is the call quality and voice?',
      answer: 'It sounds like a real person. You choose how it talks. You can make it friendly. You can make it calm. You can make it formal. It talks in short sentences. It does not sound like a robot.'
    },
    {
      question: 'Can it use my current phone number?',
      answer: 'Yes. You can use your phone number that you have now. Or you can get a new phone number in the app. Then you can start using it.'
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
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-bold text-text-main mb-6">
          <WhisperText
            text="Frequently Asked"
            className="text-3xl md:text-5xl font-bold text-text-main inline-block"
            delay={125}
            duration={0.625}
            x={-20}
            y={0}
            triggerStart="top 85%"
          />{' '}
          <WhisperText
            text="Questions"
            className="text-3xl md:text-5xl font-bold text-blue-500 inline-block"
            delay={125}
            duration={0.625}
            x={-20}
            y={0}
            triggerStart="top 85%"
          />
        </h2>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="space-y-6">
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
                  className="w-full px-7 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-300 focus:outline-none rounded-t-xl"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="text-xl font-semibold text-gray-900 pr-5 group-hover:text-blue-600 transition-colors duration-300">
                    {faq.question}
                  </span>
                  <motion.div 
                    className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shadow-sm transition-shadow duration-300"
                    style={{ minWidth: '36px', minHeight: '36px' }}
                  >
                    {openIndex === index ? (
                      <Minus className="w-5 h-5 text-white" strokeWidth={2.5} />
                    ) : (
                      <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
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
                      <div className="px-7 pb-5 bg-white">
                        <p className="text-gray-700 leading-relaxed text-lg">
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
