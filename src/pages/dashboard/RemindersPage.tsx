import React, { useState } from 'react';
import { Clock, Plus, Edit, Trash2, Calendar, User, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CardTable from '../../components/ui/CardTable';

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
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [editingReminder, setEditingReminder] = useState<Partial<Reminder>>({});

  const handleDeleteReminder = (id: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
    setShowDeleteModal(false);
    setSelectedReminder(null);
  };

  const handleRescheduleReminder = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setShowEditModal(true);
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
    setEditingReminder({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
            <button
          onClick={() => setShowEditModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Reminder
            </button>
      </motion.div>

      {/* Reminders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <CardTable
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
          onAddNew={() => setShowEditModal(true)}
          addNewText="Add Reminder"
        />
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
