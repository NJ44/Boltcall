import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Bot,
  BookOpen,
  Users,
  Settings,
  Menu,
  X,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  Bell,
  UserPlus,
  Calendar,
  Phone,
  FileText,
  Ticket,
  Crown,
  Server,
  Mail,
  Globe,
  Plug,
  Zap,
  MessagesSquare,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { addLogEntry, logUserAction } from '../../lib/logging';
import { LocationSwitcher } from './LocationSwitcher';
import AiAssistant from './AiAssistant';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHelpSidebar, setShowHelpSidebar] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrollbarVisible, setScrollbarVisible] = useState(false);
  
  // Get current user from auth context
  const { user } = useAuth();
  
  // Mock user plan - in real app, this would come from user context/API
  const userPlan: 'free' | 'pro' | 'elite' = 'free';
  
  
  // Notification toggles
  const [notifications, setNotifications] = useState({
    newLead: true,
    appointmentBooked: true,
    appointmentCancelled: true,
    missedCall: true,
    systemAlert: false
  });

  // Services status
  const [services, setServices] = useState({
    aiReceptionist: true,
    phoneSystem: true,
    sms: true,
    whatsapp: false,
    email: true,
    calendar: true,
    analytics: true,
    voiceLibrary: true,
    knowledgeBase: true,
    websiteBubble: false
  });

  // Log dashboard access when component mounts
  useEffect(() => {
    if (user?.id) {
      addLogEntry('Dashboard Access', 'User accessed dashboard', user.id);
    }
  }, [user?.id]);

  // Scrollbar auto-hide functionality
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      setScrollbarVisible(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setScrollbarVisible(false);
      }, 3000); // Hide after 3 seconds of inactivity
    };

    const mainElement = mainContentRef.current;
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll, { passive: true });
      mainElement.addEventListener('mouseenter', () => setScrollbarVisible(true));
      mainElement.addEventListener('mouseleave', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          setScrollbarVisible(false);
        }, 3000);
      });
    }

    return () => {
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
        mainElement.removeEventListener('mouseenter', () => setScrollbarVisible(true));
        mainElement.removeEventListener('mouseleave', () => {});
      }
      clearTimeout(scrollTimeout);
    };
  }, []);

  const location = useLocation();
  const { logout } = useAuth();
  const mainContentRef = useRef<HTMLElement>(null);

  // Get current page name based on route
  const getPageName = () => {
    const path = location.pathname;
    
    // Define page name mappings for better display
    const pageNames: Record<string, string> = {
      '/dashboard': 'Overview',
      '/dashboard/leads': 'Leads',
      '/dashboard/calls': 'Calls',
      '/dashboard/messages': 'Messages',
      '/dashboard/reminders': 'Reminders',
      '/dashboard/agents': 'AI Agents',
      '/dashboard/knowledge-base': 'Knowledge Base',
      '/dashboard/phone': 'Phone Numbers',
      '/dashboard/chat-widget': 'Chat Widget',
      '/dashboard/integrations': 'Integrations',
      '/dashboard/analytics': 'Analytics',
      '/dashboard/settings': 'Settings',
      '/dashboard/settings/members': 'Team Members',
      '/dashboard/settings/plan-billing': 'Plan & Billing',
    };
    
    // Return mapped name or convert path to title case
    if (pageNames[path]) {
      return pageNames[path];
    }
    
    // Fallback: convert path to title case
    const pathSegments = path.split('/').filter(Boolean);
    const pageSegment = pathSegments[pathSegments.length - 1] || 'dashboard';
    
    return pageSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Add dashboard-page class to body for normal scrolling
  useEffect(() => {
    document.body.classList.add('dashboard-page');
    return () => {
      document.body.classList.remove('dashboard-page');
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };




  const handleLogout = async () => {
    try {
      if (user?.id) {
        await logUserAction('User Logout', 'User logged out from dashboard', user.id);
      }
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };


  const toggleNotification = (key: keyof typeof notifications) => {
    const newValue = !notifications[key];
    if (user?.id) {
      logUserAction('Notification Toggle', `Toggled ${key} notification to ${newValue ? 'enabled' : 'disabled'}`, user.id);
    }
    setNotifications(prev => ({
      ...prev,
      [key]: newValue
    }));
  };

  const toggleService = (key: keyof typeof services) => {
    const newValue = !services[key];
    if (user?.id) {
      logUserAction('Service Toggle', `Toggled ${key} service to ${newValue ? 'enabled' : 'disabled'}`, user.id);
    }
    setServices(prev => ({
      ...prev,
      [key]: newValue
    }));
  };


  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showUserMenu && !target.closest('[data-user-menu]')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  // Load dark mode preference on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Apply dark mode class when isDarkMode changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Focus main content area to ensure mouse wheel events work
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.focus();
    }
  }, []);

  // MAIN
  const navItemsMain = [
    { to: '/dashboard', label: 'Overview', icon: <LayoutDashboard className="w-3.5 h-3.5 scale-[0.95]" /> },
    { to: '/dashboard/leads', label: 'Leads', icon: <Zap className="w-3.5 h-3.5 scale-[0.95]" /> },
  ];

  // COMMUNICATIONS
  const navItemsCommunications = [
    { to: '/dashboard/calls', label: 'Calls', icon: <Phone className="w-3.5 h-3.5 scale-[0.95]" /> },
    { to: '/dashboard/messages', label: 'Messages', icon: <MessagesSquare className="w-3.5 h-3.5 scale-[0.95]" /> },
    { to: '/dashboard/reminders', label: 'Reminders', icon: <Bell className="w-3.5 h-3.5 scale-[0.95]" /> },
  ];

  // SETUP
  const navItemsSetup = [
    { to: '/dashboard/agents', label: 'AI Agents', icon: <Bot className="w-3.5 h-3.5 scale-[0.95]" /> },
    { to: '/dashboard/knowledge-base', label: 'Knowledge Base', icon: <BookOpen className="w-3.5 h-3.5 scale-[0.95]" /> },
    { to: '/dashboard/phone', label: 'Phone Numbers', icon: <Phone className="w-3.5 h-3.5 scale-[0.95]" /> },
    { to: '/dashboard/chat-widget', label: 'Chat Widget', icon: <MessageSquare className="w-3.5 h-3.5 scale-[0.95]" /> },
    { to: '/dashboard/integrations', label: 'Integrations', icon: <Plug className="w-3.5 h-3.5 scale-[0.95]" /> },
  ];

  // INSIGHTS
  const navItemsInsights = [
    { to: '/dashboard/analytics', label: 'Analytics', icon: <BarChart3 className="w-3.5 h-3.5 scale-[0.95]" /> },
  ];

  const navItemsFooter = [
    { to: '/dashboard/settings', label: 'Settings', icon: <Settings className="w-5 h-5 scale-[0.95]" /> },
    { to: '/help-center', label: 'Help Center', icon: <HelpCircle className="w-5 h-5 scale-[0.95]" /> },
  ];



  // Helper function to render navigation items
  const renderNavItem = (item: any, isActive: boolean) => {
    return (
      <Link
        key={item.to}
        to={item.to}
        data-onboarding={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
        onClick={closeSidebar}
        className={`relative flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-700 group ${
          isActive
            ? isDarkMode
              ? 'bg-[#1a1a1f] text-white'
              : 'bg-blue-50 text-blue-700'
            : isDarkMode
              ? 'text-white hover:bg-[#1a1a1f]'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-300/30'
        }`}
      >
        <span className="flex items-center -mt-[5px]">
          {item.icon}
        </span>
        <span className="relative pb-1">
          {item.label}
          <div className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 ${
            isActive ? 'w-full' : 'w-0 group-hover:w-full'
          }`} 
          style={{
            transition: isActive 
              ? 'width 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              : 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
          }} />
        </span>
      </Link>
    );
  };

  return (
    <ToastProvider>
      <div className="h-screen flex transition-colors duration-300 gap-4 bg-gray-100 dark:bg-[#0a0a0c]">
      <div className="flex flex-1 overflow-hidden gap-4">
         {/* Left Panel - Navigation with Logo at Top */}
         <aside data-onboarding="sidebar" className={`fixed lg:static inset-y-0 left-0 z-40 transform transition-all duration-300 ease-in-out flex-shrink-0 w-64 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} bg-white dark:bg-[#111114] rounded-2xl shadow-lg m-2 dashboard-sidebar`}>
          <div className="flex flex-col h-full pt-2 pb-4">
            {/* Logo at Top - Aligned Left */}
            <div className="mb-3 px-2">
            <Link 
              to="/dashboard" 
              className="flex items-center justify-center"
            >
              <img 
                src="/boltcall_full_logo.png" 
                alt="Boltcall" 
                  className="h-14 w-auto"
              />
            </Link>
          </div>
          
            {/* User profile moved to top-right bar */}

            {/* Mobile menu button */}
              <button
                onClick={toggleSidebar}
                className={`lg:hidden absolute top-2 right-2 p-2 rounded-md transition-colors ${
           isDarkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-[#1a1a1f]' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300/50'
                }`}
                aria-label="Toggle navigation menu"
              >
                <X className="w-5 h-5" />
              </button>

            
            {/* Navigation */}
            <nav className="flex-1 flex flex-col overflow-y-auto dashboard-sidebar" aria-label="Main navigation">
              <div className="flex-1 px-2">
                {/* Main */}
                <div className="space-y-1 mb-4">
                  {navItemsMain.map((item) => {
                    const isActive = location.pathname === item.to;
                    return renderNavItem(item, isActive);
                  })}
                </div>

                {/* Communications */}
                <div className="mb-4">
                  <p className={`px-2 mb-1 text-[10px] font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Communications</p>
                  <div className="space-y-1">
                    {navItemsCommunications.map((item) => {
                      const isActive = location.pathname === item.to;
                      return renderNavItem(item, isActive);
                    })}
                  </div>
                </div>

                {/* Setup */}
                <div className="mb-4">
                  <p className={`px-2 mb-1 text-[10px] font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Setup</p>
                  <div className="space-y-1">
                    {navItemsSetup.map((item) => {
                      const isActive = location.pathname === item.to;
                      return renderNavItem(item, isActive);
                    })}
                  </div>
                </div>

                {/* Insights */}
                <div className="mb-4">
                  <p className={`px-2 mb-1 text-[10px] font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Insights</p>
                  <div className="space-y-1">
                    {navItemsInsights.map((item) => {
                      const isActive = location.pathname === item.to;
                      return renderNavItem(item, isActive);
                    })}
                  </div>
                </div>

              </div>

              {/* Footer Group - Always at very bottom */}
              <div className="space-y-1 mt-2 pt-2 border-t border-gray-200 dark:border-[#1e1e24] px-2">
                {navItemsFooter.map((item) => {
                  const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
                  return renderNavItem(item, isActive);
                })}
              </div>

            </nav>
            
            {/* Spacer */}
            <div className="mt-auto" />
            
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

         {/* Right Panel - Main Content with Top Bar */}
         <main 
           ref={mainContentRef}
           className={`flex-1 overflow-y-auto transition-colors duration-300 rounded-2xl bg-white dark:bg-[#0e0e11] shadow-lg m-2 dashboard-main-scroll ${
             scrollbarVisible ? 'scrollbar-visible' : 'scrollbar-hidden'
           }`}
           style={{
             scrollBehavior: 'auto',
             WebkitOverflowScrolling: 'touch',
             overscrollBehavior: 'contain'
           }}
           tabIndex={0}
         >
           {/* Top Bar - Page Header */}
           <div className="sticky top-0 z-10 flex-shrink-0 transition-colors duration-300 bg-white/80 backdrop-blur-sm">
             <div className="flex items-center justify-between h-16 px-6">
               {/* Left side - Mobile menu button and Page Name */}
               <div className="flex items-center gap-3">
                 <button
                   onClick={toggleSidebar}
                   className={`lg:hidden p-2 rounded-md transition-colors ${
                     isDarkMode 
                       ? 'text-gray-300 hover:text-white hover:bg-[#1a1a1f]' 
                       : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300/30'
                   }`}
                   aria-label="Toggle navigation menu"
                 >
                   <Menu className="w-5 h-5" />
                 </button>
                 
                 {/* Page Name Header */}
                 <div className="flex items-center gap-2">
                   <div className={`w-1 h-6 rounded-full ${
                     isDarkMode ? 'bg-blue-400' : 'bg-blue-600'
                   }`}></div>
                   <h1 className={`text-2xl font-semibold ${
                     isDarkMode ? 'text-white' : 'text-gray-900'
                   }`}>
                     {getPageName()}
                   </h1>
                 </div>
               </div>
          
              {/* Right side - Free Trial, Toggle, Location switcher, Notifications */}
              <div className="flex items-center gap-3">
                <LocationSwitcher />
                 
                 {/* Notification Dropdown */}
                 <div className="relative group">
                 <button
                   className="p-2 rounded-lg transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-300/30 relative"
                   aria-label="Notification settings"
                 >
                   <Bell className="w-5 h-5" />
                 </button>

                   {/* Notification Dropdown Content */}
                   <div className="absolute right-0 top-full mt-2 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out transform translate-y-2 group-hover:translate-y-0 z-50">
                     <div className={`rounded-2xl shadow-xl border p-4 ${isDarkMode ? 'bg-[#111114] border-[#1e1e24]' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
                         <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Notification Settings
                         </h3>
          </div>
          
                       <div className="space-y-3 max-h-80 overflow-y-auto">
            {/* New Lead Notification */}
                         <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-[#161619]' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-blue-600" />
                <div>
                               <div className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>New Lead Arrives</div>
                               <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Get notified when a new lead is captured</div>
                </div>
              </div>
              <button
                onClick={() => toggleNotification('newLead')}
                             className={`relative w-10 h-5 rounded-full transition-colors ${
                  notifications.newLead ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                             <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                               notifications.newLead ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            {/* Appointment Booked Notification */}
                         <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-[#161619]' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-blue-600" />
                <div>
                               <div className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Appointment Booked</div>
                               <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Get notified when an appointment is scheduled</div>
                </div>
              </div>
              <button
                onClick={() => toggleNotification('appointmentBooked')}
                             className={`relative w-10 h-5 rounded-full transition-colors ${
                  notifications.appointmentBooked ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                             <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                               notifications.appointmentBooked ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            {/* Missed Call Notification */}
                         <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-[#161619]' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-blue-600" />
                <div>
                               <div className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Missed Call</div>
                               <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Get notified when a call is missed</div>
                </div>
              </div>
              <button
                onClick={() => toggleNotification('missedCall')}
                             className={`relative w-10 h-5 rounded-full transition-colors ${
                  notifications.missedCall ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                             <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                               notifications.missedCall ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
                </div>
                </div>
              </div>
                 </div>

                 {/* Services Status Dropdown */}
                 <div className="relative group">
                   <button
                     className="p-2 rounded-lg transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-300/30 relative"
                     aria-label="Services status"
                   >
                     <Server className="w-5 h-5" />
                   </button>

                   {/* Services Dropdown — minimal list */}
                   <div className="absolute right-0 top-full mt-2 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                     <div className={`rounded-lg shadow-lg border py-2 ${isDarkMode ? 'bg-[#111114] border-[#1e1e24]' : 'bg-white border-gray-200'}`}>
                       <div className="px-3 py-1.5 mb-1">
                         <span className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Services</span>
                       </div>

                       {([
                         { key: 'aiReceptionist' as const, label: 'AI Receptionist', icon: <Users className="w-4 h-4" />, configured: true },
                         { key: 'phoneSystem' as const, label: 'Phone System', icon: <Phone className="w-4 h-4" />, configured: true },
                         { key: 'sms' as const, label: 'SMS', icon: <MessageSquare className="w-4 h-4" />, configured: true },
                         { key: 'whatsapp' as const, label: 'WhatsApp', icon: <MessageSquare className="w-4 h-4" />, configured: false },
                         { key: 'email' as const, label: 'Email', icon: <Mail className="w-4 h-4" />, configured: true },
                         { key: 'calendar' as const, label: 'Calendar', icon: <Calendar className="w-4 h-4" />, configured: true },
                         { key: 'analytics' as const, label: 'Analytics', icon: <BarChart3 className="w-4 h-4" />, configured: true },
                         { key: 'websiteBubble' as const, label: 'Website Widget', icon: <Globe className="w-4 h-4" />, configured: false },
                       ] as const).map((svc) => (
                         <div
                           key={svc.key}
                           className={`flex items-center justify-between px-3 py-2 ${isDarkMode ? 'hover:bg-[#1a1a1f]' : 'hover:bg-gray-50'}`}
                         >
                           <div className="flex items-center gap-2.5">
                             <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{svc.icon}</span>
                             <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{svc.label}</span>
                           </div>

                           {svc.configured ? (
                             <button
                               onClick={() => toggleService(svc.key)}
                               className={`relative w-8 h-[18px] rounded-full transition-colors flex-shrink-0 ${
                                 services[svc.key] ? 'bg-green-500' : 'bg-gray-300'
                               }`}
                             >
                               <div className={`absolute top-[2px] w-[14px] h-[14px] bg-white rounded-full transition-transform shadow-sm ${
                                 services[svc.key] ? 'translate-x-[15px]' : 'translate-x-[2px]'
                               }`} />
                             </button>
                           ) : (
                             <Link
                               to="/dashboard/settings/services"
                               className="text-xs font-medium text-blue-600 hover:text-blue-700"
                             >
                               Configure
                             </Link>
                           )}
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>

                  {/* User Avatar */}
                  <div className="relative" data-user-menu>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs font-semibold hover:bg-gray-700 transition-colors"
                      title={user?.name || 'User'}
                    >
                      {(user?.name || 'U').charAt(0).toUpperCase()}
                    </button>

                    <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute right-0 top-full mt-2 w-64 rounded-xl shadow-xl border border-gray-200 bg-white z-50 overflow-hidden"
                      >
                        {/* Profile Header */}
                        <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-100">
                          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                            {(user?.name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'User'}</div>
                            <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            to="/dashboard/settings/plan-billing"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <UserPlus className="w-4 h-4 text-gray-400" />
                            Invite a Friend & Earn
                          </Link>
                          <button
                            onClick={() => { setShowUserMenu(false); }}
                            className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <span className="flex items-center gap-3">
                              <Bell className="w-4 h-4 text-gray-400" />
                              Notifications
                            </span>
                            <ChevronDown className="w-3.5 h-3.5 text-gray-400 -rotate-90" />
                          </button>
                          <button
                            onClick={() => { setShowUserMenu(false); setShowHelpSidebar(true); }}
                            className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <span className="flex items-center gap-3">
                              <HelpCircle className="w-4 h-4 text-gray-400" />
                              Help Center
                            </span>
                            <ChevronDown className="w-3.5 h-3.5 text-gray-400 -rotate-90" />
                          </button>
                          <button
                            className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <span className="flex items-center gap-3">
                              <Globe className="w-4 h-4 text-gray-400" />
                              Language
                            </span>
                            <ChevronDown className="w-3.5 h-3.5 text-gray-400 -rotate-90" />
                          </button>
                        </div>

                        {/* Theme Switcher */}
                        <div className="px-4 py-3 border-t border-gray-100">
                          <div className="text-xs font-medium text-gray-900 mb-2">Theme</div>
                          <div className="inline-flex items-center bg-gray-100 rounded-lg p-0.5">
                            <button
                              onClick={() => { setIsDarkMode(false); localStorage.setItem('darkMode', 'false'); }}
                              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                                !isDarkMode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                              }`}
                            >
                              Light
                            </button>
                            <button
                              onClick={() => { setIsDarkMode(true); localStorage.setItem('darkMode', 'true'); }}
                              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                                isDarkMode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                              }`}
                            >
                              Dark
                            </button>
                            <button
                              onClick={() => {
                                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                                setIsDarkMode(prefersDark);
                                localStorage.removeItem('darkMode');
                              }}
                              className="px-3 py-1.5 text-xs font-medium rounded-md text-gray-500 hover:text-gray-700 transition-colors"
                            >
                              System
                            </button>
                          </div>
                        </div>

                        {/* Bottom Section */}
                        <div className="py-2 border-t border-gray-100">
                          <Link
                            to="/dashboard/settings/general"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Settings className="w-4 h-4 text-gray-400" />
                            Settings
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

           {/* Page Content */}
           <div className="p-6">
             <Outlet />
          </div>

           {/* AI Assistant - Bottom Right */}
           <AiAssistant />
         </main>
          </div>
        </div>




    {/* Help Sidebar */}
    <div className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${showHelpSidebar ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={() => setShowHelpSidebar(false)}
      />
      
      {/* Sidebar */}
      <div className={`absolute right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${showHelpSidebar ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Help & Support</h2>
              <button
                onClick={() => setShowHelpSidebar(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 space-y-6">
              {/* Documentation Links */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Documentation</h3>
                <div className="space-y-3">
                  <Link
                    to="/help-center"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    onClick={() => setShowHelpSidebar(false)}
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        Documentation
                      </div>
                      <div className="text-sm text-gray-500">Complete guides and API reference</div>
                    </div>
                  </Link>
                  
                  <Link
                    to="/help-center"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    onClick={() => setShowHelpSidebar(false)}
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <HelpCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                        Help Center
                      </div>
                      <div className="text-sm text-gray-500">FAQs, guides, and troubleshooting</div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Support Actions */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Get Support</h3>
                <div className="space-y-3">
                  {/* Create Support Ticket */}
                  <button
                    onClick={() => {
                      // Handle support ticket creation
                      // TODO: handle support ticket creation
                      setShowHelpSidebar(false);
                    }}
                    className="w-full flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Ticket className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                        Create Support Ticket
                      </div>
                      <div className="text-sm text-gray-500">Submit your issue for detailed assistance.</div>
                    </div>
                  </button>

                  {/* Schedule Onboarding - Only for paid plans */}
                  {userPlan !== 'free' && (
                    <button
                      onClick={() => {
                        // Handle onboarding scheduling
                        // TODO: handle onboarding scheduling
                        setShowHelpSidebar(false);
                      }}
                      className="w-full flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                          Schedule Onboarding
                        </div>
                        <div className="text-sm text-gray-500">Get personalized setup assistance</div>
                      </div>
                    </button>
                  )}

                  {/* Upgrade Button - Only for free plan */}
                  {userPlan === 'free' && (
                    <button
                      onClick={() => {
                        // Handle upgrade
                        // TODO: handle upgrade
                        setShowHelpSidebar(false);
                      }}
                      className="w-full flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all group"
                    >
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium group-hover:text-yellow-200 transition-colors">
                          Upgrade
                        </div>
                        <div className="text-sm text-blue-100">Unlock premium features and support</div>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Plan Status */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className={`w-2 h-2 rounded-full ${
                    userPlan === 'free' ? 'bg-gray-400' : 
                    userPlan === 'pro' ? 'bg-blue-500' : 'bg-purple-500'
                  }`} />
                  <span>Current plan: {userPlan === 'free' ? 'Free' : userPlan === 'pro' ? 'Pro' : 'Elite'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
};

export default DashboardLayout;
