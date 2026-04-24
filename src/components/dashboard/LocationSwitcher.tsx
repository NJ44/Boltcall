import React, { useEffect, useMemo, useState } from 'react';
import { MapPin, ChevronDown, Plus, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { LocationService, type Location } from '@/lib/locations';
import { supabase } from '@/lib/supabase';

interface LocationSwitcherProps {
  className?: string;
}

export const LocationSwitcher: React.FC<LocationSwitcherProps> = ({ className }) => {
  const { user } = useAuth();
  const [locations, setLocations] = useState<Location[]>([]);
  const [businessProfileId, setBusinessProfileId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [adding, setAdding] = useState(false);

  // Add location form
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPostal, setNewPostal] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [addError, setAddError] = useState('');

  const currentLocationId = useMemo(() => localStorage.getItem('currentLocationId') || '', []);
  const [selectedId, setSelectedId] = useState<string>(currentLocationId);

  useEffect(() => {
    const init = async () => {
      if (!user) return;
      const { data: bp, error } = await supabase
        .from('business_profiles')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();
      if (error || !bp) return;
      setBusinessProfileId(bp.id);
      const list = await LocationService.listByBusinessProfile(bp.id);
      setLocations(list);
      // list[0] is always the primary location (ordered by is_primary DESC)
      const primary = list.find(l => l.is_primary) ?? list[0];
      const savedExists = currentLocationId && list.some(l => l.id === currentLocationId);
      if (!savedExists && primary) {
        setSelectedId(primary.id);
        localStorage.setItem('currentLocationId', primary.id);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const selected = locations.find(l => l.id === selectedId) || null;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    localStorage.setItem('currentLocationId', id);
    setOpen(false);
    window.location.href = `/dashboard/locations/${id}`;
  };

  const handleAddLocation = async () => {
    if (!user || !businessProfileId || !newName.trim()) {
      setAddError('Location name is required');
      return;
    }
    setAdding(true);
    setAddError('');
    try {
      const newLoc = await LocationService.create({
        business_profile_id: businessProfileId,
        user_id: user.id,
        name: newName.trim(),
        address_line1: newAddress.trim() || null,
        city: newCity.trim() || null,
        state: newState.trim() || null,
        postal_code: newPostal.trim() || null,
        phone: newPhone.trim() || null,
        is_primary: locations.length === 0,
        is_active: true,
      });
      setLocations(prev => [...prev, newLoc]);
      setShowAddModal(false);
      setOpen(false);
      setNewName('');
      setNewAddress('');
      setNewCity('');
      setNewState('');
      setNewPostal('');
      setNewPhone('');
      // Navigate to the new location
      handleSelect(newLoc.id);
    } catch (err: any) {
      setAddError(err.message || 'Failed to add location');
    } finally {
      setAdding(false);
    }
  };

  if (!businessProfileId) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 animate-pulse">
        <div className="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="w-24 h-3.5 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  return (
    <>
      <div className={`relative ${className || ''}`}>
        <button
          onClick={() => setOpen(v => !v)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          <MapPin className="w-4 h-4 text-brand-blue" />
          <span className="text-sm font-medium">{selected ? selected.name : 'Select location'}</span>
          <ChevronDown className="w-4 h-4 opacity-70" />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-64 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg z-50">
            <div className="max-h-64 overflow-y-auto py-1">
              {locations.length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-500">No locations yet</div>
              )}
              {locations.map(loc => (
                <button
                  key={loc.id}
                  onClick={() => handleSelect(loc.id)}
                  className={`w-full flex items-start gap-2 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800 ${selectedId === loc.id ? 'bg-gray-50 dark:bg-gray-800' : ''}`}
                >
                  <MapPin className="w-4 h-4 text-brand-blue mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{loc.name}</div>
                    <div className="text-xs text-gray-500">{[loc.city, loc.state].filter(Boolean).join(', ')}</div>
                  </div>
                </button>
              ))}
            </div>
            {/* Add Location button */}
            <div className="border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => { setShowAddModal(true); setOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Location
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Location Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full max-w-md mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200/80 dark:border-gray-700 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Add New Location</h3>
                  <button onClick={() => setShowAddModal(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800" />

                {/* Form */}
                <div className="px-6 py-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Location Name <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      placeholder="e.g. Main Office, Downtown Branch"
                      className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Address</label>
                    <input
                      type="text"
                      value={newAddress}
                      onChange={e => setNewAddress(e.target.value)}
                      placeholder="Street address"
                      className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 placeholder:text-gray-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">City</label>
                      <input
                        type="text"
                        value={newCity}
                        onChange={e => setNewCity(e.target.value)}
                        placeholder="City"
                        className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">State / Region</label>
                      <input
                        type="text"
                        value={newState}
                        onChange={e => setNewState(e.target.value)}
                        placeholder="State"
                        className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Postal Code</label>
                      <input
                        type="text"
                        value={newPostal}
                        onChange={e => setNewPostal(e.target.value)}
                        placeholder="Postal code"
                        className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
                      <input
                        type="tel"
                        value={newPhone}
                        onChange={e => setNewPhone(e.target.value)}
                        placeholder="Phone number"
                        className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {addError && (
                    <p className="text-sm text-red-600">{addError}</p>
                  )}
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800" />

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddLocation}
                    disabled={adding || !newName.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {adding ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</> : 'Add Location'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LocationSwitcher;
