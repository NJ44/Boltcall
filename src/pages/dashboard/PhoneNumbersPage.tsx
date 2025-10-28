import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PhoneCall, MoreHorizontal } from 'lucide-react';
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

const PhoneNumbersPage: React.FC = () => {
  const { user } = useAuth();
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSipModal, setShowSipModal] = useState(false);
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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading phone numbers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">


      {/* Phone Numbers Card Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
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
              {/* Checkbox */}
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              
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
          onAddNew={handleAddPhoneNumber}
          addNewText="Add Phone Number"
        />
      </motion.div>

      {/* SIP Configuration Modal */}
      {showSipModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Connect to your number via SIP trunking
            </h2>
            
            <form onSubmit={handleSipFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={sipFormData.phoneNumber}
                  onChange={handleSipFormChange}
                  placeholder="Enter phone number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Termination URI
                </label>
                <input
                  type="text"
                  name="terminationUri"
                  value={sipFormData.terminationUri}
                  onChange={handleSipFormChange}
                  placeholder="Enter termination URI (NOT Retell SIP server uri)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SIP Trunk User Name (Optional)
                </label>
                <input
                  type="text"
                  name="sipTrunkUsername"
                  value={sipFormData.sipTrunkUsername}
                  onChange={handleSipFormChange}
                  placeholder="Enter SIP Trunk User Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SIP Trunk Password (Optional)
                </label>
                <input
                  type="password"
                  name="sipTrunkPassword"
                  value={sipFormData.sipTrunkPassword}
                  onChange={handleSipFormChange}
                  placeholder="Enter SIP Trunk Password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nickname (Optional)
                </label>
                <input
                  type="text"
                  name="nickname"
                  value={sipFormData.nickname}
                  onChange={handleSipFormChange}
                  placeholder="Enter Nickname"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        </div>
      )}

    </div>
  );
};

export default PhoneNumbersPage;
