import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

const ANDROID_CHANNEL_ID = 'default'

// Show notifications while the app is in the foreground.
// Without this, notifications arriving while the app is open are dropped.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export async function requestNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync()
  if (current.granted) return true
  const next = await Notifications.requestPermissionsAsync()
  return next.granted
}

export async function setupAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return
  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: 'Default',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
  })
}

type ScheduleOptions = {
  title: string
  body: string
  seconds?: number
  url?: string
}

export async function scheduleLocalNotification({
  title,
  body,
  seconds = 5,
  url,
}: ScheduleOptions): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      data: url ? { url } : {},
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      channelId: ANDROID_CHANNEL_ID,
    },
  })
}

export async function cancelNotification(id: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(id)
}

export type NotificationTapPayload = {
  url?: string
}

export function addNotificationTapListener(
  handler: (payload: NotificationTapPayload) => void,
): () => void {
  const sub = Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data as NotificationTapPayload
    handler(data)
  })
  return () => sub.remove()
}