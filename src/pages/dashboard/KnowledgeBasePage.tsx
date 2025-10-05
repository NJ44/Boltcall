import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Link, FileText, PenTool, X, Upload, Globe } from 'lucide-react';

const KnowledgeBasePage: React.FC = () => {
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState<'url' | 'file' | 'blank' | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [blankPageTitle, setBlankPageTitle] = useState('');


  const handleAddFromUrl = () => {
    setPopupType('url');
    setShowPopup(true);
    setShowAddOptions(false);
  };

  const handleAddFromFile = () => {
    setPopupType('file');
    setShowPopup(true);
    setShowAddOptions(false);
  };

  const handleAddBlankPage = () => {
    setPopupType('blank');
    setShowPopup(true);
    setShowAddOptions(false);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setPopupType(null);
    setUrlInput('');
    setFileInput(null);
    setBlankPageTitle('');
  };

  const handleSubmitUrl = () => {
    console.log('Importing from URL:', urlInput);
    // Implementation for URL import
    handleClosePopup();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileInput(file);
    }
  };

  const handleSubmitFile = () => {
    if (fileInput) {
      console.log('Uploading file:', fileInput.name);
      // Implementation for file upload
      handleClosePopup();
    }
  };

  const handleSubmitBlankPage = () => {
    console.log('Creating blank page:', blankPageTitle);
    // Implementation for blank page creation
    handleClosePopup();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showAddOptions && !target.closest('[data-add-dropdown]')) {
        setShowAddOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAddOptions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-600 mt-1">Manage your AI assistant's knowledge and responses</p>
        </div>
        <div className="relative" data-add-dropdown>
          <button 
            onClick={() => setShowAddOptions(!showAddOptions)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Knowledge
          </button>
          
          {/* Add Options Dropdown */}
          {showAddOptions && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-2">
                <button
                  onClick={handleAddFromUrl}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Link className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">From URL</div>
                    <div className="text-xs text-gray-500">Import content from a website</div>
                  </div>
                </button>
                
                <button
                  onClick={handleAddFromFile}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">From File</div>
                    <div className="text-xs text-gray-500">Upload PDF, DOC, or text files</div>
                  </div>
                </button>
                
                <button
                  onClick={handleAddBlankPage}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <PenTool className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Blank Page</div>
                    <div className="text-xs text-gray-500">Create and type manually</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>


      {/* Knowledge Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-lg border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Knowledge Base
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Empty table - no rows */}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Popup Modal */}
      <AnimatePresence>
        {showPopup && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={handleClosePopup}
            />
            
            {/* Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        {popupType === 'url' && <Globe className="w-5 h-5 text-blue-600" />}
                        {popupType === 'file' && <Upload className="w-5 h-5 text-blue-600" />}
                        {popupType === 'blank' && <PenTool className="w-5 h-5 text-blue-600" />}
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {popupType === 'url' && 'Import from URL'}
                        {popupType === 'file' && 'Upload File'}
                        {popupType === 'blank' && 'Create Blank Page'}
                      </h2>
                    </div>
                    <button
                      onClick={handleClosePopup}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  {/* Content */}
                  {popupType === 'url' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website URL
                        </label>
                        <input
                          type="url"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          placeholder="https://example.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <p className="text-sm text-gray-600">
                        Enter the URL of the website you want to import content from.
                      </p>
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={handleClosePopup}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmitUrl}
                          disabled={!urlInput}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Import
                        </button>
                      </div>
                    </div>
                  )}

                  {popupType === 'file' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select File
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <input
                            type="file"
                            onChange={handleFileUpload}
                            accept=".pdf,.doc,.docx,.txt"
                            className="hidden"
                            id="file-upload"
                          />
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer flex flex-col items-center"
                          >
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-600">
                              Click to upload or drag and drop
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              PDF, DOC, DOCX, TXT files
                            </span>
                          </label>
                        </div>
                        {fileInput && (
                          <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">Selected: {fileInput.name}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={handleClosePopup}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmitFile}
                          disabled={!fileInput}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  )}

                  {popupType === 'blank' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Page Title
                        </label>
                        <input
                          type="text"
                          value={blankPageTitle}
                          onChange={(e) => setBlankPageTitle(e.target.value)}
                          placeholder="Enter page title..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <p className="text-sm text-gray-600">
                        Create a new knowledge base page that you can edit manually.
                      </p>
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={handleClosePopup}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmitBlankPage}
                          disabled={!blankPageTitle}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KnowledgeBasePage;
