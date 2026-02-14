import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

export const ThemeToggle = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
      }`}
      aria-label="Toggle dark mode"
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isDarkMode ? 'translate-x-6' : 'translate-x-1'
        }`}
      >
        <span className="absolute inset-0 flex items-center justify-center">
          {isDarkMode ? (
            <FiMoon size={10} className="text-gray-800" />
          ) : (
            <FiSun size={10} className="text-yellow-500" />
          )}
        </span>
      </span>
    </button>
  );
};