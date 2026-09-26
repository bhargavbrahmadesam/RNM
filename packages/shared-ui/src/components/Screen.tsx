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

  const containerStyle = [
    styles.base,
    { backgroundColor: theme.bg.primary },
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
        style={[styles.base, { backgroundColor: theme.bg.primary }]}
        contentContainerStyle={containerStyle}
        {...rest}
      >
        {children}
      </ScrollView>
    )
  }

  return (
    <View style={containerStyle} {...rest}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  base: { flex: 1 },
  padded: { paddingHorizontal: 20 },
})