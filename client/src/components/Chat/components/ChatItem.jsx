import React from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiStar, FiMoreHorizontal } from 'react-icons/fi';
import { Tooltip } from './Tooltip'; // Assuming Tooltip is in the same directory or adjust path

export const ChatItem = ({
  chat,
  activeChat,
  darkMode,
  editingChatId,
  editTitle,
  setEditTitle,
  handleSelectChat,
  handleStartEdit,
  handleSaveEdit,
  handleDeleteChat,
  handleTogglePin,
  pinnedChats
}) => {
  const isActive = activeChat === chat.id;
  const isPinned = pinnedChats.includes(chat.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      onClick={() => handleSelectChat(chat.id)}
      className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors duration-150 group
        ${isActive 
          ? (darkMode ? 'bg-indigo-500 text-white' : 'bg-indigo-500 text-white') 
          : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
        }
      `}
    >
      {editingChatId === chat.id ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(e)}
          autoFocus
          className={`flex-grow text-sm p-1 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-800'} focus:outline-none focus:ring-1 focus:ring-indigo-500`}
        />
      ) : (
        <span className="text-sm truncate flex-grow pr-2">
          {chat.title}
        </span>
      )}
      <div className={`flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${isActive ? 'opacity-100' : ''}`}>
        <Tooltip content={isPinned ? "Unpin chat" : "Pin chat"}>
          <button 
            onClick={(e) => handleTogglePin(chat.id, e)} 
            className={`p-1.5 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} ${isPinned ? (darkMode ? 'text-yellow-400' : 'text-yellow-500') : ''}`}
          >
            <FiStar size={14} />
          </button>
        </Tooltip>
        <Tooltip content="Edit title">
          <button onClick={(e) => handleStartEdit(chat, e)} className={`p-1.5 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}>
            <FiEdit2 size={14} />
          </button>
        </Tooltip>
        <Tooltip content="Delete chat">
          <button onClick={(e) => handleDeleteChat(chat.id, e)} className={`p-1.5 rounded-full ${darkMode ? 'hover:bg-red-500 hover:text-white' : 'hover:bg-red-100 hover:text-red-500'}`}>
            <FiTrash2 size={14} />
          </button>
        </Tooltip>
      </div>
    </motion.div>
  );
};