import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeControls: React.FC = () => {
  const { 
    theme, 
    setTheme
  } = useTheme();

  return (
    <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Dark/Light Mode Toggle */}
      <button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      >
        {theme === 'light' ? (
          <Moon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        ) : (
          <Sun className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      {/* Font size controls removed as requested */}
    </div>
  );
};

export default ThemeControls; 