import React, { useState, useEffect } from 'react';
import translate from '../utils/translate';

interface TranslationServiceProps {
  children: React.ReactNode;
}

interface TranslationState {
  isTranslating: boolean;
  translatedContent: string | null;
  error: string | null;
}

const TranslationService: React.FC<TranslationServiceProps> = ({ children }) => {
  const [translationState, setTranslationState] = useState<TranslationState>({
    isTranslating: false,
    translatedContent: null,
    error: null
  });

  const [currentLanguage, setCurrentLanguage] = useState(translate.detectLanguage());

  // Listen for language changes from other components
  useEffect(() => {
    const handleLanguageChange = () => {
      const newLang = translate.getCurrentLanguage();
      if (newLang !== currentLanguage) {
        setCurrentLanguage(newLang);
        // Don't auto-translate here - let the language selectors handle it
      }
    };

    // Check for language changes every 2 seconds (less frequent)
    const interval = setInterval(handleLanguageChange, 2000);
    return () => clearInterval(interval);
  }, [currentLanguage]);

  // Initialize translation system on mount
  useEffect(() => {
    // Initialize the translation system
    translate.initialize();
    
    // Set up Google Translate if available
    const setupGoogleTranslate = () => {
      if (typeof window !== 'undefined' && (window as any).google && (window as any).google.translate) {
        // Google Translate is available
        console.log('Google Translate is available');
      }
    };

    // Try to set up Google Translate after a delay
    setTimeout(setupGoogleTranslate, 1000);
  }, []);

  const resetTranslation = () => {
    setTranslationState({
      isTranslating: false,
      translatedContent: null,
      error: null
    });
    // Reload the page to reset to original content
    window.location.reload();
  };

  // Show translation status only if there's an error
  if (translationState.error) {
    return (
      <>
        {children}
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <span>Translation error: {translationState.error}</span>
            <button 
              onClick={resetTranslation}
              className="text-sm underline hover:no-underline"
            >
              Reset
            </button>
          </div>
        </div>
      </>
    );
  }

  return <>{children}</>;
};

export default TranslationService;
