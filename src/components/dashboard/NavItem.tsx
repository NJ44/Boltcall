import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavItemProps {
  to: string;
  label: string;
  icon?: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, icon }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `nav-underline text-sm font-medium px-3 py-2 rounded-md transition-colors duration-200 ${
          isActive
            ? 'nav-underline--active text-zinc-900 bg-zinc-50'
            : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
        }`
      }
      aria-label={`Navigate to ${label}`}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="w-4 h-4">{icon}</span>}
        <span>{label}</span>
      </div>
    </NavLink>
  );
};

export default NavItem;
