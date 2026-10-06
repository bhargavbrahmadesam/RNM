import { FlatList, Pressable, StyleSheet, View } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Screen, ThemedText, Button, useTheme } from '@squeez/shared-ui'
import { useNotificationStore, type AppNotification } from './notificationStore'

export function NotificationsScreen() {
  const { theme } = useTheme()
  const router = useRouter()
  const items = useNotificationStore((s) => s.items)
  const markRead = useNotificationStore((s) => s.markRead)
  const markAllRead = useNotificationStore((s) => s.markAllRead)
  const clear = useNotificationStore((s) => s.clear)

  const handlePress = (n: AppNotification) => {
    markRead(n.id)
    if (n.url) router.push(n.url as never)
  }

  const renderItem = ({ item }: { item: AppNotification }) => (
    <Pressable
      onPress={() => handlePress(item)}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: item.read ? theme.bg.surface : theme.bg.elevated,
          borderColor: theme.border.default,
          borderLeftColor: item.read ? theme.border.default : theme.brand.primary,
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.rowContent}>
        <ThemedText variant="label">{item.title}</ThemedText>
        <ThemedText variant="body" tone="secondary" numberOfLines={2}>
          {item.body}
        </ThemedText>
      </View>
      {!item.read && (
        <View style={[styles.dot, { backgroundColor: theme.brand.primary }]} />
      )}
    </Pressable>
  )

  return (
    <Screen>
      {items.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons
            name="notifications-off-outline"
            size={48}
            color={theme.text.secondary}
          />
          <ThemedText variant="body" tone="secondary" style={styles.emptyText}>
            No notifications yet
          </ThemedText>
        </View>
      ) : (
        <>
          <View style={styles.actions}>
            <Button label="Mark all read" variant="ghost" size="sm" onPress={markAllRead} />
            <Button label="Clear" variant="ghost" size="sm" onPress={clear} />
          </View>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        </>
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginBottom: 12,
  },
  list: {
    gap: 8,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderLeftWidth: 4,
  },
  rowContent: {
    flex: 1,
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: {
    textAlign: 'center',
  },
})