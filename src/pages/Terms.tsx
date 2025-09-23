import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Section from '../components/ui/Section';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        <Section className="py-16">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold text-text-main mb-8">
                Terms of Service
              </h1>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-text-muted mb-6">
                  Last updated: {new Date().toLocaleDateString()}
                </p>

                <h2 className="text-2xl font-semibold text-text-main mb-4">
                  Acceptance of Terms
                </h2>
                <p className="text-text-muted mb-6">
                  By accessing and using Boltcall's services, you accept and agree to be bound by the 
                  terms and provision of this agreement. If you do not agree to abide by the above, 
                  please do not use this service.
                </p>

                <h2 className="text-2xl font-semibold text-text-main mb-4">
                  Description of Service
                </h2>
                <p className="text-text-muted mb-6">
                  Boltcall provides AI-powered lead capture and booking services. Our service includes 
                  automated response systems, calendar integration, and reporting features to help 
                  businesses capture and convert leads more effectively.
                </p>

                <h2 className="text-2xl font-semibold text-text-main mb-4">
                  User Responsibilities
                </h2>
                <p className="text-text-muted mb-6">
                  You are responsible for maintaining the confidentiality of your account and password. 
                  You agree to accept responsibility for all activities that occur under your account 
                  or password. You must provide accurate and complete information when creating your account.
                </p>

                <h2 className="text-2xl font-semibold text-text-main mb-4">
                  Payment Terms
                </h2>
                <p className="text-text-muted mb-6">
                  Payment is due in advance for all services. We offer a 30-day money-back guarantee. 
                  If you are not satisfied with our service within the first 30 days, you may cancel 
                  and receive a full refund. Setup fees are non-refundable after the first month.
                </p>

                <h2 className="text-2xl font-semibold text-text-main mb-4">
                  Service Level Agreement
                </h2>
                <p className="text-text-muted mb-6">
                  We guarantee 99.9% uptime for our services. We also guarantee that you will receive 
                  at least 15 qualified leads within 30 days of service activation, or we will continue 
                  working for free until you do.
                </p>

                <h2 className="text-2xl font-semibold text-text-main mb-4">
                  Limitation of Liability
                </h2>
                <p className="text-text-muted mb-6">
                  In no event shall Boltcall be liable for any indirect, incidental, special, 
                  consequential, or punitive damages, including without limitation, loss of profits, 
                  data, use, goodwill, or other intangible losses, resulting from your use of the service.
                </p>

                <h2 className="text-2xl font-semibold text-text-main mb-4">
                  Termination
                </h2>
                <p className="text-text-muted mb-6">
                  We may terminate or suspend your account immediately, without prior notice or liability, 
                  for any reason whatsoever, including without limitation if you breach the Terms.
                </p>

                <h2 className="text-2xl font-semibold text-text-main mb-4">
                  Changes to Terms
                </h2>
                <p className="text-text-muted mb-6">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any 
                  time. If a revision is material, we will try to provide at least 30 days notice prior 
                  to any new terms taking effect.
                </p>

                <h2 className="text-2xl font-semibold text-text-main mb-4">
                  Contact Information
                </h2>
                <p className="text-text-muted mb-6">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-text-muted">
                    Email: legal@boltcall.ai<br />
                    Phone: +1 (555) 123-4567<br />
                    Address: San Francisco, CA
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
