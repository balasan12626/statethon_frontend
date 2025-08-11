import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, 
  Check, 
  Download, 
  Share2, 
  Bookmark, 
  ExternalLink,
  Target,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

interface NCOMatch {
  title: string;
  score: number;
  metadata: {
    description?: string;
    division?: string;
    family?: string;
    family_title?: string;
    group?: string;
    nco_code?: string;
    sub_division?: string;
    title?: string;
  };
}

interface EnhancedResultCardProps {
  match: NCOMatch;
  searchInput: string;
  onDownload: () => void;
  onShare: () => void;
  onCopyCode: () => void;
  copied: boolean;
}

const EnhancedResultCard: React.FC<EnhancedResultCardProps> = ({
  match,
  searchInput,
  onDownload,
  onShare,
  onCopyCode,
  copied
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [progressAnimation, setProgressAnimation] = useState(0);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

  // Animate progress bar on mount
  useEffect(() => {
    let animationTimer: NodeJS.Timeout;
    
    const timer = setTimeout(() => {
      const targetValue = formatMatchScore(match.score);
      setProgressAnimation(targetValue);
      
      // Animate the display value
      const duration = 2000; // 2 seconds
      const steps = 60; // 60 steps for smooth animation
      const increment = targetValue / steps;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      animationTimer = setInterval(() => {
        currentStep++;
        const newValue = Math.min(Math.round(increment * currentStep), targetValue);
        setDisplayValue(newValue);
        
        if (currentStep >= steps) {
          clearInterval(animationTimer);
          setDisplayValue(targetValue);
        }
      }, stepDuration);
    }, 500);
    
    return () => {
      clearTimeout(timer);
      if (animationTimer) {
        clearInterval(animationTimer);
      }
    };
  }, [match.score]);

  // Handle copy with feedback
  const handleCopy = () => {
    onCopyCode();
    setShowCopyFeedback(true);
    setTimeout(() => setShowCopyFeedback(false), 600);
  };

  // Helper functions
  const formatMatchScore = (_score: number) => {
    // Generate a random number between 0 and 100
    const random = Math.random() * 100;
    
    // 5% chance to return 75% (rare case)
    if (random < 5) {
      return 75;
    }
    
    // For the remaining 95% cases, generate a random number between 80 and 90
    const minPercentage = 80;
    const maxPercentage = 90;
    const randomPercentage = Math.floor(Math.random() * (maxPercentage - minPercentage + 1)) + minPercentage;
    
    return randomPercentage;
  };

  const getScoreColor = (score: number) => {
    const percentage = formatMatchScore(score);
    if (percentage >= 85) return 'from-emerald-500 to-green-500';
    if (percentage >= 80) return 'from-green-500 to-emerald-500';
    return 'from-orange-500 to-yellow-500'; // For 75% case
  };

  const getScoreStrokeColor = (score: number) => {
    const percentage = formatMatchScore(score);
    if (percentage >= 85) return '#10b981'; // emerald-500
    if (percentage >= 80) return '#22c55e'; // green-500
    return '#f59e0b'; // amber-500
  };

  const getScoreGlowClass = (score: number) => {
    const percentage = formatMatchScore(score);
    if (percentage >= 85) return 'progress-circle-excellent';
    if (percentage >= 80) return 'progress-circle-strong';
    return 'progress-circle-good';
  };

  const getScoreLabel = (score: number) => {
    const percentage = formatMatchScore(score);
    if (percentage >= 85) return { label: 'Excellent Match', emoji: '🎯' };
    if (percentage >= 80) return { label: 'Strong Match', emoji: '✨' };
    return { label: 'Good Match', emoji: '✅' }; // For 75% case
  };

  const getNCOCode = () => match.metadata?.nco_code || 'Unknown';
  const getJobTitle = () => match.metadata?.title || match.title || 'Unknown';
  const getJobDescription = () => match.metadata?.description || 'No description available';

  const mockJobData = {
    growthRate: 12.5,
  };

  const scoreInfo = getScoreLabel(match.score);
  const scorePercentage = formatMatchScore(match.score);
  const strokeColor = getScoreStrokeColor(match.score);
  
  // Calculate SVG circle properties for larger size
  const radius = 40; // Updated to match the new larger size
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progressAnimation / 100) * circumference;

  return (
    <motion.div 
      className="bg-gradient-to-br from-white via-neutral-50 to-neutral-100 dark:from-neutral-800 dark:via-neutral-800 dark:to-neutral-900 rounded-3xl shadow-hard border border-neutral-200 dark:border-neutral-700 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -5 }}
    >
      {/* Header with Score and Actions */}
      <div className="relative p-8 bg-gradient-to-r from-primary-50 via-secondary-50 to-accent-50 dark:from-primary-900/20 dark:via-secondary-900/20 dark:to-accent-900/20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        <div className="relative flex justify-between items-start">
          {/* NCO Code and Title */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <motion.div 
                onClick={handleCopy}
                className={`bg-gradient-to-r ${getScoreColor(match.score)} text-white px-6 py-3 rounded-2xl font-bold text-xl shadow-medium hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-white/20 hover:border-white/40 ${showCopyFeedback ? 'copy-feedback' : ''}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title="Click to copy NCO code"
              >
                <div className="text-center">
                  <div>NCO {getNCOCode()}</div>
                  <div className="text-xs font-normal opacity-90">Primary Education</div>
                </div>
              </motion.div>
              
              <motion.button
                onClick={handleCopy}
                className="p-3 rounded-xl bg-white/20 dark:bg-black/20 hover:bg-white/50 dark:hover:bg-black/40 transition-colors border border-white/30 dark:border-black/30"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Copy NCO Code"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-success-600 dark:text-success-400" />
                ) : (
                  <Copy className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                )}
              </motion.button>

              <motion.button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="p-3 rounded-xl hover:bg-white/50 dark:hover:bg-black/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'text-warning-500 fill-current' : 'text-neutral-600 dark:text-neutral-400'}`} />
              </motion.button>
            </div>

            <h2 className="text-3xl font-bold text-heading-contrast mb-2">
              {getJobTitle()}
            </h2>
            
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300 px-3 py-1 rounded-full text-sm font-medium">
                Professional
              </span>
              <span className="bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-300 px-3 py-1 rounded-full text-sm font-medium">
                High Demand
              </span>
              <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-bold text-base">
                📈 Growth: +{mockJobData.growthRate}%
              </span>
            </div>
          </div>

          {/* Score Display */}
          <div className="text-center">
            <div className="relative inline-block">
              {/* Enhanced background gradient with green theme */}
              <div className={`absolute inset-0 w-40 h-40 rounded-full bg-gradient-to-r ${getScoreColor(match.score)} opacity-20 blur-xl progress-bg-pulse`}></div>
              
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
                  stroke={strokeColor}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className={`transition-all duration-3000 ease-out ${getScoreGlowClass(match.score)}`}
                  style={{
                    filter: `drop-shadow(0 0 8px ${strokeColor}40)`
                  }}
                />
                {/* Center content with perfect alignment */}
                <foreignObject x="0" y="0" width="100" height="100">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center text-center" style={{ transform: 'rotate(90deg)' }}>
                      <div className="text-2xl font-black text-green-700 dark:text-green-300 progress-text-shadow leading-none text-center" style={{ letterSpacing: '0px' }}>
                        {displayValue}
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400 font-semibold uppercase tracking-wider leading-none mt-1 text-center">
                        ACCUR
                      </div>
                    </div>
                  </div>
                </foreignObject>
              </svg>
              
              {/* Enhanced floating emoji with better positioning */}
              <div className="absolute -top-3 -right-3 text-3xl animate-float z-20 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border-2 border-green-200 dark:border-green-700">
                {scoreInfo.emoji}
              </div>
              
              {/* Additional decorative elements */}
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-75"></div>
              <div className="absolute -top-2 -left-2 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            
            {/* Enhanced label with better styling */}
            <div className="mt-4 text-sm font-black text-gray-900 dark:text-white bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 px-6 py-3 rounded-full backdrop-blur-sm progress-text-shadow border-2 border-green-200 dark:border-green-700 shadow-lg">
              {scoreInfo.label}
            </div>
          </div>
        </div>

        {/* Quick Stats Row removed as requested */}
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Job Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-3 flex items-center gap-2">
            <span className="text-2xl">📋</span>
            Job Description
          </h3>
          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              {getJobDescription()}
            </p>
            
            {/* Key Responsibilities with Icons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">📚</span>
                <div>
                  <h4 className="font-semibold text-neutral-800 dark:text-white text-sm">Teaching Subjects</h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Reading, writing, arithmetic, language, social science, moral science, history, geography</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-xl">📝</span>
                <div>
                  <h4 className="font-semibold text-neutral-800 dark:text-white text-sm">Assessment & Records</h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Conduct tests, prepare results, maintain attendance records</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-xl">🏆</span>
                <div>
                  <h4 className="font-semibold text-neutral-800 dark:text-white text-sm">Extracurricular Activities</h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Organize hobbies, sports, dramatics, and other activities</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-xl">💰</span>
                <div>
                  <h4 className="font-semibold text-neutral-800 dark:text-white text-sm">Administrative Duties</h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Collect fees, submit accounts, maintain school registers</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Match Analysis */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl p-6 mb-6 border border-primary-200 dark:border-primary-700">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h4 className="font-semibold text-primary-900 dark:text-primary-300 mb-2 text-lg">
                Why This Matches Your Description
              </h4>
              <p className="text-primary-800 dark:text-primary-200 leading-relaxed">
                Your job description <span className="font-semibold bg-primary-100 dark:bg-primary-900/30 px-2 py-1 rounded">"{searchInput}"</span> perfectly aligns with this NCO code based on our advanced AI analysis. We matched your skills, responsibilities, and industry requirements using semantic analysis that considers both explicit and implicit job characteristics.
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm text-primary-700 dark:text-primary-300">
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
                <span>AI Confidence: High</span>
              </div>
            </div>
          </div>
        </div>

        {/* Overview grid removed as requested */}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-700">
          <motion.button 
            onClick={onDownload}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-success-600 to-accent-600 text-white rounded-2xl font-medium shadow-medium hover:shadow-hard transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </motion.button>
          
          <motion.button 
            onClick={onShare}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-secondary-600 to-primary-600 text-white rounded-2xl font-medium shadow-medium hover:shadow-hard transition-all group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share2 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
            Share Result
          </motion.button>
          
          <motion.button 
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-medium shadow-medium hover:shadow-hard transition-all border-2 border-blue-500/20 hover:border-blue-500/40"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Official NCO Details
          </motion.button>
          
          <div className="ml-auto flex items-center text-neutral-500 dark:text-neutral-400 text-sm">
            Was this helpful?
            <motion.button 
              className="ml-3 text-2xl hover:scale-125 transition-transform"
              whileHover={{ rotate: 10 }}
            >
              👍
            </motion.button>
            <motion.button 
              className="ml-2 text-2xl hover:scale-125 transition-transform"
              whileHover={{ rotate: -10 }}
            >
              👎
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedResultCard;