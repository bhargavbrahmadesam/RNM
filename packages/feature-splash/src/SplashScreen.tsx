import { useEffect, useRef } from 'react'
import { Animated, Image, StyleSheet, type ImageSourcePropType } from 'react-native'
import { Screen, ThemedText } from '@squeez/shared-ui'

type SplashScreenProps = {
  /** Logo image. Passed in by the app, because features can't import from apps/. */
  logo: ImageSourcePropType
  appName?: string
  /** How long the logo stays visible after fading in. */
  holdMs?: number
  /** Called once the splash has finished showing. */
  onFinish: () => void
}

export function SplashScreen({ logo, appName, holdMs = 1000, onFinish }: SplashScreenProps) {
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.delay(holdMs),
    ])

    animation.start(({ finished }) => {
      if (finished) onFinish()
    })

    return () => animation.stop()
  }, [opacity, holdMs, onFinish])

  return (
    <Screen padded={false} style={styles.center}>
      <Animated.View style={[styles.content, { opacity }]}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        {appName ? <ThemedText variant="h1">{appName}</ThemedText> : null}
      </Animated.View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  content: { alignItems: 'center', gap: 16 },
  logo: { width: 160, height: 160 },
})