import { StyleSheet, View } from 'react-native'
import { Button, useTheme } from '@squeez/shared-ui'
import type { ThemeName } from '@squeez/shared-store'

const THEME_NAMES: ThemeName[] = ['light', 'dark', 'blue', 'orange']

export function ThemeSwitcher() {
  const { themeName, setTheme } = useTheme()

  return (
    <View style={styles.row}>
      {THEME_NAMES.map((name) => (
        <Button
          key={name}
          label={name}
          size="sm"
          variant={name === themeName ? 'primary' : 'outline'}
          onPress={() => setTheme(name)}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
})