import React from 'react';
import { FileText, BookOpen } from 'lucide-react';
import { useSetupStore } from '../../../stores/setupStore';
import StyledInput from '../../ui/StyledInput';
import { FileUploadCompact } from '../../ui/file-upload-compact';
 

const StepKnowledge: React.FC = () => {
  const { businessProfile, updateBusinessProfile } = useSetupStore();
  
  const handleFileUpload = (files: File[]) => {
    console.log('Files uploaded:', files);
    // TODO: Handle file upload to store or API
  };

  return (
    <div className="space-y-8">
      {/* Website input only */}
      <div className="space-y-6">
        <div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Business website
                </div>
              </label>
              <StyledInput
                type="url"
                value={businessProfile.websiteUrl}
                onChange={(e) => updateBusinessProfile({ websiteUrl: e.target.value })}
                placeholder="https://yourbusiness.com"
                name="websiteUrl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Upload Documents (Optional)
          </div>
        </label>
        <FileUploadCompact onChange={handleFileUpload} />
      </div>

      {/* Document Upload Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Upload Documents</h4>
            <p className="text-sm text-blue-700">
              You can upload service brochures, policies, FAQs, and other documents here or in the dashboard after completing setup. This helps your AI provide more detailed and accurate information to your customers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepKnowledge;
