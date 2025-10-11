import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLenis } from '../hooks/useLenis';
import { AuthProvider } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardPage from '../pages/dashboard/DashboardPage';
import AnalyticsPage from '../pages/dashboard/AnalyticsPage';
import AgentsPage from '../pages/dashboard/AgentsPage';
import SmsPage from '../pages/dashboard/SmsPage';
import WhatsappPage from '../pages/dashboard/WhatsappPage';
import SettingsPage from '../pages/dashboard/SettingsPage';
import KnowledgeBasePage from '../pages/dashboard/KnowledgeBasePage';
import PreferencesPage from '../pages/dashboard/settings/PreferencesPage';
import MembersPage from '../pages/dashboard/settings/MembersPage';
import BillingPage from '../pages/dashboard/settings/BillingPage';
import NotificationsPage from '../pages/dashboard/settings/NotificationsPage';
import AssistantPage from '../pages/dashboard/AssistantPage';
import PhoneNumbersPage from '../pages/dashboard/PhoneNumbersPage';
import IntegrationsPage from '../pages/dashboard/IntegrationsPage';
import InstantLeadReplyPage from '../pages/dashboard/InstantLeadReplyPage';
import VoiceLibraryPage from '../pages/dashboard/VoiceLibraryPage';
import Privacy from '../pages/Privacy';
import Terms from '../pages/Terms';
import Contact from '../pages/Contact';
import Setup from '../pages/Setup';
import AuthCallback from '../pages/AuthCallback';
import StyledInputDemo from '../pages/StyledInputDemo';
import PricingTableDemo from '../pages/PricingTableDemo';
import ToastDemoPage from '../pages/ToastDemoPage';
import PaymentPro from '../pages/PaymentPro';
import PaymentEliteStarter from '../pages/PaymentEliteStarter';
import HeroOdysseyDemo from '../pages/HeroOdysseyDemo';
import AgentPlanDemo from '../pages/AgentPlanDemo';
import AuroraBackgroundDemo from '../pages/AuroraBackgroundDemo';
import SplineSceneDemo from '../pages/SplineSceneDemo';
import Features5Demo from '../pages/Features5Demo';
import WhisperTextDemo from '../pages/WhisperTextDemo';
import ChatKitDemo from '../pages/ChatKitDemo';

const NavigationWrapper: React.FC = () => {
  // Initialize Lenis smooth scrolling
  useLenis();
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          } 
        >
          <Route index element={<DashboardPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="agents" element={<AgentsPage />} />
          <Route path="voice-library" element={<VoiceLibraryPage />} />
          <Route path="knowledge" element={<KnowledgeBasePage />} />
          <Route path="phone" element={<PhoneNumbersPage />} />
          <Route path="assistant" element={<AssistantPage />} />
          <Route path="integrations" element={<IntegrationsPage />} />
          <Route path="instant-lead-reply" element={<InstantLeadReplyPage />} />
          <Route path="sms" element={<SmsPage />} />
          <Route path="whatsapp" element={<WhatsappPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="settings/preferences" element={<PreferencesPage />} />
          <Route path="settings/members" element={<MembersPage />} />
          <Route path="settings/billing" element={<BillingPage />} />
          <Route path="settings/notifications" element={<NotificationsPage />} />
        </Route>
        <Route path="/setup" element={<Setup />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/styled-input-demo" element={<StyledInputDemo />} />
        <Route path="/pricing-table-demo" element={<PricingTableDemo />} />
        <Route path="/toast-demo" element={<ToastDemoPage />} />
        <Route path="/payment/pro" element={<PaymentPro />} />
        <Route path="/payment/elite-starter" element={<PaymentEliteStarter />} />
        <Route path="/hero-odyssey-demo" element={<HeroOdysseyDemo />} />
        <Route path="/agent-plan-demo" element={<AgentPlanDemo />} />
        <Route path="/aurora-background-demo" element={<AuroraBackgroundDemo />} />
        <Route path="/spline-scene-demo" element={<SplineSceneDemo />} />
        <Route path="/features-5-demo" element={<Features5Demo />} />
        <Route path="/whisper-text-demo" element={<WhisperTextDemo />} />
        <Route path="/chatkit-demo" element={<ChatKitDemo />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/terms-of-service" element={<Terms />} />
      </Routes>
    </>
  );
};

const AppRoutes: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <NavigationWrapper />
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;
