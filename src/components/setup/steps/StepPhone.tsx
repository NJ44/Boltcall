// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Phone, Check, Loader2, ShieldCheck, ShieldX } from 'lucide-react';
import { useSetupStore } from '../../../stores/setupStore';
import { getAvailablePhoneNumbers, type PhoneNumber } from '../../../lib/webhooks';
import { validatePhoneNumber, type PhoneValidationResult } from '../../../lib/cekura';
import { useToast } from '../../../contexts/ToastContext';

const StepPhone: React.FC = () => {
  const { phone, updatePhone, businessProfile } = useSetupStore();
  const { showToast } = useToast();
  const [availableNumbers, setAvailableNumbers] = useState<PhoneNumber[]>([]);
  const [isLoadingNumbers, setIsLoadingNumbers] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<PhoneValidationResult | null>(null);
  const selectedNumber = phone.selectedPhoneNumber || '';
  const purchasedNumber = phone.purchasedPhoneNumber || '';

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

  

  const handleNumberSelect = async (number: PhoneNumber) => {
    updatePhone({
      selectedPhoneNumber: number.phone_number,
      newNumber: {
        ...phone.newNumber,
        number: number.friendly_name,
      },
    });

    // Validate with Cekura
    setIsValidating(true);
    setValidationResult(null);
    try {
      const result = await validatePhoneNumber(number.phone_number);
      setValidationResult(result);
    } catch (error) {
      console.error('Phone validation error:', error);
      setValidationResult({ success: false, valid: false });
    } finally {
      setIsValidating(false);
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
                  <div className="flex items-center gap-2">
                    {selectedNumber === number.phone_number && isValidating && (
                      <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    )}
                    {selectedNumber === number.phone_number && validationResult && (
                      <div className="flex items-center gap-1.5">
                        {validationResult.valid ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
                            <ShieldX className="w-3.5 h-3.5" />
                            Invalid
                          </span>
                        )}
                      </div>
                    )}
                    {selectedNumber === number.phone_number && (
                      <Check className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                </div>
                {selectedNumber === number.phone_number && validationResult?.valid && (
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                    {validationResult.phone_type && (
                      <span className="capitalize">{validationResult.phone_type}</span>
                    )}
                    {validationResult.carrier && (
                      <span>• {validationResult.carrier}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Success Message */}
      {purchasedNumber && (
        <div className="text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center gap-2 text-green-800">
              <Check className="w-5 h-5" />
              <span className="font-medium">Phone number purchased successfully!</span>
            </div>
            <p className="text-green-700 mt-1">Number: {purchasedNumber}</p>
          </div>
        </div>
      )}

      {/* Manual input removed per request */}
    </div>
  );
};

export default StepPhone;