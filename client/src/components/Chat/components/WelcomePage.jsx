import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PromptSuggestion } from './PromptSuggestion';
import { RetroGrid } from "@/components/magicui/retro-grid";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { MagicCard } from "@/components/magicui/magic-card"; // Removed MagicCardGradient
import { cn } from "@/lib/utils";

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
    <div className="h-full flex flex-col items-center justify-center text-center p-4 sm:p-8 relative overflow-hidden">
      {/* RetroGrid Background */}
      <RetroGrid className={cn(
        "absolute inset-0 z-0",
        darkMode ? "opacity-20" : "opacity-30"
      )} />
      
      {/* Gradient Overlay */}
      <div 
        className={`absolute inset-0 ${darkMode 
          ? 'bg-gradient-to-b from-gray-900/70 via-gray-800/60 to-gray-900/70' 
          : 'bg-gradient-to-b from-primary-50/70 via-white/60 to-secondary-50/70'} 
           z-0`}
      />
      
      {/* Content container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-2xl w-full flex flex-col items-center"
      >
        {/* Welcoming icon - kept as is for now, can be further enhanced */}
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
          <div className={`mx-auto flex items-center justify-center w-20 h-20 rounded-full ${darkMode ? 'bg-primary-700/50' : 'bg-primary-100/50'} backdrop-blur-sm`}>
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

        {/* Welcome message with AnimatedShinyText */}
        <div className="mb-3">
          <AnimatedShinyText
            className={cn(
              "group rounded-full inline-flex items-center justify-center px-4 py-1 transition-all duration-300 ease-in-out",
              "bg-neutral-100/80 hover:bg-neutral-200/80 dark:bg-neutral-800/80 dark:hover:bg-neutral-700/80 backdrop-blur-sm"
            )}
          >
            <h1 
              className={`text-3xl sm:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} ${darkMode ? 'text-shadow-sm' : 'text-shadow'}`}
              style={darkMode ? {textShadow: '0 1px 3px rgba(0,0,0,0.3)'} : {textShadow: '0 1px 2px rgba(0,0,0,0.1)'}}
            >
              Hi there <span className="group-hover:animate-wave inline-block">👋</span>
            </h1>
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-500/50 via-primary-600/50 to-secondary-600/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </AnimatedShinyText>
        </div>
        
        <div className="mb-8">
          <AnimatedShinyText
            className={cn(
              "group rounded-full inline-flex items-center justify-center px-3 py-1 transition-all duration-300 ease-in-out",
              "bg-neutral-100/70 hover:bg-neutral-200/70 dark:bg-neutral-800/70 dark:hover:bg-neutral-700/70 backdrop-blur-sm"
            )}
          >
            <h2 
              className={`text-xl sm:text-2xl font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} ${darkMode ? 'text-shadow-sm' : 'text-shadow'}`}
              style={darkMode ? {textShadow: '0 1px 3px rgba(0,0,0,0.2)'} : {textShadow: '0 1px 2px rgba(0,0,0,0.05)'}}
            >
              How are you feeling today?
            </h2>
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-400/40 via-primary-500/40 to-secondary-500/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </AnimatedShinyText>
        </div>

        {/* Animated question cards with MagicCard */}
        <div className="mb-10 w-full max-w-md">
          {showAllQuestions ? (
            <motion.div 
              className="grid grid-cols-1 gap-4"
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
                  <MagicCard
                    className={cn(
                      "cursor-pointer !p-0",
                      darkMode ? "bg-gray-800/70 hover:bg-gray-700/70" : "bg-white/70 hover:bg-gray-50/70",
                      "backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                    )}
                    gradientColor={darkMode ? "#2563EB" : "#60A5FA"}
                    gradientSize={150}
                  >
                    {/* <MagicCardGradient /> Removed */}
                    <PromptSuggestion
                      text={question}
                      onClick={() => setInput(question)}
                      darkMode={darkMode}
                      className="!bg-transparent !border-none !shadow-none hover:!bg-transparent"
                    />
                  </MagicCard>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="relative h-20 sm:h-24 mb-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeQuestionIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <MagicCard
                     className={cn(
                      "cursor-pointer w-full !p-0",
                      darkMode ? "bg-gray-800/70 hover:bg-gray-700/70" : "bg-white/70 hover:bg-gray-50/70",
                      "backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                    )}
                    gradientColor={darkMode ? "#2563EB" : "#60A5FA"}
                    gradientSize={200}
                  >
                    {/* <MagicCardGradient /> Removed */}
                    <PromptSuggestion
                      text={questions[activeQuestionIndex]}
                      onClick={() => setInput(questions[activeQuestionIndex])}
                      darkMode={darkMode}
                      className="!bg-transparent !border-none !shadow-none hover:!bg-transparent"
                    />
                  </MagicCard>
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* Toggle button with ShimmerButton */}
          <div className="flex justify-center mt-6">
            <ShimmerButton 
              onClick={() => setShowAllQuestions(!showAllQuestions)}
              className={cn(
                "text-sm shadow-lg hover:shadow-xl transition-all duration-300",
                darkMode ? "text-primary-300 hover:text-primary-200" : "text-white hover:text-gray-100"
              )}
              shimmerColor={darkMode ? "#A5B4FC" : "#FFFFFF"} // Changed shimmer to white for light mode to match text
              shimmerSize="0.1em"
              background={darkMode ? "rgba(31, 41, 55, 0.7)" : "rgba(255, 255, 255, 0.7)"}
            >
              {showAllQuestions ? "Show one at a time" : "Show all questions"}
            </ShimmerButton>
          </div>
        </div>

        {/* Call to action button with ShimmerButton */}
        <ShimmerButton
          onClick={() => setInput("Hi, I'd like to talk about how I'm feeling today.")} 
          className={cn(
            "px-8 py-4 rounded-full font-semibold text-lg text-white shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out",
            "w-auto"
          )}
          shimmerColor={darkMode ? "#EC4899" : "#D946EF"}
          shimmerSize="0.15em"
          background={darkMode 
            ? 'linear-gradient(to bottom right, #3B82F6, #EC4899)' 
            : 'linear-gradient(to bottom right, #60A5FA, #F472B6)'}
        >
          Talk to me
        </ShimmerButton>
      </motion.div>
    </div>
  );
};