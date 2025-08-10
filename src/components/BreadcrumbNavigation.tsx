import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  path: string;
  current?: boolean;
}

export const BreadcrumbNavigation: React.FC = () => {
  const location = useLocation();
  
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'Home', path: '/' }
    ];

    if (pathSegments.length === 0) {
      breadcrumbs[0].current = true;
      return breadcrumbs;
    }

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Convert segment to readable name
      const name = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        name,
        path: currentPath,
        current: isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumbs on home page
  }

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700" aria-label="Breadcrumb">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 py-3">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.path} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400 mx-2" aria-hidden="true" />
              )}
              
              {breadcrumb.current ? (
                <span 
                  className="text-sm font-medium text-gray-500 dark:text-gray-400"
                  aria-current="page"
                >
                  {breadcrumb.name === 'Home' ? (
                    <span className="flex items-center">
                      <Home className="w-4 h-4 mr-1" />
                      {breadcrumb.name}
                    </span>
                  ) : (
                    breadcrumb.name
                  )}
                </span>
              ) : (
                <Link
                  to={breadcrumb.path}
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 flex items-center"
                >
                  {breadcrumb.name === 'Home' ? (
                    <>
                      <Home className="w-4 h-4 mr-1" />
                      {breadcrumb.name}
                    </>
                  ) : (
                    breadcrumb.name
                  )}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};
