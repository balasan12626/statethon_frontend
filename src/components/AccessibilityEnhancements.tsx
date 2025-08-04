import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Accessibility, 
  Type, 
  Contrast, 
  Volume2, 
  Keyboard, 
  Settings,
  X,
  Plus,
  Minus,
  RotateCcw
} from 'lucide-react';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ isOpen, onClose }) => {
  const [fontSize, setFontSize] = useState(16);
  const [contrast, setContrast] = useState('normal');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);

  useEffect(() => {
    // Load accessibility preferences from localStorage
    const savedPrefs = localStorage.getItem('accessibility-preferences');
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      setFontSize(prefs.fontSize || 16);
      setContrast(prefs.contrast || 'normal');
      setReducedMotion(prefs.reducedMotion || false);
      setScreenReader(prefs.screenReader || false);
      setKeyboardNavigation(prefs.keyboardNavigation || false);
    }
  }, []);

  useEffect(() => {
    // Save preferences to localStorage
    const prefs = {
      fontSize,
      contrast,
      reducedMotion,
      screenReader,
      keyboardNavigation
    };
    localStorage.setItem('accessibility-preferences', JSON.stringify(prefs));

    // Apply preferences to document
    document.documentElement.style.fontSize = `${fontSize}px`;
    document.documentElement.classList.toggle('high-contrast', contrast === 'high');
    document.documentElement.classList.toggle('reduced-motion', reducedMotion);
    document.documentElement.classList.toggle('screen-reader-enabled', screenReader);
    document.documentElement.classList.toggle('keyboard-navigation', keyboardNavigation);
  }, [fontSize, contrast, reducedMotion, screenReader, keyboardNavigation]);

  const increaseFontSize = () => setFontSize(prev => Math.min(24, prev + 2));
  const decreaseFontSize = () => setFontSize(prev => Math.max(12, prev - 2));
  const resetFontSize = () => setFontSize(16);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-4 top-4 bottom-4 w-80 bg-white dark:bg-neutral-800 rounded-2xl shadow-hard border border-neutral-200 dark:border-neutral-700 z-50 overflow-hidden"
            initial={{ opacity: 0, x: 320 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Accessibility className="w-6 h-6" />
                  <h2 className="text-lg font-semibold">Accessibility</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                  aria-label="Close accessibility panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6 overflow-y-auto h-full pb-20">
              {/* Font Size */}
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-800 dark:text-white mb-3">
                  <Type className="w-4 h-4" />
                  Text Size
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decreaseFontSize}
                    className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                    aria-label="Decrease font size"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="flex-1 text-center text-sm font-mono">
                    {fontSize}px
                  </span>
                  <button
                    onClick={increaseFontSize}
                    className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                    aria-label="Increase font size"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={resetFontSize}
                    className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                    aria-label="Reset font size"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Contrast */}
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-800 dark:text-white mb-3">
                  <Contrast className="w-4 h-4" />
                  Contrast
                </h3>
                <div className="space-y-2">
                  {[
                    { value: 'normal', label: 'Normal Contrast' },
                    { value: 'high', label: 'High Contrast' },
                  ].map(({ value, label }) => (
                    <label key={value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="contrast"
                        value={value}
                        checked={contrast === value}
                        onChange={(e) => setContrast(e.target.value)}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Motion */}
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-800 dark:text-white mb-3">
                  <Settings className="w-4 h-4" />
                  Motion & Animation
                </h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reducedMotion}
                    onChange={(e) => setReducedMotion(e.target.checked)}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 rounded"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    Reduce motion and animations
                  </span>
                </label>
              </div>

              {/* Screen Reader */}
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-800 dark:text-white mb-3">
                  <Volume2 className="w-4 h-4" />
                  Screen Reader
                </h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={screenReader}
                    onChange={(e) => setScreenReader(e.target.checked)}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 rounded"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    Optimize for screen readers
                  </span>
                </label>
              </div>

              {/* Keyboard Navigation */}
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-800 dark:text-white mb-3">
                  <Keyboard className="w-4 h-4" />
                  Navigation
                </h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={keyboardNavigation}
                    onChange={(e) => setKeyboardNavigation(e.target.checked)}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 rounded"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    Enhanced keyboard navigation
                  </span>
                </label>
              </div>

              {/* Keyboard Shortcuts */}
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-800 dark:text-white mb-3">
                  <Keyboard className="w-4 h-4" />
                  Keyboard Shortcuts
                </h3>
                <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                  <div className="flex justify-between">
                    <span>Search</span>
                    <kbd className="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 rounded">Ctrl + /</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Skip to main content</span>
                    <kbd className="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 rounded">Tab</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Toggle theme</span>
                    <kbd className="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 rounded">Ctrl + Shift + T</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Open accessibility</span>
                    <kbd className="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 rounded">Alt + A</kbd>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const SkipToContent: React.FC = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-lg z-50 font-medium"
  >
    Skip to main content
  </a>
);

export const AccessibilityButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <motion.button
    onClick={onClick}
    className="fixed bottom-4 right-4 w-12 h-12 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-full shadow-hard hover:shadow-glow-lg transition-all z-40"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    aria-label="Open accessibility options"
    title="Accessibility Options (Alt + A)"
  >
    <Accessibility className="w-6 h-6 mx-auto" />
  </motion.button>
);

// Custom hook for keyboard shortcuts
export const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ctrl + / for search focus
      if (event.ctrlKey && event.key === '/') {
        event.preventDefault();
        const searchInput = document.querySelector('textarea[placeholder*="job"]') as HTMLTextAreaElement;
        searchInput?.focus();
      }

      // Alt + A for accessibility panel
      if (event.altKey && event.key === 'a') {
        event.preventDefault();
        const accessibilityButton = document.querySelector('[aria-label*="accessibility"]') as HTMLButtonElement;
        accessibilityButton?.click();
      }

      // Ctrl + Shift + T for theme toggle
      if (event.ctrlKey && event.shiftKey && event.key === 'T') {
        event.preventDefault();
        const themeToggle = document.querySelector('[aria-label*="theme"]') as HTMLButtonElement;
        themeToggle?.click();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);
};

// Focus management utilities
export const useFocusManagement = () => {
  const focusElement = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const trapFocus = (containerSelector: string) => {
    const container = document.querySelector(containerSelector) as HTMLElement;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  };

  return { focusElement, trapFocus };
};