import { StyleSheet, View } from 'react-native'
import { Button, Card, ThemedText, useTheme } from '@squeez/shared-ui'

const noop = () => {}

export function CardsShowcase() {
  const { theme } = useTheme()

  return (
    <View style={styles.root}>
      <ThemedText variant="label" tone="secondary">
        Title and subtitle
      </ThemedText>
      <Card title="Monthly report" subtitle="Updated 2 hours ago">
        <ThemedText>Card body content goes here.</ThemedText>
      </Card>

      <ThemedText variant="label" tone="secondary">
        With footer
      </ThemedText>
      <Card
        title="Delete project"
        footer={
          <View style={styles.footerRow}>
            <Button label="Cancel" variant="secondary" size="sm" onPress={noop} />
            <Button label="Delete" variant="danger" size="sm" onPress={noop} />
          </View>
        }
      >
        <ThemedText>This action cannot be undone.</ThemedText>
      </Card>

      <ThemedText variant="label" tone="secondary">
        Custom header
      </ThemedText>
      <Card
        header={
          <View style={styles.customHeader}>
            <ThemedText variant="h2" tone="brand">
              Custom header
            </ThemedText>
          </View>
        }
      >
        <ThemedText>The header slot replaces the title and subtitle.</ThemedText>
      </Card>

      <ThemedText variant="label" tone="secondary">
        Not padded (content runs edge to edge)
      </ThemedText>
      <Card title="Edge to edge" padded={false}>
        <View style={[styles.edgeBlock, { backgroundColor: theme.bg.primary }]}>
          <ThemedText tone="secondary">This block touches the card edges.</ThemedText>
        </View>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { gap: 4 },
  footerRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  customHeader: { paddingHorizontal: 16, paddingBottom: 8 },
  edgeBlock: { padding: 16 },
})