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
import SettingsLayout from '../components/dashboard/SettingsLayout';
import DashboardPage from '../pages/dashboard/DashboardPage';
import AnalyticsPage from '../pages/dashboard/AnalyticsPage';
import AgentsPage from '../pages/dashboard/AgentsPage';
import SmsPage from '../pages/dashboard/SmsPage';
import WhatsappPage from '../pages/dashboard/WhatsappPage';
import SettingsPage from '../pages/dashboard/SettingsPage';
import KnowledgeBasePage from '../pages/dashboard/KnowledgeBasePage';
import AssistantPage from '../pages/dashboard/AssistantPage';
import PhoneNumbersPage from '../pages/dashboard/PhoneNumbersPage';
import IntegrationsPage from '../pages/dashboard/IntegrationsPage';
import InstantLeadReplyPage from '../pages/dashboard/InstantLeadReplyPage';
import VoiceLibraryPage from '../pages/dashboard/VoiceLibraryPage';
import WebsiteBubblePage from '../pages/dashboard/WebsiteBubblePage';
import RemindersPage from '../pages/dashboard/RemindersPage';
import SmsBookingPage from '../pages/dashboard/SmsBookingPage';
import MissedCallsPage from '../pages/dashboard/MissedCallsPage';
import CalcomPage from '../pages/dashboard/CalcomPage';
import CallHistoryPage from '../pages/dashboard/CallHistoryPage';
import ChatHistoryPage from '../pages/dashboard/ChatHistoryPage';
import HelpCenter from '../pages/HelpCenter';
import Privacy from '../pages/Privacy';
import Terms from '../pages/Terms';
import Contact from '../pages/Contact';
import Setup from '../pages/Setup';
import AuthCallback from '../pages/AuthCallback';
import PaymentPro from '../pages/PaymentPro';
import PaymentEliteStarter from '../pages/PaymentEliteStarter';
import Features10Demo from '../pages/Features10Demo';
import Giveaway from '../pages/Giveaway';
import RadialOrbitalTimelineDemo from '../pages/RadialOrbitalTimelineDemo';
import GeneralPage from '../pages/dashboard/settings/GeneralPage';
import PreferencesPage from '../pages/dashboard/settings/PreferencesPage';
import MembersPage from '../pages/dashboard/settings/MembersPage';
import PlanBillingPage from '../pages/dashboard/settings/PlanBillingPage';
import PackagesPage from '../pages/dashboard/settings/PackagesPage';
import UsagePage from '../pages/dashboard/settings/UsagePage';
import NotificationPage from '../pages/dashboard/settings/NotificationPage';
import NotificationPreferencesPage from '../pages/dashboard/settings/NotificationPreferencesPage';
import UpgradeBannerDemo from '../pages/UpgradeBannerDemo';
import SidebarDemoPage from '../pages/SidebarDemoPage';
import SkeletonDemoPage from '../pages/SkeletonDemoPage';
import OrbitingSkillsDemo from '../pages/OrbitingSkillsDemo';
import LightningDemo from '../pages/LightningDemo';
import RuixenStatsDemo from '../pages/RuixenStatsDemo';
import TiltDemo from '../pages/TiltDemo';
import AnimatedCardChartDemo from '../pages/AnimatedCardChartDemo';
import CardsStackDemo from '../pages/CardsStackDemo';
import FeatureSectionDemo from '../pages/FeatureSectionDemo';
import MultipleSelectDemo from '../pages/MultipleSelectDemo';
import InteractiveCheckoutDemo from '../pages/InteractiveCheckoutDemo';
import LineChartDemo from '../pages/LineChartDemo';
import CustomCheckboxDemo from '../pages/CustomCheckboxDemo';
import EmptyStateDemo from '../pages/EmptyStateDemo';
import DatabaseWithRestApiDemo from '../pages/DatabaseWithRestApiDemo';
import NewAccordionDemo from '../pages/NewAccordionDemo';
import Accordion05Demo from '../pages/Accordion05Demo';
import DotPatternDemo from '../pages/DotPatternDemo';
import FileUploadDemo from '../pages/FileUploadDemo';
import MagneticDemo from '../pages/MagneticDemo';
import CreditCardPage from '../pages/CreditCardPage';
import GiftCardPage from '../pages/GiftCardPage';
import Documentation from '../pages/Documentation';
import NotFound from '../pages/NotFound';
import AdminPanel from '../pages/AdminPanel';

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
          <Route path="knowledge-base" element={<KnowledgeBasePage />} />
          <Route path="phone" element={<PhoneNumbersPage />} />
          <Route path="assistant" element={<AssistantPage />} />
          <Route path="missed-calls" element={<MissedCallsPage />} />
          <Route path="integrations" element={<IntegrationsPage />} />
          <Route path="instant-lead-reply" element={<InstantLeadReplyPage />} />
          <Route path="sms" element={<SmsPage />} />
          <Route path="whatsapp" element={<WhatsappPage />} />
          <Route path="website-bubble" element={<WebsiteBubblePage />} />
          <Route path="reminders" element={<RemindersPage />} />
          <Route path="sms-booking" element={<SmsBookingPage />} />
          <Route path="calcom" element={<CalcomPage />} />
          <Route path="call-history" element={<CallHistoryPage />} />
          <Route path="chat-history" element={<ChatHistoryPage />} />
          <Route path="settings" element={
            <SettingsLayout>
              <SettingsPage />
            </SettingsLayout>
          } />
          <Route path="settings/general" element={
            <SettingsLayout>
              <GeneralPage />
            </SettingsLayout>
          } />
          <Route path="settings/preferences" element={
            <SettingsLayout>
              <PreferencesPage />
            </SettingsLayout>
          } />
          <Route path="settings/members" element={
            <SettingsLayout>
              <MembersPage />
            </SettingsLayout>
          } />
          <Route path="settings/plan-billing" element={
            <SettingsLayout>
              <PlanBillingPage />
            </SettingsLayout>
          } />
          <Route path="settings/packages" element={
            <SettingsLayout>
              <PackagesPage />
            </SettingsLayout>
          } />
          <Route path="settings/usage" element={
            <SettingsLayout>
              <UsagePage />
            </SettingsLayout>
          } />
          <Route path="settings/notifications" element={
            <SettingsLayout>
              <NotificationPage />
            </SettingsLayout>
          } />
          <Route path="settings/notification-preferences" element={
            <SettingsLayout>
              <NotificationPreferencesPage />
            </SettingsLayout>
          } />
        </Route>
        <Route path="/setup" element={<Setup />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/payment/pro" element={<PaymentPro />} />
        <Route path="/payment/elite-starter" element={<PaymentEliteStarter />} />
        <Route path="/features-10-demo" element={<Features10Demo />} />
        <Route path="/giveaway" element={<Giveaway />} />
        <Route path="/radial-orbital-timeline-demo" element={<RadialOrbitalTimelineDemo />} />
        <Route path="/interactive-checkout-demo" element={<InteractiveCheckoutDemo />} />
        <Route path="/line-chart-demo" element={<LineChartDemo />} />
        <Route path="/upgrade-banner-demo" element={<UpgradeBannerDemo />} />
        <Route path="/sidebar-demo" element={<SidebarDemoPage />} />
        <Route path="/skeleton-demo" element={<SkeletonDemoPage />} />
        <Route path="/orbiting-skills-demo" element={<OrbitingSkillsDemo />} />
        <Route path="/lightning-demo" element={<LightningDemo />} />
        <Route path="/ruixen-stats-demo" element={<RuixenStatsDemo />} />
        <Route path="/tilt-demo" element={<TiltDemo />} />
        <Route path="/animated-card-chart-demo" element={<AnimatedCardChartDemo />} />
        <Route path="/cards-stack-demo" element={<CardsStackDemo />} />
        <Route path="/feature-section-demo" element={<FeatureSectionDemo />} />
        <Route path="/multiple-select-demo" element={<MultipleSelectDemo />} />
        <Route path="/custom-checkbox-demo" element={<CustomCheckboxDemo />} />
        <Route path="/empty-state-demo" element={<EmptyStateDemo />} />
        <Route path="/database-with-rest-api-demo" element={<DatabaseWithRestApiDemo />} />
        <Route path="/new-accordion-demo" element={<NewAccordionDemo />} />
        <Route path="/accordion-05-demo" element={<Accordion05Demo />} />
        <Route path="/dot-pattern-demo" element={<DotPatternDemo />} />
        <Route path="/file-upload-demo" element={<FileUploadDemo />} />
            <Route path="/magnetic-demo" element={<MagneticDemo />} />
            <Route path="/credit-card-demo" element={<CreditCardPage />} />
            <Route path="/gift-card-demo" element={<GiftCardPage />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/terms-of-service" element={<Terms />} />
        <Route path="/admin" element={<AdminPanel />} />
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
