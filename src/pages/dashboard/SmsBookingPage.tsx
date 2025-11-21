import React, { useState, useEffect } from 'react';
import { MessageSquare, Edit, Trash2, Calendar, Phone, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CardTableWithPanel from '../../components/ui/CardTableWithPanel';
import { Magnetic } from '../../components/ui/magnetic';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface SmsBooking {
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

const SmsBookingPage: React.FC = () => {
  const [phoneNumbers, setPhoneNumbers] = useState<Array<{ id: string; number: string }>>([]);
  const [agents, setAgents] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');
  
  const [smsBookings, setSmsBookings] = useState<SmsBooking[]>([
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<SmsBooking | null>(null);
  const [editingBooking, setEditingBooking] = useState<Partial<SmsBooking>>({});

  // Fetch phone numbers and agents
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch phone numbers
        const { data: phoneData, error: phoneError } = await supabase
          .from('phone_numbers')
          .select('id, phone_number');

        if (!phoneError && phoneData) {
          setPhoneNumbers(phoneData.map(p => ({ id: p.id, number: p.phone_number || '' })));
        }

        // Fetch agents
        const { data: agentData, error: agentError } = await supabase
          .from('agents')
          .select('id, name');

        if (!agentError && agentData) {
          setAgents(agentData.map(a => ({ id: a.id, name: a.name || '' })));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteBooking = (id: string) => {
    setSmsBookings(smsBookings.filter(booking => booking.id !== id));
    setShowDeleteModal(false);
    setSelectedBooking(null);
  };

  const handleRescheduleBooking = (booking: SmsBooking) => {
    setEditingBooking(booking);
    setShowEditModal(true);
  };

  const handleSaveBooking = () => {
    if (editingBooking.id) {
      setSmsBookings(smsBookings.map(b => 
        b.id === editingBooking.id ? { ...b, ...editingBooking } as SmsBooking : b
      ));
    } else {
      const newBooking: SmsBooking = {
        id: Date.now().toString(),
        ...editingBooking as Omit<SmsBooking, 'id'>
      };
      setSmsBookings([...smsBookings, newBooking]);
    }
    setShowEditModal(false);
    setEditingBooking({});
  };

  return (
    <div className="space-y-6">
      {/* SMS Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <CardTableWithPanel
          data={smsBookings}
          columns={[
            { key: 'client', label: 'Client & Service', width: '25%' },
            { key: 'appointment', label: 'Appointment', width: '20%' },
            { key: 'status', label: 'Status', width: '15%' },
            { key: 'timing', label: 'Reminder Timing', width: '15%' },
            { key: 'text', label: 'Reminder Text', width: '20%' },
            { key: 'actions', label: 'Actions', width: '5%' }
          ]}
          renderRow={(booking) => (
            <div className="flex items-center gap-6">
              {/* Client & Service */}
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{booking.clientName}</div>
                  <div className="text-sm text-gray-500">{booking.service}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{booking.clientPhone}</span>
                  </div>
                </div>
              </div>
              
              {/* Appointment */}
              <div className="flex items-center gap-2 flex-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-900">{booking.appointmentDate}</div>
                  <div className="text-sm text-gray-500">{booking.appointmentTime}</div>
                </div>
              </div>
              
              {/* Status */}
              <div className="flex items-center gap-2 flex-1">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  booking.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {booking.status}
                </span>
                {booking.reminderSent && (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    Sent
                  </span>
                )}
              </div>
              
              {/* Reminder Timing */}
              <div className="flex items-center gap-2 flex-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-900">{booking.reminderTime}</span>
              </div>
              
              {/* Reminder Text */}
              <div className="text-sm text-gray-900 flex-1 truncate">
                {booking.reminderText}
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRescheduleBooking(booking)}
                  className="text-blue-600 hover:text-blue-900 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedBooking(booking);
                    setShowDeleteModal(true);
                  }}
                  className="text-red-600 hover:text-red-900 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          emptyStateText="No SMS bookings found"
          emptyStateAnimation="/No_Data_Preview.lottie"
          onAddNew={() => {
            setSelectedPhoneNumber('');
            setSelectedAgent('');
            setShowAddModal(true);
          }}
          addNewText="Add SMS Booking"
        />
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed -inset-[200px] bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Delete SMS Booking</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the SMS booking for {selectedBooking.clientName}'s appointment? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteBooking(selectedBooking.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add SMS Booking Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed -inset-[200px] bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Add SMS Booking</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Choose Phone Number</label>
                  <select
                    value={selectedPhoneNumber}
                    onChange={(e) => setSelectedPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  >
                    <option value="">Select a phone number</option>
                    {phoneNumbers.map((phone) => (
                      <option key={phone.id} value={phone.id} className="text-black">
                        {phone.number}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Choose Agent</label>
                  <select
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  >
                    <option value="">Select an agent</option>
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id} className="text-black">
                        {agent.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (selectedPhoneNumber && selectedAgent) {
                      // Handle the save logic here
                      setShowAddModal(false);
                    }
                  }}
                  disabled={!selectedPhoneNumber || !selectedAgent}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Save
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
            className="fixed -inset-[200px] bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Reschedule SMS Booking</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Date</label>
                    <input
                      type="date"
                      value={editingBooking.appointmentDate || ''}
                      onChange={(e) => setEditingBooking({ ...editingBooking, appointmentDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Time</label>
                    <input
                      type="time"
                      value={editingBooking.appointmentTime || ''}
                      onChange={(e) => setEditingBooking({ ...editingBooking, appointmentTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Timing</label>
                  <select
                    value={editingBooking.reminderTime || ''}
                    onChange={(e) => setEditingBooking({ ...editingBooking, reminderTime: e.target.value })}
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
                    value={editingBooking.reminderText || ''}
                    onChange={(e) => setEditingBooking({ ...editingBooking, reminderText: e.target.value })}
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
                <Magnetic>
                  <button
                    onClick={handleSaveBooking}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </Magnetic>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmsBookingPage;
