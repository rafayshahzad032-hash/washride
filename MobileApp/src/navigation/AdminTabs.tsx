import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../theme/ThemeContext';
import AppIcon from '../components/AppIcon';
import { AdminDashboard } from '../screens/Admin/AdminDashboard';
import { AdminBusinesses } from '../screens/Admin/AdminBusinesses';
import { AdminBookings } from '../screens/Admin/AdminBookings';
import { AdminUsers } from '../screens/Admin/AdminUsers';
import { ProfileScreen } from '../screens/Customer/CustomerScreens';

const Tab = createBottomTabNavigator();

export default function AdminTabs() {
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
        name="AdminHome"
        component={AdminDashboard}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <AppIcon name="dashboard" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="AdminBiz"
        component={AdminBusinesses}
        options={{
          title: 'Businesses',
          tabBarIcon: ({ color, size }) => <AppIcon name="business" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="AdminBook"
        component={AdminBookings}
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, size }) => <AppIcon name="calendar" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="AdminUsers"
        component={AdminUsers}
        options={{
          title: 'Users',
          tabBarIcon: ({ color, size }) => <AppIcon name="users" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="AdminProfile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <AppIcon name="user" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}