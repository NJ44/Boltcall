import React, { useState } from 'react';
import { Globe, MapPin, ArrowDown } from 'lucide-react';
import { useSetupStore } from '../../../stores/setupStore';
import MultiSelect from '../forms/MultiSelect';
import HoursEditor from '../forms/HoursEditor';

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




  return (
    <div className="space-y-8">
      {/* Website Information */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Website Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL (Optional)
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  value={businessProfile.websiteUrl}
                  onChange={(e) => updateBusinessProfile({ websiteUrl: e.target.value })}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 ${
                    errors.websiteUrl ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-brand-blue'
                  }`}
                  placeholder="https://www.yourbusiness.com"
                />
              </div>
              {errors.websiteUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.websiteUrl}</p>
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
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 appearance-none bg-white ${
                  errors.mainCategory ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-brand-blue'
                }`}
              >
                <option value="">Select your business category</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
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

      {/* Service Areas */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Service Areas</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Areas you serve *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <textarea
                value={businessProfile.serviceAreas.join(', ')}
                onChange={(e) => {
                  const areas = e.target.value.split(',').map(area => area.trim()).filter(Boolean);
                  updateBusinessProfile({ serviceAreas: areas });
                }}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 ${
                  errors.serviceAreas ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-brand-blue'
                }`}
                rows={3}
                placeholder="New York, NY, Brooklyn, Queens, Manhattan..."
              />
            </div>
            {errors.serviceAreas && (
              <p className="mt-1 text-sm text-red-600">{errors.serviceAreas}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Separate multiple areas with commas
            </p>
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
            <p className="mt-1 text-sm text-gray-500">
              Your AI receptionist will automatically detect the caller's language
            </p>
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Business Hours</h3>
          
          <HoursEditor
            hours={businessProfile.openingHours}
            onChange={(day, hours) => {
              updateBusinessProfile({
                openingHours: {
                  ...businessProfile.openingHours,
                  [day]: hours,
                },
              });
            }}
          />
        </div>
      </div>

    </div>
  );
};

export default StepBusinessProfile;
