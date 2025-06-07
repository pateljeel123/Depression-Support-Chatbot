import React from 'react';

export const SkeletonLoader = ({ darkMode }) => {
  return (
    <div className="flex flex-col space-y-6 w-full py-8">
      {/* Day separator skeleton */}
      <div className="flex justify-center">
        <div className={`h-5 w-32 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
      </div>

      {/* User message skeleton */}
      <div className="flex justify-end mb-4">
        <div className={`max-w-md w-3/4 sm:w-1/2 rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div className="flex flex-col space-y-2">
            <div className={`h-4 w-3/4 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
            <div className={`h-4 w-full rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
            <div className={`h-4 w-1/2 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
          </div>
        </div>
      </div>

      {/* Bot message skeleton */}
      <div className="flex justify-start mb-4">
        <div className={`max-w-md w-3/4 sm:w-2/3 rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} ${darkMode ? 'border-gray-700' : 'border-gray-200'} border`}>
          <div className="flex flex-col space-y-2">
            <div className={`h-4 w-full rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-4 w-full rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-4 w-full rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-4 w-3/4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-4 w-1/2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          </div>
        </div>
      </div>

      {/* User message skeleton */}
      <div className="flex justify-end mb-4">
        <div className={`max-w-md w-1/2 rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div className="flex flex-col space-y-2">
            <div className={`h-4 w-full rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
            <div className={`h-4 w-2/3 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
          </div>
        </div>
      </div>

      {/* Bot message skeleton (longer) */}
      <div className="flex justify-start mb-4">
        <div className={`max-w-md w-3/4 sm:w-2/3 rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} ${darkMode ? 'border-gray-700' : 'border-gray-200'} border`}>
          <div className="flex flex-col space-y-2">
            <div className={`h-4 w-full rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-4 w-full rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-4 w-full rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-4 w-full rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-4 w-3/4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-4 w-1/2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};