import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useSetupStore } from '../../../stores/setupStore';
import { supabase } from '../../../lib/supabase';
import Button from '../../ui/Button';

const StepCalendar: React.FC = () => {
  const { calendar, updateCalendar } = useSetupStore();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleGoogleConnect = async () => {
    setIsConnecting(true);
    try {
      console.log('Connecting to Google Calendar...');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: [
            'openid',
            'email',
            'profile',
            'https://www.googleapis.com/auth/calendar.readonly',
            'https://www.googleapis.com/auth/calendar.events'
          ].join(' '),
          // helps ensure a refresh token on first consent:
          queryParams: { access_type: 'offline', prompt: 'consent' }
        }
      });
      
      if (error) {
        console.error('Google Calendar OAuth error:', error);
        throw error;
      }
      
      console.log('Google Calendar OAuth initiated');
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error);
      setIsConnecting(false);
    }
  };

  const handleMicrosoftConnect = async () => {
    setIsConnecting(true);
    try {
      console.log('Connecting to Microsoft Calendar...');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: [
            'openid',
            'email',
            'profile',
            'https://graph.microsoft.com/calendars.readwrite'
          ].join(' '),
          // helps ensure a refresh token on first consent:
          queryParams: { access_type: 'offline', prompt: 'consent' }
        }
      });
      
      if (error) {
        console.error('Microsoft Calendar OAuth error:', error);
        throw error;
      }
      
      console.log('Microsoft Calendar OAuth initiated');
    } catch (error) {
      console.error('Error connecting to Microsoft Calendar:', error);
      setIsConnecting(false);
    }
  };

  // Read-only calendar connection functions
  const handleGoogleReadOnlyConnect = async () => {
    setIsConnecting(true);
    try {
      console.log('Connecting to Google Calendar (Read-only)...');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: [
            'openid',
            'email',
            'profile',
            'https://www.googleapis.com/auth/calendar.readonly'
          ].join(' '),
          queryParams: { access_type: 'offline', prompt: 'consent' }
        }
      });
      
      if (error) {
        console.error('Google Calendar Read-only OAuth error:', error);
        throw error;
      }
      
      console.log('Google Calendar Read-only OAuth initiated');
    } catch (error) {
      console.error('Error connecting to Google Calendar (Read-only):', error);
      setIsConnecting(false);
    }
  };

  const handleMicrosoftReadOnlyConnect = async () => {
    setIsConnecting(true);
    try {
      console.log('Connecting to Microsoft Calendar (Read-only)...');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: [
            'openid',
            'email',
            'profile',
            'https://graph.microsoft.com/calendars.read'
          ].join(' '),
          queryParams: { access_type: 'offline', prompt: 'consent' }
        }
      });
      
      if (error) {
        console.error('Microsoft Calendar Read-only OAuth error:', error);
        throw error;
      }
      
      console.log('Microsoft Calendar Read-only OAuth initiated');
    } catch (error) {
      console.error('Error connecting to Microsoft Calendar (Read-only):', error);
      setIsConnecting(false);
    }
  };





  return (
    <div className="space-y-8">
      {/* Optional Header */}
      <div className="text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <h4 className="text-sm font-medium text-yellow-900">Optional Step</h4>
          </div>
          <p className="text-yellow-700 text-sm">
            You can connect your calendar now or skip this step and add it later in your dashboard settings.
          </p>
        </div>
      </div>

      {/* Calendar Connections */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Connect Your Calendar</h3>
          
          {!calendar.isConnected ? (
            <div className="space-y-4">
              {/* Google Calendar */}
              <div className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Google Calendar</h4>
                      <p className="text-gray-600 text-sm">Connect your Google Calendar to enable appointment booking</p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleGoogleConnect}
                    disabled={isConnecting}
                    variant="outline"
                    className="px-6 py-2 font-medium border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  >
                    {isConnecting ? 'Connecting...' : 'Connect'}
                  </Button>
                </div>
              </div>

              {/* Microsoft Calendar */}
              <div className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Microsoft Calendar</h4>
                      <p className="text-gray-600 text-sm">Connect your Microsoft Calendar to enable appointment booking</p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleMicrosoftConnect}
                    disabled={isConnecting}
                    variant="outline"
                    className="px-6 py-2 font-medium border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  >
                    {isConnecting ? 'Connecting...' : 'Connect'}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-8 h-8 text-green-600" />
                  <div>
                    <h4 className="text-lg font-medium text-green-900">Connected</h4>
                    <p className="text-green-700">Calendar: {calendar.selectedCalendar}</p>
                  </div>
                </div>
                <Button
                  onClick={() => updateCalendar({ isConnected: false })}
                  variant="outline"
                  size="sm"
                >
                  Disconnect
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Read-only Calendar Option */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Don't want to go all in?</h3>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto mb-4">
            Very understandable! You can only give us option to read your calendar, and the AI will send the appointments he booked to your email. Then you will be able to just place them manually.
          </p>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            You can also give credentials of a calendar that isn't your production, and test things out to see if everything is for your liking.
          </p>
        </div>

        <div className="space-y-4">
          {/* Google Calendar Read-only */}
          <div className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Google Calendar (Read-only)</h4>
                  <p className="text-gray-600 text-sm">Read your calendar and send appointments to your email</p>
                </div>
              </div>
              
              <Button
                onClick={handleGoogleReadOnlyConnect}
                disabled={isConnecting}
                variant="outline"
                className="px-6 py-2 font-medium border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              >
                {isConnecting ? 'Connecting...' : 'Connect (Read-only)'}
              </Button>
            </div>
          </div>

          {/* Microsoft Calendar Read-only */}
          <div className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Microsoft Calendar (Read-only)</h4>
                  <p className="text-gray-600 text-sm">Read your calendar and send appointments to your email</p>
                </div>
              </div>
              
              <Button
                onClick={handleMicrosoftReadOnlyConnect}
                disabled={isConnecting}
                variant="outline"
                className="px-6 py-2 font-medium border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              >
                {isConnecting ? 'Connecting...' : 'Connect (Read-only)'}
              </Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default StepCalendar;
