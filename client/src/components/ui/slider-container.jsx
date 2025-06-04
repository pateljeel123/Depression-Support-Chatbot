import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

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
  // Use spring physics for smoother animation
  const translateX = -currentIndex * (responsiveItemWidth + gap);
  
  // Enhanced 3D effect calculation with perspective, rotation, scale, opacity, and z-index
  const getItemTransform = (index) => {
    const distance = index - currentIndex;
    const absDistance = Math.abs(distance);
    
    // Enhanced rotation with diminishing effect for distant items
    const rotation = distance * (absDistance <= 1 ? 8 : 5); // More rotation for adjacent items
    
    // Enhanced scale with smoother falloff
    const scale = 1 - Math.min(0.2, absDistance * 0.08); 
    
    // Enhanced opacity with smoother falloff
    const opacity = 1 - Math.min(0.4, absDistance * 0.15); 
    
    // Add slight vertical offset for 3D effect
    const translateY = absDistance <= 1 ? absDistance * 5 : 10;
    
    // Add slight depth offset for 3D effect
    const translateZ = -absDistance * 20;
    
    return {
      rotateY: `${rotation}deg`,
      scale,
      opacity,
      translateY: `${translateY}px`,
      translateZ: `${translateZ}px`,
      zIndex: 100 - absDistance
    };
  };

  // Calculate total width of the slider content - ensure it's exactly the width needed for visible items
  const sliderContentWidth = responsiveVisibleItems * (responsiveItemWidth + gap) - gap;

  return (
    <div className={cn("w-full py-8 relative", className)}>
      {/* Enhanced background gradient effects with animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-100/50 via-transparent to-primary-100/50 dark:from-primary-900/30 dark:via-transparent dark:to-primary-900/30 rounded-xl opacity-70 pointer-events-none animate-gradient-x"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-primary-100/30 dark:from-transparent dark:via-black/10 dark:to-primary-900/30 rounded-xl opacity-60 pointer-events-none"></div>
      <div className="absolute -inset-1 bg-gradient-to-tr from-primary-200/20 to-transparent dark:from-primary-800/20 dark:to-transparent rounded-xl opacity-50 pointer-events-none blur-xl"></div>
      <div className="absolute top-1/4 -left-10 w-40 h-40 bg-primary-100/30 dark:bg-primary-900/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-10 w-40 h-40 bg-primary-100/30 dark:bg-primary-900/10 rounded-full blur-3xl pointer-events-none"></div>
      
      {(title || description) && (
        <div className="text-center mb-8 relative z-10">
          {title && <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">{title}</h2>}
          {description && <p className="mt-2 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">{description}</p>}
        </div>
      )}
      
      <div className="relative overflow-hidden rounded-xl mx-auto">
        {showArrows && (
          <>
            <motion.button 
              onClick={handlePrev}
              disabled={currentIndex <= 0}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.95)", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.9 }}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: currentIndex <= 0 ? 0.4 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={cn(
                "absolute left-1 sm:left-2 top-1/2 z-20 -translate-y-1/2 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg text-gray-800 dark:text-white transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 border border-gray-200/50 dark:border-gray-700/50",
                "backdrop-blur-sm",
                currentIndex <= 0 ? "opacity-0 pointer-events-none" : "opacity-100 cursor-pointer"
              )}
              aria-label="Previous slide"
            >
              <motion.div
                animate={{ x: currentIndex <= 0 ? -5 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <FaChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400" />
              </motion.div>
            </motion.button>
            
            <motion.button 
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.95)", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.9 }}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: currentIndex >= maxIndex ? 0.4 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={cn(
                "absolute right-1 sm:right-2 top-1/2 z-20 -translate-y-1/2 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg text-gray-800 dark:text-white transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 border border-gray-200/50 dark:border-gray-700/50",
                "backdrop-blur-sm",
                currentIndex >= maxIndex ? "opacity-0 pointer-events-none" : "opacity-100 cursor-pointer"
              )}
              aria-label="Next slide"
            >
              <motion.div
                animate={{ x: currentIndex >= maxIndex ? 5 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <FaChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400" />
              </motion.div>
            </motion.button>
          </>
        )}
        
        <motion.div 
          ref={sliderRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="overflow-hidden px-4 sm:px-6 py-8 mx-auto backdrop-blur-sm bg-white/10 dark:bg-black/10"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ 
            maxWidth: `${sliderContentWidth}px`,
            width: '100%', // Ensure it takes full width up to the max
            borderRadius: '24px', // Increased rounded corners
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.01)', // Enhanced shadow
            border: '1px solid rgba(255, 255, 255, 0.15)', // Enhanced border
            perspective: '1000px', // Add perspective for 3D effect
            perspectiveOrigin: 'center', // Center the perspective
          }}
        >
          <motion.div 
            className="flex"
            style={{ 
              transform: `translateX(${translateX}px)`,
              gap: `${gap}px`,
              transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)' // Custom easing for smoother motion
            }}
          >
            {React.Children.map(children, (child, index) => {
              // Use the same width calculation for consistency
              const itemStyle = { width: `${responsiveItemWidth}px` };
              const transform = getItemTransform(index);
              
              return (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ 
                    opacity: transform.opacity, 
                    scale: transform.scale, 
                    rotateY: transform.rotateY,
                    y: 0,
                    zIndex: transform.zIndex
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 30,
                    mass: 1.2 // Slightly heavier for more natural motion
                  }}
                  className="flex-shrink-0 transition-all duration-300 p-2"
                  style={{
                    ...itemStyle,
                    transformStyle: 'preserve-3d', // Maintain 3D effect
                    backfaceVisibility: 'hidden', // Hide backface during rotation
                  }}
                  whileHover={{ 
                    scale: transform.scale + 0.03, // Slightly larger on hover
                    y: -5, // Slight lift on hover
                    transition: { duration: 0.2 }
                  }}
                >
                  {child}
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
      
      {showDots && totalItems > responsiveVisibleItems && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.3 }}
          className="flex justify-center mt-8 mb-4 space-x-3 sm:space-x-4"
        >
          {Array.from({ length: Math.ceil(totalItems / responsiveVisibleItems) }).map((_, index) => {
            // Calculate if this dot represents the current visible group
            const isActive = index === Math.floor(currentIndex / responsiveVisibleItems);
            return (
              <motion.button
                key={index}
                onClick={() => goToSlide(index * responsiveVisibleItems)}
                whileHover={{ 
                  scale: isActive ? 1.1 : 1.3, 
                  backgroundColor: isActive ? "var(--primary-600)" : "var(--gray-400)",
                  boxShadow: isActive ? "0 4px 12px rgba(var(--primary-500-rgb), 0.4)" : "0 2px 8px rgba(0, 0, 0, 0.1)"
                }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  width: isActive ? "2rem" : "0.75rem",
                  height: isActive ? "0.75rem" : "0.75rem",
                  backgroundColor: isActive ? "var(--primary-600)" : "var(--gray-300)",
                  transition: { duration: 0.3, type: "spring" }
                }}
                className={cn(
                  "transition-all duration-300 rounded-full relative overflow-hidden",
                  isActive 
                    ? "bg-primary-600 w-8 sm:w-10 h-3 sm:h-4 shadow-lg shadow-primary-500/30" 
                    : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 w-3 sm:w-4 h-3 sm:h-4"
                )}
                aria-label={`Go to slide group ${index + 1}`}
              >
                {isActive && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-500"
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default SliderContainer;