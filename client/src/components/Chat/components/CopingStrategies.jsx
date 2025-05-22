import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiX, FiChevronRight } from 'react-icons/fi';

const strategies = [
  {
    id: 1,
    title: 'Deep Breathing',
    description: 'Take 5 slow, deep breaths. Inhale for 4 counts, hold for 2, exhale for 6.',
    icon: '🫁'
  },
  {
    id: 2,
    title: '5-4-3-2-1 Grounding',
    description: 'Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.',
    icon: '👁️'
  },
  {
    id: 3,
    title: 'Positive Affirmation',
    description: `Repeat: "This feeling is temporary. I've gotten through difficult times before."`,
    icon: '💬'
  },
  {
    id: 4,
    title: 'Body Scan',
    description: 'Close your eyes and mentally scan your body from head to toe, relaxing each part as you go.',
    icon: '🧘'
  },
  {
    id: 5,
    title: 'Reach Out',
    description: 'Text or call someone you trust. Connection helps reduce feelings of isolation.',
    icon: '📱'
  }
];

export const CopingStrategies = ({ darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState(null);

  const handleStrategyClick = (strategy) => {
    setSelectedStrategy(strategy);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
        aria-label="Coping strategies"
      >
        <FiHeart size={20} className={darkMode ? 'text-red-400' : 'text-red-500'} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`absolute bottom-full mb-2 p-3 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
            style={{ width: '300px', right: 0 }}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {selectedStrategy ? 'Try This Strategy' : 'Coping Strategies'}
              </h3>
              <button
                onClick={() => {
                  if (selectedStrategy) {
                    setSelectedStrategy(null);
                  } else {
                    setIsOpen(false);
                  }
                }}
                className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                {selectedStrategy ? <FiChevronRight size={16} /> : <FiX size={16} />}
              </button>
            </div>

            {selectedStrategy ? (
              <div className="text-center py-2">
                <div className="text-4xl mb-3">{selectedStrategy.icon}</div>
                <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedStrategy.title}</h4>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedStrategy.description}</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {strategies.map((strategy) => (
                  <motion.button
                    key={strategy.id}
                    whileHover={{ x: 5 }}
                    onClick={() => handleStrategyClick(strategy)}
                    className={`flex items-center w-full p-2 rounded-lg text-left ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <span className="text-xl mr-3">{strategy.icon}</span>
                    <div>
                      <h4 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{strategy.title}</h4>
                      <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{strategy.description}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};