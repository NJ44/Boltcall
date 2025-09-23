import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import Button from '../ui/Button';
import { useDashboardStore } from '../../stores/dashboardStore';
import type { Channel, Intent } from '../../types/dashboard';

const SidebarFilters: React.FC = () => {
  const { 
    filters, 
    setFilters, 
    sidebarCollapsed, 
    setSidebarCollapsed,
    resetFilters 
  } = useDashboardStore();
  
  const channels: Channel[] = ['form', 'sms', 'whatsapp', 'dm', 'missed_call'];
  const intents: Intent[] = ['new', 'engaged', 'qualified', 'booked', 'closed'];
  const sources = ['ads', 'organic', 'dm', 'referral', 'missed_call'];
  const staff = ['Alice', 'Bob', 'Charlie', 'Diana'];
  const tags = ['VIP', 'Hot Lead', 'Follow-up', 'Demo Request', 'Price Inquiry'];
  
  const handleChannelToggle = (channel: Channel) => {
    const newChannels = filters.channels.includes(channel)
      ? filters.channels.filter(c => c !== channel)
      : [...filters.channels, channel];
    setFilters({ channels: newChannels });
  };
  
  const handleIntentToggle = (intent: Intent) => {
    const newIntents = filters.intents.includes(intent)
      ? filters.intents.filter(i => i !== intent)
      : [...filters.intents, intent];
    setFilters({ intents: newIntents });
  };
  
  const handleSourceToggle = (source: string) => {
    const newSources = filters.sources.includes(source)
      ? filters.sources.filter(s => s !== source)
      : [...filters.sources, source];
    setFilters({ sources: newSources });
  };
  
  const handleStaffToggle = (staffMember: string) => {
    const newStaff = filters.staff.includes(staffMember)
      ? filters.staff.filter(s => s !== staffMember)
      : [...filters.staff, staffMember];
    setFilters({ staff: newStaff });
  };
  
  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    setFilters({ tags: newTags });
  };
  
  const formatChannelName = (channel: Channel) => {
    return channel.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };
  
  const formatIntentName = (intent: Intent) => {
    return intent.charAt(0).toUpperCase() + intent.slice(1);
  };
  
  if (sidebarCollapsed) {
    return (
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-12 bg-white border-r border-border flex flex-col items-center py-4"
      >
        <Button
          onClick={() => setSidebarCollapsed(false)}
          variant="outline"
          size="sm"
          className="mb-4"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Filter className="w-5 h-5 text-text-muted" />
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-80 bg-white border-r border-border flex flex-col"
    >
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-main">Filters</h3>
          <div className="flex items-center space-x-2">
            <Button
              onClick={resetFilters}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Reset
            </Button>
            <Button
              onClick={() => setSidebarCollapsed(true)}
              variant="outline"
              size="sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Channels */}
        <div>
          <h4 className="text-sm font-medium text-text-main mb-3">Channels</h4>
          <div className="space-y-2">
            {channels.map((channel) => (
              <label key={channel} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.channels.includes(channel)}
                  onChange={() => handleChannelToggle(channel)}
                  className="mr-2"
                />
                <span className="text-sm text-text-muted">
                  {formatChannelName(channel)}
                </span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Intent */}
        <div>
          <h4 className="text-sm font-medium text-text-main mb-3">Intent</h4>
          <div className="space-y-2">
            {intents.map((intent) => (
              <label key={intent} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.intents.includes(intent)}
                  onChange={() => handleIntentToggle(intent)}
                  className="mr-2"
                />
                <span className="text-sm text-text-muted">
                  {formatIntentName(intent)}
                </span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Sources */}
        <div>
          <h4 className="text-sm font-medium text-text-main mb-3">Sources</h4>
          <div className="space-y-2">
            {sources.map((source) => (
              <label key={source} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.sources.includes(source)}
                  onChange={() => handleSourceToggle(source)}
                  className="mr-2"
                />
                <span className="text-sm text-text-muted capitalize">
                  {source.replace('_', ' ')}
                </span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Staff */}
        <div>
          <h4 className="text-sm font-medium text-text-main mb-3">Staff</h4>
          <div className="space-y-2">
            {staff.map((staffMember) => (
              <label key={staffMember} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.staff.includes(staffMember)}
                  onChange={() => handleStaffToggle(staffMember)}
                  className="mr-2"
                />
                <span className="text-sm text-text-muted">{staffMember}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Tags */}
        <div>
          <h4 className="text-sm font-medium text-text-main mb-3">Tags</h4>
          <div className="space-y-2">
            {tags.map((tag) => (
              <label key={tag} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.tags.includes(tag)}
                  onChange={() => handleTagToggle(tag)}
                  className="mr-2"
                />
                <span className="text-sm text-text-muted">{tag}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SidebarFilters;
