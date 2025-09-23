import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Section from '../components/ui/Section';

const Privacy: React.FC = () => {
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
                Privacy Policy
              </h1>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-text-muted mb-6">
                  Last updated: {new Date().toLocaleDateString()}
                </p>

                <h2 className="text-2xl font-semibold text-text-main mb-4">
                  Information We Collect
                </h2>
                <p className="text-text-muted mb-6">
                  We collect information you provide directly to us, such as when you create an account, 
                  use our services, or contact us for support. This may include your name, email address, 
                  phone number, company information, and any other information you choose to provide.
                </p>

                <h2 className="text-2xl font-semibold text-text-main mb-4">
                  How We Use Your Information
                </h2>
                <p className="text-text-muted mb-6">
                  We use the information we collect to provide, maintain, and improve our services, 
                  process transactions, send you technical notices and support messages, and communicate 
                  with you about products, services, and promotional offers.
                </p>

                <h2 className="text-2xl font-semibold text-text-main mb-4">
                  Information Sharing
                </h2>
                <p className="text-text-muted mb-6">
                  We do not sell, trade, or otherwise transfer your personal information to third parties 
                  without your consent, except as described in this policy. We may share your information 
                  with service providers who assist us in operating our website and conducting our business.
                </p>

                <h2 className="text-2xl font-semibold text-text-main mb-4">
                  Data Security
                </h2>
                <p className="text-text-muted mb-6">
                  We implement appropriate security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction. However, no method of 
                  transmission over the internet is 100% secure.
                </p>

                <h2 className="text-2xl font-semibold text-text-main mb-4">
                  Your Rights
                </h2>
                <p className="text-text-muted mb-6">
                  You have the right to access, update, or delete your personal information. You may also 
                  opt out of certain communications from us. To exercise these rights, please contact us 
                  at privacy@boltcall.ai.
                </p>

                <h2 className="text-2xl font-semibold text-text-main mb-4">
                  Contact Us
                </h2>
                <p className="text-text-muted mb-6">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-text-muted">
                    Email: privacy@boltcall.ai<br />
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

export default Privacy;
