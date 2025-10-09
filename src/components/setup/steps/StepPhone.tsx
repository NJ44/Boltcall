import React from 'react';
import { Phone } from 'lucide-react';
import Button from '../../ui/Button';

const StepPhone: React.FC = () => {
  const handleGetNumber = () => {
    // This will be handled when the user completes the setup
    console.log('Get a new number requested');
  };

  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <Phone className="w-8 h-8 text-blue-600" />
      </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Your Phone Number</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          We'll provision a dedicated phone number for your AI receptionist. You can customize it after setup.
        </p>
        
                      <Button
          onClick={handleGetNumber}
          variant="primary"
          size="lg"
          className="mx-auto"
        >
          Get a New Number
                      </Button>
      </div>
    </div>
  );
};

export default StepPhone;
