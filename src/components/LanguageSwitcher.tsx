import React, { useState, useEffect } from 'react';
import { Globe, Search, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import translate, { INDIAN_LANGUAGES } from '../utils/translate';

const LanguageSwitcher: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentLang, setCurrentLang] = useState(translate.detectLanguage());

  // Update current language when Google Translate changes
  useEffect(() => {
    const interval = setInterval(() => {
      const googleLang = translate.getCurrentLanguage();
      if (googleLang !== currentLang) {
        setCurrentLang(googleLang);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentLang]);

  const filteredLanguages = Object.entries(INDIAN_LANGUAGES).filter(([code, lang]) =>
    searchTerm === '' ||
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLanguageChange = (langCode: string) => {
    translate.changeLanguage(langCode);
    setCurrentLang(langCode);
    setIsOpen(false);
    setSearchTerm('');
  };

  const currentLanguage = INDIAN_LANGUAGES[currentLang as keyof typeof INDIAN_LANGUAGES];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        aria-label={t('language.select')}
      >
        <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentLanguage?.nativeName || 'English'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50">
          {/* Search */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('language.search')}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Language List */}
          <div className="max-h-72 overflow-y-auto py-2">
            {/* Auto-detect option */}
            <button
              onClick={() => handleLanguageChange(translate.detectLanguage())}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Globe className="w-5 h-5 text-gray-400" />
              <span className="flex-1 text-left text-sm text-gray-700 dark:text-gray-300">
                {t('language.auto')}
              </span>
            </button>

            <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

            {filteredLanguages.map(([code, lang]) => (
              <button
                key={code}
                onClick={() => handleLanguageChange(code)}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <span className="flex-1">
                  <span className="block text-sm font-medium text-gray-900 dark:text-white">
                    {lang.nativeName}
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    {lang.name}
                  </span>
                </span>
                {currentLang === code && (
                  <Check className="w-4 h-4 text-green-500" />
                )}
              </button>
            ))}

            {filteredLanguages.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                No languages found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
