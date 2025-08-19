import { useState, useRef, useEffect } from 'react';

interface UseLazyImageOptions {
  rootMargin?: string;
  threshold?: number;
  fallbackSrc?: string;
}

interface UseLazyImageReturn {
  imageRef: React.RefObject<HTMLImageElement>;
  isInView: boolean;
  isLoaded: boolean;
  hasError: boolean;
  loadImage: () => void;
}

/**
 * Custom hook for lazy loading images using Intersection Observer
 * 
 * @param options - Configuration options for the lazy loading
 * @returns Object containing refs and state for lazy loading
 */
export function useLazyImage(options: UseLazyImageOptions = {}): UseLazyImageReturn {
  const {
    rootMargin = '50px',
    threshold = 0.1,
    fallbackSrc
  } = options;

  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin,
        threshold
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [rootMargin, threshold]);

  // Handle image load events
  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
    
    // Try fallback image if provided
    if (fallbackSrc && imageRef.current) {
      imageRef.current.src = fallbackSrc;
    }
  };

  // Manual load trigger
  const loadImage = () => {
    if (imageRef.current && !isInView) {
      setIsInView(true);
    }
  };

  return {
    imageRef,
    isInView,
    isLoaded,
    hasError,
    loadImage
  };
}

/**
 * Hook for lazy loading multiple images in a grid or list
 * 
 * @param count - Number of images to lazy load
 * @param options - Configuration options
 * @returns Array of lazy loading states
 */
export function useLazyImageGrid(
  count: number,
  options: UseLazyImageOptions = {}
): UseLazyImageReturn[] {
  return Array.from({ length: count }, () => useLazyImage(options));
}

/**
 * Hook for lazy loading images with priority (e.g., above-the-fold images)
 * 
 * @param priority - Whether this image should load immediately
 * @param options - Configuration options
 * @returns Object containing refs and state for lazy loading
 */
export function usePriorityLazyImage(
  priority: boolean = false,
  options: UseLazyImageOptions = {}
): UseLazyImageReturn {
  const [isInView, setIsInView] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // For priority images, load immediately
  useEffect(() => {
    if (priority) {
      setIsInView(true);
    }
  }, [priority]);

  // Intersection Observer for non-priority images
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: options.rootMargin || '50px',
        threshold: options.threshold || 0.1
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [priority, options.rootMargin, options.threshold]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
    
    if (options.fallbackSrc && imageRef.current) {
      imageRef.current.src = options.fallbackSrc;
    }
  };

  const loadImage = () => {
    if (imageRef.current && !isInView) {
      setIsInView(true);
    }
  };

  return {
    imageRef,
    isInView,
    isLoaded,
    hasError,
    loadImage
  };
}
