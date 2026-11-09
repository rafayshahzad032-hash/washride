import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function OwnerPending({ rejected }: { rejected: boolean }) {
  const { colors } = useTheme();
  const { signOut } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, padding: 28, justifyContent: 'center' }}>
        <Text style={{ fontSize: 26, fontWeight: '800', color: colors.text }}>
          {rejected ? 'Registration rejected' : 'Waiting for approval'}
        </Text>
        <Text style={{ color: colors.subtext, marginTop: 10, lineHeight: 22 }}>
          {rejected
            ? 'The admin did not approve your car wash registration. Please contact the WashRide admin for details.'
            : 'Your car wash has been submitted. The admin must approve it before customers can see it and before you can manage it. This screen updates automatically once you are approved.'}
        </Text>
        <TouchableOpacity
          onPress={signOut}
          style={{
            backgroundColor: colors.primary,
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 28,
          }}
        >
          <Text style={{ color: colors.primaryText, fontWeight: '600', fontSize: 16 }}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}