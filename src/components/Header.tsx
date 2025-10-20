import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '/contact' },
  ];

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      // Handle hash links (scroll to section)
      const elementId = href.replace('#', '');
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Handle page routes - let React Router handle navigation
      window.location.href = href;
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      // When scrolled past the announcement bar (64px), make header stick to top
      setIsSticky(scrollTop >= 64);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed left-0 right-0 z-40 bg-transparent backdrop-blur-md transition-all duration-300 ${
        isSticky ? 'top-0' : 'top-[53px]'
      }`}
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
                className="h-16 w-auto -translate-y-[3.1px]"
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation - Moved to left */}
          <nav className="hidden md:flex items-center space-x-8 ml-4">
            {navItems.map((item) => (
              <motion.button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="relative font-medium py-2 text-text-muted"
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
                <Link to="/dashboard" className="transition-colors text-text-muted hover:text-brand-blue">
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
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="transition-colors font-medium text-text-muted hover:text-brand-blue">
                  Login
                </Link>
                <div style={{ 
                  display: 'inline-block',
                  color: '#475569 !important'
                } as React.CSSProperties}>
                  <style>
                    {`
                      .start-now-button .button2 {
                        color: #475569 !important;
                        box-shadow: none !important;
                      }
                      .start-now-button .button2:hover {
                        color: #475569 !important;
                      }
                      .start-now-button .button2:active {
                        color: #475569 !important;
                      }
                    `}
                  </style>
                  <div className="start-now-button">
                    <Button
                      onClick={() => handleNavClick('/setup')}
                      variant="primary"
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 transition-all duration-75 font-bold px-6 py-2 rounded-2xl border-2 border-blue-500/20 hover:border-blue-400/40"
                    >
                      Start now
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button - Fixed to top right */}
          <button
            className="md:hidden fixed top-4 right-4 z-50 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.div>
          </button>
        </div>

        {/* Mobile Navigation - Full screen overlay */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center justify-center h-full px-8">
              <nav className="flex flex-col space-y-8 text-center">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    onClick={() => handleNavClick(item.href)}
                    className="relative text-2xl font-medium text-text-muted hover:text-brand-blue transition-colors duration-300 py-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.label}
                    <motion.div
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-brand-blue rounded-full"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                  </motion.button>
                ))}
                {/* Auth buttons with smooth animations */}
                <motion.div
                  className="flex flex-col space-y-4 mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  {isAuthenticated ? (
                    <>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          to="/dashboard"
                          className="block w-full text-center py-3 px-6 text-brand-blue hover:bg-brand-blue/10 rounded-xl transition-all duration-300 font-medium text-lg"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={handleLogout}
                          variant="outline"
                          size="md"
                          className="w-full py-3 text-lg font-medium"
                        >
                          Logout
                        </Button>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          to="/login"
                          className="block w-full text-center py-3 px-6 text-text-muted hover:text-brand-blue transition-colors duration-300 font-medium text-lg"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Login
                        </Link>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="start-now-button-mobile">
                          <style>
                            {`
                              .start-now-button-mobile .button2 {
                                color: #6b7280 !important;
                                box-shadow: none !important;
                              }
                              .start-now-button-mobile .button2:hover {
                                color: #6b7280 !important;
                              }
                              .start-now-button-mobile .button2:active {
                                color: #6b7280 !important;
                              }
                            `}
                          </style>
                          <Button
                            onClick={() => {
                              handleNavClick('/setup');
                              setIsMenuOpen(false);
                            }}
                            variant="primary"
                            size="sm"
                            className="w-full py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 transition-all duration-300 font-bold text-base rounded-2xl border-2 border-blue-500/20 hover:border-blue-400/40 transform hover:scale-105"
                          >
                            Start now
                          </Button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
