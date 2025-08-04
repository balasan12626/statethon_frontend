import React from 'react';
import { Moon, Sun, Type, Plus, Minus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeControls: React.FC = () => {
  const { 
    theme, 
    fontSize, 
    setTheme, 
    increaseFontSize, 
    decreaseFontSize 
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

      {/* Font Size Controls */}
      <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <button
          onClick={decreaseFontSize}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="Decrease Font Size"
        >
          <Minus className="w-3 h-3 text-gray-700 dark:text-gray-300" />
        </button>
        
        <div className="flex items-center gap-1 px-2">
          <Type className="w-3 h-3 text-gray-700 dark:text-gray-300" />
          <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
            {fontSize}px
          </span>
        </div>
        
        <button
          onClick={increaseFontSize}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="Increase Font Size"
        >
          <Plus className="w-3 h-3 text-gray-700 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
};

export default ThemeControls; 