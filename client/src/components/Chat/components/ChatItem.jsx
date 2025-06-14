import React from "react";
import { motion } from "framer-motion";
import { FiEdit2, FiTrash2, FiStar, FiMoreHorizontal } from "react-icons/fi";
import { Tooltip } from "./Tooltip"; // Assuming Tooltip is in the same directory or adjust path

import { FiMessageSquare } from "react-icons/fi"; // Added for chat icon

export const ChatItem = ({
  chat,
  activeChat,

  editingChatId,
  editTitle,
  setEditTitle,
  handleSelectChat,
  handleStartEdit,
  handleSaveEdit,
  handleDeleteChat,
  handleTogglePin,
  pinnedChats,
  isNewUI = false, // New prop for UI style
}) => {
  const isActive = activeChat === chat.id;
  const isPinned = pinnedChats && pinnedChats.includes(chat.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      onClick={() => handleSelectChat(chat.id)}
      className={`flex items-start justify-between p-3 rounded-md cursor-pointer transition-all duration-200 group relative
        ${
          isActive
            ? "bg-gray-700 shadow-md"
            : "hover:bg-gray-750 hover:shadow-md"
        }
        ${isNewUI ? "flex-col" : "items-center"}
        mb-2
      `}
    >
      {isNewUI && (
        <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip content="Delete chat">
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent chat selection
                handleDeleteChat(chat.id, e);
              }}
              className="p-1.5 rounded-full hover:bg-red-500 hover:text-white"
            >
              <FiTrash2 size={14} />
            </button>
          </Tooltip>
          {/* Placeholder for other potential actions like pin for new UI if needed */}
          {/* Example: <FiMoreHorizontal size={16} /> */}
        </div>
      )}
      {isNewUI ? (
        <div className="w-full">
          <div className="flex items-center">
            <FiMessageSquare
              size={14}
              className="mr-2 text-gray-400"
            />
            <span
              className="text-sm font-medium truncate flex-grow text-gray-200 hover:text-indigo-500 transition-colors duration-200"
            >
              {chat.title}
            </span>
          </div>
        </div>
      ) : (
        // When isNewUI is false
        <>
          {editingChatId === chat.id ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(e)}
              autoFocus
              className="flex-grow text-sm p-1 rounded bg-gray-600 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          ) : (
            <span className="text-sm truncate flex-grow pr-2">
              {chat.title}
            </span>
          )}
          {/* Actions for old UI, now inside the fragment */}
          <div
            className={`flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${
              isActive ? "opacity-100" : ""
            }`}
          >
            <Tooltip content={isPinned ? "Unpin chat" : "Pin chat"}>
              <button
                onClick={(e) => handleTogglePin(chat.id, e)}
                className={`p-1.5 rounded-full ${
                  darkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
                } ${
                  isPinned
                    ? darkMode
                      ? "text-yellow-400"
                      : "text-yellow-500"
                    : ""
                }`}
              >
                <FiStar size={14} />
              </button>
            </Tooltip>
            <Tooltip content="Edit title">
              <button
                onClick={(e) => handleStartEdit(chat, e)}
                className={`p-1.5 rounded-full ${
                  darkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
                }`}
              >
                <FiEdit2 size={14} />
              </button>
            </Tooltip>
            <Tooltip content="Delete chat">
              <button
                onClick={(e) => handleDeleteChat(chat.id, e)}
                className={`p-1.5 rounded-full ${
                  darkMode
                    ? "hover:bg-red-500 hover:text-white"
                    : "hover:bg-red-100 hover:text-red-500"
                }`}
              >
                <FiTrash2 size={14} />
              </button>
            </Tooltip>
          </div>
        </>
      )}
    </motion.div>
  );
};
