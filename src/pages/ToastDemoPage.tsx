import React from 'react';
import ToastDemo from '../components/ToastDemo';

const ToastDemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Toast Notification Demo
          </h1>
          <p className="text-gray-600">
            Interactive demonstration of the toast notification system
          </p>
        </div>
        <ToastDemo />
      </div>
    </div>
  );
};

export default ToastDemoPage;
