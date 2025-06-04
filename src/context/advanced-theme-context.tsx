'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system' | 'blue' | 'green' | 'purple'
type ColorScheme = 'default' | 'warm' | 'cool' | 'monochrome'

type AdvancedThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultColorScheme?: ColorScheme
  storageKey?: string
}

type AdvancedThemeProviderState = {
  theme: Theme
  colorScheme: ColorScheme
  setTheme: (theme: Theme) => void
  setColorScheme: (scheme: ColorScheme) => void
  toggleTheme: () => void
  isDark: boolean
  isLight: boolean
  isSystem: boolean
}

const initialState: AdvancedThemeProviderState = {
  theme: 'system',
  colorScheme: 'default',
  setTheme: () => null,
  setColorScheme: () => null,
  toggleTheme: () => null,
  isDark: false,
  isLight: false,
  isSystem: true,
}

const AdvancedThemeProviderContext = createContext<AdvancedThemeProviderState>(initialState)

export function AdvancedThemeProvider({
  children,
  defaultTheme = 'system',
  defaultColorScheme = 'default',
  storageKey = 'candidatoscope-theme',
  ...props
}: AdvancedThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage?.getItem(storageKey) as Theme) || defaultTheme
  )
  
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    () => (localStorage?.getItem(`${storageKey}-color`) as ColorScheme) || defaultColorScheme
  )

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const root = window.document.documentElement

    // Remove all theme classes
    root.classList.remove('light', 'dark', 'blue', 'green', 'purple')
    root.classList.remove('warm', 'cool', 'monochrome')

    let actualTheme: 'light' | 'dark' = 'light'

    if (theme === 'system') {
      actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } else if (theme === 'blue' || theme === 'green' || theme === 'purple') {
      actualTheme = 'dark' // Colored themes are dark-based
      root.classList.add(theme)
    } else {
      actualTheme = theme as 'light' | 'dark'
    }

    root.classList.add(actualTheme)
    root.classList.add(colorScheme)
    setResolvedTheme(actualTheme)

    // Apply custom CSS variables for advanced theming
    applyThemeVariables(theme, colorScheme)
  }, [theme, colorScheme])

  const applyThemeVariables = (currentTheme: Theme, currentColorScheme: ColorScheme) => {
    const root = document.documentElement

    // Color scheme variables
    const colorSchemes = {
      default: {
        '--primary-hue': '220',
        '--primary-saturation': '70%',
      },
      warm: {
        '--primary-hue': '25',
        '--primary-saturation': '75%',
      },
      cool: {
        '--primary-hue': '200',
        '--primary-saturation': '65%',
      },
      monochrome: {
        '--primary-hue': '0',
        '--primary-saturation': '0%',
      }
    }

    // Theme-specific variables
    const themeVariables = {
      blue: {
        '--primary': '210 100% 50%',
        '--primary-foreground': '0 0% 100%',
      },
      green: {
        '--primary': '120 60% 45%',
        '--primary-foreground': '0 0% 100%',
      },
      purple: {
        '--primary': '270 70% 55%',
        '--primary-foreground': '0 0% 100%',
      }
    }

    // Apply color scheme
    Object.entries(colorSchemes[currentColorScheme]).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })

    // Apply theme-specific variables
    if (currentTheme in themeVariables) {
      Object.entries(themeVariables[currentTheme as keyof typeof themeVariables]).forEach(([key, value]) => {
        root.style.setProperty(key, value)
      })
    }
  }

  const value = {
    theme,
    colorScheme,
    setTheme: (theme: Theme) => {
      localStorage?.setItem(storageKey, theme)
      setTheme(theme)
    },
    setColorScheme: (scheme: ColorScheme) => {
      localStorage?.setItem(`${storageKey}-color`, scheme)
      setColorScheme(scheme)
    },
    toggleTheme: () => {
      const newTheme = resolvedTheme === 'light' ? 'dark' : 'light'
      localStorage?.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    isSystem: theme === 'system',
  }

  return (
    <AdvancedThemeProviderContext.Provider {...props} value={value}>
      {children}
    </AdvancedThemeProviderContext.Provider>
  )
}

export const useAdvancedTheme = () => {
  const context = useContext(AdvancedThemeProviderContext)

  if (context === undefined)
    throw new Error('useAdvancedTheme must be used within an AdvancedThemeProvider')

  return context
}
