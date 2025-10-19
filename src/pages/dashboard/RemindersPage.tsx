import React, { useState } from 'react';
import { Clock, Save, MessageSquare, Bot, Plus, Edit, Trash2, Calendar, User, Phone, Mail } from 'lucide-react';
import Button from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

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
      clientEmail: 'john.smith@email.com',
      appointmentDate: '2024-01-15',
      appointmentTime: '10:00 AM',
      service: 'Dental Cleaning',
      status: 'active',
      reminderTime: '24 hours before',
      reminderText: 'Hi John! This is a friendly reminder about your dental cleaning appointment tomorrow at 10:00 AM. Please arrive 10 minutes early. If you need to reschedule, please call us at (555) 123-4567.',
      reminderSent: false,
      createdAt: '2024-01-10',
      notes: 'First time patient'
    },
    {
      id: '2',
      clientName: 'Sarah Johnson',
      clientPhone: '+1 (555) 987-6543',
      clientEmail: 'sarah.j@email.com',
      appointmentDate: '2024-01-16',
      appointmentTime: '2:30 PM',
      service: 'HVAC Maintenance',
      status: 'active',
      reminderTime: '48 hours before',
      reminderText: 'Hello Sarah! Your HVAC maintenance appointment is scheduled for January 16th at 2:30 PM. Our technician will arrive within the scheduled time window. Please ensure access to your HVAC unit.',
      reminderSent: true,
      createdAt: '2024-01-08',
      notes: 'Annual maintenance'
    },
    {
      id: '3',
      clientName: 'Mike Davis',
      clientPhone: '+1 (555) 456-7890',
      clientEmail: 'mike.davis@email.com',
      appointmentDate: '2024-01-18',
      appointmentTime: '9:00 AM',
      service: 'Auto Repair',
      status: 'inactive',
      reminderTime: '24 hours before',
      reminderText: 'Hi Mike! Your car service appointment is tomorrow at 9:00 AM. Please bring your vehicle keys and any service records you have.',
      reminderSent: false,
      createdAt: '2024-01-12'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
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
    setShowCreateModal(false);
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reminders</h1>
          <p className="text-gray-600 mt-1">
            Manage appointment reminders and track their status.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
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
        className="bg-white rounded-lg border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client & Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Appointment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reminder Timing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reminder Text
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reminders.map((reminder, index) => (
                <motion.tr
                  key={reminder.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{reminder.clientName}</div>
                        <div className="text-sm text-gray-500">{reminder.service}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{reminder.clientPhone}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900">{reminder.appointmentDate}</div>
                        <div className="text-sm text-gray-500">{reminder.appointmentTime}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{reminder.reminderTime}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={reminder.reminderText}>
                      {reminder.reminderText}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRescheduleReminder(reminder)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        title="Reschedule"
                      >
                        <Edit className="w-4 h-4" />
                        Reschedule
                      </button>
                      <button
                        onClick={() => {
                          setSelectedReminder(reminder);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
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
