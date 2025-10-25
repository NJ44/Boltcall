import React from 'react';
import { FileUploadDemo } from '../components/ui/file-upload-demo';

const FileUploadDemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              File Upload Component Demo
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Interactive file upload with drag & drop functionality
            </p>
          </div>
          
          <FileUploadDemo />
          
          <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Features
            </h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• Drag and drop file upload</li>
              <li>• Click to browse files</li>
              <li>• File preview with size and type information</li>
              <li>• Smooth animations with Framer Motion</li>
              <li>• Dark mode support</li>
              <li>• Responsive design</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadDemoPage;
