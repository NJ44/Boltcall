import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface PageInfoTooltipProps {
  text: string;
}

const PageInfoTooltip: React.FC<PageInfoTooltipProps> = ({ text }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <HelpCircle className="w-3.5 h-3.5 text-gray-400 hover:text-gray-500 cursor-help transition-colors" />
      <div
        className={`absolute left-0 top-full mt-2 z-50 w-56 px-3 py-2 text-xs leading-relaxed text-gray-600 bg-white rounded-lg shadow-lg border border-gray-100 pointer-events-none transition-opacity duration-150 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {text}
      </div>
    </div>
  );
};

export default PageInfoTooltip;
