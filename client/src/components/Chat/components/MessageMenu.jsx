import React, { useState, useRef, useEffect } from 'react';
import { FiMoreHorizontal, FiCopy, FiEdit2, FiTrash2, FiStar, FiShare2, FiCornerUpLeft, FiSmile } from 'react-icons/fi';
import { IoMdVolumeHigh } from 'react-icons/io'; // Import volume icon for TTS
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from './Tooltip';

export const MessageMenu = ({ message, darkMode, onCopy, onEdit, onDelete, onStar, onShare, onReply, onReact, onSpeak }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems = [
    { label: 'Copy', icon: <FiCopy size={16} />, action: onCopy, show: !!onCopy },
    { label: 'Edit', icon: <FiEdit2 size={16} />, action: onEdit, show: !!onEdit && message.role === 'user' }, // Only allow editing user messages
    { label: 'Delete', icon: <FiTrash2 size={16} />, action: onDelete, show: !!onDelete },
    { label: 'Star', icon: <FiStar size={16} />, action: onStar, show: !!onStar },
    { label: 'Share', icon: <FiShare2 size={16} />, action: onShare, show: !!onShare },
    { label: 'Reply', icon: <FiCornerUpLeft size={16} />, action: onReply, show: !!onReply }, // Added Reply
    { label: 'React', icon: <FiSmile size={16} />, action: onReact, show: !!onReact }, // Added React
    { label: 'Speak', icon: <IoMdVolumeHigh size={16} />, action: onSpeak, show: !!onSpeak } // Added Speak for TTS
  ].filter(item => item.show);

  if (menuItems.length === 0) return null;

  return (
    <div className="relative" ref={menuRef}>
      <Tooltip content="More actions">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`p-1.5 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'} ${isOpen ? (darkMode ? 'bg-gray-600' : 'bg-gray-300') : ''}`}
        >
          <FiMoreHorizontal size={18} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </button>
      </Tooltip>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 right-0 mt-2 w-48 rounded-md shadow-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border ring-1 ring-black ring-opacity-5 focus:outline-none`}
          >
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => { item.action(message); setIsOpen(false); }}
                  className={`flex items-center w-full px-4 py-2 text-sm ${darkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}
                  role="menuitem"
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};