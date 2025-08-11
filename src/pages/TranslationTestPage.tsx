import React, { useState } from 'react';
import LanguageSelector from '../components/LanguageSelector';
import TranslationTest from '../components/TranslationTest';

const TranslationTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Translation System Test
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Test the comprehensive translation system with all Indian languages
          </p>
        </div>

        {/* Language Selector */}
        <div className="mb-8 flex justify-center">
          <LanguageSelector />
        </div>

        {/* Translation Test Component */}
        <div className="mb-8">
          <TranslationTest />
        </div>

        {/* Test Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Sample Content for Translation
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Job Description
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                I teach children in primary school. I help them learn reading, writing, and basic mathematics. 
                I also organize extracurricular activities and maintain student records.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Skills Required
              </h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                <li>Teaching experience</li>
                <li>Communication skills</li>
                <li>Patience and creativity</li>
                <li>Classroom management</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Benefits
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                This position offers competitive salary, health benefits, and opportunities for professional growth. 
                You will be part of a supportive team dedicated to student success.
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            How to Test Translation
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800 dark:text-blue-200">
            <li>Use the language selector above to choose a different language</li>
            <li>Watch for the translation indicator in the top-right corner</li>
            <li>Observe how the page content changes to the selected language</li>
            <li>Use the Translation Test component to test specific text translation</li>
            <li>Try switching back to English to reset the content</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TranslationTestPage;
