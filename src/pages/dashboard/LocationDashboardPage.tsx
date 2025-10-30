import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LocationService, type Location } from '@/lib/locations';

const LocationDashboardPage: React.FC = () => {
  const { locationId } = useParams();
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!locationId) return;
      const loc = await LocationService.get(locationId);
      setLocation(loc);
      setLoading(false);
    };
    load();
  }, [locationId]);

  if (loading) {
    return <div className="p-6">Loading location...</div>;
  }

  if (!location) {
    return <div className="p-6">Location not found.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{location.name}</h1>
          <p className="text-sm text-gray-500">
            {[location.address_line1, location.city, location.state].filter(Boolean).join(', ')}
          </p>
        </div>
      </div>

      {/* Placeholder widgets per-location */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
          <div className="text-sm text-gray-500">Today</div>
          <div className="mt-2 text-2xl font-semibold">Leads: --</div>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
          <div className="text-sm text-gray-500">This week</div>
          <div className="mt-2 text-2xl font-semibold">Bookings: --</div>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
          <div className="text-sm text-gray-500">Response</div>
          <div className="mt-2 text-2xl font-semibold">Avg. time: --</div>
        </div>
      </div>
    </div>
  );
};

export default LocationDashboardPage;


