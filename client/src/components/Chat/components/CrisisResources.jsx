import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLifeBuoy, FiX, FiExternalLink } from 'react-icons/fi';

const resources = [];


export const CrisisResources = ({ darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
        aria-label="Crisis resources"
      >
        <FiLifeBuoy size={20} className={darkMode ? 'text-green-400' : 'text-green-600'} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`absolute bottom-full mb-2 p-3 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
            style={{ width: '320px', right: 0 }}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Crisis Resources</h3>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {resources.map((resource) => (
                <div 
                  key={resource.id} 
                  className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                >
                  <h4 className={`text-sm font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{resource.name}</h4>
                  <p className={`text-sm font-bold mb-1 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{resource.contact}</p>
                  <p className={`text-xs mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{resource.description}</p>
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`text-xs flex items-center ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                  >
                    Visit Website <FiExternalLink size={12} className="ml-1" />
                  </a>
                </div>
              ))}
            </div>
            
            <div className={`mt-3 pt-2 border-t text-xs ${darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
              If you're in immediate danger, please seek emergency services right away.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};