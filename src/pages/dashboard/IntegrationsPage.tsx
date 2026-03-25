import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plug, Webhook, Calendar, Building2 } from 'lucide-react';
import IntegrationHubTab from './integrations/IntegrationHubTab';
import CrmSyncTab from './integrations/CrmSyncTab';
import WebhooksTab from './integrations/WebhooksTab';
import GoogleCalendarTab from './integrations/GoogleCalendarTab';

type Tab = 'hub' | 'crm' | 'webhooks' | 'calendar';

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'hub', label: 'Integration Hub', icon: <Plug className="w-4 h-4" /> },
  { id: 'crm', label: 'CRM Sync', icon: <Building2 className="w-4 h-4" /> },
  { id: 'webhooks', label: 'Webhooks', icon: <Webhook className="w-4 h-4" /> },
  { id: 'calendar', label: 'Google Calendar', icon: <Calendar className="w-4 h-4" /> },
];

const IntegrationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('hub');

  return (
    <div className="flex flex-col h-full">
      {/* Tab Bar */}
      <div className="bg-white dark:bg-[#111114] border-b border-gray-200 dark:border-[#1e1e24] flex-shrink-0 px-6 pt-4 pb-0">
        <div className="flex items-center justify-between mb-0">
          <nav className="flex gap-4 -mb-px">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {isActive && (
                    <motion.span
                      layoutId="integrations-tab-indicator"
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
        {activeTab === 'hub' && <IntegrationHubTab />}
        {activeTab === 'crm' && <CrmSyncTab />}
        {activeTab === 'webhooks' && <WebhooksTab />}
        {activeTab === 'calendar' && <GoogleCalendarTab />}
      </div>
    </div>
  );
};

export default IntegrationsPage;
