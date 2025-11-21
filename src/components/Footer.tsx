import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {

  const footerLinks = {
    features: [
      { label: 'AI Receptionist', href: '/features/ai-receptionist' },
      { label: 'Instant Form Reply', href: '/features/instant-form-reply' },
      { label: 'SMS Booking Assistant', href: '/features/sms-booking-assistant' },
      { label: 'Automated Reminders', href: '/features/automated-reminders' },
      { label: 'AI Follow-Up System', href: '/features/ai-follow-up-system' },
      { label: 'Website Chat/Voice Widget', href: '/features/website-chat-voice-widget' },
      { label: 'Lead Reactivation', href: '/features/lead-reactivation' },
    ],
    resources: [
      { label: 'AI Agent Comparison', href: '/ai-agent-comparison' },
      { label: 'Blog', href: '/blog' },
      { label: 'SEO Audit', href: '/seo-analyzer' },
      { label: 'Speed Test', href: '/speed-test' },
      { label: 'AI Revenue Audit', href: '/how-much-you-can-earn-with-ai' },
    ],
    company: [
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' }
    ],
    support: [
      { label: 'Help Center', href: '#' },
      { label: 'Documentation', href: '#' }
    ]
  };


  return (
    <footer className="bg-white text-text-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <img 
                  src="/boltcall_full_logo.png" 
                  alt="Boltcall - AI Receptionist, Follow Ups, Reminders" 
                  className="h-12 mb-3"
                />
              </motion.div>
            </div>

            {/* Features Links */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="text-base font-semibold mb-3">Features</h4>
                <ul className="space-y-2">
                  {footerLinks.features.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.href}
                        className="text-gray-600 hover:text-brand-blue transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Resources Links */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h4 className="text-base font-semibold mb-3">Resources</h4>
                <ul className="space-y-2">
                  {footerLinks.resources.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.href}
                        className="text-gray-600 hover:text-brand-blue transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Company Links */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h4 className="text-base font-semibold mb-3">Company</h4>
                <ul className="space-y-2">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.href}
                        className="text-gray-600 hover:text-brand-blue transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Support Links */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h4 className="text-base font-semibold mb-3">Support</h4>
                <ul className="space-y-2">
                  {footerLinks.support.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-gray-600 hover:text-brand-blue transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-300 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.div
              className="text-gray-500 text-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              © 2025 Boltcall. All rights reserved.
            </motion.div>

            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {/* Social Media Links */}
              <a
                href="https://www.facebook.com/profile.php?id=61582307818752"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-brand-blue transition-colors"
                aria-label="Boltcall on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/boltcallteam"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-brand-blue transition-colors"
                aria-label="Boltcall on X (Twitter)"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/boltcall"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-brand-blue transition-colors"
                aria-label="Boltcall on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
