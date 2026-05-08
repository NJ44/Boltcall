import React, { useState } from 'react';
import { Phone, Calendar, Globe, Clock, MessageSquare, Bot, ArrowRight, PhoneOff, CheckCircle } from 'lucide-react';
import { useSetupStore } from '../../stores/setupStore';
import { useToast } from '../../contexts/ToastContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { FUNCTIONS_BASE } from '../../lib/api';
import { authedFetch } from '../../lib/authedFetch';

const PreviewPanel: React.FC = () => {
  const { account, businessProfile, calendar, callFlow, knowledgeBase } = useSetupStore();
  const { showToast } = useToast();
  const [isCalling, setIsCalling] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [retellClient, setRetellClient] = useState<any>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);

  const handleTestCall = async () => {
    // If call is active, end it
    if (callActive && retellClient) {
      retellClient.stopCall();
      setRetellClient(null);
      setCallActive(false);
      setIsCalling(false);
      showToast({ title: 'Call Ended', message: 'Test call has been disconnected', variant: 'default', duration: 3000 });
      return;
    }

    setIsCalling(true);
    try {
      // Get the agent ID from the setup store
      const agentId = (account as any).agentId;
      if (!agentId) {
        showToast({ title: 'No Agent', message: 'Complete the setup steps first to create your AI agent', variant: 'error', duration: 4000 });
        setIsCalling(false);
        return;
      }

      // Create a web call via our Netlify function
      const response = await authedFetch(`${FUNCTIONS_BASE}/retell-agents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_web_call', agent_id: agentId }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.details || err.error || 'Failed to create test call');
      }

      const { access_token } = await response.json();

      // Dynamically import and start the Retell Web Client
      const { RetellWebClient } = await import('retell-client-js-sdk');
      const client = new RetellWebClient();

      client.on('call_started', () => {
        setCallActive(true);
        showToast({ title: 'Call Connected', message: 'You are now talking to your AI receptionist', variant: 'success', duration: 3000 });
      });

      client.on('call_ended', () => {
        setCallActive(false);
        setIsCalling(false);
        setRetellClient(null);
        showToast({ title: 'Call Ended', message: 'Test call completed', variant: 'default', duration: 3000 });
      });

      client.on('error', (error: any) => {
        console.error('Retell call error:', error);
        setCallActive(false);
        setIsCalling(false);
        setRetellClient(null);
        showToast({ title: 'Call Error', message: 'Something went wrong during the call', variant: 'error', duration: 4000 });
      });

      await client.startCall({ accessToken: access_token });
      setRetellClient(client);
    } catch (error: any) {
      console.error('Test call error:', error);
      showToast({ title: 'Test Call Failed', message: error.message || 'Could not start test call', variant: 'error', duration: 4000 });
      setIsCalling(false);
    }
  };

  const handleCreateBooking = async () => {
    setIsBooking(true);
    try {
      // Simulate a booking creation with the business data
      await new Promise(resolve => setTimeout(resolve, 1500));
      setBookingDone(true);
      showToast({
        title: 'Dummy Booking Created',
        message: `Test appointment for ${account.businessName || 'Your Business'} — Tomorrow at 10:00 AM`,
        variant: 'success',
        duration: 5000,
      });
      // Reset after 3 seconds
      setTimeout(() => setBookingDone(false), 3000);
    } catch (error: any) {
      showToast({ title: 'Booking Failed', message: error.message || 'Could not create dummy booking', variant: 'error', duration: 4000 });
    } finally {
      setIsBooking(false);
    }
  };

  const getBusinessHours = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const hours = businessProfile.openingHours[today as keyof typeof businessProfile.openingHours];
    
    if (hours?.closed) {
      return 'Closed today';
    }
    
    return hours ? `${hours.open} - ${hours.close}` : 'Hours not set';
  };

  const getLanguageNames = (codes: string | string[]) => {
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
    
    const list = Array.isArray(codes) ? codes : [codes];
    return list.filter(Boolean).map(code => languageMap[code] || code).join(', ');
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

          {businessProfile.languages && (
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-400">🌐</span>
              <span className="text-gray-600">{getLanguageNames(businessProfile.languages)}</span>
            </div>
          )}

          {businessProfile.businessPhone && (
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{businessProfile.businessPhone}</span>
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
            disabled={isCalling && !callActive}
            variant="outline"
            className={`w-full flex items-center justify-center space-x-2 ${callActive ? 'border-red-500 text-red-600 hover:bg-red-50' : ''}`}
          >
            {callActive ? <PhoneOff className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
            <span>{callActive ? 'End Call' : isCalling ? 'Connecting...' : 'Test Call (In-Browser)'}</span>
          </Button>

          <Button
            onClick={handleCreateBooking}
            disabled={isBooking || bookingDone}
            variant="outline"
            className="w-full flex items-center justify-center space-x-2"
          >
            {bookingDone ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Calendar className="w-4 h-4" />}
            <span>{bookingDone ? 'Booking Created!' : isBooking ? 'Creating...' : 'Create Dummy Booking'}</span>
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
            { label: 'Phone', completed: !!businessProfile.businessPhone },
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
