import React, { useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { useSetupStore } from '../../../stores/setupStore';
import MultiSelect from '../forms/MultiSelect';
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

      {/* Languages */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Languages</h3>
          
          <div>
            <MultiSelect
              options={languageOptions}
              value={businessProfile.languages}
              onChange={(languages) => updateBusinessProfile({ languages })}
              placeholder="Select languages your AI can speak"
              label="Supported Languages"
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default StepBusinessProfile;
