import { Drawer } from 'expo-router/drawer'
import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { useTheme } from '@squeez/shared-ui'
import { drawerItems } from './drawerItems'

export function ThemedDrawer() {
  const { theme, themeName } = useTheme()

  return (
    <>
      <Drawer
        screenOptions={{
          drawerActiveTintColor: theme.brand.primary,
          drawerInactiveTintColor: theme.text.secondary,
          drawerStyle: {
            backgroundColor: theme.bg.surface,
          },
          headerStyle: {
            backgroundColor: theme.bg.surface,
            borderBottomColor: theme.border.default,
          },
          headerTintColor: theme.text.primary,
          headerTitleStyle: {
            color: theme.text.primary,
          },
          sceneStyle: {
            backgroundColor: theme.bg.primary,
          },
        }}
      >
        {drawerItems.map((item) => (
          <Drawer.Screen
            key={item.name}
            name={item.name}
            options={{
              title: item.label,
              drawerLabel: item.label,
              drawerLabelStyle: { color: theme.text.primary },
              drawerIcon: ({ color, size }) => (
                <Ionicons name={item.icon} size={size} color={color} />
              ),
            }}
          />
        ))}
      </Drawer>
      <StatusBar style={themeName === 'dark' ? 'light' : 'dark'} />
    </>
  )
}