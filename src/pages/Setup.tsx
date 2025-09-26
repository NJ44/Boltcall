import React from 'react';
import WizardShell from '../components/setup/WizardShell';
import ErrorBoundary from '../components/ErrorBoundary';

const Setup: React.FC = () => {
  return (
    <ErrorBoundary>
      <WizardShell />
    </ErrorBoundary>
  );
};

export default Setup;
