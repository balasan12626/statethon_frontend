import React, { useState, useEffect, useCallback } from 'react';
import translate from '../utils/translate';
import { 
  getTranslatableElements, 
  safeSetTextContent, 
  safeSetAttribute, 
  batchProcessElements,
  isElementConnected 
} from '../utils/domUtils';

interface ComprehensiveTranslationServiceProps {
  children: React.ReactNode;
}

const ComprehensiveTranslationService: React.FC<ComprehensiveTranslationServiceProps> = ({ children }) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(translate.detectLanguage());

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      try {
        const newLang = translate.getCurrentLanguage();
        if (newLang !== currentLanguage) {
          setCurrentLanguage(newLang);
          if (newLang !== 'en') {
            translateEntirePage(newLang);
          }
        }
      } catch (error) {
        console.log('Error in language change handler:', error);
      }
    };

    // Check for language changes every 2 seconds
    const interval = setInterval(handleLanguageChange, 2000);
    return () => clearInterval(interval);
  }, [currentLanguage]);

  // Initialize translation system on mount
  useEffect(() => {
    try {
      // Initialize the translation system
      translate.initialize();
      
      // Set up Google Translate if available
      const setupGoogleTranslate = () => {
        try {
          if (typeof window !== 'undefined' && window.google && window.google.translate) {
            // Google Translate is available
            console.log('Google Translate is available');
          } else {
            console.log('Google Translate not available, using API translation only');
          }
        } catch (error) {
          console.log('Error setting up Google Translate:', error);
        }
      };

      // Try to set up Google Translate after a delay
      setTimeout(setupGoogleTranslate, 1000);
    } catch (error) {
      console.log('Error initializing translation system:', error);
    }
  }, []);

  const translateEntirePage = useCallback(async (targetLang: string) => {
    if (targetLang === 'en') {
      // Reset to original content for English
      window.location.reload();
      return;
    }

    setIsTranslating(true);
    
    try {
      console.log('Starting comprehensive page translation to:', targetLang);
      
      // Use safe DOM utilities to get translatable elements
      const translatableElements = getTranslatableElements();
      const elementTexts: string[] = [];
      
      translatableElements.forEach((element) => {
        const text = element.textContent?.trim();
        if (text && text.length > 0 && text.length < 500) {
          elementTexts.push(text);
        }
      });

      console.log(`Found ${translatableElements.length} elements to translate`);

      if (translatableElements.length === 0) {
        setIsTranslating(false);
        return;
      }

      // Translate in batches using safe DOM utilities
      const batchSize = 15; // Reduced batch size
      const batches = [];
      
      for (let i = 0; i < translatableElements.length; i += batchSize) {
        const batch = translatableElements.slice(i, i + batchSize);
        const batchTexts = elementTexts.slice(i, i + batchSize);
        
        const htmlContent = batchTexts.map((text, index) => 
          `<div data-translate-index="${i + index}">${text}</div>`
        ).join('');

        batches.push({ htmlContent, elements: batch, startIndex: i });
      }

      // Process batches with safe DOM utilities
      await batchProcessElements(batches, 1, async (batchArray) => {
        for (const batch of batchArray) {
          try {
            const response = await translate.translatePage(batch.htmlContent, targetLang);
            
            if (response.status === 'success') {
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = response.translated_html;
              
              batch.elements.forEach((element, batchIndex) => {
                const globalIndex = batch.startIndex + batchIndex;
                const translatedElement = tempDiv.querySelector(`[data-translate-index="${globalIndex}"]`);
                if (translatedElement && isElementConnected(element) && element.textContent !== translatedElement.textContent) {
                  safeSetTextContent(element, translatedElement.textContent || '');
                  safeSetAttribute(element, 'data-translated', 'true');
                }
              });
            }
          } catch (error) {
            console.error('Error translating batch:', error);
          }
        }
      }, 150); // Increased delay between batches

      // Translate attributes
      await translateAttributes(targetLang);
      
      console.log('Comprehensive page translation completed');
      
    } catch (error) {
      console.error('Error in comprehensive translation:', error);
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const translateAttributes = useCallback(async (targetLang: string) => {
    try {
      // Translate placeholders
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

      // Translate alt attributes
      const altElements = document.querySelectorAll('img[alt]');
      for (const element of altElements) {
        if (isElementConnected(element) && !element.hasAttribute('data-alt-translated')) {
          const alt = element.getAttribute('alt');
          if (alt) {
            try {
              const translatedAlt = await translate.translateText(alt, targetLang);
              safeSetAttribute(element, 'alt', translatedAlt);
              safeSetAttribute(element, 'data-alt-translated', 'true');
            } catch (error) {
              console.error('Error translating alt:', error);
            }
          }
        }
      }

      // Translate aria-label attributes
      const ariaElements = document.querySelectorAll('[aria-label]');
      for (const element of ariaElements) {
        if (isElementConnected(element) && !element.hasAttribute('data-aria-translated')) {
          const ariaLabel = element.getAttribute('aria-label');
          if (ariaLabel) {
            try {
              const translatedAriaLabel = await translate.translateText(ariaLabel, targetLang);
              safeSetAttribute(element, 'aria-label', translatedAriaLabel);
              safeSetAttribute(element, 'data-aria-translated', 'true');
            } catch (error) {
              console.error('Error translating aria-label:', error);
            }
          }
        }
      }

    } catch (error) {
      console.error('Error translating attributes:', error);
    }
  }, []);

  // Show translation status
  if (isTranslating) {
    return (
      <>
        {children}
        <div className="fixed top-4 right-4 z-50 bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <div>
              <div className="font-medium">Translating Entire Page...</div>
              <div className="text-sm text-blue-100">
                {translate.INDIAN_LANGUAGES[currentLanguage as keyof typeof translate.INDIAN_LANGUAGES]?.name || currentLanguage}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return <>{children}</>;
};

export default ComprehensiveTranslationService;
