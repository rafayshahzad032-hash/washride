import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../theme/ThemeContext';
import AppIcon from '../components/AppIcon';
import { statusOf } from '../context/BusinessContext';
import { OwnerDashboard, OwnerServices, OwnerDiscounts } from '../screens/Owner/OwnerScreens';
import { useMyBusiness } from '../screens/Owner/OwnerShared';
import OwnerPending from '../screens/Owner/OwnerPending';
import { ProfileScreen } from '../screens/Customer/CustomerScreens';

const Tab = createBottomTabNavigator();

export default function OwnerTabs() {
  const { colors } = useTheme();
  const business = useMyBusiness();

  if (business && statusOf(business) !== 'approved') {
    return <OwnerPending rejected={statusOf(business) === 'rejected'} />;
  }

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
        name="Dashboard"
        component={OwnerDashboard}
        options={{ tabBarIcon: ({ color, size }) => <AppIcon name="dashboard" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Services"
        component={OwnerServices}
        options={{ tabBarIcon: ({ color, size }) => <AppIcon name="services" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Discounts"
        component={OwnerDiscounts}
        options={{ tabBarIcon: ({ color, size }) => <AppIcon name="tag" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="OwnerProfile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <AppIcon name="user" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}