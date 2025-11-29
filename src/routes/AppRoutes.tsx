import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import SpeedToLeadPage from '../pages/dashboard/SpeedToLeadPage';
import VoiceLibraryPage from '../pages/dashboard/VoiceLibraryPage';
import WebsiteBubblePage from '../pages/dashboard/WebsiteBubblePage';
import RemindersPage from '../pages/dashboard/RemindersPage';
import SmsBookingPage from '../pages/dashboard/SmsBookingPage';
import FollowUpsPage from '../pages/dashboard/FollowUpsPage';
import MissedCallsPage from '../pages/dashboard/MissedCallsPage';
import LeadReactivationPage from '../pages/dashboard/LeadReactivationPage';
import CalcomPage from '../pages/dashboard/CalcomPage';
import CallHistoryPage from '../pages/dashboard/CallHistoryPage';
import ChatHistoryPage from '../pages/dashboard/ChatHistoryPage';
import LocationDashboardPage from '../pages/dashboard/LocationDashboardPage';
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
import ServicesPage from '../pages/dashboard/settings/ServicesPage';
import UpgradeBannerDemo from '../pages/UpgradeBannerDemo';
import SpeedTestLanding from '../pages/speed-test/SpeedTestLanding';
import SpeedTestLogin from '../pages/speed-test/SpeedTestLogin';
import SpeedTestReport from '../pages/speed-test/SpeedTestReport';
import SpeedTestOffer from '../pages/speed-test/SpeedTestOffer';
import SidebarDemoPage from '../pages/SidebarDemoPage';
import SkeletonDemoPage from '../pages/SkeletonDemoPage';
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
import PricingPage from '../pages/PricingPage';
import LampDemo from '../pages/LampDemo';
import HeroDemoPage from '../pages/HeroDemoPage';
import OfferPage from '../pages/OfferPage';
import Documentation from '../pages/Documentation';
import Blog from '../pages/Blog';
import BlogCenter from '../pages/BlogCenter';
import BlogSpeed from '../pages/BlogSpeed';
import BlogSpeedWebsite from '../pages/BlogSpeedWebsite';
import BlogSEO from '../pages/BlogSEO';
import BlogAIGuide from '../pages/BlogAIGuide';
import BlogAIReceptionistComparison from '../pages/BlogAIReceptionistComparison';
import BlogAIReceptionistHowItWorks from '../pages/BlogAIReceptionistHowItWorks';
import BlogIsAIReceptionistWorthIt from '../pages/BlogIsAIReceptionistWorthIt';
import BlogHowToMakeAIReceptionist from '../pages/BlogHowToMakeAIReceptionist';
import BlogWillReceptionistsBeReplacedByAI from '../pages/BlogWillReceptionistsBeReplacedByAI';
import BlogWhatDoesInstantLeadReplyMean from '../pages/BlogWhatDoesInstantLeadReplyMean';
import BlogHowToSetUpInstantLeadReply from '../pages/BlogHowToSetUpInstantLeadReply';
import Newsletter from '../pages/Newsletter';
import AIAgentComparison from '../pages/AIAgentComparison';
import Comparisons from '../pages/Comparisons';
import TraditionalCallCentersVsBoltcall from '../pages/comparisons/TraditionalCallCentersVsBoltcall';
import ReceptionistVsBoltcall from '../pages/comparisons/ReceptionistVsBoltcall';
import VoicemailVsBoltcall from '../pages/comparisons/VoicemailVsBoltcall';
import AnsweringServicesVsBoltcall from '../pages/comparisons/AnsweringServicesVsBoltcall';
import CRMInstantLeadReplyVsBoltcall from '../pages/comparisons/CRMInstantLeadReplyVsBoltcall';
import AIRevenueAudit from '../pages/AIRevenueAudit';
import SEOAnalyzer from '../pages/SEOAnalyzer';
import ConversionRateOptimizer from '../pages/ConversionRateOptimizer';
import DockDemoPage from '../pages/DockDemoPage';
import StepperDemoPage from '../pages/StepperDemoPage';
import BannerDemoPage from '../pages/BannerDemoPage';
import WavePathDemoPage from '../pages/WavePathDemoPage';
import HoverImagePreviewDemo from '../pages/HoverImagePreviewDemo';
import NotFound from '../pages/NotFound';
import AdminPanel from '../pages/AdminPanel';
import AIReceptionistPage from '../pages/features/AIReceptionistPage';
import InstantFormReplyPage from '../pages/features/InstantFormReplyPage';
import SMSBookingAssistantPage from '../pages/features/SMSBookingAssistantPage';
import AutomatedRemindersPage from '../pages/features/AutomatedRemindersPage';
import AIFollowUpSystemPage from '../pages/features/AIFollowUpSystemPage';
import WebsiteChatVoiceWidgetPage from '../pages/features/WebsiteChatVoiceWidgetPage';
import LeadReactivationFeaturePage from '../pages/features/LeadReactivationPage';

const NavigationWrapper: React.FC = () => {
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    // Scroll window to top
    window.scrollTo(0, 0);
    
    // Also handle Lenis smooth scroll if it exists
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    }
  }, [location.pathname]);
  
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
          <Route path="locations/:locationId" element={<LocationDashboardPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="agents" element={<AgentsPage />} />
          <Route path="voice-library" element={<VoiceLibraryPage />} />
          <Route path="knowledge-base" element={<KnowledgeBasePage />} />
          <Route path="phone" element={<PhoneNumbersPage />} />
          <Route path="assistant" element={<AssistantPage />} />
          <Route path="missed-calls" element={<MissedCallsPage />} />
          <Route path="integrations" element={<IntegrationsPage />} />
          <Route path="instant-lead-reply" element={<InstantLeadReplyPage />} />
          <Route path="speed-to-lead" element={<SpeedToLeadPage />} />
          <Route path="sms" element={<SmsPage />} />
          <Route path="whatsapp" element={<WhatsappPage />} />
          <Route path="website-bubble" element={<WebsiteBubblePage />} />
          <Route path="reminders" element={<RemindersPage />} />
          <Route path="sms-booking" element={<SmsBookingPage />} />
          <Route path="follow-ups" element={<FollowUpsPage />} />
          <Route path="lead-reactivation" element={<LeadReactivationPage />} />
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
          <Route path="settings/services" element={
            <SettingsLayout>
              <ServicesPage />
            </SettingsLayout>
          } />
        </Route>
        <Route path="/setup" element={<Setup />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Speed Test Funnel */}
        <Route path="/speed-test" element={<SpeedTestLanding />} />
        <Route path="/speed-test/login" element={<SpeedTestLogin />} />
        <Route path="/speed-test/report" element={<SpeedTestReport />} />
        <Route path="/speed-test/offer" element={<SpeedTestOffer />} />
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
            <Route path="/black-friday-gift-cards" element={<GiftCardPage />} />
            <Route path="/lamp-demo" element={<LampDemo />} />
            <Route path="/hero-demo" element={<HeroDemoPage />} />
            <Route path="/dock-demo" element={<DockDemoPage />} />
            <Route path="/stepper-demo" element={<StepperDemoPage />} />
            <Route path="/banner-demo" element={<BannerDemoPage />} />
            <Route path="/wave-path-demo" element={<WavePathDemoPage />} />
            <Route path="/hover-image-preview-demo" element={<HoverImagePreviewDemo />} />
            <Route path="/website-ignite" element={<OfferPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/blog" element={<BlogCenter />} />
        <Route path="/newsletter" element={<Newsletter />} />
        <Route path="/the-new-reality-for-local-businesses" element={<Blog />} />
        <Route path="/why-speed-matters-391-percent-advantage" element={<BlogSpeed />} />
        <Route path="/why-website-speed-is-everything" element={<BlogSpeedWebsite />} />
        <Route path="/complete-guide-to-seo" element={<BlogSEO />} />
        <Route path="/complete-guide-to-ai-for-local-businesses" element={<BlogAIGuide />} />
        <Route path="/best-ai-receptionist-tools-for-small-businesses" element={<BlogAIReceptionistComparison />} />
        <Route path="/how-does-an-ai-receptionist-work" element={<BlogAIReceptionistHowItWorks />} />
        <Route path="/is-ai-receptionist-worth-it" element={<BlogIsAIReceptionistWorthIt />} />
        <Route path="/how-to-make-ai-receptionist" element={<BlogHowToMakeAIReceptionist />} />
        <Route path="/will-receptionists-be-replaced-by-ai" element={<BlogWillReceptionistsBeReplacedByAI />} />
        <Route path="/what-does-instant-lead-reply-mean" element={<BlogWhatDoesInstantLeadReplyMean />} />
        <Route path="/how-to-set-up-instant-lead-reply" element={<BlogHowToSetUpInstantLeadReply />} />
        <Route path="/comparisons" element={<Comparisons />} />
        <Route path="/comparisons/traditional-call-centers-vs-boltcall" element={<TraditionalCallCentersVsBoltcall />} />
        <Route path="/comparisons/receptionist-vs-boltcall" element={<ReceptionistVsBoltcall />} />
        <Route path="/comparisons/voicemail-vs-boltcall" element={<VoicemailVsBoltcall />} />
        <Route path="/comparisons/answering-services-vs-boltcall" element={<AnsweringServicesVsBoltcall />} />
        <Route path="/comparisons/crm-instant-lead-reply-vs-boltcall" element={<CRMInstantLeadReplyVsBoltcall />} />
        <Route path="/ai-agent-comparison" element={<TraditionalCallCentersVsBoltcall />} />
        <Route path="/calculator/ai-revenue-audit" element={<AIRevenueAudit />} />
        <Route path="/how-much-you-can-earn-with-ai" element={<AIRevenueAudit />} />
        <Route path="/seo-analyzer" element={<SEOAnalyzer />} />
        <Route path="/conversion-rate-optimizer" element={<ConversionRateOptimizer />} />
        {/* Feature Pages */}
        <Route path="/features/ai-receptionist" element={<AIReceptionistPage />} />
        <Route path="/features/instant-form-reply" element={<InstantFormReplyPage />} />
        <Route path="/features/sms-booking-assistant" element={<SMSBookingAssistantPage />} />
        <Route path="/features/automated-reminders" element={<AutomatedRemindersPage />} />
        <Route path="/features/ai-follow-up-system" element={<AIFollowUpSystemPage />} />
        <Route path="/features/website-chat-voice-widget" element={<WebsiteChatVoiceWidgetPage />} />
        <Route path="/features/lead-reactivation" element={<LeadReactivationFeaturePage />} />
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
