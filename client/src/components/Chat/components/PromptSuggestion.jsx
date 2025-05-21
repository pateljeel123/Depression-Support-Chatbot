import React from 'react';
import { motion } from 'framer-motion';

export const PromptSuggestion = ({ text, onClick, darkMode }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-3 rounded-lg text-sm text-left transition-colors duration-150 w-full
        ${darkMode 
          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }
      `}
    >
      {text}
    </motion.button>
  );
};