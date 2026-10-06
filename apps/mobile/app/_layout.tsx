import 'react-native-gesture-handler'
import { useCallback, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { router } from 'expo-router'
import * as Notifications from 'expo-notifications'
import { ThemeProvider } from '@squeez/shared-ui'
import { NavigationRoot } from '@squeez/feature-navigation'
import { SplashScreen } from '@squeez/feature-splash'
import { addNotificationTapListener } from '@squeez/shared-lib'

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true)
  const handleSplashFinish = useCallback(() => setShowSplash(false), [])

  // Handle notification taps — three scenarios covered below.
  useEffect(() => {
    // 1) App was killed, user tapped a notification → app boots → read it
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response) return
      const url = (response.notification.request.content.data as { url?: string })?.url
      if (url) router.push(url as never)
    })

    // 2) App is running (foreground or background), user taps → listener fires
    const unsubscribe = addNotificationTapListener(({ url }) => {
      if (url) router.push(url as never)
    })

    return unsubscribe
  }, [])

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