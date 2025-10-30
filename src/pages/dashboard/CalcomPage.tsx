import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, ExternalLink, Calendar, Clock, Users } from 'lucide-react';

interface EventType {
  id: string;
  name: string;
  duration: number;
  description: string;
  price?: number;
  isActive: boolean;
}

const CalcomPage: React.FC = () => {
  const [eventTypes, setEventTypes] = useState<EventType[]>([
    {
      id: '1',
      name: 'Consultation Call',
      duration: 30,
      description: 'Initial consultation to discuss your needs',
      price: 0,
      isActive: true
    },
    {
      id: '2',
      name: 'Strategy Session',
      duration: 60,
      description: 'Deep dive strategy session',
      price: 150,
      isActive: true
    }
  ]);

  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEventType, setNewEventType] = useState({
    name: '',
    duration: 30,
    description: '',
    price: 0
  });

  const [connectOpen, setConnectOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const handleAddEventType = () => {
    if (newEventType.name.trim()) {
      const eventType: EventType = {
        id: Date.now().toString(),
        name: newEventType.name,
        duration: newEventType.duration,
        description: newEventType.description,
        price: newEventType.price,
        isActive: true
      };
      
      setEventTypes([...eventTypes, eventType]);
      setNewEventType({ name: '', duration: 30, description: '', price: 0 });
      setIsAddingEvent(false);
    }
  };

  const handleDeleteEventType = (id: string) => {
    setEventTypes(eventTypes.filter(event => event.id !== id));
  };

  const handleToggleEventType = (id: string) => {
    setEventTypes(eventTypes.map(event => 
      event.id === id ? { ...event, isActive: !event.isActive } : event
    ));
  };

  const handleOpenCalcom = () => {
    window.open('https://cal.com', '_blank');
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
        <div className="flex items-center gap-4">
          <img 
            src="/cal.com_logo.png" 
            alt="Cal.com" 
            className="w-10 h-10"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cal.com Integration</h1>
            <p className="text-gray-600">Manage your event types and scheduling settings</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${isConnected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
            {isConnected ? 'Connected' : 'Not Connected'}
          </span>
          <button
            onClick={() => setConnectOpen(true)}
            className="flex items-center gap-2 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Connect Cal.com
          </button>
          <button
            onClick={handleOpenCalcom}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Open Cal.com
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Event Types</p>
              <p className="text-2xl font-bold text-gray-900">{eventTypes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Events</p>
              <p className="text-2xl font-bold text-gray-900">
                {eventTypes.filter(event => event.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Duration</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(eventTypes.reduce((acc, event) => acc + event.duration, 0) / eventTypes.length)} min
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Event Types Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-lg border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Event Types</h2>
            <button
              onClick={() => setIsAddingEvent(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Event Type
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Add Event Type Form */}
          {isAddingEvent && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Event Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Name
                  </label>
                  <input
                    type="text"
                    value={newEventType.name}
                    onChange={(e) => setNewEventType({ ...newEventType, name: e.target.value })}
                    placeholder="e.g., Consultation Call"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <select
                    value={newEventType.duration}
                    onChange={(e) => setNewEventType({ ...newEventType, duration: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                    <option value={90}>90 minutes</option>
                    <option value={120}>120 minutes</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={newEventType.price}
                    onChange={(e) => setNewEventType({ ...newEventType, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newEventType.description}
                    onChange={(e) => setNewEventType({ ...newEventType, description: e.target.value })}
                    placeholder="Brief description of this event type"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleAddEventType}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Event Type
                </button>
                <button
                  onClick={() => setIsAddingEvent(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          {/* Event Types List */}
          <div className="space-y-4">
            {eventTypes.map((eventType) => (
              <motion.div
                key={eventType.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${eventType.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <div>
                    <h3 className="font-medium text-gray-900">{eventType.name}</h3>
                    <p className="text-sm text-gray-600">{eventType.description}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-500">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {eventType.duration} min
                      </span>
                      {(eventType.price ?? 0) > 0 && (
                        <span className="text-xs text-gray-500">
                          ${eventType.price ?? 0}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleEventType(eventType.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      eventType.isActive 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {eventType.isActive ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => handleDeleteEventType(eventType.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
            
            {eventTypes.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Event Types</h3>
                <p className="text-gray-600 mb-4">Create your first event type to get started with Cal.com integration.</p>
                <button
                  onClick={() => setIsAddingEvent(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Event Type
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Connect Drawer */}
      {connectOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConnectOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src="/cal.com_logo.png" alt="Cal.com" className="w-8 h-8" />
                <h2 className="text-lg font-semibold">Connect Cal.com</h2>
              </div>
              <button onClick={() => setConnectOpen(false)} className="text-gray-500 hover:text-gray-700">Close</button>
            </div>
            <p className="text-sm text-gray-600 mb-4">Paste your Cal.com API key to connect and manage event types from your account.</p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter Cal.com API key"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
            />
            <button
              onClick={() => { if (apiKey.trim()) { setIsConnected(true); setConnectOpen(false);} }}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Connect
            </button>
            <div className="mt-6 text-sm text-gray-600">
              After connecting, we’ll pull your event types and display them below. You can add new ones via the Cal.com API.
            </div>
          </div>
        </div>
      )}

      {/* Integration Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-blue-50 rounded-lg border border-blue-200 p-6"
      >
        <h3 className="text-lg font-medium text-blue-900 mb-2">How Cal.com Integration Works</h3>
        <p className="text-blue-800 mb-4">
          Your AI receptionist can automatically book appointments using your Cal.com event types. 
          When a customer wants to schedule a meeting, the AI will:
        </p>
        <ul className="list-disc list-inside text-blue-800 space-y-1">
          <li>Check your availability in real-time</li>
          <li>Present available time slots to the customer</li>
          <li>Book the appointment directly in your Cal.com calendar</li>
          <li>Send confirmation details to both you and the customer</li>
        </ul>
      </motion.div>

      {/* Embedded Calendar placeholder */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Calendar</h2>
        <iframe
          title="cal-embed"
          className="w-full h-[600px] rounded-md border"
          src={isConnected ? 'https://app.cal.com' : 'about:blank'}
        />
      </div>
    </div>
  );
};

export default CalcomPage;
