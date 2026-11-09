import React from 'react';
import { Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useBusinesses } from '../../context/BusinessContext';

export function useMyBusiness() {
  const { user } = useAuth();
  const { businesses } = useBusinesses();
  return businesses.find(b => b.ownerEmail === user?.email.toLowerCase());
}

export function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 16 }}>{title}</Text>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function NoBusiness() {
  const { colors } = useTheme();
  return (
    <Text style={{ color: colors.subtext }}>
      No business is registered for this account. Sign out and choose Register Your Car Wash.
    </Text>
  );
}