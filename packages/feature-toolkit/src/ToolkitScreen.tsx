import { ScrollView, StyleSheet } from 'react-native'
import { Card, Screen, ThemedText } from '@squeez/shared-ui'
import { ThemeSwitcher } from './ThemeSwitcher'
import { showcases } from './index'

export function ToolkitScreen() {
  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText variant="h1">Developer Toolkit</ThemedText>
        <ThemedText tone="secondary">
          Preview the shared UI components in every theme.
        </ThemedText>

        <ThemeSwitcher />

        {showcases.map(({ id, title, Component }) => (
          <Card key={id} title={title}>
            <Component />
          </Card>
        ))}
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40, gap: 12 },
})  