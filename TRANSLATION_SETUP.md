# Translation System Setup

This document explains the comprehensive translation system integrated into the Indian NCO frontend application.

## 🎯 Overview

The translation system supports **all Indian languages** including:
- **22 Constitutional Languages** (Scheduled Languages)
- **15 Regional Languages** 
- **7 Script Variants**
- **Total: 44+ Indian Languages**

## 🏗️ Architecture

```
Frontend (React) → TranslationService → Backend API (localhost:8000) → Google Translate
```

### Components:
1. **TranslationService** - Main translation orchestrator
2. **LanguageSelector** - UI for language selection
3. **LanguageSwitcher** - Alternative language switcher
4. **TranslationTest** - Testing component for API verification

## 🚀 Quick Start

### 1. Backend Setup
Ensure your translation backend is running on `localhost:8000` with the `/translate-page` endpoint:

```bash
# Your backend should be running on port 8000
# Endpoint: http://localhost:8000/translate-page
```

### 2. Frontend Setup
The frontend is already configured with:
- Vite proxy for `/translate` → `localhost:8000`
- Comprehensive language support
- Translation service integration

### 3. Test the System
1. Start your frontend: `npm run dev`
2. Navigate to the home page
3. Use the **Translation Test** component to verify API connectivity
4. Try different languages from the language selector

## 📋 Supported Languages

### Constitutional Languages (22)
| Code | Language | Native Script |
|------|----------|---------------|
| `en` | English | English |
| `hi` | Hindi | हिन्दी |
| `as` | Assamese | অসমীয়া |
| `bn` | Bengali | বাংলা |
| `bh` | Bhojpuri | भोजपुरी |
| `bo` | Bodo | बड़ो |
| `dg` | Dogri | डोगरी |
| `gu` | Gujarati | ગુજરાતી |
| `kn` | Kannada | ಕನ್ನಡ |
| `ks` | Kashmiri | کٲشُر |
| `gom` | Konkani | कोंकणी |
| `mai` | Maithili | मैथिली |
| `ml` | Malayalam | മലയാളം |
| `mni` | Manipuri | মৈতৈলোন্ |
| `mr` | Marathi | मराठी |
| `ne` | Nepali | नेपाली |
| `or` | Odia | ଓଡ଼ିଆ |
| `pa` | Punjabi | ਪੰਜਾਬੀ |
| `sa` | Sanskrit | संस्कृतम् |
| `sat` | Santali | ᱥᱟᱱᱛᱟᱲᱤ |
| `sd` | Sindhi | سنڌي |
| `ta` | Tamil | தமிழ் |
| `te` | Telugu | తెలుగు |
| `ur` | Urdu | اردو |

### Regional Languages (15)
| Code | Language | Region |
|------|----------|--------|
| `kok` | Konkani | Goa, Karnataka |
| `brx` | Bodo | Assam |
| `mni-Mtei` | Meitei (Manipuri) | Manipur |
| `lus` | Mizo | Mizoram |
| `grt` | Garo | Meghalaya |
| `kha` | Khasi | Meghalaya |
| `njo` | Ao | Nagaland |
| `njz` | Nyishi | Arunachal Pradesh |
| `anp` | Angika | Bihar, Jharkhand |
| `bfy` | Bagheli | Madhya Pradesh |
| `bho` | Bhojpuri | Bihar, UP |
| `mag` | Magahi | Bihar |
| `new` | Newari | Nepal (Indian communities) |
| `raj` | Rajasthani | Rajasthan |
| `tcy` | Tulu | Karnataka, Kerala |

### Script Variants (7)
| Code | Language | Script Type |
|------|----------|-------------|
| `hi-Latn` | Hindi | Latin script |
| `ur-Latn` | Urdu | Latin script |
| `pa-Arab` | Punjabi | Arabic script |
| `pa-Guru` | Punjabi | Gurmukhi script |
| `ks-Arab` | Kashmiri | Arabic script |
| `ks-Deva` | Kashmiri | Devanagari script |
| `wbq` | Waddar | Regional |

## 🔧 API Integration

### Backend Endpoint
```
POST http://localhost:8000/translate-page
```

### Request Format
```json
{
  "html_content": "<h1>Hello World</h1><p>Welcome to our website</p>",
  "target_lang": "hi"
}
```

### Response Format
```json
{
  "translated_html": "<h1>हैलो वर्ल्ड</h1><p>हमारी वेब साईट में स्वागत है</p>",
  "target_language": "Hindi",
  "target_language_code": "hi",
  "translation_count": 2,
  "status": "success",
  "message": "Successfully translated to Hindi"
}
```

## 🎨 UI Components

### LanguageSelector
- **Location**: Top navigation bar
- **Features**: 
  - Search functionality
  - Categorized language display
  - Native script support
  - Current language indicator

### LanguageSwitcher
- **Features**:
  - Auto-detect option
  - Comprehensive language list
  - Search and filter
  - Visual language indicators

### TranslationService
- **Purpose**: Orchestrates translation across the app
- **Features**:
  - Automatic language detection
  - Page content translation
  - Error handling
  - Loading states

## 🧪 Testing

### TranslationTest Component
Use the built-in test component to verify:

1. **API Connectivity**: Test connection to backend
2. **Text Translation**: Translate simple text
3. **HTML Translation**: Translate HTML content
4. **Language Support**: Test all supported languages

### Manual Testing Steps
1. Open the home page
2. Find the "Translation API Test" section
3. Enter test text
4. Select target language
5. Click "Translate Text" or "Translate HTML Page"
6. Verify results

## 🔄 Language Switching

### Automatic Detection
The system automatically detects:
1. **Browser Language**: Uses navigator.language
2. **Saved Preference**: Checks localStorage
3. **Fallback**: Defaults to English

### Manual Switching
Users can manually switch languages via:
1. **Language Selector**: In navigation bar
2. **Language Switcher**: Alternative component
3. **URL Parameters**: (Future enhancement)

## 🛠️ Configuration

### Vite Proxy Setup
```typescript
// vite.config.ts
server: {
  proxy: {
    '/translate': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      secure: false,
      timeout: 30000,
      proxyTimeout: 30000,
      rewrite: (path) => path.replace(/^\/translate/, '')
    }
  }
}
```

### Environment Variables
```env
# Optional: Override backend URL
VITE_TRANSLATION_API_URL=http://localhost:8000
```

## 🐛 Troubleshooting

### Common Issues

1. **Backend Not Running**
   - Error: "Translation API error: 404"
   - Solution: Start backend on port 8000

2. **CORS Issues**
   - Error: "CORS policy blocked"
   - Solution: Backend should allow CORS from frontend origin

3. **Language Not Supported**
   - Error: "Language not found"
   - Solution: Check if language code is in INDIAN_LANGUAGES

4. **Translation Fails**
   - Error: "Translation failed"
   - Solution: Check backend logs and API response

### Debug Mode
Enable debug logging:
```typescript
// In translate.ts
console.log('Translation request:', { htmlContent, targetLang });
console.log('Translation response:', response);
```

## 📈 Performance

### Optimization Tips
1. **Caching**: Implement translation caching
2. **Lazy Loading**: Load translations on demand
3. **Batch Requests**: Group translation requests
4. **Error Recovery**: Graceful fallback to original text

### Monitoring
- Translation success rate
- API response times
- Error frequency
- User language preferences

## 🔮 Future Enhancements

1. **Offline Support**: Cache translations locally
2. **Voice Translation**: Speech-to-text integration
3. **Real-time Translation**: Live content translation
4. **Custom Dictionaries**: Domain-specific translations
5. **Translation Memory**: Remember user preferences

## 📞 Support

For issues or questions:
1. Check the TranslationTest component
2. Review backend logs
3. Verify API endpoint configuration
4. Test with different languages

---

**Note**: This translation system is designed to work with Google Translate backend. Ensure your backend is properly configured to handle the translation requests.
