import React, { useState } from 'react';
import { User, Mail, Lock, Building, Globe, ArrowRight, LogIn } from 'lucide-react';
import { useSetupStore } from '../../../stores/setupStore';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../ui/Button';
import { useNavigate } from 'react-router-dom';

const StepAccount: React.FC = () => {
  const { account, updateAccount } = useSetupStore();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors] = useState<Record<string, string>>({});


  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement Google OAuth
      console.log('Google authentication...');
    } catch (error) {
      console.error('Google auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const timezoneOptions = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Australia/Sydney',
  ];

  // If user is not authenticated, show login button
  if (!isAuthenticated) {
  return (
    <div className="space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-brand-sky rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Boltcall Setup
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            To continue with your AI receptionist setup, please log in to your account first.
          </p>

          <Button
            onClick={() => navigate('/login')}
            variant="primary"
            className="px-8 py-3 text-lg font-semibold"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Go to Login
          </Button>
            </div>
          </div>
    );
  }

  // If user is authenticated, show business information setup
  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <User className="w-8 h-8 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h2>
        <p className="text-gray-600 mb-8">
          Let's complete your AI receptionist setup with your business information.
        </p>
      </div>

      {/* Business Information */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Business Information</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={account.businessName}
                  onChange={(e) => updateAccount({ businessName: e.target.value })}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 ${
                    errors.businessName ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-brand-blue'
                  }`}
                  placeholder="Acme Dental Practice"
                />
              </div>
              {errors.businessName && (
                <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={account.timezone}
                  onChange={(e) => updateAccount({ timezone: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue appearance-none bg-white"
                >
                  {timezoneOptions.map(tz => (
                    <option key={tz} value={tz}>
                      {tz.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                This will be used for scheduling and business hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepAccount;

