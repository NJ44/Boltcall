import React, { useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import AuthSwitch from '../components/ui/auth-switch';

const Login: React.FC = () => {
  useEffect(() => {
    document.title = 'Login to Your Boltcall Account | Boltcall';
    updateMetaDescription('Login to your Boltcall account. Access your dashboard, manage settings, and view your AI receptionist analytics. Sign in now.');
  }, []);

  return <AuthSwitch defaultMode="login" />;
};

export default Login;
