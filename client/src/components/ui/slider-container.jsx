import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const SliderContainer = ({ 
  children, 
  className, 
  itemWidth = 320, // Default width of each item
  gap = 24, // Gap between items
  visibleItems = 3, // Number of items visible at once
  autoPlay = false,
  autoPlayInterval = 5000, // 5 seconds
  showArrows = true,
  showDots = true,
  title,
  description
}) => {
  // Responsive handling for mobile view
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Adjust visible items based on screen size - mobile shows 1, tablet shows 2, desktop shows 3
  const responsiveVisibleItems = windowWidth < 640 ? 1 : windowWidth < 1024 ? 2 : visibleItems;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sliderRef = useRef(null);
  const totalItems = React.Children.count(children);
  const maxIndex = Math.max(0, totalItems - responsiveVisibleItems);

  // Auto play functionality
  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      if (currentIndex < maxIndex) {
        handleNext();
      } else {
        setCurrentIndex(0);
      }
    }, autoPlayInterval);
    
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, currentIndex, maxIndex]);

  const handlePrev = () => {
    if (isAnimating || currentIndex <= 0) return;
    setIsAnimating(true);
    // Always move exactly by responsiveVisibleItems cards at a time
    const newIndex = Math.max(0, currentIndex - responsiveVisibleItems);
    setCurrentIndex(newIndex);
    setTimeout(() => setIsAnimating(false), 500); // Match this with CSS transition duration
  };

  const handleNext = () => {
    if (isAnimating || currentIndex >= maxIndex) return;
    setIsAnimating(true);
    // Always move exactly by responsiveVisibleItems cards at a time
    const newIndex = Math.min(maxIndex, currentIndex + responsiveVisibleItems);
    setCurrentIndex(newIndex);
    setTimeout(() => setIsAnimating(false), 500); // Match this with CSS transition duration
  };

  const goToSlide = (index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    // Ensure we always move to a multiple of responsiveVisibleItems
    const alignedIndex = Math.floor(index / responsiveVisibleItems) * responsiveVisibleItems;
    setCurrentIndex(alignedIndex);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) { // Swipe left (next)
      handleNext();
    }
    if (touchStart - touchEnd < -75) { // Swipe right (prev)
      handlePrev();
    }
  };

  // Calculate responsive item width based on screen size for translateX
  // Adjust the calculation to ensure exactly the right number of items are visible with no partial items
  const getContainerWidth = () => {
    // For mobile view (< 640px)
    if (windowWidth < 640) {
      // Use full width minus larger padding for single item on mobile
      return Math.min(windowWidth - 64, itemWidth); // Increased padding for mobile
    }
    
    // For tablet view (640px - 1024px)
    if (windowWidth < 1024) {
      // Calculate width to fit exactly 2 items with gap
      const availableWidth = windowWidth - 80; // 40px padding on each side (increased)
      const totalGapWidth = gap * (2 - 1); // Gap between 2 items
      const exactItemWidth = (availableWidth - totalGapWidth) / 2;
      return Math.min(exactItemWidth, itemWidth);
    }
    
    // For desktop view (>= 1024px)
    // Calculate width to fit exactly visibleItems with gaps
    const availableWidth = windowWidth - 96; // 48px padding on each side (increased padding)
    const totalGapWidth = gap * (responsiveVisibleItems - 1); // Gaps between visible items
    const exactItemWidth = (availableWidth - totalGapWidth) / responsiveVisibleItems;
    
    return Math.min(exactItemWidth, itemWidth);
  };
  
  const responsiveItemWidth = getContainerWidth();
  const translateX = -currentIndex * (responsiveItemWidth + gap);

  // Calculate total width of the slider content - ensure it's exactly the width needed for visible items
  const sliderContentWidth = responsiveVisibleItems * (responsiveItemWidth + gap) - gap;

  return (
    <div className={cn("w-full py-8", className)}>
      {(title || description) && (
        <div className="text-center mb-8">
          {title && <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">{title}</h2>}
          {description && <p className="mt-2 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">{description}</p>}
        </div>
      )}
      
      <div className="relative overflow-hidden rounded-xl mx-auto">
        {showArrows && (
          <>
            <button 
              onClick={handlePrev}
              disabled={currentIndex <= 0}
              className={cn(
                "absolute left-1 sm:left-2 top-1/2 z-10 -translate-y-1/2 flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg text-gray-800 dark:text-white hover:bg-white dark:hover:bg-gray-800 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                currentIndex <= 0 ? "opacity-40 cursor-not-allowed" : "opacity-100 cursor-pointer"
              )}
              aria-label="Previous slide"
            >
              <FaChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            <button 
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className={cn(
                "absolute right-1 sm:right-2 top-1/2 z-10 -translate-y-1/2 flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg text-gray-800 dark:text-white hover:bg-white dark:hover:bg-gray-800 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                currentIndex >= maxIndex ? "opacity-40 cursor-not-allowed" : "opacity-100 cursor-pointer"
              )}
              aria-label="Next slide"
            >
              <FaChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}
        
        <div 
          ref={sliderRef}
          className="overflow-hidden px-3 sm:px-5 py-4 mx-auto"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ 
            maxWidth: `${sliderContentWidth}px`,
            width: '100%', // Ensure it takes full width up to the max
            borderRadius: '8px' // Add rounded corners
          }}
        >
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ 
              transform: `translateX(${translateX}px)`,
              gap: `${gap}px`
            }}
          >
            {React.Children.map(children, (child, index) => {
              // Use the same width calculation for consistency
              const itemStyle = { width: `${responsiveItemWidth}px` };
              
              return (
                <div 
                  key={index} 
                  className="flex-shrink-0 transition-all duration-300 hover:scale-[1.02]"
                  style={itemStyle}
                >
                  {child}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {showDots && totalItems > responsiveVisibleItems && (
        <div className="flex justify-center mt-5 mb-2 space-x-2 sm:space-x-3">
          {Array.from({ length: Math.ceil(totalItems / responsiveVisibleItems) }).map((_, index) => {
            // Calculate if this dot represents the current visible group
            const isActive = index === Math.floor(currentIndex / responsiveVisibleItems);
            return (
              <button
                key={index}
                onClick={() => goToSlide(index * responsiveVisibleItems)}
                className={cn(
                  "transition-all duration-300 rounded-full",
                  isActive 
                    ? "bg-indigo-600 w-5 sm:w-6 h-2.5" 
                    : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 w-2.5 sm:w-3 h-2.5"
                )}
                aria-label={`Go to slide group ${index + 1}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SliderContainer;