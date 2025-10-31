import React, { useState, useEffect } from 'react';
import { Phone, Check } from 'lucide-react';
import { useSetupStore } from '../../../stores/setupStore';
import Button from '../../ui/Button';
import { getAvailablePhoneNumbers, purchasePhoneNumber, type PhoneNumber } from '../../../lib/webhooks';
import { useToast } from '../../../contexts/ToastContext';

const StepPhone: React.FC = () => {
  const { phone, updatePhone, businessProfile } = useSetupStore();
  const { showToast } = useToast();
  const [availableNumbers, setAvailableNumbers] = useState<PhoneNumber[]>([]);
  const [isLoadingNumbers, setIsLoadingNumbers] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<string>('');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchasedNumber, setPurchasedNumber] = useState<string>('');

  // Load available phone numbers when component mounts
  useEffect(() => {
    loadAvailableNumbers();
  }, []);

  const loadAvailableNumbers = async () => {
    setIsLoadingNumbers(true);
    try {
      const country = (businessProfile.country || '').toUpperCase();
      const numbers = await getAvailablePhoneNumbers(country || undefined);
      setAvailableNumbers(numbers);
    } catch (error) {
      console.error('Error loading phone numbers:', error);
      showToast({
        title: 'Error',
        message: 'Failed to load available phone numbers. Please try again.',
        variant: 'error',
        duration: 5000
      });
    } finally {
      setIsLoadingNumbers(false);
    }
  };

  

  const handleNumberSelect = (number: PhoneNumber) => {
    setSelectedNumber(number.phone_number);
    updatePhone({
      newNumber: {
        ...phone.newNumber,
        number: number.friendly_name,
      },
    });
  };

  const handleContinue = async () => {
    if (!selectedNumber && !purchasedNumber) {
      showToast({
        title: 'Selection Required',
        message: 'Please select a phone number first.',
        variant: 'warning',
        duration: 4000
      });
      return;
    }

    // If number is not yet purchased, purchase it first
    if (!purchasedNumber && selectedNumber) {
      setIsPurchasing(true);
      try {
        const result = await purchasePhoneNumber(selectedNumber);
        if (result.success) {
          setPurchasedNumber(selectedNumber);
          showToast({
            title: 'Success',
            message: 'Phone number purchased successfully!',
            variant: 'success',
            duration: 3000
          });
          // Trigger next step after successful purchase
          window.dispatchEvent(new CustomEvent('phone-step-completed'));
        } else {
          showToast({
            title: 'Purchase Failed',
            message: result.message || 'Failed to purchase phone number. Please try again.',
            variant: 'error',
            duration: 5000
          });
        }
      } catch (error) {
        console.error('Error purchasing phone number:', error);
        showToast({
          title: 'Error',
          message: 'Failed to purchase phone number. Please try again.',
          variant: 'error',
          duration: 5000
        });
      } finally {
        setIsPurchasing(false);
      }
    } else {
      // Number already purchased, just continue
      window.dispatchEvent(new CustomEvent('phone-step-completed'));
    }
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
          Choose a phone number for your AI receptionist.
        </p>
      </div>

      {/* Available Phone Numbers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-medium text-gray-900">Available Phone Numbers</h4>
        </div>

        {isLoadingNumbers ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading available phone numbers...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {availableNumbers.map((number, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedNumber === number.phone_number
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleNumberSelect(number)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{number.friendly_name}</p>
                    <p className="text-sm text-gray-500">{number.phone_number}</p>
                    <p className="text-xs text-gray-400">{number.region} • {number.rate_center}</p>
                  </div>
                  {selectedNumber === number.phone_number && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Continue Button */}
      <div className="text-center">
        {purchasedNumber && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center gap-2 text-green-800">
              <Check className="w-5 h-5" />
              <span className="font-medium">Phone number purchased successfully!</span>
            </div>
            <p className="text-green-700 mt-1">Number: {purchasedNumber}</p>
          </div>
        )}
        <Button
          onClick={handleContinue}
          disabled={isPurchasing}
          variant="primary"
          size="lg"
          className="mx-auto"
        >
          {isPurchasing ? 'Purchasing...' : 'Continue'}
        </Button>
      </div>

      {/* Manual input removed per request */}
    </div>
  );
};

export default StepPhone;