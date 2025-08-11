import React, { useState } from 'react';

interface TranslationResponse {
  translated_html: string;
  target_language: string;
  target_language_code: string;
  translation_count: number;
  status: string;
  message: string;
}

const PageTranslator: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('hi');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Extended language options for comprehensive translation
  const languages = [
    { code: 'hi', name: 'Hindi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'bn', name: 'Bengali' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'mr', name: 'Marathi' },
    { code: 'kn', name: 'Kannada' },
    { code: 'or', name: 'Odia' },
    { code: 'as', name: 'Assamese' },
    { code: 'ur', name: 'Urdu' },
    { code: 'ne', name: 'Nepali' },
    { code: 'si', name: 'Sinhala' }
  ];

  const translatePage = async () => {
    if (isTranslating) return;

    setIsTranslating(true);
    setError('');

    try {
      // Method 1: Try FastAPI backend first
      try {
        const response = await fetch('http://localhost:8000/translate-page', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            html_content: document.body.innerHTML,
            target_lang: selectedLanguage
          })
        });

        if (response.ok) {
          const data: TranslationResponse = await response.json();
          if (data.status === 'success') {
            document.body.innerHTML = data.translated_html;
            console.log(`Successfully translated ${data.translation_count} elements to ${data.target_language}`);
            return;
          }
        }
      } catch (backendError) {
        console.log('FastAPI backend not available, trying alternative methods...');
      }

      // Method 2: Try alternative translation service
      console.log('FastAPI backend not available, trying client-side translation...');

      // Method 3: Client-side translation using Web APIs
      if ('translate' in document.documentElement.dataset || navigator.language) {
        // Use browser's built-in translation or manual element translation
        const elements = document.querySelectorAll('h1, h2, h3, p, span, div, button, a, label');
        let translatedCount = 0;
        
        for (const element of elements) {
          if (element.textContent && element.textContent.trim()) {
            try {
              // Simple translation using a basic service
              const translatedText = await translateText(element.textContent, selectedLanguage);
              if (translatedText && translatedText !== element.textContent) {
                element.textContent = translatedText;
                translatedCount++;
              }
            } catch (textError) {
              console.log('Text translation failed for element:', element);
            }
          }
        }
        
        if (translatedCount > 0) {
          console.log(`Translated ${translatedCount} elements using client-side translation`);
          return;
        }
      }

      // Method 4: Fallback - Show language selection
      throw new Error(`Translation service not available. Please ensure your FastAPI backend is running at localhost:8000`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Translation failed';
      setError(errorMessage);
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  // Helper function for client-side translation
  const translateText = async (text: string, targetLang: string): Promise<string> => {
    try {
      // Try using a free translation service
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`);
      const data = await response.json();
      
      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        return data.responseData.translatedText;
      }
    } catch (error) {
      console.log('MyMemory translation failed:', error);
    }
    
    return text; // Return original text if translation fails
  };

  const resetToEnglish = () => {
    window.location.reload();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError('');
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes fadeIn {
            0% { opacity: 0; transform: scale(0.9); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes slideUp {
            0% { transform: translateY(50px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>

      {/* Floating Translate Button */}
      <button
        onClick={openModal}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          backgroundColor: '#2563eb',
          color: '#ffffff',
          border: 'none',
          borderRadius: '50%',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 8px 25px rgba(37, 99, 235, 0.3)',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#1d4ed8';
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 12px 35px rgba(37, 99, 235, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#2563eb';
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.3)';
        }}
        title="Open Page Translator"
      >
        🌐
      </button>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.3s ease-out'
          }}
          onClick={closeModal}
        >
          {/* Modal Content */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
              minWidth: '400px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
              animation: 'slideUp 0.3s ease-out',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#6b7280',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#6b7280';
              }}
            >
              ✕
            </button>

            <h2 style={{
              margin: '0 0 24px 0',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1a202c',
              textAlign: 'center'
            }}>
              🌐 Page Translator
            </h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#4a5568'
              }}>
                Select Language:
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                disabled={isTranslating}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  backgroundColor: isTranslating ? '#f7fafc' : '#ffffff',
                  cursor: isTranslating ? 'not-allowed' : 'pointer',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#2563eb';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                translatePage();
                setTimeout(() => {
                  if (!isTranslating) closeModal();
                }, 2000);
              }}
              disabled={isTranslating}
              style={{
                width: '100%',
                padding: '16px 20px',
                backgroundColor: isTranslating ? '#9ca3af' : '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isTranslating ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isTranslating ? 'none' : '0 4px 12px rgba(37, 99, 235, 0.3)',
                transform: isTranslating ? 'scale(0.98)' : 'scale(1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '16px'
              }}
              onMouseEnter={(e) => {
                if (!isTranslating) {
                  e.currentTarget.style.backgroundColor = '#1d4ed8';
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isTranslating) {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                }
              }}
            >
              {isTranslating ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Translating...
                </>
              ) : (
                <>
                  🌐 Translate Page
                </>
              )}
            </button>

            <button
              onClick={resetToEnglish}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#6b7280',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginBottom: '16px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#4b5563';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#6b7280';
              }}
            >
              🔄 Reset to English
            </button>

            {error && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#fed7d7',
                border: '1px solid #feb2b2',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#c53030',
                textAlign: 'center'
              }}>
                Error: {error}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PageTranslator;
