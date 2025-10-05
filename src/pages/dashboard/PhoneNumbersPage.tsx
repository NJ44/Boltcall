import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Plus, PhoneCall, Settings, Trash2 } from 'lucide-react';

const PhoneNumbersPage: React.FC = () => {
  // Mock data - in real app this would come from API
  const phoneNumbers: any[] = []; // Empty array to show the "no phone numbers" state

  const handleAddPhoneNumber = () => {
    console.log('Adding new phone number...');
    // Implementation for adding phone number
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Phone Numbers</h1>
        </div>
      </motion.div>

      {phoneNumbers.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="p-12 text-center"
        >
          <div className="max-w-md mx-auto">
            {/* Icon */}
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Phone className="w-8 h-8 text-blue-600" />
            </div>
            
            {/* Title and Description */}
            <h2 className="text-xl font-semibold text-gray-900 mb-3">No Phone Numbers Yet</h2>
            <p className="text-gray-600 mb-8">
              Get started by adding your first phone number. Your AI receptionist will handle calls 
              professionally and route them to the right person or department.
            </p>
            
            {/* Add Button */}
            <button
              onClick={handleAddPhoneNumber}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Add Phone Number
            </button>
          </div>
        </motion.div>
      ) : (
        /* Phone Numbers List */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Active Phone Numbers</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {phoneNumbers.map((phone, index) => (
              <div key={index} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <PhoneCall className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{phone.number}</div>
                    <div className="text-sm text-gray-500">{phone.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

    </div>
  );
};

export default PhoneNumbersPage;
