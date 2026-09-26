import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, type ThemeName } from '@squeez/shared-ui'

const themeOptions: { name: ThemeName; label: string }[] = [
  { name: 'light', label: 'Light' },
  { name: 'dark', label: 'Dark' },
  { name: 'blue', label: 'Blue' },
  { name: 'orange', label: 'Orange' },
]

export default function SettingsScreen() {
  const { theme, themeName, setTheme } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      <Text style={[styles.title, { color: theme.text.primary }]}>Settings</Text>
      <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
        Choose a theme
      </Text>

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
              <Text style={[styles.rowLabel, { color: theme.text.primary }]}>
                {option.label}
              </Text>
              {isSelected && (
                <Ionicons name="checkmark" size={20} color={theme.brand.primary} />
              )}
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 24 },
  list: { gap: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 2,
  },
  pressed: { opacity: 0.7 },
  rowLabel: { fontSize: 16, fontWeight: '500' },
})