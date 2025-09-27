import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, User } from 'lucide-react';

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-zinc-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left side - Logo and mobile menu */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl font-bold text-zinc-900 hover:text-zinc-700 transition-colors"
            aria-label="Boltcall - Go to dashboard"
          >
            Boltcall
          </Link>
        </div>
        
        {/* Right side - User info */}
        <div className="flex items-center gap-3">
          {/* User avatar and info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-zinc-600" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-medium text-zinc-900">noam</div>
            </div>
          </div>
          
          {/* Plan badge */}
          <span className="text-xs rounded-full px-2 py-0.5 bg-emerald-50 text-emerald-700 font-medium">
            Pro
          </span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
