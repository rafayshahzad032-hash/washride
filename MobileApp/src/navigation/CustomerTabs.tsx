import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../theme/ThemeContext';
import AppIcon from '../components/AppIcon';
import HomeScreen from '../screens/Customer/HomeScreen';
import ExploreScreen from '../screens/Customer/ExploreScreen';
import { ProfileScreen } from '../screens/Customer/CustomerScreens';
import { BookingsScreen, ReceiptsScreen } from '../screens/Customer/BookingsScreens';

const Tab = createBottomTabNavigator();

export default function CustomerTabs() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ color, size }) => <AppIcon name="home" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{ tabBarIcon: ({ color, size }) => <AppIcon name="search" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{ tabBarIcon: ({ color, size }) => <AppIcon name="calendar" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Receipts"
        component={ReceiptsScreen}
        options={{ tabBarIcon: ({ color, size }) => <AppIcon name="receipt" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ color, size }) => <AppIcon name="user" color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}