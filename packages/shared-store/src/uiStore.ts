import { create } from 'zustand'

export type ThemeName = 'light' | 'dark' | 'blue' | 'orange'
export type NavigationMode = 'drawer' | 'tabs'

type UiState = {
  theme: ThemeName
  navigationMode: NavigationMode
  setTheme: (theme: ThemeName) => void
  setNavigationMode: (mode: NavigationMode) => void
  toggleTheme: () => void
}

export const useUiStore = create<UiState>((set) => ({
  theme: 'light',
  navigationMode: 'drawer',
  setTheme: (theme) => set({ theme }),
  setNavigationMode: (mode) => set({ navigationMode: mode }),
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),
}))