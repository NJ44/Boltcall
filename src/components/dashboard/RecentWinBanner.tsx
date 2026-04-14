import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';
import dayjs from 'dayjs';

interface RecentWinBannerProps {
  clientName: string;
  completedAt: string;
  onDismiss: () => void;
}

const RecentWinBanner: React.FC<RecentWinBannerProps> = ({ clientName, completedAt, onDismiss }) => {
  const [visible, setVisible] = useState(true);

  const handleDismiss = () => {
    sessionStorage.setItem('recentWinDismissed', '1');
    setVisible(false);
    onDismiss();
  };

  const timeLabel = dayjs(completedAt).format('ddd [at] h:mm A');

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="flex items-start gap-3 rounded-lg border-l-4 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3"
          role="status"
          aria-live="polite"
        >
          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
          <p className="flex-1 text-sm text-emerald-800 dark:text-emerald-300">
            <span className="font-semibold">Booked.</span>{' '}
            {clientName}&apos;s appointment is confirmed ({timeLabel}). Your agent handled it while you were busy.
          </p>
          <button
            onClick={handleDismiss}
            className="shrink-0 text-emerald-500 hover:text-emerald-700 transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RecentWinBanner;
