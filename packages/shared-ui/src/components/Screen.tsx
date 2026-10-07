import { ScrollView, StyleSheet, View, type ViewProps } from 'react-native'
import type { ReactNode } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '../theme'

type ScreenProps = ViewProps & {
  children: ReactNode
  scrollable?: boolean
  padded?: boolean
  edges?: ('top' | 'bottom')[]
}

export function Screen({
  children,
  scrollable = false,
  padded = true,
  edges = ['top', 'bottom'],
  style,
  ...rest
}: ScreenProps) {
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()

  const paddingStyle = [
    padded && styles.padded,
    {
      paddingTop: padded && edges.includes('top') ? insets.top + 16 : undefined,
      paddingBottom: padded && edges.includes('bottom') ? insets.bottom + 16 : undefined,
    },
    style,
  ]

  if (scrollable) {
    return (
      <ScrollView
        style={[styles.fill, { backgroundColor: theme.bg.primary }]}
        contentContainerStyle={paddingStyle}
        {...rest}
      >
        {children}
      </ScrollView>
    )
  }

  return (
    <View
      style={[styles.fill, { backgroundColor: theme.bg.primary }, paddingStyle]}
      {...rest}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  padded: { paddingHorizontal: 20 },
})