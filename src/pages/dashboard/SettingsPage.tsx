import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to General settings page
    navigate('/dashboard/settings/general', { replace: true });
  }, [navigate]);

  return null;
};

export default SettingsPage;
