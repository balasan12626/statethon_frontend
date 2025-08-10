import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'home.title': 'Find Your Perfect NCO Code',
      'home.subtitle': 'Classification of Occupation code for you.',
      'home.describeJob': 'Describe Your Job',
      'home.voiceInput': 'Voice Input',
      'home.listening': 'Listening...',
      'home.findCode': 'Find My NCO Code',
      'home.examples': 'Try these examples:',
      'home.placeholder': 'I install solar panels and fix inverters. I work with electrical systems and renewable energy equipment on rooftops and ground-mounted installations.',
      'stats.occupations': 'Occupation Codes',
      'stats.sectors': 'Industry Sectors',
      'stats.accuracy': 'Accuracy Rate',
      'stats.searches': 'Daily Searches',
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.contact': 'Contact',
      'nav.logo': 'Indian NCO',
      'nav.subtitle': 'National Career Service',
    }
  },
  hi: {
    translation: {
      'home.title': 'अपना सही NCO कोड खोजें',
      'home.subtitle': 'आपके लिए व्यवसाय वर्गीकरण कोड।',
      'home.describeJob': 'अपनी नौकरी का वर्णन करें',
      'home.voiceInput': 'आवाज इनपुट',
      'home.listening': 'सुन रहा है...',
      'home.findCode': 'मेरा NCO कोड खोजें',
      'home.examples': 'इन उदाहरणों को आज़माएं:',
      'home.placeholder': 'मैं सोलर पैनल लगाता हूं और इन्वर्टर ठीक करता हूं। मैं छत और जमीन पर लगे इंस्टॉलेशन में विद्युत प्रणालियों और नवीकरणीय ऊर्जा उपकरणों के साथ काम करता हूं।',
      'stats.occupations': 'व्यवसाय कोड',
      'stats.sectors': 'उद्योग क्षेत्र',
      'stats.accuracy': 'सटीकता दर',
      'stats.searches': 'दैनिक खोज',
      'nav.home': 'होम',
      'nav.about': 'के बारे में',
      'nav.contact': 'संपर्क',
      'nav.logo': 'भारतीय NCO',
      'nav.subtitle': 'राष्ट्रीय कैरियर सेवा',
    }
  },
  bn: {
    translation: {
      'home.title': 'আপনার নিখুঁত NCO কোড খুঁজুন',
      'home.subtitle': 'আপনার জন্য পেশা শ্রেণীবিভাগ কোড।',
      'home.describeJob': 'আপনার চাকরির বর্ণনা দিন',
      'home.voiceInput': 'ভয়েস ইনপুট',
      'home.listening': 'শুনছে...',
      'home.findCode': 'আমার NCO কোড খুঁজুন',
      'home.examples': 'এই উদাহরণগুলি চেষ্টা করুন:',
      'home.placeholder': 'আমি সোলার প্যানেল ইনস্টল করি এবং ইনভার্টার ঠিক করি। আমি ছাদ এবং মাটিতে ইনস্টল করা সিস্টেমে বৈদ্যুতিক সিস্টেম এবং নবায়নযোগ্য শক্তি সরঞ্জাম নিয়ে কাজ করি।',
      'stats.occupations': 'পেশা কোড',
      'stats.sectors': 'শিল্প খাত',
      'stats.accuracy': 'সঠিকতার হার',
      'stats.searches': 'দৈনিক অনুসন্ধান',
      'nav.home': 'হোম',
      'nav.about': 'সম্পর্কে',
      'nav.contact': 'যোগাযোগ',
      'nav.logo': 'ভারতীয় NCO',
      'nav.subtitle': 'জাতীয় ক্যারিয়ার সেবা',
    }
  },
  ta: {
    translation: {
      'home.title': 'உங்கள் சரியான NCO கோடைக் கண்டறியவும்',
      'home.subtitle': 'உங்களுக்கான தொழில் வகைப்பாட்டு கோடு.',
      'home.describeJob': 'உங்கள் வேலையை விவரிக்கவும்',
      'home.voiceInput': 'குரல் உள்ளீடு',
      'home.listening': 'கேட்கிறது...',
      'home.findCode': 'எனது NCO கோடைக் கண்டறியவும்',
      'home.examples': 'இந்த எடுத்துக்காட்டுகளை முயற்சிக்கவும்:',
      'home.placeholder': 'நான் சோலார் பேனல்களை நிறுவுகிறேன் மற்றும் இன்வர்டர்களை சரிசெய்கிறேன். நான் கூரைகள் மற்றும் தரையில் நிறுவப்பட்ட நிறுவல்களில் மின் அமைப்புகள் மற்றும் புதுப்பிக்கக்கூடிய ஆற்றல் உபகரணங்களுடன் வேலை செய்கிறேன்.',
      'stats.occupations': 'தொழில் கோடுகள்',
      'stats.sectors': 'தொழில் துறைகள்',
      'stats.accuracy': 'துல்லிய விகிதம்',
      'stats.searches': 'தினசரி தேடல்கள்',
      'nav.home': 'முகப்பு',
      'nav.about': 'பற்றி',
      'nav.contact': 'தொடர்பு',
      'nav.logo': 'இந்திய NCO',
      'nav.subtitle': 'தேசிய வேலைவாய்ப்பு சேவை',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;