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
      
    </button>
  );
};