import React, { useState, useEffect } from 'react';
import { Phone, Search, Check, Loader2, MapPin, CheckCircle } from 'lucide-react';
import { useSetupStore } from '../../../stores/setupStore';
import { fetchAvailablePhoneNumbers, purchasePhoneNumber, formatPhoneNumber } from '../../../lib/twilio';
import type { TwilioPhoneNumber } from '../../../lib/twilio';
import Button from '../../ui/Button';
import StyledInput from '../../ui/StyledInput';

const StepPhone: React.FC = () => {
  const { businessProfile, phone, updatePhone } = useSetupStore();
  const [isLoading, setIsLoading] = useState(false);
  const [availableNumbers, setAvailableNumbers] = useState<TwilioPhoneNumber[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
  const [areaCode, setAreaCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [purchasedNumber, setPurchasedNumber] = useState<string | null>(null);

  // Fetch available numbers when component mounts or country changes
  useEffect(() => {
    if (businessProfile.country) {
      handleSearchNumbers();
    }
  }, [businessProfile.country]);

  const handleSearchNumbers = async () => {
    if (!businessProfile.country) {
      setError('Please select a country in the business profile step first');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const numbers = await fetchAvailablePhoneNumbers(
        businessProfile.country,
        areaCode || undefined
      );
      setAvailableNumbers(numbers);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch available phone numbers. Please try again.');
      console.error('Error fetching numbers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectNumber = (phoneNumber: string) => {
    setSelectedNumber(phoneNumber);
    // Update the store with the selected number
    updatePhone({
      newNumber: {
        ...phone.newNumber,
        country: businessProfile.country,
        number: phoneNumber,
      },
    });
  };

  const handlePurchaseNumber = async () => {
    if (!selectedNumber) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await purchasePhoneNumber(selectedNumber);
      
      if (result.success) {
        // Update store with purchased number
        updatePhone({
          useExistingNumber: false,
          newNumber: {
            ...phone.newNumber,
            country: businessProfile.country,
            number: selectedNumber,
          },
        });
        
        console.log('Phone number purchased successfully:', result.sid);
        
        // Show success state
        setPurchaseSuccess(true);
        setPurchasedNumber(selectedNumber);
        
        // Auto-progress to next step after 2 seconds
        setTimeout(() => {
          // This will be handled by the parent component to move to next step
          window.dispatchEvent(new CustomEvent('phone-purchased-success'));
        }, 2000);
        
      } else {
        setError(result.error || 'Failed to purchase phone number');
      }
    } catch (error) {
      setError('Failed to purchase phone number. Please try again.');
      console.error('Error purchasing number:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show success message if purchase was successful
  if (purchaseSuccess) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Phone Number Purchased!</h3>
          <p className="text-gray-600 mb-4">
            Your phone number <span className="font-semibold text-blue-600">
              {purchasedNumber ? formatPhoneNumber(purchasedNumber) : ''}
            </span> has been successfully purchased.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Moving to the next step automatically...
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <Phone className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Your Phone Number</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Choose a phone number for your AI receptionist. Numbers are available in {businessProfile.country || 'Health care'}.
        </p>
      </div>

      {/* Search Area Code */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search by Area Code (Optional)
          </label>
          <div className="flex gap-2">
            <StyledInput
              type="text"
              value={areaCode}
              onChange={(e) => setAreaCode(e.target.value)}
              placeholder="e.g., 212 for New York"
              className="flex-1"
            />
            <Button
              onClick={handleSearchNumbers}
              variant="outline"
              size="md"
              disabled={isLoading}
              className="px-4"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Available Numbers */}
      {availableNumbers.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900">Available Numbers</h4>
          <div className="grid gap-3">
            {availableNumbers.map((number) => (
              <div
                key={number.phoneNumber}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedNumber === number.phoneNumber
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSelectNumber(number.phoneNumber)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">
                        {formatPhoneNumber(number.phoneNumber)}
                      </span>
                      {selectedNumber === number.phoneNumber && (
                        <Check className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    {number.locality && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="w-3 h-3" />
                        {number.locality}, {number.region}
                      </div>
                    )}
                    <div className="flex gap-2 mt-2">
                      {number.capabilities.voice && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                          Voice
                        </span>
                      )}
                      {number.capabilities.sms && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          SMS
                        </span>
                      )}
                      {number.capabilities.mms && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                          MMS
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Purchase Button */}
      {selectedNumber && (
        <div className="text-center">
          <Button
            onClick={handlePurchaseNumber}
            variant="primary"
            size="lg"
            disabled={isLoading}
            className="mx-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Purchasing Number...
              </>
            ) : (
              `Purchase ${formatPhoneNumber(selectedNumber)}`
            )}
          </Button>
        </div>
      )}

      {/* No Numbers Message */}
      {!isLoading && availableNumbers.length === 0 && businessProfile.country && (
        <div className="text-center py-8">
          <p className="text-gray-500">No phone numbers available for the selected criteria.</p>
          <Button
            onClick={handleSearchNumbers}
            variant="outline"
            size="md"
            className="mt-4"
          >
            Search Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default StepPhone;
