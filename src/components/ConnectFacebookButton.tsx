import React from 'react';
import Button from './ui/Button';

interface ConnectFacebookButtonProps {
  onClick?: () => void;
  className?: string;
}

const ConnectFacebookButton: React.FC<ConnectFacebookButtonProps> = ({ 
  onClick, 
  className = "" 
}) => {
  const handleConnect = async () => {
    try {
      const response = await fetch("/api/auth/facebook/start");
      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        console.error('No OAuth URL received');
      }
    } catch (error) {
      console.error('Error starting Facebook OAuth:', error);
    }
    
    // Call the optional onClick prop if provided
    if (onClick) {
      onClick();
    }
  };

  return (
    <Button 
      onClick={handleConnect}
      className={`bg-blue-600 hover:bg-blue-700 text-white ${className}`}
    >
      Connect Facebook
    </Button>
  );
};

export default ConnectFacebookButton;
