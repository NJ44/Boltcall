import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  Building2, 
  Settings,
  Menu,
  X,
  MessageSquare,
  User,
  Moon,
  Sun,
  Plug,
  UserPlus,
  HelpCircle,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ChevronDown,
  Bell,
  Calendar,
  Phone,
  AlertCircle,
  Activity
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ToastProvider } from '../../contexts/ToastContext';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [callsDropdownOpen, setCallsDropdownOpen] = useState(false);
  const [messagingDropdownOpen, setMessagingDropdownOpen] = useState(false);
  
  // Notification toggles
  const [notifications, setNotifications] = useState({
    newLead: true,
    appointmentBooked: true,
    appointmentCancelled: true,
    missedCall: true,
    systemAlert: false
  });
  const location = useLocation();
  const { user, logout } = useAuth();
  const mainContentRef = useRef<HTMLElement>(null);

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

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };


  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('darkMode', (!isDarkMode).toString());
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
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

  const navItemsGroup1 = [
    { to: '/dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/dashboard/analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const navItemsGroup2 = [
    { to: '/dashboard/agents', label: 'Agents', icon: <Users className="w-4 h-4" /> },
    { to: '/dashboard/knowledge', label: 'Knowledge Base', icon: <Building2 className="w-4 h-4" /> },
    { to: '/dashboard/phone', label: 'Phone Numbers', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  // Dropdown items
  const callsItems = [
    { to: '/dashboard/assistant', label: 'AI Receptionist', icon: <Users className="w-4 h-4" /> },
    { to: '/dashboard/missed-calls', label: 'Missed Calls', icon: <Phone className="w-4 h-4" /> },
  ];

  const messagingItems = [
    { to: '/dashboard/sms-booking', label: 'SMS Booking', icon: <MessageSquare className="w-4 h-4" /> },
    { to: '/dashboard/reminders', label: 'Reminders', icon: <Bell className="w-4 h-4" /> },
  ];

  const navItemsBottom = [
    { to: '/dashboard/integrations', label: 'Integrations', icon: <Plug className="w-5 h-5" /> },
  ];

  const navItemsFooter = [
    { to: '/dashboard/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
    { to: '/help-center', label: 'Help Center', icon: <HelpCircle className="w-5 h-5" /> },
  ];

  // Get current page name from route
  const getPageName = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Overview';
    if (path === '/dashboard/analytics') return 'Analytics';
    if (path === '/dashboard/agents') return 'Agents';
    if (path === '/dashboard/knowledge') return 'Knowledge Base';
    if (path === '/dashboard/phone') return 'Phone Numbers';
    if (path === '/dashboard/widgets') return 'Widgets';
    if (path === '/dashboard/sms-booking') return 'SMS Booking';
    if (path === '/dashboard/reminders') return 'Reminders';
    if (path === '/dashboard/assistant') return 'AI Receptionist';
    if (path === '/dashboard/missed-calls') return 'Missed Calls';
    if (path === '/dashboard/instant-lead-reply') return 'Instant Lead Reply';
    if (path === '/dashboard/sms') return 'SMS';
    if (path === '/dashboard/whatsapp') return 'WhatsApp';
    if (path === '/dashboard/integrations') return 'Integrations';
    if (path.startsWith('/dashboard/settings')) return 'Settings';
    return 'Dashboard';
  };

  // Helper function to render navigation items
  const renderNavItem = (item: any, isActive: boolean) => {
    if (sidebarCollapsed) {
      return (
        <Link
          key={item.to}
          to={item.to}
          onClick={closeSidebar}
          className={`relative flex items-center justify-center p-2 rounded-lg text-xs font-medium transition-all duration-700 group ${
            isActive
              ? isDarkMode 
                ? 'bg-gray-800 text-white' 
                : 'bg-blue-50 text-blue-700'
              : isDarkMode 
                ? 'text-white hover:bg-gray-800' 
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-300/30'
          }`}
          title={item.label}
        >
          {item.icon}
          {/* Tooltip */}
          <div className={`absolute left-full ml-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-900'
          }`}>
            {item.label}
          </div>
        </Link>
      );
    }

    return (
      <Link
        key={item.to}
        to={item.to}
        onClick={closeSidebar}
        className={`relative flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-700 group ${
          isActive
            ? isDarkMode 
              ? 'bg-gray-800 text-white' 
              : 'bg-blue-50 text-blue-700'
            : isDarkMode 
              ? 'text-white hover:bg-gray-800' 
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-300/30'
        }`}
      >
        {item.icon}
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
      <div className="h-screen flex transition-colors duration-300 gap-4 bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-1 overflow-hidden gap-4">
         {/* Left Panel - Navigation with Logo at Top */}
         <aside className={`fixed lg:static inset-y-0 left-0 z-40 transform transition-all duration-300 ease-in-out flex-shrink-0 ${
           sidebarCollapsed ? 'w-16' : 'w-64'
         } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} bg-white dark:bg-gray-800 rounded-2xl shadow-lg m-2`}>
          <div className="flex flex-col h-full pt-2 pb-4">
            {/* Logo at Top - Aligned Left */}
            <div className="mb-3 px-2">
            <Link 
              to="/dashboard" 
              className="flex items-center justify-center"
            >
              {sidebarCollapsed ? (
                <img 
                  src="/boltcall_icon.png" 
                  alt="Boltcall" 
                  className="h-8 w-8"
                />
              ) : (
              <img 
                src="/boltcall_full_logo.png" 
                alt="Boltcall" 
                  className="h-14 w-auto"
              />
              )}
            </Link>
          </div>
          
            {/* User Profile - Below Logo */}
            {!sidebarCollapsed && (
            <div className="mb-4 px-2">
             <div className="relative" data-user-menu>
               <button
                 onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center gap-3 rounded-lg p-2 w-full transition-colors ${
                   isDarkMode 
                      ? 'hover:bg-gray-700/50' 
                      : 'hover:bg-gray-300/50'
                 }`}
               >
                 <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                   <User className="w-4 h-4 text-blue-600" />
                 </div>
                  <div className="flex-1 text-left">
                   <div className={`text-sm font-medium ${
                     isDarkMode ? 'text-white' : 'text-gray-900'
                   }`}>
                     {user?.name || 'User'}
                   </div>
                   <div className={`text-xs ${
                     isDarkMode ? 'text-gray-400' : 'text-gray-500'
                   }`}>
                     {user?.email}
                   </div>
                 </div>
               </button>
               
               {/* User dropdown menu */}
               {showUserMenu && (
                  <div className={`absolute left-0 top-full mt-2 w-full rounded-lg shadow-lg border py-2 z-50 ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                       {user?.name || 'User'}
                     </div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                       {user?.email}
                     </div>
                   </div>
                   <div className="px-4 py-2">
                      <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Current Plan</div>
                      <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                       {user?.role === 'admin' ? 'Admin Plan' : 'Pro Plan'}
                     </div>
                   </div>
                    <div className="border-t border-gray-100 dark:border-gray-700">
                     <button
                       onClick={handleLogout}
                        className={`w-full flex items-center px-4 py-2 text-sm transition-colors ${
                          isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                     >
                       Sign out
                     </button>
                   </div>
                 </div>
               )}
             </div>
           </div>
            )}

            {/* Mobile menu button */}
              <button
                onClick={toggleSidebar}
                className={`lg:hidden absolute top-2 right-2 p-2 rounded-md transition-colors ${
           isDarkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300/50'
                }`}
                aria-label="Toggle navigation menu"
              >
                <X className="w-5 h-5" />
              </button>

            {/* Collapse/Expand button - Moved to right border */}
            <div className="absolute top-4 -right-3 z-50">
              <button
                onClick={toggleSidebarCollapse}
                className={`p-2 rounded-full bg-white shadow-lg border transition-colors ${
                  isDarkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300/50'
                }`}
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {sidebarCollapsed ? (
                  <ChevronRightIcon className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </button>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 flex flex-col" aria-label="Main navigation">
              <div className="flex-1">
                {/* Group 1 */}
                <div className="space-y-1 mb-4">
                  {navItemsGroup1.map((item) => {
                    const isActive = location.pathname === item.to;
                    return renderNavItem(item, isActive);
                  })}
                </div>

                {/* Group 2 */}
                <div className="space-y-1 mb-4">
                  {navItemsGroup2.map((item) => {
                    const isActive = location.pathname === item.to;
                    return renderNavItem(item, isActive);
                  })}
                </div>

                {/* Calls Dropdown */}
                <div className="space-y-1 mb-4">
                  <button
                    onClick={() => setCallsDropdownOpen(!callsDropdownOpen)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isDarkMode 
                        ? 'text-white hover:bg-gray-700/50' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-300/30'
                    }`}
                  >
                    <span>Calls</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${callsDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {callsDropdownOpen && (
                    <div className="ml-4 space-y-1">
                      {callsItems.map((item) => {
                  const isActive = location.pathname === item.to;
                        return renderNavItem(item, isActive);
                      })}
                    </div>
                  )}
                </div>

                {/* Messaging Dropdown */}
                <div className="space-y-1 mb-4">
                  <button
                    onClick={() => setMessagingDropdownOpen(!messagingDropdownOpen)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isDarkMode 
                        ? 'text-white hover:bg-gray-700/50' 
                                 : 'text-gray-700 hover:text-gray-900 hover:bg-gray-300/30'
                         }`}
                       >
                    <span>Messaging</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${messagingDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {messagingDropdownOpen && (
                    <div className="ml-4 space-y-1">
                      {messagingItems.map((item) => {
                        const isActive = location.pathname === item.to;
                        return renderNavItem(item, isActive);
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Group - Always at bottom */}
              <div className="space-y-1 mt-auto">
                {navItemsBottom.map((item) => {
                  const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
                  return renderNavItem(item, isActive);
                })}
              </div>

              {/* Footer Group - Always at very bottom */}
              <div className="space-y-1 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                {navItemsFooter.map((item) => {
                  const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
                  return renderNavItem(item, isActive);
                })}
              </div>
            </nav>
            
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
           className="flex-1 overflow-y-auto transition-colors duration-300 rounded-2xl bg-gray-50 dark:bg-gray-900 shadow-lg m-2"
           style={{
             scrollBehavior: 'auto',
             WebkitOverflowScrolling: 'touch',
             overscrollBehavior: 'contain'
           }}
           tabIndex={0}
         >
           {/* Top Bar - Page Header */}
           <div className="sticky top-0 z-10 flex-shrink-0 transition-colors duration-300 bg-gray-50/80 backdrop-blur-sm">
             <div className="flex items-center justify-between h-16 px-6">
               {/* Page Name Header */}
               <div className="flex items-center gap-3">
                 <button
                   onClick={toggleSidebar}
                   className={`lg:hidden p-2 rounded-md transition-colors ${
                     isDarkMode 
                       ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                       : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300/30'
                   }`}
                   aria-label="Toggle navigation menu"
                 >
                   <Menu className="w-5 h-5" />
                 </button>
                 <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                   {getPageName()}
                 </h1>
               </div>
          
               {/* Right side - Free Trial, Notifications, Add Member, and Dark Mode */}
               <div className="flex items-center gap-3">
                 {/* Free Trial Indicator */}
                 <div className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
                   Free Trial
                 </div>
                 
                 {/* Notification Button */}
                 <button
                   onClick={() => setShowNotificationModal(true)}
                   className="p-2 rounded-lg transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-300/30 relative"
                   aria-label="Notification settings"
                 >
                   <Bell className="w-5 h-5" />
                   {/* Notification indicator dot */}
                   <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                 </button>
                 
                 {/* Services Button */}
                 <button
                   onClick={() => setShowServicesModal(true)}
                   className="p-2 rounded-lg transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-300/30"
                   aria-label="Active services"
                 >
                   <Activity className="w-5 h-5" />
                 </button>
                 
                 {/* Add Team Member Button */}
                 <button
                   onClick={() => setShowAddMemberModal(true)}
                   className="p-2 rounded-lg transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-300/30"
                   aria-label="Add team member"
                 >
                   <UserPlus className="w-5 h-5" />
                 </button>
                 
                 {/* Dark Mode Toggle */}
                 <button
                   onClick={toggleDarkMode}
                   className="p-2 rounded-lg transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-300/30"
                   aria-label="Toggle dark mode"
                 >
                   {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                 </button>
               </div>
             </div>
           </div>
           
           {/* Page Content */}
           <div className="p-6">
             <Outlet />
           </div>

           {/* Help Button - Bottom Right */}
           <button
             className={`fixed bottom-6 right-6 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2 text-sm font-medium ${
               isDarkMode
                 ? 'bg-blue-600 text-white hover:bg-blue-700'
                 : 'bg-blue-600 text-white hover:bg-blue-700'
             }`}
             onClick={() => window.location.href = '/contact'}
           >
             <HelpCircle className="w-4 h-4" />
             Help
           </button>
         </main>
      </div>
    </div>

    {/* Add Team Member Modal */}
    {showAddMemberModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddMemberModal(false)}>
        <div 
          className={`rounded-2xl p-6 max-w-md w-full mx-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Add Team Member
            </h2>
            <button
              onClick={() => setShowAddMemberModal(false)}
              className={`p-1 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Gmail Address
              </label>
              <input
                type="email"
                placeholder="colleague@gmail.com"
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Role
              </label>
              <select
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option>Member</option>
                <option>Admin</option>
              </select>
            </div>
            
            <button
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              onClick={() => setShowAddMemberModal(false)}
            >
              Send Invitation
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Notification Settings Modal */}
    {showNotificationModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowNotificationModal(false)}>
        <div 
          className="rounded-2xl p-6 max-w-md w-full mx-4 bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Notification Settings
            </h2>
            <button
              onClick={() => setShowNotificationModal(false)}
              className="p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            {/* New Lead Notification */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">New Lead Arrives</div>
                  <div className="text-sm text-gray-500">Get notified when a new lead is captured</div>
                </div>
              </div>
              <button
                onClick={() => toggleNotification('newLead')}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications.newLead ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  notifications.newLead ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Appointment Booked Notification */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Appointment Booked</div>
                  <div className="text-sm text-gray-500">Get notified when an appointment is scheduled</div>
                </div>
              </div>
              <button
                onClick={() => toggleNotification('appointmentBooked')}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications.appointmentBooked ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  notifications.appointmentBooked ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Appointment Cancelled Notification */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <X className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Appointment Cancelled</div>
                  <div className="text-sm text-gray-500">Get notified when an appointment is cancelled</div>
                </div>
              </div>
              <button
                onClick={() => toggleNotification('appointmentCancelled')}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications.appointmentCancelled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  notifications.appointmentCancelled ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Missed Call Notification */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Phone className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Missed Call</div>
                  <div className="text-sm text-gray-500">Get notified when a call is missed</div>
                </div>
              </div>
              <button
                onClick={() => toggleNotification('missedCall')}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications.missedCall ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  notifications.missedCall ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* System Alert Notification */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">System Alerts</div>
                  <div className="text-sm text-gray-500">Get notified about system updates and issues</div>
                </div>
              </div>
              <button
                onClick={() => toggleNotification('systemAlert')}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications.systemAlert ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  notifications.systemAlert ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </ToastProvider>
  );
};

export default DashboardLayout;
