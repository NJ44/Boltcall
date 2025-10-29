import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KnowledgeBaseSkeleton } from '../../components/ui/loading-skeleton';
import { X, FileText, Edit, Trash2, Save, Upload, Globe, PenTool, Plus, ChevronDown, Building2 } from 'lucide-react';
import CardTableWithPanel from '../../components/ui/CardTableWithPanel';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

interface Document {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface KnowledgeBaseDocument {
  id: string;
  name: string;
  type: 'url' | 'file' | 'text';
  content?: string;
  url?: string;
  file?: File;
}

const KnowledgeBasePage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState<'url' | 'file' | 'blank' | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [blankPageTitle, setBlankPageTitle] = useState('');
  
  // New Knowledge Base Modal state
  const [showNewKnowledgeBaseModal, setShowNewKnowledgeBaseModal] = useState(false);
  const [knowledgeBaseName, setKnowledgeBaseName] = useState('');
  const [kbDocuments, setKbDocuments] = useState<KnowledgeBaseDocument[]>([]);
  const [showKbDocumentDropdown, setShowKbDocumentDropdown] = useState(false);
  const kbDropdownRef = useRef<HTMLDivElement>(null);
  
  // Dropdown state
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Document management state
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);
  const [editingDocumentContent, setEditingDocumentContent] = useState('');
  const [showDocumentEditor, setShowDocumentEditor] = useState(false);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (kbDropdownRef.current && !kbDropdownRef.current.contains(event.target as Node)) {
        setShowKbDocumentDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Fetch documents from Supabase
  const fetchDocuments = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        return;
      }

      // Transform Supabase data to Document interface
      const transformedDocuments: Document[] = (data || []).map((doc: any) => ({
        id: doc.id,
        name: doc.title || 'Untitled',
        content: doc.content || '',
        createdAt: new Date(doc.created_at || new Date()),
        updatedAt: new Date(doc.updated_at || doc.created_at || new Date())
      }));

      setDocuments(transformedDocuments);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // New Knowledge Base handlers
  const handleOpenNewKnowledgeBase = () => {
    setShowNewKnowledgeBaseModal(true);
    setKnowledgeBaseName('');
    setKbDocuments([]);
    setShowKbDocumentDropdown(false);
  };

  const handleCloseNewKnowledgeBase = () => {
    setShowNewKnowledgeBaseModal(false);
    setKnowledgeBaseName('');
    setKbDocuments([]);
    setShowKbDocumentDropdown(false);
    setUrlInput('');
    setFileInput(null);
    setBlankPageTitle('');
    setPopupType(null);
  };

  const handleAddKbDocument = () => {
    setShowKbDocumentDropdown(!showKbDocumentDropdown);
  };

  const handleKbAddWebsite = () => {
    setShowKbDocumentDropdown(false);
    setPopupType('url');
    setShowPopup(true);
  };

  const handleKbAddFile = () => {
    setShowKbDocumentDropdown(false);
    setPopupType('file');
    setShowPopup(true);
  };

  const handleKbAddText = () => {
    setShowKbDocumentDropdown(false);
    setPopupType('blank');
    setShowPopup(true);
  };

  const handleRemoveKbDocument = (id: string) => {
    setKbDocuments(kbDocuments.filter(doc => doc.id !== id));
  };

  const handleSaveNewKnowledgeBase = async () => {
    if (!knowledgeBaseName.trim() || !user?.id) {
      showToast({
        title: 'Error',
        message: 'Please enter a knowledge base name',
        variant: 'error',
        duration: 3000
      });
      return;
    }

    if (kbDocuments.length === 0) {
      showToast({
        title: 'Error',
        message: 'Please add at least one document',
        variant: 'error',
        duration: 3000
      });
      return;
    }

    try {
      // Create knowledge base entries for each document
      const documentsToInsert = kbDocuments.map((doc) => ({
        user_id: user.id,
        title: doc.name,
        content: doc.content || '',
        content_type: doc.type === 'file' ? 'file' : doc.type === 'url' ? 'text' : 'text',
        status: 'active',
        tags: [knowledgeBaseName.trim()], // Use KB name as tag for grouping
        source: doc.type === 'url' ? doc.url : doc.type === 'file' ? doc.file?.name : 'manual'
      }));

      const { error } = await supabase
        .from('knowledge_base')
        .insert(documentsToInsert)
        .select();

      if (error) {
        console.error('Error creating knowledge base:', error);
        showToast({
          title: 'Error',
          message: 'Failed to create knowledge base',
          variant: 'error',
          duration: 3000
        });
        return;
      }

      showToast({
        title: 'Success',
        message: 'Knowledge base created successfully',
        variant: 'success',
        duration: 3000
      });

      handleCloseNewKnowledgeBase();
      fetchDocuments();
    } catch (error) {
      console.error('Error creating knowledge base:', error);
      showToast({
        title: 'Error',
        message: 'Failed to create knowledge base',
        variant: 'error',
        duration: 3000
      });
    }
  };

  // Update handlers to add documents to KB modal
  const handleSubmitUrl = () => {
    if (urlInput.trim()) {
      const newDoc: KnowledgeBaseDocument = {
        id: Date.now().toString(),
        name: `Website: ${urlInput}`,
        type: 'url',
        url: urlInput
      };
      
      if (showNewKnowledgeBaseModal) {
        setKbDocuments([...kbDocuments, newDoc]);
        setUrlInput('');
        setShowPopup(false);
        setPopupType(null);
      } else {
    console.log('Importing from URL:', urlInput);
    handleClosePopup();
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileInput(file);
    }
  };

  const handleSubmitFile = () => {
    if (fileInput) {
      if (showNewKnowledgeBaseModal) {
        const newDoc: KnowledgeBaseDocument = {
          id: Date.now().toString(),
          name: fileInput.name,
          type: 'file',
          file: fileInput
        };
        setKbDocuments([...kbDocuments, newDoc]);
        setFileInput(null);
        setShowPopup(false);
        setPopupType(null);
      } else {
      console.log('Uploading file:', fileInput.name);
      handleClosePopup();
      }
    }
  };

  const handleSubmitBlankPage = async () => {
    if (blankPageTitle.trim()) {
      if (showNewKnowledgeBaseModal) {
        const newDoc: KnowledgeBaseDocument = {
          id: Date.now().toString(),
          name: blankPageTitle.trim(),
          type: 'text',
          content: ''
        };
        setKbDocuments([...kbDocuments, newDoc]);
        setBlankPageTitle('');
        setShowPopup(false);
        setPopupType(null);
      } else if (user?.id) {
      try {
        const { data, error } = await supabase
          .from('knowledge_base')
          .insert([{
            user_id: user.id,
            title: blankPageTitle.trim(),
            content: '',
            content_type: 'text',
            status: 'draft'
          }])
          .select()
          .single();

        if (error) {
          console.error('Error creating document:', error);
          return;
        }

        const newDoc: Document = {
          id: data.id,
          name: data.title,
          content: data.content || '',
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at || data.created_at)
        };

        setDocuments(prev => [newDoc, ...prev]);
        setBlankPageTitle('');
        handleClosePopup();
        handleEditDocument(newDoc);
      } catch (error) {
        console.error('Error creating document:', error);
      }
    }
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setPopupType(null);
    setUrlInput('');
    setFileInput(null);
    setBlankPageTitle('');
  };

  const handleEditDocument = (doc: Document) => {
    setEditingDocumentId(doc.id);
    setEditingDocumentContent(doc.content);
    setShowDocumentEditor(true);
  };

  const handleSaveDocument = async () => {
    if (editingDocumentId && user?.id) {
      try {
        const { error } = await supabase
          .from('knowledge_base')
          .update({
            content: editingDocumentContent,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingDocumentId)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error saving document:', error);
          return;
        }

        setDocuments(documents.map(doc => 
          doc.id === editingDocumentId 
            ? { ...doc, content: editingDocumentContent, updatedAt: new Date() } 
            : doc
        ));
        setEditingDocumentId(null);
        setEditingDocumentContent('');
        setShowDocumentEditor(false);
      } catch (error) {
        console.error('Error saving document:', error);
      }
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('knowledge_base')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting document:', error);
        return;
      }

      setDocuments(documents.filter(doc => doc.id !== id));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingDocumentId(null);
    setEditingDocumentContent('');
    setShowDocumentEditor(false);
  };

  // Dropdown handlers
  const handleAddDocument = () => {
    setShowDropdown(!showDropdown);
  };

  const handleUploadFiles = () => {
    setShowDropdown(false);
    setPopupType('file');
    setShowPopup(true);
  };

  const handleAddWebsite = () => {
    setShowDropdown(false);
    setPopupType('url');
    setShowPopup(true);
  };

  const handleAddText = () => {
    setShowDropdown(false);
    setPopupType('blank');
    setShowPopup(true);
  };


  if (isLoading) {
    return <KnowledgeBaseSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Knowledge Base Table */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Custom Header */}
          <div className="p-6">
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-2">
                {/* New Knowledge Base Button */}
                <button
                  onClick={handleOpenNewKnowledgeBase}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Building2 className="h-4 w-4" />
                  <span className="font-bold">New Knowledge Base</span>
                </button>

                {/* Add Document Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={handleAddDocument}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="font-bold">Add Document</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                      >
                        <div className="py-1">
                          <button
                            onClick={handleUploadFiles}
                            className="w-full px-2 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Upload className="w-3 h-3 text-blue-600 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-medium text-gray-900 truncate">Upload files</div>
                              <div className="text-xs text-gray-500 truncate">PDF, DOC, TXT</div>
                            </div>
                          </button>
                          <button
                            onClick={handleAddWebsite}
                            className="w-full px-2 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Globe className="w-3 h-3 text-green-600 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-medium text-gray-900 truncate">Websites</div>
                              <div className="text-xs text-gray-500 truncate">Import from URL</div>
                            </div>
                          </button>
                          <button
                            onClick={handleAddText}
                            className="w-full px-2 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                          >
                            <PenTool className="w-3 h-3 text-purple-600 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-medium text-gray-900 truncate">Add text</div>
                              <div className="text-xs text-gray-500 truncate">Create from scratch</div>
                            </div>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

        <CardTableWithPanel
          data={documents}
          columns={[
            { key: 'name', label: 'Document Name', width: '25%' },
            { key: 'content', label: 'Content Preview', width: '35%' },
            { key: 'createdAt', label: 'Created', width: '15%' },
            { key: 'updatedAt', label: 'Updated', width: '15%' },
              { key: 'actions', label: 'Actions', width: '10%' }
          ]}
          renderRow={(doc) => (
            <div className="flex items-center gap-6">
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
              <div className="flex items-center gap-2 flex-shrink-0">
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
        />
        </div>
      </div>

      {/* New Knowledge Base Modal */}
      <AnimatePresence>
        {showNewKnowledgeBaseModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-[9999]"
              onClick={handleCloseNewKnowledgeBase}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-0 left-0 right-0 bottom-0 z-[10000] flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10 pointer-events-auto">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      Add Knowledge Base
                    </h2>
                    <button
                      onClick={handleCloseNewKnowledgeBase}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>

                  {/* Knowledge Base Name Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Knowledge Base Name
                    </label>
                    <input
                      type="text"
                      value={knowledgeBaseName}
                      onChange={(e) => setKnowledgeBaseName(e.target.value)}
                      placeholder="Enter knowledge base name..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Add Documents Button */}
                  <div className="mb-6">
                    <div className="relative" ref={kbDropdownRef}>
                      <button
                        onClick={handleAddKbDocument}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span className="font-medium">Add Documents</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${showKbDocumentDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      
                      <AnimatePresence>
                        {showKbDocumentDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10"
                          >
                            <div className="py-1">
                              <button
                                onClick={handleKbAddWebsite}
                                className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                              >
                                <Globe className="w-4 h-4 text-green-600" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">Websites</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">Import from URL</div>
                                </div>
                              </button>
                              <button
                                onClick={handleKbAddFile}
                                className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                              >
                                <Upload className="w-4 h-4 text-blue-600" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">Upload files</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">PDF, DOC, TXT</div>
                                </div>
                              </button>
                              <button
                                onClick={handleKbAddText}
                                className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                              >
                                <PenTool className="w-4 h-4 text-purple-600" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">Add text</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">Create from scratch</div>
                                </div>
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Documents List */}
                  {kbDocuments.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Documents ({kbDocuments.length})</h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {kbDocuments.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              {doc.type === 'url' && <Globe className="w-4 h-4 text-green-600" />}
                              {doc.type === 'file' && <Upload className="w-4 h-4 text-blue-600" />}
                              {doc.type === 'text' && <PenTool className="w-4 h-4 text-purple-600" />}
                              <span className="text-sm text-gray-900 dark:text-white">{doc.name}</span>
                            </div>
                            <button
                              onClick={() => handleRemoveKbDocument(doc.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleCloseNewKnowledgeBase}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveNewKnowledgeBase}
                      disabled={!knowledgeBaseName.trim() || kbDocuments.length === 0}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Popup Modal for Adding Documents */}
      <AnimatePresence>
        {showPopup && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-[10001]"
              onClick={handleClosePopup}
            />
            
            {/* Popup */}
      <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-0 left-0 right-0 bottom-0 z-[10002] flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto z-10 pointer-events-auto">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        {popupType === 'url' && <Globe className="w-5 h-5 text-blue-600" />}
                        {popupType === 'file' && <Upload className="w-5 h-5 text-blue-600" />}
                        {popupType === 'blank' && <PenTool className="w-5 h-5 text-blue-600" />}
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {popupType === 'url' && 'Import from URL'}
                        {popupType === 'file' && 'Upload File'}
                        {popupType === 'blank' && 'Create Blank Page'}
                      </h2>
                    </div>
                    <button
                      onClick={handleClosePopup}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
            </div>

                  {/* Content */}
                  {popupType === 'url' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Website URL
                        </label>
                        <input
                          type="url"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          placeholder="https://example.com"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
            </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Enter the URL of the website you want to import content from.
                      </p>
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={handleClosePopup}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmitUrl}
                          disabled={!urlInput}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {showNewKnowledgeBaseModal ? 'Add' : 'Import'}
                        </button>
          </div>
        </div>
                  )}

                  {popupType === 'file' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Select File
                        </label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
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
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Click to upload or drag and drop
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              PDF, DOC, DOCX, TXT files
                            </span>
                          </label>
                        </div>
                        {fileInput && (
                          <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-sm text-gray-700 dark:text-gray-300">Selected: {fileInput.name}</p>
                          </div>
                        )}
            </div>
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={handleClosePopup}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmitFile}
                          disabled={!fileInput}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {showNewKnowledgeBaseModal ? 'Add' : 'Upload'}
                        </button>
            </div>
          </div>
                  )}

                  {popupType === 'blank' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Page Title
                        </label>
                        <input
                          type="text"
                          value={blankPageTitle}
                          onChange={(e) => setBlankPageTitle(e.target.value)}
                          placeholder="Enter page title..."
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
            </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Create a new knowledge base page that you can edit manually.
                      </p>
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={handleClosePopup}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmitBlankPage}
                          disabled={!blankPageTitle}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {showNewKnowledgeBaseModal ? 'Add' : 'Create'}
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
            className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center z-[9999]"
            onClick={handleCancelEdit}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
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
                className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-y mb-6 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Start writing your document here..."
              />
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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