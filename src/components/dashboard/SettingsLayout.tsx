import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Settings as SettingsIcon,
  Palette, 
  Users, 
  CreditCard, 
  Package, 
  BarChart3, 
  Bell 
} from 'lucide-react';

interface SettingsLayoutProps {
  children?: React.ReactNode;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const settingsNavItems = [
    {
      id: 'general',
      label: 'General',
      icon: <SettingsIcon className="w-5 h-5" />,
      route: '/dashboard/settings/general'
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: <Palette className="w-5 h-5" />,
      route: '/dashboard/settings/preferences'
    },
    {
      id: 'members',
      label: 'Members',
      icon: <Users className="w-5 h-5" />,
      route: '/dashboard/settings/members'
    },
    {
      id: 'plan-billing',
      label: 'Plan & Billing',
      icon: <CreditCard className="w-5 h-5" />,
      route: '/dashboard/settings/plan-billing'
    },
    {
      id: 'packages',
      label: 'Packages',
      icon: <Package className="w-5 h-5" />,
      route: '/dashboard/settings/packages'
    },
    {
      id: 'usage',
      label: 'Usage',
      icon: <BarChart3 className="w-5 h-5" />,
      route: '/dashboard/settings/usage'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      route: '/dashboard/settings/notifications'
    }
  ];

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex h-full">
      {/* Left Panel - Settings Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-6">
          {/* Go Back Link */}
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Go Back</span>
          </button>

          {/* Settings Navigation */}
          <nav className="space-y-1">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Settings
            </h3>
            {settingsNavItems.map((item) => {
              const isActive = location.pathname === item.route || 
                              location.pathname.startsWith(item.route + '/');
              
              return (
                <Link
                  key={item.id}
                  to={item.route}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Right Panel - Settings Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
