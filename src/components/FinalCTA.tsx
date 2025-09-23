import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from './ui/Card';
import Section from './ui/Section';
import Button from './ui/Button';

const FinalCTA: React.FC = () => {

  const benefits = [
    '30-second response time guaranteed',
    '24/7 lead capture and booking',
    '15 qualified leads in 30 days or free',
    'No setup fees for first month'
  ];

  return (
    <Section id="contact" background="brand">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-6">
              Ready to Never Lose a Lead Again?
            </h2>
            <p className="text-lg text-text-muted mb-8 leading-relaxed">
              Join thousands of businesses already using Boltcall to capture, qualify, and convert more leads automatically. Start your free trial today.
            </p>

            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-text-main">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <div className="bg-white/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-text-main mb-2">
                What happens next?
              </h3>
              <ol className="space-y-2 text-text-muted">
                <li>1. Fill out the form and we'll contact you within 24 hours</li>
                <li>2. Quick 15-minute setup call to configure your preferences</li>
                <li>3. Start capturing leads within 24 hours</li>
                <li>4. See results in your first week</li>
              </ol>
            </div>
          </motion.div>

          {/* Right Side - CTA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 text-center">
              <div className="mb-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-text-main mb-2">
                  Ready to Get Started?
                </h3>
                <p className="text-text-muted mb-6">
                  Create your account and start capturing leads in minutes.
                </p>
              </div>

              <div className="space-y-4">
                <Link to="/signup">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    Create Free Account
                  </Button>
                </Link>
                
                <p className="text-sm text-text-muted">
                  Already have an account?{' '}
                  <Link to="/login" className="text-brand-blue hover:text-brand-blueDark font-medium">
                    Sign in here
                  </Link>
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

export default FinalCTA;
