import React from 'react';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiHelpCircle, FiAlertCircle } from 'react-icons/fi';

export const WelcomePage = ({ darkMode, setInput }) => {
  // Sample conversation starters
  const conversationStarters = [
    "How can I manage my anxiety today?",
    "I've been feeling down lately. What can I do?",
    "What are some mindfulness exercises I can try?",
    "How can I improve my sleep habits?",
    "I need help with negative thoughts",
    "What are signs of depression I should watch for?"
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-card border border-border rounded-lg p-6 shadow-sm"
      >
        <h1 className="text-2xl font-bold mb-4 text-foreground">Welcome to MindCare</h1>
        <p className="text-muted-foreground mb-6">
          I'm here to provide support, guidance, and resources for your mental well-being. 
          Feel free to share what's on your mind or try one of the conversation starters below.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {conversationStarters.map((starter, index) => (
            <button
              key={index}
              onClick={() => setInput(starter)}
              className="p-3 text-left rounded-md border border-border bg-background hover:bg-accent transition-colors text-sm text-foreground"
            >
              {starter}
            </button>
          ))}
        </div>
        
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <FiMessageSquare className="mr-2 text-primary" />
            <span>Chat confidentially</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <FiHelpCircle className="mr-2 text-primary" />
            <span>Get personalized support</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <FiAlertCircle className="mr-2 text-primary" />
            <span>Access crisis resources</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};