import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoading, isAuthenticated, user } = useAuth();
  const location = useLocation();
  const [setupCheck, setSetupCheck] = useState<'loading' | 'completed' | 'needed'>('loading');

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      setSetupCheck('loading');
      return;
    }

    // Skip check if already on setup page
    if (location.pathname === '/setup') {
      setSetupCheck('completed');
      return;
    }

    // Check if user has completed setup (has a business_profiles row)
    const checkSetup = async () => {
      try {
        const { data, error } = await supabase
          .from('business_profiles')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Setup check error:', error);
          setSetupCheck('completed'); // Don't block on error
          return;
        }

        setSetupCheck(data ? 'completed' : 'needed');
      } catch {
        setSetupCheck('completed'); // Don't block on error
      }
    };

    checkSetup();
  }, [isAuthenticated, user?.id, location.pathname]);

  if (isLoading || (isAuthenticated && setupCheck === 'loading')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-muted">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // New user without setup → redirect to setup
  if (setupCheck === 'needed') {
    return <Navigate to="/setup" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
