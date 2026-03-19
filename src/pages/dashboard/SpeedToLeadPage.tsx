import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  Clock,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import CardTable from '../../components/ui/CardTable';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  status: string;
  createdAt: string;
  assignedAgentId?: string;
}


const SpeedToLeadPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchLeads();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const fetchLeads = async () => {
    if (!user?.id) {
      setIsLoadingLeads(false);
      return;
    }

    setIsLoadingLeads(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
        showToast({
          title: 'Error',
          message: 'Failed to fetch leads',
          variant: 'error',
          duration: 3000
        });
        setLeads([]);
        return;
      }

      if (data) {
        // Map database fields to Lead interface
        const mappedLeads: Lead[] = data.map((lead: any) => ({
          id: lead.id,
          name: lead.name || lead.full_name || `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'Unknown',
          phone: lead.phone || lead.phone_number || '',
          email: lead.email || '',
          source: lead.source || lead.acquisition_source || lead.source_type || 'Unknown',
          status: lead.status || 'pending',
          createdAt: lead.created_at || lead.createdAt || new Date().toISOString(),
          assignedAgentId: lead.assigned_agent_id || lead.assignedAgentId || undefined
        }));

        setLeads(mappedLeads);
      } else {
        setLeads([]);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      showToast({
        title: 'Error',
        message: 'Failed to fetch leads',
        variant: 'error',
        duration: 3000
      });
      setLeads([]);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  // Compute lead source counts for the chart
  const sourceCounts = leads.reduce((acc, lead) => {
    const src = lead.source || 'Unknown';
    acc[src] = (acc[src] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Build last 7 days data for chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const sourceColors: Record<string, string> = {
    'AI Receptionist': '#3B82F6',
    'ai_receptionist': '#3B82F6',
    'Speed to Lead': '#F59E0B',
    'speed_to_lead': '#F59E0B',
    'Instant Lead Response': '#F59E0B',
    'Website Form': '#8B5CF6',
    'website_form': '#8B5CF6',
    'Google Ads': '#10B981',
    'google_ads': '#10B981',
    'Facebook Ads': '#EC4899',
    'facebook_ads': '#EC4899',
    'Missed Call': '#EF4444',
    'missed_call': '#EF4444',
    'Manual': '#6B7280',
    'Unknown': '#9CA3AF',
  };

  // Group leads by day and source
  const allSources = Object.keys(sourceCounts);
  const dailyData = last7Days.map((day) => {
    const dayStr = day.toISOString().split('T')[0];
    const counts: Record<string, number> = {};
    allSources.forEach((src) => {
      counts[src] = leads.filter((l) => {
        const lDay = new Date(l.createdAt).toISOString().split('T')[0];
        return lDay === dayStr && (l.source || 'Unknown') === src;
      }).length;
    });
    return { date: day, label: day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), counts };
  });

  const maxLeadsPerDay = Math.max(1, ...dailyData.map((d) => Object.values(d.counts).reduce((a, b) => Math.max(a, b), 0)));

  return (
    <div className="space-y-4 md:space-y-8 px-1 md:px-0">
      {/* Lead Sources Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 md:p-6">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">Leads by Source</h2>
          <div className="text-xs md:text-sm text-gray-500">Last 7 days</div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-4 md:mb-6">
          {allSources.map((src) => (
            <div key={src} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: sourceColors[src] || '#9CA3AF' }}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                {src.replace(/_/g, ' ')}
              </span>
              <span className="text-xs font-semibold text-gray-900 dark:text-white">{sourceCounts[src]}</span>
            </div>
          ))}
        </div>

        {/* Chart Area */}
        <div className="relative h-36 md:h-48 overflow-hidden">
          {/* Y-axis grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
            <div
              key={pct}
              className="absolute left-8 right-0 border-t border-gray-100 dark:border-gray-700"
              style={{ bottom: `${pct * 100}%` }}
            >
              <span className="absolute -left-8 -top-2 text-[10px] text-gray-400 w-6 text-right">
                {Math.round(maxLeadsPerDay * pct)}
              </span>
            </div>
          ))}

          {/* Lines */}
          <svg className="absolute left-8 top-0 right-0 bottom-0 w-[calc(100%-2rem)] h-full overflow-visible">
            {allSources.map((src) => {
              const points = dailyData.map((d, i) => {
                const x = (i / (dailyData.length - 1)) * 100;
                const y = 100 - (d.counts[src] / maxLeadsPerDay) * 100;
                return `${x},${y}`;
              });
              return (
                <polyline
                  key={src}
                  points={points.join(' ')}
                  fill="none"
                  stroke={sourceColors[src] || '#9CA3AF'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}
                />
              );
            })}
            {/* Dots */}
            {allSources.map((src) =>
              dailyData.map((d, i) => {
                if (d.counts[src] === 0) return null;
                const cx = (i / (dailyData.length - 1)) * 100;
                const cy = 100 - (d.counts[src] / maxLeadsPerDay) * 100;
                return (
                  <circle
                    key={`${src}-${i}`}
                    cx={`${cx}%`}
                    cy={`${cy}%`}
                    r="4"
                    fill="white"
                    stroke={sourceColors[src] || '#9CA3AF'}
                    strokeWidth="2"
                  />
                );
              })
            )}
          </svg>

          {/* X-axis labels */}
          <div className="absolute left-8 right-0 bottom-0 translate-y-6 flex justify-between">
            {dailyData.map((d, i) => (
              <span key={i} className="text-[10px] text-gray-400 text-center" style={{ width: `${100 / dailyData.length}%` }}>
                {d.label.split(', ')[0]}
              </span>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {leads.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-gray-400">No lead data yet</p>
          </div>
        )}
      </div>

      {/* Leads Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-3 md:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">Recent Leads</h2>
        </div>
        
        {isLoadingLeads ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-4">Loading leads...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No leads found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Leads will appear here once you start receiving them</p>
          </div>
        ) : (
          <CardTable
            columns={[
              { key: 'name', label: 'Name', width: '20%' },
              { key: 'phone', label: 'Phone', width: '20%' },
              { key: 'email', label: 'Email', width: '25%' },
              { key: 'source', label: 'Source', width: '15%' },
              { key: 'status', label: 'Status', width: '10%' },
              { key: 'createdAt', label: 'Created', width: '10%' }
            ]}
            data={leads}
            renderRow={(lead) => (
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
                {/* Name + Status (mobile: side by side) */}
                <div className="flex items-center justify-between md:contents">
                  <div className="flex items-center gap-3 md:flex-1">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm md:text-base">{lead.name}</div>
                  </div>

                  <div className="md:flex-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      lead.status === 'contacted'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {lead.status}
                    </span>
                  </div>
                </div>

                {/* Contact info */}
                <div className="flex flex-col gap-1 md:contents text-sm">
                  <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100 md:flex-1">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{lead.phone || 'N/A'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100 md:flex-1">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{lead.email || 'N/A'}</span>
                  </div>
                </div>

                {/* Source + Date */}
                <div className="flex items-center gap-3 md:contents">
                  <div className="md:flex-1">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                      {lead.source}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-400 md:flex-1">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    {formatDate(lead.createdAt)}
                  </div>
                </div>
              </div>
            )}
          />
        )}
      </div>

    </div>
  );
};

export default SpeedToLeadPage;