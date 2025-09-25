import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertTriangle, CreditCard, Shield, Users, Clock, Phone } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Section from '../components/ui/Section';
import Card from '../components/ui/Card';

const Terms: React.FC = () => {
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
                  <FileText className="w-10 h-10 text-white" />
                </motion.div>
                <h1 className="text-5xl font-bold text-text-main mb-4">
                  Terms of Service
                </h1>
                <p className="text-xl text-text-muted max-w-3xl mx-auto">
                  Please read these terms carefully before using our AI-powered lead capture and booking services.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm text-text-muted bg-gray-50 rounded-full px-4 py-2">
                  <AlertTriangle className="w-4 h-4" />
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>

              {/* Key Points */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Card className="text-center p-6">
                    <CheckCircle className="w-8 h-8 text-brand-blue mx-auto mb-4" />
                    <h3 className="font-semibold text-text-main mb-2">Fair Use</h3>
                    <p className="text-sm text-text-muted">Clear guidelines for service usage</p>
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Card className="text-center p-6">
                    <CreditCard className="w-8 h-8 text-brand-blue mx-auto mb-4" />
                    <h3 className="font-semibold text-text-main mb-2">Flexible Payment</h3>
                    <p className="text-sm text-text-muted">30-day money-back guarantee</p>
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Card className="text-center p-6">
                    <Shield className="w-8 h-8 text-brand-blue mx-auto mb-4" />
                    <h3 className="font-semibold text-text-main mb-2">99.9% Uptime</h3>
                    <p className="text-sm text-text-muted">Reliable service guarantee</p>
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Card className="text-center p-6">
                    <Users className="w-8 h-8 text-brand-blue mx-auto mb-4" />
                    <h3 className="font-semibold text-text-main mb-2">Lead Guarantee</h3>
                    <p className="text-sm text-text-muted">15+ qualified leads in 30 days</p>
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
                      <CheckCircle className="w-8 h-8 text-brand-blue" />
                      Acceptance of Terms
                    </h2>
                    <div className="space-y-4">
                      <p className="text-text-muted leading-relaxed">
                        By accessing and using Boltcall's AI-powered services, you accept and agree to be bound by the 
                        terms and provisions of this agreement. These terms constitute a legally binding agreement 
                        between you and Boltcall.
                      </p>
                      <div className="bg-white rounded-xl p-6 border-l-4 border-brand-blue">
                        <p className="text-text-muted font-medium">
                          <strong>Important:</strong> If you do not agree to abide by these terms, 
                          please do not use our service. Continued use constitutes acceptance of any modifications.
                        </p>
                      </div>
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
                      <FileText className="w-8 h-8 text-brand-blue" />
                      Description of Service
                    </h2>
                    <div className="space-y-4">
                      <p className="text-text-muted leading-relaxed">
                        Boltcall provides comprehensive AI-powered lead capture and booking services. Our platform includes:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-text-muted ml-4">
                        <li>AI-powered automated response systems</li>
                        <li>Multi-channel lead capture (phone, website, social media)</li>
                        <li>Intelligent calendar integration and booking</li>
                        <li>Real-time lead qualification and scoring</li>
                        <li>Comprehensive reporting and analytics</li>
                        <li>24/7 customer support and monitoring</li>
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
                      User Responsibilities
                    </h2>
                    <div className="space-y-4">
                      <p className="text-text-muted leading-relaxed">
                        As a user of our services, you agree to:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-text-muted ml-4">
                        <li>Maintain the confidentiality of your account credentials</li>
                        <li>Accept responsibility for all activities under your account</li>
                        <li>Provide accurate and complete information during registration</li>
                        <li>Use the service in compliance with applicable laws</li>
                        <li>Not attempt to reverse engineer or compromise our systems</li>
                        <li>Report any security breaches or suspicious activity immediately</li>
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
                      <CreditCard className="w-8 h-8 text-brand-blue" />
                      Payment Terms
                    </h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl p-6 border border-red-100">
                          <h4 className="font-semibold text-text-main mb-3 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-brand-blue" />
                            Payment Schedule
                          </h4>
                          <ul className="space-y-2 text-sm text-text-muted">
                            <li>• Payment due in advance for all services</li>
                            <li>• Monthly billing cycle</li>
                            <li>• Setup fees billed separately</li>
                          </ul>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-green-100">
                          <h4 className="font-semibold text-text-main mb-3 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            Money-Back Guarantee
                          </h4>
                          <ul className="space-y-2 text-sm text-text-muted">
                            <li>• 30-day satisfaction guarantee</li>
                            <li>• Full refund if not satisfied</li>
                            <li>• Setup fees non-refundable after 30 days</li>
                          </ul>
                        </div>
                      </div>
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
                      Service Level Agreement
                    </h2>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl p-6 border border-orange-100">
                          <h4 className="font-semibold text-text-main mb-3 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-brand-blue" />
                            Uptime Guarantee
                          </h4>
                          <p className="text-3xl font-bold text-brand-blue mb-2">99.9%</p>
                          <p className="text-sm text-text-muted">Monthly uptime guarantee for all services</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-green-100">
                          <h4 className="font-semibold text-text-main mb-3 flex items-center gap-2">
                            <Users className="w-5 h-5 text-brand-blue" />
                            Lead Guarantee
                          </h4>
                          <p className="text-3xl font-bold text-green-600 mb-2">15+</p>
                          <p className="text-sm text-text-muted">Qualified leads within 30 days</p>
                        </div>
                      </div>
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                        <p className="text-sm text-text-muted">
                          <strong>Performance Guarantee:</strong> If we don't deliver 15+ qualified leads within 30 days 
                          of service activation, we will continue working for free until you do.
                        </p>
                      </div>
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
                      <AlertTriangle className="w-8 h-8 text-brand-blue" />
                      Limitation of Liability
                    </h2>
                    <div className="space-y-4">
                      <p className="text-text-muted leading-relaxed">
                        In no event shall Boltcall be liable for any indirect, incidental, special, 
                        consequential, or punitive damages, including without limitation:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-text-muted ml-4">
                        <li>Loss of profits, revenue, or business opportunities</li>
                        <li>Loss of data or information</li>
                        <li>Loss of use or goodwill</li>
                        <li>Business interruption or downtime</li>
                        <li>Third-party claims or actions</li>
                      </ul>
                      <p className="text-sm text-text-muted bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                        <strong>Note:</strong> Our total liability shall not exceed the amount paid by you 
                        for the services in the 12 months preceding the claim.
                      </p>
                    </div>
                  </motion.section>

                  <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-8"
                  >
                    <h2 className="text-3xl font-bold text-text-main mb-6 flex items-center gap-3">
                      <AlertTriangle className="w-8 h-8 text-brand-blue" />
                      Termination
                    </h2>
                    <div className="space-y-4">
                      <p className="text-text-muted leading-relaxed">
                        Either party may terminate this agreement under the following circumstances:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl p-6 border border-red-100">
                          <h4 className="font-semibold text-text-main mb-3">By Boltcall</h4>
                          <ul className="space-y-2 text-sm text-text-muted">
                            <li>• Immediate termination for terms breach</li>
                            <li>• 30-day notice for other reasons</li>
                            <li>• Non-payment of fees</li>
                          </ul>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-blue-100">
                          <h4 className="font-semibold text-text-main mb-3">By You</h4>
                          <ul className="space-y-2 text-sm text-text-muted">
                            <li>• 30-day written notice required</li>
                            <li>• Access continues until end of billing period</li>
                            <li>• Data export available upon request</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.section>

                  <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8"
                  >
                    <h2 className="text-3xl font-bold text-text-main mb-6 flex items-center gap-3">
                      <FileText className="w-8 h-8 text-brand-blue" />
                      Changes to Terms
                    </h2>
                    <div className="space-y-4">
                      <p className="text-text-muted leading-relaxed">
                        We reserve the right to modify or replace these Terms at any time. When we make changes:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-text-muted ml-4">
                        <li>Material changes will be communicated 30 days in advance</li>
                        <li>Minor updates may be effective immediately</li>
                        <li>Continued use constitutes acceptance of new terms</li>
                        <li>You may terminate if you disagree with changes</li>
                      </ul>
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                        <p className="text-sm text-text-muted">
                          <strong>Notification:</strong> We will notify you of material changes via email 
                          and through our platform dashboard.
                        </p>
                      </div>
                    </div>
                  </motion.section>

                  <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-8"
                  >
                    <h2 className="text-3xl font-bold text-text-main mb-6 flex items-center gap-3">
                      <Phone className="w-8 h-8 text-brand-blue" />
                      Contact Information
                    </h2>
                    <div className="space-y-4">
                      <p className="text-text-muted leading-relaxed">
                        If you have any questions about these Terms of Service, please contact us:
                      </p>
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-blue/10 rounded-lg flex items-center justify-center">
                              <span className="text-brand-blue font-semibold">@</span>
                            </div>
                            <div>
                              <p className="font-medium text-text-main">Legal Email</p>
                              <p className="text-text-muted">legal@boltcall.ai</p>
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

export default Terms;
