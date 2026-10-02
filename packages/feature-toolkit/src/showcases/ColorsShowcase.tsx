import { StyleSheet, View } from 'react-native'
import { ThemedText, useTheme } from '@squeez/shared-ui'

export function ColorsShowcase() {
  const { theme } = useTheme()
  const groups = Object.entries(theme) as [string, Record<string, string>][]

  return (
    <View style={styles.root}>
      {groups.map(([group, tokens]) => (
        <View key={group} style={styles.group}>
          <ThemedText variant="label" tone="secondary">
            {group}
          </ThemedText>
          <View style={styles.row}>
            {Object.entries(tokens).map(([name, value]) => (
              <View key={name} style={styles.swatchWrap}>
                <View
                  style={[
                    styles.swatch,
                    { backgroundColor: value, borderColor: theme.border.default },
                  ]}
                />
                <ThemedText variant="caption">{name}</ThemedText>
                <ThemedText variant="caption" tone="secondary">
                  {value}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  root: { gap: 16 },
  group: { gap: 8 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  swatchWrap: { width: 88, gap: 2 },
  swatch: { height: 44, borderRadius: 8, borderWidth: 1, marginBottom: 4 },
})