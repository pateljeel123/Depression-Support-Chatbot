import React, { useState, useCallback } from 'react';
import { FiUploadCloud, FiX, FiFileText, FiImage } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';

export const FileUpload = ({ attachments, setAttachments, darkMode }) => {
  const onDrop = useCallback(acceptedFiles => {
    setAttachments(prev => [...prev, ...acceptedFiles.slice(0, 5 - prev.length)]); // Limit to 5 files
  }, [setAttachments]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*,application/pdf,.doc,.docx,.txt,.csv',
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeAttachment = (fileName) => {
    setAttachments(prev => prev.filter(file => file.name !== fileName));
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <FiImage className="w-6 h-6 text-blue-500" />;
    if (fileType === 'application/pdf') return <FiFileText className="w-6 h-6 text-red-500" />;
    return <FiFileText className="w-6 h-6 text-gray-500" />;
  };

  return (
    <div className="mt-2">
      <div
        {...getRootProps()}
        className={`p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${isDragActive 
            ? (darkMode ? 'border-indigo-400 bg-gray-700' : 'border-indigo-500 bg-indigo-50') 
            : (darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400')
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          <FiUploadCloud className={`w-10 h-10 mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          {isDragActive ? (
            <p className={`text-sm ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>Drop files here...</p>
          ) : (
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Drag & drop files here, or click to select (max 5MB each)</p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div 
            className="mt-3 space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {attachments.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center justify-between p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
              >
                <div className="flex items-center space-x-2 overflow-hidden">
                  {getFileIcon(file.type)}
                  <span className={`text-xs truncate ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{file.name}</span>
                  <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
                <button 
                  onClick={() => removeAttachment(file.name)} 
                  className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'}`}
                >
                  <FiX className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};