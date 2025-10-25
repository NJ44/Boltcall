import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Edit, Trash2, Save, Upload, Globe, PenTool } from 'lucide-react';
import CardTable from '../../components/ui/CardTable';

interface Document {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const KnowledgeBasePage: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState<'url' | 'file' | 'blank' | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [blankPageTitle, setBlankPageTitle] = useState('');
  
  // Document management state
  const [documents, setDocuments] = useState<Document[]>([]);
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);
  const [editingDocumentContent, setEditingDocumentContent] = useState('');
  const [showDocumentEditor, setShowDocumentEditor] = useState(false);
  
  // Load documents from localStorage on component mount
  useEffect(() => {
    const savedDocuments = localStorage.getItem('boltcall-documents');
    if (savedDocuments) {
      try {
        const parsed = JSON.parse(savedDocuments);
        const documentsWithDates = parsed.map((doc: any) => ({
          ...doc,
          createdAt: new Date(doc.createdAt),
          updatedAt: new Date(doc.updatedAt)
        }));
        setDocuments(documentsWithDates);
      } catch (error) {
        console.error('Error loading documents:', error);
      }
    }
  }, []);

  // Save documents to localStorage whenever documents change
  useEffect(() => {
    localStorage.setItem('boltcall-documents', JSON.stringify(documents));
  }, [documents]);



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
    if (blankPageTitle.trim()) {
      const newDoc: Document = {
        id: Date.now().toString(),
        name: blankPageTitle.trim(),
        content: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setDocuments(prev => [newDoc, ...prev]);
      setBlankPageTitle('');
    handleClosePopup();
      // Automatically open the new document for editing
      handleEditDocument(newDoc);
    }
  };

  const handleEditDocument = (doc: Document) => {
    setEditingDocumentId(doc.id);
    setEditingDocumentContent(doc.content);
    setShowDocumentEditor(true);
  };

  const handleSaveDocument = () => {
    if (editingDocumentId) {
      setDocuments(documents.map(doc => 
        doc.id === editingDocumentId 
          ? { ...doc, content: editingDocumentContent, updatedAt: new Date() } 
          : doc
      ));
      setEditingDocumentId(null);
      setEditingDocumentContent('');
      setShowDocumentEditor(false);
    }
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleCancelEdit = () => {
    setEditingDocumentId(null);
    setEditingDocumentContent('');
    setShowDocumentEditor(false);
  };


  return (
    <div className="space-y-6">
      {/* Knowledge Base Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8"
      >
        <CardTable
          data={documents}
          columns={[
            { key: 'name', label: 'Document Name', width: '30%' },
            { key: 'content', label: 'Content Preview', width: '40%' },
            { key: 'createdAt', label: 'Created', width: '15%' },
            { key: 'updatedAt', label: 'Updated', width: '15%' }
          ]}
          renderRow={(doc) => (
            <div className="flex items-center gap-6">
              {/* Checkbox */}
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              
              {/* Document Name */}
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="font-medium text-gray-900">{doc.name}</div>
              </div>
              
              {/* Content Preview */}
              <div className="text-sm text-gray-600 flex-1 truncate">
                {doc.content.substring(0, 50)}...
              </div>
              
              {/* Created Date */}
              <div className="text-sm text-gray-500 flex-1">
                {doc.createdAt.toLocaleDateString()}
              </div>
              
              {/* Updated Date */}
              <div className="text-sm text-gray-500 flex-1">
                {doc.updatedAt.toLocaleDateString()}
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditDocument(doc)}
                  className="text-blue-600 hover:text-blue-900 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteDocument(doc.id)}
                  className="text-red-600 hover:text-red-900 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          emptyStateText="No knowledge base documents found"
          emptyStateAnimation="/No_Data_Preview.lottie"
          onAddNew={() => setShowPopup(true)}
          addNewText="Add Document"
        />
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
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={handleClosePopup}
            />
            
            {/* Popup */}
      <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto z-10 pointer-events-auto">
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

      {/* Document Editor Modal */}
      <AnimatePresence>
        {showDocumentEditor && editingDocumentId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={handleCancelEdit}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Edit Document: {documents.find(d => d.id === editingDocumentId)?.name}
                </h2>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <textarea
                value={editingDocumentContent}
                onChange={(e) => setEditingDocumentContent(e.target.value)}
                className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-y mb-6 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Start writing your document here..."
              />
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDocument}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KnowledgeBasePage;
