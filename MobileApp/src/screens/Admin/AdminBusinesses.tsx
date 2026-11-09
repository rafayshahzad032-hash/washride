import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useBusinesses, Business, statusOf } from '../../context/BusinessContext';
import { Shell } from '../Owner/OwnerShared';

export function AdminBusinesses() {
  const { colors } = useTheme();
  const { businesses, setSuspended, setStatus, deleteBusiness } = useBusinesses();

  const pending = businesses.filter(b => statusOf(b) === 'pending');
  const others = businesses.filter(b => statusOf(b) !== 'pending');

  const confirmDelete = (b: Business) =>
    Alert.alert('Delete business', 'Delete "' + b.name + '"? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteBusiness(b.id) },
    ]);

  const card = {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  } as const;

  const details = (b: Business) => (
    <>
      <Text style={{ color: colors.subtext, marginTop: 4 }}>{b.area + ', ' + b.city}</Text>
      <Text style={{ color: colors.subtext, marginTop: 2 }}>{b.address}</Text>
      <Text style={{ color: colors.subtext, marginTop: 2 }}>{b.ownerName + ' - ' + b.ownerEmail}</Text>
      <Text style={{ color: colors.subtext, marginTop: 2 }}>{b.phone}</Text>
      <Text style={{ color: colors.subtext, marginTop: 2 }}>
        {b.services.length + ' service(s)'}
      </Text>
    </>
  );

  const label = (b: Business) => {
    const s = statusOf(b);
    if (s === 'rejected') return { text: 'REJECTED', color: '#EF4444' };
    if (b.suspended) return { text: 'SUSPENDED', color: '#EF4444' };
    return { text: 'ACTIVE', color: colors.success };
  };

  return (
    <Shell title="Businesses">
      <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 10 }}>
        {'Pending approval (' + pending.length + ')'}
      </Text>
      {pending.length === 0 && (
        <Text style={{ color: colors.subtext, marginBottom: 16 }}>No registrations waiting.</Text>
      )}
      {pending.map(b => (
        <View key={b.id} style={{ ...card, borderColor: colors.primary }}>
          <Text style={{ color: colors.text, fontWeight: '700', fontSize: 16 }}>{b.name}</Text>
          {details(b)}
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
            <TouchableOpacity
              onPress={() => setStatus(b.id, 'approved')}
              style={{ flex: 1, backgroundColor: colors.primary, padding: 12, borderRadius: 10, alignItems: 'center' }}
            >
              <Text style={{ color: colors.primaryText, fontWeight: '700' }}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setStatus(b.id, 'rejected')}
              style={{ flex: 1, borderWidth: 1.5, borderColor: '#EF4444', padding: 12, borderRadius: 10, alignItems: 'center' }}
            >
              <Text style={{ color: '#EF4444', fontWeight: '700' }}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text, marginTop: 10, marginBottom: 10 }}>
        {'All businesses (' + others.length + ')'}
      </Text>
      {others.length === 0 && <Text style={{ color: colors.subtext }}>No businesses yet.</Text>}
      {others.map(b => {
        const l = label(b);
        const rejected = statusOf(b) === 'rejected';
        return (
          <View key={b.id} style={card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: colors.text, fontWeight: '700', fontSize: 16, flex: 1 }}>{b.name}</Text>
              <Text style={{ color: l.color, fontWeight: '700', fontSize: 12 }}>{l.text}</Text>
            </View>
            {details(b)}
            <View style={{ flexDirection: 'row', gap: 20, marginTop: 10 }}>
              {rejected ? (
                <TouchableOpacity onPress={() => setStatus(b.id, 'approved')}>
                  <Text style={{ color: colors.primary, fontWeight: '600' }}>Approve</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setSuspended(b.id, !b.suspended)}>
                  <Text style={{ color: colors.primary, fontWeight: '600' }}>
                    {b.suspended ? 'Activate' : 'Suspend'}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => confirmDelete(b)}>
                <Text style={{ color: '#EF4444', fontWeight: '600' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </Shell>
  );
}