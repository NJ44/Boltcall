import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

interface SettingsLayoutProps {
  children?: React.ReactNode;
}

const categories = [
  {
    id: 'billing',
    label: 'Billing & Usage',
    sidebar: [
      { id: 'plan-billing', label: 'Billing', route: '/dashboard/settings/plan-billing' },
      { id: 'packages', label: 'Packages', route: '/dashboard/settings/packages' },
      { id: 'usage', label: 'Usage', route: '/dashboard/settings/usage' },
    ],
  },
  {
    id: 'account',
    label: 'Account & Settings',
    sidebar: [
      { id: 'general', label: 'General', route: '/dashboard/settings/general' },
      { id: 'members', label: 'Members', route: '/dashboard/settings/members' },
    ],
  },
  {
    id: 'preferences',
    label: 'Preferences',
    sidebar: [
      { id: 'preferences', label: 'Appearance & Region', route: '/dashboard/settings/preferences' },
      { id: 'notifications', label: 'Notifications', route: '/dashboard/settings/notifications' },
    ],
  },
  {
    id: 'integrations',
    label: 'Integrations',
    sidebar: [
      { id: 'services', label: 'Services', route: '/dashboard/settings/services' },
    ],
  },
];

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children }) => {
  const location = useLocation();

  // Determine which category is active based on current route
  const activeCategory = categories.find((cat) =>
    cat.sidebar.some(
      (item) =>
        location.pathname === item.route ||
        location.pathname.startsWith(item.route + '/')
    )
  ) || categories[0];

  return (
    <div className="flex flex-col h-full">
      {/* Top Tabs — category-level navigation */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="px-6">
          <nav className="flex gap-6 -mb-px">
            {categories.map((cat) => {
              const isActive = cat.id === activeCategory.id;
              // Default route is first sidebar item
              const defaultRoute = cat.sidebar[0].route;

              return (
                <Link
                  key={cat.id}
                  to={defaultRoute}
                  className={`relative py-3.5 text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {cat.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Body — sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-56 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
          <nav className="py-4 px-3 space-y-0.5">
            {activeCategory.sidebar.map((item) => {
              const isActive =
                location.pathname === item.route ||
                location.pathname.startsWith(item.route + '/');

              return (
                <Link
                  key={item.id}
                  to={item.route}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-8 max-w-5xl">
            {children || <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
