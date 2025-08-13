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
  ThumbsDown,
  Info,
  TrendingUp,
  Users,
  Award,
  FileText,
  Printer
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
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

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
  const formatMatchScore = (score: number) => {
    // Use actual backend percentage instead of transformed range
    const getActualPercentage = (score: number): number => {
      // Convert backend score (0-1) to actual percentage (0-100)
      const actualPercentage = Math.round(score * 100);
      return Math.max(0, Math.min(100, actualPercentage)); // Ensure it's between 0-100
    };

    return getActualPercentage(score);
  };

  const getScoreColor = (score: number) => {
    // Updated thresholds for actual percentage with blue theme
    // Using solid colors instead of blur colors
    if (score >= 0.9) return '#2563eb'; // blue-600
    if (score >= 0.8) return '#3b82f6'; // blue-500
    if (score >= 0.7) return '#60a5fa'; // blue-400
    if (score >= 0.6) return '#93c5fd'; // blue-300
    if (score >= 0.5) return '#bfdbfe'; // blue-200
    return '#dbeafe'; // blue-100
  };

  const getScoreLabel = (score: number) => {
    // Updated labels for actual percentage with blue theme
    if (score >= 0.9) return 'Excellent Match';
    if (score >= 0.8) return 'Strong Match';
    if (score >= 0.7) return 'Good Match';
    if (score >= 0.6) return 'Fair Match';
    if (score >= 0.5) return 'Weak Match';
    return 'Poor Match';
  };

  const getNCOCode = () => {
    return match.metadata.nco_code || match.metadata.ncoCode || match.metadata.code || 'N/A';
  };

  const getJobTitle = () => {
    return match.metadata.occupationTitle || match.metadata.title || match.title;
  };

  // Get job description from backend data
  const getJobDescription = () => {
    const description = match.metadata?.description || 
                       match.metadata?.jobDescription || 
                       match.metadata?.summary || 
                       'No description available';
    
    // Debug: Log the description data
    console.log('Job Description Debug:', {
      metadata: match.metadata,
      description: description,
      hasDescription: !!match.metadata?.description
    });
    
    return description;
  };

  // Mock job data for demonstration (fallback data)
  const mockJobData = {
    growthRate: 12.5,
    demandLevel: 'High',
    sector: 'Education',
    grade: 'Professional',
    subjects: ['Reading', 'Writing', 'Arithmetic', 'Language Arts', 'Social Studies', 'Science', 'Physical Education'],
    assessments: ['Conduct regular tests and examinations', 'Prepare progress reports', 'Maintain attendance records', 'Evaluate student performance'],
    extracurricular: ['Organize school events', 'Supervise student clubs', 'Participate in parent-teacher meetings', 'Attend professional development workshops'],
    administrative: ['Maintain student records', 'Prepare lesson plans', 'Attend staff meetings', 'Collaborate with other teachers']
  };

  const handleFeedback = (isHelpful: boolean) => {
    setFeedbackSubmitted(true);
    // Here you would typically send feedback to your backend
    console.log('Feedback submitted:', isHelpful);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-6xl mx-auto"
    >
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-500 dark:from-navy-900 dark:via-navy-800 dark:to-gold-600 shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        {/* Header Content */}
        <div className="relative p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
            {/* Left Section - Title and Ministry Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/logo.svg"
                  alt="Government of India"
                  className="h-12 w-auto opacity-90"
                />
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    {getJobTitle()}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-white/90 text-sm lg:text-base">
                    <span className="font-semibold">NCO {getNCOCode()}</span>
                    <span className="text-white/60">|</span>
                    <span className="font-medium">MoSPI</span>
                    <span className="text-white/60">|</span>
                    <span className="font-medium">Ministry of Statistics and Programme Implementation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <motion.button 
                onClick={onDownload}
                className="flex items-center px-4 py-2 bg-white/15 hover:bg-white/25 rounded-xl transition-all duration-200 text-white font-medium shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Export Report</span>
                <span className="sm:hidden">Export</span>
              </motion.button>
              <motion.button
                onClick={onShare}
                className="flex items-center px-4 py-2 bg-white/15 hover:bg-white/25 rounded-xl transition-all duration-200 text-white font-medium shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Share</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="mt-6 bg-white dark:bg-navy-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Professional Header with Score and Actions */}
        <div className="relative p-6 lg:p-10 bg-gradient-to-r from-primary-50 via-white to-secondary-50 dark:from-navy-700/50 dark:via-navy-700 dark:to-gold-500/10">
          {/* Professional Background Pattern */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 dark:from-gold-500 dark:to-navy-600"></div>
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23003366' fill-opacity='0.2'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '25px 25px'
            }}></div>
          </div>

          <div className="relative flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
            {/* Left Section - NCO Code and Title */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <motion.div 
                  onClick={handleCopy}
                  className={`bg-gradient-to-r ${getScoreColor(match.score)} text-white dark:text-navy-900 px-6 lg:px-8 py-4 rounded-2xl font-bold text-lg lg:text-xl shadow-hard hover:shadow-xl transition-all duration-200 cursor-pointer border-2 border-white/30 dark:border-navy-900/20 hover:border-white/50 dark:hover:border-navy-900/30 ${showCopyFeedback ? 'copy-feedback' : ''}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Click to copy NCO code"
                >
                  <div className="text-center">
                    <div className="text-xl lg:text-2xl font-black">NCO {getNCOCode()}</div>
                    <div className="text-xs lg:text-sm font-semibold opacity-90">Government Classification</div>
                  </div>
                </motion.div>
                
                <motion.button
                  onClick={handleCopy}
                  className="p-3 lg:p-4 rounded-xl bg-white/30 dark:bg-navy-900/30 hover:bg-white/60 dark:hover:bg-navy-900/50 transition-all duration-200 border-2 border-white/40 dark:border-gold-500/20 shadow-soft hover:shadow-medium"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Copy NCO Code"
                >
                  {copied ? (
                    <Check className="w-5 lg:w-6 h-5 lg:h-6 text-success-600 dark:text-success-400" />
                  ) : (
                    <Copy className="w-5 lg:w-6 h-5 lg:h-6 text-primary-600 dark:text-gold-400" />
                  )}
                </motion.button>

                <motion.button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className="p-3 lg:p-4 rounded-xl bg-white/30 dark:bg-navy-900/30 hover:bg-white/60 dark:hover:bg-navy-900/50 transition-all duration-200 border-2 border-white/40 dark:border-gold-500/20 shadow-soft hover:shadow-medium"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Bookmark className={`w-5 lg:w-6 h-5 lg:h-6 ${isBookmarked ? 'text-warning-500 fill-current' : 'text-primary-600 dark:text-gold-400'}`} />
                </motion.button>
              </div>

              <h2 className="text-3xl lg:text-4xl font-bold gradient-text-primary mb-6 text-shadow-md">
                {getJobTitle()}
              </h2>
              
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="inline-flex items-center gap-2 bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300 text-sm lg:text-base font-bold px-4 py-2 rounded-xl border border-success-200 dark:border-success-700">
                  <Award className="w-4 h-4" />
                  Professional Grade
                </span>
                <span className="inline-flex items-center gap-2 bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300 text-sm lg:text-base font-bold px-4 py-2 rounded-xl border border-warning-200 dark:border-warning-700">
                  <TrendingUp className="w-4 h-4" />
                  High Demand
                </span>
                <span className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm lg:text-base font-bold px-4 py-2 rounded-xl border border-primary-200 dark:border-primary-700">
                  <Users className="w-4 h-4" />
                  Growth: +{mockJobData.growthRate}%
                </span>
              </div>
            </div>

            {/* Right Section - Score Display */}
            <div className="flex flex-col items-center lg:items-end gap-4">
              <div className="relative">
                <div className="w-32 h-32 lg:w-40 lg:h-40 relative">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-neutral-200 dark:text-neutral-700"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke={getScoreColor(match.score)}
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${progressAnimation * 2.83} 283`}
                      className="transition-all duration-2000"
                      style={{
                        filter: `drop-shadow(0 0 4px ${getScoreColor(match.score)}40)`
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl lg:text-3xl font-bold text-blue-700 dark:text-blue-300">
                      {displayValue}%
                    </div>
                    <div className="text-sm lg:text-base font-medium text-blue-600 dark:text-blue-400 text-center">
                      {getScoreLabel(match.score)}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* AI Confidence Indicator */}
              <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl border border-blue-200 dark:border-blue-700">
                <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  AI Confidence: {displayValue >= 95 ? 'Excellent' : displayValue >= 90 ? 'Very Good' : displayValue >= 85 ? 'Good' : displayValue >= 80 ? 'Fair' : 'Good'} ({displayValue}%+)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="p-6 lg:p-10 space-y-8">
          {/* Official Job Description */}
          <section>
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-3">
              <FileText className="w-6 h-6 text-primary-600 dark:text-gold-400" />
              Official Job Description
            </h3>
            <div className="bg-gradient-to-br from-neutral-50 via-white to-primary-50/30 dark:from-navy-700/50 dark:via-navy-700 dark:to-gold-500/10 rounded-2xl p-8 border-2 border-neutral-200 dark:border-navy-600 shadow-lg">
              <div className="prose prose-lg max-w-none">
                <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed text-lg font-medium whitespace-pre-wrap">
                  {getJobDescription()}
                </p>
              </div>
              {!match.metadata?.description && (
                <div className="mt-4 p-4 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-700 rounded-xl">
                  <p className="text-warning-700 dark:text-warning-300 text-sm">
                    ⚠️ Note: This is a fallback description. The actual job description from the backend will be displayed when available.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Classification and Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Classification</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-navy-700/50 rounded-xl">
                  <span className="text-neutral-600 dark:text-neutral-400">Grade</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{mockJobData.grade}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-navy-700/50 rounded-xl">
                  <span className="text-neutral-600 dark:text-neutral-400">Demand</span>
                  <span className="font-semibold text-success-600 dark:text-success-400">{mockJobData.demandLevel} Growth</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-navy-700/50 rounded-xl">
                  <span className="text-neutral-600 dark:text-neutral-400">Sector</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{mockJobData.sector}</span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Teaching Subjects</h3>
              <div className="space-y-2">
                {mockJobData.subjects.map((subject, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-neutral-50 dark:bg-navy-700/50 rounded-lg">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span className="text-neutral-700 dark:text-neutral-300">{subject}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Assessment & Records</h3>
              <div className="space-y-2">
                {mockJobData.assessments.map((assessment, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-neutral-50 dark:bg-navy-700/50 rounded-lg">
                    <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
                    <span className="text-neutral-700 dark:text-neutral-300 text-sm">{assessment}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Additional Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Extracurricular Activities</h3>
              <div className="space-y-2">
                {mockJobData.extracurricular.map((activity, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-neutral-50 dark:bg-navy-700/50 rounded-lg">
                    <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                    <span className="text-neutral-700 dark:text-neutral-300 text-sm">{activity}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Administrative Duties</h3>
              <div className="space-y-2">
                {mockJobData.administrative.map((duty, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-neutral-50 dark:bg-navy-700/50 rounded-lg">
                    <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                    <span className="text-neutral-700 dark:text-neutral-300 text-sm">{duty}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Match Analysis */}
          <section className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl p-6 border border-primary-200 dark:border-primary-700">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-3">
              <Target className="w-5 h-5 text-primary-600 dark:text-gold-400" />
              Match Analysis
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600 dark:text-neutral-400">Your job description:</span>
                <span className="font-medium text-neutral-900 dark:text-white text-right max-w-md">"{searchInput}"</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600 dark:text-neutral-400">AI Confidence:</span>
                <span className="font-semibold text-success-600 dark:text-success-400">
                  {displayValue >= 95 ? 'Excellent' : displayValue >= 90 ? 'Very Good' : displayValue >= 85 ? 'Good' : displayValue >= 80 ? 'Fair' : 'Good'} ({displayValue}%+)
                </span>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-6 border-t border-neutral-200 dark:border-navy-600">
            <motion.button
              onClick={onDownload}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-5 h-5" />
              Download Report
            </motion.button>
            
            <motion.button
              onClick={onShare}
              className="flex items-center gap-2 px-6 py-3 bg-secondary-600 hover:bg-secondary-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Share2 className="w-5 h-5" />
              Share Result
            </motion.button>
            
            <motion.button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-6 py-3 bg-neutral-600 hover:bg-neutral-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Printer className="w-5 h-5" />
              Print
            </motion.button>
          </div>

          {/* Feedback Section */}
          {!feedbackSubmitted ? (
            <div className="text-center pt-6 border-t border-neutral-200 dark:border-navy-600">
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">Was this result helpful?</p>
              <div className="flex items-center justify-center gap-4">
                <motion.button
                  onClick={() => handleFeedback(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-success-100 hover:bg-success-200 text-success-700 font-medium rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ThumbsUp className="w-4 h-4" />
                  Yes, helpful
                </motion.button>
                <motion.button
                  onClick={() => handleFeedback(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-error-100 hover:bg-error-200 text-error-700 font-medium rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ThumbsDown className="w-4 h-4" />
                  Not helpful
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="text-center pt-6 border-t border-neutral-200 dark:border-navy-600">
              <p className="text-success-600 dark:text-success-400 font-medium">Thank you for your feedback!</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedResultCard;