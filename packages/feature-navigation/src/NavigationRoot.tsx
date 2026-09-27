import { useUiStore } from '@squeez/shared-store'
import { ThemedDrawer } from './ThemedDrawer'
import { ThemedTabs } from './ThemedTabs'

export function NavigationRoot() {
  const navigationMode = useUiStore((s) => s.navigationMode)

  if (navigationMode === 'tabs') {
    return <ThemedTabs />
  }

  return <ThemedDrawer />
}