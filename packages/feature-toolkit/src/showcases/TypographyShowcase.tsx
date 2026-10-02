import { StyleSheet, View } from 'react-native'
import { ThemedText } from '@squeez/shared-ui'

const variants = ['h1', 'h2', 'h3', 'body', 'caption', 'label'] as const
const tones = ['primary', 'secondary', 'brand', 'danger'] as const

export function TypographyShowcase() {
  return (
    <View style={styles.root}>
      <ThemedText variant="label" tone="secondary">
        Variants
      </ThemedText>
      {variants.map((variant) => (
        <ThemedText key={variant} variant={variant}>
          {variant} - The quick brown fox
        </ThemedText>
      ))}

      <ThemedText variant="label" tone="secondary">
        Tones
      </ThemedText>
      {tones.map((tone) => (
        <ThemedText key={tone} tone={tone}>
          {tone} - The quick brown fox
        </ThemedText>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  root: { gap: 8 },
})