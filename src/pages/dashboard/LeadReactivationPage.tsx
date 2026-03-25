import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Play, Link2, Loader2 } from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';
import { PopButton } from '../../components/ui/pop-button';
import CardTableWithPanel from '@/components/ui/CardTableWithPanel';
import ModalShell from '../../components/ui/modal-shell';

const CRM_PROVIDERS = [
  {
    id: 'hubspot',
    name: 'HubSpot',
    color: '#FF7A59',
    logo: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M17.58 10.1V7.04a2.26 2.26 0 0 0 1.3-2.04 2.27 2.27 0 0 0-2.27-2.27 2.27 2.27 0 0 0-2.27 2.27c0 .9.53 1.67 1.3 2.04v3.06a5.1 5.1 0 0 0-2.4 1.18l-6.4-4.99a2.73 2.73 0 0 0 .08-.63A2.7 2.7 0 0 0 4.22 1 2.7 2.7 0 0 0 1.5 3.66a2.7 2.7 0 0 0 2.72 2.66c.56 0 1.08-.17 1.52-.46l6.28 4.9a5.12 5.12 0 0 0-.5 2.2 5.16 5.16 0 0 0 .6 2.42l-1.9 1.9a2.04 2.04 0 0 0-.6-.1 2.05 2.05 0 0 0-2.06 2.05 2.05 2.05 0 0 0 2.06 2.04 2.05 2.05 0 0 0 2.05-2.04c0-.22-.03-.42-.1-.61l1.86-1.86a5.14 5.14 0 1 0 4.13-8.66zm-.97 7.2a2.6 2.6 0 0 1-2.6-2.6 2.6 2.6 0 0 1 2.6-2.6 2.6 2.6 0 0 1 2.6 2.6 2.6 2.6 0 0 1-2.6 2.6z"/>
      </svg>
    ),
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    color: '#00A1E0',
    logo: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M10.05 4.65a4.34 4.34 0 0 1 3.28-1.5c1.73 0 3.24 1 3.95 2.47a4.95 4.95 0 0 1 1.9-.38c2.76 0 5 2.25 5 5.02a5.01 5.01 0 0 1-5 5.01h-.18a3.9 3.9 0 0 1-3.4 2 3.88 3.88 0 0 1-1.85-.47 4.54 4.54 0 0 1-3.9 2.23 4.56 4.56 0 0 1-3.2-1.32 4.3 4.3 0 0 1-3.05 1.26A4.32 4.32 0 0 1 0 14.67c0-1.5.78-2.83 1.95-3.59a4.1 4.1 0 0 1-.37-1.72 4.15 4.15 0 0 1 4.14-4.14c1.62 0 3.04.93 3.73 2.28.18-.3.38-.58.6-.85z"/>
      </svg>
    ),
  },
  {
    id: 'zoho',
    name: 'Zoho CRM',
    color: '#E42527',
    logo: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M5.6 2.4L0 12l5.6 9.6h12.8L24 12 18.4 2.4H5.6zm6.4 14.7c-2.8 0-5.1-2.3-5.1-5.1S9.2 6.9 12 6.9s5.1 2.3 5.1 5.1-2.3 5.1-5.1 5.1z"/>
      </svg>
    ),
  },
  {
    id: 'pipedrive',
    name: 'Pipedrive',
    color: '#21A366',
    logo: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5v-3.07c-1.72-.46-3-2-3-3.93 0-2.21 1.79-4 4-4s4 1.79 4 4c0 1.93-1.28 3.47-3 3.93V17.5h-2zm1-5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
      </svg>
    ),
  },
] as const;

const LeadReactivationPage: React.FC = () => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [connectingCrm, setConnectingCrm] = useState<string | null>(null);
  const [connectedCrms, setConnectedCrms] = useState<string[]>([]);

  const handleCrmConnect = async (providerId: string) => {
    if (connectedCrms.includes(providerId)) {
      // Already connected — trigger import
      // TODO: Implement actual CRM lead import via API
      return;
    }

    setConnectingCrm(providerId);
    // Simulate OAuth connection flow
    // TODO: Replace with actual OAuth redirect / popup
    setTimeout(() => {
      setConnectedCrms(prev => [...prev, providerId]);
      setConnectingCrm(null);
    }, 1500);
  };

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
            <PopButton
              color="blue"
              onClick={() => setShowCampaignModal(true)}
              className="gap-2"
            >
              <Play className="w-4 h-4" />
              Start Lead Reactivation
            </PopButton>
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

      {/* CRM Import Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6"
      >
        <div className="flex items-center gap-2 mb-1">
          <Link2 className="w-5 h-5 text-gray-700" />
          <h3 className="text-base font-semibold text-gray-900">Import from CRM</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Connect your CRM to import leads directly.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CRM_PROVIDERS.map((provider) => {
            const isConnected = connectedCrms.includes(provider.id);
            const isConnecting = connectingCrm === provider.id;

            return (
              <button
                key={provider.id}
                onClick={() => handleCrmConnect(provider.id)}
                disabled={isConnecting}
                className={`
                  relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-150
                  ${isConnected
                    ? 'border-green-300 bg-green-50 hover:bg-green-100'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }
                  ${isConnecting ? 'opacity-70 cursor-wait' : 'cursor-pointer'}
                `}
              >
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-lg"
                  style={{ color: provider.color, backgroundColor: `${provider.color}14` }}
                >
                  {isConnecting ? (
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  ) : (
                    provider.logo
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">{provider.name}</span>
                {isConnected && (
                  <span className="absolute top-2 right-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </span>
                )}
                {isConnected ? (
                  <span className="text-xs text-green-600 font-medium">Import Leads</span>
                ) : (
                  <span className="text-xs text-gray-400">Connect</span>
                )}
              </button>
            );
          })}
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
      <ModalShell
        open={showCampaignModal}
        onClose={() => setShowCampaignModal(false)}
        title="Lead Reactivation Campaign"
        maxWidth="max-w-2xl"
        footer={
          <>
            <PopButton
              onClick={() => setShowCampaignModal(false)}
              size="sm"
            >
              Cancel
            </PopButton>
            <PopButton
              color="blue"
              size="sm"
            >
              Start Campaign
            </PopButton>
          </>
        }
      >
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
        </div>
      </ModalShell>
    </div>
  );
};

export default LeadReactivationPage;
