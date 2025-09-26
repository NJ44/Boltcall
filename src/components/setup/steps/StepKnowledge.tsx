import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Trash2, Upload, Link, CheckCircle, Clock } from 'lucide-react';
import { useSetupStore } from '../../../stores/setupStore';
import Button from '../../ui/Button';
import ServicesTable from '../forms/ServicesTable';

const StepKnowledge: React.FC = () => {
  const { knowledgeBase, updateKnowledgeBase } = useSetupStore();
  const [isUploading, setIsUploading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);

  const handleAddFAQ = () => {
    const newFAQ = { question: '', answer: '' };
    updateKnowledgeBase({
      faqs: [...knowledgeBase.faqs, newFAQ],
    });
  };

  const handleUpdateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...knowledgeBase.faqs];
    updated[index] = { ...updated[index], [field]: value };
    updateKnowledgeBase({ faqs: updated });
  };

  const handleRemoveFAQ = (index: number) => {
    const updated = knowledgeBase.faqs.filter((_, i) => i !== index);
    updateKnowledgeBase({ faqs: updated });
  };

  const handleAddIntakeQuestion = () => {
    const newQuestion = '';
    updateKnowledgeBase({
      intakeQuestions: [...knowledgeBase.intakeQuestions, newQuestion],
    });
  };

  const handleUpdateIntakeQuestion = (index: number, value: string) => {
    const updated = [...knowledgeBase.intakeQuestions];
    updated[index] = value;
    updateKnowledgeBase({ intakeQuestions: updated });
  };

  const handleRemoveIntakeQuestion = (index: number) => {
    const updated = knowledgeBase.intakeQuestions.filter((_, i) => i !== index);
    updateKnowledgeBase({ intakeQuestions: updated });
  };

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

  const handleScrapeWebsite = async () => {
    setIsScraping(true);
    try {
      // TODO: Implement website scraping for FAQs
      const response = await fetch('/api/kb/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: 'https://example.com' }),
      });

      if (response.ok) {
        const data = await response.json();
        // Add scraped FAQs to existing ones
        updateKnowledgeBase({
          faqs: [...knowledgeBase.faqs, ...data.faqs],
        });
      }
    } catch (error) {
      console.error('Error scraping website:', error);
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Services */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Services</h3>
          <ServicesTable
            services={knowledgeBase.services}
            onChange={(services) => updateKnowledgeBase({ services })}
          />
        </div>
      </div>

      {/* FAQs */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Frequently Asked Questions</h3>
            <div className="flex space-x-2">
              <Button
                onClick={handleScrapeWebsite}
                disabled={isScraping}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Link className="w-4 h-4" />
                <span>{isScraping ? 'Scraping...' : 'Scrape from website'}</span>
              </Button>
              <Button
                onClick={handleAddFAQ}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add FAQ</span>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {knowledgeBase.faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">FAQ #{index + 1}</h4>
                      <button
                        onClick={() => handleRemoveFAQ(index)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question
                      </label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => handleUpdateFAQ(index, 'question', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                        placeholder="What are your business hours?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Answer
                      </label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => handleUpdateFAQ(index, 'answer', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                        rows={3}
                        placeholder="We are open Monday through Friday from 9 AM to 5 PM..."
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {knowledgeBase.faqs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No FAQs added yet.</p>
                <p className="text-sm">Add your first FAQ to help customers get quick answers.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Policies */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Policies</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cancellation Policy
              </label>
              <textarea
                value={knowledgeBase.policies.cancellation}
                onChange={(e) => updateKnowledgeBase({
                  policies: { ...knowledgeBase.policies, cancellation: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                rows={3}
                placeholder="Cancellations must be made 24 hours in advance..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reschedule Policy
              </label>
              <textarea
                value={knowledgeBase.policies.reschedule}
                onChange={(e) => updateKnowledgeBase({
                  policies: { ...knowledgeBase.policies, reschedule: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                rows={3}
                placeholder="Rescheduling is allowed up to 2 hours before your appointment..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deposit Policy
              </label>
              <textarea
                value={knowledgeBase.policies.deposit}
                onChange={(e) => updateKnowledgeBase({
                  policies: { ...knowledgeBase.policies, deposit: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                rows={3}
                placeholder="A 50% deposit is required to secure your appointment..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Intake Questions */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Intake Questions</h3>
            <Button
              onClick={handleAddIntakeQuestion}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question</span>
            </Button>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {knowledgeBase.intakeQuestions.map((question, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center space-x-3"
                >
                  <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => handleUpdateIntakeQuestion(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                    placeholder="What is the nature of your inquiry?"
                  />
                  <button
                    onClick={() => handleRemoveIntakeQuestion(index)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {knowledgeBase.intakeQuestions.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <p>No intake questions added yet.</p>
                <p className="text-sm">Add questions to help qualify leads.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* File Uploads */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Documents</h3>
          
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
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Files
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
