import { View, Text, StyleSheet } from 'react-native'
import { Link } from 'expo-router'

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello from squeez-mobile</Text>
      <Text style={styles.body}>Router is working.</Text>

      <Link href="/dashboard" style={styles.link}>
        Go to Dashboard →
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 14, color: '#555' },
  link: { fontSize: 16, color: '#007AFF', marginTop: 24 },
})
