import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Tooltip = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 px-2 py-1 text-xs rounded bg-card text-card-foreground border border-border shadow-sm whitespace-nowrap"
            style={{ bottom: 'calc(100% + 5px)', left: '50%', transform: 'translateX(-50%)' }}
          >
            {content}
            <div 
              className="absolute w-2 h-2 bg-card border-r border-b border-border rotate-45"
              style={{ bottom: '-4px', left: 'calc(50% - 4px)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};