import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Play, X } from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';
import CardTableWithPanel from '@/components/ui/CardTableWithPanel';

const LeadReactivationPage: React.FC = () => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  const handleFileChange = async (files: File[]) => {
    const selectedFile = files[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setUploadStatus('uploading');

        try {
          // Read CSV file
          const text = await selectedFile.text();
          const lines = text.split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          const data = lines.slice(1)
            .filter(line => line.trim())
            .map(line => {
              const values = line.split(',').map(v => v.trim());
              const obj: any = {};
              headers.forEach((header, index) => {
                obj[header] = values[index] || '';
              });
              return obj;
            });

          setUploadedData(data);
          setUploadStatus('success');
          
          // Here you would typically send the data to your backend API
          // await uploadLeads(data);
        } catch (error) {
          console.error('Error uploading file:', error);
          setUploadStatus('error');
        }
      } else {
        alert('Please upload a CSV file');
      }
    }
  };

  // Get column headers from uploaded data
  const getColumns = () => {
    if (uploadedData.length === 0) return [];
    return Object.keys(uploadedData[0]).map(key => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
      width: '20%'
    }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Leads Table */}
      {uploadedData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6"
        >
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Uploaded Leads</h2>
              <p className="text-sm text-gray-600 mt-1">{uploadedData.length} leads ready for reactivation</p>
            </div>
            <button
              onClick={() => setShowCampaignModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Start Lead Reactivation
            </button>
          </div>
          <CardTableWithPanel
            hideSearch={true}
            data={uploadedData}
            columns={getColumns()}
            renderRow={(lead) => (
              <div className="flex items-center gap-6">
                {Object.values(lead).map((value: any, cellIndex) => (
                  <div key={cellIndex} className="text-sm text-gray-900 flex-1 truncate">
                    {String(value || '-')}
                  </div>
                ))}
              </div>
            )}
            emptyStateText="No leads uploaded yet"
          />
        </motion.div>
      )}

      {/* Upload Section - Smaller */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6"
      >
        <div className="max-w-2xl">
          <FileUpload onChange={handleFileChange} />
        </div>
      </motion.div>

      {/* Status Messages */}
      {uploadStatus === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3"
        >
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-green-800 font-medium">Upload Successful!</p>
            <p className="text-green-700 text-sm">
              {uploadedData.length} leads have been uploaded and are ready for reactivation.
            </p>
          </div>
        </motion.div>
      )}

      {uploadStatus === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3"
        >
          <XCircle className="w-5 h-5 text-red-600" />
          <div>
            <p className="text-red-800 font-medium">Upload Failed</p>
            <p className="text-red-700 text-sm">
              There was an error processing your file. Please check the format and try again.
            </p>
          </div>
        </motion.div>
      )}

      {/* Lead Reactivation Campaign Modal */}
      <AnimatePresence>
        {showCampaignModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed -inset-[200px] bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setShowCampaignModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Lead Reactivation Campaign
                    </h2>
                    <button
                      onClick={() => setShowCampaignModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Campaign Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter campaign name"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select Agent
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-black">
                        <option value="">Select an agent</option>
                        <option value="agent1">Agent 1</option>
                        <option value="agent2">Agent 2</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Message Template
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Enter your reactivation message..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setShowCampaignModal(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Start Campaign
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeadReactivationPage;

