import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WizardShell from '../components/setup/WizardShell';
import ErrorBoundary from '../components/ErrorBoundary';
import { ToastProvider } from '../contexts/ToastContext';
import { useSetupStore } from '../stores/setupStore';
import PageLoader from '../components/PageLoader';

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
    <ErrorBoundary>
      <ToastProvider>
        <WizardShell />
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default Setup;
