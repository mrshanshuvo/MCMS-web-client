import React from 'react';
import { Sun, Moon } from 'lucide-react';
import useTheme from '../../hooks/useTheme';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center border shadow-sm ${
        theme === 'dark'
          ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
          : 'bg-white border-gray-200 text-slate-700 hover:bg-gray-50'
      } ${className}`}
      aria-label="Toggle Theme"
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
    >
      {theme === 'dark' ? (
        <Sun size={18} className="animate-[spin_10s_linear_infinite]" />
      ) : (
        <Moon size={18} />
      )}
    </button>
  );
};

export default ThemeToggle;
