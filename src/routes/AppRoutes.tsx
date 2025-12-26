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
import About from '../pages/About';
import ComingSoon from '../pages/ComingSoon';
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
import BlogAIGuideStep1 from '../pages/BlogAIGuideStep1';
import BlogAIGuideStep2 from '../pages/BlogAIGuideStep2';
import BlogAIGuideStep3 from '../pages/BlogAIGuideStep3';
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
import BlogTop10AIReceptionistAgencies from '../pages/BlogTop10AIReceptionistAgencies';
import BlogGeminiGemBusinessAssistant from '../pages/BlogGeminiGemBusinessAssistant';
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
import AIVisibilityCheck from '../pages/AIVisibilityCheck';
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
import GradientCardShowcaseDemo from '../pages/GradientCardShowcaseDemo';
import FloatingIconsHeroDemo from '../pages/FloatingIconsHeroDemo';
import CountdownDemo from '../pages/CountdownDemo';
import Icon3DHoverDemo from '../pages/Icon3DHoverDemo';
import ChallengeCardDemo from '../pages/ChallengeCardDemo';
import Challenge from '../pages/Challenge';
import OtpDemo from '../pages/OtpDemo';
import PremiumProcessTimelineDemo from '../pages/PremiumProcessTimelineDemo';
import NeuralNetworkHeroDemo from '../pages/NeuralNetworkHeroDemo';
import DottedSurfaceDemo from '../pages/DottedSurfaceDemo';
import Strike from '../pages/Strike';

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
        <Route path="/setup" element={<ComingSoon />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        
        {/* Speed Test Funnel */}
        <Route path="/speed-test" element={<SpeedTestLanding />} />
        <Route path="/speed-test/login" element={<SpeedTestLogin />} />
        <Route path="/speed-test/report" element={<SpeedTestReport />} />
        <Route path="/speed-test/offer" element={<SpeedTestOffer />} />
        <Route path="/payment/pro" element={<PaymentPro />} />
        <Route path="/payment/elite-starter" element={<PaymentEliteStarter />} />
        <Route path="/giveaway" element={<Giveaway />} />
            <Route path="/gift-cards" element={<GiftCardPage />} />
        <Route path="/smart-website" element={<OfferPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/blog" element={<BlogCenter />} />
        <Route path="/newsletter" element={<Newsletter />} />
        <Route path="/blog/the-new-reality-for-local-businesses" element={<Blog />} />
        <Route path="/blog/why-speed-matters" element={<BlogSpeed />} />
        <Route path="/blog/why-website-speed-is-everything" element={<BlogSpeedWebsite />} />
        <Route path="/blog/complete-guide-to-seo" element={<BlogSEO />} />
        <Route path="/ai-guide-for-businesses" element={<BlogAIGuide />} />
        <Route path="/ai-guide-for-businesses/level-1-understanding-ai" element={<BlogAIGuideStep1 />} />
        <Route path="/ai-guide-for-businesses/level-2-choosing-ai-tools" element={<BlogAIGuideStep2 />} />
        <Route path="/ai-guide-for-businesses/level-3-getting-started" element={<BlogAIGuideStep3 />} />
        <Route path="/blog/best-ai-receptionist-tools" element={<BlogAIReceptionistComparison />} />
        <Route path="/blog/how-ai-receptionist-works" element={<BlogAIReceptionistHowItWorks />} />
        <Route path="/blog/is-ai-receptionist-worth-it" element={<BlogIsAIReceptionistWorthIt />} />
        <Route path="/blog/how-to-make-ai-receptionist" element={<BlogHowToMakeAIReceptionist />} />
        <Route path="/blog/will-receptionists-be-replaced-by-ai" element={<BlogWillReceptionistsBeReplacedByAI />} />
        <Route path="/blog/instant-lead-reply-guide" element={<BlogWhatDoesInstantLeadReplyMean />} />
        <Route path="/blog/setup-instant-lead-reply" element={<BlogHowToSetUpInstantLeadReply />} />
        <Route path="/blog/how-instant-lead-reply-works" element={<BlogHowDoesInstantLeadReplyWork />} />
        <Route path="/blog/how-to-schedule-text" element={<BlogHowToScheduleText />} />
        <Route path="/blog/automatic-google-reviews" element={<BlogAutomaticGoogleReviews />} />
        <Route path="/blog/benefits-of-outsourced-reception-services" element={<BlogOutsourcedReceptionServices />} />
        <Route path="/blog/phone-call-scripts" element={<BlogEffectivePhoneCallScripts />} />
        <Route path="/blog/understanding-live-answering-service-costs" element={<BlogLiveAnsweringServiceCosts />} />
        <Route path="/blog/tips-for-professional-telephone-etiquette" element={<BlogProfessionalTelephoneEtiquette />} />
        <Route path="/blog/answering-service-scheduling" element={<BlogAnsweringServiceAppointmentScheduling />} />
        <Route path="/blog/top-10-ai-receptionist-agencies" element={<BlogTop10AIReceptionistAgencies />} />
        <Route path="/blog/create-gemini-gem-business-assistant" element={<BlogGeminiGemBusinessAssistant />} />
        <Route path="/comparisons" element={<Comparisons />} />
        <Route path="/comparisons/call-centers-vs-boltcall" element={<TraditionalCallCentersVsBoltcall />} />
        <Route path="/comparisons/receptionist-vs-boltcall" element={<ReceptionistVsBoltcall />} />
        <Route path="/comparisons/voicemail-vs-boltcall" element={<VoicemailVsBoltcall />} />
        <Route path="/comparisons/answering-services-vs-boltcall" element={<AnsweringServicesVsBoltcall />} />
        <Route path="/comparisons/crm-vs-boltcall" element={<CRMInstantLeadReplyVsBoltcall />} />
        <Route path="/ai-agent-comparison" element={<TraditionalCallCentersVsBoltcall />} />
        <Route path="/ai-revenue-audit" element={<AIRevenueAudit />} />
        <Route path="/ai-revenue-calculator" element={<AIRevenueAudit />} />
        <Route path="/seo-audit" element={<SEOAnalyzer />} />
        <Route path="/conversion-rate-optimizer" element={<ConversionRateOptimizer />} />
        <Route path="/ai-visibility-check" element={<AIVisibilityCheck />} />
        {/* Feature Pages */}
        <Route path="/features/ai-receptionist" element={<AIReceptionistPage />} />
        <Route path="/features/instant-form-reply" element={<InstantFormReplyPage />} />
        <Route path="/features/sms-booking-assistant" element={<SMSBookingAssistantPage />} />
        <Route path="/features/automated-reminders" element={<AutomatedRemindersPage />} />
        <Route path="/features/ai-follow-up-system" element={<AIFollowUpSystemPage />} />
        <Route path="/features/website-widget" element={<WebsiteChatVoiceWidgetPage />} />
        <Route path="/features/lead-reactivation" element={<LeadReactivationFeaturePage />} />
        <Route path="/features/smart-website" element={<SmartWebsitePage />} />
        {/* Demo Pages */}
        <Route path="/feature-section-demo" element={<FeatureSectionWithHoverEffectsDemo />} />
        <Route path="/gradient-card-showcase-demo" element={<GradientCardShowcaseDemo />} />
        <Route path="/floating-icons-hero-demo" element={<FloatingIconsHeroDemo />} />
        <Route path="/countdown-demo" element={<CountdownDemo />} />
        <Route path="/icon-3d-hover-demo" element={<Icon3DHoverDemo />} />
        <Route path="/challenge-card-demo" element={<ChallengeCardDemo />} />
        <Route path="/challenge" element={<Challenge />} />
        <Route path="/otp-demo" element={<OtpDemo />} />
        <Route path="/premium-process-timeline-demo" element={<PremiumProcessTimelineDemo />} />
        <Route path="/neural-network-hero-demo" element={<NeuralNetworkHeroDemo />} />
        <Route path="/dotted-surface-demo" element={<DottedSurfaceDemo />} />
        <Route path="/strike-ai" element={<Strike />} />
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
