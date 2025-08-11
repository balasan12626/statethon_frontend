import i18next from 'i18next';

// Translation provider interface removed

// Google Translate helper with proper error handling
const googleTranslate = {
  getElement: () => document.querySelector('.goog-te-combo') as HTMLSelectElement,
  
  setLanguage: (langCode: string) => {
    try {
      const combo = googleTranslate.getElement();
      if (!combo) {
        console.log('Google Translate combo not found, skipping setLanguage');
        return;
      }
      
      if (combo.value !== langCode) {
        combo.value = langCode;
        combo.dispatchEvent(new Event('change'));
      }
      localStorage.setItem('preferred_lang', langCode);
    } catch (error) {
      console.log('Google Translate setLanguage failed:', error);
      // Don't throw error, just log it
    }
  },

  getCurrentLanguage: () => {
    try {
      const combo = googleTranslate.getElement();
      return combo?.value || 'en';
    } catch (error) {
      console.log('Google Translate getCurrentLanguage failed:', error);
      return 'en';
    }
  },

  restoreLanguage: () => {
    try {
      const saved = localStorage.getItem('preferred_lang');
      if (saved) googleTranslate.setLanguage(saved);
    } catch (error) {
      console.log('Google Translate restoreLanguage failed:', error);
    }
  },

  isAvailable: () => {
    try {
      return !!googleTranslate.getElement();
    } catch (error) {
      return false;
    }
  }
};

// Complete Indian Languages Configuration
export const INDIAN_LANGUAGES = {
  // Constitutional Languages (22 Scheduled Languages)
  en: { name: 'English', nativeName: 'English', category: 'International' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', category: 'Constitutional' },
  as: { name: 'Assamese', nativeName: 'অসমীয়া', category: 'Constitutional' },
  bn: { name: 'Bengali', nativeName: 'বাংলা', category: 'Constitutional' },
  bh: { name: 'Bhojpuri', nativeName: 'भोजपुरी', category: 'Constitutional' },
  bo: { name: 'Bodo', nativeName: 'बड़ो', category: 'Constitutional' },
  dg: { name: 'Dogri', nativeName: 'डोगरी', category: 'Constitutional' },
  gu: { name: 'Gujarati', nativeName: 'ગુજરાતી', category: 'Constitutional' },
  kn: { name: 'Kannada', nativeName: 'ಕನ್ನಡ', category: 'Constitutional' },
  ks: { name: 'Kashmiri', nativeName: 'کٲشُر', category: 'Constitutional' },
  gom: { name: 'Konkani', nativeName: 'कोंकणी', category: 'Constitutional' },
  mai: { name: 'Maithili', nativeName: 'मैथिली', category: 'Constitutional' },
  ml: { name: 'Malayalam', nativeName: 'മലയാളം', category: 'Constitutional' },
  mni: { name: 'Manipuri', nativeName: 'মৈতৈলোন্', category: 'Constitutional' },
  mr: { name: 'Marathi', nativeName: 'मराठी', category: 'Constitutional' },
  ne: { name: 'Nepali', nativeName: 'नेपाली', category: 'Constitutional' },
  or: { name: 'Odia', nativeName: 'ଓଡ଼ିଆ', category: 'Constitutional' },
  pa: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', category: 'Constitutional' },
  sa: { name: 'Sanskrit', nativeName: 'संस्कृतम्', category: 'Constitutional' },
  sat: { name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', category: 'Constitutional' },
  sd: { name: 'Sindhi', nativeName: 'سنڌي', category: 'Constitutional' },
  ta: { name: 'Tamil', nativeName: 'தமிழ்', category: 'Constitutional' },
  te: { name: 'Telugu', nativeName: 'తెలుగు', category: 'Constitutional' },
  ur: { name: 'Urdu', nativeName: 'اردو', category: 'Constitutional' },
  
  // Other Major Indian Languages
  kok: { name: 'Konkani', nativeName: 'कोंकणी', category: 'Regional' },
  brx: { name: 'Bodo', nativeName: 'बड़ो', category: 'Regional' },
  'mni-Mtei': { name: 'Meitei (Manipuri)', nativeName: 'মৈতৈলোন্', category: 'Regional' },
  lus: { name: 'Mizo', nativeName: 'Mizo', category: 'Regional' },
  grt: { name: 'Garo', nativeName: 'Garo', category: 'Regional' },
  kha: { name: 'Khasi', nativeName: 'Khasi', category: 'Regional' },
  njo: { name: 'Ao', nativeName: 'Ao', category: 'Regional' },
  njz: { name: 'Nyishi', nativeName: 'Nyishi', category: 'Regional' },
  anp: { name: 'Angika', nativeName: 'अंगिका', category: 'Regional' },
  bfy: { name: 'Bagheli', nativeName: 'बघेली', category: 'Regional' },
  bho: { name: 'Bhojpuri', nativeName: 'भोजपुरी', category: 'Regional' },
  mag: { name: 'Magahi', nativeName: 'मगही', category: 'Regional' },
  new: { name: 'Newari', nativeName: 'नेपाल भाषा', category: 'Regional' },
  raj: { name: 'Rajasthani', nativeName: 'राजस्थानी', category: 'Regional' },
  tcy: { name: 'Tulu', nativeName: 'ತುಳು', category: 'Regional' },
  
  // Script Variants
  'hi-Latn': { name: 'Hindi (Latin)', nativeName: 'Hindi', category: 'Script Variant' },
  'ur-Latn': { name: 'Urdu (Latin)', nativeName: 'Urdu', category: 'Script Variant' },
  'pa-Arab': { name: 'Punjabi (Arabic)', nativeName: 'پنجابی', category: 'Script Variant' },
  'pa-Guru': { name: 'Punjabi (Gurmukhi)', nativeName: 'ਪੰਜਾਬੀ', category: 'Script Variant' },
  'ks-Arab': { name: 'Kashmiri (Arabic)', nativeName: 'کٲشُر', category: 'Script Variant' },
  'ks-Deva': { name: 'Kashmiri (Devanagari)', nativeName: 'कॉशुर', category: 'Script Variant' },
  wbq: { name: 'Waddar', nativeName: 'Waddar', category: 'Regional' }
};

// Translation API interface
interface TranslationRequest {
  html_content: string;
  target_lang: string;
}

interface TranslationResponse {
  translated_html: string;
  target_language: string;
  target_language_code: string;
  translation_count: number;
  status: string;
  message: string;
}

// Translation API helper
const translationAPI = {
  async translatePage(htmlContent: string, targetLang: string): Promise<TranslationResponse> {
    try {
      const response = await fetch('/translate/translate-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          html_content: htmlContent,
          target_lang: targetLang
        } as TranslationRequest)
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status} ${response.statusText}`);
      }

      const data: TranslationResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Translation API error:', error);
      throw error;
    }
  },

  async translateText(text: string, targetLang: string): Promise<string> {
    try {
      const response = await this.translatePage(`<p>${text}</p>`, targetLang);
      // Extract text from translated HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = response.translated_html;
      return tempDiv.textContent || tempDiv.innerText || text;
    } catch (error) {
      console.error('Text translation error:', error);
      return text; // Return original text if translation fails
    }
  }
};

// Auto-detect user's preferred language
export function detectUserLanguage(): string {
  // Check localStorage first
  const saved = localStorage.getItem('preferred_lang');
  if (saved && INDIAN_LANGUAGES[saved as keyof typeof INDIAN_LANGUAGES]) {
    return saved;
  }

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
  const detectedLang = detectUserLanguage();
  
  // Initialize i18next
  i18next.init({
    lng: detectedLang,
    fallbackLng: 'en',
    debug: false,
    resources: {
      en: { translation: {} },
      hi: { translation: {} },
      // Add other languages as needed
    }
  });

  // Restore Google Translate language
  googleTranslate.restoreLanguage();
}

// Change language across all translation systems
export function changeLanguage(langCode: string) {
  try {
    // Update i18next
    i18next.changeLanguage(langCode);
    
    // Update Google Translate only if available
    if (googleTranslate.isAvailable()) {
      googleTranslate.setLanguage(langCode);
    }
    
    // Store preference
    localStorage.setItem('preferred_lang', langCode);
  } catch (error) {
    console.log('Error in changeLanguage:', error);
    // Still update i18next and localStorage even if Google Translate fails
    i18next.changeLanguage(langCode);
    localStorage.setItem('preferred_lang', langCode);
  }
}

// Get language by category
export function getLanguagesByCategory() {
  const categories: { [key: string]: Array<{ code: string; name: string; nativeName: string }> } = {};
  
  Object.entries(INDIAN_LANGUAGES).forEach(([code, lang]) => {
    if (!categories[lang.category]) {
      categories[lang.category] = [];
    }
    categories[lang.category].push({
      code,
      name: lang.name,
      nativeName: lang.nativeName
    });
  });
  
  return categories;
}

export default {
  initialize: initializeTranslation,
  changeLanguage,
  detectLanguage: detectUserLanguage,
  INDIAN_LANGUAGES,
  getCurrentLanguage: googleTranslate.getCurrentLanguage,
  setLanguage: googleTranslate.setLanguage,
  translatePage: translationAPI.translatePage.bind(translationAPI),
  translateText: translationAPI.translateText.bind(translationAPI),
  getLanguagesByCategory
};
