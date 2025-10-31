import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Server, Users, Phone, MessageSquare, MessageCircle, Mail, Calendar, BarChart3, Headphones, BookOpen, Globe, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  status: 'running' | 'warning' | 'error' | 'disabled';
}

const ServicesPage: React.FC = () => {
  const { showToast } = useToast();
  const [services, setServices] = useState<Service[]>([
    {
      id: 'aiReceptionist',
      name: 'AI Receptionist',
      description: 'Automated call handling',
      icon: <Users className="w-5 h-5 text-blue-600" />,
      enabled: true,
      status: 'running'
    },
    {
      id: 'phoneSystem',
      name: 'Phone System',
      description: 'Incoming and outgoing calls',
      icon: <Phone className="w-5 h-5 text-green-600" />,
      enabled: true,
      status: 'running'
    },
    {
      id: 'sms',
      name: 'SMS',
      description: 'Text messaging service',
      icon: <MessageSquare className="w-5 h-5 text-purple-600" />,
      enabled: true,
      status: 'warning'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      description: 'WhatsApp messaging integration',
      icon: <MessageCircle className="w-5 h-5 text-green-600" />,
      enabled: false,
      status: 'disabled'
    },
    {
      id: 'email',
      name: 'Email',
      description: 'Email notifications and responses',
      icon: <Mail className="w-5 h-5 text-gray-600" />,
      enabled: true,
      status: 'running'
    },
    {
      id: 'calendar',
      name: 'Calendar',
      description: 'Appointment scheduling integration',
      icon: <Calendar className="w-5 h-5 text-blue-600" />,
      enabled: true,
      status: 'running'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Call and performance analytics',
      icon: <BarChart3 className="w-5 h-5 text-indigo-600" />,
      enabled: true,
      status: 'running'
    },
    {
      id: 'voiceLibrary',
      name: 'Voice Library',
      description: 'Voice customization and library',
      icon: <Headphones className="w-5 h-5 text-pink-600" />,
      enabled: true,
      status: 'warning'
    },
    {
      id: 'knowledgeBase',
      name: 'Knowledge Base',
      description: 'AI knowledge and training data',
      icon: <BookOpen className="w-5 h-5 text-orange-600" />,
      enabled: true,
      status: 'running'
    },
    {
      id: 'websiteBubble',
      name: 'Website Bubble',
      description: 'Website chat widget',
      icon: <Globe className="w-5 h-5 text-cyan-600" />,
      enabled: false,
      status: 'disabled'
    }
  ]);

  const toggleService = (id: string) => {
    setServices(prev => prev.map(service => 
      service.id === id 
        ? { ...service, enabled: !service.enabled }
        : service
    ));
    showToast({
      title: 'Service Updated',
      message: `Service has been ${services.find(s => s.id === id)?.enabled ? 'disabled' : 'enabled'}`,
      variant: 'default',
      duration: 3000
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running': return 'Running';
      case 'warning': return 'Warning';
      case 'error': return 'Error';
      default: return 'Disabled';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600 mt-1">Monitor and manage your service statuses</p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {service.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {getStatusIcon(service.status)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                  {getStatusText(service.status)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">Status</span>
              <button
                onClick={() => toggleService(service.id)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  service.enabled ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                  service.enabled ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;

