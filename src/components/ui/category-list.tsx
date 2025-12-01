import React, { useState } from 'react';
import { cn } from '@/lib/utils';

// Define the type for a single category item
export interface Category {
  id: string | number;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  featured?: boolean;
}

// Define the props for the CategoryList component
export interface CategoryListProps {
  title: string;
  subtitle?: string;
  categories: Category[];
  headerIcon?: React.ReactNode;
  className?: string;
}

export const CategoryList = ({
  title,
  subtitle,
  categories,
  headerIcon,
  className,
}: CategoryListProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | number | null>(null);

  return (
    <div className={cn("w-full p-8 bg-white", className)}>
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          {headerIcon && (
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/80 to-blue-600 mb-6 text-white">
              {headerIcon}
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight text-gray-900">{title}</h1>
          {subtitle && (
            <h2 className="text-4xl md:text-5xl font-bold text-gray-600">{subtitle}</h2>
          )}
        </div>

        {/* Categories List */}
        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative group"
              onMouseEnter={() => setHoveredItem(category.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={category.onClick}
            >
              <div
                className={cn(
                  "relative overflow-hidden border bg-white transition-all duration-300 ease-in-out cursor-pointer",
                  // Hover state styles
                  hoveredItem === category.id
                    ? 'h-32 border-blue-600 shadow-lg shadow-blue-600/20 bg-blue-50'
                    : 'h-24 border-gray-200 hover:border-blue-500/50'
                )}
              >
                    {/* Corner brackets that appear on hover */}
                {hoveredItem === category.id && (
                  <>
                    <div className="absolute top-3 left-3 w-6 h-6">
                      <div className="absolute top-0 left-0 w-4 h-0.5 bg-blue-600" />
                      <div className="absolute top-0 left-0 w-0.5 h-4 bg-blue-600" />
                    </div>
                    <div className="absolute bottom-3 right-3 w-6 h-6">
                      <div className="absolute bottom-0 right-0 w-4 h-0.5 bg-blue-600" />
                      <div className="absolute bottom-0 right-0 w-0.5 h-4 bg-blue-600" />
                    </div>
                  </>
                )}

                {/* Content */}
                <div className="flex items-center justify-between h-full px-6 md:px-8">
                  <div className="flex-1">
                    <h3
                      className={cn(
                        "font-bold transition-colors duration-300",
                        category.featured ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl',
                        hoveredItem === category.id ? 'text-blue-600' : 'text-gray-900'
                      )}
                    >
                      {category.title}
                    </h3>
                    {category.subtitle && (
                      <p
                        className={cn(
                          "mt-1 transition-colors duration-300 text-sm md:text-base",
                           hoveredItem === category.id ? 'text-gray-700' : 'text-gray-600'
                        )}
                      >
                        {category.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Icon always visible on the right */}
                  {category.icon && (
                    <div className="text-blue-600 transition-opacity duration-300">
                      {category.icon}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

