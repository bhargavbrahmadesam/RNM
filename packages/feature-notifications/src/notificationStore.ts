import { create } from 'zustand'

export type AppNotification = {
  id: string
  title: string
  body: string
  url?: string
  receivedAt: number
  read: boolean
}

type NotificationState = {
  items: AppNotification[]
  add: (n: Omit<AppNotification, 'receivedAt' | 'read'>) => void
  markRead: (id: string) => void
  markAllRead: () => void
  clear: () => void
  unreadCount: () => number
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  items: [],

  add: (n) =>
    set((state) => ({
      items: [
        {
          ...n,
          receivedAt: Date.now(),
          read: false,
        },
        ...state.items,
      ],
    })),

  markRead: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, read: true } : item,
      ),
    })),

  markAllRead: () =>
    set((state) => ({
      items: state.items.map((item) => ({ ...item, read: true })),
    })),

  clear: () => set({ items: [] }),

  unreadCount: () => get().items.filter((i) => !i.read).length,
}))