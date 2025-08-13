import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import LanguageSwitcher from './LanguageSwitcher';
import ErrorBoundary from './ErrorBoundary';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isMenuOpen) {
      setIsLanguageOpen(false);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsLanguageOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-navy-900/95 backdrop-blur-lg border-b border-neutral-200 dark:border-navy-700 shadow-sm">
      <div className="container-responsive">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo and Brand */}
          <Link to="/" className="flex-shrink-0 flex items-center group" onClick={closeMenu}>
            <div className="flex items-center gap-3 lg:gap-4">
              <img
                className="h-8 lg:h-10 w-auto transition-transform duration-200 group-hover:scale-105"
                src="/logo.svg"
                alt="Government of India Logo"
              />
              <div className="hidden sm:block">
                <span className="text-xl lg:text-2xl font-bold gradient-text-primary">
                  NCO Search
                </span>
                <div className="text-xs lg:text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                  Government of India
                </div>
              </div>
              <div className="sm:hidden">
                <span className="text-lg font-bold gradient-text-primary">
                  NCO Search
                </span>
              </div>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-primary-600 dark:text-gold-400 bg-primary-50 dark:bg-gold-400/10'
                    : 'text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-gold-400 hover:bg-neutral-50 dark:hover:bg-navy-800'
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-gold-400 rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Language Switcher - Desktop */}
            <ErrorBoundary>
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>
            </ErrorBoundary>

            {/* Theme Toggle */}
            <motion.button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 lg:p-3 rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-gold-400 hover:bg-primary-50 dark:hover:bg-navy-800 transition-all duration-200 shadow-soft hover:shadow-medium"
              aria-label="Toggle theme"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </motion.button>

            {/* Mobile menu button */}
            <motion.button
              onClick={toggleMenu}
              className="lg:hidden p-2 lg:p-3 rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-gold-400 hover:bg-primary-50 dark:hover:bg-navy-800 transition-all duration-200 shadow-soft hover:shadow-medium"
              aria-label="Toggle menu"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-white dark:bg-navy-900 border-t border-neutral-200 dark:border-navy-700 shadow-lg"
          >
            <div className="container-responsive py-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-2 mb-6">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMenu}
                    className={`block px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'text-primary-600 dark:text-gold-400 bg-primary-50 dark:bg-gold-400/10'
                        : 'text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-gold-400 hover:bg-neutral-50 dark:hover:bg-navy-800'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Mobile Language Switcher */}
              <div className="border-t border-neutral-200 dark:border-navy-700 pt-4">
                <ErrorBoundary>
                  <LanguageSwitcher />
                </ErrorBoundary>
              </div>

              {/* Mobile Additional Info */}
              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-navy-700">
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  <p className="mb-2">National Classification of Occupations</p>
                  <p>Ministry of Statistics and Programme Implementation</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;