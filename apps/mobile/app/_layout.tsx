import 'react-native-gesture-handler'
import { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ThemeProvider } from '@squeez/shared-ui'
import { NavigationRoot } from '@squeez/feature-navigation'
import { SplashScreen } from '@squeez/feature-splash'

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true)
  const handleSplashFinish = useCallback(() => setShowSplash(false), [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <NavigationRoot />
        {showSplash && (
          <View style={StyleSheet.absoluteFill}>
            <SplashScreen
              logo={require('../assets/golf.png')}
              appName="Squeez"
              onFinish={handleSplashFinish}
            />
          </View>
        )}
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}