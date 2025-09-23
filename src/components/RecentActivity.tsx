import React from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Phone, 
  Calendar, 
  CheckCircle, 
  Clock,
  User
} from 'lucide-react';
import Icon from './ui/Icon';

const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'lead',
      icon: MessageSquare,
      title: 'New lead from SMS',
      description: 'John Smith - Interested in premium plan',
      time: '2 minutes ago',
      status: 'new'
    },
    {
      id: 2,
      type: 'booking',
      icon: Calendar,
      title: 'Appointment booked',
      description: 'Sarah Johnson - Demo call scheduled',
      time: '5 minutes ago',
      status: 'success'
    },
    {
      id: 3,
      type: 'response',
      icon: Phone,
      title: 'Quick response sent',
      description: 'Auto-reply to Mike Wilson inquiry',
      time: '8 minutes ago',
      status: 'success'
    },
    {
      id: 4,
      type: 'conversion',
      icon: CheckCircle,
      title: 'Lead converted',
      description: 'Emily Davis signed up for Growth plan',
      time: '15 minutes ago',
      status: 'success'
    },
    {
      id: 5,
      type: 'followup',
      icon: Clock,
      title: 'Follow-up scheduled',
      description: 'Tom Brown - Call back in 2 hours',
      time: '22 minutes ago',
      status: 'pending'
    },
    {
      id: 6,
      type: 'lead',
      icon: User,
      title: 'Website visitor',
      description: 'Anonymous user viewed pricing page',
      time: '35 minutes ago',
      status: 'new'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'text-blue-600 bg-blue-50';
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return '●';
      case 'success':
        return '✓';
      case 'pending':
        return '⏱';
      default:
        return '●';
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-brand-blue/10 rounded-lg flex items-center justify-center">
              <Icon
                icon={activity.icon}
                size="sm"
                color="brand"
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-medium text-text-main truncate">
                {activity.title}
              </h4>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                <span>{getStatusIcon(activity.status)}</span>
                {activity.status}
              </span>
            </div>
            <p className="text-sm text-text-muted mb-1">
              {activity.description}
            </p>
            <p className="text-xs text-text-muted">
              {activity.time}
            </p>
          </div>
        </motion.div>
      ))}

      {/* View All Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="pt-4 border-t border-border"
      >
        <button className="w-full text-center text-sm text-brand-blue hover:text-brand-blueDark font-medium py-2">
          View all activity →
        </button>
      </motion.div>
    </div>
  );
};

export default RecentActivity;
