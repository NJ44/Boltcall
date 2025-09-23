import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Phone, Mail, Globe, MessageCircle } from 'lucide-react';
import Card from '../ui/Card';
import type { Transcript, Channel } from '../../types/dashboard';

interface RecentTranscriptsProps {
  transcripts: Transcript[];
  className?: string;
}

const getChannelIcon = (channel: Channel) => {
  switch (channel) {
    case 'sms':
      return MessageSquare;
    case 'whatsapp':
      return MessageCircle;
    case 'form':
      return Mail;
    case 'missed_call':
      return Phone;
    default:
      return Globe;
  }
};

const getChannelColor = (channel: Channel) => {
  switch (channel) {
    case 'sms':
      return 'text-blue-600 bg-blue-100';
    case 'whatsapp':
      return 'text-green-600 bg-green-100';
    case 'form':
      return 'text-orange-600 bg-orange-100';
    case 'missed_call':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${Math.floor(diffInHours / 24)}d ago`;
};

const RecentTranscripts: React.FC<RecentTranscriptsProps> = ({ transcripts, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="p-6">
        <div className="flex items-center mb-6">
          <MessageSquare className="w-5 h-5 text-brand-blue mr-2" />
          <h3 className="text-xl font-semibold text-text-main">Recent Transcripts</h3>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {transcripts.map((transcript, index) => {
            const Icon = getChannelIcon(transcript.channel);
            const colorClass = getChannelColor(transcript.channel);
            
            return (
              <motion.div
                key={transcript.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="flex items-start space-x-3 p-3 border border-border rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className={`p-2 rounded-full ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-text-main capitalize">
                      {transcript.channel.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-text-muted">
                      {formatTime(transcript.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-text-muted mb-2 line-clamp-2">
                    {transcript.snippet}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transcript.outcome === 'Booked' ? 'bg-green-100 text-green-800' :
                      transcript.outcome === 'Qualified' ? 'bg-blue-100 text-blue-800' :
                      transcript.outcome === 'Follow-up' ? 'bg-yellow-100 text-yellow-800' :
                      transcript.outcome === 'Not Interested' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {transcript.outcome}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
};

export default RecentTranscripts;
