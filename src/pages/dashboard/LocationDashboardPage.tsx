import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageSkeleton } from '../../components/ui/loading-skeleton';
import { LocationService, type Location } from '@/lib/locations';
import { supabase } from '../../lib/supabase';
import { Phone, Users, Calendar } from 'lucide-react';

interface LocationMetrics {
  leadsToday: number;
  leadsThisWeek: number;
  bookingsThisWeek: number;
  callsToday: number;
  smsSentToday: number;
  pendingCallbacks: number;
}

const LocationDashboardPage: React.FC = () => {
  const { locationId } = useParams();
  const [location, setLocation] = useState<Location | null>(null);
  const [metrics, setMetrics] = useState<LocationMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!locationId) return;

      const loc = await LocationService.get(locationId);
      setLocation(loc);

      // Fetch real metrics for this location
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).toISOString();

      const [leadsToday, leadsWeek, bookingsWeek, callbacksPending] = await Promise.all([
        supabase
          .from('leads')
          .select('id', { count: 'exact', head: true })
          .eq('location_id', locationId)
          .gte('created_at', todayStart),
        supabase
          .from('leads')
          .select('id', { count: 'exact', head: true })
          .eq('location_id', locationId)
          .gte('created_at', weekStart),
        supabase
          .from('appointments')
          .select('id', { count: 'exact', head: true })
          .eq('location_id', locationId)
          .gte('created_at', weekStart),
        supabase
          .from('callbacks')
          .select('id', { count: 'exact', head: true })
          .eq('location_id', locationId)
          .eq('status', 'pending'),
      ]);

      setMetrics({
        leadsToday: leadsToday.count || 0,
        leadsThisWeek: leadsWeek.count || 0,
        bookingsThisWeek: bookingsWeek.count || 0,
        callsToday: 0, // Retell calls are not per-location yet
        smsSentToday: 0,
        pendingCallbacks: callbacksPending.count || 0,
      });

      setLoading(false);
    };
    load();
  }, [locationId]);

  if (loading) {
    return <PageSkeleton />;
  }

  if (!location) {
    return <div className="p-6 text-gray-500">Location not found.</div>;
  }

  const kpis = [
    { label: 'Leads Today', value: metrics?.leadsToday ?? 0, icon: Users, color: 'text-brand-blue', bg: 'bg-blue-50' },
    { label: 'Leads This Week', value: metrics?.leadsThisWeek ?? 0, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Bookings This Week', value: metrics?.bookingsThisWeek ?? 0, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Pending Callbacks', value: metrics?.pendingCallbacks ?? 0, icon: Phone, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{location.name}</h1>
          <p className="text-sm text-gray-500">
            {[location.address_line1, location.city, location.state].filter(Boolean).join(', ')}
          </p>
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${location.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
          {location.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-gray-200 p-5 bg-white">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 ${kpi.bg} rounded-lg flex items-center justify-center`}>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <span className="text-sm text-gray-500">{kpi.label}</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{kpi.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 p-6 bg-white">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Location Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {location.phone && (
            <div>
              <span className="text-gray-500">Phone:</span>
              <span className="ml-2 text-gray-900">{location.phone}</span>
            </div>
          )}
          {location.email && (
            <div>
              <span className="text-gray-500">Email:</span>
              <span className="ml-2 text-gray-900">{location.email}</span>
            </div>
          )}
          {location.timezone && (
            <div>
              <span className="text-gray-500">Timezone:</span>
              <span className="ml-2 text-gray-900">{location.timezone}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationDashboardPage;
