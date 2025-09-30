import React, { useState, useEffect } from 'react';
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
  LogOut,
  User,
  Sun,
  Moon
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CharacterSelectionPopup from './CharacterSelectionPopup';
import CharacterDisplay from './CharacterDisplay';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCharacterPopup, setShowCharacterPopup] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Check if user has selected a character on first visit
  useEffect(() => {
    const hasSelectedCharacter = localStorage.getItem('selectedCharacter');
    if (!hasSelectedCharacter) {
      setShowCharacterPopup(true);
    } else {
      setSelectedCharacter(hasSelectedCharacter);
    }
  }, []);

  const handleCharacterSelect = (character: string) => {
    setSelectedCharacter(character);
    localStorage.setItem('selectedCharacter', character);
    setShowCharacterPopup(false);
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

  const handleSettingsClick = () => {
    setShowSettingsMenu(!showSettingsMenu);
    setShowUserMenu(false);
  };

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showUserMenu && !target.closest('[data-user-menu]')) {
        setShowUserMenu(false);
      }
      if (showSettingsMenu && !target.closest('[data-settings-menu]')) {
        setShowSettingsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu, showSettingsMenu]);

  // Load dark mode preference on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      setIsDarkMode(true);
    }
  }, []);

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/dashboard/analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { to: '/dashboard/agents', label: 'Instant Lead Reply', icon: <Users className="w-5 h-5" /> },
    { to: '/dashboard/business', label: 'Business Details', icon: <Building2 className="w-5 h-5" /> },
    { to: '/dashboard/assistant', label: 'Personal Assistant', icon: <Bot className="w-5 h-5" /> },
    { to: '/dashboard/sms', label: 'SMS', icon: <MessageSquare className="w-5 h-5" /> },
    { to: '/dashboard/whatsapp', label: 'WhatsApp (Beta)', icon: <MessageCircle className="w-5 h-5" /> },
  ];

  return (
    <div className={`h-screen flex flex-col transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Sticky Top Navbar */}
      <header className={`sticky top-0 z-50 border-b shadow-lg flex-shrink-0 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700 shadow-gray-900/50' 
          : 'bg-white border-gray-200 shadow-gray-200/50'
      }`}>
        <div className="flex items-center justify-between h-16 px-6">
          {/* Left side - Logo and mobile menu */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={toggleSidebar}
              className={`lg:hidden p-2 rounded-md transition-colors ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              aria-label="Toggle navigation menu"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            {/* Logo */}
            <Link 
              to="/dashboard" 
              className="flex items-center"
            >
              <img 
                src="/boltcall_full_logo.png" 
                alt="Boltcall" 
                className="h-12 w-auto"
              />
            </Link>
          </div>
          
           {/* Right side - Settings, Dark mode, and User info */}
           <div className="flex items-center gap-3">
             {/* Settings Icon */}
             <div className="relative" data-settings-menu>
               <button
                 onClick={handleSettingsClick}
                 className={`p-2 rounded-lg transition-colors ${
                   isDarkMode 
                     ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                     : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                 }`}
                 aria-label="Settings"
               >
                 <Settings className="w-5 h-5" />
               </button>
               
               {/* Settings dropdown menu */}
               {showSettingsMenu && (
                 <div className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg border py-2 z-50 ${
                   isDarkMode 
                     ? 'bg-gray-800 border-gray-700' 
                     : 'bg-white border-gray-200'
                 }`}>
                   <Link
                     to="/dashboard/settings"
                     onClick={() => setShowSettingsMenu(false)}
                     className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                       isDarkMode 
                         ? 'text-gray-300 hover:bg-gray-700' 
                         : 'text-gray-700 hover:bg-gray-50'
                     }`}
                   >
                     <Settings className="w-4 h-4" />
                     Settings
                   </Link>
                 </div>
               )}
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
             <div className="relative" data-user-menu>
               <button
                 onClick={() => setShowUserMenu(!showUserMenu)}
                 className={`flex items-center gap-3 rounded-lg p-2 transition-colors ${
                   isDarkMode 
                     ? 'hover:bg-gray-700' 
                     : 'hover:bg-gray-50'
                 }`}
               >
                 <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                   <User className="w-4 h-4 text-blue-600" />
                 </div>
                 <div className="hidden sm:block text-left">
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
                 <span className="text-xs rounded-full px-2 py-0.5 bg-emerald-50 text-emerald-700 font-medium">
                   {user?.role === 'admin' ? 'Admin' : 'Pro'}
                 </span>
               </button>
               
               {/* User dropdown menu */}
               {showUserMenu && (
                 <div className={`absolute right-0 top-full mt-2 w-64 rounded-lg shadow-lg border py-2 z-50 ${
                   isDarkMode 
                     ? 'bg-gray-800 border-gray-700' 
                     : 'bg-white border-gray-200'
                 }`}>
                   <div className={`px-4 py-3 border-b ${
                     isDarkMode ? 'border-gray-700' : 'border-gray-100'
                   }`}>
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
                   <div className="px-4 py-2">
                     <div className={`text-xs mb-1 ${
                       isDarkMode ? 'text-gray-400' : 'text-gray-500'
                     }`}>Current Plan</div>
                     <div className={`text-sm font-medium ${
                       isDarkMode ? 'text-white' : 'text-gray-900'
                     }`}>
                       {user?.role === 'admin' ? 'Admin Plan' : 'Pro Plan'}
                     </div>
                   </div>
                   <div className={`border-t ${
                     isDarkMode ? 'border-gray-700' : 'border-gray-100'
                   }`}>
                     <button
                       onClick={handleLogout}
                       className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                         isDarkMode 
                           ? 'text-gray-300 hover:bg-gray-700' 
                           : 'text-gray-700 hover:bg-gray-50'
                       }`}
                     >
                       <LogOut className="w-4 h-4" />
                       Sign out
                     </button>
                   </div>
                 </div>
               )}
             </div>
           </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
         {/* Left Panel - Navigation (Static) */}
         <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 border-r transform transition-all duration-300 ease-in-out flex-shrink-0 ${
           isDarkMode 
             ? 'bg-gray-800 border-gray-700' 
             : 'bg-white border-gray-200'
         } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="flex flex-col h-full">
            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2" aria-label="Main navigation">
              <div className="space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.to;
                  return (
                     <Link
                       key={item.to}
                       to={item.to}
                       onClick={closeSidebar}
                       className={`relative flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-700 group ${
                         isActive
                           ? isDarkMode 
                             ? 'bg-blue-900 text-blue-300' 
                             : 'bg-blue-50 text-blue-700'
                           : isDarkMode 
                             ? 'text-gray-300 hover:text-white' 
                             : 'text-gray-700 hover:text-gray-900'
                       }`}
                     >
                      {item.icon}
                      <span className="relative pb-1">
                        {item.label}
                        {/* Hover effect line - positioned relative to text with more space */}
                        <div className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 ${
                          isActive 
                            ? 'w-full' 
                            : 'w-0 group-hover:w-full'
                        }`} 
                        style={{
                          transition: isActive 
                            ? 'width 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'  // Slower shrinking that starts slow and gains speed
                            : 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'  // Slower expanding with smooth cubic-bezier
                        }} />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </nav>
            
            {/* Character Display at bottom */}
            <div className="p-6 flex justify-center">
              <CharacterDisplay selectedCharacter={selectedCharacter} />
            </div>
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

         {/* Right Panel - Main Content (Scrollable) */}
         <main className={`flex-1 lg:ml-64 overflow-y-auto transition-colors duration-300 ${
           isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
         }`}>
           <div className="min-h-full p-6">
             <div className={`rounded-lg transition-colors duration-300 ${
               isDarkMode ? 'bg-gray-800/50' : 'bg-white'
             } shadow-sm p-6`}>
               <Outlet />
             </div>
           </div>
         </main>
      </div>

      {/* Character Selection Popup */}
      <CharacterSelectionPopup
        isOpen={showCharacterPopup}
        onClose={() => setShowCharacterPopup(false)}
        onSelectCharacter={handleCharacterSelect}
      />
    </div>
  );
};

export default DashboardLayout;
