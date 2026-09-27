import { Tabs } from 'expo-router/tabs'
import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { useTheme } from '@squeez/shared-ui'
import { drawerItems } from './drawerItems'

export function ThemedTabs() {
  const { theme, themeName } = useTheme()

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.brand.primary,
          tabBarInactiveTintColor: theme.text.secondary,
          tabBarStyle: {
            backgroundColor: theme.bg.surface,
            borderTopColor: theme.border.default,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
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
          <Tabs.Screen
            key={item.name}
            name={item.name}
            options={{
              title: item.label,
              tabBarLabel: item.label,
              tabBarIcon: ({ color, size }) => (
                <Ionicons name={item.icon} size={size} color={color} />
              ),
            }}
          />
        ))}
      </Tabs>
      <StatusBar style={themeName === 'dark' ? 'light' : 'dark'} />
    </>
  )
}