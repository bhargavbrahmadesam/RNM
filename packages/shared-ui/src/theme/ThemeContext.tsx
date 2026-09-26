import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { themes, type Theme, type ThemeName } from './themes'

type ThemeContextValue = {
  theme: Theme
  themeName: ThemeName
  setTheme: (name: ThemeName) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

type ThemeProviderProps = {
  children: ReactNode
  initialTheme?: ThemeName
}

export function ThemeProvider({
  children,
  initialTheme = 'light',
}: ThemeProviderProps) {
  const [themeName, setThemeName] = useState<ThemeName>(initialTheme)

  const setTheme = useCallback((name: ThemeName) => {
    setThemeName(name)
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: themes[themeName],
      themeName,
      setTheme,
    }),
    [themeName, setTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used inside a <ThemeProvider>')
  }
  return ctx
}