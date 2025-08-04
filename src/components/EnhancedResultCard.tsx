import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Copy, 
  Check, 
  Download, 
  Share2, 
  TrendingUp, 
  Bookmark, 
  ExternalLink,
  Target,
  Users,
  DollarSign,
  MapPin,
  Info
} from 'lucide-react';
import CountUp from 'react-countup';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'career'>('overview');

  // Helper functions
  const formatMatchScore = (score: number) => {
    if (score < 0.2) {
      return Math.round(score * 1000) / 10;
    }
    return Math.round(score * 100);
  };

  const getScoreColor = (score: number) => {
    const percentage = score * 100;
    if (percentage >= 80) return 'from-success-500 to-accent-500';
    if (percentage >= 60) return 'from-primary-500 to-secondary-500';
    if (percentage >= 40) return 'from-warning-500 to-warning-600';
    if (percentage >= 20) return 'from-orange-500 to-red-500';
    return 'from-error-500 to-error-600';
  };

  const getScoreLabel = (score: number) => {
    const percentage = score * 100;
    if (percentage >= 80) return { label: 'Excellent Match', emoji: '🎯' };
    if (percentage >= 60) return { label: 'Good Match', emoji: '✅' };
    if (percentage >= 40) return { label: 'Fair Match', emoji: '⚡' };
    if (percentage >= 20) return { label: 'Poor Match', emoji: '⚠️' };
    return { label: 'Very Poor Match', emoji: '❌' };
  };

  const getNCOCode = () => match.metadata?.nco_code || 'Unknown';
  const getJobTitle = () => match.metadata?.title || match.title || 'Unknown';
  const getJobDescription = () => match.metadata?.description || 'No description available';

  const mockJobData = {
    salaryRange: { min: 65000, max: 120000, currency: 'AED' },
    demandLevel: 85,
    growthRate: 12.5,
    jobOpenings: 1247,
    locations: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'],
    careerPath: ['Entry Level', 'Mid Level', 'Senior Level', 'Leadership Role']
  };

  const scoreInfo = getScoreLabel(match.score);

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
              <div className={`bg-gradient-to-r ${getScoreColor(match.score)} text-white px-6 py-3 rounded-2xl font-bold text-xl shadow-medium`}>
                NCO {getNCOCode()}
              </div>
              
              <motion.button
                onClick={onCopyCode}
                className="p-3 rounded-xl hover:bg-white/50 dark:hover:bg-black/20 transition-colors"
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

            <h2 className="text-3xl font-bold text-neutral-800 dark:text-white mb-2">
              {getJobTitle()}
            </h2>
            
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300 px-3 py-1 rounded-full text-sm font-medium">
                Professional
              </span>
              <span className="bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-300 px-3 py-1 rounded-full text-sm font-medium">
                High Demand
              </span>
              <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-medium">
                Growth: +{mockJobData.growthRate}%
              </span>
            </div>
          </div>

          {/* Score Display */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${getScoreColor(match.score)} p-1 shadow-glow-lg`}>
                <div className="w-full h-full bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-2xl font-bold bg-gradient-to-r ${getScoreColor(match.score)} bg-clip-text text-transparent`}>
                      <CountUp end={formatMatchScore(match.score)} duration={2} />%
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 text-2xl animate-float">
                {scoreInfo.emoji}
              </div>
            </div>
            <div className="mt-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400">
              {scoreInfo.label}
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/60 dark:bg-black/20 rounded-xl p-4 text-center backdrop-blur-xs">
            <DollarSign className="w-5 h-5 text-success-600 mx-auto mb-1" />
            <div className="text-sm font-semibold text-neutral-800 dark:text-white">
              {mockJobData.salaryRange.min/1000}k-{mockJobData.salaryRange.max/1000}k
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400">
              {mockJobData.salaryRange.currency}
            </div>
          </div>
          
          <div className="bg-white/60 dark:bg-black/20 rounded-xl p-4 text-center backdrop-blur-xs">
            <TrendingUp className="w-5 h-5 text-primary-600 mx-auto mb-1" />
            <div className="text-sm font-semibold text-neutral-800 dark:text-white">
              {mockJobData.demandLevel}%
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400">
              Market Demand
            </div>
          </div>
          
          <div className="bg-white/60 dark:bg-black/20 rounded-xl p-4 text-center backdrop-blur-xs">
            <Users className="w-5 h-5 text-secondary-600 mx-auto mb-1" />
            <div className="text-sm font-semibold text-neutral-800 dark:text-white">
              {mockJobData.jobOpenings.toLocaleString()}
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400">
              Open Positions
            </div>
          </div>
          
          <div className="bg-white/60 dark:bg-black/20 rounded-xl p-4 text-center backdrop-blur-xs">
            <MapPin className="w-5 h-5 text-accent-600 mx-auto mb-1" />
            <div className="text-sm font-semibold text-neutral-800 dark:text-white">
              {mockJobData.locations.length}
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400">
              Emirates
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Job Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-3">
            Job Description
          </h3>
          <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {getJobDescription()}
          </p>
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
                Your job description <span className="font-semibold">"{searchInput}"</span> aligns with this NCO code based on AI analysis of skills, responsibilities, and industry requirements. The semantic matching considers both explicit and implicit job characteristics.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="mb-6">
          <div className="flex gap-1 mb-4 bg-neutral-100 dark:bg-neutral-700 p-1 rounded-2xl">
            {[
              { key: 'overview', label: 'Overview', icon: Info },
              { key: 'career', label: 'Career Path', icon: TrendingUp }
            ].map(({ key, label, icon: Icon }) => (
              <motion.button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === key
                    ? 'bg-white dark:bg-neutral-600 text-primary-600 dark:text-primary-400 shadow-soft'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="min-h-[200px]"
            >
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-neutral-50 dark:bg-neutral-700 rounded-xl p-4">
                      <h5 className="font-semibold text-neutral-700 dark:text-neutral-300 text-sm mb-2">Division</h5>
                      <p className="text-neutral-900 dark:text-white font-medium">{match.metadata?.division || 'N/A'}</p>
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-700 rounded-xl p-4">
                      <h5 className="font-semibold text-neutral-700 dark:text-neutral-300 text-sm mb-2">Family</h5>
                      <p className="text-neutral-900 dark:text-white font-medium">{match.metadata?.family_title || 'N/A'}</p>
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-700 rounded-xl p-4">
                      <h5 className="font-semibold text-neutral-700 dark:text-neutral-300 text-sm mb-2">Group</h5>
                      <p className="text-neutral-900 dark:text-white font-medium">{match.metadata?.group || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-neutral-50 dark:bg-neutral-700 rounded-xl p-4">
                      <h5 className="font-semibold text-neutral-700 dark:text-neutral-300 text-sm mb-2">Job Category</h5>
                      <p className="text-neutral-900 dark:text-white font-medium">Professional Services</p>
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-700 rounded-xl p-4">
                      <h5 className="font-semibold text-neutral-700 dark:text-neutral-300 text-sm mb-2">Employment Type</h5>
                      <p className="text-neutral-900 dark:text-white font-medium">Full-time Position</p>
                    </div>
                  </div>
                </div>
              )}



              {activeTab === 'career' && (
                <div className="space-y-6">
                  <div>
                    <h5 className="font-semibold text-neutral-800 dark:text-white mb-4">Career Progression Path</h5>
                    <div className="relative">
                      {mockJobData.careerPath.map((role, index) => (
                        <div key={role} className="flex items-center mb-4 last:mb-0">
                          <div className={`w-4 h-4 rounded-full ${index <= 1 ? 'bg-primary-500' : 'bg-neutral-300 dark:bg-neutral-600'} flex-shrink-0`}></div>
                          <div className="ml-4 flex-1">
                            <div className={`font-medium ${index <= 1 ? 'text-primary-700 dark:text-primary-300' : 'text-neutral-600 dark:text-neutral-400'}`}>
                              {role}
                            </div>
                            {index < mockJobData.careerPath.length - 1 && (
                              <div className="w-px h-8 bg-neutral-200 dark:bg-neutral-600 ml-2 mt-2"></div>
                            )}
                          </div>
                          {index <= 1 && (
                            <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-lg text-xs">
                              Current Level
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-accent-50 to-success-50 dark:from-accent-900/20 dark:to-success-900/20 rounded-xl p-4 border border-accent-200 dark:border-accent-700">
                    <h5 className="font-semibold text-accent-800 dark:text-accent-300 mb-2">💡 Career Tips</h5>
                    <ul className="space-y-1 text-sm text-accent-700 dark:text-accent-200">
                      <li>• Build a strong portfolio showcasing diverse projects</li>
                      <li>• Stay updated with latest technology trends</li>
                      <li>• Network with industry professionals</li>
                      <li>• Consider pursuing advanced certifications</li>
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

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
            className="flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-2xl font-medium shadow-medium hover:shadow-hard transition-all"
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