
// This file is deprecated. Please use ThemeProvider and useCustomTheme from '@/context/theme-context.tsx'

// 'use client';

// import { useState, useEffect, useCallback } from 'react';

// type Theme = 'light' | 'dark';

// export function useTheme(defaultTheme: Theme = 'dark') {
//   const [theme, setThemeState] = useState<Theme>(defaultTheme);

//   // Effect to set initial theme from localStorage on client-side
//   useEffect(() => {
//     const storedTheme = localStorage.getItem('theme') as Theme | null;
//     if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
//       setThemeState(storedTheme);
//     }
//   }, []);

//   // Effect to apply theme to DOM and update localStorage
//   useEffect(() => {
//     const root = window.document.documentElement;
//     root.classList.remove('light', 'dark');
//     root.classList.add(theme);
//     localStorage.setItem('theme', theme);
//   }, [theme]);

//   const toggleTheme = useCallback(() => {
//     setThemeState((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
//   }, []);

//   // Function to explicitly set the theme
//   const setTheme = useCallback((newTheme: Theme) => {
//     setThemeState(newTheme);
//   }, []);

//   return { theme, toggleTheme, setTheme };
// }
export {}; // Add an empty export to make it a module and satisfy linters if the file is kept empty.
// It's better to delete this file if it's truly no longer used. For now, I'll empty it.
