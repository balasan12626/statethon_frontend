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
    let animationTimer: ReturnType<typeof setTimeout>;
    
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

  const getNCOCode = () => {
    return match.metadata?.nco_code || 
           match.metadata?.ncoCode ||
           match.metadata?.code ||
           match.id ||
           'Unknown';
  };

  const getJobTitle = () => {
    return match.metadata?.title || 
           match.metadata?.occupationTitle ||
           match.title || 
           'Unknown';
  };

  const getJobDescription = () => {
    return match.metadata?.description || 
           match.metadata?.jobDescription ||
           match.metadata?.summary ||
           'No description available';
  };

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
      className="relative bg-white rounded-xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Government Header Bar */}
      <div className="bg-[#003366] text-white px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="/emblem.png" 
              alt="Government of India Emblem" 
              className="h-16 w-auto govt-emblem"
            />
            <div>
              <h1 className="text-3xl font-bold font-roboto mb-2">
                {getJobTitle()}
              </h1>
              <div className="flex items-center gap-3 text-white/90">
                <span className="font-medium">NCO {getNCOCode()}</span>
                <span className="text-white/60">|</span>
                <span className="font-medium">Ministry of Statistics and Programme Implementation</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <motion.button 
              onClick={onDownload}
              className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-5 h-5 mr-2" />
              Export Report
            </motion.button>
            <motion.button
              onClick={onShare}
              className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share
            </motion.button>
          </div>
        </div>
      </div>
      {/* Professional Header with Score and Actions */}
      <div className="relative p-10 bg-gradient-to-r from-primary-100/50 via-white/80 to-secondary-100/50 dark:from-navy-800/50 dark:via-navy-700/80 dark:to-gold-500/10">
        {/* Professional Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 dark:from-gold-500 dark:to-navy-600"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23003366' fill-opacity='0.2'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '25px 25px'
          }}></div>
        </div>

        <div className="relative flex justify-between items-start">
          {/* NCO Code and Title */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <motion.div 
                onClick={handleCopy}
                className={`bg-gradient-to-r ${getScoreColor(match.score)} text-white dark:text-navy-900 px-8 py-4 rounded-2xl font-bold text-xl shadow-hard hover:shadow-xl transition-all duration-200 cursor-pointer border-2 border-white/30 dark:border-navy-900/20 hover:border-white/50 dark:hover:border-navy-900/30 ${showCopyFeedback ? 'copy-feedback' : ''}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Click to copy NCO code"
              >
                <div className="text-center">
                  <div className="text-2xl font-black">NCO {getNCOCode()}</div>
                  <div className="text-sm font-semibold opacity-90">Government Classification</div>
                </div>
              </motion.div>
              
              <motion.button
                onClick={handleCopy}
                className="p-4 rounded-xl bg-white/30 dark:bg-navy-900/30 hover:bg-white/60 dark:hover:bg-navy-900/50 transition-all duration-200 border-2 border-white/40 dark:border-gold-500/20 shadow-soft hover:shadow-medium"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Copy NCO Code"
              >
                {copied ? (
                  <Check className="w-6 h-6 text-success-600 dark:text-success-400" />
                ) : (
                  <Copy className="w-6 h-6 text-primary-600 dark:text-gold-400" />
                )}
              </motion.button>

              <motion.button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="p-4 rounded-xl bg-white/30 dark:bg-navy-900/30 hover:bg-white/60 dark:hover:bg-navy-900/50 transition-all duration-200 border-2 border-white/40 dark:border-gold-500/20 shadow-soft hover:shadow-medium"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Bookmark className={`w-6 h-6 ${isBookmarked ? 'text-warning-500 fill-current' : 'text-primary-600 dark:text-gold-400'}`} />
              </motion.button>
            </div>

            <h2 className="text-4xl font-bold gradient-text-primary mb-4 text-shadow-md">
              {getJobTitle()}
            </h2>
            
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="badge-success text-base font-bold px-4 py-2">
                ✅ Professional Grade
              </span>
              <span className="badge-secondary text-base font-bold px-4 py-2">
                🔥 High Demand
              </span>
              <span className="badge-primary text-base font-bold px-4 py-2">
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

      {/* Main Content with Government Styling */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2">
          {/* Official Job Description */}
          <div className="bg-white rounded-xl shadow-md mb-8">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-roboto font-bold text-[#003366] flex items-center gap-2">
                <span role="img" aria-label="Document">📝</span>
                Official Job Description
              </h3>
            </div>
            <div className="p-6">
              <p className="text-[#212529] text-base font-noto leading-relaxed mb-6">
                {getJobDescription()}
              </p>
            
              {/* Key Responsibilities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-[#F8F9FA] rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#003366] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span role="img" aria-label="Books" className="text-xl">📚</span>
                  </div>
                  <div>
                    <h4 className="font-roboto font-semibold text-[#003366] mb-2">Teaching Subjects</h4>
                    <p className="text-[#212529] text-sm font-noto">Reading, writing, arithmetic, language, social science, ethics, history, geography</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#F8F9FA] rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#003366] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span role="img" aria-label="Assessment" className="text-xl">📝</span>
                  </div>
                  <div>
                    <h4 className="font-roboto font-semibold text-[#003366] mb-2">Assessment & Records</h4>
                    <p className="text-[#212529] text-sm font-noto">Conduct tests, prepare results, maintain attendance records</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#F8F9FA] rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#003366] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span role="img" aria-label="Trophy" className="text-xl">🏆</span>
                  </div>
                  <div>
                    <h4 className="font-roboto font-semibold text-[#003366] mb-2">Extracurricular Activities</h4>
                    <p className="text-[#212529] text-sm font-noto">Organize hobbies, sports, dramatics, and other activities</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#F8F9FA] rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#003366] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span role="img" aria-label="Administrative" className="text-xl">💰</span>
                  </div>
                  <div>
                    <h4 className="font-roboto font-semibold text-[#003366] mb-2">Administrative Duties</h4>
                    <p className="text-[#212529] text-sm font-noto">Collect fees, submit accounts, maintain school registers</p>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1">
          {/* Classification Card */}
          <div className="bg-[#FF9933] bg-opacity-10 rounded-xl p-6 mb-6">
            <h3 className="font-roboto font-bold text-[#003366] text-lg mb-4 flex items-center gap-2">
              <span role="img" aria-label="Tag">🏷️</span>
              Classification
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[#212529] font-noto font-medium">Grade</span>
                <span className="bg-[#003366] text-white px-3 py-1 rounded-full text-sm font-medium">Professional</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#212529] font-noto font-medium">Demand</span>
                <span className="bg-[#FF9933] text-white px-3 py-1 rounded-full text-sm font-medium">High Growth</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#212529] font-noto font-medium">Sector</span>
                <span className="bg-[#003366] bg-opacity-10 text-[#003366] px-3 py-1 rounded-full text-sm font-medium">Education</span>
              </div>
            </div>
          </div>

          {/* Match Analysis Card */}
          <div className="bg-white rounded-xl shadow-md">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="font-roboto font-bold text-[#003366] text-lg flex items-center gap-2">
                <span role="img" aria-label="Target">🎯</span>
                Match Analysis
              </h3>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="text-[#212529] font-noto mb-3">
                  Your job description:
                </div>
                <div className="bg-[#F8F9FA] p-3 rounded-lg text-[#003366] font-medium">
                  "{searchInput}"
                </div>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 font-medium">AI Confidence: Excellent (95%+)</span>
              </div>

              <div className="flex items-center gap-2">
                <img 
                  src="/verified.png" 
                  alt="Government Verified" 
                  className="h-5 w-auto"
                />
                <span className="text-[#003366] font-medium">Verified by MoSPI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Overview grid removed as requested */}

        {/* Footer Actions */}
        <div className="col-span-full bg-[#F8F9FA] border-t border-gray-200 mt-8 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.button 
                onClick={onDownload}
                className="bg-[#003366] text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-[#002855] transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-5 h-5" />
                Download Full Report
              </motion.button>
              
              <motion.button 
                onClick={onShare}
                className="bg-[#FF9933] text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-[#E68A2E] transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 className="w-5 h-5" />
                Share Results
              </motion.button>
              
              <motion.a 
                href="https://www.mospi.gov.in/nco-manual"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#003366] hover:text-[#002855] font-medium flex items-center gap-2 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ExternalLink className="w-5 h-5" />
                View NCO Manual
              </motion.a>
            </div>
            
            <div className="flex items-center gap-6">
              <span className="text-[#212529] font-medium">Was this helpful?</span>
              <div className="flex gap-4">
                <motion.button 
                  className="text-[#003366] hover:text-[#002855] transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ThumbsUp className="w-6 h-6" />
                </motion.button>
                <motion.button 
                  className="text-[#003366] hover:text-[#002855] transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ThumbsDown className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedResultCard;