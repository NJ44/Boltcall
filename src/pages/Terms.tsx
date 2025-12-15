import React from 'react';
import { updateMetaDescription } from '../lib/utils';
import { Scale } from 'lucide-react';

const Terms: React.FC = () => {
  React.useEffect(() => {
    document.title = 'Terms of Service - Boltcall Legal Terms & Conditions';
    updateMetaDescription('Boltcall terms of service outline the rules and regulations for using our AI receptionist platform. Read full terms.');
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50">
              {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Scale className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-zinc-900">Terms of Service</h1>
          </div>
          <p className="text-zinc-600 text-lg">
            Last updated: December 2024
          </p>
                </div>
              </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">
          
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">1. Introduction</h2>
            <p className="text-zinc-700 leading-relaxed mb-4">
              Welcome to Boltcall. These Terms of Service ("Terms") govern your use of our AI-powered 
              receptionist and lead management services. By accessing or using our services, you agree 
              to be bound by these Terms.
            </p>
            <p className="text-zinc-700 leading-relaxed">
              If you do not agree to these Terms, please do not use our services.
            </p>
          </section>

          {/* Service Description */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">2. Service Description</h2>
            <p className="text-zinc-700 leading-relaxed mb-4">
              Boltcall provides AI-powered receptionist services including but not limited to:
            </p>
            <ul className="list-disc list-inside text-zinc-700 space-y-2 mb-4">
              <li>Automated call answering and lead qualification</li>
              <li>Appointment scheduling and calendar management</li>
              <li>Lead capture and customer information collection</li>
              <li>24/7 availability for customer inquiries</li>
              <li>Integration with third-party business tools</li>
                      </ul>
            <p className="text-zinc-700 leading-relaxed">
              We reserve the right to modify, suspend, or discontinue any aspect of our services at any time.
            </p>
          </section>

          {/* User Responsibilities */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">3. User Responsibilities</h2>
            <p className="text-zinc-700 leading-relaxed mb-4">
                        As a user of our services, you agree to:
                      </p>
            <ul className="list-disc list-inside text-zinc-700 space-y-2 mb-4">
              <li>Provide accurate and complete information during account setup</li>
                        <li>Maintain the confidentiality of your account credentials</li>
              <li>Use our services in compliance with applicable laws and regulations</li>
              <li>Not use our services for illegal, harmful, or unauthorized purposes</li>
              <li>Respect the intellectual property rights of Boltcall and third parties</li>
                      </ul>
          </section>

          {/* Payment Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">4. Payment Terms</h2>
            <p className="text-zinc-700 leading-relaxed mb-4">
              Our services are provided on a subscription basis. Payment terms include:
            </p>
            <ul className="list-disc list-inside text-zinc-700 space-y-2 mb-4">
              <li>Monthly or annual billing cycles as selected during signup</li>
              <li>Automatic renewal unless cancelled before the renewal date</li>
              <li>All fees are non-refundable except as required by law</li>
              <li>Price changes will be communicated with 30 days notice</li>
              <li>Failed payments may result in service suspension</li>
                          </ul>
          </section>

          {/* Data and Privacy */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">5. Data and Privacy</h2>
            <p className="text-zinc-700 leading-relaxed mb-4">
              Your privacy is important to us. Our collection, use, and protection of your data is 
              governed by our Privacy Policy, which is incorporated into these Terms by reference.
            </p>
            <p className="text-zinc-700 leading-relaxed">
              You retain ownership of all data you provide to us, and we will not use your data 
              for purposes other than providing our services.
            </p>
          </section>

          {/* Service Level Agreement */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">6. Service Level Agreement</h2>
            <p className="text-zinc-700 leading-relaxed mb-4">
              We strive to maintain high service availability and performance:
            </p>
            <ul className="list-disc list-inside text-zinc-700 space-y-2 mb-4">
              <li>99.9% uptime target for our core services</li>
              <li>30-second response time guarantee for lead capture</li>
              <li>24/7 monitoring and support</li>
              <li>Regular system maintenance with advance notice</li>
                      </ul>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">7. Limitation of Liability</h2>
            <p className="text-zinc-700 leading-relaxed mb-4">
              To the maximum extent permitted by law, Boltcall shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, including but not limited to 
              loss of profits, data, or business opportunities.
            </p>
            <p className="text-zinc-700 leading-relaxed">
              Our total liability shall not exceed the amount paid by you for our services in the 
              twelve months preceding the claim.
            </p>
          </section>

          {/* Termination */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">8. Termination</h2>
            <p className="text-zinc-700 leading-relaxed mb-4">
              Either party may terminate these Terms at any time:
            </p>
            <ul className="list-disc list-inside text-zinc-700 space-y-2 mb-4">
              <li>You may cancel your subscription through your account dashboard</li>
              <li>We may terminate your account for violation of these Terms</li>
              <li>Termination does not relieve you of payment obligations for services already provided</li>
              <li>Data export options available upon request within 30 days of termination</li>
                      </ul>
          </section>

          {/* Governing Law */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">9. Governing Law</h2>
            <p className="text-zinc-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the 
              State of California, without regard to conflict of law principles. Any disputes 
              arising from these Terms shall be resolved in the courts of California.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">10. Contact Information</h2>
            <p className="text-zinc-700 leading-relaxed mb-4">
                        If you have any questions about these Terms of Service, please contact us:
                      </p>
            <div className="bg-zinc-50 rounded-lg p-4">
              <p className="text-zinc-700">
                <strong>Email:</strong> legal@boltcall.com<br />
                <strong>Address:</strong> 123 Business Ave, Suite 100, San Francisco, CA 94105<br />
                <strong>Phone:</strong> (555) 123-4567
              </p>
                            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">11. Updates to Terms</h2>
            <p className="text-zinc-700 leading-relaxed">
              We may update these Terms from time to time. We will notify you of any material 
              changes by email or through our service. Your continued use of our services after 
              such notification constitutes acceptance of the updated Terms.
            </p>
          </section>
                </div>
              </div>
    </div>
  );
};

export default Terms;