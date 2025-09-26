import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Plus, Trash2, TestTube } from 'lucide-react';
import { useSetupStore } from '../../../stores/setupStore';
import Button from '../../ui/Button';

const StepCalendar: React.FC = () => {
  const { calendar, updateCalendar } = useSetupStore();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleGoogleConnect = async () => {
    setIsConnecting(true);
    try {
      // TODO: Implement Google OAuth
      console.log('Connecting to Google Calendar...');
      
      // Mock connection
      setTimeout(() => {
        updateCalendar({
          isConnected: true,
          selectedCalendar: 'Google Calendar',
          calendarConnected: 'google',
        });
        setIsConnecting(false);
      }, 2000);
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error);
      setIsConnecting(false);
    }
  };

  const handleMicrosoftConnect = async () => {
    setIsConnecting(true);
    try {
      // TODO: Implement Microsoft OAuth
      console.log('Connecting to Microsoft Calendar...');
      
      // Mock connection
      setTimeout(() => {
        updateCalendar({
          isConnected: true,
          selectedCalendar: 'Microsoft Calendar',
          calendarConnected: 'microsoft',
        });
        setIsConnecting(false);
      }, 2000);
    } catch (error) {
      console.error('Error connecting to Microsoft Calendar:', error);
      setIsConnecting(false);
    }
  };

  const handleAddAppointmentType = () => {
    const newType = {
      name: '',
      duration: 60,
      buffer: 15,
      minNotice: 24,
    };
    
    updateCalendar({
      appointmentTypes: [...calendar.appointmentTypes, newType],
    });
  };

  const handleUpdateAppointmentType = (index: number, field: string, value: string | number) => {
    const updated = [...calendar.appointmentTypes];
    updated[index] = { ...updated[index], [field]: value };
    updateCalendar({ appointmentTypes: updated });
  };

  const handleRemoveAppointmentType = (index: number) => {
    const updated = calendar.appointmentTypes.filter((_, i) => i !== index);
    updateCalendar({ appointmentTypes: updated });
  };

  const handleTestEvent = async () => {
    setIsTesting(true);
    try {
      // TODO: Implement test event creation
      await fetch('/api/setup/calendar/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId: 'test' }),
      });
      
      // Show success message
      console.log('Test event created successfully');
    } catch (error) {
      console.error('Error creating test event:', error);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Calendar Connections */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Connect Your Calendar</h3>
          
          {!calendar.isConnected ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Calendar className="w-8 h-8 text-blue-600" />
                  <div>
                    <h4 className="text-lg font-medium text-blue-900">Google Calendar</h4>
                    <p className="text-blue-700">Connect your Google Calendar to enable appointment booking</p>
                  </div>
                </div>
                
                <Button
                  onClick={handleGoogleConnect}
                  disabled={isConnecting}
                  variant="primary"
                  className="flex items-center space-x-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{isConnecting ? 'Connecting...' : 'Connect Google Calendar'}</span>
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Calendar className="w-8 h-8 text-blue-600" />
                  <div>
                    <h4 className="text-lg font-medium text-blue-900">Microsoft Calendar</h4>
                    <p className="text-blue-700">Connect your Microsoft Calendar to enable appointment booking</p>
                  </div>
                </div>
                
                <Button
                  onClick={handleMicrosoftConnect}
                  disabled={isConnecting}
                  variant="primary"
                  className="flex items-center space-x-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{isConnecting ? 'Connecting...' : 'Connect Microsoft Calendar'}</span>
                </Button>
              </div>

              {/* Optional note */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-900">Optional</h4>
                    <p className="text-yellow-700 text-sm mt-1">
                      You can connect your calendar now or skip this step and add it later in your dashboard settings.
                    </p>
                  </div>
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

      {/* Appointment Types */}
      {calendar.isConnected && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Appointment Types</h3>
            
            <div className="space-y-4">
              {calendar.appointmentTypes.map((type, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service Name
                      </label>
                      <input
                        type="text"
                        value={type.name}
                        onChange={(e) => handleUpdateAppointmentType(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                        placeholder="e.g., Consultation"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (min)
                      </label>
                      <input
                        type="number"
                        value={type.duration}
                        onChange={(e) => handleUpdateAppointmentType(index, 'duration', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Buffer (min)
                      </label>
                      <input
                        type="number"
                        value={type.buffer}
                        onChange={(e) => handleUpdateAppointmentType(index, 'buffer', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                        min="0"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Min Notice (hrs)
                        </label>
                        <input
                          type="number"
                          value={type.minNotice}
                          onChange={(e) => handleUpdateAppointmentType(index, 'minNotice', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                          min="0"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveAppointmentType(index)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              <Button
                onClick={handleAddAppointmentType}
                variant="outline"
                className="w-full flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Appointment Type</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Test Calendar */}
      {calendar.isConnected && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Test Your Calendar</h3>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <TestTube className="w-6 h-6 text-yellow-600" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-900">Test Integration</h4>
                  <p className="text-yellow-700 text-sm">
                    Create a test appointment to verify your calendar is working correctly
                  </p>
                </div>
              </div>
              
              <Button
                onClick={handleTestEvent}
                disabled={isTesting}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <TestTube className="w-4 h-4" />
                <span>{isTesting ? 'Creating test event...' : 'Create Test Event'}</span>
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StepCalendar;
