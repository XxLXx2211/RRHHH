
'use client';

import React, { createContext, useState, useEffect, useCallback, useContext, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'dark', // Defaulting to dark here is key
  storageKey = 'theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedTheme = window.localStorage.getItem(storageKey) as Theme | null;
        if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
          return storedTheme;
        }
      } catch (e) {
        console.error('Failed to access localStorage for theme:', e);
      }
    }
    return defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    // Remove any existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    // If the theme is 'dark', and CSS :root is already dark, adding '.dark' is fine.
    // If the theme is 'light', it adds '.light' which will override the :root dark styles.
    root.classList.add(theme); 

    try {
      window.localStorage.setItem(storageKey, theme);
    } catch (e) {
      console.error('Failed to set localStorage for theme:', e);
    }
  }, [theme, storageKey]);

  const toggleTheme = useCallback(() => {
    setThemeState((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const value = {
    theme,
    toggleTheme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useCustomTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useCustomTheme must be used within a ThemeProvider');
  }
  return context;
};
