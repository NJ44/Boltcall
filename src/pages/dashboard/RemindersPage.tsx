import React, { useState } from 'react';
import { Clock, Edit, Trash2, Calendar, User, Phone, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CardTableWithPanel from '../../components/ui/CardTableWithPanel';

interface Reminder {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  appointmentDate: string;
  appointmentTime: string;
  service: string;
  status: 'active' | 'inactive';
  reminderTime: string;
  reminderText: string;
  reminderSent: boolean;
  createdAt: string;
  notes?: string;
}

const RemindersPage: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      clientName: 'John Smith',
      clientPhone: '+1 (555) 123-4567',
      clientEmail: 'john@example.com',
      appointmentDate: '2024-01-15',
      appointmentTime: '10:00 AM',
      service: 'Dental Cleaning',
      status: 'active',
      reminderTime: '24 hours before',
      reminderText: 'Hi John, this is a reminder about your dental cleaning appointment tomorrow at 10:00 AM. Please arrive 10 minutes early.',
      reminderSent: true,
      createdAt: '2024-01-10',
      notes: 'Regular cleaning appointment'
    },
    {
      id: '2',
      clientName: 'Sarah Johnson',
      clientPhone: '+1 (555) 987-6543',
      clientEmail: 'sarah@example.com',
      appointmentDate: '2024-01-16',
      appointmentTime: '2:00 PM',
      service: 'Consultation',
      status: 'active',
      reminderTime: '2 hours before',
      reminderText: 'Hello Sarah, your consultation appointment is scheduled for today at 2:00 PM. We look forward to seeing you!',
      reminderSent: false,
      createdAt: '2024-01-12',
      notes: 'Initial consultation'
    },
    {
      id: '3',
      clientName: 'Mike Wilson',
      clientPhone: '+1 (555) 456-7890',
      clientEmail: 'mike@example.com',
      appointmentDate: '2024-01-18',
      appointmentTime: '9:30 AM',
      service: 'Follow-up',
      status: 'inactive',
      reminderTime: '48 hours before',
      reminderText: 'Hi Mike, this is a reminder about your follow-up appointment on January 18th at 9:30 AM.',
      reminderSent: true,
      createdAt: '2024-01-14',
      notes: 'Post-treatment follow-up'
    }
  ]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [editingReminder, setEditingReminder] = useState<Partial<Reminder>>({});
  
  // Sliding panel states
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);

  const handleDeleteReminder = (id: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
    setShowDeleteModal(false);
    setSelectedReminder(null);
  };

  const handleRescheduleReminder = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setShowEditPanel(true);
  };

  const handleAddNewReminder = () => {
    setEditingReminder({});
    setShowAddPanel(true);
  };

  const handleSaveReminder = () => {
    if (editingReminder.id) {
      setReminders(reminders.map(r => 
        r.id === editingReminder.id ? { ...r, ...editingReminder } as Reminder : r
      ));
    } else {
      const newReminder: Reminder = {
        id: Date.now().toString(),
        ...editingReminder as Omit<Reminder, 'id'>
      };
      setReminders([...reminders, newReminder]);
    }
    setShowEditModal(false);
    setShowAddPanel(false);
    setShowEditPanel(false);
    setEditingReminder({});
  };

  return (
    <div className="space-y-6">

      {/* Reminders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <CardTableWithPanel
          data={reminders}
          columns={[
            { key: 'client', label: 'Client & Service', width: '25%' },
            { key: 'appointment', label: 'Appointment', width: '20%' },
            { key: 'status', label: 'Status', width: '15%' },
            { key: 'timing', label: 'Reminder Timing', width: '15%' },
            { key: 'text', label: 'Reminder Text', width: '20%' },
            { key: 'actions', label: 'Actions', width: '5%' }
          ]}
          renderRow={(reminder) => (
            <div className="flex items-center gap-6">
              {/* Checkbox */}
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              
              {/* Client & Service */}
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{reminder.clientName}</div>
                  <div className="text-sm text-gray-500">{reminder.service}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{reminder.clientPhone}</span>
                  </div>
                </div>
              </div>
              
              {/* Appointment */}
              <div className="flex items-center gap-2 flex-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-900">{reminder.appointmentDate}</div>
                  <div className="text-sm text-gray-500">{reminder.appointmentTime}</div>
                </div>
              </div>
              
              {/* Status */}
              <div className="flex items-center gap-2 flex-1">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  reminder.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {reminder.status}
                </span>
                {reminder.reminderSent && (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    Sent
                  </span>
                )}
              </div>
              
              {/* Reminder Timing */}
              <div className="flex items-center gap-2 flex-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-900">{reminder.reminderTime}</span>
              </div>
              
              {/* Reminder Text */}
              <div className="text-sm text-gray-900 flex-1 truncate">
                {reminder.reminderText}
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRescheduleReminder(reminder)}
                  className="text-blue-600 hover:text-blue-900 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedReminder(reminder);
                    setShowDeleteModal(true);
                  }}
                  className="text-red-600 hover:text-red-900 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          emptyStateText="No reminders found"
          emptyStateAnimation="/No_Data_Preview.lottie"
          onAddNew={handleAddNewReminder}
          addNewText="Add Reminder"
          showAddPanel={showAddPanel}
          onCloseAddPanel={() => setShowAddPanel(false)}
          addPanelTitle="Add New Reminder"
          addPanelContent={
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                  <input
                    type="text"
                    value={editingReminder.clientName || ''}
                    onChange={(e) => setEditingReminder({ ...editingReminder, clientName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Phone</label>
                  <input
                    type="tel"
                    value={editingReminder.clientPhone || ''}
                    onChange={(e) => setEditingReminder({ ...editingReminder, clientPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client Email</label>
                <input
                  type="email"
                  value={editingReminder.clientEmail || ''}
                  onChange={(e) => setEditingReminder({ ...editingReminder, clientEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Date</label>
                  <input
                    type="date"
                    value={editingReminder.appointmentDate || ''}
                    onChange={(e) => setEditingReminder({ ...editingReminder, appointmentDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Time</label>
                  <input
                    type="time"
                    value={editingReminder.appointmentTime || ''}
                    onChange={(e) => setEditingReminder({ ...editingReminder, appointmentTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                <input
                  type="text"
                  value={editingReminder.service || ''}
                  onChange={(e) => setEditingReminder({ ...editingReminder, service: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter service type"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Time</label>
                <select
                  value={editingReminder.reminderTime || ''}
                  onChange={(e) => setEditingReminder({ ...editingReminder, reminderTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select reminder time</option>
                  <option value="1 hour before">1 hour before</option>
                  <option value="2 hours before">2 hours before</option>
                  <option value="4 hours before">4 hours before</option>
                  <option value="24 hours before">24 hours before</option>
                  <option value="48 hours before">48 hours before</option>
                  <option value="72 hours before">72 hours before</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Message</label>
                <textarea
                  value={editingReminder.reminderText || ''}
                  onChange={(e) => setEditingReminder({ ...editingReminder, reminderText: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter reminder message"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={editingReminder.notes || ''}
                  onChange={(e) => setEditingReminder({ ...editingReminder, notes: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter any additional notes"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setShowAddPanel(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSaveReminder}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Reminder
                </button>
              </div>
            </div>
          }
          showEditPanel={showEditPanel}
          onCloseEditPanel={() => setShowEditPanel(false)}
          editPanelTitle="Edit Reminder"
          editPanelContent={
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                  <input
                    type="text"
                    value={editingReminder.clientName || ''}
                    onChange={(e) => setEditingReminder({ ...editingReminder, clientName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Phone</label>
                  <input
                    type="tel"
                    value={editingReminder.clientPhone || ''}
                    onChange={(e) => setEditingReminder({ ...editingReminder, clientPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client Email</label>
                <input
                  type="email"
                  value={editingReminder.clientEmail || ''}
                  onChange={(e) => setEditingReminder({ ...editingReminder, clientEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Date</label>
                  <input
                    type="date"
                    value={editingReminder.appointmentDate || ''}
                    onChange={(e) => setEditingReminder({ ...editingReminder, appointmentDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Time</label>
                  <input
                    type="time"
                    value={editingReminder.appointmentTime || ''}
                    onChange={(e) => setEditingReminder({ ...editingReminder, appointmentTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                <input
                  type="text"
                  value={editingReminder.service || ''}
                  onChange={(e) => setEditingReminder({ ...editingReminder, service: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Time</label>
                <select
                  value={editingReminder.reminderTime || ''}
                  onChange={(e) => setEditingReminder({ ...editingReminder, reminderTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1 hour before">1 hour before</option>
                  <option value="2 hours before">2 hours before</option>
                  <option value="4 hours before">4 hours before</option>
                  <option value="24 hours before">24 hours before</option>
                  <option value="48 hours before">48 hours before</option>
                  <option value="72 hours before">72 hours before</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Message</label>
                <textarea
                  value={editingReminder.reminderText || ''}
                  onChange={(e) => setEditingReminder({ ...editingReminder, reminderText: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={editingReminder.notes || ''}
                  onChange={(e) => setEditingReminder({ ...editingReminder, notes: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setShowEditPanel(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSaveReminder}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          }
        />
      </motion.div>

      {/* Reminders Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Reminders Configuration</h2>
            <p className="text-sm text-gray-600">Configure your reminder settings and templates</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Default Reminder Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Default Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Reminder Time</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="24">24 hours before</option>
                  <option value="48">48 hours before</option>
                  <option value="72">72 hours before</option>
                  <option value="168">1 week before</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Message Template</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter your default reminder message template..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Reminders</label>
                  <p className="text-xs text-gray-500">Send reminders via email</p>
                </div>
                <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">SMS Reminders</label>
                  <p className="text-xs text-gray-500">Send reminders via SMS</p>
                </div>
                <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Auto-send Reminders</label>
                  <p className="text-xs text-gray-500">Automatically send reminders</p>
                </div>
                <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Reset to Defaults
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Save Configuration
          </button>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedReminder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Delete Reminder</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the reminder for {selectedReminder.clientName}'s appointment? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteReminder(selectedReminder.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit/Reschedule Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Reschedule Reminder</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Date</label>
                    <input
                      type="date"
                      value={editingReminder.appointmentDate || ''}
                      onChange={(e) => setEditingReminder({ ...editingReminder, appointmentDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
            </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Time</label>
                    <input
                      type="time"
                      value={editingReminder.appointmentTime || ''}
                      onChange={(e) => setEditingReminder({ ...editingReminder, appointmentTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
          </div>
        </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Timing</label>
                  <select
                    value={editingReminder.reminderTime || ''}
                    onChange={(e) => setEditingReminder({ ...editingReminder, reminderTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="1 hour before">1 hour before</option>
                    <option value="2 hours before">2 hours before</option>
                    <option value="4 hours before">4 hours before</option>
                    <option value="24 hours before">24 hours before</option>
                    <option value="48 hours before">48 hours before</option>
                    <option value="72 hours before">72 hours before</option>
                  </select>
      </div>

          <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Message</label>
                  <textarea
                    value={editingReminder.reminderText || ''}
                    onChange={(e) => setEditingReminder({ ...editingReminder, reminderText: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
          </div>
        </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveReminder}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
      </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RemindersPage;
