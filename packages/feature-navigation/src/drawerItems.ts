export type DrawerItem = {
  name: string
  label: string
  icon:
    | 'home-outline'
    | 'grid-outline'
    | 'person-outline'
    | 'settings-outline'
}

export const drawerItems: DrawerItem[] = [
  { name: 'index', label: 'Home', icon: 'home-outline' },
  { name: 'dashboard', label: 'Dashboard', icon: 'grid-outline' },
  { name: 'profile', label: 'Profile', icon: 'person-outline' },
  { name: 'settings', label: 'Settings', icon: 'settings-outline' },
]