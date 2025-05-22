import React from 'react';
import { motion } from 'framer-motion';

export const VoiceVisualizer = ({ listening, audioLevel, darkMode }) => {
  if (!listening) return null;

  // Ensure audioLevel is between 0 and 1
  const normalizedAudioLevel = Math.max(0, Math.min(1, audioLevel || 0));

  // Define the max height for the visualizer bars
  const maxBarHeight = 30; // px
  const minBarHeight = 2; // px

  // Create 5 bars for the visualizer
  const numBars = 5;
  const bars = Array.from({ length: numBars });

  // Simple candle-like effect: middle bar is highest, outer bars are lower
  // More sophisticated effects can be added later
  const getBarHeight = (index) => {
    const distanceFromCenter = Math.abs(index - Math.floor(numBars / 2));
    // Bars closer to the center are more affected by audioLevel
    const sensitivity = 1 - (distanceFromCenter / (numBars / 2)) * 0.5; // Adjust sensitivity factor
    let height = normalizedAudioLevel * maxBarHeight * sensitivity;
    height = Math.max(minBarHeight, height);
    return height;
  };

  return (
    <motion.div
      className={`flex items-end justify-center space-x-1 p-2 rounded-lg transition-all duration-100 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
      style={{ height: `${maxBarHeight + 4}px` }} // +4 for padding
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      {bars.map((_, index) => (
        <motion.div
          key={index}
          className={`w-1.5 rounded-full ${darkMode ? 'bg-indigo-400' : 'bg-indigo-500'}`}
          animate={{ height: `${getBarHeight(index)}px` }}
          transition={{ type: 'spring', stiffness: 500, damping: 30, duration: 0.1 }}
        />
      ))}
    </motion.div>
  );
};