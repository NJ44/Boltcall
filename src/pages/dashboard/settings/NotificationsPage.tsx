import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Phone } from 'lucide-react';
import { CustomCheckbox } from '../../../components/ui/custom-checkbox';

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState({
    emailNewLead: true,
    emailMissedCall: true,
    emailAppointment: true,
    emailWeeklyReport: false,
    smsNewLead: false,
    smsMissedCall: true,
    smsAppointment: true,
    pushNewLead: true,
    pushMissedCall: true,
    pushAppointment: true,
  });

  const handleToggle = (key: string) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
          <Bell className="w-6 h-6" />
          Notifications
        </h1>
        <p className="text-zinc-600 mt-1">Manage how you receive notifications</p>
      </div>

      {/* Email Notifications */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Email Notifications
        </h2>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium text-gray-900">New leads</div>
              <div className="text-sm text-gray-600">Get notified when a new lead is captured</div>
            </div>
            <CustomCheckbox
              checked={notifications.emailNewLead}
              onChange={() => handleToggle('emailNewLead')}
            />
          </label>

          <label className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium text-gray-900">Missed calls</div>
              <div className="text-sm text-gray-600">Alert when a call is missed</div>
            </div>
            <CustomCheckbox
              checked={notifications.emailMissedCall}
              onChange={() => handleToggle('emailMissedCall')}
            />
          </label>

          <label className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium text-gray-900">Appointments</div>
              <div className="text-sm text-gray-600">Notifications for new appointments</div>
            </div>
            <CustomCheckbox
              checked={notifications.emailAppointment}
              onChange={() => handleToggle('emailAppointment')}
            />
          </label>

          <label className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium text-gray-900">Weekly reports</div>
              <div className="text-sm text-gray-600">Receive weekly performance summaries</div>
            </div>
            <CustomCheckbox
              checked={notifications.emailWeeklyReport}
              onChange={() => handleToggle('emailWeeklyReport')}
            />
          </label>
        </div>
      </div>

      {/* SMS Notifications */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          SMS Notifications
        </h2>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium text-gray-900">New leads</div>
              <div className="text-sm text-gray-600">Instant SMS for new leads</div>
            </div>
            <CustomCheckbox
              checked={notifications.smsNewLead}
              onChange={() => handleToggle('smsNewLead')}
            />
          </label>

          <label className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium text-gray-900">Missed calls</div>
              <div className="text-sm text-gray-600">SMS alerts for missed calls</div>
            </div>
            <CustomCheckbox
              checked={notifications.smsMissedCall}
              onChange={() => handleToggle('smsMissedCall')}
            />
          </label>

          <label className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium text-gray-900">Appointments</div>
              <div className="text-sm text-gray-600">SMS for appointment confirmations</div>
            </div>
            <CustomCheckbox
              checked={notifications.smsAppointment}
              onChange={() => handleToggle('smsAppointment')}
            />
          </label>
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5" />
          Push Notifications
        </h2>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium text-gray-900">New leads</div>
              <div className="text-sm text-gray-600">Browser push for new leads</div>
            </div>
            <CustomCheckbox
              checked={notifications.pushNewLead}
              onChange={() => handleToggle('pushNewLead')}
            />
          </label>

          <label className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium text-gray-900">Missed calls</div>
              <div className="text-sm text-gray-600">Push alerts for missed calls</div>
            </div>
            <CustomCheckbox
              checked={notifications.pushMissedCall}
              onChange={() => handleToggle('pushMissedCall')}
            />
          </label>

          <label className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium text-gray-900">Appointments</div>
              <div className="text-sm text-gray-600">Push for new appointments</div>
            </div>
            <CustomCheckbox
              checked={notifications.pushAppointment}
              onChange={() => handleToggle('pushAppointment')}
            />
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Save Notification Preferences
        </button>
      </div>
    </div>
  );
};

export default NotificationsPage;

