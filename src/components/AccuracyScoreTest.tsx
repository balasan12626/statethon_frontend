import React, { useState, useEffect } from 'react';

const AccuracyScoreTest: React.FC = () => {
  const [displayValue, setDisplayValue] = useState(0);
  const [progressAnimation, setProgressAnimation] = useState(0);
  const targetValue = 92; // Updated to show a high accuracy score (90%+) for testing

  useEffect(() => {
    const timer = setTimeout(() => {
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
      
      return () => {
        clearInterval(animationTimer);
      };
    }, 500);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Calculate SVG circle properties
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progressAnimation / 100) * circumference;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative inline-block">
          {/* Enhanced background gradient with green theme */}
          <div className="absolute inset-0 w-40 h-40 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 opacity-20 blur-xl progress-bg-pulse"></div>
          
          {/* Additional glowing background for better visibility */}
          <div className="absolute inset-0 w-40 h-40 rounded-full bg-gradient-to-r from-green-400/30 to-emerald-400/30 backdrop-blur-sm animate-pulse-slow"></div>
          
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
              className="dark:stroke-gray-600"
            />
            {/* Progress circle with enhanced green styling */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#22c55e"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-3000 ease-out progress-circle-strong"
              style={{
                filter: `drop-shadow(0 0 8px #22c55e40)`
              }}
            />
            {/* Center content with enhanced styling */}
            <foreignObject x="20" y="20" width="60" height="60">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center bg-white dark:bg-gray-800 rounded-full p-4 shadow-2xl border-4 border-green-200 dark:border-green-800 relative overflow-hidden">
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full"></div>
                  <div className="relative z-10">
                    <div className="text-3xl font-black text-green-700 dark:text-green-300 progress-text-shadow">
                      {displayValue}%
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400 font-semibold mt-1">
                      ACCURACY
                    </div>
                  </div>
                </div>
              </div>
            </foreignObject>
          </svg>
          
          {/* Enhanced floating emoji with better positioning */}
          <div className="absolute -top-3 -right-3 text-3xl animate-float z-20 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border-2 border-green-200 dark:border-green-700">
            ✨
          </div>
          
          {/* Additional decorative elements */}
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute -top-2 -left-2 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
        </div>
        
        {/* Enhanced label with better styling */}
        <div className="mt-4 text-sm font-black text-gray-900 dark:text-white bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 px-6 py-3 rounded-full backdrop-blur-sm progress-text-shadow border-2 border-green-200 dark:border-green-700 shadow-lg">
          Excellent Match
        </div>
      </div>
    </div>
  );
};

export default AccuracyScoreTest;
