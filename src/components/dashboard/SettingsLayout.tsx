import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Settings as SettingsIcon,
  Users, 
  CreditCard, 
  Package, 
  BarChart3, 
  Bell,
  Server
} from 'lucide-react';

interface SettingsLayoutProps {
  children?: React.ReactNode;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children }) => {
  const location = useLocation();

  const settingsNavItems = [
    {
      id: 'general',
      label: 'General',
      icon: <SettingsIcon className="w-5 h-5" />,
      route: '/dashboard/settings/general'
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
    },
    {
      id: 'services',
      label: 'Services',
      icon: <Server className="w-5 h-5" />,
      route: '/dashboard/settings/services'
    }
  ];


  return (
    <div className="flex flex-col h-full">
      {/* Top Panel - Settings Navigation */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="p-4">
          {/* Settings Navigation - Horizontal */}
          <nav className="flex gap-1 overflow-x-auto">
            {settingsNavItems.map((item) => {
              const isActive = location.pathname === item.route || 
                              location.pathname.startsWith(item.route + '/');
              
              return (
                <Link
                  key={item.id}
                  to={item.route}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
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

      {/* Bottom Panel - Settings Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
