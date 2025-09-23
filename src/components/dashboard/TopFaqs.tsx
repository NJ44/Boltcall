import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Clock, Lightbulb } from 'lucide-react';
import Card from '../ui/Card';
import type { Faq } from '../../types/dashboard';

interface TopFaqsProps {
  faqs: Faq[];
  className?: string;
}

const TopFaqs: React.FC<TopFaqsProps> = ({ faqs, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="p-6">
        <div className="flex items-center mb-6">
          <HelpCircle className="w-5 h-5 text-brand-blue mr-2" />
          <h3 className="text-xl font-semibold text-text-main">Top FAQs</h3>
        </div>
        
        <div className="space-y-4">
          {faqs.slice(0, 10).map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="border border-border rounded-xl p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-medium text-text-main flex-1 mr-4">
                  {faq.question}
                </h4>
                <div className="flex items-center text-xs text-text-muted">
                  <span className="bg-brand-blue text-white px-2 py-1 rounded-full mr-2">
                    {faq.count}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-text-muted">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>Avg: {faq.avgTimeToAnswer}s</span>
                </div>
                
                {faq.suggestedTweak && (
                  <div className="flex items-center text-brand-blue">
                    <Lightbulb className="w-3 h-3 mr-1" />
                    <span>{faq.suggestedTweak}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default TopFaqs;
