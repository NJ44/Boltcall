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
  MessageCircle,
  Bot,
  User,
  Moon,
  Sun,
  Plug
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ToastProvider } from '../../contexts/ToastContext';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
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
    }
  }, []);

  // Focus main content area to ensure mouse wheel events work
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.focus();
    }
  }, []);

  const navItemsGroup1 = [
    { to: '/dashboard', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/dashboard/analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
  ];

  const navItemsGroup2 = [
    { to: '/dashboard/agents', label: 'Agents', icon: <Users className="w-5 h-5" /> },
    { to: '/dashboard/knowledge', label: 'Knowledge Base', icon: <Building2 className="w-5 h-5" /> },
    { to: '/dashboard/phone', label: 'Phone Numbers', icon: <MessageSquare className="w-5 h-5" /> },
  ];

  const navItemsGroup3 = [
    { to: '/dashboard/instant-lead-reply', label: 'Instant Lead Reply', icon: <Users className="w-5 h-5" /> },
    { to: '/dashboard/sms', label: 'SMS', icon: <MessageSquare className="w-5 h-5" /> },
    { to: '/dashboard/whatsapp', label: 'WhatsApp (Beta)', icon: <MessageCircle className="w-5 h-5" /> },
    { to: '/dashboard/assistant', label: 'Personal Assistant', icon: <Bot className="w-5 h-5" /> },
  ];

  const navItemsBottom = [
    { to: '/dashboard/integrations', label: 'Integrations', icon: <Plug className="w-5 h-5" /> },
    { to: '/dashboard/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <ToastProvider>
      <div className={`h-screen flex transition-colors duration-300 p-4 gap-4 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="flex flex-1 overflow-hidden gap-4">
         {/* Left Panel - Navigation with Logo at Top */}
         <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 transform transition-all duration-300 ease-in-out flex-shrink-0 rounded-2xl ${
           isDarkMode 
             ? 'bg-gray-900' 
             : 'bg-gray-100'
         } ${sidebarOpen ? 'translate-x-0 m-4' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="flex flex-col h-full p-4">
            {/* Logo at Top - Aligned Left */}
            <div className="mb-4 px-2">
              <Link 
                to="/dashboard" 
                className="flex items-center"
              >
                <img 
                  src="/boltcall_full_logo.png" 
                  alt="Boltcall" 
                  className="h-14 w-auto"
                />
              </Link>
            </div>

            {/* User Profile - Below Logo */}
            <div className="mb-6 px-2">
              <div className="relative" data-user-menu>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center gap-3 rounded-lg p-2 w-full transition-colors ${
        isDarkMode 
                      ? 'hover:bg-gray-800' 
                      : 'hover:bg-gray-200'
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

            {/* Mobile menu button */}
            <button
              onClick={toggleSidebar}
              className={`lg:hidden absolute top-4 right-4 p-2 rounded-md transition-colors ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              aria-label="Toggle navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Navigation */}
            <nav className="flex-1 flex flex-col" aria-label="Main navigation">
              <div className="flex-1">
                {/* Group 1 */}
                <div className="space-y-1 mb-6">
                  {navItemsGroup1.map((item) => {
                    const isActive = location.pathname === item.to;
                    return (
                       <Link
                         key={item.to}
                         to={item.to}
                         onClick={closeSidebar}
                         className={`relative flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-700 group ${
                           isActive
                             ? isDarkMode 
                               ? 'bg-gray-800 text-white' 
                               : 'bg-blue-50 text-blue-700'
                             : isDarkMode 
                               ? 'text-white hover:bg-gray-800' 
                               : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
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
                  })}
                </div>

                {/* Group 2 */}
                <div className="space-y-1 mb-6">
                  {navItemsGroup2.map((item) => {
                    const isActive = location.pathname === item.to;
                    return (
                       <Link
                         key={item.to}
                         to={item.to}
                         onClick={closeSidebar}
                         className={`relative flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-700 group ${
                           isActive
                             ? isDarkMode 
                               ? 'bg-gray-800 text-white' 
                               : 'bg-blue-50 text-blue-700'
                             : isDarkMode 
                               ? 'text-white hover:bg-gray-800' 
                               : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
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
                  })}
                </div>

                {/* Group 3 */}
                <div className="space-y-1 mb-6">
                  {navItemsGroup3.map((item) => {
                    const isActive = location.pathname === item.to;
                    return (
                       <Link
                         key={item.to}
                         to={item.to}
                         onClick={closeSidebar}
                         className={`relative flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-700 group ${
                           isActive
                             ? isDarkMode 
                               ? 'bg-gray-800 text-white' 
                               : 'bg-blue-50 text-blue-700'
                             : isDarkMode 
                               ? 'text-white hover:bg-gray-800' 
                               : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
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
                  })}
                </div>
              </div>

              {/* Bottom Group - Always at bottom */}
              <div className="space-y-1 mt-auto">
                {navItemsBottom.map((item) => {
                  const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
                  return (
            <Link 
                       key={item.to}
                       to={item.to}
                       onClick={closeSidebar}
                       className={`relative flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-700 group ${
                         isActive
                           ? isDarkMode 
                             ? 'bg-gray-800 text-white' 
                             : 'bg-blue-50 text-blue-700'
                           : isDarkMode 
                             ? 'text-white hover:bg-gray-800' 
                             : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
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
           className={`flex-1 overflow-y-auto transition-colors duration-300 rounded-2xl ${
             isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'
           }`}
           style={{
             scrollBehavior: 'auto',
             WebkitOverflowScrolling: 'touch',
             overscrollBehavior: 'contain'
           }}
           tabIndex={0}
         >
           {/* Top Bar - Moved from Navbar */}
           <div className={`sticky top-0 z-10 border-b flex-shrink-0 transition-colors duration-300 ${
             isDarkMode 
               ? 'bg-gray-800/80 backdrop-blur-sm border-gray-700' 
               : 'bg-white/80 backdrop-blur-sm border-gray-200'
           }`}>
             <div className="flex items-center justify-between h-16 px-6">
               {/* Mobile menu button for right panel */}
               <button
                 onClick={toggleSidebar}
                 className={`lg:hidden p-2 rounded-md transition-colors ${
                   isDarkMode 
                     ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                     : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                 }`}
                 aria-label="Toggle navigation menu"
               >
                 <Menu className="w-5 h-5" />
               </button>
          
               {/* Right side - Free Trial and Dark Mode */}
               <div className="flex items-center gap-3 ml-auto">
             {/* Free Trial Indicator */}
             <div className={`px-3 py-1 rounded-full text-sm font-medium ${
               isDarkMode 
                 ? 'bg-orange-900 text-orange-300' 
                 : 'bg-orange-100 text-orange-700'
             }`}>
               Free Trial
             </div>
             
                 {/* Dark Mode Toggle */}
                 <button
                   onClick={toggleDarkMode}
                   className={`p-2 rounded-lg transition-colors ${
                     isDarkMode 
                       ? 'text-yellow-400 hover:text-yellow-300 hover:bg-gray-700' 
                       : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                   }`}
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
         </main>
      </div>
    </div>
    </ToastProvider>
  );
};

export default DashboardLayout; 
