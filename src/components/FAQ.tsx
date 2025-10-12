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
      answer: 'It answers calls and messages, qualifies leads, books appointments on your calendar, and notifies you. If no one picks up, it still captures the lead and books when possible.'
    },
    {
      question: 'Can it transfer the call to a real person?',
      answer: 'Yes. Set live-transfer rules (e.g., during business hours, hot leads only). If no one answers, it books or takes a voicemail and alerts you.'
    },
    {
      question: 'How good is the call quality and voice?',
      answer: 'Natural and clear. You pick a voice and tone (friendly, calm, formal). We keep replies short so calls feel human, not robotic.'
    },
    {
      question: 'Can it use my current phone number?',
      answer: 'Yes. You can forward your existing number to your AI receptionist, or buy a new number inside the app and start fresh.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section id="faq" background="white">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-6">
          <WhisperText
            text="Frequently Asked Questions"
            className="text-3xl md:text-4xl font-bold text-text-main"
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
              <div className="group bg-white rounded-xl border border-gray-200/50 overflow-hidden shadow-sm transition-all duration-300">
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
                  >
                    {openIndex === index ? (
                      <Minus className="w-5 h-5 text-white" />
                    ) : (
                      <Plus className="w-5 h-5 text-white" />
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
