import React from 'react';
import SpeedToLeadPage from './SpeedToLeadPage';

const LeadsPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <SpeedToLeadPage />
      </div>
    </div>
  );
};

export default LeadsPage;
