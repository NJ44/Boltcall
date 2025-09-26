import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Calendar, Globe, Clock, MapPin, MessageSquare, Bot, ArrowRight } from 'lucide-react';
import { useSetupStore } from '../../stores/setupStore';
import Card from '../ui/Card';
import Button from '../ui/Button';

const PreviewPanel: React.FC = () => {
  const { account, businessProfile, phone, calendar, callFlow, knowledgeBase } = useSetupStore();
  const [isCalling, setIsCalling] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const handleTestCall = async () => {
    setIsCalling(true);
    // TODO: Implement test call API
    setTimeout(() => {
      setIsCalling(false);
      // Show success message
    }, 2000);
  };

  const handleCreateBooking = async () => {
    setIsBooking(true);
    // TODO: Implement dummy booking API
    setTimeout(() => {
      setIsBooking(false);
      // Show success message
    }, 2000);
  };

  const getBusinessHours = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const hours = businessProfile.openingHours[today as keyof typeof businessProfile.openingHours];
    
    if (hours?.closed) {
      return 'Closed today';
    }
    
    return hours ? `${hours.open} - ${hours.close}` : 'Hours not set';
  };

  const getLanguageNames = (codes: string[]) => {
    const languageMap: Record<string, string> = {
      en: 'English',
      es: 'Spanish',
      fr: 'French',
      de: 'German',
      it: 'Italian',
      pt: 'Portuguese',
      he: 'Hebrew',
      ar: 'Arabic',
      zh: 'Chinese',
      ja: 'Japanese',
      ko: 'Korean',
    };
    
    return codes.map(code => languageMap[code] || code).join(', ');
  };

  return (
    <div className="space-y-6">
      {/* Live Preview Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Preview</h3>
        <p className="text-sm text-gray-500">See how your receptionist will appear to customers</p>
      </div>

      {/* Business Card */}
      <Card className="p-6">
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-brand-sky rounded-full flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">
            {account.businessName || 'Your Business'}
          </h4>
          <p className="text-sm text-gray-500">
            AI Voice Receptionist
          </p>
        </div>

        <div className="space-y-3">
          {businessProfile.websiteUrl && (
            <div className="flex items-center space-x-2 text-sm">
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{businessProfile.websiteUrl}</span>
            </div>
          )}

          <div className="flex items-center space-x-2 text-sm">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{getBusinessHours()}</span>
          </div>

          {businessProfile.languages.length > 0 && (
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-400">🌐</span>
              <span className="text-gray-600">{getLanguageNames(businessProfile.languages)}</span>
            </div>
          )}

          {phone.useExistingNumber ? (
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{phone.existingNumber || 'Your number'}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                {phone.newNumber.number || 'New number'}
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Call Flow Diagram */}
      <Card className="p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Call Flow</h4>
        <div className="space-y-3">
          {/* Greeting */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Greeting</p>
              <p className="text-xs text-gray-500">
                {callFlow.greetingText || 'Welcome to [Business Name]...'}
              </p>
            </div>
          </div>

          <ArrowRight className="w-4 h-4 text-gray-400 mx-auto" />

          {/* AI Processing */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">AI Analysis</p>
              <p className="text-xs text-gray-500">
                {Object.values(callFlow.purposeDetection).filter(Boolean).length > 0 
                  ? 'Detecting intent...' 
                  : 'Purpose detection not configured'
                }
              </p>
            </div>
          </div>

          <ArrowRight className="w-4 h-4 text-gray-400 mx-auto" />

          {/* Actions */}
          <div className="grid grid-cols-1 gap-2">
            {callFlow.purposeDetection.booking && (
              <div className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                <Calendar className="w-4 h-4 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">Booking</p>
                  <p className="text-xs text-green-600">Schedule appointment</p>
                </div>
              </div>
            )}
            
            {callFlow.purposeDetection.faq && (
              <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">FAQ</p>
                  <p className="text-xs text-blue-600">Answer questions</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Test Actions */}
      <Card className="p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Test Your Setup</h4>
        <div className="space-y-3">
          <Button
            onClick={handleTestCall}
            disabled={isCalling}
            variant="outline"
            className="w-full flex items-center justify-center space-x-2"
          >
            <Phone className="w-4 h-4" />
            <span>{isCalling ? 'Calling...' : 'Call Me Now'}</span>
          </Button>
          
          <Button
            onClick={handleCreateBooking}
            disabled={isBooking}
            variant="outline"
            className="w-full flex items-center justify-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>{isBooking ? 'Creating...' : 'Create Dummy Booking'}</span>
          </Button>
        </div>
      </Card>

      {/* Status Indicators */}
      <Card className="p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Setup Status</h4>
        <div className="space-y-2">
          {[
            { label: 'Account', completed: !!account.businessName },
            { label: 'Business Profile', completed: !!businessProfile.mainCategory },
            { label: 'Calendar', completed: calendar.isConnected },
            { label: 'Phone', completed: phone.useExistingNumber || !!phone.newNumber.number },
            { label: 'Knowledge Base', completed: knowledgeBase.services.length > 0 },
            { label: 'Call Flow', completed: !!callFlow.greetingText },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{item.label}</span>
              <div className={`w-2 h-2 rounded-full ${
                item.completed ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default PreviewPanel;
