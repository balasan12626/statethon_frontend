import React, { useState, useMemo, useEffect } from 'react';
import { Globe, ChevronDown, Search, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import translate, { INDIAN_LANGUAGES, getLanguagesByCategory } from '../utils/translate';
import LanguageChangeIndicator from './LanguageChangeIndicator';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  // Update current language when i18n changes
  useEffect(() => {
    setCurrentLang(i18n.language);
  }, [i18n.language]);

  const currentLanguage = INDIAN_LANGUAGES[currentLang as keyof typeof INDIAN_LANGUAGES] || INDIAN_LANGUAGES.en;

  const filteredLanguages = useMemo(() => {
    if (!searchTerm) return INDIAN_LANGUAGES;
    
    return Object.entries(INDIAN_LANGUAGES).filter(([_code, lang]) => 
      lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleLanguageChange = async (languageCode: string) => {
    try {
      console.log('Changing language to:', languageCode);
      
      setIsTranslating(true);
      setTranslationError(null);
      
      // Update i18next
      await i18n.changeLanguage(languageCode);
      
      // Update Google Translate (will handle errors gracefully)
      try {
        translate.setLanguage(languageCode);
      } catch (error) {
        console.log('Google Translate setLanguage failed, continuing with other updates');
      }
      
      // Store preference
      localStorage.setItem('preferred_lang', languageCode);
      
      // Update current language state
      setCurrentLang(languageCode);
      
      // Trigger page translation if not English
      if (languageCode !== 'en') {
        await translatePageContent(languageCode);
      } else {
        // Reset to original content for English
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
  };

  const handleManualTranslate = async () => {
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
  };

  const translatePageContent = async (targetLang: string) => {
    try {
      console.log('Translating page content to:', targetLang);
      
      // Use a more selective approach to avoid React DOM conflicts
      const translatableElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, button, label, a, li, td, th, strong, em, b, i, small, caption, figcaption, blockquote, cite, abbr, acronym, time, mark, del, ins, sub, sup, code, pre, kbd, samp, var, dfn, address, article, aside, details, summary, nav, header, footer, main, section');
      const contentToTranslate: string[] = [];
      const elementMap: Map<number, Element> = new Map();
      
      translatableElements.forEach((element, index) => {
        // Skip React-managed elements and already translated elements
        if (element.hasAttribute('data-translated') || 
            element.closest('[data-reactroot]') || 
            element.classList.contains('react-component') ||
            element.getAttribute('data-translate-index')) {
          return;
        }
        
        const text = element.textContent?.trim();
        if (text && text.length > 0 && text.length < 1000) { // Avoid very long texts
          // Skip elements that contain only numbers/symbols
          if (!/^[\d\s\-\+\(\)\[\]\{\}\.\,\;\:\!\@\#\$\%\^\&\*]+$/.test(text)) {
            contentToTranslate.push(text);
            elementMap.set(index, element);
            element.setAttribute('data-translate-index', index.toString());
          }
        }
      });

      if (contentToTranslate.length === 0) {
        console.log('No content to translate found');
        return;
      }

      console.log(`Found ${contentToTranslate.length} elements to translate`);

      // Create HTML content for translation - batch in chunks to avoid API limits
      const batchSize = 30; // Reduced batch size to avoid DOM conflicts
      const batches = [];
      
      for (let i = 0; i < contentToTranslate.length; i += batchSize) {
        const batch = contentToTranslate.slice(i, i + batchSize);
        const htmlContent = batch.map((text, batchIndex) => 
          `<div data-translate-index="${i + batchIndex}">${text}</div>`
        ).join('');
        batches.push({ htmlContent, startIndex: i });
      }

      // Translate each batch with delay to avoid React conflicts
      for (const batch of batches) {
        try {
          const response = await translate.translatePage(batch.htmlContent, targetLang);
          
          if (response.status === 'success') {
            // Apply translated content with requestAnimationFrame to avoid React conflicts
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = response.translated_html;
            
            batch.htmlContent.split('<div data-translate-index="').forEach((part, partIndex) => {
              if (partIndex === 0) return; // Skip the first empty part
              
              const indexMatch = part.match(/^(\d+)">/);
              if (indexMatch) {
                const index = parseInt(indexMatch[1]);
                const element = elementMap.get(index);
                if (element) {
                  const translatedElement = tempDiv.querySelector(`[data-translate-index="${index}"]`);
                  if (translatedElement && element.textContent !== translatedElement.textContent) {
                    // Use requestAnimationFrame to avoid React DOM conflicts
                    requestAnimationFrame(() => {
                      try {
                        element.textContent = translatedElement.textContent;
                        element.setAttribute('data-translated', 'true');
                      } catch (error) {
                        console.log('Skipping element due to React conflict:', error);
                      }
                    });
                  }
                }
              }
            });
          }
          
          // Add small delay between batches to prevent DOM conflicts
          await new Promise(resolve => setTimeout(resolve, 50));
          
        } catch (error) {
          console.error('Error translating batch:', error);
        }
      }
      
      console.log('Page translation completed successfully');
      
      // Translate attributes with delay to avoid conflicts
      setTimeout(async () => {
        // Translate placeholder attributes
        const inputElements = document.querySelectorAll('input[placeholder], textarea[placeholder]');
        for (const element of inputElements) {
          const placeholder = element.getAttribute('placeholder');
          if (placeholder && !element.hasAttribute('data-placeholder-translated')) {
            try {
              const translatedPlaceholder = await translate.translateText(placeholder, targetLang);
              element.setAttribute('placeholder', translatedPlaceholder);
              element.setAttribute('data-placeholder-translated', 'true');
            } catch (error) {
              console.error('Error translating placeholder:', error);
            }
          }
        }

        // Translate title attributes
        const titleElements = document.querySelectorAll('[title]');
        for (const element of titleElements) {
          const title = element.getAttribute('title');
          if (title && !element.hasAttribute('data-title-translated')) {
            try {
              const translatedTitle = await translate.translateText(title, targetLang);
              element.setAttribute('title', translatedTitle);
              element.setAttribute('data-title-translated', 'true');
            } catch (error) {
              console.error('Error translating title:', error);
            }
          }
        }
      }, 200);

    } catch (error) {
      console.error('Error translating page content:', error);
      throw error;
    }
  };

  // Group languages by category
  const groupedLanguages = useMemo(() => {
    if (searchTerm) {
      // If searching, show flat list
      return { 'Search Results': filteredLanguages };
    }
    
    // Group by category
    const groups: { [key: string]: Array<[string, typeof INDIAN_LANGUAGES[keyof typeof INDIAN_LANGUAGES]]> } = {};
    Object.entries(INDIAN_LANGUAGES).forEach(([code, lang]) => {
      if (!groups[lang.category]) {
        groups[lang.category] = [];
      }
      groups[lang.category].push([code, lang]);
    });
    return groups;
  }, [filteredLanguages, searchTerm]);

  return (
    <>
      <LanguageChangeIndicator
        isTranslating={isTranslating}
        translationError={translationError}
        onReset={() => {
          setTranslationError(null);
          setIsTranslating(false);
          setCurrentLang('en');
          i18n.changeLanguage('en');
          localStorage.setItem('preferred_lang', 'en');
          // Reload page to reset all translations
          window.location.reload();
        }}
      />
      
      <div className="relative flex gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Globe className="w-4 h-4" />
          <span>{currentLanguage.nativeName}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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
                placeholder="Search languages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Language List */}
          <div className="max-h-96 overflow-y-auto">
            {Object.entries(groupedLanguages).map(([category, languages]: [string, any]) => (
              <div key={category}>
                {!searchTerm && (
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-gray-700">
                    {category}
                  </div>
                )}
                {languages.map(([code, lang]: [string, any]) => (
                  <button
                    key={code}
                    onClick={() => handleLanguageChange(code)}
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
              <div className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                No languages found
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default LanguageSelector; 