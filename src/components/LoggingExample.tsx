import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addLogEntry, logUserAction, logSystemEvent, logError } from '../lib/logging';

/**
 * Example component showing how to use the logging functionality
 * This can be imported and used in any component that needs logging
 */
const LoggingExample: React.FC = () => {
  const { user } = useAuth();

  const handleUserAction = async () => {
    if (user?.id) {
      await logUserAction('Button Click', 'User clicked example button', user.id);
    }
  };

  const handleSystemEvent = async () => {
    if (user?.id) {
      await logSystemEvent('Data Processing', 'Started processing user data', user.id);
    }
  };

  const handleError = async () => {
    if (user?.id) {
      await logError('Validation Failed', 'User input validation failed', user.id);
    }
  };

  const handleCustomLog = async () => {
    if (user?.id) {
      await addLogEntry('Custom Event', 'This is a custom log entry', user.id);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Logging Examples</h3>
      <div className="space-x-2">
        <button 
          onClick={handleUserAction}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Log User Action
        </button>
        <button 
          onClick={handleSystemEvent}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Log System Event
        </button>
        <button 
          onClick={handleError}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Log Error
        </button>
        <button 
          onClick={handleCustomLog}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Custom Log
        </button>
      </div>
    </div>
  );
};

export default LoggingExample;
