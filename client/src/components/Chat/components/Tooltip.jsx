import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Tooltip = ({ content, children, position = 'top' }) => {
  const [isHovered, setIsHovered] = useState(false);

  const tooltipVariants = {
    hidden: { opacity: 0, y: position === 'top' ? 10 : -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  let positionClasses = '';
  switch (position) {
    case 'top':
      positionClasses = 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      break;
    case 'bottom':
      positionClasses = 'top-full left-1/2 -translate-x-1/2 mt-2';
      break;
    case 'left':
      positionClasses = 'right-full top-1/2 -translate-y-1/2 mr-2';
      break;
    case 'right':
      positionClasses = 'left-full top-1/2 -translate-y-1/2 ml-2';
      break;
    default:
      positionClasses = 'bottom-full left-1/2 -translate-x-1/2 mb-2';
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <AnimatePresence>
        {isHovered && content && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={tooltipVariants}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className={`absolute z-50 px-3 py-1.5 text-xs font-medium text-white bg-gray-800 rounded-md shadow-lg whitespace-nowrap ${positionClasses}`}
          >
            {content}
            {/* Arrow (optional, for more visual flair) */}
            {position === 'top' && <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-gray-800"></div>}
            {position === 'bottom' && <div className="absolute left-1/2 -translate-x-1/2 top-[-4px] w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[5px] border-b-gray-800"></div>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};