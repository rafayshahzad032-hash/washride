import React, { useMemo } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import { BookingProvider } from '../context/BookingContext';
import { BusinessProvider } from '../context/BusinessContext';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterBusinessScreen from '../screens/Auth/RegisterBusinessScreen';
import CustomerTabs from './CustomerTabs';
import OwnerTabs from './OwnerTabs';
import AdminTabs from './AdminTabs';
import WashDetailScreen from '../screens/Customer/WashDetailScreen';
import BookingScreen from '../screens/Customer/BookingScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useAuth();
  const { colors, isDark } = useTheme();

  const navTheme = useMemo(
    () => ({
      ...DefaultTheme,
      dark: isDark,
      colors: {
        ...DefaultTheme.colors,
        background: colors.background,
        card: colors.card,
        text: colors.text,
        border: colors.border,
        primary: colors.primary,
      },
    }),
    [isDark, colors],
  );

  const stackOptions = useMemo(
    () => ({
      headerShown: false,
      animation: 'slide_from_right' as const,
      contentStyle: { backgroundColor: colors.background },
    }),
    [colors],
  );

  return (
    <BusinessProvider>
      <BookingProvider>
        <NavigationContainer theme={navTheme}>
          {!user ? (
            <Stack.Navigator screenOptions={{ ...stackOptions, animation: 'fade' }}>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="RegisterBusiness" component={RegisterBusinessScreen} />
            </Stack.Navigator>
          ) : user.role === 'admin' ? (
            <AdminTabs />
          ) : user.role === 'owner' ? (
            <OwnerTabs />
          ) : (
            <Stack.Navigator screenOptions={stackOptions}>
              <Stack.Screen name="Tabs" component={CustomerTabs} />
              <Stack.Screen name="WashDetail" component={WashDetailScreen} />
              <Stack.Screen name="Booking" component={BookingScreen} />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </BookingProvider>
    </BusinessProvider>
  );
}