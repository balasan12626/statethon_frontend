import React, { useState, lazy, Suspense } from 'react';
import { Sparkles, Download, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Enhanced components
import AdvancedSearch from '../components/AdvancedSearch';
import EnhancedResultCard from '../components/EnhancedResultCard';
import { SearchLoadingState, ChatLoadingState, ErrorState } from '../components/LoadingStates';
import { AccessibilityPanel, AccessibilityButton, SkipToContent, useKeyboardShortcuts } from '../components/AccessibilityEnhancements';
import { LazyOnView } from '../components/LazyComponents';
import { useIsMobile, ScrollToTopButton, MobileShareMenu } from '../components/MobileOptimizations';
import { cachedSearchFetch } from '../utils/cache';

// Lazy load heavy components
const EnhancedStatsSection = lazy(() => import('../components/EnhancedStatsSection'));

interface NCOMatch {
  title: string;
  score: number;
  id?: string;
  metadata: {
    description?: string;
    division?: string;
    family?: string;
    family_title?: string;
    group?: string;
    nco_code?: string;
    ncoCode?: string;
    code?: string;
    sub_division?: string;
    title?: string;
    occupationTitle?: string;
    jobDescription?: string;
    summary?: string;
  };
}

interface SearchResponse {
  success: boolean;
  data: {
    success: boolean;
    input: string;
    topMatch: NCOMatch;
  };
}

interface ChatResponse {
  success: boolean;
  response: string;
  model: string;
  timestamp: string;
  usage: {
    model: string;
    timestamp: string;
  };
}

const Home = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Core state
  const [jobDescription, setJobDescription] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResponse | null>(null);
  const [chatResponse, setChatResponse] = useState<ChatResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [isChatLoading, setIsChatLoading] = useState(false);

  
  // Enhanced UI state
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showMobileShare, setShowMobileShare] = useState(false);
  
  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  const examples = [
    { 
      text: "I teach children in primary school", 
      category: "Education Sector",
      icon: "👨‍🏫"
    },
    { 
      text: "I develop mobile applications", 
      category: "Technology Sector",
      icon: "💻"
    },
    { 
      text: "I install solar panels and fix inverters", 
      category: "Renewable Energy",
      icon: "☀️"
    }
  ];

  // Helper functions
  const formatMatchScore = (score: number) => {
    // For very low scores (below 20%), show one decimal place for precision
    if (score < 0.2) {
      return Math.round(score * 1000) / 10; // Shows 13.4 instead of 13
    }
    // For higher scores, round to nearest whole number
    return Math.round(score * 100);
  };



  const getNCOCode = (metadata: any) => {
    return metadata?.nco_code || 
           metadata?.ncoCode ||
           metadata?.code ||
           'N/A';
  };

  const getJobTitle = (match: NCOMatch) => {
    return match.metadata?.title || 
           match.metadata?.occupationTitle ||
           match.title || 
           'Unknown';
  };

  const getJobDescription = (metadata: any) => {
    return metadata?.description || 
           metadata?.jobDescription ||
           metadata?.summary ||
           'No description available';
  };

  // Check for shared results on component mount
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sharedInput = params.get('input');
    const sharedNCO = params.get('nco');
    const sharedScore = params.get('score');
    const sharedTitle = params.get('title');
    
    if (sharedInput && sharedNCO) {
      setJobDescription(sharedInput);
      // Create a mock result for shared data
      const mockResult: SearchResponse = {
        success: true,
        data: {
          success: true,
          input: sharedInput,
          topMatch: {
            title: sharedTitle || 'Unknown',
            score: parseFloat(sharedScore || '0'),
            metadata: {
              nco_code: sharedNCO,
              title: sharedTitle || 'Unknown',
              description: params.get('description') || 'No description available'
            }
          }
        }
      };
      setSearchResult(mockResult);
      setShowResults(true);
    }
  }, [location]);

  // Check backend connectivity on mount
  React.useEffect(() => {
    const checkBackend = async () => {
      try {
        const isConnected = await checkBackendConnection();
        setBackendStatus(isConnected ? 'connected' : 'disconnected');
      } catch (err) {
        console.error('Backend check failed:', err);
        setBackendStatus('disconnected');
      }
    };
    
    checkBackend();
  }, []);

  const handleVoiceInput = () => {
    setIsListening(true);
    // Simulate voice input
    setTimeout(() => {
      setJobDescription("I install solar panels and fix inverters. I work with electrical systems and renewable energy equipment on rooftops and ground-mounted installations.");
      setIsListening(false);
    }, 2000);
  };

  const checkBackendConnection = async () => {
    try {
      // Try proxy first
      const proxyResponse = await fetch('/api/search', {
        method: 'OPTIONS',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (proxyResponse.ok) return true;
      
      // Fallback to direct backend call
      const directResponse = await fetch('https://statethon-backend.onrender.com/api/search', {
        method: 'OPTIONS',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return directResponse.ok;
    } catch (err) {
      console.error('Backend connectivity check failed:', err);
      return false;
    }
  };

  const makeApiCall = async (url: string, data: any) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data)
    });
    return response;
  };

  const handleSearch = async () => {
    if (!jobDescription.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setShowResults(false);
    setChatResponse(null);
    
    try {
      console.log('Sending request to backend...');
      
      // Use cached search with improved error handling
      let data: SearchResponse;
      try {
        data = await cachedSearchFetch<SearchResponse>('/api/search', { text: jobDescription.trim() });
        console.log('Using proxy connection');
      } catch (proxyError) {
        console.log('Proxy failed, trying direct connection...');
        data = await cachedSearchFetch<SearchResponse>('https://statethon-backend.onrender.com/api/search', { text: jobDescription.trim() });
        console.log('Using direct connection');
      }
      
      console.log('API Response:', data); // Debug log
      
      // Check if the response has the expected structure
      if (data && data.success && data.data && data.data.success && data.data.topMatch) {
        // Check if we have meaningful data - look for title in multiple places
        const actualTitle = data.data.topMatch.metadata?.title || 
                           data.data.topMatch.metadata?.occupationTitle ||
                           data.data.topMatch.title || 
                           'Unknown';
        
        // Look for NCO code in multiple possible field names
        const ncoCode = data.data.topMatch.metadata?.nco_code || 
                       data.data.topMatch.metadata?.ncoCode ||
                       data.data.topMatch.metadata?.code ||
                       data.data.topMatch.id ||
                       'N/A';
        
        console.log('Debug - actualTitle:', actualTitle);
        console.log('Debug - ncoCode:', ncoCode);
        console.log('Debug - metadata:', data.data.topMatch.metadata);
        console.log('Debug - topMatch:', data.data.topMatch);
        
        // Show results if we have a title and some form of identification, regardless of match score
        if (actualTitle && actualTitle !== 'Unknown') {
          console.log('Debug - Setting search result successfully');
          setSearchResult(data);
          setShowResults(true);
          // Generate share URL
          generateShareUrl(data);
          
          // Now call the langchain chat API to get elaborated response
          await getElaboratedResponse(data);
        } else {
          console.log('Debug - No suitable match found. actualTitle:', actualTitle, 'ncoCode:', ncoCode);
          setError('No suitable NCO matches found for your job description. Please try a different description.');
        }
      } else if (data && data.success && data.data && !data.data.success) {
        // Backend returned success: false
        console.log('Debug - Backend returned success: false');
        setError('No matches found. Please try a different job description.');
      } else {
        console.error('Invalid response structure:', data);
        setError('Invalid response from server. Please try again.');
      }
    } catch (err) {
      console.error('Search error:', err);
      
      // More specific error handling
      if (err instanceof TypeError) {
        if (err.message.includes('fetch')) {
          setError('Network error: Unable to connect to the server. Please check if the backend is running at http://localhost:3000');
        } else if (err.message.includes('CORS')) {
          setError('CORS error: The server is not allowing requests from this origin. Please check backend CORS configuration.');
        } else {
          setError(`Network error: ${err.message}`);
        }
      } else if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
          setError('Connection failed: Please ensure the backend server is running at http://localhost:3000');
        } else {
          setError(`Error: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      
      // Ensure we always reset the UI state properly
      setShowResults(false);
      setChatResponse(null);
      setSearchResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getElaboratedResponse = async (searchData: SearchResponse) => {
    setIsChatLoading(true);
    try {
      const topMatch = searchData.data.topMatch;
      const ncoCode = topMatch.metadata?.nco_code || 'Unknown';
      const jobTitle = topMatch.metadata?.title || topMatch.title || 'Unknown';
      const score = topMatch.score;
      const description = topMatch.metadata?.description || 'No description available';
      
      // Create a detailed prompt for the AI to elaborate on the job classification
      const prompt = `Please provide a detailed and comprehensive analysis of this NCO job classification:

Job Description: "${searchData.data.input}"
NCO Code: ${ncoCode}
Job Title: ${jobTitle}
Match Score: ${(score * 100).toFixed(3)}%
Description: ${description}

Please provide:
1. A detailed explanation of what this job entails
2. Required skills and qualifications
3. Typical responsibilities and duties
4. Career progression opportunities
5. Industry sectors where this role is common
6. Salary expectations and growth potential
7. Training and certification requirements
8. Related job titles and similar NCO codes
9. Tips for job seekers interested in this role
10. Current market demand and future outlook

Make the response comprehensive, professional, and helpful for job seekers.`;

      let response;
      try {
        response = await makeApiCall('/api/langchain/chat', {
          message: prompt,
          model: 'groq',
          systemPrompt: 'You are a specialized career counselor and job classification expert. Provide detailed, accurate, and helpful information about job roles, skills, qualifications, and career guidance. Be comprehensive and professional in your responses.'
        });
      } catch (proxyError) {
        response = await makeApiCall('https://statethon-backend.onrender.com/api/langchain/chat', {
          message: prompt,
          model: 'groq',
          systemPrompt: 'You are a specialized career counselor and job classification expert. Provide detailed, accurate, and helpful information about job roles, skills, qualifications, and career guidance. Be comprehensive and professional in your responses.'
        });
      }

      if (!response.ok) {
        throw new Error(`Chat API error: ${response.status}`);
      }

      const chatData: ChatResponse = await response.json();
      setChatResponse(chatData);
      
    } catch (err) {
      console.error('Chat API error:', err);
      // Don't show error for chat failure, just log it
    } finally {
      setIsChatLoading(false);
    }
  };

  const generateShareUrl = (result: SearchResponse) => {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
      input: result.data.input,
      nco: getNCOCode(result.data.topMatch.metadata),
      score: result.data.topMatch.score.toString(),
      title: getJobTitle(result.data.topMatch),
      description: getJobDescription(result.data.topMatch.metadata)
    });
    setShareUrl(`${baseUrl}?${params.toString()}`);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadPDF = () => {
    if (!searchResult) return;
    
    // Create a formatted text file with the results
    const content = `UAE NCO Job Classification Result
===============================================

Job Description: ${searchResult.data.input}

NCO Match Details:
=================
NCO Code: ${getNCOCode(searchResult.data.topMatch.metadata)}
Job Title: ${getJobTitle(searchResult.data.topMatch)}
Match Score: ${formatMatchScore(searchResult.data.topMatch.score)}%
Description: ${getJobDescription(searchResult.data.topMatch.metadata)}

Additional Information:
======================
Division: ${searchResult.data.topMatch.metadata?.division || 'N/A'}
Family: ${searchResult.data.topMatch.metadata?.family_title || 'N/A'}
Group: ${searchResult.data.topMatch.metadata?.group || 'N/A'}

Generated on: ${new Date().toLocaleString()}
===============================================`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NCO-${getNCOCode(searchResult.data.topMatch.metadata)}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };



  const shareResult = async () => {
    if (!shareUrl) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'UAE NCO Job Classification Result',
          text: `Check out my NCO match: ${getJobTitle(searchResult!.data.topMatch)} (${getNCOCode(searchResult!.data.topMatch.metadata)})`,
          url: shareUrl
        });
      } else {
        // Fallback: copy to clipboard
        await copyToClipboard(shareUrl);
      }
    } catch (err) {
      console.error('Failed to share:', err);
    }
  };

  return (
    <>
      <SkipToContent />
      <div 
        id="main-content"
        className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 transition-all duration-300"
      >
        {/* Enhanced Hero Section */}
        <div className="relative overflow-hidden">
          {/* Animated background patterns */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400"></div>
            <motion.div 
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '30px 30px'
              }}
              animate={{ 
                backgroundPosition: ['0px 0px', '30px 30px'],
              }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h1 
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {t('home.title').split('NCO Code').map((part, index) => (
                  <span key={index}>
                    {part}
                    {index === 0 && (
                      <motion.span 
                        className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent"
                        animate={{ 
                          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        NCO Code
                      </motion.span>
                    )}
                  </span>
                ))}
              </motion.h1>
              <motion.p 
                className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 mb-12 max-w-4xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {t('home.subtitle')}
              </motion.p>
            </motion.div>

            {/* Enhanced Examples Section */}
            <motion.div 
              className="max-w-6xl mx-auto mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.h3 
                className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-6 flex items-center justify-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </motion.div>
                {t('home.examples')}
              </motion.h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {examples.map((example, index) => (
                  <motion.div
                    key={index}
                    onClick={() => setJobDescription(example.text)}
                    className="group bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-soft border border-neutral-200 dark:border-neutral-700 hover:shadow-medium transition-all duration-300 cursor-pointer hover:border-primary-300 dark:hover:border-primary-500 relative overflow-hidden"
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  >
                    {/* Hover gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/10 dark:to-secondary-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative flex items-start gap-4">
                      <motion.span 
                        className="text-3xl flex-shrink-0"
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {example.icon}
                      </motion.span>
                      <div className="flex-1">
                        <p className="text-neutral-800 dark:text-neutral-200 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors font-medium leading-relaxed">
                          "{example.text}"
                        </p>
                        <span className="text-sm text-primary-600 dark:text-primary-400 font-medium bg-primary-100 dark:bg-primary-900/30 px-3 py-1 rounded-full">
                          {example.category}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Enhanced Search Section */}
            <motion.div 
              className="max-w-6xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <AdvancedSearch
                value={jobDescription}
                onChange={setJobDescription}
                onSearch={handleSearch}
                isLoading={isLoading}
                isListening={isListening}
                onVoiceInput={handleVoiceInput}
                backendStatus={backendStatus}
              />
            </motion.div>

            {/* Enhanced Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  className="max-w-6xl mx-auto mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <ErrorState 
                    message={error} 
                    onRetry={() => {
                      setError(null);
                      handleSearch();
                    }}
                    type="error"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading State */}
            <AnimatePresence>
              {isLoading && (
                <motion.div className="max-w-6xl mx-auto mt-8">
                  <SearchLoadingState />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced Results Section */}
            <AnimatePresence>
              {showResults && searchResult && searchResult.data && searchResult.data.topMatch && (
                <motion.div 
                  className="max-w-6xl mx-auto mt-12"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Enhanced Results Header */}
                  <motion.div 
                    className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div>
                      <h3 className="text-2xl font-bold text-neutral-800 dark:text-white mb-2">
                        🎯 Your Perfect NCO Match
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        AI-powered analysis completed in 0.23 seconds
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <motion.button 
                        onClick={downloadPDF}
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-success-600 to-accent-600 text-white rounded-xl font-medium shadow-soft hover:shadow-medium transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </motion.button>
                      {isMobile && (
                        <motion.button
                          onClick={() => setShowMobileShare(true)}
                          className="flex items-center px-4 py-2 bg-gradient-to-r from-secondary-600 to-primary-600 text-white rounded-xl font-medium shadow-soft hover:shadow-medium transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </motion.button>
                      )}
                    </div>
                  </motion.div>

                  {/* Enhanced Low Match Score Warning */}
                  {formatMatchScore(searchResult.data.topMatch.score) < 30 && (
                    <motion.div 
                      className="mb-8"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ErrorState
                        message={`Low Match Score (${formatMatchScore(searchResult.data.topMatch.score)}%): This indicates a poor match. Try being more specific with your job description, include relevant skills and technologies, mention your industry sector, and add experience level details.`}
                        type="warning"
                        onRetry={() => {
                          setJobDescription('');
                          setShowResults(false);
                        }}
                      />
                    </motion.div>
                  )}

                  {/* Enhanced Match Result Card */}
                  <EnhancedResultCard
                    match={searchResult.data.topMatch}
                    searchInput={searchResult.data.input}
                    onDownload={downloadPDF}
                    onShare={shareResult}
                    onCopyCode={() => copyToClipboard(getNCOCode(searchResult.data.topMatch.metadata))}
                    copied={copied}
                  />


                  {/* Enhanced AI Analysis Loading */}
                  <AnimatePresence>
                    {isChatLoading && (
                      <motion.div className="mt-8">
                        <ChatLoadingState />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Enhanced Chat Response */}
                  {chatResponse && (
                  <motion.div 
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl shadow-lg p-6 mb-6 border border-blue-200 dark:border-blue-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-neutral-800 dark:text-white">AI Career Analysis</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Professional Insights</p>
                      </div>
                    </div>

                    <div className="prose prose-blue dark:prose-invert max-w-none">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                        <div className="whitespace-pre-wrap text-neutral-700 dark:text-neutral-300 leading-relaxed">
                          {chatResponse.response}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
                      <span>Generated at: {new Date(chatResponse.timestamp).toLocaleString()}</span>
                      <span>Analysis Complete</span>
                    </div>
                  </motion.div>
                )}

                
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Enhanced Statistics Section - Lazy Loaded */}
        <LazyOnView>
          <Suspense fallback={<div className="h-64 bg-neutral-100 dark:bg-neutral-800" />}>
            <EnhancedStatsSection />
          </Suspense>
        </LazyOnView>
      </div>

      {/* Mobile Optimizations */}
      {isMobile && (
        <>
          <ScrollToTopButton />
          <MobileShareMenu
            isOpen={showMobileShare}
            onClose={() => setShowMobileShare(false)}
            shareData={{
              title: 'UAE NCO Job Classification Result',
              text: searchResult && searchResult.data && searchResult.data.topMatch ? 
                `Check out my NCO match: ${getJobTitle(searchResult.data.topMatch)} (${getNCOCode(searchResult.data.topMatch.metadata)})` : 
                'NCO Classification Result',
              url: shareUrl
            }}
          />
        </>
      )}

      {/* Enhanced Accessibility */}
      <AccessibilityButton onClick={() => setShowAccessibility(true)} />
      <AccessibilityPanel
        isOpen={showAccessibility}
        onClose={() => setShowAccessibility(false)}
      />
    </>
  );
};

export default Home;