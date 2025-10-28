import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneNumbersSkeleton } from '../../components/ui/loading-skeleton';
import { PhoneCall, MoreHorizontal, ChevronDown, Plus, Phone, Settings } from 'lucide-react';
import CardTableWithPanel from '../../components/ui/CardTableWithPanel';
import { Magnetic } from '../../components/ui/magnetic';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface PhoneNumber {
  id: string;
  number: string;
  location: string;
  status: string;
  type: string;
  assignedTo: string;
  createdAt: string;
}

interface TwilioPhoneNumber {
  phoneNumber: string;
  friendlyName: string;
  locality: string;
  region: string;
  country: string;
  price: string;
}

const PhoneNumbersPage: React.FC = () => {
  const { user } = useAuth();
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSipModal, setShowSipModal] = useState(false);
  const [showTwilioModal, setShowTwilioModal] = useState(false);
  const [twilioNumbers, setTwilioNumbers] = useState<TwilioPhoneNumber[]>([]);
  const [loadingTwilioNumbers, setLoadingTwilioNumbers] = useState(false);
  const [sipFormData, setSipFormData] = useState({
    phoneNumber: '',
    terminationUri: '',
    sipTrunkUsername: '',
    sipTrunkPassword: '',
    nickname: ''
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch phone numbers from Supabase
  useEffect(() => {
    const fetchPhoneNumbers = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('phone_numbers')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching phone numbers:', error);
          return;
        }

        // Transform Supabase data to PhoneNumber interface
        const transformedNumbers: PhoneNumber[] = (data || []).map((phone: any) => ({
          id: phone.id,
          number: phone.phone_number || '',
          location: phone.location || 'N/A',
          status: phone.status || 'inactive',
          type: phone.phone_type || 'main',
          assignedTo: phone.assigned_agent_name || 'Not assigned',
          createdAt: phone.created_at 
            ? new Date(phone.created_at).toLocaleDateString()
            : new Date().toLocaleDateString()
        }));

        setPhoneNumbers(transformedNumbers);
      } catch (error) {
        console.error('Error fetching phone numbers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhoneNumbers();
  }, [user?.id]);

  const handleAddPhoneNumber = () => {
    setShowDropdown(!showDropdown);
  };

  const handleBuyNewNumber = async () => {
    setShowDropdown(false);
    setLoadingTwilioNumbers(true);
    setShowTwilioModal(true);
    
    // Mock Twilio numbers - replace with actual Twilio API call
    setTimeout(() => {
      const mockTwilioNumbers: TwilioPhoneNumber[] = [
        {
          phoneNumber: '+1 (555) 123-4567',
          friendlyName: 'US Local Number',
          locality: 'New York',
          region: 'NY',
          country: 'US',
          price: '$1.00/month'
        },
        {
          phoneNumber: '+1 (555) 234-5678',
          friendlyName: 'US Local Number',
          locality: 'Los Angeles',
          region: 'CA',
          country: 'US',
          price: '$1.00/month'
        },
        {
          phoneNumber: '+1 (555) 345-6789',
          friendlyName: 'US Local Number',
          locality: 'Chicago',
          region: 'IL',
          country: 'US',
          price: '$1.00/month'
        },
        {
          phoneNumber: '+1 (555) 456-7890',
          friendlyName: 'US Toll-Free',
          locality: 'Toll-Free',
          region: 'US',
          country: 'US',
          price: '$2.00/month'
        },
        {
          phoneNumber: '+1 (555) 567-8901',
          friendlyName: 'US Local Number',
          locality: 'Miami',
          region: 'FL',
          country: 'US',
          price: '$1.00/month'
        }
      ];
      setTwilioNumbers(mockTwilioNumbers);
      setLoadingTwilioNumbers(false);
    }, 1500);
  };

  const handleConnectSip = () => {
    setShowDropdown(false);
    setShowSipModal(true);
  };

  const handlePurchaseNumber = (number: TwilioPhoneNumber) => {
    console.log('Purchasing number:', number);
    // Implementation for purchasing the number via Twilio
    setShowTwilioModal(false);
  };

  const handleSipFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSipFormData({
      ...sipFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleSipFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('SIP configuration:', sipFormData);
    setShowSipModal(false);
    // Implementation for saving SIP configuration
  };

  const handleSipFormCancel = () => {
    setShowSipModal(false);
    setSipFormData({
      phoneNumber: '',
      terminationUri: '',
      sipTrunkUsername: '',
      sipTrunkPassword: '',
      nickname: ''
    });
  };

  if (isLoading) {
    return <PhoneNumbersSkeleton />;
  }

  return (
    <div className="space-y-6">


      {/* Phone Numbers Card Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Custom Header with Dropdown */}
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                {/* Search Input */}
                <div className="relative flex-1 max-w-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search phone numbers..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Add Phone Number Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={handleAddPhoneNumber}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="font-bold">Add Phone Number</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                      >
                        <div className="py-1">
                          <button
                            onClick={handleBuyNewNumber}
                            className="w-full px-2 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Phone className="w-3 h-3 text-blue-600 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-medium text-gray-900 truncate">Buy new number</div>
                              <div className="text-xs text-gray-500 truncate">Purchase from Twilio</div>
                            </div>
                          </button>
                          <button
                            onClick={handleConnectSip}
                            className="w-full px-2 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Settings className="w-3 h-3 text-green-600 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-medium text-gray-900 truncate">Connect via SIP</div>
                              <div className="text-xs text-gray-500 truncate">Use existing number</div>
                            </div>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          <CardTableWithPanel
            columns={[
              { key: 'number', label: 'Phone Number', width: '30%' },
              { key: 'location', label: 'Location', width: '25%' },
              { key: 'assignedTo', label: 'Assigned To', width: '25%' },
              { key: 'status', label: 'Status', width: '10%' },
              { key: 'createdAt', label: 'Created', width: '10%' }
            ]}
            data={phoneNumbers}
            renderRow={(phone) => (
            <div className="flex items-center gap-6">
              {/* Phone Number */}
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <PhoneCall className="w-4 h-4 text-green-600" />
                </div>
                <div className="font-medium text-gray-900">{phone.number}</div>
              </div>
              
              {/* Location */}
              <div className="text-sm text-gray-900 flex-1">
                {phone.location}
              </div>
              
              {/* Assigned To */}
              <div className="text-sm text-gray-900 flex-1">
                {phone.assignedTo}
              </div>
              
              {/* Status */}
              <div className="flex-1">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  phone.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {phone.status}
                </span>
              </div>
              
              {/* Created Date */}
              <div className="text-sm text-gray-500 flex-1">
                {phone.createdAt}
              </div>
              
              {/* Action Icons */}
              <div className="flex items-center gap-2">
                <button className="text-gray-600 hover:text-gray-800">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          emptyStateText="No phone numbers found. Add your first phone number to get started."
          searchPlaceholder="Search phone numbers..."
          filterOptions={[
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' }
          ]}
        />
        </div>
      </motion.div>

      {/* Twilio Numbers Modal */}
      <AnimatePresence>
        {showTwilioModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowTwilioModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Buy a New Phone Number</h2>
                  <button
                    onClick={() => setShowTwilioModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {loadingTwilioNumbers ? (
                  <div className="py-6">
                    <PhoneNumbersSkeleton />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-gray-600 mb-4">
                      Choose from available phone numbers. All numbers include unlimited inbound calls and SMS.
                    </p>
                    
                    {twilioNumbers.map((number, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Phone className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{number.phoneNumber}</div>
                              <div className="text-sm text-gray-600">
                                {number.locality}, {number.region} • {number.friendlyName}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">{number.price}</div>
                            <button
                              onClick={() => handlePurchaseNumber(number)}
                              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                              Purchase
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm text-gray-600">
                          <p className="font-medium text-gray-900 mb-1">Important:</p>
                          <ul className="space-y-1 list-disc list-inside">
                            <li>Numbers are billed monthly to your Twilio account</li>
                            <li>Setup typically takes 1-2 minutes</li>
                            <li>You can release numbers anytime from your dashboard</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIP Configuration Modal */}
      <AnimatePresence>
        {showSipModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowSipModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Connect to your number via SIP trunking
            </h2>
            
            <form onSubmit={handleSipFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={sipFormData.phoneNumber}
                  onChange={handleSipFormChange}
                  placeholder="Enter phone number"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Termination URI
                </label>
                <input
                  type="text"
                  name="terminationUri"
                  value={sipFormData.terminationUri}
                  onChange={handleSipFormChange}
                  placeholder="Enter termination URI (NOT Retell SIP server uri)"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  SIP Trunk User Name (Optional)
                </label>
                <input
                  type="text"
                  name="sipTrunkUsername"
                  value={sipFormData.sipTrunkUsername}
                  onChange={handleSipFormChange}
                  placeholder="Enter SIP Trunk User Name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  SIP Trunk Password (Optional)
                </label>
                <input
                  type="password"
                  name="sipTrunkPassword"
                  value={sipFormData.sipTrunkPassword}
                  onChange={handleSipFormChange}
                  placeholder="Enter SIP Trunk Password"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nickname (Optional)
                </label>
                <input
                  type="text"
                  name="nickname"
                  value={sipFormData.nickname}
                  onChange={handleSipFormChange}
                  placeholder="Enter Nickname"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Configuration can take up to 48 hours
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleSipFormCancel}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <Magnetic>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>
                </Magnetic>
              </div>
            </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default PhoneNumbersPage;
