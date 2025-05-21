import React from 'react';
// Using a lightweight emoji picker, or you can integrate a more feature-rich one like 'emoji-picker-react'
// For simplicity, this is a placeholder. You'd typically use a library for a full emoji picker.

export const EmojiPicker = ({ onEmojiSelect, show }) => {
  if (!show) return null;

  // Example emojis - a real implementation would have a comprehensive list and UI
  const emojis = ['😀', '😂', '😍', '🤔', '😢', '🎉', '👍', '🚀'];

  return (
    <div 
      className="absolute bottom-16 left-0 mb-2 p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-xl z-50"
      style={{ minWidth: '200px' }}
    >
      <div className="grid grid-cols-4 gap-2">
        {emojis.map(emoji => (
          <button 
            key={emoji}
            onClick={() => onEmojiSelect({ native: emoji })}
            className="p-2 text-xl rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};