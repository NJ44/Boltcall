import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KnowledgeBaseSkeleton } from '../../components/ui/loading-skeleton';
import { X, FileText, Edit, Trash2, Save, Upload, Globe, PenTool, Plus, ChevronDown } from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';
import CardTableWithPanel from '../../components/ui/CardTableWithPanel';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useTokens } from '../../contexts/TokenContext';
import { CheckCircle2, Circle } from 'lucide-react';

const FUNCTIONS_BASE = import.meta.env.DEV
  ? 'http://localhost:8888/.netlify/functions'
  : '/.netlify/functions';

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
  const { claimReward } = useTokens();
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
  const [searchTerm, setSearchTerm] = useState('');
  const [businessProfileId, setBusinessProfileId] = useState<string | null>(null);

  // KB Completeness state
  const [kbCompleteness, setKbCompleteness] = useState<{
    score: number;
    items: Array<{ label: string; hint: string; done: boolean }>;
  }>({ score: 0, items: [] });

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

  // Fetch KB completeness data from Supabase
  const fetchCompleteness = async () => {
    if (!user?.id) return;
    try {
      // Fetch business profile
      const { data: profile } = await supabase
        .from('business_profiles')
        .select('business_name, website_url')
        .eq('user_id', user.id)
        .single();

      // Fetch KB docs to check categories
      const { data: kbDocs } = await supabase
        .from('knowledge_base')
        .select('title, content, content_type, tags, source')
        .eq('user_id', user.id);

      const docs = kbDocs || [];
      const allText = docs.map(d => `${d.title || ''} ${(d.tags || []).join(' ')}`).join(' ').toLowerCase();

      const hasBusinessName = !!profile?.business_name?.trim();
      const hasWebsite = !!profile?.website_url?.trim();
      const hasServices = allText.includes('service') || allText.includes('pricing') || allText.includes('price') || docs.some(d => (d.tags || []).some((t: string) => t.toLowerCase().includes('service')));
      const hasFaqs = allText.includes('faq') || allText.includes('question') || docs.some(d => (d.tags || []).some((t: string) => t.toLowerCase().includes('faq')));
      const hasPolicies = allText.includes('polic') || allText.includes('cancellation') || allText.includes('reschedule') || allText.includes('deposit') || allText.includes('refund');
      const hasFiles = docs.some(d => d.content_type === 'file');

      let score = 0;
      if (hasBusinessName) score += 10;
      if (hasWebsite) score += 20;
      if (hasServices) score += 20;
      if (hasFaqs) score += 20;
      if (hasPolicies) score += 15;
      if (hasFiles) score += 15;

      setKbCompleteness({
        score,
        items: [
          { label: 'Business name', hint: '', done: hasBusinessName },
          { label: 'Website URL', hint: 'AI auto-learns from your site', done: hasWebsite },
          { label: 'Services', hint: 'so AI can quote prices', done: hasServices },
          { label: 'FAQs', hint: 'instant answers to common questions', done: hasFaqs },
          { label: 'Policies', hint: 'cancellation, reschedule, deposit', done: hasPolicies },
          { label: 'Documents uploaded', hint: 'menu, brochure, etc.', done: hasFiles },
        ],
      });
    } catch (error) {
      console.error('Error fetching KB completeness:', error);
    }
  };

  // Sync KB docs to Retell agent's knowledge base
  const syncToRetell = async () => {
    if (!user?.id) return;
    try {
      // 1. Find the user's agent and its Retell KB ID
      const { data: agent } = await supabase
        .from('agents')
        .select('retell_agent_id')
        .eq('user_id', user.id)
        .not('retell_agent_id', 'is', null)
        .limit(1)
        .maybeSingle();

      if (!agent?.retell_agent_id) return; // No Retell agent yet — skip

      // 2. Get the agent details from Retell to find KB ID
      const agentRes = await fetch(`${FUNCTIONS_BASE}/retell-agents?agent_id=${agent.retell_agent_id}`);
      if (!agentRes.ok) return;
      const agentData = await agentRes.json();

      // Find KB ID from the agent's LLM config
      const llmId = agentData.response_engine?.llm_id;
      if (!llmId) return;

      // Get LLM to find knowledge_base_ids
      const llmRes = await fetch(`${FUNCTIONS_BASE}/retell-agents?llm_id=${llmId}`);
      if (!llmRes.ok) return;
      const llmData = await llmRes.json();
      const kbId = llmData.knowledge_base_ids?.[0];
      if (!kbId) return;

      // 3. Get all current KB docs from Supabase
      const { data: docs } = await supabase
        .from('knowledge_base')
        .select('title, content')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (!docs?.length) return;

      // 4. Push to Retell KB via sync_kb action
      await fetch(`${FUNCTIONS_BASE}/retell-agents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync_kb',
          knowledge_base_id: kbId,
          knowledge_base_texts: docs.map(d => ({
            title: d.title || 'Untitled',
            text: d.content || '',
          })),
        }),
      });

      console.log('KB synced to Retell successfully');
    } catch (error) {
      console.error('Failed to sync KB to Retell:', error);
    }
  };

  // Fetch business profile ID for inserts
  const fetchBusinessProfileId = async () => {
    if (!user?.id) return;
    const { data } = await supabase
      .from('business_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();
    if (data?.id) setBusinessProfileId(data.id);
  };

  useEffect(() => {
    fetchDocuments();
    fetchCompleteness();
    fetchBusinessProfileId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // New Knowledge Base handlers
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
    if (!knowledgeBaseName.trim() || !user?.id || !businessProfileId) {
      showToast({
        title: 'Error',
        message: !businessProfileId ? 'Please complete your business profile first' : 'Please enter a knowledge base name',
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
      showToast({ title: 'Saving...', message: 'Processing documents...', variant: 'default', duration: 10000 });

      // Process each document - scrape URLs and read files
      const documentsToInsert = await Promise.all(kbDocuments.map(async (doc) => {
        let content = doc.content || '';
        let title = doc.name;

        if (doc.type === 'url' && doc.url) {
          try {
            const res = await fetch('/.netlify/functions/scrape-url', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url: doc.url }),
            });
            const scraped = await res.json();
            content = scraped.content || `Imported from: ${doc.url}`;
            title = scraped.title || doc.name;
          } catch {
            content = `Failed to scrape. URL: ${doc.url}`;
          }
        } else if (doc.type === 'file' && doc.file) {
          try {
            content = await doc.file.text();
          } catch {
            content = `Failed to read file: ${doc.file.name}`;
          }
        }

        return {
          user_id: user.id,
          business_profile_id: businessProfileId,
          title,
          content,
          content_type: doc.type === 'file' ? 'file' : 'text',
          status: 'active',
          tags: [knowledgeBaseName.trim()],
          source: doc.type === 'url' ? doc.url : doc.type === 'file' ? doc.file?.name : 'manual'
        };
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

      // Claim bonus token rewards
      const addDocResult = await claimReward('add_first_kb_document');
      if (addDocResult?.success && !addDocResult?.alreadyClaimed) {
        showToast({ title: 'Bonus Tokens!', message: '+30 tokens earned for adding your first KB document', variant: 'success', duration: 4000 });
      }
      // Check if any doc was a file upload
      const hasFileUpload = kbDocuments.some(d => d.type === 'file');
      if (hasFileUpload) {
        const fileResult = await claimReward('upload_first_file');
        if (fileResult?.success && !fileResult?.alreadyClaimed) {
          showToast({ title: 'Bonus Tokens!', message: '+20 tokens earned for uploading your first file', variant: 'success', duration: 4000 });
        }
      }

      handleCloseNewKnowledgeBase();
      fetchDocuments();
      syncToRetell();
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

  // URL submission - scrapes content and saves to Supabase
  const handleSubmitUrl = async () => {
    if (!urlInput.trim()) return;

    if (showNewKnowledgeBaseModal) {
      // Modal mode: add to local list for batch save
      setKbDocuments([...kbDocuments, {
        id: Date.now().toString(),
        name: `Website: ${urlInput}`,
        type: 'url',
        url: urlInput
      }]);
      setUrlInput('');
      setShowPopup(false);
      setPopupType(null);
      return;
    }

    // Direct mode: scrape URL and save to Supabase
    if (!user?.id || !businessProfileId) {
      showToast({ title: 'Error', message: 'Please complete your business profile first', variant: 'error', duration: 3000 });
      return;
    }

    showToast({ title: 'Scraping...', message: `Fetching content from ${urlInput}`, variant: 'default', duration: 5000 });

    try {
      const res = await fetch('/.netlify/functions/scrape-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput }),
      });
      const scraped = await res.json();

      const title = scraped.title || `Website: ${urlInput}`;
      const content = scraped.content || `Imported from: ${urlInput}`;

      const { data, error } = await supabase
        .from('knowledge_base')
        .insert([{
          user_id: user.id,
          business_profile_id: businessProfileId,
          title,
          content,
          content_type: 'text',
          status: 'active',
          source: urlInput
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving URL content:', error);
        showToast({ title: 'Error', message: 'Failed to save website content', variant: 'error', duration: 3000 });
        return;
      }

      setDocuments(prev => [{
        id: data.id,
        name: data.title,
        content: data.content || '',
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at || data.created_at)
      }, ...prev]);

      showToast({ title: 'Success', message: `Imported ${scraped.charCount || 0} characters from website`, variant: 'success', duration: 3000 });
      const urlDocResult = await claimReward('add_first_kb_document');
      if (urlDocResult?.success && !urlDocResult?.alreadyClaimed) {
        showToast({ title: 'Bonus Tokens!', message: '+30 tokens earned for adding your first KB document', variant: 'success', duration: 4000 });
      }
      handleClosePopup();
      syncToRetell();
    } catch (error) {
      console.error('Error scraping URL:', error);
      showToast({ title: 'Error', message: 'Failed to scrape website', variant: 'error', duration: 3000 });
    }
  };

  const handleFileUpload = (files: File[]) => {
    const file = files[0];
    if (file) {
      setFileInput(file);
    }
  };

  // File submission - reads file content and saves to Supabase
  const handleSubmitFile = async () => {
    if (!fileInput) return;

    if (showNewKnowledgeBaseModal) {
      // Modal mode: add to local list
      setKbDocuments([...kbDocuments, {
        id: Date.now().toString(),
        name: fileInput.name,
        type: 'file',
        file: fileInput
      }]);
      setFileInput(null);
      setShowPopup(false);
      setPopupType(null);
      return;
    }

    // Direct mode: read file and save to Supabase
    if (!user?.id || !businessProfileId) {
      showToast({ title: 'Error', message: 'Please complete your business profile first', variant: 'error', duration: 3000 });
      return;
    }

    try {
      const content = await fileInput.text();

      const { data, error } = await supabase
        .from('knowledge_base')
        .insert([{
          user_id: user.id,
          business_profile_id: businessProfileId,
          title: fileInput.name,
          content,
          content_type: 'file',
          status: 'active',
          source: fileInput.name
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving file:', error);
        showToast({ title: 'Error', message: 'Failed to save file content', variant: 'error', duration: 3000 });
        return;
      }

      setDocuments(prev => [{
        id: data.id,
        name: data.title,
        content: data.content || '',
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at || data.created_at)
      }, ...prev]);

      showToast({ title: 'Success', message: `File "${fileInput.name}" uploaded successfully`, variant: 'success', duration: 3000 });
      const fileDocResult = await claimReward('add_first_kb_document');
      if (fileDocResult?.success && !fileDocResult?.alreadyClaimed) {
        showToast({ title: 'Bonus Tokens!', message: '+30 tokens earned for adding your first KB document', variant: 'success', duration: 4000 });
      }
      const fileUploadResult = await claimReward('upload_first_file');
      if (fileUploadResult?.success && !fileUploadResult?.alreadyClaimed) {
        showToast({ title: 'Bonus Tokens!', message: '+20 tokens earned for uploading your first file', variant: 'success', duration: 4000 });
      }
      setFileInput(null);
      handleClosePopup();
      syncToRetell();
    } catch (error) {
      console.error('Error reading file:', error);
      showToast({ title: 'Error', message: 'Failed to read file', variant: 'error', duration: 3000 });
    }
  };

  // Blank page submission
  const handleSubmitBlankPage = async () => {
    if (!blankPageTitle.trim()) return;

    if (showNewKnowledgeBaseModal) {
      setKbDocuments([...kbDocuments, {
        id: Date.now().toString(),
        name: blankPageTitle.trim(),
        type: 'text',
        content: ''
      }]);
      setBlankPageTitle('');
      setShowPopup(false);
      setPopupType(null);
      return;
    }

    if (!user?.id || !businessProfileId) {
      showToast({ title: 'Error', message: 'Please complete your business profile first', variant: 'error', duration: 3000 });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('knowledge_base')
        .insert([{
          user_id: user.id,
          business_profile_id: businessProfileId,
          title: blankPageTitle.trim(),
          content: '',
          content_type: 'text',
          status: 'draft'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating document:', error);
        showToast({ title: 'Error', message: 'Failed to create document', variant: 'error', duration: 3000 });
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
            status: 'active',
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
        syncToRetell();
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
      syncToRetell();
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
    <div className="space-y-4 md:space-y-6 px-1 md:px-0">
      {/* KB Completeness Banner */}
      {kbCompleteness.score < 100 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6"
        >
          <div className="flex items-start gap-3 md:gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-gray-900">
                  Setup Progress
                </h3>
                <span className="text-sm font-bold text-blue-600">{kbCompleteness.score}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-gray-100 rounded-full mb-3 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${kbCompleteness.score}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>

              <p className="text-xs text-gray-500 mb-3">
                Your AI agent works better with more info:
              </p>

              {/* Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {kbCompleteness.items.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    {item.done ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    )}
                    <span className={`text-xs ${item.done ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>
                      {item.label}
                    </span>
                    {item.hint && !item.done && (
                      <span className="text-xs text-gray-400">
                        — {item.hint}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Knowledge Base Table */}
      <div className="mt-2">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Custom Header */}
          <div className="p-3 md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              {/* Search Input */}
              <div className="relative flex-1 md:max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-2">
                {/* New Knowledge Base Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={handleAddDocument}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="font-bold hidden md:inline">New Knowledge Base</span>
                    <span className="font-bold md:hidden">New KB</span>
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
          hideSearch={true}
          data={documents.filter(doc => 
            doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.content.toLowerCase().includes(searchTerm.toLowerCase())
          )}
          columns={[
            { key: 'name', label: 'Document Name', width: '25%' },
            { key: 'content', label: 'Content Preview', width: '35%' },
            { key: 'createdAt', label: 'Created', width: '15%' },
            { key: 'updatedAt', label: 'Updated', width: '15%' },
              { key: 'actions', label: 'Actions', width: '10%' }
          ]}
          renderRow={(doc) => (
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
              {/* Document Name + Actions (mobile: side by side) */}
              <div className="flex items-center justify-between md:contents">
                <div className="flex items-center gap-3 md:flex-1 min-w-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="font-medium text-gray-900 truncate">{doc.name}</div>
                </div>

                {/* Actions - visible on mobile next to name */}
                <div className="flex items-center gap-3 md:hidden flex-shrink-0">
                  <button
                    onClick={() => handleEditDocument(doc)}
                    className="text-blue-600 hover:text-blue-900 transition-colors p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="text-red-600 hover:text-red-900 transition-colors p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content Preview */}
              <div className="text-sm text-gray-600 md:flex-1 truncate">
                {doc.content.substring(0, 50)}...
              </div>

              {/* Dates row on mobile */}
              <div className="flex items-center gap-4 text-xs md:text-sm text-gray-500 md:contents">
                <div className="md:flex-1">
                  <span className="md:hidden">Created: </span>{doc.createdAt.toLocaleDateString()}
                </div>
                <div className="md:flex-1">
                  <span className="md:hidden">Updated: </span>{doc.updatedAt.toLocaleDateString()}
                </div>
              </div>

              {/* Actions - desktop only */}
              <div className="hidden md:flex items-center gap-2 flex-shrink-0">
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
              className="fixed -inset-[200px] bg-black bg-opacity-50 z-[9999]"
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
              className="fixed -inset-[200px] bg-black bg-opacity-50 z-[10001]"
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
                        <FileUpload onChange={handleFileUpload} />
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
            className="fixed -inset-[200px] bg-black/50 flex items-center justify-center z-[9999]"
            onClick={handleCancelEdit}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-8 max-w-4xl w-full mx-2 md:mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white truncate mr-2">
                  Edit: {documents.find(d => d.id === editingDocumentId)?.name}
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
                className="w-full h-64 md:h-96 p-3 md:p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-y mb-4 md:mb-6 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
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