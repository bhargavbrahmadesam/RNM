import { useEffect, useState } from 'react'
import { ActivityIndicator, View, StyleSheet } from 'react-native'
import { Screen, Table, ThemedText, type Column } from '@squeez/shared-ui'
import { apiClient, getApiErrorMessage } from '@squeez/shared-lib'

type Photo = {
  albumId: number
  id: number
  title: string
  url: string
  thumbnailUrl: string
}

const columns: Column<Photo>[] = [
  { key: 'id', title: 'ID', width: 60 },
  { key: 'title', title: 'Title', flex: 2 },
  {
    key: 'albumId',
    title: 'Album',
    width: 70,
    align: 'right',
  },
]

export default function DashboardRoute() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    apiClient
      .get<Photo[]>('/photos')
      .then((data) => {
        if (!cancelled) setPhotos(data)
      })
      .catch((e) => {
        if (!cancelled) setError(getApiErrorMessage(e))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <Screen>
        <View style={styles.centered}>
          <ActivityIndicator />
          <ThemedText tone="secondary" style={styles.text}>
            Loading photos…
          </ThemedText>
        </View>
      </Screen>
    )
  }

  if (error) {
    return (
      <Screen>
        <View style={styles.centered}>
          <ThemedText tone="danger">{error}</ThemedText>
        </View>
      </Screen>
    )
  }

  return (
    <Screen scrollable>
      <ThemedText variant="h1" style={styles.title}>
        Photos
      </ThemedText>
      <Table
        data={photos}
        columns={columns}
        keyExtractor={(row) => String(row.id)}
        onRowPress={(row) => console.log('pressed', row.id)}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  text: { marginTop: 8 },
  title: { marginBottom: 12 },
})