import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const SliderContainer = ({ 
  children, 
  className, 
  itemWidth = 320, // Default width of each item
  gap = 24, // Gap between items
  visibleItems = { mobile: 1, tablet: 2, desktop: 3 }, // Number of items visible at once
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
  // Handle both object and number formats for visibleItems prop
  const getResponsiveVisibleItems = () => {
    if (typeof visibleItems === 'object') {
      if (windowWidth < 640) return visibleItems.mobile || 1;
      if (windowWidth < 1024) return visibleItems.tablet || 2;
      return visibleItems.desktop || 3;
    }
    // Legacy support for number format
    return windowWidth < 640 ? 1 : windowWidth < 1024 ? 2 : visibleItems;
  };
  
  const responsiveVisibleItems = getResponsiveVisibleItems();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const sliderRef = useRef(null);
  const totalItems = React.Children.count(children);
  const maxIndex = Math.max(0, totalItems - responsiveVisibleItems);

  // Auto play functionality
  useEffect(() => {
    if (!autoPlay || isDragging) return;
    
    const interval = setInterval(() => {
      if (currentIndex < maxIndex) {
        handleNext();
      } else {
        setCurrentIndex(0);
      }
    }, autoPlayInterval);
    
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, currentIndex, maxIndex, isDragging]);

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

  // Touch handlers for mobile swipe with improved sensitivity
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(e.targetTouches[0].clientX);
    setIsDragging(true);
    setDragStartX(e.targetTouches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    setTouchEnd(e.targetTouches[0].clientX);
    
    // Calculate drag offset for smooth animation during dragging
    const currentDragOffset = e.targetTouches[0].clientX - dragStartX;
    setDragOffset(currentDragOffset);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    setDragOffset(0);
    
    // Minimum swipe distance threshold (adjusted for better sensitivity)
    const minSwipeDistance = 50;
    const swipeDistance = touchStart - touchEnd;
    
    if (swipeDistance > minSwipeDistance && currentIndex < maxIndex) {
      // Swiped left - go to next slide
      handleNext();
    } else if (swipeDistance < -minSwipeDistance && currentIndex > 0) {
      // Swiped right - go to previous slide
      handlePrev();
    }
  };

  // Mouse drag handlers for desktop
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragOffset(0);
    
    // Prevent text selection during dragging
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    // Calculate drag offset for smooth animation during dragging
    const currentDragOffset = e.clientX - dragStartX;
    setDragOffset(currentDragOffset);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Minimum drag distance threshold
    const minDragDistance = 50;
    const dragDistance = dragStartX - (dragStartX + dragOffset);
    
    if (dragDistance > minDragDistance && currentIndex < maxIndex) {
      // Dragged left - go to next slide
      handleNext();
    } else if (dragDistance < -minDragDistance && currentIndex > 0) {
      // Dragged right - go to previous slide
      handlePrev();
    }
    
    setDragOffset(0);
  };

  // Calculate the width of each item based on the container width and visible items
  const getContainerWidth = () => {
    if (!sliderRef.current) return 0;
    
    const containerWidth = sliderRef.current.offsetWidth;
    const totalGapWidth = (responsiveVisibleItems - 1) * gap;
    const availableWidth = containerWidth - totalGapWidth;
    
    // Calculate responsive item width
    return availableWidth / responsiveVisibleItems;
  };

  // Calculate the translateX value for the slider
  const translateX = -(currentIndex * (getContainerWidth() + gap)) + dragOffset;

  return (
    <div className={cn('w-full', className)}>
      {/* Title and description */}
      {(title || description) && (
        <div className="mb-6 text-center">
          {title && <h3 className="text-2xl font-bold mb-2">{title}</h3>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}
      
      <div className="relative">
        {/* Previous button */}
        {showArrows && (
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-0 sm:-translate-x-1/2 z-10 bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-lg border border-white dark:border-gray-800 ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
            aria-label="Previous slide"
          >
            <FaChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}
        
        {/* Slider container */}
        <div 
          ref={sliderRef}
          className="overflow-hidden touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <motion.div
            className="flex"
            style={{
              transform: `translateX(${translateX}px)`,
              transition: isDragging ? 'none' : 'transform 0.5s ease-in-out',
            }}
          >
            {React.Children.map(children, (child, index) => (
              <div
                key={index}
                style={{
                  width: `${getContainerWidth()}px`,
                  marginRight: index < totalItems - 1 ? `${gap}px` : 0,
                  flex: 'none',
                }}
              >
                {child}
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* Next button */}
        {showArrows && (
          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-0 sm:translate-x-1/2 z-10 bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-lg border border-white dark:border-gray-800 ${currentIndex >= maxIndex ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
            aria-label="Next slide"
          >
            <FaChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}
      </div>
      
      {/* Dots navigation */}
      {showDots && totalItems > responsiveVisibleItems && (
        <div className="flex justify-center mt-4 space-x-3">
          {Array.from({ length: Math.ceil((maxIndex + 1) / responsiveVisibleItems) }).map((_, idx) => {
            const dotIndex = idx * responsiveVisibleItems;
            return (
              <button
                key={idx}
                onClick={() => goToSlide(dotIndex)}
                className={`w-2 h-2 rounded-full transition-all duration-300 border border-blue-300 dark:border-blue-500 ${currentIndex === dotIndex ? 'bg-primary scale-110 shadow-md' : 'bg-gray-200 dark:bg-gray-700 hover:bg-blue-200 dark:hover:bg-blue-900'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SliderContainer;