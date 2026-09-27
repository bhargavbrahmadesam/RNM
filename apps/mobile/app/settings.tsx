import { View, Pressable, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Screen, ThemedText, useTheme } from '@squeez/shared-ui'
import { useUiStore, type NavigationMode } from '@squeez/shared-store'

const themeOptions: { name: 'light' | 'dark' | 'blue' | 'orange'; label: string }[] = [
  { name: 'light', label: 'Light' },
  { name: 'dark', label: 'Dark' },
  { name: 'blue', label: 'Blue' },
  { name: 'orange', label: 'Orange' },
]

const navigationOptions: { name: NavigationMode; label: string; icon: 'menu-outline' | 'grid-outline' }[] = [
  { name: 'drawer', label: 'Drawer (left sidebar)', icon: 'menu-outline' },
  { name: 'tabs', label: 'Tabs (bottom bar)', icon: 'grid-outline' },
]

export default function SettingsScreen() {
  const { theme } = useTheme()
  const themeName = useUiStore((s) => s.theme)
  const setTheme = useUiStore((s) => s.setTheme)
  const navigationMode = useUiStore((s) => s.navigationMode)
  const setNavigationMode = useUiStore((s) => s.setNavigationMode)

  return (
    <Screen scrollable>
      <ThemedText variant="h1">Settings</ThemedText>

      <ThemedText variant="h3" style={styles.sectionTitle}>
        Theme
      </ThemedText>
      <View style={styles.list}>
        {themeOptions.map((option) => {
          const isSelected = option.name === themeName
          return (
            <Pressable
              key={option.name}
              onPress={() => setTheme(option.name)}
              style={({ pressed }) => [
                styles.row,
                {
                  backgroundColor: theme.bg.surface,
                  borderColor: isSelected ? theme.brand.primary : theme.border.default,
                },
                pressed && styles.pressed,
              ]}
            >
              <ThemedText style={styles.rowLabel}>{option.label}</ThemedText>
              {isSelected && (
                <Ionicons name="checkmark" size={20} color={theme.brand.primary} />
              )}
            </Pressable>
          )
        })}
      </View>

      <ThemedText variant="h3" style={[styles.sectionTitle, styles.sectionSpacing]}>
        Navigation
      </ThemedText>
      <View style={styles.list}>
        {navigationOptions.map((option) => {
          const isSelected = option.name === navigationMode
          return (
            <Pressable
              key={option.name}
              onPress={() => setNavigationMode(option.name)}
              style={({ pressed }) => [
                styles.row,
                {
                  backgroundColor: theme.bg.surface,
                  borderColor: isSelected ? theme.brand.primary : theme.border.default,
                },
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.rowLeft}>
                <Ionicons
                  name={option.icon}
                  size={20}
                  color={isSelected ? theme.brand.primary : theme.text.secondary}
                />
                <ThemedText style={styles.rowLabel}>{option.label}</ThemedText>
              </View>
              {isSelected && (
                <Ionicons name="checkmark" size={20} color={theme.brand.primary} />
              )}
            </Pressable>
          )
        })}
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  sectionTitle: { marginTop: 20, marginBottom: 8 },
  sectionSpacing: { marginTop: 32 },
  list: { gap: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 2,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowLabel: { fontSize: 16, fontWeight: '500' },
  pressed: { opacity: 0.7 },
})