import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const SliderContainer = ({ 
  children, 
  className, 
  itemWidth = 320, // Default width of each item
  gap = 16, // Gap between items
  visibleItems = 3, // Number of items visible at once
  autoPlay = false,
  autoPlayInterval = 5000, // 5 seconds
  showArrows = true,
  showDots = true,
  title,
  description
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sliderRef = useRef(null);
  const totalItems = React.Children.count(children);
  const maxIndex = Math.max(0, totalItems - visibleItems);

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
    setCurrentIndex(prev => Math.max(0, prev - 1));
    setTimeout(() => setIsAnimating(false), 500); // Match this with CSS transition duration
  };

  const handleNext = () => {
    if (isAnimating || currentIndex >= maxIndex) return;
    setIsAnimating(true);
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
    setTimeout(() => setIsAnimating(false), 500); // Match this with CSS transition duration
  };

  const goToSlide = (index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(index);
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

  const translateX = -currentIndex * (itemWidth + gap);

  return (
    <div className={cn("w-full py-8", className)}>
      {(title || description) && (
        <div className="text-center mb-8">
          {title && <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">{title}</h2>}
          {description && <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">{description}</p>}
        </div>
      )}
      
      <div className="relative overflow-hidden">
        {showArrows && (
          <>
            <button 
              onClick={handlePrev}
              disabled={currentIndex <= 0}
              className={cn(
                "absolute left-0 top-1/2 z-10 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white/80 shadow-md text-gray-800 hover:bg-white transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                currentIndex <= 0 ? "opacity-50 cursor-not-allowed" : "opacity-100 cursor-pointer"
              )}
              aria-label="Previous slide"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>
            
            <button 
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className={cn(
                "absolute right-0 top-1/2 z-10 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white/80 shadow-md text-gray-800 hover:bg-white transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                currentIndex >= maxIndex ? "opacity-50 cursor-not-allowed" : "opacity-100 cursor-pointer"
              )}
              aria-label="Next slide"
            >
              <FaChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
        
        <div 
          ref={sliderRef}
          className="overflow-hidden px-12"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ 
              transform: `translateX(${translateX}px)`,
              gap: `${gap}px`
            }}
          >
            {React.Children.map(children, (child, index) => (
              <div 
                key={index} 
                className="flex-shrink-0"
                style={{ width: `${itemWidth}px` }}
              >
                {child}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {showDots && totalItems > visibleItems && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                currentIndex === index 
                  ? "bg-indigo-600 w-6" 
                  : "bg-gray-300 hover:bg-gray-400"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SliderContainer;