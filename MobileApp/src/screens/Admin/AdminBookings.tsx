import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useTheme } from '../../theme/ThemeContext';
import { useBookings, Booking } from '../../context/BookingContext';
import { formatPKR } from '../../utils/formatPKR';
import { Shell } from '../Owner/OwnerShared';

export function AdminBookings() {
  const { colors } = useTheme();
  const { bookings } = useBookings();

  const confirmCancel = (b: Booking) =>
    Alert.alert('Cancel booking', `Cancel booking ${b.id}?`, [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Cancel booking',
        style: 'destructive',
        onPress: () => {
          deleteDoc(doc(db, 'bookings', b.id)).catch(e => console.warn('cancel failed', e));
        },
      },
    ]);

  return (
    <Shell title="All Bookings">
      {bookings.length === 0 && <Text style={{ color: colors.subtext }}>No bookings yet.</Text>}
      {bookings.map(b => (
        <View
          key={b.id}
          style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, marginBottom: 12 }}
        >
          <Text style={{ color: colors.text, fontWeight: '700', fontSize: 16 }}>{b.washName}</Text>
          <Text style={{ color: colors.subtext, marginTop: 4 }}>{b.customerName} ({b.customerEmail})</Text>
          <Text style={{ color: colors.subtext, marginTop: 2 }}>{b.serviceNames.join(', ')}</Text>
          <Text style={{ color: colors.text, marginTop: 6 }}>📅 {b.date} at {b.time}</Text>
          <Text style={{ color: colors.subtext, marginTop: 2 }}>ID: {b.id} · {b.paymentMethod}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <Text style={{ color: colors.primary, fontWeight: '800' }}>{formatPKR(b.amount)}</Text>
            <TouchableOpacity onPress={() => confirmCancel(b)}>
              <Text style={{ color: '#EF4444', fontWeight: '600' }}>Cancel booking</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </Shell>
  );
}