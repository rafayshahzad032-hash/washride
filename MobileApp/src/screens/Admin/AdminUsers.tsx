import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Shell } from '../Owner/OwnerShared';
import { useAllUsers } from './useAllUsers';

export function AdminUsers() {
  const { colors } = useTheme();
  const users = useAllUsers();

  return (
    <Shell title="Users">
      <Text style={{ color: colors.subtext, marginBottom: 12 }}>{users.length} account(s)</Text>
      {users.map(u => (
        <View
          key={u.id}
          style={{
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            padding: 14,
            marginBottom: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{u.name}</Text>
            <Text style={{ color: colors.subtext, marginTop: 2 }}>{u.email}</Text>
          </View>
          <Text style={{ color: colors.primary, fontWeight: '700', textTransform: 'capitalize' }}>{u.role}</Text>
        </View>
      ))}
    </Shell>
  );
}