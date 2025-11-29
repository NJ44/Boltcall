import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  Calendar,
  ChevronRight,
  Files,
  Folder,
  Globe,
  Image,
  LayoutGrid,
  Mail,
  MessageSquare,
  Music,
  Search,
  Settings,
  StickyNote,
  Terminal,
  Twitter,
  BookOpen,
  TrendingUp,
  Zap,
  Users,
  Phone
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

interface Shortcut {
  label: string;
  icon: React.ReactNode;
  link: string;
}

interface SearchResult {
  icon: React.ReactNode;
  label: string;
  description: string;
  link: string;
}

const SVGFilter = () => {
  return (
    <svg width="0" height="0">
      <filter id="blob">
        <feGaussianBlur stdDeviation="10" in="SourceGraphic" />
        <feColorMatrix
          values="
      1 0 0 0 0
      0 1 0 0 0
      0 0 1 0 0
      0 0 0 18 -9
    "
          result="blob"
        />
        <feBlend in="SourceGraphic" in2="blob" />
      </filter>
    </svg>
  );
};

interface ShortcutButtonProps {
  icon: React.ReactNode;
  link: string;
  onClose?: () => void;
}

const isExternalLink = (link: string) => {
  return link.startsWith('http://') || link.startsWith('https://');
};

const ShortcutButton = ({ icon, link, onClose }: ShortcutButtonProps) => {
  const handleClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const content = (
    <div className="rounded-full cursor-pointer hover:shadow-lg opacity-30 hover:opacity-100 transition-[opacity,shadow] duration-200">
      <div className="size-12 aspect-square flex items-center justify-center [&_svg]:size-5">{icon}</div>
    </div>
  );

  if (isExternalLink(link)) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" onClick={handleClick}>
        {content}
      </a>
    );
  }

  return (
    <Link to={link} onClick={handleClick}>
      {content}
    </Link>
  );
};

interface SpotlightPlaceholderProps {
  text: string;
  className?: string;
}

const SpotlightPlaceholder = ({ text, className }: SpotlightPlaceholderProps) => {
  return (
    <motion.div
      layout
      className={cn('absolute text-gray-500 flex items-center pointer-events-none z-10', className)}
    >
      <AnimatePresence mode="popLayout">
        <motion.p
          layoutId={`placeholder-${text}`}
          key={`placeholder-${text}`}
          initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {text}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
};

interface SpotlightInputProps {
  placeholder: string;
  hidePlaceholder: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholderClassName?: string;
}

const SpotlightInput = ({
  placeholder,
  hidePlaceholder,
  value,
  onChange,
  placeholderClassName
}: SpotlightInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    // Focus the input when the component mounts
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex items-center w-full justify-start gap-2 px-4 h-12">
      <motion.div layoutId="search-icon" className="[&_svg]:size-4">
        <Search />
      </motion.div>
      <div className="flex-1 relative text-base">
        {!hidePlaceholder && (
          <SpotlightPlaceholder text={placeholder} className={placeholderClassName} />
        )}
        <motion.input
          ref={inputRef}
          layout="position"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent outline-none ring-none text-base"
        />
      </div>
    </div>
  );
};

interface SearchResultCardProps extends SearchResult {
  isLast: boolean;
  onClose?: () => void;
}

const SearchResultCard = ({ icon, label, description, link, isLast, onClose }: SearchResultCardProps) => {
  const handleClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const content = (
    <div
      className={cn(
        'flex items-center text-black justify-start hover:bg-white gap-2 py-1.5 px-2 rounded-lg hover:shadow-md w-full',
        isLast && 'rounded-b-2xl'
      )}
    >
      <div className="size-6 [&_svg]:stroke-[1.5] [&_svg]:size-4 aspect-square flex items-center justify-center">
        {icon}
      </div>
      <div className="flex flex-col">
        <p className="font-medium text-sm">{label}</p>
        <p className="text-xs opacity-50">{description}</p>
      </div>
      <div className="flex-1 flex items-center justify-end opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
        <ChevronRight className="size-4" />
      </div>
    </div>
  );

  if (isExternalLink(link)) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="overflow-hidden w-full group/card" onClick={handleClick}>
        {content}
      </a>
    );
  }

  return (
    <Link to={link} className="overflow-hidden w-full group/card" onClick={handleClick}>
      {content}
    </Link>
  );
};

interface SearchResultsContainerProps {
  searchResults: SearchResult[];
  onHover: (index: number | null) => void;
  onClose?: () => void;
}

const SearchResultsContainer = ({ searchResults, onHover, onClose }: SearchResultsContainerProps) => {
  return (
    <motion.div
      layout
      onMouseLeave={() => onHover(null)}
      className="px-1.5 border-t flex flex-col bg-neutral-100 max-h-64 overflow-y-auto w-full py-1.5"
    >
      {searchResults.length > 0 ? (
        searchResults.map((result, index) => {
          return (
            <motion.div
              key={`search-result-${index}`}
              onMouseEnter={() => onHover(index)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                delay: index * 0.1,
                duration: 0.2,
                ease: 'easeOut'
              }}
            >
              <SearchResultCard
                icon={result.icon}
                label={result.label}
                description={result.description}
                link={result.link}
                isLast={index === searchResults.length - 1}
                onClose={onClose}
              />
            </motion.div>
          );
        })
      ) : (
        <div className="py-8 text-center text-gray-500">
          <p className="text-sm">No results found</p>
        </div>
      )}
    </motion.div>
  );
};

interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
}

interface AppleSpotlightProps {
  shortcuts?: Shortcut[];
  isOpen?: boolean;
  handleClose?: () => void;
  blogPosts?: BlogPost[];
}

const AppleSpotlight = ({
  shortcuts = [
    {
      label: 'AI Receptionist',
      icon: <Phone />,
      link: '/features/ai-receptionist'
    },
    {
      label: 'Instant Lead Reply',
      icon: <Zap />,
      link: '/features/instant-form-reply'
    },
    {
      label: 'Website Chat & Voice',
      icon: <Globe />,
      link: '/features/website-chat-voice-widget'
    },
    {
      label: 'SMS Booking',
      icon: <Mail />,
      link: '/features/sms-booking-assistant'
    }
  ],
  isOpen = true,
  handleClose = () => {},
  blogPosts = []
}: AppleSpotlightProps) => {
  const [hovered, setHovered] = useState(false);
  const [hoveredSearchResult, setHoveredSearchResult] = useState<number | null>(null);
  const [hoveredShortcut, setHoveredShortcut] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState('');

  const handleSearchValueChange = (value: string) => {
    setSearchValue(value);
  };

  // Filter blog posts based on search query
  const getFilteredBlogPosts = (): SearchResult[] => {
    if (!searchValue.trim() || !blogPosts.length) {
      return [];
    }

    const query = searchValue.toLowerCase().trim();
    
    return blogPosts
      .filter((post) => {
        // Remove HTML tags from title for searching
        const titleText = post.title.replace(/<[^>]*>/g, '').toLowerCase();
        const excerptText = post.excerpt.toLowerCase();
        const categoryText = post.category.toLowerCase();
        
        return (
          titleText.includes(query) ||
          excerptText.includes(query) ||
          categoryText.includes(query)
        );
      })
      .map((post) => {
        // Remove HTML tags from title for display
        const titleText = post.title.replace(/<[^>]*>/g, '');
        
        // Choose icon based on category or content
        let icon = <BookOpen />;
        if (post.category.includes('AI') || titleText.toLowerCase().includes('ai receptionist')) {
          icon = <Phone />;
        } else if (post.category.includes('SEO') || titleText.toLowerCase().includes('seo')) {
          icon = <Search />;
        } else if (post.category.includes('Speed') || titleText.toLowerCase().includes('speed')) {
          icon = <Zap />;
        } else if (post.category.includes('Business')) {
          icon = <TrendingUp />;
        }

        return {
          icon,
          label: titleText,
          description: post.excerpt,
          link: post.slug
        };
      });
  };

  const searchResults: SearchResult[] = getFilteredBlogPosts();

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{
            opacity: 0,
            filter: 'blur(20px) url(#blob)',
            scaleX: 1.1,
            scaleY: 1.05,
            y: -5
          }}
          animate={{
            opacity: 1,
            filter: 'blur(0px) url(#blob)',
            scaleX: 1,
            scaleY: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            filter: 'blur(20px) url(#blob)',
            scaleX: 1.1,
            scaleY: 1.05,
            y: 5
          }}
          transition={{
            stiffness: 550,
            damping: 50,
            type: 'spring'
          }}
          className="relative w-full flex flex-col items-center justify-center mb-8"
        >
          <SVGFilter />
          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => {
              setHovered(false);
              setHoveredShortcut(null);
            }}
            onClick={(e) => e.stopPropagation()}
            style={{ filter: 'url(#blob)' }}
            className={cn(
              'w-full flex items-center justify-end gap-3 z-20 group',
              '[&>div]:bg-neutral-100 [&>div]:text-black [&>div]:rounded-full [&>div]:backdrop-blur-xl',
              '[&_svg]:size-5 [&_svg]:stroke-[1.4]',
              'max-w-xl'
            )}
          >
            <AnimatePresence mode="popLayout">
              <motion.div
                layoutId="search-input-container"
                transition={{
                  layout: {
                    duration: 0.5,
                    type: 'spring',
                    bounce: 0.2
                  }
                }}
                style={{
                  borderRadius: '30px'
                }}
                className="h-full w-full flex flex-col items-center justify-start z-10 relative shadow-lg overflow-hidden border"
              >
                <SpotlightInput
                  placeholder={
                    hoveredShortcut !== null
                      ? shortcuts[hoveredShortcut].label
                      : hoveredSearchResult !== null
                      ? searchResults[hoveredSearchResult].label
                      : 'Search'
                  }
                  placeholderClassName={
                    hoveredSearchResult !== null ? 'text-black bg-white' : 'text-gray-500'
                  }
                  hidePlaceholder={!(hoveredSearchResult !== null || !searchValue)}
                  value={searchValue}
                  onChange={handleSearchValueChange}
                />
                {searchValue && (
                  <SearchResultsContainer
                    searchResults={searchResults}
                    onHover={setHoveredSearchResult}
                    onClose={handleClose}
                  />
                )}
              </motion.div>
              {hovered &&
                !searchValue &&
                shortcuts.map((shortcut, index) => (
                  <motion.div
                    key={`shortcut-${index}`}
                    onMouseEnter={() => setHoveredShortcut(index)}
                    layout
                    initial={{ scale: 0.7, x: -1 * (48 * (index + 1)) }}
                    animate={{ scale: 1, x: 0 }}
                    exit={{
                      scale: 0.7,
                      x:
                        1 *
                        (12 * (shortcuts.length - index - 1) + 48 * (shortcuts.length - index - 1))
                    }}
                    transition={{
                      duration: 0.8,
                      type: 'spring',
                      bounce: 0.2,
                      delay: index * 0.05
                    }}
                    className="rounded-full cursor-pointer"
                  >
                    <ShortcutButton icon={shortcut.icon} link={shortcut.link} onClose={handleClose} />
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { AppleSpotlight };

