import { useState, useEffect } from 'react';

const MoodTracker = () => {
  const [currentMood, setCurrentMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  
  // Mood options with corresponding values and colors
  const moodOptions = [
    { value: 5, label: 'Very Happy', emoji: '😄', color: '#4CAF50' },
    { value: 4, label: 'Happy', emoji: '🙂', color: '#8BC34A' },
    { value: 3, label: 'Neutral', emoji: '😐', color: '#FFC107' },
    { value: 2, label: 'Sad', emoji: '😔', color: '#FF9800' },
    { value: 1, label: 'Very Sad', emoji: '😢', color: '#F44336' },
  ];

  // Load mood history from localStorage on component mount
  useEffect(() => {
    const savedMoodHistory = localStorage.getItem('moodHistory');
    if (savedMoodHistory) {
      setMoodHistory(JSON.parse(savedMoodHistory));
    }
    
    // Check if user has already logged mood today
    const today = new Date().toDateString();
    const todayMood = JSON.parse(savedMoodHistory || '[]').find(
      entry => new Date(entry.date).toDateString() === today
    );
    
    if (todayMood) {
      setCurrentMood(todayMood.mood);
    } else {
      // Prompt for mood if not yet logged today
      setTimeout(() => setShowMoodSelector(true), 1000);
    }
  }, []);

  // Save mood history to localStorage whenever it changes
  useEffect(() => {
    if (moodHistory.length > 0) {
      localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
    }
  }, [moodHistory]);

  // Handle mood selection
  const handleMoodSelect = (mood) => {
    setCurrentMood(mood);
    
    const today = new Date().toISOString();
    const newMoodEntry = {
      date: today,
      mood: mood,
    };
    
    // Check if we already have an entry for today
    const todayEntryIndex = moodHistory.findIndex(
      entry => new Date(entry.date).toDateString() === new Date(today).toDateString()
    );
    
    if (todayEntryIndex >= 0) {
      // Update today's entry
      const updatedHistory = [...moodHistory];
      updatedHistory[todayEntryIndex] = newMoodEntry;
      setMoodHistory(updatedHistory);
    } else {
      // Add new entry
      setMoodHistory([...moodHistory, newMoodEntry]);
    }
    
    setShowMoodSelector(false);
  };

  // Get mood object from value
  const getMoodById = (value) => {
    return moodOptions.find(mood => mood.value === value);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-3xl mx-auto p-5 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg font-sans">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-blue-500 dark:text-purple-400 m-0">Mood Tracker</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Track how you feel to identify patterns over time</p>
      </div>
      
      {/* Today's Mood */}
      <div className="bg-white dark:bg-gray-700 p-5 rounded-lg mb-6 shadow-sm">
        <h3 className="mt-0 text-lg font-semibold text-gray-700 dark:text-gray-200">Today's Mood</h3>
        {currentMood ? (
          <div className="flex items-center gap-4">
            <div 
              className="text-4xl w-16 h-16 flex items-center justify-center rounded-full text-white"
              style={{ backgroundColor: getMoodById(currentMood).color }}
            >
              {getMoodById(currentMood).emoji}
            </div>
            <p className="text-gray-700 dark:text-gray-200">{getMoodById(currentMood).label}</p>
            <button 
              className="ml-auto py-2 px-4 bg-gray-200 dark:bg-gray-600 rounded-full text-gray-700 dark:text-gray-200 text-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              onClick={() => setShowMoodSelector(true)}
            >
              Change
            </button>
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">You haven't logged your mood today</p>
        )}
      </div>
      
      {/* Mood Selection Dialog */}
      {showMoodSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50 p-5">
          <h3 className="text-xl font-semibold text-white mb-5 text-center">How are you feeling today?</h3>
          <div className="flex flex-wrap gap-4 justify-center max-w-2xl md:flex-row sm:flex-col">
            {moodOptions.map((mood) => (
              <button
                key={mood.value}
                className="flex flex-col items-center p-4 rounded-xl border-none cursor-pointer transition-transform hover:translate-y-[-5px] hover:shadow-xl text-white md:w-24 sm:w-full sm:flex-row sm:justify-start sm:gap-4"
                onClick={() => handleMoodSelect(mood.value)}
                style={{ backgroundColor: mood.color }}
              >
                <span className="text-4xl mb-2 sm:mb-0">{mood.emoji}</span>
                <span className="text-base font-medium">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Mood History */}
      <div className="bg-white dark:bg-gray-700 p-5 rounded-lg mb-6 shadow-sm">
        <h3 className="mt-0 text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Your Mood History</h3>
        {moodHistory.length > 0 ? (
          <div className="mt-5">
            {/* Simple visualization of mood history */}
            <div className="flex justify-between items-end h-52 pb-8 relative overflow-x-auto">
              <div className="absolute left-0 right-0 bottom-8 h-px bg-gray-300 dark:bg-gray-600"></div>
              {moodHistory
                .slice(-7) // Show last 7 days
                .map((entry, index) => {
                  const moodInfo = getMoodById(entry.mood);
                  return (
                    <div key={index} className="flex flex-col items-center w-10 min-w-10 mr-2.5">
                      <div 
                        className="w-10 rounded-t-md relative transition-all duration-500"
                        style={{ 
                          height: `${entry.mood * 20}%`,
                          backgroundColor: moodInfo.color 
                        }}
                        title={`${formatDate(entry.date)}: ${moodInfo.label}`}
                      >
                        <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xl">{moodInfo.emoji}</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 text-center sm:transform sm:rotate-[-45deg] sm:whitespace-nowrap sm:w-16 sm:text-left sm:-ml-2.5">{formatDate(entry.date)}</div>
                    </div>
                  );
                })}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400 italic">No mood history available yet. Start tracking your mood daily!</p>
        )}
      </div>
      
      {/* Mood Insights */}
      {moodHistory.length >= 3 && (
        <div className="bg-blue-50 dark:bg-gray-700/50 p-5 rounded-lg border-l-4 border-blue-500 dark:border-purple-400">
          <h3 className="mt-0 text-lg font-semibold text-gray-700 dark:text-gray-200">Insights</h3>
          <p className="mb-0 text-gray-700 dark:text-gray-200 leading-relaxed">
            {calculateMoodInsight(moodHistory)}
          </p>
        </div>
      )}
    </div>
  );
};

// Helper function to calculate mood insights
const calculateMoodInsight = (moodHistory) => {
  if (moodHistory.length < 3) return '';
  
  // Get average mood for the last 7 days
  const recentMoods = moodHistory.slice(-7);
  const avgMood = recentMoods.reduce((sum, entry) => sum + entry.mood, 0) / recentMoods.length;
  
  // Get trend (improving, declining, stable)
  const oldestMoods = recentMoods.slice(0, Math.ceil(recentMoods.length / 2));
  const newestMoods = recentMoods.slice(Math.ceil(recentMoods.length / 2));
  
  const oldAvg = oldestMoods.reduce((sum, entry) => sum + entry.mood, 0) / oldestMoods.length;
  const newAvg = newestMoods.reduce((sum, entry) => sum + entry.mood, 0) / newestMoods.length;
  
  const difference = newAvg - oldAvg;
  
  if (difference > 0.5) {
    return "Your mood appears to be improving over the past few days. Keep up the good work!";
  } else if (difference < -0.5) {
    return "Your mood seems to have declined recently. Would you like to talk about what's been happening?";
  } else if (avgMood > 3.5) {
    return "You've been maintaining a positive mood lately. That's wonderful!";
  } else if (avgMood < 2.5) {
    return "You've been feeling down lately. Remember that it's okay to ask for help when needed.";
  } else {
    return "Your mood has been relatively stable lately.";
  }
};

export default MoodTracker;