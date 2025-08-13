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
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-navy-900/95 backdrop-blur-xl border-b border-neutral-200 dark:border-navy-700 shadow-lg transition-all duration-300">
      <div className="container-responsive">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo and Brand */}
          <Link to="/" className="flex-shrink-0 flex items-center group" onClick={closeMenu}>
            <div className="flex items-center gap-4 lg:gap-5">
              <div className="relative">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 dark:from-gold-500 dark:via-gold-400 dark:to-gold-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                  <span className="text-white font-bold text-lg lg:text-xl tracking-wide">NCO</span>
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-secondary-500 rounded-full flex items-center justify-center shadow-md animate-bounce-subtle">
                  <span className="text-white text-xs font-bold">IN</span>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-400/20 to-secondary-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl lg:text-3xl font-bold gradient-text-primary tracking-tight">
                  NCO Search
                </span>
                <div className="text-sm lg:text-base text-neutral-600 dark:text-neutral-400 font-medium mt-1">
                  Government of India
                </div>
              </div>
              <div className="sm:hidden">
                <span className="text-xl font-bold gradient-text-primary">
                  NCO Search
                </span>
              </div>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 ${
                  isActive(item.path)
                    ? 'text-primary-600 dark:text-gold-400 bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-gold-400/10 dark:to-gold-500/5 shadow-md'
                    : 'text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-gold-400 hover:bg-gradient-to-r hover:from-neutral-50 hover:to-neutral-100/50 dark:hover:from-navy-800 dark:hover:to-navy-700/50 hover:shadow-md'
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 to-secondary-500 dark:from-gold-400 dark:to-gold-500 rounded-full"
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
              className="p-3 lg:p-4 rounded-2xl text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-gold-400 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100/50 dark:hover:from-gold-400/10 dark:hover:to-gold-500/5 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
              aria-label="Toggle theme"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              {theme === 'dark' ? (
                <Sun className="w-6 h-6" />
              ) : (
                <Moon className="w-6 h-6" />
              )}
            </motion.button>

            {/* Mobile menu button */}
            <motion.button
              onClick={toggleMenu}
              className="lg:hidden p-3 lg:p-4 rounded-2xl text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-gold-400 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100/50 dark:hover:from-gold-400/10 dark:hover:to-gold-500/5 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
              aria-label="Toggle menu"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
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
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="lg:hidden bg-white/95 dark:bg-navy-900/95 backdrop-blur-xl border-t border-neutral-200 dark:border-navy-700 shadow-xl"
          >
            <div className="container-responsive py-6">
              {/* Mobile Navigation Links */}
              <div className="space-y-3 mb-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMenu}
                    className={`block px-6 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 ${
                      isActive(item.path)
                        ? 'text-primary-600 dark:text-gold-400 bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-gold-400/10 dark:to-gold-500/5 shadow-md'
                        : 'text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-gold-400 hover:bg-gradient-to-r hover:from-neutral-50 hover:to-neutral-100/50 dark:hover:from-navy-800 dark:hover:to-navy-700/50 hover:shadow-md'
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
              <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-navy-700">
                <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2">
                  <p className="font-medium">National Classification of Occupations</p>
                  <p className="text-neutral-500 dark:text-neutral-500">Ministry of Statistics and Programme Implementation</p>
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