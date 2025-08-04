import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search, Mic, Filter, X, Clock, TrendingUp, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { debounce } from '../utils/debounce';

interface SearchSuggestion {
  id: string;
  text: string;
  category: string;
  icon: string;
  popularity: number;
}

interface AdvancedSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  isListening: boolean;
  onVoiceInput: () => void;
  backendStatus: 'checking' | 'connected' | 'disconnected';
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  value,
  onChange,
  onSearch,
  isLoading,
  isListening,
  onVoiceInput,
  backendStatus
}) => {
  const { t } = useTranslation();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    industry: '',
    experience: '',
    education: '',
    location: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Mock suggestions data
  const mockSuggestions: SearchSuggestion[] = [
    { id: '1', text: 'Software Developer', category: 'Technology', icon: '💻', popularity: 95 },
    { id: '2', text: 'Data Scientist', category: 'Technology', icon: '📊', popularity: 90 },
    { id: '3', text: 'Digital Marketing Specialist', category: 'Marketing', icon: '📱', popularity: 85 },
    { id: '4', text: 'Financial Analyst', category: 'Finance', icon: '💰', popularity: 80 },
    { id: '5', text: 'Project Manager', category: 'Management', icon: '📋', popularity: 88 },
    { id: '6', text: 'UX/UI Designer', category: 'Design', icon: '🎨', popularity: 82 },
    { id: '7', text: 'Cybersecurity Specialist', category: 'Technology', icon: '🔒', popularity: 87 },
    { id: '8', text: 'Machine Learning Engineer', category: 'Technology', icon: '🤖', popularity: 92 },
  ];

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('nco-search-history');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // Debounced search suggestions
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.length >= 2) {
        const filtered = mockSuggestions.filter(suggestion =>
          suggestion.text.toLowerCase().includes(query.toLowerCase()) ||
          suggestion.category.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 6));
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(value);
  }, [value, debouncedSearch]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.text);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleHistoryClick = (historyItem: string) => {
    onChange(historyItem);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSearch = () => {
    if (value.trim()) {
      // Save to search history
      const newHistory = [value, ...searchHistory.filter(item => item !== value)].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('nco-search-history', JSON.stringify(newHistory));
    }
    onSearch();
    setShowSuggestions(false);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('nco-search-history');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Input Container */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-soft dark:shadow-hard border border-neutral-200 dark:border-neutral-700 transition-all duration-300 hover:shadow-medium focus-within:shadow-medium focus-within:border-primary-500 dark:focus-within:border-primary-400">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full animate-pulse"></div>
            </div>
            <h2 className="text-xl font-semibold text-neutral-800 dark:text-white">
              {t('home.describeJob')}
            </h2>
          </div>
          

        </div>

        {/* Main Input Area */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Text Input */}
            <div className="relative">
              <textarea
                ref={inputRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => value.length >= 2 && setShowSuggestions(true)}
                placeholder={t('home.placeholder')}
                className="w-full h-32 px-4 py-3 bg-neutral-50 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-neutral-700 dark:text-neutral-200 placeholder-neutral-500 dark:placeholder-neutral-400 transition-all duration-200"
              />
              
              {/* Character Counter */}
              <div className="absolute bottom-3 right-3 text-xs text-neutral-400">
                {value.length}/500
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              {/* Left side controls */}
              <div className="flex items-center gap-3">
                {/* Voice Input */}
                <motion.button
                  onClick={onVoiceInput}
                  disabled={isListening}
                  className={`flex items-center px-4 py-2.5 rounded-xl border transition-all duration-200 ${
                    isListening 
                      ? 'bg-error-50 dark:bg-error-900/20 border-error-300 dark:border-error-600 text-error-700 dark:text-error-400' 
                      : 'bg-neutral-50 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mic className={`w-4 h-4 mr-2 ${isListening ? 'animate-pulse' : ''}`} />
                  {isListening ? t('home.listening') : t('home.voiceInput')}
                </motion.button>

                {/* Filters Toggle */}
                <motion.button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center px-4 py-2.5 rounded-xl border transition-all duration-200 ${
                    showFilters
                      ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-600 text-primary-700 dark:text-primary-400'
                      : 'bg-neutral-50 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {Object.values(filters).some(v => v) && (
                    <span className="ml-2 bg-primary-500 text-white text-xs rounded-full px-2 py-0.5">
                      {Object.values(filters).filter(v => v).length}
                    </span>
                  )}
                </motion.button>
              </div>
              
              {/* Search Button */}
              <motion.button
                onClick={handleSearch}
                disabled={!value.trim() || isLoading || backendStatus === 'disconnected'}
                className="flex items-center px-6 py-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-soft"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Analyzing...
                  </>
                ) : backendStatus === 'disconnected' ? (
                  <>
                    <X className="w-5 h-5 mr-2" />
                    Offline
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    {t('home.findCode')}
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700/50"
            >
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Industry
                    </label>
                    <select 
                      value={filters.industry}
                      onChange={(e) => setFilters({...filters, industry: e.target.value})}
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">All Industries</option>
                      <option value="technology">Technology</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="finance">Finance</option>
                      <option value="education">Education</option>
                      <option value="manufacturing">Manufacturing</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Experience
                    </label>
                    <select 
                      value={filters.experience}
                      onChange={(e) => setFilters({...filters, experience: e.target.value})}
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">All Levels</option>
                      <option value="entry">Entry Level (0-2 years)</option>
                      <option value="mid">Mid Level (3-5 years)</option>
                      <option value="senior">Senior Level (6+ years)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Education
                    </label>
                    <select 
                      value={filters.education}
                      onChange={(e) => setFilters({...filters, education: e.target.value})}
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">All Education</option>
                      <option value="highschool">High School</option>
                      <option value="diploma">Diploma</option>
                      <option value="bachelor">Bachelor's Degree</option>
                      <option value="master">Master's Degree</option>
                      <option value="phd">PhD</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Location
                    </label>
                    <select 
                      value={filters.location}
                      onChange={(e) => setFilters({...filters, location: e.target.value})}
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">All Emirates</option>
                      <option value="dubai">Dubai</option>
                      <option value="abudhabi">Abu Dhabi</option>
                      <option value="sharjah">Sharjah</option>
                      <option value="ajman">Ajman</option>
                      <option value="rak">Ras Al Khaimah</option>
                      <option value="fujairah">Fujairah</option>
                      <option value="uaq">Umm Al Quwain</option>
                    </select>
                  </div>
                </div>
                
                {/* Clear Filters */}
                {Object.values(filters).some(v => v) && (
                  <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-600">
                    <button
                      onClick={() => setFilters({ industry: '', experience: '', education: '', location: '' })}
                      className="text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (suggestions.length > 0 || searchHistory.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-800 rounded-2xl shadow-hard border border-neutral-200 dark:border-neutral-700 z-50 max-h-96 overflow-y-auto"
          >
            {/* Search History */}
            {searchHistory.length > 0 && value.length < 2 && (
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Recent Searches
                  </h4>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-2">
                  {searchHistory.slice(0, 5).map((item, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleHistoryClick(item)}
                      className="w-full text-left px-3 py-2 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      {item}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Smart Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-4">
                <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Smart Suggestions
                </h4>
                <div className="space-y-1">
                  {suggestions.map((suggestion) => (
                    <motion.button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-lg transition-colors group"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-xl">{suggestion.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-neutral-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                          {suggestion.text}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          {suggestion.category}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-accent-500" />
                        <span className="text-xs text-accent-600 dark:text-accent-400 font-medium">
                          {suggestion.popularity}%
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedSearch;