import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import LanguageSwitcher from './LanguageSwitcher';
import ErrorBoundary from './ErrorBoundary';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container-responsive">
        <div className="flex justify-between h-20">
          {/* Logo and Navigation Links */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <img
                className="h-10 w-auto transition-transform duration-200 group-hover:scale-105 govt-emblem"
                src="/logo.svg"
                alt="Government of India Logo"
              />
              <div className="ml-4">
                <span className="text-2xl font-bold gradient-text-primary">
                  NCO Search
                </span>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                  Government of India
                </div>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:ml-12 lg:flex lg:space-x-2">
              <Link
                to="/"
                className={`navbar-link ${isActive('/') ? 'active' : ''}`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`navbar-link ${isActive('/about') ? 'active' : ''}`}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`navbar-link ${isActive('/contact') ? 'active' : ''}`}
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-3">
            {/* Language Switcher */}
            <ErrorBoundary>
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>
            </ErrorBoundary>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-3 rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-gold-400 hover:bg-primary-50 dark:hover:bg-navy-800 transition-all duration-200 shadow-soft hover:shadow-medium"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-gold-400 hover:bg-primary-50 dark:hover:bg-navy-800 transition-all duration-200 shadow-soft hover:shadow-medium"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden animate-slide-down">
          <div className="container-responsive">
            <div className="py-6 space-y-2 bg-white/95 dark:bg-navy-900/95 backdrop-blur-xl border-t border-neutral-200 dark:border-navy-700 rounded-b-2xl shadow-hard">
              <Link
                to="/"
                className={`block px-6 py-4 rounded-xl text-base font-semibold transition-all duration-200 ${
                  isActive('/')
                    ? 'bg-primary-100 dark:bg-gold-100/20 text-primary-700 dark:text-gold-300 shadow-soft'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-navy-800 hover:text-primary-600 dark:hover:text-gold-400'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                🏠 Home
              </Link>
              <Link
                to="/about"
                className={`block px-6 py-4 rounded-xl text-base font-semibold transition-all duration-200 ${
                  isActive('/about')
                    ? 'bg-primary-100 dark:bg-gold-100/20 text-primary-700 dark:text-gold-300 shadow-soft'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-navy-800 hover:text-primary-600 dark:hover:text-gold-400'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                ℹ️ About
              </Link>
              <Link
                to="/contact"
                className={`block px-6 py-4 rounded-xl text-base font-semibold transition-all duration-200 ${
                  isActive('/contact')
                    ? 'bg-primary-100 dark:bg-gold-100/20 text-primary-700 dark:text-gold-300 shadow-soft'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-navy-800 hover:text-primary-600 dark:hover:text-gold-400'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                📞 Contact
              </Link>
              
              {/* Mobile Language Switcher */}
              <div className="pt-4 border-t border-neutral-200 dark:border-navy-700">
                <ErrorBoundary>
                  <LanguageSwitcher />
                </ErrorBoundary>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;