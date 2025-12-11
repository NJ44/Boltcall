import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const location = useLocation();

  // Auto-generate breadcrumbs from path if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/' }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Convert segment to readable label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Don't add the current page if it's the last segment (it's the page title)
      if (index < pathSegments.length - 1) {
        breadcrumbs.push({ label, href: currentPath });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbItems = generateBreadcrumbs();

  // Generate structured data for breadcrumbs
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.label,
        "item": `https://boltcall.org${item.href}`
      }))
    };

    // Remove existing breadcrumb schema
    const existingScript = document.getElementById('breadcrumb-schema');
    if (existingScript) existingScript.remove();

    // Add new breadcrumb schema
    const script = document.createElement('script');
    script.id = 'breadcrumb-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('breadcrumb-schema');
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, [location.pathname, breadcrumbItems]);

  if (breadcrumbItems.length <= 1) return null;

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 flex-wrap">
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            {index === 0 ? (
              <Link
                to={item.href}
                className="hover:text-blue-600 transition-colors"
                aria-label="Home"
              >
                <Home className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                {index === breadcrumbItems.length - 1 ? (
                  <span className="text-gray-900 font-medium" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.href}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

