import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiChevronRight, FiChevronLeft, FiCheck } from 'react-icons/fi';

const questions = [
  'Little interest or pleasure in doing things?',
  'Feeling down, depressed, or hopeless?',
  'Trouble falling or staying asleep, or sleeping too much?',
  'Feeling tired or having little energy?',
  'Poor appetite or overeating?',
  'Feeling bad about yourself - or that you are a failure or have let yourself or your family down?',
  'Trouble concentrating on things, such as reading the newspaper or watching television?',
  'Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual?',
  'Thoughts that you would be better off dead, or of hurting yourself in some way?'
];

const options = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' }
];

const interpretations = [
  { range: [0, 4], severity: 'Minimal depression', message: 'Your symptoms suggest minimal depression. Continue monitoring your mood and practice self-care.' },
  { range: [5, 9], severity: 'Mild depression', message: 'Your symptoms suggest mild depression. Consider talking to a mental health professional for guidance.' },
  { range: [10, 14], severity: 'Moderate depression', message: 'Your symptoms suggest moderate depression. We recommend consulting with a mental health professional.' },
  { range: [15, 19], severity: 'Moderately severe depression', message: 'Your symptoms suggest moderately severe depression. Please consider seeking professional help soon.' },
  { range: [20, 27], severity: 'Severe depression', message: 'Your symptoms suggest severe depression. We strongly recommend seeking professional help immediately.' }
];

export const PHQ9Assessment = ({ darkMode, onComplete, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1 && !showResults) { // Prevent advancing if already on results view
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentQuestion === questions.length - 1 && answers.every(ans => ans !== null)) {
      // Automatically show results if it's the last question and all answered (optional)
      // setShowResults(true); 
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowResults(false); // If going back from results view
    }
  };

  const resetAssessment = () => {
    setAnswers(Array(questions.length).fill(null));
    setCurrentQuestion(0);
    setShowResults(false);
  };

  const calculateScore = () => {
    return answers.reduce((sum, value) => sum + (value || 0), 0);
  };

  const getInterpretation = (score) => {
    return interpretations.find(item => score >= item.range[0] && score <= item.range[1]);
  };

  const handleComplete = () => {
    const score = calculateScore();
    const interpretation = getInterpretation(score);
    resetAssessment(); // Reset state before calling onComplete
    onComplete && onComplete({ score, interpretation });
  };

  useEffect(() => {
    return () => {
      resetAssessment();
    };
  }, []);

  return (
    <motion.div
      onClick={(e) => e.stopPropagation()}
      className={`relative rounded-xl shadow-xl w-full max-w-md ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}
      // Animation props like initial, animate, exit are expected to be on the parent modal container in Chat.jsx
    >
      <div className={`p-4 border-b flex items-center justify-between ${darkMode ? 'border-gray-700' : 'border-gray-600'}`}>
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>PHQ-9 Depression Assessment</h3>
        <button
          onClick={() => {
            resetAssessment(); 
            onClose && onClose();
          }}
          className={`p-1.5 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
        >
          <FiX size={18} />
        </button>
      </div>

      <div className="p-6">
        {!showResults ? (
          <>
            <p className={`mb-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Question {currentQuestion + 1} of {questions.length}
            </p>
            <p className={`mb-4 text-md font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              {questions[currentQuestion]}
            </p>
            <div className="space-y-3">
              {options.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${answers[currentQuestion] === option.value ? (darkMode ? 'bg-purple-600 border-purple-500 text-white' : 'bg-purple-500 border-purple-600 text-white') : (darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-100 border-gray-300 hover:bg-gray-200')}`}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className={`px-4 py-2 rounded-lg flex items-center transition-colors ${darkMode ? 'bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100'} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <FiChevronLeft size={18} className="mr-1" /> Previous
              </button>
              {currentQuestion < questions.length - 1 ? (
                <button
                  onClick={() => handleAnswer(answers[currentQuestion])} // Effectively advances if an answer is selected
                  disabled={answers[currentQuestion] === null}
                  className={`px-4 py-2 rounded-lg flex items-center transition-colors ${darkMode ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Next <FiChevronRight size={18} className="ml-1" />
                </button>
              ) : (
                 <button
                    onClick={() => setShowResults(true)}
                    disabled={answers.some(ans => ans === null)} // Disabled if not all questions answered
                    className={`px-4 py-2 rounded-lg flex items-center transition-colors ${darkMode ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-green-500 hover:bg-green-600 text-white'} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Show Results <FiChevronRight size={18} className="ml-1" />
                  </button>
              )}
            </div>
          </>
        ) : (
          <>
            <h4 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Assessment Results</h4>
            <div className={`p-4 rounded-lg mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className={`text-2xl font-bold mb-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                Score: {calculateScore()}
              </p>
              <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Severity: {getInterpretation(calculateScore())?.severity || 'N/A'}
              </p>
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {getInterpretation(calculateScore())?.message || 'Could not determine interpretation.'}
              </p>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={resetAssessment} // Retake will reset and show first question
                className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Retake Assessment
              </button>
              <button
                onClick={handleComplete}
                className={`px-4 py-2 rounded-lg flex items-center transition-colors ${darkMode ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'}`}
              >
                <FiCheck size={18} className="mr-1" /> Done & Send to Chat
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};