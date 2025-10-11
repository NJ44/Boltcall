import React, { createContext, useContext, useRef } from 'react';
import Toaster, { type ToasterRef } from '../components/ui/toast';

interface ToastContextType {
  showToast: (props: {
    title?: string;
    message: string;
    variant?: 'default' | 'success' | 'error' | 'warning';
    duration?: number;
    actions?: {
      label: string;
      onClick: () => void;
      variant?: 'default' | 'outline' | 'ghost';
    };
  }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toasterRef = useRef<ToasterRef>(null);

  const showToast: ToastContextType['showToast'] = (props) => {
    if (toasterRef.current) {
      toasterRef.current.show({
        ...props,
        position: 'bottom-right', // Fixed position for dashboard
      });
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toaster ref={toasterRef} defaultPosition="bottom-right" />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

