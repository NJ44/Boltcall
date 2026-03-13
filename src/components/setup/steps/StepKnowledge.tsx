import React, { useState } from 'react';
import { FileText, BookOpen, Loader2, CheckCircle, X } from 'lucide-react';
import { useSetupStore } from '../../../stores/setupStore';
import { useToast } from '../../../contexts/ToastContext';
import { supabase } from '../../../lib/supabase';
import StyledInput from '../../ui/StyledInput';
import { FileUploadCompact } from '../../ui/file-upload-compact';

const StepKnowledge: React.FC = () => {
  const { businessProfile, updateBusinessProfile, knowledgeBase, updateKnowledgeBase, account } = useSetupStore();
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (files: File[]) => {
    if (!files.length) return;
    setUploading(true);

    const uploaded: Array<{ name: string; url: string; status: 'indexed' | 'pending' }> = [];

    for (const file of files) {
      try {
        const filePath = `${account.userId || 'anonymous'}/${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('knowledge-base')
          .upload(filePath, file, { upsert: true });

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from('knowledge-base')
          .getPublicUrl(data.path);

        uploaded.push({
          name: file.name,
          url: urlData.publicUrl,
          status: 'pending',
        });
      } catch (error: any) {
        console.error(`Failed to upload ${file.name}:`, error);
        showToast({
          title: 'Upload Failed',
          message: `Could not upload ${file.name}: ${error.message}`,
          variant: 'error',
          duration: 4000,
        });
      }
    }

    if (uploaded.length > 0) {
      updateKnowledgeBase({
        uploadedFiles: [...knowledgeBase.uploadedFiles, ...uploaded],
      });
      showToast({
        title: 'Files Uploaded',
        message: `${uploaded.length} file(s) uploaded successfully`,
        variant: 'success',
        duration: 3000,
      });
    }

    setUploading(false);
  };

  const handleRemoveFile = (index: number) => {
    const updated = knowledgeBase.uploadedFiles.filter((_, i) => i !== index);
    updateKnowledgeBase({ uploadedFiles: updated });
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
            {uploading && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
          </div>
        </label>
        <FileUploadCompact onChange={handleFileUpload} />

        {/* Uploaded files list */}
        {knowledgeBase.uploadedFiles.length > 0 && (
          <div className="space-y-2 mt-3">
            {knowledgeBase.uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate">{file.name}</span>
                </div>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        )}
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
