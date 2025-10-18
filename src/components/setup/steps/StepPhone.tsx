import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { useSetupStore } from '../../../stores/setupStore';
import Button from '../../ui/Button';

const StepPhone: React.FC = () => {
  const { phone, updatePhone } = useSetupStore();
  const [phoneNumber, setPhoneNumber] = useState(phone.newNumber.number || '');

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    updatePhone({
      newNumber: {
        ...phone.newNumber,
        number: value,
      },
    });
  };

  const handleContinue = () => {
    // Mark as completed and trigger next step
    window.dispatchEvent(new CustomEvent('phone-step-completed'));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <Phone className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Phone Number</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Enter your phone number for the AI receptionist.
        </p>
      </div>

      {/* Phone Number Input */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="+1 (555) 123-4567"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Continue Button */}
      <div className="text-center">
        <Button
          onClick={handleContinue}
          variant="primary"
          size="lg"
          disabled={!phoneNumber.trim()}
          className="mx-auto"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default StepPhone;