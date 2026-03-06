import { useState, useEffect } from 'react';
import { ReaderTheme } from '@/lib/types';

const THEME_KEY = 'ebook-reader-theme';

export function useReaderTheme() {
  const [theme, setTheme] = useState<ReaderTheme>(() => {
    return (localStorage.getItem(THEME_KEY) as ReaderTheme) || 'light';
  });

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const getCanvasFilter = (): string => {
    switch (theme) {
      case 'dark':
        return 'invert(1) hue-rotate(180deg)';
      case 'sepia':
        return 'sepia(0.4)';
      default:
        return 'none';
    }
  };

  const getBgColor = (): string => {
    switch (theme) {
      case 'dark':
        return '#1a1a2e';
      case 'sepia':
        return '#f4ecd8';
      default:
        return '#ffffff';
    }
  };

  const getTextColor = (): string => {
    switch (theme) {
      case 'dark':
        return '#e0e0e0';
      case 'sepia':
        return '#5b4636';
      default:
        return '#1a1a1a';
    }
  };

  return { theme, setTheme, getCanvasFilter, getBgColor, getTextColor };
}
