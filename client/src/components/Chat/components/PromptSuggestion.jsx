import React from 'react';
import { motion } from 'framer-motion';
import { FiSend } from 'react-icons/fi';

export const PromptSuggestion = ({ text, onClick, darkMode }) => {
  return (
    <div className="flex items-center w-full gap-2">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`p-3 rounded-lg text-sm text-left transition-colors duration-150 flex-grow
          ${darkMode 
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }
        `}
      >
        {text}
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`p-2 rounded-full flex items-center justify-center transition-colors duration-150
          ${darkMode 
            ? 'bg-primary-600 hover:bg-primary-500 text-white'
            : 'bg-primary-500 hover:bg-primary-400 text-white'
          }
        `}
        aria-label="Send message"
      >
        <FiSend size={16} />
      </motion.button>
    </div>
  );
};