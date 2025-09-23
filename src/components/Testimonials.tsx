import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Card from './ui/Card';
import Section from './ui/Section';

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechStart Inc.',
      company: 'TechStart Inc.',
      content: 'Boltcall has transformed our lead management. We went from missing 60% of leads to capturing 95% within 30 seconds. Our revenue increased by 40% in just 3 months.',
      rating: 5,
      avatar: 'SJ'
    },
    {
      name: 'Michael Chen',
      role: 'Sales Director, GrowthCo',
      company: 'GrowthCo',
      content: 'The AI receptionist is incredible. It handles our high call volume perfectly and books appointments even when we\'re not available. Our team can focus on closing deals.',
      rating: 5,
      avatar: 'MC'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Founder, HealthPlus',
      company: 'HealthPlus',
      content: 'We were losing patients to competitors because we couldn\'t answer calls after hours. Boltcall solved this completely. Our patient bookings increased by 60%.',
      rating: 5,
      avatar: 'ER'
    },
    {
      name: 'David Thompson',
      role: 'Marketing Manager, RetailPro',
      company: 'RetailPro',
      content: 'The reporting features are game-changing. We can see exactly how many leads we\'re capturing, conversion rates, and ROI. It\'s like having a full analytics team.',
      rating: 5,
      avatar: 'DT'
    }
  ];

  const logos = [
    'TechStart', 'GrowthCo', 'HealthPlus', 'RetailPro', 'InnovateLab', 'ScaleUp'
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <Section id="testimonials" background="gray">
      <div className="text-center mb-16">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-text-main mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          What Our Customers Say
        </motion.h2>
        <motion.p
          className="text-lg text-text-muted max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Join thousands of businesses already using Boltcall to capture more leads
        </motion.p>
      </div>

      {/* Testimonial Slider */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="text-center">
                <div className="mb-6">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-xl text-text-muted italic leading-relaxed mb-6">
                    "{testimonials[currentIndex].content}"
                  </blockquote>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold">
                    {testimonials[currentIndex].avatar}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-text-main">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-text-muted">
                      {testimonials[currentIndex].role}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 text-brand-blue" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 text-brand-blue" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex ? 'bg-brand-blue' : 'bg-gray-300'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Company Logos */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <p className="text-text-muted mb-8">Trusted by leading companies</p>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="text-2xl font-bold text-text-muted hover:text-brand-blue transition-colors cursor-pointer"
            >
              {logo}
            </div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
};

export default Testimonials;
