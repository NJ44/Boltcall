import React, { useState } from 'react';
import { AlertTriangle, Power, PhoneOff, MessageSquareOff, BellOff } from 'lucide-react';
import Plan from '../../components/ui/agent-plan';

const DashboardPage: React.FC = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deactivateType, setDeactivateType] = useState<string>('');

  const handleDeactivate = (type: string) => {
    setDeactivateType(type);
    setShowConfirmModal(true);
  };

  const confirmDeactivate = () => {
    console.log('Deactivating:', deactivateType);
    setShowConfirmModal(false);
    // Add deactivation logic here
  };

  return (
    <div className="space-y-8">
      {/* Agent Plan Component */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Plan />
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg border border-red-200 overflow-hidden">
        <div className="bg-red-50 border-b border-red-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
              <p className="text-sm text-red-700">Deactivate parts of your system</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Deactivate AI Receptionist */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Power className="w-5 h-5 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">AI Receptionist</h4>
                <p className="text-sm text-gray-600">Temporarily disable AI call handling</p>
              </div>
            </div>
            <button
              onClick={() => handleDeactivate('AI Receptionist')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Deactivate
            </button>
          </div>

          {/* Deactivate Phone System */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <PhoneOff className="w-5 h-5 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">Phone System</h4>
                <p className="text-sm text-gray-600">Stop receiving incoming calls</p>
              </div>
            </div>
            <button
              onClick={() => handleDeactivate('Phone System')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Deactivate
            </button>
          </div>

          {/* Deactivate SMS */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <MessageSquareOff className="w-5 h-5 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">SMS Messaging</h4>
                <p className="text-sm text-gray-600">Disable automated text messages</p>
              </div>
            </div>
            <button
              onClick={() => handleDeactivate('SMS Messaging')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Deactivate
            </button>
          </div>

          {/* Deactivate Notifications */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <BellOff className="w-5 h-5 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">All Notifications</h4>
                <p className="text-sm text-gray-600">Stop all email and push notifications</p>
              </div>
            </div>
            <button
              onClick={() => handleDeactivate('All Notifications')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Deactivate
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Confirm Deactivation</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to deactivate <strong>{deactivateType}</strong>? 
              This action can be reversed, but your system will stop functioning until reactivated.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeactivate}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
