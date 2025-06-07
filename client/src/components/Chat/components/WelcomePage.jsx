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
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`max-w-2xl w-full ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 shadow-sm`}
      >
        <h1 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Welcome to MindCare</h1>
        <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          I'm here to provide support, guidance, and resources for your mental well-being. 
          Feel free to share what's on your mind or try one of the conversation starters below.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {conversationStarters.map((starter, index) => (
            <button
              key={index}
              onClick={() => handleStarterClick(starter)}
              className={`p-3 text-left rounded-md border transition-colors text-sm ${darkMode ? 'border-gray-700 bg-gray-700 hover:bg-gray-600 text-white' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800'}`}
            >
              {starter}
            </button>
          ))}
        </div>
        
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
          <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <FiMessageSquare className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span>Chat confidentially</span>
          </div>
          <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <FiHelpCircle className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span>Get personalized support</span>
          </div>
          <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <FiAlertCircle className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span>Access crisis resources</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};