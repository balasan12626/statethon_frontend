import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Mic, 
  MicOff, 
  Filter, 
  X, 
  Sparkles,
  TrendingUp,
  Users,
  Building,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Zap,
  Globe,
  Target
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AdvancedSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  isListening: boolean;
  onVoiceInput: () => void;
}

interface FilterOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  category: string;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  value,
  onChange,
  onSearch,
  isLoading,
  isListening,
  onVoiceInput
}) => {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter options
  const filterOptions: FilterOption[] = [
    { id: 'education', label: 'Education', icon: <GraduationCap className="w-4 h-4" />, category: 'Sector' },
    { id: 'technology', label: 'Technology', icon: <Zap className="w-4 h-4" />, category: 'Sector' },
    { id: 'healthcare', label: 'Healthcare', icon: <Heart className="w-4 h-4" />, category: 'Sector' },
    { id: 'finance', label: 'Finance', icon: <TrendingUp className="w-4 h-4" />, category: 'Sector' },
    { id: 'government', label: 'Government', icon: <Building className="w-4 h-4" />, category: 'Sector' },
    { id: 'high-demand', label: 'High Demand', icon: <Users className="w-4 h-4" />, category: 'Demand' },
    { id: 'growth', label: 'Growth Sector', icon: <TrendingUp className="w-4 h-4" />, category: 'Demand' },
    { id: 'remote', label: 'Remote Work', icon: <Globe className="w-4 h-4" />, category: 'Work Type' },
    { id: 'entry-level', label: 'Entry Level', icon: <Target className="w-4 h-4" />, category: 'Experience' },
    { id: 'senior', label: 'Senior Level', icon: <Briefcase className="w-4 h-4" />, category: 'Experience' }
  ];

  // Search suggestions
  const searchSuggestions = [
    "I teach children in primary school",
    "I develop mobile applications",
    "I install solar panels and fix inverters",
    "I manage a team of software developers",
    "I provide healthcare services to patients",
    "I analyze financial data and create reports",
    "I design user interfaces for websites",
    "I conduct research in biotechnology",
    "I manage government projects and policies",
    "I provide legal consultation and advice"
  ];

  const handleFilterToggle = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      onSearch();
    }
  };

  const groupedFilters = filterOptions.reduce((acc, filter) => {
    if (!acc[filter.category]) {
      acc[filter.category] = [];
    }
    acc[filter.category].push(filter);
    return acc;
  }, {} as Record<string, FilterOption[]>);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Search Container */}
      <div className="relative">
        {/* Search Input */}
        <div className="relative">
          <div className="relative flex items-center">
            {/* Search Icon */}
            <div className="absolute left-6 z-10">
              <Search className="w-6 h-6 text-neutral-500 dark:text-neutral-400" />
            </div>

            {/* Main Input */}
            <input
              type="text"
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              onKeyPress={handleKeyPress}
              onFocus={() => setShowSuggestions(value.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder={t('home.describeJob') || "Describe your job or profession..."}
              className="w-full pl-16 pr-40 py-6 lg:py-7 text-xl bg-gradient-to-br from-white via-white to-neutral-50 dark:from-navy-800 dark:via-navy-800 dark:to-navy-900 border-2 border-neutral-300/60 dark:border-navy-600/60 rounded-3xl shadow-xl focus:border-primary-500 dark:focus:border-gold-400 focus:ring-4 focus:ring-primary-100/50 dark:focus:ring-gold-400/20 transition-all duration-300 placeholder-neutral-500 dark:placeholder-neutral-400 font-medium"
            />

            {/* Action Buttons */}
            <div className="absolute right-3 flex items-center gap-3">
              {/* Voice Input Button */}
              <motion.button
                onClick={onVoiceInput}
                disabled={isListening}
                className={`p-4 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg ${
                  isListening 
                    ? 'bg-error-100 text-error-600 dark:bg-error-900/30 dark:text-error-400' 
                    : 'bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50'
                }`}
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                title={isListening ? "Listening..." : "Voice Input"}
              >
                {isListening ? (
                  <MicOff className="w-6 h-6 animate-pulse" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </motion.button>

              {/* Filter Button */}
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-4 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg ${
                  showFilters || selectedFilters.length > 0
                    ? 'bg-secondary-100 text-secondary-600 dark:bg-secondary-900/30 dark:text-secondary-400'
                    : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 dark:bg-navy-700 dark:text-neutral-400 dark:hover:bg-navy-600'
                }`}
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                title="Filters"
              >
                <Filter className="w-6 h-6" />
                {selectedFilters.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-secondary-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {selectedFilters.length}
                  </span>
                )}
              </motion.button>

              {/* Search Button */}
              <motion.button
                onClick={onSearch}
                disabled={isLoading || !value.trim()}
                className={`px-8 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl ${
                  isLoading || !value.trim()
                    ? 'bg-neutral-200 text-neutral-400 dark:bg-navy-700 dark:text-neutral-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800'
                }`}
                whileHover={!isLoading && value.trim() ? { scale: 1.05, y: -2 } : {}}
                whileTap={!isLoading && value.trim() ? { scale: 0.98 } : {}}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="hidden sm:inline text-lg">Searching...</span>
                    <span className="sm:hidden text-lg">...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span className="hidden sm:inline text-lg">{t('home.findCode') || 'Find Code'}</span>
                    <span className="sm:hidden text-lg">Search</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Search Suggestions */}
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-navy-800 border border-neutral-200 dark:border-navy-600 rounded-2xl shadow-2xl z-50 max-h-64 overflow-y-auto"
            >
              <div className="p-4">
                <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary-500" />
                  Popular Searches
                </h4>
                <div className="space-y-2">
                  {searchSuggestions
                    .filter(suggestion => 
                      suggestion.toLowerCase().includes(value.toLowerCase())
                    )
                    .slice(0, 5)
                    .map((suggestion, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-navy-700 transition-colors text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-gold-400"
                        whileHover={{ x: 4 }}
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 bg-white dark:bg-navy-800 border border-neutral-200 dark:border-navy-600 rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Filter className="w-5 h-5 text-primary-600" />
                    Filters
                  </h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-navy-700 transition-colors"
                  >
                    <X className="w-5 h-5 text-neutral-500" />
                  </button>
                </div>

                {/* Filter Groups */}
                <div className="space-y-6">
                  {Object.entries(groupedFilters).map(([category, filters]) => (
                    <div key={category}>
                      <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-400 mb-3 uppercase tracking-wide">
                        {category}
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {filters.map((filter) => (
                          <motion.button
                            key={filter.id}
                            onClick={() => handleFilterToggle(filter.id)}
                            className={`p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-2 text-sm font-medium ${
                              selectedFilters.includes(filter.id)
                                ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-gold-400 dark:bg-gold-400/10 dark:text-gold-400'
                                : 'border-neutral-200 dark:border-navy-600 text-neutral-700 dark:text-neutral-300 hover:border-primary-300 dark:hover:border-gold-500/50'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {filter.icon}
                            {filter.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Filter Actions */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-200 dark:border-navy-600">
                  <button
                    onClick={() => setSelectedFilters([])}
                    className="text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
                  >
                    Clear All
                  </button>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                      {selectedFilters.length} selected
                    </span>
                    <motion.button
                      onClick={() => setShowFilters(false)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Apply Filters
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center"
      >
        <p className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center justify-center gap-2">
          <Target className="w-4 h-4" />
          Tip: Be specific about your role, responsibilities, and industry for better matches
        </p>
      </motion.div>
    </div>
  );
};

export default AdvancedSearch;