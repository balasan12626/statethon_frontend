import React, { useState, useMemo } from 'react';
import { Globe, ChevronDown, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', category: 'International' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', category: 'Indo-Aryan' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', category: 'Indo-Aryan' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', category: 'Dravidian' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', category: 'Dravidian' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', category: 'Dravidian' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', category: 'Indo-Aryan' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', category: 'Dravidian' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', category: 'Indo-Aryan' },
    { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳', category: 'Indo-Aryan' },
    { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳', category: 'Indo-Aryan' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', category: 'Indo-Aryan' },
    { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', flag: '🇮🇳', category: 'Classical' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const filteredLanguages = useMemo(() => {
    if (!searchTerm) return languages;
    
    return languages.filter(lang => 
      lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
    setSearchTerm('');
  };

  const groupedLanguages = useMemo(() => {
    const groups: { [key: string]: typeof languages } = {};
    filteredLanguages.forEach(lang => {
      if (!groups[lang.category]) {
        groups[lang.category] = [];
      }
      groups[lang.category].push(lang);
    });
    return groups;
  }, [filteredLanguages]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentLanguage.flag} {currentLanguage.nativeName}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 min-w-[280px] max-h-[400px] overflow-y-auto">
          {/* Search Bar */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search languages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Language List */}
          <div className="py-2">
            {Object.entries(groupedLanguages).map(([category, langs]) => (
              <div key={category}>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-gray-700">
                  {category}
                </div>
                {langs.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      i18n.language === language.code
                        ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{language.nativeName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{language.name}</div>
                    </div>
                    {i18n.language === language.code && (
                      <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            ))}
            
            {filteredLanguages.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                No languages found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector; 