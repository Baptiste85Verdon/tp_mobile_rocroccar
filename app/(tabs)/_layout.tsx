import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";

export default function RootLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#ffd33d',
                headerStyle: {
                    backgroundColor: '#25292e'
                },
                headerShadowVisible: false,
                headerTintColor: '#fff',
                tabBarStyle: {
                    backgroundColor: '#25292e',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{ 
                    title: "Home",
                    tabBarIcon: ({ color, focused}) => (
                        <Ionicons name={focused? 'home-sharp' : 'home-outline'} color={color} size={24} />
                    ),
                }} />
            <Tabs.Screen
                name="trips"
                options={{ 
                    title: "Trajets",
                    tabBarIcon: ({ color, focused}) => (
                        <Ionicons name={focused? 'car-sharp' : 'car-outline'} color={color} size={24} />
                    ),
                }} />
            <Tabs.Screen
                name="tripsCreation"
                options={{
                    title: "Créer un trajet",
                    tabBarIcon: ({ color, focused}) => (
                        <Ionicons name={focused? 'add-circle-sharp' : 'add-circle-outline'} color={color} size={24} />
                    ),
                }} />
            <Tabs.Screen
                name="myTrips"
                options={{ 
                    title: "Mes trajets",
                    tabBarIcon: ({ color, focused}) => (
                        <Ionicons name={focused? 'car-sharp' : 'car-outline'} color={color} size={24} />
                    ),
                 }} />
            <Tabs.Screen
                name="profile"
                options={{ 
                    title: "Profil",
                    tabBarIcon: ({ color, focused}) => (
                        <Ionicons name={focused? 'person-sharp' : 'person-outline'} color={color} size={24} />
                    ),
                }} />
            <Tabs.Screen
                name="testMap"
                options={{ 
                    title: "Test Map",
                    tabBarIcon: ({ color, focused}) => (
                        <Ionicons name={focused? 'map-sharp' : 'map-outline'} color={color} size={24} />
                    ),
                }} />
        </Tabs>
    );
}
