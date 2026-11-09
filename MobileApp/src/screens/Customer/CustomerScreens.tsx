import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const btn = {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  } as const;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', color: colors.text }}>{user?.name}</Text>
      <Text style={{ color: colors.subtext, marginTop: 4 }}>{user?.email}</Text>

      <TouchableOpacity style={btn} onPress={toggleTheme}>
        <Text style={{ color: colors.primaryText, fontWeight: '600' }}>
          {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={btn} onPress={signOut}>
        <Text style={{ color: colors.primaryText, fontWeight: '600' }}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}