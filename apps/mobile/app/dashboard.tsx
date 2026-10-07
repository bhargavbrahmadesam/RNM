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
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    apiClient
      .get<Photo[]>('/photos?_limit=4')
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

      {photos.map((photo) => (
        <View key={photo.id} style={styles.card}>
          <Image
            source={{ uri: photo.url }}
            style={styles.image}
            resizeMode="cover"
          />
          <ThemedText variant="label" style={styles.photoTitle}>
            #{photo.id} · {photo.title}
          </ThemedText>
          <ThemedText variant="caption" tone="secondary">
            Album {photo.albumId}
          </ThemedText>
        </View>
      ))}
    </Screen>
  )
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { marginBottom: 16 },
  card: { marginBottom: 24 },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#eee',
  },
  photoTitle: { marginBottom: 2 },
})