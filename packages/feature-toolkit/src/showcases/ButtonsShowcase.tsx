import { StyleSheet, View } from 'react-native'
import { Button, ThemedText } from '@squeez/shared-ui'

const variants = ['primary', 'secondary', 'danger', 'ghost', 'outline'] as const
const sizes = ['sm', 'md', 'lg'] as const

const noop = () => {}

export function ButtonsShowcase() {
  return (
    <View style={styles.root}>
      <ThemedText variant="label" tone="secondary">
        Variants
      </ThemedText>
      <View style={styles.row}>
        {variants.map((variant) => (
          <Button key={variant} label={variant} variant={variant} onPress={noop} />
        ))}
      </View>

      <ThemedText variant="label" tone="secondary">
        Sizes
      </ThemedText>
      <View style={styles.row}>
        {sizes.map((size) => (
          <Button key={size} label={size} size={size} onPress={noop} />
        ))}
      </View>

      <ThemedText variant="label" tone="secondary">
        States
      </ThemedText>
      <View style={styles.row}>
        <Button label="Disabled" disabled onPress={noop} />
        <Button label="Loading" loading onPress={noop} />
      </View>

      <ThemedText variant="label" tone="secondary">
        With icon
      </ThemedText>
      <View style={styles.row}>
        <Button label="Add" icon="add" onPress={noop} />
        <Button label="Next" icon="arrow-forward" iconPosition="right" onPress={noop} />
      </View>

      <ThemedText variant="label" tone="secondary">
        Full width
      </ThemedText>
      <Button label="Full width button" fullWidth onPress={noop} />
    </View>
  )
}

const styles = StyleSheet.create({
  root: { gap: 12 },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
})