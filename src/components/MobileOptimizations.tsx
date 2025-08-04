import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  X, 
  ArrowUp,
  Share,
  Download
} from 'lucide-react';

// Hook to detect mobile device
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return isMobile;
};

// Hook for touch gestures
export const useSwipeGesture = (onSwipeLeft?: () => void, onSwipeRight?: () => void) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onSwipeLeft) onSwipeLeft();
    if (isRightSwipe && onSwipeRight) onSwipeRight();
  };

  return { onTouchStart, onTouchMove, onTouchEnd };
};

// Collapsible section component
interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultOpen = false,
  icon
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-neutral-200 dark:border-neutral-700 rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium text-neutral-800 dark:text-white">
            {title}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-neutral-500" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-white dark:bg-neutral-800">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Mobile sticky header
interface MobileStickyHeaderProps {
  isVisible: boolean;
  children: React.ReactNode;
}

export const MobileStickyHeader: React.FC<MobileStickyHeaderProps> = ({
  isVisible,
  children
}) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-lg border-b border-neutral-200 dark:border-neutral-700"
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

// Mobile bottom sheet
interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  title
}) => {
  const swipeHandlers = useSwipeGesture(undefined, onClose);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-800 rounded-t-3xl z-50 max-h-[80vh] overflow-hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            {...swipeHandlers}
          >
            {/* Handle */}
            <div className="flex justify-center py-3">
              <div className="w-12 h-1 bg-neutral-300 dark:bg-neutral-600 rounded-full" />
            </div>

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(80vh-120px)] p-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Mobile FAB (Floating Action Button)
interface MobileFABProps {
  onClick: () => void;
  icon: React.ReactNode;
  label?: string;
  variant?: 'primary' | 'secondary';
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
}

export const MobileFAB: React.FC<MobileFABProps> = ({
  onClick,
  icon,
  label,
  variant = 'primary',
  position = 'bottom-right'
}) => {
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-glow',
    secondary: 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white shadow-hard'
  };

  return (
    <motion.button
      onClick={onClick}
      className={`fixed ${positionClasses[position]} ${variantClasses[variant]} rounded-full p-4 z-40 transition-all`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={label}
    >
      {icon}
    </motion.button>
  );
};

// Mobile optimized card stack
interface MobileCardStackProps {
  cards: React.ReactNode[];
  currentIndex: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export const MobileCardStack: React.FC<MobileCardStackProps> = ({
  cards,
  currentIndex,
  onSwipeLeft,
  onSwipeRight
}) => {
  const swipeHandlers = useSwipeGesture(onSwipeLeft, onSwipeRight);

  return (
    <div className="relative overflow-hidden" {...swipeHandlers}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {cards[currentIndex]}
        </motion.div>
      </AnimatePresence>
      
      {/* Pagination dots */}
      <div className="flex justify-center gap-2 mt-4">
        {cards.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex
                ? 'bg-primary-500'
                : 'bg-neutral-300 dark:bg-neutral-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Scroll to top button
export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 w-12 h-12 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white rounded-full shadow-hard z-40"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6 mx-auto" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// Mobile share menu
interface MobileShareMenuProps {
  isOpen: boolean;
  onClose: () => void;
  shareData: {
    title: string;
    text: string;
    url: string;
  };
}

export const MobileShareMenu: React.FC<MobileShareMenuProps> = ({
  isOpen,
  onClose,
  shareData
}) => {
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        onClose();
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      onClose();
    } catch (err) {
      console.error('Error copying:', err);
    }
  };

  return (
    <MobileBottomSheet isOpen={isOpen} onClose={onClose} title="Share Results">
      <div className="space-y-4">
        {(typeof navigator !== 'undefined' && 'share' in navigator) && (
          <button
            onClick={handleNativeShare}
            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors"
          >
            <Share className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <span className="text-neutral-800 dark:text-white font-medium">
              Share via Apps
            </span>
          </button>
        )}
        
        <button
          onClick={handleCopyLink}
          className="w-full flex items-center gap-3 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors"
        >
          <Download className="w-5 h-5 text-accent-600 dark:text-accent-400" />
          <span className="text-neutral-800 dark:text-white font-medium">
            Copy Link
          </span>
        </button>
      </div>
    </MobileBottomSheet>
  );
};