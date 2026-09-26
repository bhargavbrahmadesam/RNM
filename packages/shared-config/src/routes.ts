export const routes = {
  home: '/',
  dashboard: '/dashboard',
  profile: '/profile',
  settings: '/settings',
} as const

export type RouteName = keyof typeof routes
