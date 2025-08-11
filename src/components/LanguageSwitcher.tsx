import React, { useState, useEffect, useCallback } from 'react';
import { Globe, Search, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import translate, { INDIAN_LANGUAGES, getLanguagesByCategory } from '../utils/translate';
import { 
  getTranslatableElements, 
  safeSetTextContent, 
  safeSetAttribute, 
  batchProcessElements,
  isElementConnected 
} from '../utils/domUtils';
import LanguageChangeIndicator from './LanguageChangeIndicator';

const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentLang, setCurrentLang] = useState(translate.detectLanguage());
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const [translatedContent, setTranslatedContent] = useState<{[key: string]: string}>({});

  // Update current language when Google Translate changes
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const googleLang = translate.getCurrentLanguage();
        if (googleLang !== currentLang) {
          setCurrentLang(googleLang);
        }
      } catch (error) {
        console.log('Error getting current language:', error);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentLang]);

  const filteredLanguages = Object.entries(INDIAN_LANGUAGES).filter(([_code, lang]) =>
    searchTerm === '' ||
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLanguageChange = useCallback(async (langCode: string) => {
    try {
      console.log('LanguageSwitcher: Changing language to:', langCode);
      
      setIsTranslating(true);
      setTranslationError(null);
      
      // Update Google Translate (will handle errors gracefully)
      try {
        translate.setLanguage(langCode);
      } catch (error) {
        console.log('Google Translate setLanguage failed, continuing with other updates');
      }
      
      // Update i18next
      await i18n.changeLanguage(langCode);
      
      // Update current language state
      setCurrentLang(langCode);
      
      // Trigger page translation if not English
      if (langCode !== 'en') {
        await translatePageContent(langCode);
      } else {
        // Reset to original content for English
        setTranslatedContent({});
        window.location.reload();
      }
      
      setIsTranslating(false);
      setIsOpen(false);
      setSearchTerm('');
    } catch (error) {
      console.error('Error changing language:', error);
      setTranslationError(error instanceof Error ? error.message : 'Translation failed');
      setIsTranslating(false);
    }
  }, [i18n]);

  const handleManualTranslate = useCallback(async () => {
    try {
      setIsTranslating(true);
      setTranslationError(null);
      
      await translatePageContent(currentLang);
      
      setIsTranslating(false);
    } catch (error) {
      console.error('Error in manual translation:', error);
      setTranslationError(error instanceof Error ? error.message : 'Manual translation failed');
      setIsTranslating(false);
    }
  }, [currentLang]);

  const translatePageContent = useCallback(async (targetLang: string) => {
    try {
      console.log('LanguageSwitcher: Translating page content to:', targetLang);
      
      // Use safe DOM utilities to get translatable elements
      const translatableElements = getTranslatableElements();
      const contentToTranslate: string[] = [];
      const elementMap: Map<number, Element> = new Map();
      
      translatableElements.forEach((element, index) => {
        const text = element.textContent?.trim();
        if (text && text.length > 0 && text.length < 1000) {
          contentToTranslate.push(text);
          elementMap.set(index, element);
          safeSetAttribute(element, 'data-translate-index', index.toString());
        }
      });

      if (contentToTranslate.length === 0) {
        console.log('No content to translate found');
        return;
      }

      console.log(`Found ${contentToTranslate.length} elements to translate`);

      // Create HTML content for translation - batch in chunks to avoid API limits
      const batchSize = 15; // Reduced batch size to avoid DOM conflicts
      const batches = [];
      
      for (let i = 0; i < contentToTranslate.length; i += batchSize) {
        const batch = contentToTranslate.slice(i, i + batchSize);
        const htmlContent = batch.map((text, batchIndex) => 
          `<div data-translate-index="${i + batchIndex}">${text}</div>`
        ).join('');
        batches.push({ htmlContent, startIndex: i });
      }

      // Process batches with safe DOM utilities
      await batchProcessElements(batches, 1, async (batchArray) => {
        for (const batch of batchArray) {
          try {
            const response = await translate.translatePage(batch.htmlContent, targetLang);
            
            if (response.status === 'success') {
              // Apply translated content with safe DOM utilities
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = response.translated_html;
              
              batch.htmlContent.split('<div data-translate-index="').forEach((part, partIndex) => {
                if (partIndex === 0) return; // Skip the first empty part
                
                const indexMatch = part.match(/^(\d+)">/);
                if (indexMatch) {
                  const index = parseInt(indexMatch[1]);
                  const element = elementMap.get(index);
                  if (element && isElementConnected(element)) {
                    const translatedElement = tempDiv.querySelector(`[data-translate-index="${index}"]`);
                    if (translatedElement && element.textContent !== translatedElement.textContent) {
                      safeSetTextContent(element, translatedElement.textContent || '');
                      safeSetAttribute(element, 'data-translated', 'true');
                    }
                  }
                }
              });
            }
          } catch (error) {
            console.error('Error translating batch:', error);
          }
        }
      }, 150); // Increased delay between batches
      
      console.log('LanguageSwitcher: Page translation completed successfully');
      
      // Translate attributes with delay to avoid conflicts
      setTimeout(async () => {
        try {
          // Translate placeholder attributes
          const inputElements = document.querySelectorAll('input[placeholder], textarea[placeholder]');
          for (const element of inputElements) {
            if (isElementConnected(element) && !element.hasAttribute('data-placeholder-translated')) {
              const placeholder = element.getAttribute('placeholder');
              if (placeholder) {
                try {
                  const translatedPlaceholder = await translate.translateText(placeholder, targetLang);
                  safeSetAttribute(element, 'placeholder', translatedPlaceholder);
                  safeSetAttribute(element, 'data-placeholder-translated', 'true');
                } catch (error) {
                  console.error('Error translating placeholder:', error);
                }
              }
            }
          }

          // Translate title attributes
          const titleElements = document.querySelectorAll('[title]');
          for (const element of titleElements) {
            if (isElementConnected(element) && !element.hasAttribute('data-title-translated')) {
              const title = element.getAttribute('title');
              if (title) {
                try {
                  const translatedTitle = await translate.translateText(title, targetLang);
                  safeSetAttribute(element, 'title', translatedTitle);
                  safeSetAttribute(element, 'data-title-translated', 'true');
                } catch (error) {
                  console.error('Error translating title:', error);
                }
              }
            }
          }
        } catch (error) {
          console.error('Error translating attributes:', error);
        }
      }, 400); // Increased delay

    } catch (error) {
      console.error('Error translating page content:', error);
      throw error;
    }
  }, []);

  const currentLanguage = INDIAN_LANGUAGES[currentLang as keyof typeof INDIAN_LANGUAGES] || INDIAN_LANGUAGES.en;

  // Group languages by category
  const groupedLanguages = React.useMemo(() => {
    if (searchTerm) {
      // If searching, show flat list
      return { 'Search Results': filteredLanguages };
    }
    
    const groups: { [key: string]: Array<[string, typeof INDIAN_LANGUAGES[keyof typeof INDIAN_LANGUAGES]]> } = {};
    Object.entries(INDIAN_LANGUAGES).forEach(([code, lang]) => {
      if (!groups[lang.category]) {
        groups[lang.category] = [];
      }
      groups[lang.category].push([code, lang]);
    });
    return groups;
  }, [filteredLanguages, searchTerm]);

  const handleReset = useCallback(() => {
    setTranslationError(null);
    setIsTranslating(false);
    setCurrentLang('en');
    i18n.changeLanguage('en');
    localStorage.setItem('preferred_lang', 'en');
    setTranslatedContent({});
    // Reload page to reset all translations
    window.location.reload();
  }, [i18n]);

  return (
    <>
      <LanguageChangeIndicator
        isTranslating={isTranslating}
        translationError={translationError}
        onReset={handleReset}
      />
      
      <div className="relative flex gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Globe className="w-4 h-4" />
          <span>{currentLanguage.nativeName}</span>
        </button>
        
        {currentLang !== 'en' && (
          <button
            onClick={handleManualTranslate}
            disabled={isTranslating}
            className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
            title="Manually translate entire page"
          >
            {isTranslating ? 'Translating...' : 'Translate'}
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50">
          {/* Search Bar */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('language.search') || 'Search languages...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Language List */}
          <div className="max-h-96 overflow-y-auto">
            {/* Auto-detect option */}
            <button
              onClick={() => handleLanguageChange(translate.detectLanguage())}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Globe className="w-5 h-5 text-gray-400" />
              <span className="flex-1 text-left text-sm text-gray-700 dark:text-gray-300">
                {t('language.auto') || 'Auto-detect'}
              </span>
            </button>

            <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

            {Object.entries(groupedLanguages).map(([category, languages]) => (
              <div key={category}>
                {!searchTerm && (
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-gray-700">
                    {category}
                  </div>
                )}
                {languages.map(([code, lang]) => (
                  <button
                    key={code}
                    onClick={() => handleLanguageChange(code)}
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {lang.nativeName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {lang.name}
                      </div>
                    </div>
                    {currentLang === code && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                  </button>
                ))}
              </div>
            ))}

            {Object.keys(groupedLanguages).length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                No languages found
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default LanguageSwitcher;
