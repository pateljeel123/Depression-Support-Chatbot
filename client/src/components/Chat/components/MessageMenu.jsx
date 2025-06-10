import React, { useState, useRef, useEffect } from 'react';
import { FiMoreHorizontal, FiCopy, FiEdit2, FiTrash2, FiStar, FiShare2, FiCornerUpLeft, FiSmile } from 'react-icons/fi';
import { IoMdVolumeHigh } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from './Tooltip';

export const MessageMenu = ({ message, onCopy, onEdit, onDelete, onStar, onShare, onReply, onReact, onSpeak }) => {
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
    { label: 'Edit', icon: <FiEdit2 size={16} />, action: onEdit, show: !!onEdit && message.role === 'user' },
    { label: 'Delete', icon: <FiTrash2 size={16} />, action: onDelete, show: !!onDelete },
    { label: 'Star', icon: <FiStar size={16} />, action: onStar, show: !!onStar },
    { label: 'Share', icon: <FiShare2 size={16} />, action: onShare, show: !!onShare },
    { label: 'Reply', icon: <FiCornerUpLeft size={16} />, action: onReply, show: !!onReply },
    { label: 'React', icon: <FiSmile size={16} />, action: onReact, show: !!onReact },
    { label: 'Speak', icon: <IoMdVolumeHigh size={16} />, action: onSpeak, show: !!onSpeak }
  ];

  return (
    <div className="relative" ref={menuRef}>
      <Tooltip content="Message options">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground transition-colors"
          aria-label="Message options"
        >
          <FiMoreHorizontal size={14} />
        </button>
      </Tooltip>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="absolute top-0 right-0 mt-8 w-36 bg-card border border-border rounded-md shadow-sm z-50"
          >
            <ul className="py-1">
              {menuItems.filter(item => item.show).map((item, index) => (
                <li key={index}>
                  <button 
                    onClick={() => {
                      item.action();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-accent transition-colors text-foreground"
                  >
                    {item.icon}
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};