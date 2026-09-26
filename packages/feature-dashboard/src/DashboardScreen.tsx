import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { routes } from '@squeez/shared-config'

export function DashboardScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>This screen lives in @squeez/feature-dashboard</Text>

      <Text style={styles.cardTitle}>Ownership</Text>
      <Text style={styles.cardBody}>
        This whole screen — its folder, its dependencies, its lifecycle — belongs to the dashboard
        feature package. The app just points to it.
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 8 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 13, color: '#777', marginBottom: 16 },
  cardTitle: { fontSize: 12, color: '#999', marginBottom: 4, textTransform: 'uppercase' },
  cardBody: { fontSize: 14, color: '#333' },
})
