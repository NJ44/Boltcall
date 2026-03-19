import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Save, RefreshCw, AlertTriangle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Magnetic } from '../../../components/ui/magnetic';
import { useToast } from '../../../contexts/ToastContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useTokens } from '../../../contexts/TokenContext';
import { supabase } from '../../../lib/supabase';
import Button from '../../../components/ui/Button';

const GeneralPage: React.FC = () => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const { claimReward } = useTokens();
  const navigate = useNavigate();
  const [businessInfo, setBusinessInfo] = useState({
    businessName: '',
    language: 'en',
    owner: '',
    website: '',
    description: '',
    industry: 'Technology'
  });

  const [addressInfo, setAddressInfo] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [businessProfileId, setBusinessProfileId] = useState<string | null>(null);
  const [locationId, setLocationId] = useState<string | null>(null);

  // Fetch existing data on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        // Fetch business profile
        const { data: profile } = await supabase
          .from('business_profiles')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })
          .limit(1)
          .maybeSingle();

        if (profile) {
          setBusinessProfileId(profile.id);
          setBusinessInfo({
            businessName: profile.business_name || '',
            language: profile.languages?.[0] || 'en',
            owner: profile.owner_name || user.name || '',
            website: profile.website_url || '',
            description: profile.description || '',
            industry: profile.main_category || 'Technology'
          });

          // Fetch primary location for address
          const { data: location } = await supabase
            .from('locations')
            .select('*')
            .eq('business_profile_id', profile.id)
            .eq('is_primary', true)
            .limit(1)
            .maybeSingle();

          if (location) {
            setLocationId(location.id);
            setAddressInfo({
              line1: location.address_line1 || '',
              line2: location.address_line2 || '',
              city: location.city || '',
              state: location.state || '',
              postalCode: location.postal_code || '',
              country: location.country || 'United States'
            });
          }
        }
      } catch (err) {
        console.error('Error fetching general settings:', err);
      }
    };
    fetchData();
  }, [user?.id, user?.name]);

  const handleSave = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    try {
      // Upsert business profile
      const profilePayload = {
        user_id: user.id,
        business_name: businessInfo.businessName,
        website_url: businessInfo.website,
        main_category: businessInfo.industry,
        languages: [businessInfo.language],
        // owner_name and description may not have dedicated columns yet;
        // the upsert will silently ignore unknown columns on insert, but
        // we include them so they work once the columns are added.
        owner_name: businessInfo.owner,
        description: businessInfo.description,
      };

      if (businessProfileId) {
        const { error } = await supabase
          .from('business_profiles')
          .update(profilePayload)
          .eq('id', businessProfileId);
        if (error) throw error;
      } else {
        const { data: newProfile, error } = await supabase
          .from('business_profiles')
          .insert([profilePayload])
          .select()
          .single();
        if (error) throw error;
        if (newProfile) setBusinessProfileId(newProfile.id);
      }

      // Upsert location (address)
      if (businessProfileId) {
        const locationPayload = {
          address_line1: addressInfo.line1,
          address_line2: addressInfo.line2,
          city: addressInfo.city,
          state: addressInfo.state,
          postal_code: addressInfo.postalCode,
          country: addressInfo.country,
        };

        if (locationId) {
          const { error } = await supabase
            .from('locations')
            .update(locationPayload)
            .eq('id', locationId);
          if (error) throw error;
        } else {
          const { data: newLoc, error } = await supabase
            .from('locations')
            .insert([{
              ...locationPayload,
              business_profile_id: businessProfileId,
              user_id: user.id,
              name: addressInfo.line1 || businessInfo.businessName || 'Primary Location',
              is_primary: true,
              is_active: true,
            }])
            .select()
            .single();
          if (error) throw error;
          if (newLoc) setLocationId(newLoc.id);
        }
      }

      showToast({ title: 'Saved', message: 'Settings saved successfully!', variant: 'success', duration: 3000 });
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);

      // Claim bonus token reward for completing business profile
      const rewardResult = await claimReward('complete_business_profile');
      if (rewardResult?.success && !rewardResult?.alreadyClaimed) {
        showToast({ title: 'Bonus Tokens!', message: '+50 tokens earned for completing your business profile', variant: 'success', duration: 4000 });
      }
    } catch (err) {
      console.error('Error saving general settings:', err);
      showToast({ title: 'Error', message: 'Failed to save settings. Please try again.', variant: 'error', duration: 4000 });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBusinessInfoChange = (field: string, value: string) => {
    setBusinessInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setAddressInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' }
  ];

  const countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Germany',
    'France',
    'Spain',
    'Italy',
    'Netherlands',
    'Sweden',
    'Norway',
    'Denmark'
  ];

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Retail',
    'Education',
    'Real Estate',
    'Legal',
    'Consulting',
    'Manufacturing',
    'Hospitality',
    'Transportation',
    'Other'
  ];

  return (
    <div className="space-y-8">
      {/* Header */}

      {/* Business Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-lg border border-gray-200 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Business Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Name *
            </label>
            <input
              type="text"
              value={businessInfo.businessName}
              onChange={(e) => handleBusinessInfoChange('businessName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter business name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Owner/Manager *
            </label>
            <input
              type="text"
              value={businessInfo.owner}
              onChange={(e) => handleBusinessInfoChange('owner', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter owner name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Language *
            </label>
            <select
              value={businessInfo.language}
              onChange={(e) => handleBusinessInfoChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry
            </label>
            <select
              value={businessInfo.industry}
              onChange={(e) => handleBusinessInfoChange('industry', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website URL
            </label>
            <input
              type="url"
              value={businessInfo.website}
              onChange={(e) => handleBusinessInfoChange('website', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://your-website.com"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Description
            </label>
            <textarea
              value={businessInfo.description}
              onChange={(e) => handleBusinessInfoChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of your business"
            />
          </div>
        </div>
      </motion.div>

      {/* Business Address */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-lg border border-gray-200 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Business Address</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Street Address *
            </label>
            <input
              type="text"
              value={addressInfo.line1}
              onChange={(e) => handleAddressChange('line1', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter street address"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address Line 2
            </label>
            <input
              type="text"
              value={addressInfo.line2}
              onChange={(e) => handleAddressChange('line2', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Apartment, suite, unit, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              value={addressInfo.city}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter city"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State/Province
            </label>
            <input
              type="text"
              value={addressInfo.state}
              onChange={(e) => handleAddressChange('state', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter state or province"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Postal Code
            </label>
            <input
              type="text"
              value={addressInfo.postalCode}
              onChange={(e) => handleAddressChange('postalCode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter postal code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country *
            </label>
            <select
              value={addressInfo.country}
              onChange={(e) => handleAddressChange('country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <div>
          {saveMessage && (
            <p className="text-green-600 text-sm font-medium">{saveMessage}</p>
          )}
        </div>
        <Magnetic>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </Magnetic>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white rounded-lg border border-red-200 p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Danger Zone</h2>
            <p className="text-sm text-gray-600 mt-1">Irreversible and destructive actions</p>
          </div>
        </div>

        <div className="border-t border-red-200 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Delete Workspace</h3>
              <p className="text-sm text-gray-600">
                Once you delete a workspace, there is no going back. Please be certain.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(true)}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Workspace
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Delete Workspace Modal */}
      {showDeleteModal && (
        <div className="fixed -inset-[200px] bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Delete Workspace</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              This action cannot be undone. This will permanently delete your workspace, 
              all associated data, members, and settings.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="font-semibold">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="DELETE"
              />
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  if (deleteConfirmText !== 'DELETE') {
                    showToast({
                      title: 'Invalid Confirmation',
                      message: 'Please type DELETE to confirm',
                      variant: 'error',
                      duration: 3000
                    });
                    return;
                  }

                  setIsDeleting(true);
                  try {
                    // Get the current user
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) throw new Error('Not authenticated');

                    // Delete business profiles for this user
                    await supabase.from('business_profiles').delete().eq('user_id', user.id);

                    // Delete workspaces for this user
                    await supabase.from('workspaces').delete().eq('user_id', user.id);

                    // Delete knowledge base files from storage
                    const { data: files } = await supabase.storage.from('knowledge-base').list(user.id);
                    if (files?.length) {
                      const paths = files.map(f => `${user.id}/${f.name}`);
                      await supabase.storage.from('knowledge-base').remove(paths);
                    }

                    // Sign out the user
                    await supabase.auth.signOut();

                    showToast({
                      title: 'Workspace Deleted',
                      message: 'Your workspace has been permanently deleted',
                      variant: 'success',
                      duration: 4000
                    });
                    setShowDeleteModal(false);
                    navigate('/');
                  } catch (error) {
                    showToast({
                      title: 'Deletion Failed',
                      message: 'Failed to delete workspace. Please try again.',
                      variant: 'error',
                      duration: 4000
                    });
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                disabled={isDeleting || deleteConfirmText !== 'DELETE'}
                className="flex-1 border-red-600 text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Workspace
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GeneralPage;
