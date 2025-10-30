import React, { useEffect, useMemo, useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
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

  const currentLocationId = useMemo(() => localStorage.getItem('currentLocationId') || '', []);
  const [selectedId, setSelectedId] = useState<string>(currentLocationId);

  useEffect(() => {
    const init = async () => {
      if (!user) return;
      // get user's first business profile
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
      if (!currentLocationId && list.length) {
        setSelectedId(list[0].id);
        localStorage.setItem('currentLocationId', list[0].id);
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
    // navigate to location dashboard route
    window.location.href = `/dashboard/locations/${id}`;
  };

  if (!businessProfileId) return null;

  return (
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
        </div>
      )}
    </div>
  );
};

export default LocationSwitcher;


