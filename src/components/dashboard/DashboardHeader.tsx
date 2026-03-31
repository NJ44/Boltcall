import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Download, Copy, UserPlus, Settings, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { useDashboardStore } from '../../stores/dashboardStore';
import { useToast } from '../../contexts/ToastContext';
import dayjs from 'dayjs';

const DashboardHeader: React.FC = () => {
  const { filters, applyQuickDateRange } = useDashboardStore();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleExportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,'
      + 'Date Range,' + filters.dateRange + '\n'
      + 'Generated,' + new Date().toISOString() + '\n';
    const encodedUri = encodeURIComponent(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodedUri);
    link.setAttribute('download', `boltcall-dashboard-${dayjs().format('YYYY-MM-DD')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    showToast({
      title: 'Link copied',
      message: 'Dashboard link has been copied to your clipboard.',
      variant: 'success',
      duration: 2000,
    });
  };

  const handleInviteTeammate = () => {
    navigate('/dashboard/settings/members');
  };
  
  const quickDateRanges = [
    { label: 'Today', value: 'today' },
    { label: '7 days', value: '7d' },
    { label: '30 days', value: '30d' },
  ];
  
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white border-b border-border px-6 py-4"
    >
      <div className="flex items-center justify-between">
        {/* Logo and Client Selector */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-brand-blue">BoltCall</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <select className="px-3 py-2 border border-border rounded-xl text-sm focus:ring-2 focus:ring-brand-blue focus:border-transparent">
              <option value="default-client">Default Client</option>
              <option value="client-2">Client 2</option>
              <option value="client-3">Client 3</option>
            </select>
          </div>
        </div>
        
        {/* Date Range Picker */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Button
              onClick={() => setShowDatePicker(!showDatePicker)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              {dayjs(filters.dateRange.start).format('MMM D')} - {dayjs(filters.dateRange.end).format('MMM D')}
            </Button>
            
            {showDatePicker && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full right-0 mt-2 bg-white border border-border rounded-xl shadow-lg p-4 z-10 min-w-[200px]"
              >
                <div className="space-y-2">
                  {quickDateRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => {
                        applyQuickDateRange(range.value as 'today' | '7d' | '30d' | 'custom');
                        setShowDatePicker(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {range.label}
                    </button>
                  ))}
                  <div className="border-t border-border pt-2">
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Custom range...
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Timezone Badge */}
          <div className="flex items-center text-xs text-text-muted bg-gray-100 px-2 py-1 rounded-full">
            <Globe className="w-3 h-3 mr-1" />
            {Intl.DateTimeFormat().resolvedOptions().timeZone}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          
          <Button
            onClick={handleCopyLink}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy Link
          </Button>
          
          <Button
            onClick={handleInviteTeammate}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Invite
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default DashboardHeader;
