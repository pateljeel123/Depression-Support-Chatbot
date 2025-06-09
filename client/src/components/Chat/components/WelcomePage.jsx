import React from 'react';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiHelpCircle, FiAlertCircle } from 'react-icons/fi';

export const WelcomePage = ({ darkMode, setInput, handleSendMessage }) => {
  // Sample conversation starters
  const conversationStarters = [
    "How can I manage my anxiety today?",
    "I've been feeling down lately. What can I do?",
    "What are some mindfulness exercises I can try?",
    "How can I improve my sleep habits?",
    "I need help with negative thoughts",
    "What are signs of depression I should watch for?"
  ];

  // Function to automatically send a message when a starter is clicked
  const handleStarterClick = (starter) => {
    setInput(starter);
    // Use setTimeout to ensure the input is set before sending
    setTimeout(() => {
      handleSendMessage(starter);
    }, 100);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-1 sm:p-4 text-center animated-bg">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className={`max-w-lg ${darkMode ? 'glass-morphism-dark' : 'glass-morphism'} backdrop-blur-lg border rounded-xl p-3 sm:p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02]`}
      >
        <h1 className={`text-xl sm:text-3xl font-bold mb-2 sm:mb-3 bg-gradient-to-r ${darkMode ? 'from-blue-400 to-purple-500' : 'from-indigo-500 to-purple-600'} text-transparent bg-clip-text`}>Welcome to MindCare</h1>
        <p className={`text-xs sm:text-base mb-4 sm:mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
          I'm here to provide support and guidance for your mental well-being. 
          Try one of the conversation starters below.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-3 mb-3 sm:mb-6">
          {conversationStarters.map((starter, index) => (
            <button
              key={index}
              onClick={() => handleStarterClick(starter)}
              className={`p-2 sm:p-4 text-left rounded-xl border transition-all duration-300 text-xs sm:text-sm ${darkMode ? 'glass-morphism-dark hover:bg-gray-700/50' : 'glass-morphism hover:bg-white/50'} backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105 hover:border-indigo-500/50`}
            >
              {starter}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 sm:flex sm:flex-row justify-center gap-2 sm:gap-4 mt-4 sm:mt-6">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className={`flex items-center text-xs sm:text-sm p-2 sm:p-3 rounded-lg ${darkMode ? 'glass-morphism-dark' : 'glass-morphism'} backdrop-blur-sm`}>
            <FiMessageSquare className={`mr-2 sm:mr-3 text-lg sm:text-xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className="font-medium">Chat confidentially</span>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className={`flex items-center text-xs sm:text-sm p-2 sm:p-3 rounded-lg ${darkMode ? 'glass-morphism-dark' : 'glass-morphism'} backdrop-blur-sm`}>
            <FiHelpCircle className={`mr-2 sm:mr-3 text-lg sm:text-xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className="font-medium">Get personalized support</span>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className={`flex items-center text-xs sm:text-sm p-2 sm:p-3 rounded-lg ${darkMode ? 'glass-morphism-dark' : 'glass-morphism'} backdrop-blur-sm`}>
            <FiAlertCircle className={`mr-2 sm:mr-3 text-lg sm:text-xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className="font-medium">Access crisis resources</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};