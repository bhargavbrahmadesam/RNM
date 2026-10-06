import type { ComponentProps } from 'react'
import { Ionicons } from '@expo/vector-icons'

export type DrawerIcon = ComponentProps<typeof Ionicons>['name']

export type DrawerItem = {
  name: string
  label: string
  icon: DrawerIcon
}

export const drawerItems: DrawerItem[] = [
  { name: 'index', label: 'Home', icon: 'home-outline' },
  { name: 'dashboard', label: 'Dashboard', icon: 'grid-outline' },
  { name: 'notifications', label: 'Notifications', icon: 'notifications-outline' },
  { name: 'profile', label: 'Profile', icon: 'person-outline' },
  { name: 'settings', label: 'Settings', icon: 'settings-outline' },
  { name: 'toolkit', label: 'Toolkit', icon: 'construct-outline' },
]