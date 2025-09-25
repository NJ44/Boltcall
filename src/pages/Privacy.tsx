import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Users, Database, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Section from '../components/ui/Section';
import Card from '../components/ui/Card';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        <Section className="py-16">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Header */}
              <div className="text-center mb-16">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="w-20 h-20 bg-gradient-to-br from-brand-blue to-brand-sky rounded-2xl flex items-center justify-center mx-auto mb-6"
                >
                  <Shield className="w-10 h-10 text-white" />
                </motion.div>
                <h1 className="text-5xl font-bold text-text-main mb-4">
                  Privacy Policy
                </h1>
                <p className="text-xl text-text-muted max-w-3xl mx-auto">
                  Your privacy is important to us. This policy explains how we collect, use, and protect your information.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm text-text-muted bg-gray-50 rounded-full px-4 py-2">
                  <AlertCircle className="w-4 h-4" />
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>

              {/* Key Points */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Card className="text-center p-6">
                    <Eye className="w-8 h-8 text-brand-blue mx-auto mb-4" />
                    <h3 className="font-semibold text-text-main mb-2">Transparency</h3>
                    <p className="text-sm text-text-muted">We clearly explain how your data is used</p>
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Card className="text-center p-6">
                    <Lock className="w-8 h-8 text-brand-blue mx-auto mb-4" />
                    <h3 className="font-semibold text-text-main mb-2">Security</h3>
                    <p className="text-sm text-text-muted">Your data is protected with enterprise-grade security</p>
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Card className="text-center p-6">
                    <Users className="w-8 h-8 text-brand-blue mx-auto mb-4" />
                    <h3 className="font-semibold text-text-main mb-2">Control</h3>
                    <p className="text-sm text-text-muted">You have full control over your personal information</p>
                  </Card>
                </motion.div>
              </div>
              
              <div className="prose prose-lg max-w-none">
                <div className="space-y-12">
                  <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8"
                  >
                    <h2 className="text-3xl font-bold text-text-main mb-6 flex items-center gap-3">
                      <Database className="w-8 h-8 text-brand-blue" />
                      Information We Collect
                    </h2>
                    <div className="space-y-4">
                      <p className="text-text-muted leading-relaxed">
                        We collect information you provide directly to us, such as when you create an account, 
                        use our services, or contact us for support. This may include:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-text-muted ml-4">
                        <li>Name and email address</li>
                        <li>Phone number and company information</li>
                        <li>Payment and billing information</li>
                        <li>Communication preferences</li>
                        <li>Any other information you choose to provide</li>
                      </ul>
                    </div>
                  </motion.section>

                  <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8"
                  >
                    <h2 className="text-3xl font-bold text-text-main mb-6 flex items-center gap-3">
                      <Eye className="w-8 h-8 text-brand-blue" />
                      How We Use Your Information
                    </h2>
                    <div className="space-y-4">
                      <p className="text-text-muted leading-relaxed">
                        We use the information we collect to:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-text-muted ml-4">
                        <li>Provide, maintain, and improve our AI-powered services</li>
                        <li>Process transactions and manage your account</li>
                        <li>Send technical notices, updates, and support messages</li>
                        <li>Communicate about products, services, and promotional offers</li>
                        <li>Analyze usage patterns to enhance user experience</li>
                        <li>Comply with legal obligations and protect our rights</li>
                      </ul>
                    </div>
                  </motion.section>

                  <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8"
                  >
                    <h2 className="text-3xl font-bold text-text-main mb-6 flex items-center gap-3">
                      <Users className="w-8 h-8 text-brand-blue" />
                      Information Sharing
                    </h2>
                    <div className="space-y-4">
                      <p className="text-text-muted leading-relaxed">
                        We do not sell, trade, or otherwise transfer your personal information to third parties 
                        without your consent, except as described in this policy. We may share your information:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-text-muted ml-4">
                        <li>With service providers who assist us in operating our platform</li>
                        <li>When required by law or to protect our legal rights</li>
                        <li>In connection with a business transfer or acquisition</li>
                        <li>With your explicit consent for specific purposes</li>
                      </ul>
                    </div>
                  </motion.section>

                  <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-8"
                  >
                    <h2 className="text-3xl font-bold text-text-main mb-6 flex items-center gap-3">
                      <Lock className="w-8 h-8 text-brand-blue" />
                      Data Security
                    </h2>
                    <div className="space-y-4">
                      <p className="text-text-muted leading-relaxed">
                        We implement enterprise-grade security measures to protect your personal information:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-text-muted ml-4">
                        <li>End-to-end encryption for data transmission</li>
                        <li>Secure data storage with regular backups</li>
                        <li>Multi-factor authentication and access controls</li>
                        <li>Regular security audits and vulnerability assessments</li>
                        <li>Compliance with industry security standards</li>
                      </ul>
                      <p className="text-sm text-text-muted bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                        <strong>Note:</strong> While we implement robust security measures, no method of 
                        transmission over the internet is 100% secure. We cannot guarantee absolute security.
                      </p>
                    </div>
                  </motion.section>

                  <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8"
                  >
                    <h2 className="text-3xl font-bold text-text-main mb-6 flex items-center gap-3">
                      <Shield className="w-8 h-8 text-brand-blue" />
                      Your Rights
                    </h2>
                    <div className="space-y-4">
                      <p className="text-text-muted leading-relaxed">
                        You have the following rights regarding your personal information:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-text-muted ml-4">
                        <li>Access and review your personal information</li>
                        <li>Update or correct inaccurate information</li>
                        <li>Delete your personal information</li>
                        <li>Opt out of marketing communications</li>
                        <li>Request data portability</li>
                        <li>Withdraw consent where applicable</li>
                      </ul>
                      <p className="text-text-muted leading-relaxed">
                        To exercise these rights, please contact us at privacy@boltcall.ai. We will respond 
                        to your request within 30 days.
                      </p>
                    </div>
                  </motion.section>

                  <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-8"
                  >
                    <h2 className="text-3xl font-bold text-text-main mb-6 flex items-center gap-3">
                      <AlertCircle className="w-8 h-8 text-brand-blue" />
                      Contact Us
                    </h2>
                    <div className="space-y-4">
                      <p className="text-text-muted leading-relaxed">
                        If you have any questions about this Privacy Policy, please contact us:
                      </p>
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-blue/10 rounded-lg flex items-center justify-center">
                              <span className="text-brand-blue font-semibold">@</span>
                            </div>
                            <div>
                              <p className="font-medium text-text-main">Email</p>
                              <p className="text-text-muted">privacy@boltcall.ai</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-blue/10 rounded-lg flex items-center justify-center">
                              <span className="text-brand-blue font-semibold">📞</span>
                            </div>
                            <div>
                              <p className="font-medium text-text-main">Phone</p>
                              <p className="text-text-muted">+1 (555) 123-4567</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-blue/10 rounded-lg flex items-center justify-center">
                              <span className="text-brand-blue font-semibold">📍</span>
                            </div>
                            <div>
                              <p className="font-medium text-text-main">Address</p>
                              <p className="text-text-muted">San Francisco, CA</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.section>
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
