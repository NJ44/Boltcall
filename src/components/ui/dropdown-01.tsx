import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
  description?: string;
}

interface DropdownComponentProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

const DropdownComponent: React.FC<DropdownComponentProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 transition-all duration-300 hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between ${
          isOpen ? 'border-blue-500' : ''
        }`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-required={required}
      >
        <span className="font-medium truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="ml-2 flex-shrink-0"
        >
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 rounded-lg border border-gray-300 bg-white shadow-2xl overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto">
              {options.map((option, index) => (
                <motion.button
                  key={option.value}
                  type="button"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full px-3 py-2 text-left transition-colors duration-200 hover:bg-blue-50 text-gray-900 flex items-center justify-between group ${
                    index !== options.length - 1 ? 'border-b border-gray-100' : ''
                  } ${value === option.value ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{option.label}</div>
                    {option.description && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {option.description}
                      </div>
                    )}
                  </div>
                  {value === option.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="ml-2 flex-shrink-0"
                    >
                      <Check className="w-4 h-4 text-blue-600" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownComponent;

