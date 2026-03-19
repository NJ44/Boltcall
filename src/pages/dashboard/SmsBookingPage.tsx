import React, { useState, useEffect } from 'react';
import { MessageSquare, Edit, Trash2, Calendar, Phone, Clock, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CardTableWithPanel from '../../components/ui/CardTableWithPanel';
import { Magnetic } from '../../components/ui/magnetic';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

/**
 * NOTE: There is no dedicated `bookings` or `sms_messages` table in Supabase yet.
 * SMS message history is fetched from Twilio via the twilio-sms Netlify function (action: 'list').
 * A dedicated Supabase `bookings` table that links Cal.com appointments to SMS reminders
 * would be a better long-term solution — it would allow per-user filtering, faster queries,
 * and offline/history tracking without hitting Twilio's API each time.
 */

interface TwilioMessage {
  sid: string;
  to: string;
  from: string;
  body: string;
  status: string;
  direction: string;
  date_sent: string | null;
  date_created: string;
}

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

/** Map a Twilio delivery status to a simplified status for the UI */
function mapTwilioStatus(twilioStatus: string): 'active' | 'inactive' {
  const deliveredStatuses = ['delivered', 'sent', 'queued', 'sending'];
  return deliveredStatuses.includes(twilioStatus) ? 'active' : 'inactive';
}

/** Convert a Twilio message into the SmsBooking shape used by the table */
function twilioMessageToBooking(msg: TwilioMessage): SmsBooking {
  const sentDate = msg.date_sent || msg.date_created;
  const dateObj = new Date(sentDate);
  const isDelivered = ['delivered', 'sent'].includes(msg.status);

  return {
    id: msg.sid,
    clientName: msg.to, // Twilio doesn't store names; show the phone number
    clientPhone: msg.to,
    clientEmail: '',
    appointmentDate: dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    appointmentTime: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    service: msg.direction === 'outbound-api' ? 'Outbound SMS' : 'Inbound SMS',
    status: mapTwilioStatus(msg.status),
    reminderTime: msg.status,
    reminderText: msg.body,
    reminderSent: isDelivered,
    createdAt: dateObj.toISOString(),
    notes: `From: ${msg.from}`,
  };
}

const SmsBookingPage: React.FC = () => {
  const { user } = useAuth();
  const [phoneNumbers, setPhoneNumbers] = useState<Array<{ id: string; number: string }>>([]);
  const [agents, setAgents] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');

  const [smsBookings, setSmsBookings] = useState<SmsBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<SmsBooking | null>(null);
  const [editingBooking, setEditingBooking] = useState<Partial<SmsBooking>>({});

  // Fetch SMS messages from Twilio via the Netlify function
  const fetchSmsMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/.netlify/functions/twilio-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list', limit: 50 }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to fetch SMS messages (${response.status})`);
      }

      const data = await response.json();
      const messages: TwilioMessage[] = data.messages || [];
      setSmsBookings(messages.map(twilioMessageToBooking));
    } catch (err: any) {
      console.error('Error fetching SMS messages:', err);
      setError(err.message || 'Failed to load SMS messages. Check Twilio configuration.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch phone numbers, agents, and SMS messages on mount
  useEffect(() => {
    const fetchSupabaseData = async () => {
      try {
        const { data: phoneData, error: phoneError } = await supabase
          .from('phone_numbers')
          .select('id, phone_number');

        if (!phoneError && phoneData) {
          setPhoneNumbers(phoneData.map(p => ({ id: p.id, number: p.phone_number || '' })));
        }

        const { data: agentData, error: agentError } = await supabase
          .from('agents')
          .select('id, name');

        if (!agentError && agentData) {
          setAgents(agentData.map(a => ({ id: a.id, name: a.name || '' })));
        }
      } catch (err) {
        console.error('Error fetching Supabase data:', err);
      }
    };

    fetchSupabaseData();
    fetchSmsMessages();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeleteBooking = (id: string) => {
    // Remove from local state only — Twilio messages cannot be deleted from the client
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

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              <span className="text-sm text-gray-600">Loading SMS messages...</span>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center gap-6">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-20" />
                  <div className="h-4 bg-gray-200 rounded w-16" />
                  <div className="flex-1 h-4 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={fetchSmsMessages}
            className="ml-auto flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      )}

      {/* SMS Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <CardTableWithPanel
          data={smsBookings}
          columns={[
            { key: 'client', label: 'Recipient & Type', width: '25%' },
            { key: 'appointment', label: 'Sent At', width: '20%' },
            { key: 'status', label: 'Status', width: '15%' },
            { key: 'timing', label: 'Delivery Status', width: '15%' },
            { key: 'text', label: 'Message', width: '20%' },
            { key: 'actions', label: 'Actions', width: '5%' }
          ]}
          renderRow={(booking) => (
            <div className="flex items-center gap-6">
              {/* Recipient & Type */}
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{booking.clientName}</div>
                  <div className="text-sm text-gray-500">{booking.service}</div>
                  {booking.notes && (
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{booking.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sent At */}
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
                  {booking.status === 'active' ? 'Delivered' : 'Failed'}
                </span>
                {booking.reminderSent && (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    Sent
                  </span>
                )}
              </div>

              {/* Delivery Status */}
              <div className="flex items-center gap-2 flex-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-900 capitalize">{booking.reminderTime}</span>
              </div>

              {/* Message */}
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
          emptyStateText="No SMS messages found"
          emptyStateAnimation="/No_Data_Preview.lottie"
          onAddNew={() => {
            setSelectedPhoneNumber('');
            setSelectedAgent('');
            setShowAddModal(true);
          }}
          addNewText="Send SMS"
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
              <h2 className="text-xl font-bold text-gray-900 mb-4">Remove SMS Record</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to remove the SMS record for {selectedBooking.clientPhone}? This only removes it from the list view.
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
                  Remove
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
              <h2 className="text-xl font-bold text-gray-900 mb-6">Send SMS</h2>

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
