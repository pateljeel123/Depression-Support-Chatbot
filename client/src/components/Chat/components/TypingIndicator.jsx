import React from 'react';
import { motion } from 'framer-motion';

export const TypingIndicator = ({ darkMode }) => {
  const dotVariants = {
    initial: { y: '0%' },
    animate: { y: ['0%', '-50%', '0%'] },
  };

  const dotTransition = {
    duration: 0.5,
    repeat: Infinity,
    ease: 'easeInOut',
  };

  return (
    <motion.div 
      className={`flex items-center space-x-1 p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-400' : 'bg-gray-500'}`}
          variants={dotVariants}
          animate="animate"
          transition={{
            ...dotTransition,
            delay: i * 0.15, // Stagger the animation
          }}
        />
      ))}
    </motion.div>
  );
};