import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, X, Upload, Globe, Plus, FileText, Edit, Trash2, Save } from 'lucide-react';

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


  const handleAddFromUrl = () => {
    setPopupType('url');
    setShowPopup(true);
  };

  const handleAddFromFile = () => {
    setPopupType('file');
    setShowPopup(true);
  };

  const handleAddBlankPage = () => {
    setPopupType('blank');
    setShowPopup(true);
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
      </motion.div>

      {documents.length === 0 ? (
        /* No knowledge bases - Show add options in center */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="max-w-3xl mx-auto text-center mb-8">
            <p className="text-gray-600">You can upload PDFs, create documents, or link web pages.</p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
            {/* Upload PDF File */}
            <button
              onClick={handleAddFromFile}
              className="group border-2 border-gray-200 rounded-xl p-8 hover:border-gray-400 hover:shadow-lg transition-all bg-transparent"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-900 transition-colors">
                <Upload className="w-8 h-8 text-gray-900 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Upload PDF File</h3>
              <p className="text-sm text-gray-600">Directly upload your file with...</p>
            </button>

            {/* Blank Document */}
            <button
              onClick={handleAddBlankPage}
              className="group border-2 border-gray-200 rounded-xl p-8 hover:border-gray-400 hover:shadow-lg transition-all bg-transparent"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-900 transition-colors">
                <PenTool className="w-8 h-8 text-gray-900 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Blank Document</h3>
              <p className="text-sm text-gray-600">Manually add the information to a...</p>
            </button>

            {/* Paste from URL */}
            <button
              onClick={handleAddFromUrl}
              className="group border-2 border-gray-200 rounded-xl p-8 hover:border-gray-400 hover:shadow-lg transition-all bg-transparent"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-900 transition-colors">
                <Globe className="w-8 h-8 text-gray-900 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Paste from URL</h3>
              <p className="text-sm text-gray-600">Scan information from URL link to...</p>
            </button>
          </div>
        </motion.div>
      ) : (
        /* Has documents - Show documents grid */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Add New Document Button */}
          <div className="flex justify-end">
            <button
              onClick={handleAddBlankPage}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Document
            </button>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditDocument(doc)}
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edit Document"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">{doc.name}</h3>
                <p className="text-gray-600 text-sm mb-4 flex-1">
                  {doc.content.substring(0, 100)}...
                </p>
                <div className="text-xs text-gray-400 border-t pt-3">
                  <div>Created: {doc.createdAt.toLocaleDateString()}</div>
                  <div>Updated: {doc.updatedAt.toLocaleDateString()}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

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
