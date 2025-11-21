import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isOverBlueBackground, setIsOverBlueBackground] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '/contact' },
  ];

  const featuresItems = [
    { label: 'AI Receptionist', href: '/features/ai-receptionist' },
    { label: 'Instant Form Reply', href: '/features/instant-form-reply' },
    { label: 'SMS Booking Assistant', href: '/features/sms-booking-assistant' },
    { label: 'Automated Reminders', href: '/features/automated-reminders' },
    { label: 'AI Follow-Up System', href: '/features/ai-follow-up-system' },
    { label: 'Website Chat/Voice Widget', href: '/features/website-chat-voice-widget' },
    { label: 'Lead Reactivation', href: '/features/lead-reactivation' },
  ];

  const resourcesItems = [
    { label: 'AI Agent Comparison', href: '/ai-agent-comparison' },
    { label: 'Blog', href: '/blog' },
  ];

  const freeToolsItems = [
    { label: 'SEO Audit', href: '/seo-analyzer' },
    { label: 'Speed Test', href: '/speed-test' },
    { label: 'AI Revenue Audit', href: '/how-much-you-can-earn-with-ai' },
  ];

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      // Handle hash links (scroll to section)
      const elementId = href.replace('#', '');
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Handle page routes - use React Router navigation
      navigate(href);
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      // When scrolled past the announcement bar (64px), make header stick to top
      setIsSticky(scrollTop >= 64);

      // Don't check for blue backgrounds until we've scrolled past the hero section
      // This prevents the navbar from turning white immediately on page load
      if (scrollTop < 300) {
        setIsOverBlueBackground(false);
        return;
      }

      // Check if navbar is over a blue background section
      const header = document.querySelector('header');
      if (!header) return;

      const headerRect = header.getBoundingClientRect();

      // First, check if we're over the pricing section by checking scroll position and section position
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        const pricingRect = pricingSection.getBoundingClientRect();
        // Check if header is over or near the pricing section
        if (headerRect.bottom >= pricingRect.top && headerRect.top <= pricingRect.bottom) {
          setIsOverBlueBackground(false);
          return;
        }
      }
      const headerCenterY = headerRect.top + headerRect.height / 2;
      const headerCenterX = window.innerWidth / 2;

      // Get element at the center of the header
      const elementBelow = document.elementFromPoint(headerCenterX, headerCenterY);

      if (elementBelow) {
        // Traverse up the DOM tree to find a section or container with blue/dark background
        let currentElement: HTMLElement | null = elementBelow as HTMLElement;
        let foundBlueBackground = false;
        let foundLightBackground = false;

        while (currentElement && currentElement !== document.documentElement) {
          const computedStyle = window.getComputedStyle(currentElement);
          const bgColor = computedStyle.backgroundColor;
          const className = currentElement.className || '';
          const tagName = currentElement.tagName.toLowerCase();
          const id = currentElement.id || '';

          // Skip hero section - it has light background (gray gradient)
          if (id === 'hero' || className.includes('hero') || className.includes('Hero')) {
            foundLightBackground = true;
            break;
          }

          // Skip pricing section - it has white background, navbar should be black
          if (id === 'pricing' || className.includes('pricing') || className.includes('Pricing')) {
            foundLightBackground = true;
            break;
          }

          // Check for light background classes that should prevent white text
          const hasLightClass = 
            className.includes('bg-white') ||
            className.includes('bg-gray-50') ||
            className.includes('bg-gray-100') ||
            className.includes('bg-light-blue') ||
            (className.includes('bg-gradient') && (className.includes('white') || className.includes('light-blue')));

          if (hasLightClass) {
            foundLightBackground = true;
            break;
          }

          // Check for blue background classes - be more specific, exclude gradients with white
          const hasBlueClass = 
            className.includes('bg-blue-600') || 
            className.includes('bg-blue-700') ||
            className.includes('bg-blue-800') ||
            (className.includes('bg-gradient') && className.includes('blue') && !className.includes('white') && !className.includes('light-blue')) ||
            className.includes('bg-brand-blue') ||
            className.includes('bg-muted') ||
            className.includes('bg-black') ||
            className.includes('bg-gray-900') ||
            className.includes('bg-gray-800');

          // Check if background color is blue-ish or dark (RGB values)
          // Only check if it's not transparent and not white/light
          if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
            const rgbMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (rgbMatch) {
              const r = parseInt(rgbMatch[1]);
              const g = parseInt(rgbMatch[2]);
              const b = parseInt(rgbMatch[3]);
              
              // Check if it's a light background (high RGB values) - if so, don't turn white
              if (r > 200 && g > 200 && b > 200) {
                foundLightBackground = true;
                break;
              }
              
              // Check if it's a dark color (low RGB values) or blue-ish (high blue, low red/green)
              // Be more strict - only dark backgrounds or clearly blue backgrounds
              const isDarkBackground = r < 100 && g < 100 && b < 100;
              const isBlueBackground = b > r + 50 && b > g + 50 && b > 150;
              
              if (isDarkBackground || isBlueBackground) {
                foundBlueBackground = true;
                break;
              }
            }
          }

          if (hasBlueClass) {
            foundBlueBackground = true;
            break;
          }

          // Check if we've reached a section or main container
          if (tagName === 'section' || tagName === 'main') {
            // If this section has white text, it likely has a dark background
            // But also check if background is light - if so, don't turn white
            const textColor = computedStyle.color;
            if (textColor && textColor.includes('255') && textColor.includes('255, 255, 255')) {
              // Double check the background isn't light
              if (bgColor) {
                const rgbMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                if (rgbMatch) {
                  const r = parseInt(rgbMatch[1]);
                  const g = parseInt(rgbMatch[2]);
                  const b = parseInt(rgbMatch[3]);
                  if (!(r > 200 && g > 200 && b > 200)) {
                    foundBlueBackground = true;
                    break;
                  }
                }
              }
            }
          }

          currentElement = currentElement.parentElement;
        }

        // Only set to white if we found blue background AND didn't find light background
        setIsOverBlueBackground(foundBlueBackground && !foundLightBackground);
      } else {
        setIsOverBlueBackground(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Don't check on initial load - start with black links
    // handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close Resources dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resourcesRef.current && !resourcesRef.current.contains(event.target as Node)) {
        setIsResourcesOpen(false);
      }
      if (featuresRef.current && !featuresRef.current.contains(event.target as Node)) {
        setIsFeaturesOpen(false);
      }
    };

    if (isResourcesOpen || isFeaturesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isResourcesOpen, isFeaturesOpen]);

  return (
    <motion.header
      className={`fixed left-0 right-0 z-[110] bg-transparent backdrop-blur-md transition-all duration-300 ${
        isSticky ? 'top-0' : 'top-[43px]'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 -ml-4">
        <div className="flex items-center h-16">
          {/* Logo */}
          <Link to="/">
            <motion.div
              className="flex items-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <img 
                src="/boltcall_full_logo.png" 
                alt="Boltcall - AI Receptionist, Follow Ups, Reminders" 
                className="h-16 w-auto -translate-y-[3.1px]"
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation - Moved to left */}
          <nav className="hidden md:flex items-center space-x-8 ml-4">
            {/* Features Dropdown */}
            <div ref={featuresRef} className="relative">
              <motion.button
                onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
                className={`relative font-medium py-2 transition-colors duration-300 flex items-center gap-1 ${
                  isOverBlueBackground ? 'text-white' : 'text-text-muted'
                }`}
                whileHover="hover"
                initial="initial"
              >
                Features
                <ChevronDown className={`w-4 h-4 transition-transform ${isFeaturesOpen ? 'rotate-180' : ''}`} />
                <motion.div
                  className={`absolute bottom-0 left-0 h-0.5 ${
                    isOverBlueBackground ? 'bg-white' : 'bg-brand-blue'
                  }`}
                  variants={{
                    initial: { width: 0, opacity: 0 },
                    hover: { width: "100%", opacity: 1 }
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </motion.button>
              
              {isFeaturesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`absolute top-full left-0 mt-2 w-64 rounded-lg shadow-xl border ${
                    isOverBlueBackground 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-white border-gray-200'
                  } py-2 z-50`}
                >
                  {featuresItems.map((item) => (
                    <motion.div
                      key={item.href}
                      className="relative group"
                      whileHover="hover"
                      initial="initial"
                    >
                      <Link
                        to={item.href}
                        onClick={() => {
                          setIsFeaturesOpen(false);
                          setIsMenuOpen(false);
                        }}
                        className={`block px-4 py-2 text-sm transition-colors relative ${
                          isOverBlueBackground
                            ? 'text-gray-300 hover:text-white'
                            : 'text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        <span className="relative inline-block pb-1">
                          {item.label}
                          <motion.div
                            className={`absolute -bottom-1 left-0 h-0.5 ${
                              isOverBlueBackground ? 'bg-white' : 'bg-blue-600'
                            }`}
                            variants={{
                              initial: { width: 0, opacity: 0 },
                              hover: { width: "100%", opacity: 1 }
                            }}
                            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                          />
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {navItems.map((item) => (
              <motion.button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className={`relative font-medium py-2 transition-colors duration-300 ${
                  isOverBlueBackground ? 'text-white' : 'text-text-muted'
                }`}
                whileHover="hover"
                initial="initial"
              >
                {item.label}
                <motion.div
                  className={`absolute bottom-0 left-0 h-0.5 ${
                    isOverBlueBackground ? 'bg-white' : 'bg-brand-blue'
                  }`}
                  variants={{
                    initial: { width: 0, opacity: 0 },
                    hover: { width: "100%", opacity: 1 }
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </motion.button>
            ))}
            
            {/* Resources Dropdown */}
            <div ref={resourcesRef} className="relative">
              <motion.button
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                className={`relative font-medium py-2 transition-colors duration-300 flex items-center gap-1 ${
                  isOverBlueBackground ? 'text-white' : 'text-text-muted'
                }`}
                whileHover="hover"
                initial="initial"
              >
                Resources
                <ChevronDown className={`w-4 h-4 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} />
                <motion.div
                  className={`absolute bottom-0 left-0 h-0.5 ${
                    isOverBlueBackground ? 'bg-white' : 'bg-brand-blue'
                  }`}
                  variants={{
                    initial: { width: 0, opacity: 0 },
                    hover: { width: "100%", opacity: 1 }
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </motion.button>
              
              {isResourcesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`absolute top-full left-0 mt-2 w-56 rounded-lg shadow-xl border ${
                    isOverBlueBackground 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-white border-gray-200'
                  } py-2 z-50`}
                >
                  {resourcesItems.map((item) => (
                    <motion.div
                      key={item.href}
                      className="relative group"
                      whileHover="hover"
                      initial="initial"
                    >
                      <Link
                        to={item.href}
                        onClick={() => {
                          setIsResourcesOpen(false);
                          setIsMenuOpen(false);
                        }}
                        className={`block px-4 py-2 text-sm transition-colors relative ${
                          isOverBlueBackground
                            ? 'text-gray-300 hover:text-white'
                            : 'text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        <span className="relative inline-block pb-1">
                          {item.label}
                          <motion.div
                            className={`absolute -bottom-1 left-0 h-0.5 ${
                              isOverBlueBackground ? 'bg-white' : 'bg-blue-600'
                            }`}
                            variants={{
                              initial: { width: 0, opacity: 0 },
                              hover: { width: "100%", opacity: 1 }
                            }}
                            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                          />
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                  
                  {/* Separator */}
                  <div className={`border-t my-2 ${
                    isOverBlueBackground ? 'border-gray-700' : 'border-gray-200'
                  }`} />
                  
                  {/* Free Tools Section */}
                  <div className="px-4 py-1">
                    <h3 className={`text-xs font-semibold uppercase tracking-wider ${
                      isOverBlueBackground ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Free Tools
                    </h3>
                  </div>
                  
                  {freeToolsItems.map((item) => (
                    <motion.div
                      key={item.href}
                      className="relative group"
                      whileHover="hover"
                      initial="initial"
                    >
                      <Link
                        to={item.href}
                        onClick={() => {
                          setIsResourcesOpen(false);
                          setIsMenuOpen(false);
                        }}
                        className={`block px-4 py-2 text-sm transition-colors relative ${
                          isOverBlueBackground
                            ? 'text-gray-300 hover:text-white'
                            : 'text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        <span className="relative inline-block pb-1">
                          {item.label}
                          <motion.div
                            className={`absolute -bottom-1 left-0 h-0.5 ${
                              isOverBlueBackground ? 'bg-white' : 'bg-blue-600'
                            }`}
                            variants={{
                              initial: { width: 0, opacity: 0 },
                              hover: { width: "100%", opacity: 1 }
                            }}
                            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                          />
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </nav>

          {/* Auth Buttons - pushed to right */}
          <div className="hidden md:flex items-center space-x-4 ml-auto">
            {isAuthenticated ? (
              <>
                <Button
                  onClick={() => handleNavClick('/dashboard')}
                  variant="primary"
                  size="sm"
                >
                  Go To Dashboard
                </Button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`transition-colors font-medium hover:text-brand-blue ${
                    isOverBlueBackground ? 'text-white' : 'text-text-muted'
                  }`}
                >
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
            className="md:hidden fixed top-4 right-4 z-[120] p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200"
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
                {/* Features in Mobile Menu */}
                <motion.div
                  className="flex flex-col space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0 }}
                >
                  <div className="text-2xl font-medium text-text-muted mb-2">Features</div>
                  {featuresItems.map((item, index) => (
                    <motion.button
                      key={item.href}
                      onClick={() => {
                        handleNavClick(item.href);
                        setIsMenuOpen(false);
                      }}
                      className="text-lg text-gray-600 hover:text-brand-blue transition-colors duration-300 py-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </motion.div>

                {navItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    onClick={() => handleNavClick(item.href)}
                    className="relative text-2xl font-medium text-text-muted hover:text-brand-blue transition-colors duration-300 py-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: (featuresItems.length + index) * 0.1 }}
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
                
                {/* Resources in Mobile Menu */}
                <motion.div
                  className="flex flex-col space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: navItems.length * 0.1 }}
                >
                  <div className="text-2xl font-medium text-text-muted mb-2">Resources</div>
                  {resourcesItems.map((item, index) => (
                    <motion.button
                      key={item.href}
                      onClick={() => {
                        handleNavClick(item.href);
                        setIsMenuOpen(false);
                      }}
                      className="text-lg text-gray-600 hover:text-brand-blue transition-colors duration-300 py-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: (navItems.length + index) * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </motion.div>
                
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
                        <Button
                          onClick={() => {
                            handleNavClick('/dashboard');
                            setIsMenuOpen(false);
                          }}
                          variant="primary"
                          size="md"
                          className="w-full py-3 text-lg font-medium"
                        >
                          Go To Dashboard
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
