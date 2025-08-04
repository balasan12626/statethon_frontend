import React, { Suspense, lazy, Component, ErrorInfo, ReactNode } from 'react';
import { ResultsSkeleton, ErrorState } from './LoadingStates';

// Lazy load heavy components
const EnhancedStatsSection = lazy(() => import('./EnhancedStatsSection'));
const FloatingChatbot = lazy(() => import('./FloatingChatbot'));

// Custom Error Boundary component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, resetError: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Component error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }
      return (
        <ErrorState
          message={`Something went wrong: ${this.state.error.message}`}
          onRetry={this.resetError}
          type="error"
        />
      );
    }

    return this.props.children;
  }
}

// Lazy wrapper component
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  fallback = <ResultsSkeleton />
}) => (
  <ErrorBoundary
    onError={(error) => console.error('Component error:', error)}
  >
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

// Lazy Stats Component
export const LazyEnhancedStats: React.FC = () => (
  <LazyWrapper>
    <EnhancedStatsSection />
  </LazyWrapper>
);

// Lazy Chatbot Component
export const LazyFloatingChatbot: React.FC = () => (
  <LazyWrapper fallback={<div />}>
    <FloatingChatbot />
  </LazyWrapper>
);

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [hasIntersected, setHasIntersected] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      if (entry.isIntersecting && !hasIntersected) {
        setHasIntersected(true);
      }
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, options, hasIntersected]);

  return { isIntersecting, hasIntersected };
};

// Lazy loading component that only renders when in viewport
interface LazyOnViewProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
}

export const LazyOnView: React.FC<LazyOnViewProps> = ({
  children,
  fallback = <div className="h-32" />,
  rootMargin = '100px',
  threshold = 0.1
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { hasIntersected } = useIntersectionObserver(ref, {
    rootMargin,
    threshold
  });

  return (
    <div ref={ref}>
      {hasIntersected ? children : fallback}
    </div>
  );
};

// Image lazy loading component
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3C/svg%3E',
  ...props
}) => {
  const [imageSrc, setImageSrc] = React.useState(placeholder);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const { hasIntersected } = useIntersectionObserver(imgRef);

  React.useEffect(() => {
    if (hasIntersected && !imageLoaded) {
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setImageLoaded(true);
      };
      img.src = src;
    }
  }, [hasIntersected, src, imageLoaded]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-50'} ${className}`}
      {...props}
    />
  );
};