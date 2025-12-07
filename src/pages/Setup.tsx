import React, { useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import WizardShell from '../components/setup/WizardShell';
import ErrorBoundary from '../components/ErrorBoundary';
import { ToastProvider, useToast } from '../contexts/ToastContext';
import { useSetupStore } from '../stores/setupStore';
import PageLoader from '../components/PageLoader';

const SetupContent: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    document.title = 'Setup Your Boltcall Account | Boltcall';
    updateMetaDescription('Setup your Boltcall account in 5 minutes. Free setup process, no credit card required. Get started today.');
  }, []);

  const handleError = (error: Error) => {
    // Log error for debugging
    console.error('Setup error caught by ErrorBoundary:', error);
    
    // Show user-friendly error message
    showToast({
      title: 'Setup Error',
      message: 'An unexpected error occurred during setup. Don\'t worry, your progress has been saved and you can continue from your dashboard.',
      variant: 'error',
      duration: 6000
    });
    
    // After a short delay, show redirect toast
    setTimeout(() => {
      showToast({
        title: 'Redirecting to Dashboard',
        message: 'You\'ll be redirected to your dashboard where you can continue setup or contact support if needed.',
        variant: 'default',
        duration: 4000
      });
      
      // Redirect after toast is shown
      setTimeout(() => {
        navigate('/dashboard');
      }, 4500);
    }, 2000);
  };

  return (
    <ErrorBoundary 
      isSetupPage={true}
      onError={handleError}
    >
      <WizardShell />
    </ErrorBoundary>
  );
};

const Setup: React.FC = () => {
  const navigate = useNavigate();
  const { isCompleted } = useSetupStore();
  const [isChecking, setIsChecking] = React.useState(true);

  useEffect(() => {
    // Check if setup is already completed
    if (isCompleted) {
      // Redirect to dashboard if setup is already completed
      navigate('/dashboard', { replace: true });
    } else {
      setIsChecking(false);
    }
  }, [isCompleted, navigate]);

  // Show loader while checking
  if (isChecking) {
    return <PageLoader isLoading={true} />;
  }

  return (
    <ToastProvider>
      <SetupContent />
    </ToastProvider>
  );
};

export default Setup;
