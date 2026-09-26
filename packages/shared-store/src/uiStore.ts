import { create } from 'zustand'

type UiState = {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

export const useUiStore = create<UiState>((set) => ({
  theme: 'light',
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),
}))
