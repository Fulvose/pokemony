import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                tabBarActiveTintColor: Colors.yellow,
                tabBarInactiveTintColor: 'white',
                tabBarStyle: { backgroundColor: Colors.red },
                headerStyle: { backgroundColor: Colors.red },
                tabBarLabelStyle: { fontFamily: 'PixelFont' },
                headerTitleStyle: { fontFamily: 'PixelFont', color: Colors.yellow },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    headerTitle: 'Pokédex',
                    title: 'Pokémons',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="list" size={28} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="favorites"
                options={{
                    title: 'Favorites',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="heart" size={28} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="map"
                options={{
                    title: 'Map',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="map" size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}