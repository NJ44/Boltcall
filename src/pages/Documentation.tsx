import React, { useState, useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Zap, 
  MessageSquare, 
  Phone, 
  Calendar, 
  BarChart3, 
  Bot, 
  CheckCircle,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  FileText,
  Code,
  Database,
  Bell,
  Globe
} from 'lucide-react';

const Documentation: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Documentation - API & Integration Guides | Boltcall';
    updateMetaDescription('Boltcall documentation and API guides. Learn how to integrate Boltcall AI receptionist with your website and apps. View docs.');
  }, []);

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <BookOpen className="w-5 h-5" />,
      content: [
        {
          title: 'Quick Setup Guide',
          description: 'Get your AI assistant up and running in minutes',
          steps: [
            'Create your BoltCall account',
            'Connect your phone number',
            'Set up your business information',
            'Configure your AI assistant',
            'Test your setup'
          ]
        },
        {
          title: 'Account Setup',
          description: 'Complete your profile and business details',
          steps: [
            'Add your business name and description',
            'Upload your logo and branding',
            'Set your business hours',
            'Configure your service offerings',
            'Add your contact information'
          ]
        }
      ]
    },
    {
      id: 'integrations',
      title: 'Integrations',
      icon: <Zap className="w-5 h-5" />,
      content: [
        {
          title: 'Phone System Integration',
          description: 'Connect your existing phone system',
          steps: [
            'Choose your phone provider (Twilio, Vonage, etc.)',
            'Configure your phone number',
            'Set up call routing',
            'Test incoming and outgoing calls',
            'Enable call recording and transcription'
          ]
        },
        {
          title: 'Calendar Integration',
          description: 'Sync with your calendar system',
          steps: [
            'Connect Google Calendar or Outlook',
            'Set your availability',
            'Configure appointment types',
            'Set up automatic booking',
            'Test booking flow'
          ]
        },
        {
          title: 'SMS Integration',
          description: 'Enable SMS messaging capabilities',
          steps: [
            'Connect Twilio or Vonage SMS',
            'Configure message templates',
            'Set up two-way messaging',
            'Enable delivery receipts',
            'Test SMS functionality'
          ]
        },
        {
          title: 'WhatsApp Integration',
          description: 'Connect WhatsApp Business API',
          steps: [
            'Apply for WhatsApp Business API',
            'Complete verification process',
            'Configure webhook endpoints',
            'Set up message templates',
            'Test WhatsApp messaging'
          ]
        }
      ]
    },
    {
      id: 'ai-features',
      title: 'AI Features',
      icon: <Bot className="w-5 h-5" />,
      content: [
        {
          title: 'AI Receptionist Setup',
          description: 'Configure your AI assistant',
          steps: [
            'Choose your AI voice and personality',
            'Set up greeting messages',
            'Configure conversation flow',
            'Add qualification questions',
            'Test AI responses'
          ]
        },
        {
          title: 'Voice Customization',
          description: 'Customize your AI voice',
          steps: [
            'Select from available voices',
            'Preview voice samples',
            'Configure speaking rate and tone',
            'Set up custom greetings',
            'Test voice quality'
          ]
        },
        {
          title: 'Conversation Intelligence',
          description: 'Set up smart conversation handling',
          steps: [
            'Configure intent recognition',
            'Set up conversation branching',
            'Add qualification criteria',
            'Configure appointment booking',
            'Test conversation flow'
          ]
        }
      ]
    },
    {
      id: 'instant-response',
      title: 'Instant Response System',
      icon: <MessageSquare className="w-5 h-5" />,
      content: [
        {
          title: 'Ad Response Automation',
          description: 'Automatically respond to ad inquiries',
          steps: [
            'Connect your ad platforms (Facebook, Google)',
            'Set up webhook endpoints',
            'Configure response templates',
            'Enable instant qualification',
            'Test response system'
          ]
        },
        {
          title: 'Lead Qualification',
          description: 'Automatically qualify leads',
          steps: [
            'Set qualification criteria',
            'Configure scoring system',
            'Set up follow-up sequences',
            'Enable appointment booking',
            'Test qualification flow'
          ]
        },
        {
          title: 'Multi-Channel Response',
          description: 'Respond across all channels',
          steps: [
            'Configure phone responses',
            'Set up SMS responses',
            'Enable email responses',
            'Configure WhatsApp responses',
            'Test all channels'
          ]
        }
      ]
    },
    {
      id: 'dashboard',
      title: 'Dashboard & Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      content: [
        {
          title: 'Analytics Overview',
          description: 'Monitor your AI assistant performance',
          steps: [
            'View call volume and response times',
            'Track lead conversion rates',
            'Monitor appointment bookings',
            'Analyze conversation transcripts',
            'Export reports and data'
          ]
        },
        {
          title: 'Real-time Monitoring',
          description: 'Track live performance metrics',
          steps: [
            'Monitor active calls',
            'Track response times',
            'View booking status',
            'Monitor system health',
            'Set up alerts and notifications'
          ]
        }
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications & Alerts',
      icon: <Bell className="w-5 h-5" />,
      content: [
        {
          title: 'Notification Setup',
          description: 'Configure your notification preferences',
          steps: [
            'Set up email notifications',
            'Configure SMS alerts',
            'Enable push notifications',
            'Set notification schedules',
            'Test notification delivery'
          ]
        },
        {
          title: 'Alert Configuration',
          description: 'Set up automated alerts',
          steps: [
            'Configure new lead alerts',
            'Set up missed call alerts',
            'Enable booking confirmations',
            'Configure system alerts',
            'Test alert system'
          ]
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: <HelpCircle className="w-5 h-5" />,
      content: [
        {
          title: 'Common Issues',
          description: 'Solutions to frequent problems',
          steps: [
            'Phone not receiving calls',
            'SMS messages not sending',
            'Calendar sync issues',
            'AI responses not working',
            'Integration connection problems'
          ]
        },
        {
          title: 'System Diagnostics',
          description: 'Check your system health',
          steps: [
            'Run connection tests',
            'Check API status',
            'Verify webhook endpoints',
            'Test all integrations',
            'Review error logs'
          ]
        }
      ]
    }
  ];

  const quickLinks = [
    { title: 'API Documentation', icon: <Code className="w-4 h-4" />, href: '#' },
    { title: 'Webhook Guide', icon: <Globe className="w-4 h-4" />, href: '#' },
    { title: 'Voice Samples', icon: <Phone className="w-4 h-4" />, href: '#' },
    { title: 'Integration Status', icon: <Database className="w-4 h-4" />, href: '#' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Documentation</h1>
              <p className="text-gray-600 mt-2">Complete guide to setting up and using BoltCall</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FileText className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
                <div className="space-y-2">
                  {quickLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      {link.icon}
                      <span className="text-sm">{link.title}</span>
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {sections.map((section, sectionIndex) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {section.icon}
                      </div>
                      <div className="text-left">
                        <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                        <p className="text-gray-600 text-sm">
                          {section.content.length} guide{section.content.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    {expandedSection === section.id ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {expandedSection === section.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-200"
                    >
                      <div className="p-6 space-y-6">
                        {section.content.map((item, itemIndex) => (
                          <div key={itemIndex} className="border border-gray-200 rounded-lg p-6">
                            <div className="flex items-start gap-4">
                              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                  {item.title}
                                </h3>
                                <p className="text-gray-600 mb-4">{item.description}</p>
                                <div className="space-y-2">
                                  {item.steps.map((step, stepIndex) => (
                                    <div key={stepIndex} className="flex items-start gap-3">
                                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-semibold text-blue-600">
                                          {stepIndex + 1}
                                        </span>
                                      </div>
                                      <p className="text-gray-700 text-sm">{step}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Support Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white"
            >
              <div className="flex items-start gap-6">
                <div className="p-3 bg-white/20 rounded-lg">
                  <HelpCircle className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">Need Help?</h3>
                  <p className="text-blue-100 mb-6">
                    Can't find what you're looking for? Our support team is here to help you get the most out of BoltCall.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                      <MessageSquare className="w-4 h-4" />
                      Contact Support
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-medium">
                      <Calendar className="w-4 h-4" />
                      Schedule Demo
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
