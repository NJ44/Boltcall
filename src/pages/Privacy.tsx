import React from 'react';
import { Shield } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-50">
              {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-zinc-900">Privacy Policy</h1>
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
              At Boltcall, we are committed to protecting your privacy and ensuring the security of your 
              personal information. This Privacy Policy explains how we collect, use, disclose, and 
              safeguard your information when you use our AI-powered receptionist services.
            </p>
            <p className="text-zinc-700 leading-relaxed">
              By using our services, you consent to the data practices described in this policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">2. Information We Collect</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium text-zinc-900 mb-3">Personal Information</h3>
              <p className="text-zinc-700 leading-relaxed mb-3">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-zinc-700 space-y-2 mb-4">
                <li>Name, email address, and contact information</li>
                <li>Business information and preferences</li>
                <li>Payment and billing information</li>
                <li>Account credentials and security information</li>
                <li>Communication preferences and settings</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-medium text-zinc-900 mb-3">Call and Communication Data</h3>
              <p className="text-zinc-700 leading-relaxed mb-3">
                Our AI services process and store:
              </p>
              <ul className="list-disc list-inside text-zinc-700 space-y-2 mb-4">
                <li>Call recordings and transcripts</li>
                <li>Customer inquiries and responses</li>
                <li>Appointment scheduling information</li>
                <li>Lead qualification data</li>
                <li>Customer interaction patterns</li>
              </ul>
              </div>
              
            <div className="mb-6">
              <h3 className="text-xl font-medium text-zinc-900 mb-3">Technical Information</h3>
              <p className="text-zinc-700 leading-relaxed mb-3">
                We automatically collect certain technical information:
              </p>
              <ul className="list-disc list-inside text-zinc-700 space-y-2 mb-4">
                <li>IP addresses and device information</li>
                <li>Browser type and version</li>
                <li>Usage patterns and service performance data</li>
                <li>Log files and error reports</li>
                <li>Cookies and similar tracking technologies</li>
                      </ul>
                    </div>
          </section>

          {/* How We Use Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-zinc-700 leading-relaxed mb-4">
                        We use the information we collect to:
                      </p>
            <ul className="list-disc list-inside text-zinc-700 space-y-2 mb-4">
              <li>Provide and maintain our AI receptionist services</li>
              <li>Process and respond to customer inquiries</li>
              <li>Schedule appointments and manage calendars</li>
              <li>Improve our AI models and service quality</li>
              <li>Send important service updates and notifications</li>
              <li>Process payments and manage billing</li>
                        <li>Comply with legal obligations and protect our rights</li>
                      </ul>
          </section>

          {/* Information Sharing */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">4. Information Sharing and Disclosure</h2>
            <p className="text-zinc-700 leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share 
              your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-zinc-700 space-y-2 mb-4">
              <li><strong>Service Providers:</strong> With trusted third-party vendors who assist in providing our services</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>Consent:</strong> When you have given explicit consent for specific sharing</li>
                      </ul>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">5. Data Security</h2>
            <p className="text-zinc-700 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc list-inside text-zinc-700 space-y-2 mb-4">
              <li>End-to-end encryption for all data transmission</li>
              <li>Secure data storage with access controls</li>
                        <li>Regular security audits and vulnerability assessments</li>
              <li>Employee training on data protection practices</li>
              <li>Incident response procedures for data breaches</li>
            </ul>
            <p className="text-zinc-700 leading-relaxed">
              While we strive to protect your information, no method of transmission over the internet 
              or electronic storage is 100% secure.
            </p>
          </section>

          {/* Data Retention */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">6. Data Retention</h2>
            <p className="text-zinc-700 leading-relaxed mb-4">
              We retain your information for as long as necessary to provide our services and comply 
              with legal obligations:
            </p>
            <ul className="list-disc list-inside text-zinc-700 space-y-2 mb-4">
              <li>Account information: Until account closure plus 7 years</li>
              <li>Call recordings: 2 years for quality improvement purposes</li>
              <li>Customer data: Until you request deletion or account closure</li>
              <li>Technical logs: 1 year for security and performance monitoring</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">7. Your Privacy Rights</h2>
            <p className="text-zinc-700 leading-relaxed mb-4">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc list-inside text-zinc-700 space-y-2 mb-4">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Restriction:</strong> Limit how we process your information</li>
            </ul>
            <p className="text-zinc-700 leading-relaxed">
              To exercise these rights, please contact us at privacy@boltcall.com.
            </p>
          </section>

          {/* Cookies and Tracking */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">8. Cookies and Tracking Technologies</h2>
            <p className="text-zinc-700 leading-relaxed mb-4">
              We use cookies and similar technologies to enhance your experience:
            </p>
            <ul className="list-disc list-inside text-zinc-700 space-y-2 mb-4">
              <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how you use our services</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Marketing Cookies:</strong> Used for targeted advertising (with consent)</li>
                      </ul>
            <p className="text-zinc-700 leading-relaxed">
              You can control cookie settings through your browser preferences.
            </p>
          </section>

          {/* International Transfers */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">9. International Data Transfers</h2>
            <p className="text-zinc-700 leading-relaxed mb-4">
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place for international transfers:
            </p>
            <ul className="list-disc list-inside text-zinc-700 space-y-2 mb-4">
              <li>Standard contractual clauses approved by relevant authorities</li>
              <li>Adequacy decisions for countries with equivalent protection</li>
              <li>Certification under recognized privacy frameworks</li>
                      </ul>
          </section>

          {/* Children's Privacy */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">10. Children's Privacy</h2>
            <p className="text-zinc-700 leading-relaxed">
              Our services are not intended for children under 13 years of age. We do not knowingly 
              collect personal information from children under 13. If we become aware that we have 
              collected such information, we will take steps to delete it promptly.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-zinc-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material 
              changes by email or through our service. We encourage you to review this policy 
              periodically for any updates.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">12. Contact Us</h2>
            <p className="text-zinc-700 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-zinc-50 rounded-lg p-4">
              <p className="text-zinc-700">
                <strong>Privacy Officer:</strong> privacy@boltcall.com<br />
                <strong>General Inquiries:</strong> support@boltcall.com<br />
                <strong>Address:</strong> 123 Business Ave, Suite 100, San Francisco, CA 94105<br />
                <strong>Phone:</strong> (555) 123-4567
              </p>
                            </div>
          </section>
                </div>
              </div>
    </div>
  );
};

export default Privacy;