import { createContext, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'
import { useUiStore, type ThemeName } from '@squeez/shared-store'
import { themes, type Theme } from './themes'

export type { ThemeName }

type ThemeContextValue = {
  theme: Theme
  themeName: ThemeName
  setTheme: (name: ThemeName) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

type ThemeProviderProps = {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeName = useUiStore((s) => s.theme)
  const setTheme = useUiStore((s) => s.setTheme)

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