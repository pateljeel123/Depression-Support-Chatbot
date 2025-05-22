import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiBarChart2 } from 'react-icons/fi';

const moods = [
  { emoji: '😢', label: 'Very Sad', value: 1, color: 'bg-blue-500' },
  { emoji: '😔', label: 'Sad', value: 2, color: 'bg-blue-400' },
  { emoji: '😐', label: 'Neutral', value: 3, color: 'bg-gray-400' },
  { emoji: '🙂', label: 'Good', value: 4, color: 'bg-green-400' },
  { emoji: '😄', label: 'Great', value: 5, color: 'bg-green-500' },
];

export const MoodTracker = ({ darkMode, onMoodSelect }) => {
  const [showTracker, setShowTracker] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    onMoodSelect(mood);
    setShowTracker(false);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowTracker(!showTracker)}
        className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
        aria-label="Track your mood"
      >
        <FiBarChart2 size={20} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
      </motion.button>

      {showTracker && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className={`absolute bottom-full mb-2 p-3 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
          style={{ width: '250px', right: 0 }}
        >
          <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>How are you feeling today?</h3>
          <div className="flex justify-between items-center">
            {moods.map((mood) => (
              <motion.button
                key={mood.value}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMoodSelect(mood)}
                className={`flex flex-col items-center p-2 rounded-lg ${selectedMood?.value === mood.value ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : ''}`}
              >
                <span className="text-2xl mb-1">{mood.emoji}</span>
                <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{mood.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};