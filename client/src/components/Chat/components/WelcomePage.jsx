import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PromptSuggestion } from './PromptSuggestion';

export const WelcomePage = ({ darkMode, setInput }) => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  
  const questions = [
    "How have things been going for you lately?",
    "Can you walk me through what a typical day looks like for you these days?",
    "Have there been any activities or moments recently that you've found enjoyable—or has that been difficult?",
    "Have you been spending time with anyone close to you, or have you found yourself more on your own?",
    "Is there anything that's been on your mind a lot or causing you stress lately?",
    "Who do you feel most supported by right now—or is support feeling a bit out of reach?",
    "We all face ups and downs—has anything in particular felt especially heavy or hard to manage lately?"
  ];

  // Auto-rotate questions every 4 seconds unless all questions are shown
  useEffect(() => {
    if (showAllQuestions) return;
    
    const interval = setInterval(() => {
      setActiveQuestionIndex((prev) => (prev + 1) % questions.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [showAllQuestions, questions.length]);

  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-4 sm:p-8">
      {/* Soft gradient background */}
      <div 
        className={`absolute inset-0 ${darkMode 
          ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-b from-primary-50 via-white to-secondary-50'} 
          opacity-50 z-0`}
      />
      
      {/* Content container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-xl w-full"
      >
        {/* Welcoming icon */}
        <motion.div 
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 2, 0, -2, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
          className="mb-6"
        >
          <div className={`mx-auto flex items-center justify-center w-20 h-20 rounded-full ${darkMode ? 'bg-primary-700' : 'bg-primary-100'}`}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative w-16 h-16"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 200" className={`w-16 h-16 ${darkMode ? 'text-primary-300' : 'text-primary-500'}`}>
                  <path
                    fill="currentColor"
                    d="M100,15 C152.5,15 195,57.5 195,110 C195,162.5 152.5,205 100,205 C47.5,205 5,162.5 5,110 C5,57.5 47.5,15 100,15 Z"
                    opacity="0.2"
                  />
                </svg>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className={`w-12 h-12 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="60 180" />
                </svg>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Welcome message */}
        <motion.h1 
          className={`text-3xl sm:text-4xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Hi there 👋
        </motion.h1>
        
        <motion.h2 
          className={`text-xl sm:text-2xl font-medium mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          How are you feeling today?
        </motion.h2>

        {/* Animated question cards */}
        <div className="mb-10">
          {showAllQuestions ? (
            <motion.div 
              className="grid grid-cols-1 gap-4 w-full max-w-md mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {questions.map((question, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PromptSuggestion
                    text={question}
                    onClick={() => setInput(question)}
                    darkMode={darkMode}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="relative h-16 sm:h-20 mb-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeQuestionIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-full max-w-md">
                    <PromptSuggestion
                      text={questions[activeQuestionIndex]}
                      onClick={() => setInput(questions[activeQuestionIndex])}
                      darkMode={darkMode}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* Toggle between single rotating question and all questions */}
          <motion.button
            onClick={() => setShowAllQuestions(!showAllQuestions)}
            className={`mt-4 text-sm font-medium px-4 py-2 rounded-full transition-colors ${darkMode 
              ? 'text-primary-300 hover:text-primary-200' 
              : 'text-primary-600 hover:text-primary-700'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {showAllQuestions ? "Show one at a time" : "Show all questions"}
          </motion.button>
        </div>

        {/* Call to action button */}
        <motion.button
          onClick={() => setInput("Hi, I'd like to talk about how I'm feeling today.")} 
          className={`px-6 py-3 rounded-full font-medium text-white shadow-lg transition-all
            ${darkMode 
              ? 'bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500' 
              : 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-400 hover:to-secondary-400'}`}
          whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Talk to me
        </motion.button>
      </motion.div>
    </div>
  );
};