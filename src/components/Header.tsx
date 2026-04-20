import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, ChevronDown, Phone, Zap, MessageSquare, Bell, Target, Globe, RotateCw, Search, Gauge, Calculator, Sparkles, Scale, BookOpen, Book, Mail, ArrowRight, Briefcase, FileText } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GiveawayBar from './GiveawayBar';

const Header: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(location.pathname === '/strike-ai');
  const [isOverBlueBackground, setIsOverBlueBackground] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [mobileFeatures, setMobileFeatures] = useState(false);
  const [mobileResources, setMobileResources] = useState(false);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const tickingRef = useRef(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Pricing', href: '/pricing' },
    { label: 'Contact', href: '/contact' },
  ];

  const featuresItems = [
    { label: 'AI Receptionist', href: '/features/ai-receptionist', icon: Phone },
    { label: 'Instant Form Reply', href: '/features/instant-form-reply', icon: Zap },
    { label: 'SMS Booking Assistant', href: '/features/sms-booking-assistant', icon: MessageSquare },
    { label: 'Automated Reminders', href: '/features/automated-reminders', icon: Bell },
    { label: 'AI Follow-Up System', href: '/features/ai-follow-up-system', icon: Target },
    { label: 'Website Widget', href: '/features/website-widget', icon: Globe },
    { label: 'Lead Reactivation', href: '/features/lead-reactivation', icon: RotateCw },
    { label: 'Smart Website', href: '/features/smart-website', icon: Sparkles },
  ];

  const resourcesItems = [
    { label: 'Comparisons', href: '/comparisons', icon: Scale },
    { label: 'Blog', href: '/blog', icon: BookOpen },
    { label: 'AI Guide', href: '/ai-guide-for-businesses', icon: Book },
    { label: 'Newsletter', href: '/newsletter', icon: Mail },
  ];

  const freeToolsItems = [
    { label: 'SEO Audit', href: '/seo-audit', icon: Search },
    { label: 'Website Health Check', href: '/speed-test', icon: Gauge },
    { label: 'AI Revenue Audit', href: '/ai-revenue-calculator', icon: Calculator },
    { label: 'Business Audit', href: '/business-audit', icon: Briefcase },
    { label: 'SEO & AEO Report', href: '/seo-aeo-audit', icon: FileText },
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
    // Force white text on AI guide page and Strike page
    if (location.pathname === '/ai-guide-for-businesses' || location.pathname.startsWith('/ai-guide-for-businesses') || location.pathname === '/strike-ai' || location.pathname === '/free-website-package') {
      setIsOverBlueBackground(true);
    }

    // Cache header element outside scroll handler
    let cachedHeader: Element | null = null;

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        scrollLogic();
        tickingRef.current = false;
      });
    };

    const scrollLogic = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      // When scrolled past the announcement bar (64px), make header stick to top
      // On Strike page, always sticky since there's no announcement bar
      // On mobile, always keep sticky to prevent movement when scrolling down
      const isMobile = window.innerWidth < 768;
      setIsSticky(location.pathname === '/strike-ai' ? true : (isMobile ? true : scrollTop >= 64));

      // Don't check for blue backgrounds until we've scrolled past the hero section
      // This prevents the navbar from turning white immediately on page load
      // But keep white text on Strike page
      if (scrollTop < 300 && location.pathname !== '/strike-ai') {
        setIsOverBlueBackground(false);
        return;
      }

      // Keep white text on Strike page
      if (location.pathname === '/strike-ai' || location.pathname === '/free-website-package') {
        setIsOverBlueBackground(true);
        return;
      }

      // Check if navbar is over a blue background section (cached lookup)
      if (!cachedHeader) cachedHeader = document.querySelector('header');
      const header = cachedHeader;
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

      // Check if we're over the FAQ section - it has white background, navbar should be black
      const faqSection = document.getElementById('faq');
      if (faqSection) {
        const faqRect = faqSection.getBoundingClientRect();
        // Check if header is over or near the FAQ section (with some padding)
        if (headerRect.bottom >= faqRect.top - 50 && headerRect.top <= faqRect.bottom + 50) {
          setIsOverBlueBackground(false);
          return;
        }
      }

      // Check if we're over the contact/FinalCTA section - it has white background, navbar should be black
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        const contactRect = contactSection.getBoundingClientRect();
        // Check if header is over or near the contact section (with some padding)
        if (headerRect.bottom >= contactRect.top - 50 && headerRect.top <= contactRect.bottom + 50) {
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

          // Skip FAQ section - it has white background, navbar should be black
          // Check for FAQ section more aggressively - look for parent sections too
          if (id === 'faq' || className.includes('faq') || className.includes('FAQ')) {
            foundLightBackground = true;
            break;
          }

          // Skip contact/FinalCTA section - it has white background, navbar should be black
          if (id === 'contact' || className.includes('contact') || className.includes('Contact') || className.includes('FinalCTA') || className.includes('final-cta')) {
            foundLightBackground = true;
            break;
          }

          // Also check if we're inside a section that contains FAQ
          // Look for the Section component with id="faq" in the parent tree
          let parentCheck: HTMLElement | null = currentElement;
          while (parentCheck && parentCheck !== document.documentElement) {
            if (parentCheck.id === 'faq') {
              foundLightBackground = true;
              break;
            }
            parentCheck = parentCheck.parentElement;
          }
          if (foundLightBackground) break;

          // If we find a section with id="faq", check its actual background
          // The FAQ section uses Section component with background="white"
          if (tagName === 'section' && id === 'faq') {
            // Check the actual computed background of the section
            const sectionBg = computedStyle.backgroundColor;
            if (sectionBg) {
              const rgbMatch = sectionBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
              if (rgbMatch) {
                const r = parseInt(rgbMatch[1]);
                const g = parseInt(rgbMatch[2]);
                const b = parseInt(rgbMatch[3]);
                // If it's a light background (white or light gray), don't turn navbar white
                if (r > 240 && g > 240 && b > 240) {
                  foundLightBackground = true;
                  break;
                }
              }
            }
            // Also check for white background class
            if (className.includes('bg-white')) {
              foundLightBackground = true;
              break;
            }
          }

          // Check for dark background classes that should show white text (check this first)
          const hasDarkClass =
            className.includes('bg-gray-900') ||
            className.includes('bg-gray-800') ||
            (className.includes('bg-gradient') && (className.includes('gray-900') || className.includes('gray-800')));

          if (hasDarkClass) {
            foundBlueBackground = true;
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
          // But ignore small elements (like buttons) that are inside white sections
          const isSmallElement = tagName === 'button' || tagName === 'div' && (currentElement.offsetWidth < 100 || currentElement.offsetHeight < 100);
          const hasBlueClass =
            (!isSmallElement && className.includes('bg-blue-600')) ||
            (!isSmallElement && className.includes('bg-blue-700')) ||
            (!isSmallElement && className.includes('bg-blue-800')) ||
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
            // Skip FAQ section entirely - it has white background
            if (id === 'faq') {
              foundLightBackground = true;
              break;
            }

            // Skip contact/FinalCTA section entirely - it has white background
            if (id === 'contact') {
              foundLightBackground = true;
              break;
            }

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

    // Force white text on AI guide page
    if (location.pathname === '/ai-guide-for-businesses' || location.pathname.startsWith('/ai-guide-for-businesses') || location.pathname === '/free-website-package') {
      setIsOverBlueBackground(true);
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
    return () => {};
  }, [location.pathname]);

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

  // Underline component for nav links (CSS-only hover effect)
  const NavUnderline = ({ isBlue }: { isBlue: boolean }) => (
    <span
      className={`absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-[576ms] ease-in-out ${isBlue ? 'bg-white' : 'bg-brand-blue'}`}
    />
  );

  // Underline for dropdown items (named group avoids conflicts with nav-level group)
  const DropdownUnderline = ({ isBlue }: { isBlue: boolean }) => (
    <span
      className={`absolute -bottom-1 left-0 h-0.5 w-0 group-hover/item:w-full transition-all duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${isBlue ? 'bg-white' : 'bg-blue-600'}`}
    />
  );

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[110] bg-transparent backdrop-blur-md transition-all duration-300 overflow-visible shadow-none border-none ring-0"
      style={{ contain: 'layout style' }}
    >
      {!isSticky && (
        <GiveawayBar />
      )}
      <div className="w-full px-2 sm:px-4 lg:px-6 overflow-visible">
        <div className="flex items-center justify-between h-14 max-w-7xl mx-auto overflow-visible">
          {/* Left Side - Logo and Navigation */}
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/">
              <div
                className="flex items-center cursor-pointer transition-transform duration-200 hover:scale-105"
              >
                <picture>
                  <source srcSet="/boltcall_full_logo.webp" type="image/webp" />
                  <img
                    src="/boltcall_full_logo.png"
                    alt="Boltcall - AI Receptionist, Follow Ups, Reminders"
                    className="h-14 w-auto -translate-y-[2.8px]"
                    width="113"
                    height="56"
                    loading="eager"
                    fetchPriority="high"
                  />
                </picture>
              </div>
            </Link>

            {/* Desktop Navigation - Moved to left */}
            <nav className="hidden md:flex items-center space-x-8 ml-4">
              {/* Features Dropdown */}
              <div
                ref={featuresRef}
                className="relative overflow-visible"
                onMouseEnter={() => setIsFeaturesOpen(true)}
                onMouseLeave={() => setIsFeaturesOpen(false)}
              >
                <button
                  className={`group relative font-medium py-2 transition-colors duration-300 flex items-center gap-1 ${isOverBlueBackground ? 'text-white' : 'text-text-muted'
                    }`}
                >
                  Features
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isFeaturesOpen ? 'rotate-180' : ''}`} strokeWidth={2.5} />
                  <NavUnderline isBlue={isOverBlueBackground} />
                </button>

                <div
                  className={`absolute top-full left-0 pt-2 z-[120] transition-all duration-200 ease-in-out ${isFeaturesOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2.5 pointer-events-none'}`}
                >
                <div
                  className={`w-64 rounded-lg shadow-xl border ${isOverBlueBackground
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                    } py-3 px-2`}
                >
                  {featuresItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.href}
                        className="relative"
                      >
                        <Link
                          to={item.href}
                          onClick={() => {
                            setIsFeaturesOpen(false);
                            setIsMenuOpen(false);
                          }}
                          className={`group/item flex items-center gap-3 px-4 py-2 text-sm transition-colors relative ${isOverBlueBackground
                            ? 'text-gray-300 hover:text-white'
                            : 'text-gray-700 hover:text-gray-900'
                            }`}
                        >
                          <Icon className="w-3 h-3 flex-shrink-0 -mt-[4px]" />
                          <span className="relative inline-block pb-1">
                            {item.label}
                            <DropdownUnderline isBlue={isOverBlueBackground} />
                          </span>
                        </Link>
                      </div>
                    );
                  })}
                </div>
                </div>
              </div>

              {/* About Link */}
              <Link
                to="/about"
                className={`group relative font-medium py-2 transition-colors duration-300 ${isOverBlueBackground ? 'text-white' : 'text-text-muted'
                  }`}
              >
                About
                <NavUnderline isBlue={isOverBlueBackground} />
              </Link>

              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`group relative font-medium py-2 transition-colors duration-300 ${isOverBlueBackground ? 'text-white' : 'text-text-muted'
                    }`}
                >
                  {item.label}
                  <NavUnderline isBlue={isOverBlueBackground} />
                </Link>
              ))}

              {/* Resources Dropdown */}
              <div
                ref={resourcesRef}
                className="relative overflow-visible"
                onMouseEnter={() => setIsResourcesOpen(true)}
                onMouseLeave={() => setIsResourcesOpen(false)}
              >
                <button
                  className={`group relative font-medium py-2 transition-colors duration-300 flex items-center gap-1 ${isOverBlueBackground ? 'text-white' : 'text-text-muted'
                    }`}
                >
                  Resources
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} strokeWidth={2.5} />
                  <NavUnderline isBlue={isOverBlueBackground} />
                </button>

                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 z-[120] transition-all duration-200 ease-in-out ${isResourcesOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2.5 pointer-events-none'}`}
                >
                <div
                  className={`rounded-lg shadow-xl border ${isOverBlueBackground
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                    } py-4 px-6 flex items-stretch`}
                >
                  {/* Content Section */}
                  <div className="flex-1 min-w-[198px] py-4">
                    <div className="px-6 py-2">
                      <p className={`text-sm font-semibold uppercase tracking-wider ${isOverBlueBackground ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                        Content
                      </p>
                    </div>

                    {resourcesItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.href}
                          className="relative"
                        >
                          <Link
                            to={item.href}
                            onClick={() => {
                              setIsResourcesOpen(false);
                              setIsMenuOpen(false);
                            }}
                            className={`group/item flex items-center gap-3 px-6 py-3 text-sm transition-colors relative ${isOverBlueBackground
                              ? 'text-gray-300 hover:text-white'
                              : 'text-gray-700 hover:text-gray-900'
                              }`}
                          >
                            <Icon className="w-3.5 h-3.5 flex-shrink-0 -mt-[4px]" />
                            <span className="relative inline-block pb-1">
                              {item.label}
                              <DropdownUnderline isBlue={isOverBlueBackground} />
                            </span>
                          </Link>
                        </div>
                      );
                    })}
                  </div>

                  {/* Vertical Separator */}
                  <div className={`border-l ${isOverBlueBackground ? 'border-gray-700' : 'border-gray-200'
                    }`} />

                  {/* Free Tools Section */}
                  <div className="flex-1 min-w-[240px] py-4">
                    <div className="px-4 py-2">
                      <p className={`text-sm font-semibold uppercase tracking-wider ${isOverBlueBackground ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                        Free Tools
                      </p>
                    </div>

                    {freeToolsItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.href}
                          className="relative"
                        >
                          <Link
                            to={item.href}
                            onClick={() => {
                              setIsResourcesOpen(false);
                              setIsMenuOpen(false);
                            }}
                            className={`group/item flex items-center gap-3 px-4 py-3 text-sm transition-colors relative ${isOverBlueBackground
                              ? 'text-gray-300 hover:text-white'
                              : 'text-gray-700 hover:text-gray-900'
                              }`}
                          >
                            <Icon className="w-3.5 h-3.5 flex-shrink-0 -mt-[4px]" />
                            <span className="relative inline-block pb-1 whitespace-nowrap">
                              {item.label}
                              <DropdownUnderline isBlue={isOverBlueBackground} />
                            </span>
                          </Link>
                        </div>
                      );
                    })}
                  </div>

                  {/* Vertical Separator */}
                  <div className={`border-l ${isOverBlueBackground ? 'border-gray-700' : 'border-gray-200'
                    }`} />

                  {/* Strike AI Announcement Section */}
                  <div className="flex-1 min-w-[320px] px-3 py-4 flex">
                    <Link
                      to="/strike-ai"
                      onClick={() => {
                        setIsResourcesOpen(false);
                        setIsMenuOpen(false);
                      }}
                      className="block w-full"
                    >
                      <div
                        className={`h-full rounded-2xl p-6 border-2 transition-all hover:translate-y-[-2px] hover:shadow-2xl ${isOverBlueBackground
                          ? 'bg-white border-gray-900 shadow-xl'
                          : 'bg-white border-gray-900 shadow-xl'
                          }`}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black border-2 border-gray-900">
                            <Sparkles className="w-5 h-5 text-white" strokeWidth={2.5} />
                          </div>
                          <div>
                            <span className="font-bold text-sm uppercase tracking-wider text-black block">
                              New: Strike AI
                            </span>
                            <span className="text-xs text-gray-600 block mt-0.5">
                              Now Available
                            </span>
                          </div>
                        </div>

                        <p className="text-sm leading-relaxed text-gray-700 mb-5">
                          Strike, our intelligent AI assistant, is now available. Get instant answers and assistance powered by advanced AI.
                        </p>

                        <div className="mt-auto flex justify-end">
                          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-black text-white text-sm font-semibold shadow-md hover:bg-gray-900 transition-colors w-full justify-center">
                            Try Strike AI
                            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
                </div>
              </div>
            </nav>
          </div>

          {/* Right Side - Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${isOverBlueBackground ? 'bg-white text-brand-blue hover:bg-white/90' : 'bg-brand-blue text-white hover:bg-brand-blueDark'}`}
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <div
                  className="relative group"
                >
                  <Link
                    to="/login"
                    className={`relative font-medium py-2 transition-colors duration-300 ${isOverBlueBackground ? 'text-white' : 'text-text-muted'
                      }`}
                  >
                    Login
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 w-0 opacity-0 group-hover:w-full group-hover:opacity-100 transition-all duration-300 ease-in-out ${isOverBlueBackground ? 'bg-white' : 'bg-brand-blue'
                        }`}
                    />
                  </Link>
                </div>
                <Link
                  to="/signup"
                  className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isOverBlueBackground
                      ? 'bg-white text-brand-blue hover:bg-blue-50'
                      : 'bg-brand-blue text-white hover:bg-brand-blueDark'
                  }`}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button - Fixed to top right */}
          <button
            className="md:hidden fixed top-2 right-4 z-[9995] min-w-[44px] min-h-[44px] flex items-center justify-center bg-white backdrop-blur-sm rounded-full shadow-xl border-2 border-gray-300 hover:bg-gray-50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div
              className="transition-transform duration-300"
              style={{ transform: isMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
            >
              {isMenuOpen ? (
                <X size={18} strokeWidth={2.5} className="text-gray-800" />
              ) : (
                <Menu size={18} strokeWidth={2.5} className="text-gray-800" />
              )}
            </div>
          </button>
        </div>

        {/* Mobile menu — simple fullscreen overlay */}
        {typeof document !== 'undefined' && createPortal(
          <div
            className={`md:hidden fixed inset-0 z-[9999] bg-white overflow-y-auto transition-all duration-250 ease-out ${isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}
          >
            {/* Close button */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100"
              aria-label="Close menu"
            >
              <X size={20} strokeWidth={2.5} className="text-gray-800" />
            </button>

            <div className="px-6 pt-16 pb-8 space-y-1">
              {/* Main links + dropdowns */}
              {[
                { label: 'About', href: '/about' },
                ...navItems,
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => { handleNavClick(item.href); setIsMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 text-lg font-semibold text-gray-900 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  {item.label}
                </button>
              ))}

              {/* Features dropdown */}
              <div>
                <button
                  onClick={() => setMobileFeatures(!mobileFeatures)}
                  className="w-full text-left px-4 py-3 text-lg font-semibold text-gray-900 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-between"
                >
                  Features
                  <ChevronDown size={18} className={`text-gray-400 transition-transform ${mobileFeatures ? 'rotate-180' : ''}`} />
                </button>
                {mobileFeatures && (
                  <div className="pl-2 space-y-0.5 mt-1">
                    {featuresItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.href}
                          onClick={() => { handleNavClick(item.href); setIsMenuOpen(false); }}
                          className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-3"
                        >
                          <Icon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Resources dropdown */}
              <div>
                <button
                  onClick={() => setMobileResources(!mobileResources)}
                  className="w-full text-left px-4 py-3 text-lg font-semibold text-gray-900 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-between"
                >
                  Resources
                  <ChevronDown size={18} className={`text-gray-400 transition-transform ${mobileResources ? 'rotate-180' : ''}`} />
                </button>
                {mobileResources && (
                  <div className="pl-2 space-y-0.5 mt-1">
                    {resourcesItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.href}
                          onClick={() => { handleNavClick(item.href); setIsMenuOpen(false); }}
                          className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-3"
                        >
                          <Icon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="h-px bg-gray-200 mt-4" />

              {/* Auth */}
              <div className="space-y-3 pt-4">
                {isAuthenticated ? (
                  <button
                    onClick={() => { handleNavClick('/dashboard'); setIsMenuOpen(false); }}
                    className="w-full py-3 text-base font-semibold rounded-lg bg-brand-blue text-white hover:bg-brand-blueDark transition-colors"
                  >
                    Dashboard
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => { handleNavClick('/login'); setIsMenuOpen(false); }}
                      className="w-full py-3 text-base font-semibold text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => { handleNavClick('/signup'); setIsMenuOpen(false); }}
                      className="w-full py-3 text-base font-bold rounded-lg bg-brand-blue text-white hover:bg-brand-blueDark transition-colors"
                    >
                      Start now
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </header>
  );
};

export default React.memo(Header);
