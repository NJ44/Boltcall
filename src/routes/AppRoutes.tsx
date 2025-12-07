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
import Giveaway from '../pages/Giveaway';
import GeneralPage from '../pages/dashboard/settings/GeneralPage';
import PreferencesPage from '../pages/dashboard/settings/PreferencesPage';
import MembersPage from '../pages/dashboard/settings/MembersPage';
import PlanBillingPage from '../pages/dashboard/settings/PlanBillingPage';
import PackagesPage from '../pages/dashboard/settings/PackagesPage';
import UsagePage from '../pages/dashboard/settings/UsagePage';
import NotificationPage from '../pages/dashboard/settings/NotificationPage';
import NotificationPreferencesPage from '../pages/dashboard/settings/NotificationPreferencesPage';
import ServicesPage from '../pages/dashboard/settings/ServicesPage';
import SpeedTestLanding from '../pages/speed-test/SpeedTestLanding';
import SpeedTestLogin from '../pages/speed-test/SpeedTestLogin';
import SpeedTestReport from '../pages/speed-test/SpeedTestReport';
import SpeedTestOffer from '../pages/speed-test/SpeedTestOffer';
import GiftCardPage from '../pages/GiftCardPage';
import PricingPage from '../pages/PricingPage';
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
import BlogHowDoesInstantLeadReplyWork from '../pages/BlogHowDoesInstantLeadReplyWork';
import BlogHowToScheduleText from '../pages/BlogHowToScheduleText';
import BlogAutomaticGoogleReviews from '../pages/BlogAutomaticGoogleReviews';
import BlogOutsourcedReceptionServices from '../pages/BlogOutsourcedReceptionServices';
import BlogEffectivePhoneCallScripts from '../pages/BlogEffectivePhoneCallScripts';
import BlogLiveAnsweringServiceCosts from '../pages/BlogLiveAnsweringServiceCosts';
import BlogProfessionalTelephoneEtiquette from '../pages/BlogProfessionalTelephoneEtiquette';
import BlogAnsweringServiceAppointmentScheduling from '../pages/BlogAnsweringServiceAppointmentScheduling';
import Newsletter from '../pages/Newsletter';
import Comparisons from '../pages/Comparisons';
import TraditionalCallCentersVsBoltcall from '../pages/comparisons/TraditionalCallCentersVsBoltcall';
import ReceptionistVsBoltcall from '../pages/comparisons/ReceptionistVsBoltcall';
import VoicemailVsBoltcall from '../pages/comparisons/VoicemailVsBoltcall';
import AnsweringServicesVsBoltcall from '../pages/comparisons/AnsweringServicesVsBoltcall';
import CRMInstantLeadReplyVsBoltcall from '../pages/comparisons/CRMInstantLeadReplyVsBoltcall';
import AIRevenueAudit from '../pages/AIRevenueAudit';
import SEOAnalyzer from '../pages/SEOAnalyzer';
import ConversionRateOptimizer from '../pages/ConversionRateOptimizer';
import NotFound from '../pages/NotFound';
import AdminPanel from '../pages/AdminPanel';
import AIReceptionistPage from '../pages/features/AIReceptionistPage';
import InstantFormReplyPage from '../pages/features/InstantFormReplyPage';
import SMSBookingAssistantPage from '../pages/features/SMSBookingAssistantPage';
import AutomatedRemindersPage from '../pages/features/AutomatedRemindersPage';
import AIFollowUpSystemPage from '../pages/features/AIFollowUpSystemPage';
import WebsiteChatVoiceWidgetPage from '../pages/features/WebsiteChatVoiceWidgetPage';
import LeadReactivationFeaturePage from '../pages/features/LeadReactivationPage';
import SmartWebsitePage from '../pages/features/SmartWebsitePage';
import FeatureSectionWithHoverEffectsDemo from '../pages/FeatureSectionWithHoverEffectsDemo';

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
        <Route path="/giveaway" element={<Giveaway />} />
            <Route path="/black-friday-gift-cards" element={<GiftCardPage />} />
        <Route path="/smart-website" element={<OfferPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/blog" element={<BlogCenter />} />
        <Route path="/newsletter" element={<Newsletter />} />
        <Route path="/blog/the-new-reality-for-local-businesses" element={<Blog />} />
        <Route path="/blog/why-speed-matters-391-percent-advantage" element={<BlogSpeed />} />
        <Route path="/blog/why-website-speed-is-everything" element={<BlogSpeedWebsite />} />
        <Route path="/blog/complete-guide-to-seo" element={<BlogSEO />} />
        <Route path="/blog/complete-guide-to-ai-for-local-businesses" element={<BlogAIGuide />} />
        <Route path="/blog/best-ai-receptionist-tools-for-small-businesses" element={<BlogAIReceptionistComparison />} />
        <Route path="/blog/how-does-an-ai-receptionist-work" element={<BlogAIReceptionistHowItWorks />} />
        <Route path="/blog/is-ai-receptionist-worth-it" element={<BlogIsAIReceptionistWorthIt />} />
        <Route path="/blog/how-to-make-ai-receptionist" element={<BlogHowToMakeAIReceptionist />} />
        <Route path="/blog/will-receptionists-be-replaced-by-ai" element={<BlogWillReceptionistsBeReplacedByAI />} />
        <Route path="/blog/what-does-instant-lead-reply-mean" element={<BlogWhatDoesInstantLeadReplyMean />} />
        <Route path="/blog/how-to-set-up-instant-lead-reply" element={<BlogHowToSetUpInstantLeadReply />} />
        <Route path="/blog/how-does-instant-lead-reply-work" element={<BlogHowDoesInstantLeadReplyWork />} />
        <Route path="/blog/how-to-schedule-text" element={<BlogHowToScheduleText />} />
        <Route path="/blog/automatic-google-reviews" element={<BlogAutomaticGoogleReviews />} />
        <Route path="/blog/benefits-of-outsourced-reception-services" element={<BlogOutsourcedReceptionServices />} />
        <Route path="/blog/effective-phone-call-scripts-for-receptionists" element={<BlogEffectivePhoneCallScripts />} />
        <Route path="/blog/understanding-live-answering-service-costs" element={<BlogLiveAnsweringServiceCosts />} />
        <Route path="/blog/tips-for-professional-telephone-etiquette" element={<BlogProfessionalTelephoneEtiquette />} />
        <Route path="/blog/benefits-of-answering-service-appointment-scheduling" element={<BlogAnsweringServiceAppointmentScheduling />} />
        <Route path="/comparisons" element={<Comparisons />} />
        <Route path="/comparisons/traditional-call-centers-vs-boltcall" element={<TraditionalCallCentersVsBoltcall />} />
        <Route path="/comparisons/receptionist-vs-boltcall" element={<ReceptionistVsBoltcall />} />
        <Route path="/comparisons/voicemail-vs-boltcall" element={<VoicemailVsBoltcall />} />
        <Route path="/comparisons/answering-services-vs-boltcall" element={<AnsweringServicesVsBoltcall />} />
        <Route path="/comparisons/crm-instant-lead-reply-vs-boltcall" element={<CRMInstantLeadReplyVsBoltcall />} />
        <Route path="/ai-agent-comparison" element={<TraditionalCallCentersVsBoltcall />} />
        <Route path="/calculator/ai-revenue-audit" element={<AIRevenueAudit />} />
        <Route path="/how-much-you-can-earn-with-ai" element={<AIRevenueAudit />} />
        <Route path="/seo-audit" element={<SEOAnalyzer />} />
        <Route path="/conversion-rate-optimizer" element={<ConversionRateOptimizer />} />
        {/* Feature Pages */}
        <Route path="/features/ai-receptionist" element={<AIReceptionistPage />} />
        <Route path="/features/instant-form-reply" element={<InstantFormReplyPage />} />
        <Route path="/features/sms-booking-assistant" element={<SMSBookingAssistantPage />} />
        <Route path="/features/automated-reminders" element={<AutomatedRemindersPage />} />
        <Route path="/features/ai-follow-up-system" element={<AIFollowUpSystemPage />} />
        <Route path="/features/website-chat-voice-widget" element={<WebsiteChatVoiceWidgetPage />} />
        <Route path="/features/lead-reactivation" element={<LeadReactivationFeaturePage />} />
        <Route path="/features/smart-website" element={<SmartWebsitePage />} />
        {/* Demo Pages */}
        <Route path="/feature-section-with-hover-effects-demo" element={<FeatureSectionWithHoverEffectsDemo />} />
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
