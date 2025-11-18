import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, XCircle, Download, AlertCircle } from 'lucide-react';

const LeadReactivationPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadedData, setUploadedData] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setUploadStatus('idle');
      } else {
        alert('Please upload a CSV file');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploadStatus('uploading');

    try {
      // Read CSV file
      const text = await file.text();
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
  };

  const handleDownloadTemplate = () => {
    const template = 'Name,Email,Phone,Company,Notes\nJohn Doe,john@example.com,555-1234,Acme Corp,Previous customer\nJane Smith,jane@example.com,555-5678,Tech Inc,Interested in product';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lead-reactivation-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lead Reactivation</h1>
        <p className="text-gray-600">
          Upload a CSV file with lead information to reactivate and re-engage with previous leads.
        </p>
      </div>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload CSV File</h2>
        
        <div className="space-y-4">
          {/* File Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select CSV File
            </label>
            <div className="flex items-center gap-4">
              <label className="flex-1 cursor-pointer">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex items-center justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {file ? file.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">CSV files only</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Template Download */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <AlertCircle className="w-4 h-4" />
            <span>Need a template?</span>
            <button
              onClick={handleDownloadTemplate}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              Download CSV Template
            </button>
          </div>

          {/* Upload Button */}
          <div className="flex justify-end">
            <button
              onClick={handleUpload}
              disabled={!file || uploadStatus === 'uploading'}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {uploadStatus === 'uploading' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload and Process
                </>
              )}
            </button>
          </div>
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

      {/* Uploaded Data Preview */}
      {uploadStatus === 'success' && uploadedData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-gray-200 shadow-sm p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Uploaded Leads Preview
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(uploadedData[0]).map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {uploadedData.slice(0, 10).map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {Object.values(row).map((value: any, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-4 py-3 text-sm text-gray-900"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {uploadedData.length > 10 && (
              <p className="text-sm text-gray-500 mt-4 text-center">
                Showing first 10 of {uploadedData.length} leads
              </p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LeadReactivationPage;

