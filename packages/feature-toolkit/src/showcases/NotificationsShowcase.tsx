import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, ThemedText, useTheme } from '@squeez/shared-ui'
import {
  requestNotificationPermission,
  setupAndroidChannel,
  scheduleLocalNotification,
  cancelNotification,
} from '@squeez/shared-lib'
import { useNotificationStore } from '@squeez/feature-notifications'

export function NotificationsShowcase() {
  const { theme } = useTheme()
  const addNotification = useNotificationStore((s) => s.add)
  const items = useNotificationStore((s) => s.items)
  const clear = useNotificationStore((s) => s.clear)
  const [lastId, setLastId] = useState<string | null>(null)
  const [status, setStatus] = useState('')

  const unread = items.filter((i) => !i.read).length

  const ensureReady = async () => {
    const granted = await requestNotificationPermission()
    if (!granted) {
      setStatus('Permission denied')
      return false
    }
    await setupAndroidChannel()
    setStatus('')
    return true
  }

  const send = async (opts: {
    title: string
    body: string
    url?: string
    seconds?: number
  }) => {
    if (!(await ensureReady())) return
    const seconds = opts.seconds ?? 5
    const id = await scheduleLocalNotification({
      title: opts.title,
      body: opts.body,
      url: opts.url,
      seconds,
    })
    setLastId(id)
    addNotification({
      id: String(Date.now()),
      title: opts.title,
      body: opts.body,
      url: opts.url,
    })
    setStatus(`Scheduled in ${seconds}s · id ${id.slice(0, 8)}…`)
  }

  const cancelLast = async () => {
    if (!lastId) {
      setStatus('Nothing to cancel')
      return
    }
    await cancelNotification(lastId)
    setLastId(null)
    setStatus('Cancelled last scheduled')
  }

  return (
    <View style={styles.root}>
      <ThemedText variant="label" tone="secondary">
        Status
      </ThemedText>
      <ThemedText variant="caption">
        Unread in app: {unread} · Total: {items.length}
      </ThemedText>
      {status ? (
        <ThemedText variant="caption" style={{ color: theme.brand.primary }}>
          {status}
        </ThemedText>
      ) : null}

      <ThemedText variant="label" tone="secondary">
        Send
      </ThemedText>
      <View style={styles.row}>
        <Button
          label="In 5s"
          size="sm"
          onPress={() => send({ title: 'Test', body: 'Fires in 5 seconds' })}
        />
        <Button
          label="In 1s"
          size="sm"
          variant="secondary"
          onPress={() =>
            send({ title: 'Quick test', body: 'Fires almost immediately', seconds: 1 })
          }
        />
      </View>

      <ThemedText variant="label" tone="secondary">
        Send with tap → navigate
      </ThemedText>
      <View style={styles.row}>
        <Button
          label="→ Dashboard"
          size="sm"
          variant="secondary"
          onPress={() =>
            send({
              title: 'Go to Dashboard',
              body: 'Tap to open Dashboard',
              url: '/dashboard',
            })
          }
        />
        <Button
          label="→ Settings"
          size="sm"
          variant="secondary"
          onPress={() =>
            send({
              title: 'Go to Settings',
              body: 'Tap to open Settings',
              url: '/settings',
            })
          }
        />
        <Button
          label="→ Notifications"
          size="sm"
          variant="secondary"
          onPress={() =>
            send({
              title: 'Go to Notifications',
              body: 'Tap to open Notifications',
              url: '/notifications',
            })
          }
        />
      </View>

      <ThemedText variant="label" tone="secondary">
        Manage
      </ThemedText>
      <View style={styles.row}>
        <Button label="Cancel last" size="sm" variant="ghost" onPress={cancelLast} />
        <Button
          label="Clear list"
          size="sm"
          variant="danger"
          onPress={() => {
            clear()
            setStatus('Cleared in-app list')
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { gap: 12 },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
})