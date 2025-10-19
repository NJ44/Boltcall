import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Document {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentsQuickAccess: React.FC = () => {
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);

  useEffect(() => {
    const savedDocuments = localStorage.getItem('boltcall-documents');
    if (savedDocuments) {
      try {
        const parsed = JSON.parse(savedDocuments);
        const documents = parsed.map((doc: any) => ({
          ...doc,
          createdAt: new Date(doc.createdAt),
          updatedAt: new Date(doc.updatedAt)
        }));
        // Get the 3 most recently updated documents
        setRecentDocuments(documents.slice(0, 3));
      } catch (error) {
        console.error('Error loading documents:', error);
      }
    }
  }, []);

  if (recentDocuments.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Documents</h3>
            <Link
              to="/dashboard/documents"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">No documents yet</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Create your first document to get started
            </p>
            <Link
              to="/dashboard/documents"
              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Create Document
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Documents</h3>
          <Link
            to="/dashboard/documents"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All
          </Link>
        </div>
        
        <div className="space-y-3">
          {recentDocuments.map((document, index) => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              
              <div className="flex-1 min-w-0">
                <Link
                  to="/dashboard/documents"
                  className="block"
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {document.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Updated {document.updatedAt.toLocaleDateString()}
                  </p>
                </Link>
              </div>
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link
                  to="/dashboard/documents"
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                  title="Edit"
                >
                  <Edit className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/dashboard/documents"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Create New Document
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DocumentsQuickAccess;
