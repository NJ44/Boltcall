import React, { useState, useMemo } from 'react';
import { FileText, BookOpen, Loader2, CheckCircle, CheckCircle2, Circle, AlertTriangle, Target, ChevronDown, ChevronUp, X, Plus, HelpCircle, Shield, Wrench } from 'lucide-react';
import { useSetupStore } from '../../../stores/setupStore';
import { useToast } from '../../../contexts/ToastContext';
import { supabase } from '../../../lib/supabase';
import StyledInput from '../../ui/StyledInput';
import { FileUploadCompact } from '../../ui/file-upload-compact';
import Button from '../../ui/Button';
import { calculateKBCompleteness } from '../kbCompleteness';

const StepKnowledge: React.FC = () => {
  const { businessProfile, updateBusinessProfile, knowledgeBase, updateKnowledgeBase, account } = useSetupStore();
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);

  // KB Completeness
  const completeness = useMemo(
    () => calculateKBCompleteness(businessProfile, knowledgeBase),
    [businessProfile, knowledgeBase]
  );
  const [bannerExpanded, setBannerExpanded] = useState(completeness.score < 70);

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

  // ── Services helpers ──
  const handleAddService = () => {
    updateKnowledgeBase({
      services: [...knowledgeBase.services, { name: '', duration: 30, price: 0 }],
    });
  };

  const handleUpdateService = (index: number, field: string, value: string | number) => {
    const updated = [...knowledgeBase.services];
    updated[index] = { ...updated[index], [field]: value };
    updateKnowledgeBase({ services: updated });
  };

  const handleRemoveService = (index: number) => {
    updateKnowledgeBase({
      services: knowledgeBase.services.filter((_, i) => i !== index),
    });
  };

  // ── FAQ helpers ──
  const handleAddFaq = () => {
    updateKnowledgeBase({
      faqs: [...knowledgeBase.faqs, { question: '', answer: '' }],
    });
  };

  const handleUpdateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...knowledgeBase.faqs];
    updated[index] = { ...updated[index], [field]: value };
    updateKnowledgeBase({ faqs: updated });
  };

  const handleRemoveFaq = (index: number) => {
    updateKnowledgeBase({
      faqs: knowledgeBase.faqs.filter((_, i) => i !== index),
    });
  };

  const barColor =
    completeness.score >= 70
      ? 'bg-green-500'
      : completeness.score >= 40
      ? 'bg-yellow-500'
      : 'bg-red-500';

  const borderColor =
    completeness.score >= 70
      ? 'border-green-200'
      : completeness.score >= 40
      ? 'border-yellow-200'
      : 'border-red-200';

  const bgColor =
    completeness.score >= 70
      ? 'bg-green-50'
      : completeness.score >= 40
      ? 'bg-yellow-50'
      : 'bg-red-50';

  return (
    <div className="space-y-8">
      {/* KB Completeness Banner */}
      <div className={`rounded-lg border ${borderColor} ${bgColor} overflow-hidden`}>
        <button
          type="button"
          onClick={() => setBannerExpanded((prev) => !prev)}
          className="w-full flex items-center justify-between px-4 py-3 text-left"
        >
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-gray-700" />
            <span className="font-medium text-gray-900">
              Knowledge Base Completeness: {completeness.score}%
            </span>
          </div>
          {bannerExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {/* Progress bar */}
        <div className="px-4 pb-2">
          <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${barColor}`}
              style={{ width: `${completeness.score}%` }}
            />
          </div>
        </div>

        {bannerExpanded && (
          <div className="px-4 pb-4 pt-1 space-y-1">
            {completeness.score < 70 && (
              <p className="flex items-center gap-1.5 text-sm text-gray-600 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                Your AI agent works better with more info:
              </p>
            )}
            {completeness.items.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm">
                {item.done ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                )}
                <span className={item.done ? 'text-gray-700' : 'text-gray-500'}>
                  {item.label}
                  {!item.done && item.hint && (
                    <span className="text-gray-400"> — {item.hint}</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Website input */}
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
        <p className="mt-1 text-sm text-gray-500">
          Your AI will scrape this to learn about your business automatically.
        </p>
      </div>

      {/* Services */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Services & Pricing
            </div>
          </h3>
          <Button onClick={handleAddService} variant="outline" size="sm" className="flex items-center gap-1">
            <Plus className="w-4 h-4" />
            Add Service
          </Button>
        </div>

        {knowledgeBase.services.length === 0 ? (
          <div className="text-center py-6 text-gray-500 border border-dashed border-gray-300 rounded-lg">
            <Wrench className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No services added yet.</p>
            <p className="text-xs">Add your services so the AI can quote prices to callers.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {knowledgeBase.services.map((service, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <StyledInput
                    type="text"
                    value={service.name}
                    onChange={(e) => handleUpdateService(index, 'name', e.target.value)}
                    placeholder="Service name"
                    name={`service-name-${index}`}
                  />
                </div>
                <div className="w-24">
                  <StyledInput
                    type="number"
                    value={String(service.duration)}
                    onChange={(e) => handleUpdateService(index, 'duration', parseInt(e.target.value) || 0)}
                    placeholder="Min"
                    name={`service-duration-${index}`}
                  />
                </div>
                <div className="w-24">
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      value={service.price}
                      onChange={(e) => handleUpdateService(index, 'price', parseInt(e.target.value) || 0)}
                      placeholder="Price"
                      className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                    />
                  </div>
                </div>
                <button onClick={() => handleRemoveService(index)} className="p-1 text-gray-400 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAQs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Frequently Asked Questions
            </div>
          </h3>
          <Button onClick={handleAddFaq} variant="outline" size="sm" className="flex items-center gap-1">
            <Plus className="w-4 h-4" />
            Add FAQ
          </Button>
        </div>

        {knowledgeBase.faqs.length === 0 ? (
          <div className="text-center py-6 text-gray-500 border border-dashed border-gray-300 rounded-lg">
            <HelpCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No FAQs added yet.</p>
            <p className="text-xs">Add common questions so the AI can answer them instantly.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {knowledgeBase.faqs.map((faq, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-2 relative">
                <button
                  onClick={() => handleRemoveFaq(index)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Question</label>
                  <StyledInput
                    type="text"
                    value={faq.question}
                    onChange={(e) => handleUpdateFaq(index, 'question', e.target.value)}
                    placeholder="Do you accept walk-ins?"
                    name={`faq-q-${index}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Answer</label>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => handleUpdateFaq(index, 'answer', e.target.value)}
                    placeholder="Yes, we accept walk-ins during business hours, but appointments are recommended."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Policies */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Business Policies
          </div>
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cancellation Policy</label>
            <textarea
              value={knowledgeBase.policies.cancellation}
              onChange={(e) => updateKnowledgeBase({ policies: { ...knowledgeBase.policies, cancellation: e.target.value } })}
              placeholder="24-hour notice required for cancellations..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reschedule Policy</label>
            <textarea
              value={knowledgeBase.policies.reschedule}
              onChange={(e) => updateKnowledgeBase({ policies: { ...knowledgeBase.policies, reschedule: e.target.value } })}
              placeholder="Appointments can be rescheduled up to 12 hours before..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deposit / Payment Policy</label>
            <textarea
              value={knowledgeBase.policies.deposit}
              onChange={(e) => updateKnowledgeBase({ policies: { ...knowledgeBase.policies, deposit: e.target.value } })}
              placeholder="A $50 deposit is required for new patients..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
            />
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

      {/* Tip */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Everything is optional</h4>
            <p className="text-sm text-blue-700">
              Your AI will learn from your website automatically. Services, FAQs, and policies make it smarter — you can always add or edit them later in the dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepKnowledge;
