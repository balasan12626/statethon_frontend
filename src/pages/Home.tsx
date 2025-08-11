import React, { useState, lazy, Suspense } from 'react';
import { Sparkles, Download, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Enhanced components
import AdvancedSearch from '../components/AdvancedSearch';
import EnhancedResultCard from '../components/EnhancedResultCard';
import { SearchLoadingState, ChatLoadingState, ErrorState } from '../components/LoadingStates';
// Removed accessibility imports
import { LazyOnView } from '../components/LazyComponents';
import { useIsMobile, ScrollToTopButton, MobileShareMenu } from '../components/MobileOptimizations';
// import { cachedSearchFetch } from '../utils/cache';

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
    allMatches?: NCOMatch[]; // Optional array of all matches
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
  // Removed backendStatus state
  const [isChatLoading, setIsChatLoading] = useState(false);

  
  // Enhanced UI state
  // Accessibility state removed
  const [showMobileShare, setShowMobileShare] = useState(false);
  
  // Keyboard shortcuts removed

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



  // New response types for local multi-agent backend
  interface MultiAgentMatch {
    nco_code?: string;
    title?: string;
    description?: string;
    score: number; // 0..1
    id?: string | number;
  }

  interface MultiAgentResponse {
    explanation?: string; // markdown-like text
    matches?: MultiAgentMatch[];
  }

  // Transform backend response → UI SearchResponse
  const transformMultiAgentToSearchResponse = (
    inputText: string,
    api: MultiAgentResponse
  ): SearchResponse | null => {
    if (!api || !api.matches || api.matches.length === 0) return null;
    
    // Sort all matches by score (highest first)
    const sortedMatches = [...api.matches].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    
    // Get the top match for backward compatibility
    const top = sortedMatches[0];
    const topMatch: NCOMatch = {
      title: top.title || 'Unknown',
      score: typeof top.score === 'number' ? top.score : 0,
      metadata: {
        nco_code: top.nco_code || String(top.id || ''),
        title: top.title || 'Unknown',
        description: top.description || 'No description available'
      }
    };

    // Transform all matches for display
    const allMatches: NCOMatch[] = sortedMatches.map(match => ({
      title: match.title || 'Unknown',
      score: typeof match.score === 'number' ? match.score : 0,
      metadata: {
        nco_code: match.nco_code || String(match.id || ''),
        title: match.title || 'Unknown',
        description: match.description || 'No description available'
      }
    }));

    return {
      success: true,
      data: {
        success: true,
        input: inputText,
        topMatch,
        allMatches // Include all matches for display
      }
    };
  };

  // Prefer whichever backend worked last during this session
  const preferredEndpointRef = React.useRef<string | null>(null);
  const BACKEND_ENDPOINTS = React.useMemo(() => {
    const configuredBase = (import.meta as any).env?.VITE_SEARCH_API_BASE as string | undefined;
    const endpoints: string[] = [];
    if (configuredBase) {
      const base = configuredBase.replace(/\/$/, '');
      endpoints.push(`${base}/search_nco_multiagent`);
    }
    // Direct cloud URL first, then proxies
    endpoints.push(
      'https://statethon-fastapi-backend.onrender.com/search_nco_multiagent', // direct cloud
      '/api/chat/general',       // proxied to localhost:8001 via Vite
      '/api8000/chat/general'    // proxied to localhost:8000 via Vite (fallback)
    );
    return endpoints;
  }, []);

  const requestMultiAgent = async (payload: { query: string; top_k: number }): Promise<MultiAgentResponse> => {
    const endpoints = preferredEndpointRef.current
      ? [preferredEndpointRef.current, ...BACKEND_ENDPOINTS.filter(u => u !== preferredEndpointRef.current)]
      : BACKEND_ENDPOINTS;

    let lastError: unknown = null;
    for (const url of endpoints) {
      try {
        console.log('Trying endpoint:', url, 'with payload:', payload);
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': window.location.origin
          },
          mode: 'cors',
          credentials: 'omit',
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          // Try to log server error body for easier debugging
          let detail = '';
          try { detail = await res.text(); } catch {}
          console.error('Backend error:', detail);
          throw new Error(`HTTP ${res.status}${detail ? `: ${detail.slice(0, 200)}` : ''}`);
        }
        const data = (await res.json()) as MultiAgentResponse;
        preferredEndpointRef.current = url; // remember working endpoint
        // setBackendStatus removed
        return data;
      } catch (e) {
        console.error('Failed to connect to', url, e);
        lastError = e;
        // try next endpoint
      }
    }
    // setBackendStatus removed
    throw lastError ?? new Error('All backend endpoints failed');
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

  // Format backend explanation text: remove markdown symbols (e.g., **, ##) and tidy bullets
  const formatExplanation = React.useCallback((text: string): string => {
    if (!text) return '';
    let out = text.replace(/\r\n/g, '\n');
    // remove code fences and inline backticks
    out = out.replace(/```[\s\S]*?```/g, '');
    out = out.replace(/`([^`]+)`/g, '$1');
    // remove bold/italic markers
    out = out.replace(/\*\*([^*]+)\*\*/g, '$1');
    out = out.replace(/\*([^*]+)\*/g, '$1');
    out = out.replace(/_([^_]+)_/g, '$1');
    // turn markdown headings into plain lines
    out = out.replace(/^#{1,6}\s*/gm, '');
    // normalize bullets
    out = out.replace(/^\s*[-•]\s+/gm, '• ');
    out = out.replace(/\n{3,}/g, '\n\n');
    // trim excessive spaces on each line
    out = out
      .split('\n')
      .map(line => line.trimEnd())
      .join('\n');
    return out.trim();
  }, []);

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
        // setBackendStatus removed
      } catch (err) {
        console.error('Backend check failed:', err);
        // setBackendStatus removed
      }
    };
    
    checkBackend();
    // Re-check periodically
    const intervalId = window.setInterval(checkBackend, 30000);
    return () => window.clearInterval(intervalId);
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
      // Use a stable, known-good query for connectivity check
      const resp = await requestMultiAgent({ query: 'Manager, Agricultural Farm', top_k: 1 });
      return !!resp;
    } catch (err) {
      console.error('Backend connectivity check failed:', err);
      return false;
    }
  };

  // Removed generic makeApiCall in favor of direct cachedSearchFetch usage

  const handleSearch = async () => {
    if (!jobDescription.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setShowResults(false);
    setChatResponse(null);
    setIsChatLoading(true);
    
    try {
      console.log('Sending request to local multi-agent backend...');

      // Always send top_k = 5 as requested
      const multiAgent = await requestMultiAgent({ query: jobDescription.trim(), top_k: 5 });

      // Transform into UI structure
      const data = transformMultiAgentToSearchResponse(jobDescription.trim(), multiAgent);

      if (data && data.success && data.data && data.data.topMatch) {
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
          // setBackendStatus removed
          // Generate share URL
          generateShareUrl(data);

          // Use backend-provided explanation as AI analysis (if present)
          if (multiAgent && multiAgent.explanation) {
            setChatResponse({
              success: true,
              response: multiAgent.explanation,
              model: 'multiagent',
              timestamp: new Date().toISOString(),
              usage: { model: 'multiagent', timestamp: new Date().toISOString() }
            });
          } else {
            setChatResponse(null);
          }
        } else {
          console.log('Debug - No suitable match found. actualTitle:', actualTitle, 'ncoCode:', ncoCode);
          setError('No suitable NCO matches found for your job description. Please try a different description.');
        }
      } else {
        console.error('Invalid response structure from multi-agent backend:', multiAgent);
        setError('Invalid response from server. Please try again.');
      }
    } catch (err) {
      console.error('Search error:', err);
      
      // More specific error handling
      if (err instanceof TypeError) {
        if (err.message.includes('fetch')) {
          setError('Network error: Unable to connect to the server. Please check if the backend is running at http://localhost:8001 or http://localhost:8000');
        } else if (err.message.includes('CORS')) {
          setError('CORS error: The server is not allowing requests from this origin. Please check backend CORS configuration.');
        } else {
          setError(`Network error: ${err.message}`);
        }
      } else if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
          setError('Connection failed: Please ensure the backend server is running at http://localhost:8001 or http://localhost:8000');
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
      setIsChatLoading(false);
    }
  };

  // Removed old chat elaboration function; we now use the backend's explanation directly

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
    const content = `Indian NCO Job Classification Result
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
          title: 'Indian NCO Job Classification Result',
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
      {/* Skip to content removed */}
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

          <div className="relative w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-16">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h1 
                className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-3 sm:mb-4 leading-tight"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span>FIND THE PERFECT </span>
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
                  NCO CODE
                </motion.span>
              </motion.h1>
              <motion.p 
                className="text-xl md:text-2xl font-semibold text-neutral-700 dark:text-neutral-200 mb-2 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {t('home.classification')}
              </motion.p>
              <motion.p 
                className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-3xl mx-auto leading-relaxed"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                  className="max-w-6xl mx-auto mt-8 sm:mt-12"
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

                  {/* Enhanced Match Result Cards - Show all matches */}
                  {searchResult.data.allMatches && searchResult.data.allMatches.length > 0 ? (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        Top {searchResult.data.allMatches.length} Job Matches
                      </h3>
                      {searchResult.data.allMatches.map((match, index) => (
                        <div key={`${match.metadata.nco_code}-${index}`} className="relative">
                          {index === 0 && (
                            <div className="absolute -top-2 -left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                              Best Match
                            </div>
                          )}
                          <EnhancedResultCard
                            match={match}
                            searchInput={searchResult.data.input}
                            onDownload={downloadPDF}
                            onShare={shareResult}
                            onCopyCode={() => copyToClipboard(getNCOCode(match.metadata))}
                            copied={copied}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Fallback to single top match if allMatches is not available
                    <EnhancedResultCard
                      match={searchResult.data.topMatch}
                      searchInput={searchResult.data.input}
                      onDownload={downloadPDF}
                      onShare={shareResult}
                      onCopyCode={() => copyToClipboard(getNCOCode(searchResult.data.topMatch.metadata))}
                      copied={copied}
                    />
                  )}


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
                          {formatExplanation(chatResponse.response)}
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
              title: 'Indian NCO Job Classification Result',
              text: searchResult && searchResult.data && searchResult.data.topMatch ? 
                `Check out my NCO match: ${getJobTitle(searchResult.data.topMatch)} (${getNCOCode(searchResult.data.topMatch.metadata)})` : 
                'NCO Classification Result',
              url: shareUrl
            }}
          />
        </>
      )}

      {/* Accessibility panel removed */}
    </>
  );
};

export default Home;