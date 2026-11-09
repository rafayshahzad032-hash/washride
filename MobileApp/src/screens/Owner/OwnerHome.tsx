import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { ProfileScreen } from '../Customer/CustomerScreens';

export default function OwnerHome() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: colors.text }}>
          Business Dashboard
        </Text>
        <Text style={{ color: colors.subtext, marginTop: 6 }}>Coming soon</Text>
      </View>
      <ProfileScreen />
    </SafeAreaView>
  );
}