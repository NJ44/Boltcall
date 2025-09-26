import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, ArrowRight, Clock, Volume2, Voicemail, Calendar, Info } from 'lucide-react';
import { useSetupStore } from '../../../stores/setupStore';
import Button from '../../ui/Button';

const StepPhone: React.FC = () => {
  const { phone, updatePhone } = useSetupStore();
  const [isSearching, setIsSearching] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const mockNumbers = [
    { number: '+1 (555) 123-4567', location: 'New York, NY' },
    { number: '+1 (555) 234-5678', location: 'Los Angeles, CA' },
    { number: '+1 (555) 345-6789', location: 'Chicago, IL' },
    { number: '+1 (555) 456-7890', location: 'Houston, TX' },
  ];

  const carriers = [
    { name: 'Verizon', instructions: 'Call *72 + your new number' },
    { name: 'AT&T', instructions: 'Call *72 + your new number' },
    { name: 'T-Mobile', instructions: 'Call *72 + your new number' },
    { name: 'Sprint', instructions: 'Call *72 + your new number' },
  ];

  const handleSearchNumbers = async () => {
    setIsSearching(true);
    try {
      // TODO: Implement number search API
      console.log('Searching for numbers...');
      setTimeout(() => setIsSearching(false), 2000);
    } catch (error) {
      console.error('Error searching numbers:', error);
      setIsSearching(false);
    }
  };

  const handleTestCall = async () => {
    setIsTesting(true);
    try {
      // TODO: Implement test call API
      await fetch('/api/voice/testcall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: 'test',
          toNumber: phone.useExistingNumber ? phone.existingNumber : phone.newNumber.number,
        }),
      });
      console.log('Test call initiated');
    } catch (error) {
      console.error('Error placing test call:', error);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Phone Number Setup */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Phone Number Setup</h3>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="phoneOption"
                  checked={phone.useExistingNumber}
                  onChange={() => updatePhone({ useExistingNumber: true })}
                  className="text-brand-blue focus:ring-brand-blue"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Use existing number</span>
                  <p className="text-sm text-gray-500">Forward calls from your current business number</p>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="phoneOption"
                  checked={!phone.useExistingNumber}
                  onChange={() => updatePhone({ useExistingNumber: false })}
                  className="text-brand-blue focus:ring-brand-blue"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Buy a new number</span>
                  <p className="text-sm text-gray-500">Get a dedicated number for your AI receptionist</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Existing Number Setup */}
      {phone.useExistingNumber && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Existing Number Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Business Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={phone.existingNumber}
                    onChange={(e) => updatePhone({ existingNumber: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Forwarding Instructions
                </label>
                <textarea
                  value={phone.forwardingInstructions}
                  onChange={(e) => updatePhone({ forwardingInstructions: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                  rows={4}
                  placeholder="Instructions for setting up call forwarding..."
                />
              </div>

              {/* Carrier Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-3">Quick Setup by Carrier</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {carriers.map((carrier, index) => (
                    <div key={index} className="bg-white rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-900">{carrier.name}</p>
                      <p className="text-xs text-gray-600 mt-1">{carrier.instructions}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Number Setup */}
      {!phone.useExistingNumber && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">New Number Configuration</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    value={phone.newNumber.country}
                    onChange={(e) => updatePhone({ 
                      newNumber: { ...phone.newNumber, country: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area Code
                  </label>
                  <input
                    type="text"
                    value={phone.newNumber.areaCode}
                    onChange={(e) => updatePhone({ 
                      newNumber: { ...phone.newNumber, areaCode: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                    placeholder="555"
                    maxLength={3}
                  />
                </div>
              </div>

              <Button
                onClick={handleSearchNumbers}
                disabled={isSearching}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Phone className="w-4 h-4" />
                <span>{isSearching ? 'Searching...' : 'Search Available Numbers'}</span>
              </Button>

              {/* Mock Available Numbers */}
              {isSearching && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">Available Numbers</h4>
                  {mockNumbers.map((number, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{number.number}</p>
                        <p className="text-sm text-gray-500">{number.location}</p>
                      </div>
                      <Button
                        onClick={() => updatePhone({ 
                          newNumber: { ...phone.newNumber, number: number.number }
                        })}
                        variant="outline"
                        size="sm"
                      >
                        Select
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Call Routing Configuration */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Call Routing</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Hours Numbers
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={phone.routing.businessHoursNumbers.join(', ')}
                  onChange={(e) => updatePhone({
                    routing: {
                      ...phone.routing,
                      businessHoursNumbers: e.target.value.split(',').map(n => n.trim()).filter(Boolean)
                    }
                  })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                  placeholder="+1 (555) 123-4567, +1 (555) 987-6543"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Numbers to ring during business hours (separate with commas)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                After Hours Action
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="afterHours"
                    checked={phone.routing.afterHoursAction === 'transfer'}
                    onChange={() => updatePhone({
                      routing: { ...phone.routing, afterHoursAction: 'transfer' }
                    })}
                    className="text-brand-blue focus:ring-brand-blue"
                  />
                  <div className="flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">Transfer to number</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="afterHours"
                    checked={phone.routing.afterHoursAction === 'voicemail'}
                    onChange={() => updatePhone({
                      routing: { ...phone.routing, afterHoursAction: 'voicemail' }
                    })}
                    className="text-brand-blue focus:ring-brand-blue"
                  />
                  <div className="flex items-center space-x-2">
                    <Voicemail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">Take voicemail</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="afterHours"
                    checked={phone.routing.afterHoursAction === 'book'}
                    onChange={() => updatePhone({
                      routing: { ...phone.routing, afterHoursAction: 'book' }
                    })}
                    className="text-brand-blue focus:ring-brand-blue"
                  />
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">Allow AI to book appointments</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ring Strategy
                </label>
                <select
                  value={phone.routing.ringStrategy}
                  onChange={(e) => updatePhone({
                    routing: { 
                      ...phone.routing, 
                      ringStrategy: e.target.value as 'sequential' | 'all'
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                >
                  <option value="sequential">Sequential (one at a time)</option>
                  <option value="all">All at once</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Ring Time (seconds)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={phone.routing.maxRingTime}
                    onChange={(e) => updatePhone({
                      routing: { 
                        ...phone.routing, 
                        maxRingTime: parseInt(e.target.value) || 30
                      }
                    })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                    min="5"
                    max="300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Call */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Test Your Setup</h3>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Phone className="w-6 h-6 text-green-600" />
              <div>
                <h4 className="text-sm font-medium text-green-900">Test Call</h4>
                <p className="text-green-700 text-sm">
                  Place a test call to verify your phone setup is working correctly
                </p>
              </div>
            </div>
            
            <Button
              onClick={handleTestCall}
              disabled={isTesting}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Phone className="w-4 h-4" />
              <span>{isTesting ? 'Placing test call...' : 'Place Test Call'}</span>
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default StepPhone;
