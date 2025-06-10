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
    <div className="flex flex-col items-center justify-center min-h-[90vh] w-full max-w-screen-xl mx-auto px-2 py-4 md:py-6 text-center relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 70 }}
        className={`w-full max-w-lg mx-auto ${darkMode ? 'glass-morphism-dark' : 'glass-morphism'} backdrop-blur-md border border-opacity-30 rounded-2xl p-3 md:p-5 shadow-2xl relative z-10`}
      >
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className={`text-xl md:text-3xl font-bold mb-2 md:mb-3 bg-gradient-to-r ${darkMode ? 'from-blue-400 via-purple-400 to-pink-400' : 'from-indigo-500 via-purple-500 to-pink-500'} text-transparent bg-clip-text tracking-wide`}
        >
          Welcome to MindCare
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={`text-sm md:text-base mb-3 md:mb-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed max-w-md mx-auto`}
        >
          I'm here to provide support and guidance for your mental well-being. 
          Try one of the conversation starters below.
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-6">
          {conversationStarters.map((starter, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
              onClick={() => handleStarterClick(starter)}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              className={`p-3 md:p-4 text-left rounded-xl border transition-all duration-200 text-sm md:text-base ${darkMode ? 'glass-morphism-dark hover:bg-gray-700/30' : 'glass-morphism hover:bg-white/30'} backdrop-blur-md shadow-lg hover:shadow-xl hover:border-indigo-400/50 flex items-center`}
            >
              <span className="flex-1">{starter}</span>
              <motion.span 
                className="text-indigo-400"
                whileHover={{ x: 3 }}
              >→</motion.span>
            </motion.button>
          ))}
        </div>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4 mt-4 md:mt-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center justify-center w-full md:w-auto text-sm md:text-base p-3 md:px-5 rounded-xl ${darkMode ? 'glass-morphism-dark' : 'glass-morphism'} backdrop-blur-md group`}>
            <FiMessageSquare className={`mr-2 md:mr-3 text-xl md:text-2xl ${darkMode ? 'text-blue-400' : 'text-blue-600'} group-hover:rotate-12 transition-transform duration-300`} />
            <span className="font-medium text-sm">Chat confidentially</span>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center justify-center w-full md:w-auto text-sm md:text-base p-3 md:px-5 rounded-xl ${darkMode ? 'glass-morphism-dark' : 'glass-morphism'} backdrop-blur-md group`}>
            <FiHelpCircle className={`mr-2 md:mr-3 text-xl md:text-2xl ${darkMode ? 'text-blue-400' : 'text-blue-600'} group-hover:rotate-12 transition-transform duration-300`} />
            <span className="font-medium text-sm" >Get personalized support</span>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center justify-center w-full md:w-auto text-sm md:text-base p-3 md:px-5 rounded-xl ${darkMode ? 'glass-morphism-dark' : 'glass-morphism'} backdrop-blur-md group`}>
            <FiAlertCircle className={`mr-2 md:mr-3 text-xl md:text-2xl ${darkMode ? 'text-blue-400' : 'text-blue-600'} group-hover:rotate-12 transition-transform duration-300`} />
            <span className="font-medium text-sm">Access crisis resources</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};