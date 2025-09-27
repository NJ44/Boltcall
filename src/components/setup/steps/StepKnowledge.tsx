import React, { useState } from 'react';
import { FileText, Upload, CheckCircle, Clock } from 'lucide-react';
import { useSetupStore } from '../../../stores/setupStore';
import ServicesTable from '../forms/ServicesTable';

const StepKnowledge: React.FC = () => {
  const { knowledgeBase, updateKnowledgeBase } = useSetupStore();
  const [isUploading, setIsUploading] = useState(false);







  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/kb/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          updateKnowledgeBase({
            uploadedFiles: [...knowledgeBase.uploadedFiles, {
              name: file.name,
              url: data.url,
              status: 'pending' as const,
            }],
          });
        }
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsUploading(false);
    }
  };


  return (
    <div className="space-y-8">
      {/* Services */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Services</h3>
          <p className="text-gray-600 mb-6">
            Define the services your business offers. This helps your AI receptionist understand what customers can book and provide accurate information.
          </p>
          <ServicesTable
            services={knowledgeBase.services}
            onChange={(services) => updateKnowledgeBase({ services })}
          />
        </div>
      </div>

      {/* File Uploads */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Documents (Optional)</h3>
          <p className="text-gray-600 mb-6">
            Upload service brochures, policies, or other documents for your AI to reference when answering questions.
          </p>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h4 className="text-sm font-medium text-gray-900 mb-2">Upload PDFs or documents</h4>
                <p className="text-sm text-gray-500 mb-4">
                  Upload service brochures, policies, or other documents for your AI to reference
                </p>
                
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white ${isUploading ? 'pointer-events-none opacity-50' : 'hover:bg-gray-50'}`}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? 'Uploading...' : 'Choose Files'}
                </label>
              </div>
            </div>

            {/* Uploaded Files */}
            {knowledgeBase.uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900">Uploaded Files</h4>
                {knowledgeBase.uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{file.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {file.status === 'indexed' ? (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Indexed</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-yellow-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs">Processing</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default StepKnowledge;
