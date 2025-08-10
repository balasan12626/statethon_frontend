import i18next from 'i18next';

// Interface for translation providers
interface TranslationProvider {
  translate: (text: string, from: string, to: string) => Promise<string>;
  detectLanguage?: (text: string) => Promise<string>;
}

// Google Translate helper
const googleTranslate = {
  getElement: () => document.querySelector('.goog-te-combo') as HTMLSelectElement,
  
  setLanguage: (langCode: string) => {
    const combo = googleTranslate.getElement();
    if (!combo) return;
    
    if (combo.value !== langCode) {
      combo.value = langCode;
      combo.dispatchEvent(new Event('change'));
    }
    localStorage.setItem('preferred_lang', langCode);
  },

  getCurrentLanguage: () => {
    const combo = googleTranslate.getElement();
    return combo?.value || 'en';
  },

  restoreLanguage: () => {
    const saved = localStorage.getItem('preferred_lang');
    if (saved) googleTranslate.setLanguage(saved);
  }
};

// Language codes for major Indian languages
export const INDIAN_LANGUAGES = {
  en: { name: 'English', nativeName: 'English' },
  hi: { name: 'Hindi', nativeName: 'हिंदी' },
  bn: { name: 'Bengali', nativeName: 'বাংলা' },
  te: { name: 'Telugu', nativeName: 'తెలుగు' },
  ta: { name: 'Tamil', nativeName: 'தமிழ்' },
  mr: { name: 'Marathi', nativeName: 'मराठी' },
  ur: { name: 'Urdu', nativeName: 'اردو' },
  gu: { name: 'Gujarati', nativeName: 'ગુજરાતી' },
  kn: { name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  ml: { name: 'Malayalam', nativeName: 'മലയാളം' },
  pa: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  or: { name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  as: { name: 'Assamese', nativeName: 'অসমীয়া' },
  sa: { name: 'Sanskrit', nativeName: 'संस्कृतम्' }
};

// Auto-detect user's preferred language
export function detectUserLanguage(): string {
  // Check localStorage first
  const saved = localStorage.getItem('preferred_lang');
  if (saved) return saved;

  // Check browser language
  const browserLang = navigator.language.split('-')[0];
  if (INDIAN_LANGUAGES[browserLang as keyof typeof INDIAN_LANGUAGES]) {
    return browserLang;
  }

  // Default to English
  return 'en';
}

// Initialize translation system
export function initializeTranslation() {
  // Set up i18next for static content
  const userLang = detectUserLanguage();
  i18next.changeLanguage(userLang);
  
  // Set up Google Translate for dynamic content
  window.addEventListener('load', () => {
    setTimeout(() => {
      googleTranslate.restoreLanguage();
    }, 1000);
  });
}

// Change language across all translation systems
export function changeLanguage(langCode: string) {
  // Update i18next
  i18next.changeLanguage(langCode);
  
  // Update Google Translate
  googleTranslate.setLanguage(langCode);
  
  // Store preference
  localStorage.setItem('preferred_lang', langCode);
}

export default {
  initialize: initializeTranslation,
  changeLanguage,
  detectLanguage: detectUserLanguage,
  INDIAN_LANGUAGES,
  getCurrentLanguage: googleTranslate.getCurrentLanguage
};
