import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, PhoneCall, Clock, MessageSquare, Calendar } from 'lucide-react';
import CardTableWithPanel from '../../components/ui/CardTableWithPanel';

interface MissedCall {
  id: string;
  callerName: string;
  callerPhone: string;
  callerEmail?: string;
  missedAt: string;
  duration: string;
  status: 'new' | 'contacted' | 'scheduled' | 'ignored';
  notes?: string;
  callbackScheduled?: string;
  agentName?: string;
}

const MissedCallsPage: React.FC = () => {
  const [missedCalls] = useState<MissedCall[]>([
    {
      id: '1',
      callerName: 'John Smith',
      callerPhone: '+1 (555) 123-4567',
      callerEmail: 'john.smith@email.com',
      missedAt: '2024-01-15T10:30:00Z',
      duration: '0:45',
      status: 'new',
      notes: 'Called about pricing inquiry',
      agentName: 'Sarah Johnson'
    },
    {
      id: '2',
      callerName: 'Maria Garcia',
      callerPhone: '+1 (555) 987-6543',
      missedAt: '2024-01-15T09:15:00Z',
      duration: '1:20',
      status: 'contacted',
      notes: 'Follow-up call scheduled',
      callbackScheduled: '2024-01-16T14:00:00Z',
      agentName: 'Mike Chen'
    },
    {
      id: '3',
      callerName: 'Robert Wilson',
      callerPhone: '+1 (555) 456-7890',
      missedAt: '2024-01-14T16:45:00Z',
      duration: '0:30',
      status: 'scheduled',
      notes: 'Appointment booking request',
      callbackScheduled: '2024-01-17T10:30:00Z',
      agentName: 'Lisa Brown'
    }
  ]);

  const [showAddPanel, setShowAddPanel] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [, setEditingCall] = useState<Partial<MissedCall>>({});

  const handleAddNewCall = () => {
    setEditingCall({});
    setShowAddPanel(true);
  };

  const handleEditCall = (call: MissedCall) => {
    setEditingCall(call);
    setShowEditPanel(true);
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-green-100 text-green-800';
      case 'ignored': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'New';
      case 'contacted': return 'Contacted';
      case 'scheduled': return 'Scheduled';
      case 'ignored': return 'Ignored';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <CardTableWithPanel
          data={missedCalls}
          columns={[
            { key: 'checkbox', label: '', width: '5%' },
            { key: 'caller', label: 'Caller Information', width: '25%' },
            { key: 'missedAt', label: 'Missed At', width: '15%' },
            { key: 'duration', label: 'Duration', width: '10%' },
            { key: 'status', label: 'Status', width: '15%' },
            { key: 'agent', label: 'Assigned Agent', width: '15%' },
            { key: 'callback', label: 'Callback', width: '10%' },
            { key: 'actions', label: 'Actions', width: '5%' }
          ]}
          renderRow={(call) => (
            <div className="flex items-center gap-6">
              {/* Checkbox */}
              <div className="w-4 h-4 flex-shrink-0">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              
              {/* Caller Information */}
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{call.callerName}</div>
                  <div className="text-sm text-gray-600">{call.callerPhone}</div>
                  {call.callerEmail && (
                    <div className="text-xs text-gray-500">{call.callerEmail}</div>
                  )}
                </div>
              </div>

              {/* Missed At */}
              <div className="text-sm text-gray-900 flex-1">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {new Date(call.missedAt).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(call.missedAt).toLocaleTimeString()}
                </div>
              </div>

              {/* Duration */}
              <div className="text-sm text-gray-900 flex-1">
                {call.duration}
              </div>

              {/* Status */}
              <div className="flex-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(call.status)}`}>
                  {getStatusText(call.status)}
                </span>
              </div>

              {/* Assigned Agent */}
              <div className="text-sm text-gray-900 flex-1">
                {call.agentName || 'Unassigned'}
              </div>

              {/* Callback */}
              <div className="text-sm text-gray-900 flex-1">
                {call.callbackScheduled ? (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {new Date(call.callbackScheduled).toLocaleDateString()}
                  </div>
                ) : (
                  <span className="text-gray-400">Not scheduled</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleEditCall(call)}
                  className="text-blue-600 hover:text-blue-900 transition-colors"
                  title="Edit call"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button
                  className="text-green-600 hover:text-green-900 transition-colors"
                  title="Call back"
                >
                  <PhoneCall className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          emptyStateText="No missed calls found"
          emptyStateAnimation="/No_Data_Preview.lottie"
          onAddNew={handleAddNewCall}
          addNewText="Add Missed Call"
          showAddPanel={showAddPanel}
          onCloseAddPanel={() => setShowAddPanel(false)}
          addPanelTitle="Add New Missed Call"
          addPanelContent={
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caller Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter caller name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter notes about the call"
                />
              </div>
            </div>
          }
          showEditPanel={showEditPanel}
          onCloseEditPanel={() => setShowEditPanel(false)}
          editPanelTitle="Edit Missed Call"
          editPanelContent={
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="ignored">Ignored</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Agent
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select agent</option>
                  <option value="sarah">Sarah Johnson</option>
                  <option value="mike">Mike Chen</option>
                  <option value="lisa">Lisa Brown</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Callback Scheduled
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          }
        />
      </motion.div>
    </div>
  );
};

export default MissedCallsPage;
