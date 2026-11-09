import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useBookings } from '../../context/BookingContext';
import { useBusinesses } from '../../context/BusinessContext';
import { formatPKR } from '../../utils/formatPKR';
import { Shell } from '../Owner/OwnerShared';
import { useAllUsers } from './useAllUsers';

export function AdminDashboard() {
  const { colors } = useTheme();
  const { bookings } = useBookings();
  const { businesses } = useBusinesses();
  const users = useAllUsers();

  const customers = users.filter(u => u.role === 'customer').length;
  const suspended = businesses.filter(b => b.suspended).length;
  const revenue = bookings.reduce((sum, b) => sum + b.amount, 0);

  const stat = (label: string, value: string) => (
    <View
      style={{
        width: '48%',
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
      }}
    >
      <Text style={{ color: colors.subtext, fontSize: 12 }}>{label}</Text>
      <Text style={{ color: colors.text, fontWeight: '800', fontSize: 20, marginTop: 4 }}>{value}</Text>
    </View>
  );

  return (
    <Shell title="Admin Dashboard">
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {stat('Customers', String(customers))}
        {stat('Businesses', String(businesses.length))}
        {stat('Suspended', String(suspended))}
        {stat('Bookings', String(bookings.length))}
      </View>
      {stat('Total revenue', formatPKR(revenue))}

      <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text, marginTop: 14, marginBottom: 10 }}>
        Recent bookings
      </Text>
      {bookings.length === 0 && <Text style={{ color: colors.subtext }}>No bookings yet.</Text>}
      {bookings.slice(0, 5).map(b => (
        <View
          key={b.id}
          style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, marginBottom: 10 }}
        >
          <Text style={{ color: colors.text, fontWeight: '700' }}>{b.washName}</Text>
          <Text style={{ color: colors.subtext, marginTop: 2 }}>
            {b.customerName} · {b.date} at {b.time}
          </Text>
          <Text style={{ color: colors.primary, fontWeight: '700', marginTop: 4 }}>{formatPKR(b.amount)}</Text>
        </View>
      ))}
    </Shell>
  );
}