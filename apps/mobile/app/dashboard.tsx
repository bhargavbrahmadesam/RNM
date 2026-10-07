import { useEffect, useState } from 'react'
import { ActivityIndicator, Image, View, StyleSheet } from 'react-native'
import { Screen, ThemedText } from '@squeez/shared-ui'
import { apiClient, getApiErrorMessage } from '@squeez/shared-lib'

type Photo = {
  albumId: number
  id: number
  title: string
  url: string
  thumbnailUrl: string
}

export default function DashboardRoute() {
  const [photo, setPhoto] = useState<Photo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    apiClient
      .get<Photo>('/photos/1')
      .then((data) => {
        if (!cancelled) setPhoto(data)
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

  if (!photo) return null

  return (
    <Screen scrollable>
      <ThemedText variant="h1" style={styles.title}>
        Photo #{photo.id}
      </ThemedText>

      <Image source={{ uri: photo.url }} style={styles.image} resizeMode="cover" />

      <ThemedText variant="body" style={styles.caption}>
        {photo.title}
      </ThemedText>
      <ThemedText variant="caption" tone="secondary">
        Album {photo.albumId}
      </ThemedText>
    </Screen>
  )
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { marginBottom: 16 },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#eee',
  },
  caption: { marginBottom: 4 },
})