
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './contexts/ThemeContext';
import { BackendStatusProvider } from './contexts/BackendStatusContext';
import './i18n';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingChatbot from './components/FloatingChatbot';
import { SEO } from './components/SEO';
import { AboutSEO } from './components/AboutSEO';
import { ContactSEO } from './components/ContactSEO';
import { BreadcrumbNavigation } from './components/BreadcrumbNavigation';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <BackendStatusProvider>
          <Router>
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
            </Routes>
          </main>
          <Footer />
          <FloatingChatbot />
        </div>
      </Router>
        </BackendStatusProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;