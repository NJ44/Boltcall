import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessagesSquare, CalendarCheck, RotateCw } from 'lucide-react';
import ChatHistoryPage from './ChatHistoryPage';
import SmsBookingPage from './SmsBookingPage';
import FollowUpsPage from './FollowUpsPage';

type Tab = 'chat-history' | 'sms-booking' | 'follow-ups';

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'chat-history', label: 'Chat History', icon: <MessagesSquare className="w-4 h-4" /> },
  { id: 'sms-booking', label: 'SMS Booking', icon: <CalendarCheck className="w-4 h-4" /> },
  { id: 'follow-ups', label: 'Follow Ups', icon: <RotateCw className="w-4 h-4" /> },
];

const MessagesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('chat-history');

  return (
    <div className="flex flex-col h-full">
      {/* Tab Bar */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0 px-6 pt-4 pb-0">
        <div className="flex items-center gap-1 mb-0">
          <h1 className="text-xl font-semibold text-gray-900 mr-6">Messages</h1>
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
                      layoutId="messages-tab-indicator"
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
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'chat-history' && <ChatHistoryPage />}
        {activeTab === 'sms-booking' && <SmsBookingPage />}
        {activeTab === 'follow-ups' && <FollowUpsPage />}
      </div>
    </div>
  );
};

export default MessagesPage;
