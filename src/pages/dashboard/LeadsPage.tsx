import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, PhoneMissed, RotateCw } from 'lucide-react';
import SpeedToLeadPage from './SpeedToLeadPage';
import MissedCallsPage from './MissedCallsPage';
import LeadReactivationPage from './LeadReactivationPage';

type Tab = 'speed-to-lead' | 'missed-calls' | 'reactivation';

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'speed-to-lead', label: 'Speed to Lead', icon: <Zap className="w-4 h-4" /> },
  { id: 'missed-calls', label: 'Missed Calls', icon: <PhoneMissed className="w-4 h-4" /> },
  { id: 'reactivation', label: 'Reactivation', icon: <RotateCw className="w-4 h-4" /> },
];

const LeadsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('speed-to-lead');

  return (
    <div className="flex flex-col h-full">
      {/* Tab Bar */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0 px-6 pt-4 pb-0">
        <div className="flex items-center gap-1 mb-0">
          <nav className="flex gap-4 -mb-px">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {isActive && (
                    <motion.span
                      layoutId="leads-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto pt-4">
        {activeTab === 'speed-to-lead' && <SpeedToLeadPage />}
        {activeTab === 'missed-calls' && <MissedCallsPage />}
        {activeTab === 'reactivation' && <LeadReactivationPage />}
      </div>
    </div>
  );
};

export default LeadsPage;
