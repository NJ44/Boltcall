import React from 'react';
import { Building2, Globe, Clock, Phone, Mail } from 'lucide-react';

const BusinessPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Business Details</h1>
        <p className="text-zinc-600 mt-1">Manage your business information and settings</p>
      </div>

      {/* Business Information Form */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-6">Business Information</h2>
        
        <form className="space-y-6">
          {/* Business Name */}
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-zinc-700 mb-2">
              Business Name
            </label>
            <input
              type="text"
              id="businessName"
              defaultValue="Boltcall Medical Clinic"
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Website */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-zinc-700 mb-2">
              Website
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="w-4 h-4 text-zinc-400" />
              </div>
              <input
                type="url"
                id="website"
                defaultValue="https://boltcall.com"
                className="w-full pl-10 pr-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="w-4 h-4 text-zinc-400" />
              </div>
              <input
                type="tel"
                id="phone"
                defaultValue="+1 (555) 123-4567"
                className="w-full pl-10 pr-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-zinc-400" />
              </div>
              <input
                type="email"
                id="email"
                defaultValue="contact@boltcall.com"
                className="w-full pl-10 pr-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Business Hours
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="openTime" className="block text-xs text-zinc-600 mb-1">Opening Time</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="w-4 h-4 text-zinc-400" />
                  </div>
                  <input
                    type="time"
                    id="openTime"
                    defaultValue="09:00"
                    className="w-full pl-10 pr-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="closeTime" className="block text-xs text-zinc-600 mb-1">Closing Time</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="w-4 h-4 text-zinc-400" />
                  </div>
                  <input
                    type="time"
                    id="closeTime"
                    defaultValue="17:00"
                    className="w-full pl-10 pr-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Business Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-zinc-700 mb-2">
              Business Description
            </label>
            <textarea
              id="description"
              rows={4}
              defaultValue="Leading medical clinic providing comprehensive healthcare services with a focus on patient care and modern technology."
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-zinc-900">1</div>
              <div className="text-sm text-zinc-600">Active Location</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-zinc-900">3</div>
              <div className="text-sm text-zinc-600">Phone Numbers</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-zinc-900">8h</div>
              <div className="text-sm text-zinc-600">Daily Hours</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPage;
