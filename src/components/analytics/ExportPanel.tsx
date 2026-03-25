import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  FileText,
  FileSpreadsheet,
  Clock,
  Calendar,
  Mail,
  ChevronDown,
  Trash2,
} from 'lucide-react';
import Card from '../ui/Card';
import { exportToPdf } from '../../lib/exportUtils';
import { getExportHistory, type ExportHistoryEntry } from '../../lib/analyticsApi';

interface ExportPanelProps {
  sections: { id: string; label: string; onCsvExport: () => void }[];
}

const ExportPanel: React.FC<ExportPanelProps> = ({ sections }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<ExportHistoryEntry[]>(() => getExportHistory());
  const [exporting, setExporting] = useState<string | null>(null);

  const handlePdfExport = async (sectionId: string, sectionLabel: string) => {
    setExporting(sectionId);
    try {
      await exportToPdf(sectionId, `boltcall-${sectionId}-${new Date().toISOString().split('T')[0]}`, sectionLabel);
    } finally {
      setExporting(null);
      setHistory(getExportHistory());
    }
  };

  const clearHistory = () => {
    localStorage.removeItem('boltcall_export_history');
    setHistory([]);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Download className="w-5 h-5 text-brand-blue" />
          <h3 className="text-lg font-semibold text-text-main">Data Export</h3>
        </div>
        <button
          onClick={() => { setShowHistory(!showHistory); setHistory(getExportHistory()); }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-muted hover:text-text-main border border-border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Clock className="w-3.5 h-3.5" />
          History
          <ChevronDown className={`w-3 h-3 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Export buttons per section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        {sections.map(section => (
          <div key={section.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <p className="text-sm font-medium text-text-main">{section.label}</p>
            </div>
            <button
              onClick={section.onCsvExport}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
              title="Export CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              CSV
            </button>
            <button
              onClick={() => handlePdfExport(section.id, section.label)}
              disabled={exporting === section.id}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
              title="Export PDF"
            >
              <FileText className="w-3.5 h-3.5" />
              {exporting === section.id ? '...' : 'PDF'}
            </button>
          </div>
        ))}
      </div>

      {/* Scheduled Reports placeholder */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-center gap-2 mb-2">
          <Mail className="w-4 h-4 text-blue-600" />
          <h4 className="text-sm font-semibold text-blue-800">Scheduled Reports</h4>
          <span className="text-[10px] px-1.5 py-0.5 bg-blue-200 text-blue-700 rounded-full font-medium">Coming Soon</span>
        </div>
        <p className="text-xs text-blue-700">
          Receive automated daily or weekly analytics summaries via email.
        </p>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs text-blue-600">Daily digest</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs text-blue-600">Weekly summary</span>
          </div>
        </div>
      </div>

      {/* Export History */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-text-main">Export History</h4>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="text-xs text-text-muted">No exports yet.</p>
            ) : (
              <div className="max-h-48 overflow-y-auto space-y-1">
                {history.slice(0, 20).map(entry => (
                  <div key={entry.id} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-gray-50 text-xs">
                    <div className="flex items-center gap-2">
                      {entry.type === 'csv' ? (
                        <FileSpreadsheet className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-red-600" />
                      )}
                      <span className="text-text-main">{entry.section}</span>
                      <span className="text-text-muted">({entry.recordCount} records)</span>
                    </div>
                    <span className="text-text-muted">
                      {new Date(entry.exportedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default ExportPanel;
