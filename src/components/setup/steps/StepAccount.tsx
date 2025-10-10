import React from 'react';
import { LogIn } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../ui/Button';
import { useNavigate } from 'react-router-dom';

const StepAccount: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If user is not authenticated, show login button
  if (!isAuthenticated) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <Button
            onClick={() => navigate('/login?redirect=/setup')}
            variant="primary"
            className="px-8 py-3 text-lg font-semibold"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Login
          </Button>
        </div>
      </div>
    );
  }

  // If user is authenticated, show ready message
  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-gray-600 mb-6">
          You are logged in as {user?.name}. Ready to continue with the setup.
        </p>
      </div>
    </div>
  );
};

export default StepAccount;

