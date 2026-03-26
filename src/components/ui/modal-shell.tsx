import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalShellProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  maxWidth?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const ModalShell: React.FC<ModalShellProps> = ({
  open,
  onClose,
  title,
  description,
  maxWidth = 'max-w-md',
  children,
  footer,
  className,
}) => {
  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[101] bg-black/50 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[102] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none"
          >
            <div
              className={cn(
                'relative w-full rounded-t-xl sm:rounded-xl bg-white dark:bg-gray-900 shadow-xl shadow-black/5 border border-gray-200 dark:border-gray-800 pointer-events-auto max-h-[90vh] sm:max-h-[85vh] flex flex-col',
                maxWidth,
                className
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between p-4 sm:p-6 pb-0 flex-shrink-0">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h3>
                  {description && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {description}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="group flex size-7 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Close"
                >
                  <X className="h-4 w-4 text-gray-400 transition-colors group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1">{children}</div>

              {/* Footer */}
              {footer && (
                <div className="flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
                  {footer}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ModalShell;
