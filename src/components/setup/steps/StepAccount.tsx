import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Building, Globe, ArrowRight } from 'lucide-react';
import { useSetupStore } from '../../../stores/setupStore';
import Button from '../../ui/Button';

const StepAccount: React.FC = () => {
  const { account, updateAccount } = useSetupStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    if (!account.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!account.workEmail.trim()) {
      newErrors.workEmail = 'Email is required';
    } else if (!validateEmail(account.workEmail)) {
      newErrors.workEmail = 'Please enter a valid email address';
    }

    if (!account.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(account.password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!account.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        // TODO: Implement API call
        const response = await fetch('/api/setup/workspace', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: account.fullName,
            workEmail: account.workEmail,
            password: account.password,
            businessName: account.businessName,
            timezone: account.timezone,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          updateAccount({
            workspaceId: data.workspaceId,
            userId: data.userId,
          });
        }
      } catch (error) {
        console.error('Error creating workspace:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

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

  return (
    <div className="space-y-8">
      {/* Account Information */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={account.fullName}
                  onChange={(e) => updateAccount({ fullName: e.target.value })}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 ${
                    errors.fullName ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-brand-blue'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={account.workEmail}
                  onChange={(e) => updateAccount({ workEmail: e.target.value })}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 ${
                    errors.workEmail ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-brand-blue'
                  }`}
                  placeholder="john@company.com"
                />
              </div>
              {errors.workEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.workEmail}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={account.password}
                onChange={(e) => updateAccount({ password: e.target.value })}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 ${
                  errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-brand-blue'
                }`}
                placeholder="Minimum 8 characters"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>
        </div>
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

      {/* Alternative Authentication */}
      <div className="space-y-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <Button
          onClick={handleGoogleAuth}
          disabled={isLoading}
          variant="outline"
          className="w-full flex items-center justify-center space-x-2 py-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Continue with Google</span>
        </Button>
      </div>

      {/* Magic Link Option */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900">Prefer passwordless login?</h4>
            <p className="text-sm text-blue-700 mt-1">
              You can skip the password and use magic link authentication instead.
            </p>
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-2 flex items-center space-x-1"
            >
              <span>Set up magic link authentication</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepAccount;

