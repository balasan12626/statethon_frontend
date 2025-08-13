import React, { useState, useEffect } from 'react';

interface BackendAccuracyData {
  score: number;
  confidence: number;
  match_quality: string;
}

interface MultiAgentMatch {
  title: string;
  score: number;
  nco_code?: string;
  description?: string;
  id?: string | number;
}

interface MultiAgentResponse {
  explanation?: string;
  matches?: MultiAgentMatch[];
}

type BackendResponse = MultiAgentResponse | MultiAgentMatch[];

const AccuracyScoreTest: React.FC = () => {
  const [displayValue, setDisplayValue] = useState(0);
  const [progressAnimation, setProgressAnimation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendData, setBackendData] = useState<BackendAccuracyData | null>(null);
  const [searchQuery, setSearchQuery] = useState("I install solar panels and fix inverters");

  // Function to fetch accuracy data from backend using the same endpoint as main search
  const fetchAccuracyData = async (query?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const searchQueryToUse = query || searchQuery;
      
      // Use the same endpoint as the main search functionality
      const response = await fetch('https://statethon-fastapi-backend.onrender.com/search_nco_multiagent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: searchQueryToUse,
          top_k: 5
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: BackendResponse = await response.json();
      
      // Extract matches from the response
      let matches: MultiAgentMatch[] = [];
      
      if (Array.isArray(data)) {
        matches = data as MultiAgentMatch[];
      } else if (data.matches && Array.isArray(data.matches)) {
        matches = data.matches;
      }
      
      if (!matches || matches.length === 0) {
        throw new Error('No matches found in backend response');
      }
      
      // Get the top match score
      const topMatch = matches[0];
      const rawScore = topMatch.score || 0;
      
      // Create backend data object
      const accuracyData: BackendAccuracyData = {
        score: rawScore,
        confidence: rawScore * 100,
        match_quality: getMatchQuality(rawScore)
      };
      
      setBackendData(accuracyData);
      
      // Use actual backend percentage instead of transformed range
      const getActualPercentage = (score: number): number => {
        // Convert backend score (0-1) to actual percentage (0-100)
        const actualPercentage = Math.round(score * 100);
        return Math.max(0, Math.min(100, actualPercentage)); // Ensure it's between 0-100
      };

      const targetValue = getActualPercentage(rawScore);
      
      // Animate the progress
      setProgressAnimation(targetValue);
      
      // Animate the display value
      const duration = 2000; // 2 seconds
      const steps = 60; // 60 steps for smooth animation
      const increment = targetValue / steps;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const animationTimer = setInterval(() => {
        currentStep++;
        const newValue = Math.min(Math.round(increment * currentStep), targetValue);
        setDisplayValue(newValue);
        
        if (currentStep >= steps) {
          clearInterval(animationTimer);
          setDisplayValue(targetValue);
        }
      }, stepDuration);
      
    } catch (err) {
      console.error('Error fetching accuracy data:', err);
      setError('Failed to fetch accuracy data from backend');
      
      // Fallback to random score between 75-95 with 20% increments
      const fallbackScores = [75, 80, 85, 90, 95];
      const targetValue = fallbackScores[Math.floor(Math.random() * fallbackScores.length)];
      
      setProgressAnimation(targetValue);
      setDisplayValue(targetValue);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get match quality based on score
  const getMatchQuality = (score: number): string => {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Strong';
    if (score >= 0.4) return 'Good';
    if (score >= 0.2) return 'Fair';
    return 'Weak';
  };

  useEffect(() => {
    // Fetch data on component mount
    fetchAccuracyData();
  }, []);

  // Calculate SVG circle properties
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progressAnimation / 100) * circumference;

  // Get score label based on actual percentage
  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 80) return 'Strong Match';
    if (score >= 70) return 'Good Match';
    if (score >= 60) return 'Fair Match';
    if (score >= 50) return 'Weak Match';
    return 'Poor Match';
  };

  // Get score color based on actual percentage - using solid colors
  const getScoreColor = (score: number) => {
    if (score >= 90) return '#2563eb'; // blue-600
    if (score >= 80) return '#3b82f6'; // blue-500
    if (score >= 70) return '#60a5fa'; // blue-400
    if (score >= 60) return '#93c5fd'; // blue-300
    if (score >= 50) return '#bfdbfe'; // blue-200
    return '#dbeafe'; // blue-100
  };

  // Get confidence level based on actual percentage
  const getConfidenceLevel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 50) return 'Weak';
    return 'Poor';
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    fetchAccuracyData(searchQuery);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50 dark:from-navy-900 dark:via-navy-800 dark:to-blue-900/20 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 dark:text-blue-300 font-medium">Loading accuracy data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50 dark:from-navy-900 dark:via-navy-800 dark:to-blue-900/20 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-6 max-w-md">
            <p className="text-red-700 dark:text-red-300 font-medium mb-2">Error Loading Data</p>
            <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>
            <button 
              onClick={() => fetchAccuracyData()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50 dark:from-navy-900 dark:via-navy-800 dark:to-blue-900/20 flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        {/* Search Input */}
        <div className="mb-6 bg-white dark:bg-navy-800 rounded-xl p-4 shadow-lg border border-blue-200 dark:border-blue-700">
          <input
            type="text"
            value={searchQuery}
            onChange={handleQueryChange}
            placeholder="Enter job description..."
            className="w-full px-4 py-2 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-navy-700 dark:text-white"
          />
          <button
            onClick={handleSearch}
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Test Accuracy
          </button>
        </div>

        <div className="relative inline-block">
          {/* Background circle with solid color instead of blur */}
          <div className="absolute inset-0 w-40 h-40 rounded-full bg-blue-100 dark:bg-blue-900/30 opacity-50"></div>
          
          {/* SVG Circular Progress Bar - Larger size */}
          <svg className="w-40 h-40 transform -rotate-90 relative z-10" viewBox="0 0 100 100">
            {/* Background circle with better styling */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#e5e7eb"
              strokeWidth="6"
              fill="none"
              className="dark:stroke-neutral-600"
            />
            {/* Progress circle with solid color instead of blur */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={getScoreColor(displayValue)}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-3000 ease-out"
              style={{
                filter: `drop-shadow(0 0 4px ${getScoreColor(displayValue)}40)`
              }}
            />
            
            {/* Center content with enhanced styling */}
            <foreignObject x="20" y="20" width="60" height="60">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center bg-white dark:bg-navy-800 rounded-full p-4 shadow-2xl border-4 border-blue-200 dark:border-blue-700 relative overflow-hidden">
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full"></div>
                  <div className="relative z-10">
                    <div className="text-3xl font-black text-blue-700 dark:text-blue-300">
                      {displayValue}%
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1">
                      ACCURACY
                    </div>
                  </div>
                </div>
              </div>
            </foreignObject>
          </svg>
          
          {/* Enhanced floating emoji with better positioning */}
          <div className="absolute -top-3 -right-3 text-3xl animate-float z-20 bg-white dark:bg-navy-800 rounded-full p-2 shadow-lg border-2 border-blue-200 dark:border-blue-700">
            ✨
          </div>
          
          {/* Additional decorative elements */}
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute -top-2 -left-2 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
        
        {/* Enhanced label with better styling */}
        <div className="mt-4 text-sm font-black text-neutral-900 dark:text-white bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 px-6 py-3 rounded-full backdrop-blur-sm border-2 border-blue-200 dark:border-blue-700 shadow-lg">
          {getScoreLabel(displayValue)}
        </div>
        
        {/* AI Confidence Indicator */}
        <div className="mt-3 flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl border border-blue-200 dark:border-blue-700">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            AI Confidence: {getConfidenceLevel(displayValue)} ({displayValue}%+)
          </span>
        </div>

        {/* Backend Data Info */}
        {backendData && (
          <div className="mt-4 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-700">
            <p>Backend Score: {(backendData.score * 100).toFixed(1)}%</p>
            <p>Match Quality: {backendData.match_quality}</p>
            <p>Raw Confidence: {backendData.confidence.toFixed(1)}%</p>
          </div>
        )}

        {/* Refresh Button */}
        <button 
          onClick={() => fetchAccuracyData()}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-colors shadow-lg hover:shadow-xl"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default AccuracyScoreTest;
