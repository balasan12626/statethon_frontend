
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './contexts/ThemeContext';
import { BackendStatusProvider } from './contexts/BackendStatusContext';
import ErrorBoundary from './components/ErrorBoundary';
import './i18n';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingChatbot from './components/FloatingChatbot';
import ComprehensiveTranslationService from './components/ComprehensiveTranslationService';
import PageTranslator from './components/PageTranslator';
import { SEO } from './components/SEO';
import { AboutSEO } from './components/AboutSEO';
import { ContactSEO } from './components/ContactSEO';
import { BreadcrumbNavigation } from './components/BreadcrumbNavigation';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import TranslationTestPage from './pages/TranslationTestPage';
import AccuracyScoreTest from './components/AccuracyScoreTest';

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          <BackendStatusProvider>
            <ComprehensiveTranslationService>
              <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                  <SEO />
                  <Navbar />
                  <BreadcrumbNavigation />
                  <main>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<>
                        <AboutSEO />
                        <About />
                      </>} />
                      <Route path="/contact" element={<>
                        <ContactSEO />
                        <Contact />
                      </>} />
                      <Route path="/test-translation" element={<TranslationTestPage />} />
                      <Route path="/test-accuracy" element={<AccuracyScoreTest />} />
                    </Routes>
                  </main>
                  <Footer />
                  <FloatingChatbot />
                  <PageTranslator />
                </div>
              </Router>
            </ComprehensiveTranslationService>
          </BackendStatusProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;