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
import PaymentPro from '../pages/PaymentPro';
import PaymentEliteStarter from '../pages/PaymentEliteStarter';
import RadialOrbitalTimelineDemo from '../pages/RadialOrbitalTimelineDemo';
import Features10Demo from '../pages/Features10Demo';
import LightningDemo from '../pages/LightningDemo';
import RuixenStatsDemo from '../pages/RuixenStatsDemo';
import TiltDemo from '../pages/TiltDemo';
import AnimatedCardChartDemo from '../pages/AnimatedCardChartDemo';
import CardsStackDemo from '../pages/CardsStackDemo';
import FeatureSectionDemo from '../pages/FeatureSectionDemo';
import MultipleSelectDemo from '../pages/MultipleSelectDemo';
import CustomCheckboxDemo from '../pages/CustomCheckboxDemo';
import EmptyStateDemo from '../pages/EmptyStateDemo';
import DisplayCardsDemo from '../pages/DisplayCardsDemo';
import NewAccordionDemo from '../pages/NewAccordionDemo';
import Accordion05Demo from '../pages/Accordion05Demo';
import DotPatternDemo from '../pages/DotPatternDemo';
import Documentation from '../pages/Documentation';
import NotFound from '../pages/NotFound';

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
        <Route path="/payment/pro" element={<PaymentPro />} />
        <Route path="/payment/elite-starter" element={<PaymentEliteStarter />} />
        <Route path="/radial-orbital-timeline-demo" element={<RadialOrbitalTimelineDemo />} />
        <Route path="/features-10-demo" element={<Features10Demo />} />
        <Route path="/lightning-demo" element={<LightningDemo />} />
        <Route path="/ruixen-stats-demo" element={<RuixenStatsDemo />} />
        <Route path="/tilt-demo" element={<TiltDemo />} />
        <Route path="/animated-card-chart-demo" element={<AnimatedCardChartDemo />} />
        <Route path="/cards-stack-demo" element={<CardsStackDemo />} />
        <Route path="/feature-section-demo" element={<FeatureSectionDemo />} />
        <Route path="/multiple-select-demo" element={<MultipleSelectDemo />} />
        <Route path="/custom-checkbox-demo" element={<CustomCheckboxDemo />} />
        <Route path="/empty-state-demo" element={<EmptyStateDemo />} />
        <Route path="/display-cards-demo" element={<DisplayCardsDemo />} />
        <Route path="/new-accordion-demo" element={<NewAccordionDemo />} />
        <Route path="/accordion-05-demo" element={<Accordion05Demo />} />
        <Route path="/dot-pattern-demo" element={<DotPatternDemo />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/terms-of-service" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
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
