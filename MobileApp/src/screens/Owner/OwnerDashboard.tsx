import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useBookings } from '../../context/BookingContext';
import { formatPKR } from '../../utils/formatPKR';
import { Shell, NoBusiness, useMyBusiness } from './OwnerShared';

export function OwnerDashboard() {
  const { colors } = useTheme();
  const business = useMyBusiness();
  const { bookings } = useBookings();

  if (!business) return <Shell title="Dashboard"><NoBusiness /></Shell>;

  const mine = bookings.filter(b => b.washId === business.id);
  const revenue = mine.reduce((sum, b) => sum + b.amount, 0);

  const stat = (label: string, value: string) => (
    <View style={{ flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14 }}>
      <Text style={{ color: colors.subtext, fontSize: 12 }}>{label}</Text>
      <Text style={{ color: colors.text, fontWeight: '800', fontSize: 18, marginTop: 4 }}>{value}</Text>
    </View>
  );

  return (
    <Shell title="Dashboard">
      <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>{business.name}</Text>
      <Text style={{ color: colors.subtext, marginTop: 4 }}>📍 {business.area}, {business.city}</Text>
      <Text style={{ color: colors.subtext, marginTop: 2 }}>🕐 {business.opensAt} – {business.closesAt}</Text>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
        {stat('Bookings', String(mine.length))}
        {stat('Revenue', formatPKR(revenue))}
        {stat('Services', String(business.services.length))}
      </View>

      <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text, marginTop: 24, marginBottom: 10 }}>
        Bookings
      </Text>
      {mine.length === 0 ? (
        <Text style={{ color: colors.subtext }}>No bookings yet.</Text>
      ) : (
        mine.map(b => (
          <View key={b.id} style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, marginBottom: 10 }}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{b.customerName}</Text>
            <Text style={{ color: colors.subtext, marginTop: 2 }}>{b.serviceNames.join(', ')}</Text>
            <Text style={{ color: colors.text, marginTop: 6 }}>📅 {b.date} at {b.time}</Text>
            <Text style={{ color: colors.primary, fontWeight: '700', marginTop: 4 }}>
              {formatPKR(b.amount)} · {b.paymentStatus}
            </Text>
          </View>
        ))
      )}
    </Shell>
  );
}