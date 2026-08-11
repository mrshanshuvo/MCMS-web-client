import React from 'react';
import { Sun, Moon } from 'lucide-react';
import useTheme from '../../hooks/useTheme';
import { Button } from '@/components/ui/button';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={`h-9 w-9 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${className}`}
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-amber-400 transition-all transform hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 dark:text-slate-200 transition-all transform hover:-rotate-12" />
      )}
    </Button>
  );
};

export default ThemeToggle;
