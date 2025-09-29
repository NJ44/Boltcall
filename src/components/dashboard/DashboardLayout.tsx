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
  Bot
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import CharacterSelectionPopup from './CharacterSelectionPopup';
import CharacterDisplay from './CharacterDisplay';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCharacterPopup, setShowCharacterPopup] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const location = useLocation();

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

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/dashboard/analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { to: '/dashboard/agents', label: 'Agents', icon: <Users className="w-5 h-5" /> },
    { to: '/dashboard/business', label: 'Business Details', icon: <Building2 className="w-5 h-5" /> },
    { to: '/dashboard/assistant', label: 'Personal Assistant', icon: <Bot className="w-5 h-5" /> },
    { to: '/dashboard/sms', label: 'SMS', icon: <MessageSquare className="w-5 h-5" /> },
    { to: '/dashboard/whatsapp', label: 'WhatsApp (Beta)', icon: <MessageCircle className="w-5 h-5" /> },
    { to: '/dashboard/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Sticky Top Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Left side - Logo and mobile menu */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
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
          
          {/* Right side - User info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-gray-600" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-medium text-gray-900">Admin</div>
            </div>
            <span className="text-xs rounded-full px-2 py-0.5 bg-emerald-50 text-emerald-700 font-medium">
              Pro
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Navigation (Static) */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex-shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
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
                          ? 'bg-blue-50 text-blue-700'
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
        <main className="flex-1 lg:ml-64 overflow-y-auto">
          <div className="p-2">
            <Outlet />
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
