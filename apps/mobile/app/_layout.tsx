import 'react-native-gesture-handler'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Drawer } from 'expo-router/drawer'
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons'
import { drawerItems } from '@/constants/drawerItems'
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerActiveTintColor: '#007AFF',
          drawerInactiveTintColor: '#555',
          headerShown: true,
        }}
      >
        {drawerItems.map((item) => (
          <Drawer.Screen
            key={item.name}
            name={item.name}
            options={{
              title: item.label,
              drawerLabel: item.label,
              drawerIcon: ({ color, size }) => (
                <Ionicons name={item.icon} size={size} color={color} />
              ),
            }}
          />
        ))}
      </Drawer>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  )
}