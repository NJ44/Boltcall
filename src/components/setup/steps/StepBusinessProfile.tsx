import React, { useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { useSetupStore } from '../../../stores/setupStore';
import StyledInput from '../../ui/StyledInput';

const StepBusinessProfile: React.FC = () => {
  const { businessProfile, updateBusinessProfile } = useSetupStore();
  const [errors] = useState<Record<string, string>>({});

  const categories = [
    { value: 'dentist', label: 'Dentist' },
    { value: 'medspa', label: 'Med Spa' },
    { value: 'plumber', label: 'Plumber' },
    { value: 'hvac', label: 'HVAC' },
    { value: 'legal', label: 'Legal' },
    { value: 'salon', label: 'Salon' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'retail', label: 'Retail' },
    { value: 'other', label: 'Other' },
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'he', label: 'Hebrew' },
    { value: 'ar', label: 'Arabic' },
    { value: 'zh', label: 'Chinese' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ko', label: 'Korean' },
  ];




  const countries = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'es', label: 'Spain' },
    { value: 'it', label: 'Italy' },
    { value: 'nl', label: 'Netherlands' },
    { value: 'be', label: 'Belgium' },
    { value: 'ch', label: 'Switzerland' },
    { value: 'at', label: 'Austria' },
    { value: 'se', label: 'Sweden' },
    { value: 'no', label: 'Norway' },
    { value: 'dk', label: 'Denmark' },
    { value: 'fi', label: 'Finland' },
    { value: 'ie', label: 'Ireland' },
    { value: 'nz', label: 'New Zealand' },
    { value: 'sg', label: 'Singapore' },
    { value: 'jp', label: 'Japan' },
    { value: 'kr', label: 'South Korea' },
    { value: 'in', label: 'India' },
    { value: 'mx', label: 'Mexico' },
    { value: 'br', label: 'Brazil' },
    { value: 'ar', label: 'Argentina' },
    { value: 'cl', label: 'Chile' },
    { value: 'za', label: 'South Africa' },
    { value: 'il', label: 'Israel' },
    { value: 'ae', label: 'United Arab Emirates' },
  ];

  return (
    <div className="space-y-8">
      {/* Business Name */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Business Name</h3>
          
          <div className="space-y-4">
            <div>
              <StyledInput
                type="text"
                value={businessProfile.businessName || ''}
                onChange={(e) => updateBusinessProfile({ businessName: e.target.value })}
                placeholder="Enter your business name"
                name="businessName"
              />
              {errors.businessName && (
                <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Business Category */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Business Category</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Category *
            </label>
            <div className="relative">
              <ArrowDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={businessProfile.mainCategory}
                onChange={(e) => updateBusinessProfile({ mainCategory: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 appearance-none bg-white text-gray-900 ${
                  errors.mainCategory ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-brand-blue'
                }`}
              >
                <option value="" className="text-gray-900">Select your business category</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value} className="text-gray-900">
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.mainCategory && (
              <p className="mt-1 text-sm text-red-600">{errors.mainCategory}</p>
            )}
          </div>
        </div>
      </div>

      {/* Country Selection */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Country</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select your country *
            </label>
            <div className="relative">
              <ArrowDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={businessProfile.country || ''}
                onChange={(e) => updateBusinessProfile({ country: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 appearance-none bg-white text-gray-900 ${
                  errors.country ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-brand-blue'
                }`}
              >
                <option value="" className="text-gray-900">Select your country</option>
                {countries.map(country => (
                  <option key={country.value} value={country.value} className="text-gray-900">
                    {country.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.country && (
              <p className="mt-1 text-sm text-red-600">{errors.country}</p>
            )}
          </div>
        </div>
      </div>

      {/* Primary Location */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Primary Location</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
              <StyledInput
                type="text"
                value={businessProfile.addressLine1 || ''}
                onChange={(e) => updateBusinessProfile({ addressLine1: e.target.value })}
                placeholder="Street address"
                name="addressLine1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <StyledInput
                type="text"
                value={businessProfile.city || ''}
                onChange={(e) => updateBusinessProfile({ city: e.target.value })}
                placeholder="City"
                name="city"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
              <StyledInput
                type="text"
                value={businessProfile.state || ''}
                onChange={(e) => updateBusinessProfile({ state: e.target.value })}
                placeholder="State or province"
                name="state"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
              <StyledInput
                type="text"
                value={businessProfile.postalCode || ''}
                onChange={(e) => updateBusinessProfile({ postalCode: e.target.value })}
                placeholder="ZIP / Postal code"
                name="postalCode"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Language */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Language</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select language your AI can speak
            </label>
            <div className="relative">
              <ArrowDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={businessProfile.languages || 'en'}
                onChange={(e) => updateBusinessProfile({ languages: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 appearance-none bg-white text-gray-900 border-gray-300 focus:border-brand-blue"
              >
                {languageOptions.map(lang => (
                  <option key={lang.value} value={lang.value} className="text-gray-900">
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default StepBusinessProfile;
