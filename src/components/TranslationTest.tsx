import React, { useState } from 'react';
import translate from '../utils/translate';

const TranslationTest: React.FC = () => {
  const [testText, setTestText] = useState('Hello World');
  const [targetLang, setTargetLang] = useState('hi');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState('');

  const handleTranslate = async () => {
    setIsTranslating(true);
    setError('');
    
    try {
      const result = await translate.translateText(testText, targetLang);
      setTranslatedText(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTranslatePage = async () => {
    setIsTranslating(true);
    setError('');
    
    try {
      const htmlContent = `
        <div>
          <h1>${testText}</h1>
          <p>This is a test paragraph for translation.</p>
          <button>Click me</button>
        </div>
      `;
      
      const result = await translate.translatePage(htmlContent, targetLang);
      setTranslatedText(result.translated_html);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Translation API Test
      </h2>
      
      <div className="space-y-4">
        {/* Input Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Text to Translate:
          </label>
          <textarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            rows={3}
          />
        </div>

        {/* Language Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Target Language:
          </label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {Object.entries(translate.INDIAN_LANGUAGES).map(([code, lang]) => (
              <option key={code} value={code}>
                {lang.nativeName} ({lang.name})
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleTranslate}
            disabled={isTranslating}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isTranslating ? 'Translating...' : 'Translate Text'}
          </button>
          
          <button
            onClick={handleTranslatePage}
            disabled={isTranslating}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isTranslating ? 'Translating...' : 'Translate HTML Page'}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-md">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Result Display */}
        {translatedText && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Translated Result:
            </label>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
              <div 
                className="text-gray-900 dark:text-white"
                dangerouslySetInnerHTML={{ __html: translatedText }}
              />
            </div>
          </div>
        )}

        {/* API Status */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">API Information:</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <li>• Endpoint: <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">/translate/translate-page</code></li>
            <li>• Backend: <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">localhost:8000</code></li>
            <li>• Available Languages: {Object.keys(translate.INDIAN_LANGUAGES).length}</li>
            <li>• Current Language: {translate.getCurrentLanguage()}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TranslationTest;
