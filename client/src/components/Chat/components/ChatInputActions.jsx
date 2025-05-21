import React from 'react';
import { FiPaperclip, FiSmile, FiMic, FiMicOff } from 'react-icons/fi';
import { Tooltip } from './Tooltip';

export const ChatInputActions = ({
  onFileUploadClick,
  onEmojiToggle,
  onMicToggle,
  listening,
  browserSupportsSpeechRecognition,
  darkMode
}) => {
  return (
    <div className="flex items-center space-x-2 px-2">
      <Tooltip content="Attach file">
        <button 
          onClick={onFileUploadClick}
          className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
        >
          <FiPaperclip size={20} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </button>
      </Tooltip>
      <Tooltip content="Insert emoji">
        <button 
          onClick={onEmojiToggle}
          className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
        >
          <FiSmile size={20} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </button>
      </Tooltip>
      {browserSupportsSpeechRecognition && (
        <Tooltip content={listening ? 'Stop listening' : 'Start voice input'}>
          <button 
            onClick={onMicToggle}
            className={`p-2 rounded-full ${listening ? (darkMode ? 'bg-red-500 text-white' : 'bg-red-500 text-white') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200')}`}
          >
            {listening ? 
              <FiMicOff size={20} className={`${darkMode && !listening ? 'text-gray-400' : listening ? 'text-white' : 'text-gray-500'}`} /> : 
              <FiMic size={20} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            }
          </button>
        </Tooltip>
      )}
    </div>
  );
};