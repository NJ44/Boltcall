import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  const scrollToSection = (href: string) => {
    const elementId = href.replace('#', '');
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-white/50 backdrop-blur-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -ml-4">
        <div className="flex items-center h-16">
          {/* Logo */}
          <Link to="/">
            <motion.div
              className="flex items-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <img 
                src="/boltcall_full_logo.png" 
                alt="Boltcall" 
                className="h-16 w-auto"
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation - Moved to left */}
          <nav className="hidden md:flex items-center space-x-8 ml-4">
            {navItems.map((item) => (
              <motion.button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="relative text-text-muted hover:text-brand-blue transition-colors duration-200 font-medium py-2"
                whileHover="hover"
                initial="initial"
              >
                {item.label}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-brand-blue"
                  variants={{
                    initial: { width: 0, opacity: 0 },
                    hover: { width: "100%", opacity: 1 }
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </motion.button>
            ))}
          </nav>

          {/* Auth Buttons - pushed to right */}
          <div className="hidden md:flex items-center space-x-4 ml-auto">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-text-muted hover:text-brand-blue transition-colors">
                  Dashboard
                </Link>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-text-muted" />
                  <span className="text-sm text-text-muted">{user?.name}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-text-muted hover:text-brand-blue transition-colors font-medium">
                  Login
                </Link>
                <Button
                  onClick={() => scrollToSection('#contact')}
                  variant="primary"
                  size="md"
                  className="bg-gradient-to-r from-brand-blue to-brand-sky hover:from-brand-blue/90 hover:to-brand-sky/90 shadow-lg hover:shadow-xl transition-all duration-300 font-medium px-6 py-2.5 rounded-xl"
                >
                  Start now
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden py-4 border-t border-border"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <motion.button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="relative text-left text-text-muted hover:text-brand-blue transition-colors duration-200 font-medium py-2"
                  whileHover="hover"
                  initial="initial"
                >
                  {item.label}
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-brand-blue"
                    variants={{
                      initial: { width: 0, opacity: 0 },
                      hover: { width: "100%", opacity: 1 }
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </motion.button>
              ))}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block w-full text-center py-2 px-4 text-brand-blue hover:bg-brand-blue/10 rounded-xl transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="md"
                    className="w-full mt-4"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => scrollToSection('#contact')}
                  variant="primary"
                  size="md"
                  className="w-full mt-4 bg-gradient-to-r from-brand-blue to-brand-sky hover:from-brand-blue/90 hover:to-brand-sky/90 shadow-lg hover:shadow-xl transition-all duration-300 font-medium px-6 py-2.5 rounded-xl"
                >
                  Start now
                </Button>
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
