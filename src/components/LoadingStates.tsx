import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles, Zap, Brain, Target } from 'lucide-react';

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse bg-neutral-200 dark:bg-neutral-700 rounded ${className}`}></div>
);

export const SearchLoadingState: React.FC = () => (
  <motion.div 
    className="bg-white dark:bg-neutral-800 rounded-3xl shadow-hard p-8 border border-neutral-200 dark:border-neutral-700"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="text-center">
      <div className="relative inline-block mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-glow">
          <Brain className="w-8 h-8 text-white animate-pulse" />
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center animate-bounce">
          <Sparkles className="w-3 h-3 text-white" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-neutral-800 dark:text-white mb-2">
        AI is Analyzing Your Job Description
      </h3>
      <p className="text-neutral-600 dark:text-neutral-400 mb-6">
        Our advanced AI is processing semantic meaning and matching against UAE NCO codes...
      </p>
      
      <div className="space-y-3 mb-6">
        {[
          { icon: Target, text: "Analyzing job requirements", delay: 0 },
          { icon: Brain, text: "Processing semantic similarity", delay: 0.5 },
          { icon: Zap, text: "Matching with NCO database", delay: 1 },
        ].map(({ icon: Icon, text, delay }, index) => (
          <motion.div
            key={index}
            className="flex items-center justify-center gap-3 text-neutral-600 dark:text-neutral-400"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay }}
          >
            <Icon className="w-4 h-4 text-primary-500" />
            <span className="text-sm">{text}</span>
            <motion.div
              className="w-2 h-2 bg-primary-500 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay }}
            />
          </motion.div>
        ))}
      </div>
      
      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
      </div>
    </div>
  </motion.div>
);

export const ResultsSkeleton: React.FC = () => (
  <motion.div 
    className="bg-white dark:bg-neutral-800 rounded-3xl shadow-hard p-8 border border-neutral-200 dark:border-neutral-700"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    {/* Header Skeleton */}
    <div className="flex justify-between items-start mb-8">
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="w-32 h-12" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
        <Skeleton className="w-64 h-8 mb-2" />
        <div className="flex gap-2">
          <Skeleton className="w-20 h-6 rounded-full" />
          <Skeleton className="w-24 h-6 rounded-full" />
          <Skeleton className="w-28 h-6 rounded-full" />
        </div>
      </div>
      <Skeleton className="w-24 h-24 rounded-full" />
    </div>
    
    {/* Stats Skeleton */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-neutral-50 dark:bg-neutral-700 rounded-xl p-4">
          <Skeleton className="w-6 h-6 mx-auto mb-2" />
          <Skeleton className="w-12 h-4 mx-auto mb-1" />
          <Skeleton className="w-16 h-3 mx-auto" />
        </div>
      ))}
    </div>
    
    {/* Content Skeleton */}
    <div className="space-y-4 mb-8">
      <Skeleton className="w-32 h-6" />
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-5/6 h-4" />
      <Skeleton className="w-4/5 h-4" />
    </div>
    
    {/* Actions Skeleton */}
    <div className="flex gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-700">
      <Skeleton className="w-32 h-12 rounded-xl" />
      <Skeleton className="w-28 h-12 rounded-xl" />
      <Skeleton className="w-36 h-12 rounded-xl" />
    </div>
  </motion.div>
);

export const ChatLoadingState: React.FC = () => (
  <motion.div 
    className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-3xl shadow-hard p-8 border border-primary-200 dark:border-primary-700"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-glow">
        <Sparkles className="w-6 h-6 text-white animate-pulse" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-neutral-800 dark:text-white">
          AI Career Analysis
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Generating comprehensive career insights...
        </p>
      </div>
    </div>
    
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        >
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-5/6 h-4" />
          {i < 4 && <div className="h-2" />}
        </motion.div>
      ))}
    </div>
    
    <div className="mt-6 flex items-center gap-3">
      <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
      <span className="text-sm text-primary-700 dark:text-primary-300">
        This may take a few moments for detailed analysis...
      </span>
    </div>
  </motion.div>
);

interface ProgressBarProps {
  progress: number;
  label: string;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  label, 
  color = 'from-primary-500 to-secondary-500' 
}) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="text-neutral-600 dark:text-neutral-400">{label}</span>
      <span className="font-medium text-neutral-800 dark:text-white">{progress}%</span>
    </div>
    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
      <motion.div
        className={`h-full bg-gradient-to-r ${color} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    </div>
  </div>
);

export const ErrorState: React.FC<{ 
  message: string; 
  onRetry?: () => void;
  type?: 'error' | 'warning' | 'info';
}> = ({ message, onRetry, type = 'error' }) => {
  const colors = {
    error: 'from-error-50 to-error-100 dark:from-error-900/20 dark:to-error-800/20 border-error-200 dark:border-error-700',
    warning: 'from-warning-50 to-warning-100 dark:from-warning-900/20 dark:to-warning-800/20 border-warning-200 dark:border-warning-700',
    info: 'from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-700'
  };
  
  const iconColors = {
    error: 'text-error-600 dark:text-error-400',
    warning: 'text-warning-600 dark:text-warning-400',
    info: 'text-primary-600 dark:text-primary-400'
  };

  return (
    <motion.div 
      className={`bg-gradient-to-r ${colors[type]} rounded-2xl p-6 border shadow-soft`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center shadow-soft ${iconColors[type]}`}>
          {type === 'error' && '⚠️'}
          {type === 'warning' && '🔔'}
          {type === 'info' && 'ℹ️'}
        </div>
        <div className="flex-1">
          <p className={`${type === 'error' ? 'text-error-800 dark:text-error-200' : type === 'warning' ? 'text-warning-800 dark:text-warning-200' : 'text-primary-800 dark:text-primary-200'} leading-relaxed`}>
            {message}
          </p>
          {onRetry && (
            <motion.button
              onClick={onRetry}
              className={`mt-4 px-4 py-2 bg-white dark:bg-neutral-800 ${iconColors[type]} rounded-xl font-medium shadow-soft hover:shadow-medium transition-all`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};