import 'react-native-gesture-handler'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ThemeProvider } from '@squeez/shared-ui'
import { NavigationRoot } from '@squeez/feature-navigation'

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <NavigationRoot />
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}