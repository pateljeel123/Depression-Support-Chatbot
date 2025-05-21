import React from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export const ThemeSwitcher = ({ darkMode, toggleDarkMode }) => {
  return (
    <motion.button
      onClick={toggleDarkMode}
      className={`p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 
        ${darkMode 
          ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300 focus:ring-yellow-400 focus:ring-offset-gray-800'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-indigo-500 focus:ring-offset-white'
        }
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={darkMode ? 'moon' : 'sun'}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};