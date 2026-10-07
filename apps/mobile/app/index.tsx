import { Pressable, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Screen, ThemedText, useTheme } from '@squeez/shared-ui'
import { routes } from '@squeez/shared-config'

const links: {
  href: string
  label: string
  description: string
  icon: keyof typeof Ionicons.glyphMap
}[] = [
  {
    href: routes.dashboard,
    label: 'Dashboard',
    description: 'Browse photos',
    icon: 'grid-outline',
  },
  {
    href: routes.settings,
    label: 'Settings',
    description: 'Theme and navigation',
    icon: 'settings-outline',
  },
]

export default function Home() {
  const { theme } = useTheme()

  return (
    <Screen scrollable>
      <View style={styles.hero}>
        <View
          style={[
            styles.logo,
            { backgroundColor: theme.brand.primary },
          ]}
        >
          <Ionicons
            name="golf-outline"
            size={32}
            color={theme.brand.onPrimary}
          />
        </View>
        <ThemedText variant="h1" style={styles.title}>
          Squeez
        </ThemedText>
        <ThemedText variant="body" tone="secondary" style={styles.subtitle}>
          Welcome back. Pick a place to start.
        </ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText variant="label" tone="secondary" style={styles.sectionLabel}>
          QUICK LINKS
        </ThemedText>

        {links.map((link) => (
          <Pressable
            key={link.href}
            onPress={() => router.push(link.href as never)}
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: theme.bg.surface,
                borderColor: theme.border.default,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <View
              style={[
                styles.cardIcon,
                { backgroundColor: theme.bg.elevated },
              ]}
            >
              <Ionicons
                name={link.icon}
                size={22}
                color={theme.brand.primary}
              />
            </View>

            <View style={styles.cardContent}>
              <ThemedText variant="label">{link.label}</ThemedText>
              <ThemedText variant="caption" tone="secondary">
                {link.description}
              </ThemedText>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.text.secondary}
            />
          </Pressable>
        ))}
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
    gap: 8,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: { textAlign: 'center' },
  subtitle: { textAlign: 'center', paddingHorizontal: 24 },
  section: { gap: 10 },
  sectionLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 14,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: { flex: 1, gap: 2 },
})