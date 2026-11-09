import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useBookings, Booking } from '../../context/BookingContext';
import { formatPKR } from '../../utils/formatPKR';

function useMyBookings() {
  const { user } = useAuth();
  const { bookings } = useBookings();
  return bookings.filter(b => b.customerEmail === user?.email);
}

function Row({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
      <Text style={{ color: colors.subtext, flex: 1 }}>{label}</Text>
      <Text style={{ color: colors.text, fontWeight: '600', flex: 2, textAlign: 'right' }}>
        {value}
      </Text>
    </View>
  );
}

const receiptText = (b: Booking) =>
  [
    'WashRide Receipt',
    `Transaction ID: ${b.transactionId}`,
    `Booking ID: ${b.id}`,
    `Car wash: ${b.washName}`,
    `Address: ${b.washAddress}`,
    `Customer: ${b.customerName} (${b.customerEmail})`,
    `Services: ${b.serviceNames.join(', ')}`,
    `Date and time: ${b.date}, ${b.time}`,
    `Payment method: ${b.paymentMethod}`,
    `Payment status: ${b.paymentStatus}`,
    b.discountAmount ? `Discount: ${formatPKR(b.discountAmount)}` : '',
    `Amount: ${formatPKR(b.amount)}`,
  ]
    .filter(Boolean)
    .join('\n');

export function BookingsScreen() {
  const { colors } = useTheme();
  const mine = useMyBookings();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={mine}
        keyExtractor={b => b.id}
        contentContainerStyle={{ padding: 20 }}
        ListHeaderComponent={
          <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 16 }}>
            My Bookings
          </Text>
        }
        ListEmptyComponent={
          <Text style={{ color: colors.subtext, textAlign: 'center', marginTop: 30 }}>
            No bookings yet. Book a car wash from the Home tab.
          </Text>
        }
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 14,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <Text style={{ color: colors.text, fontWeight: '700', fontSize: 16 }}>
              {item.washName}
            </Text>
            <Text style={{ color: colors.subtext, marginTop: 4 }}>
              {item.serviceNames.join(', ')}
            </Text>
            <Text style={{ color: colors.text, marginTop: 8 }}>
              📅 {item.date} at {item.time}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
              <Text style={{ color: colors.subtext }}>ID: {item.id}</Text>
              <Text style={{ color: colors.primary, fontWeight: '700' }}>
                {formatPKR(item.amount)}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

export function ReceiptsScreen() {
  const { colors } = useTheme();
  const mine = useMyBookings();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={mine}
        keyExtractor={b => b.id}
        contentContainerStyle={{ padding: 20 }}
        ListHeaderComponent={
          <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 16 }}>
            Receipts
          </Text>
        }
        ListEmptyComponent={
          <Text style={{ color: colors.subtext, textAlign: 'center', marginTop: 30 }}>
            Your receipts will appear here after you book.
          </Text>
        }
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 14,
              padding: 16,
              marginBottom: 14,
            }}
          >
            <Text style={{ color: colors.text, fontWeight: '800', fontSize: 16, marginBottom: 6 }}>
              Receipt
            </Text>
            <Row label="Transaction ID" value={item.transactionId} />
            <Row label="Booking ID" value={item.id} />
            <Row label="Car wash" value={item.washName} />
            <Row label="Address" value={item.washAddress} />
            <Row label="Customer" value={`${item.customerName} (${item.customerEmail})`} />
            <Row label="Services" value={item.serviceNames.join(', ')} />
            <Row label="Date and time" value={`${item.date}, ${item.time}`} />
            <Row label="Payment method" value={item.paymentMethod} />
            <Row label="Payment status" value={item.paymentStatus} />
            {!!item.discountAmount && (
              <Row label="Discount" value={`- ${formatPKR(item.discountAmount)}`} />
            )}
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: colors.border,
                marginTop: 8,
                paddingTop: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ color: colors.text, fontWeight: '700' }}>Amount</Text>
              <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 18 }}>
                {formatPKR(item.amount)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => Share.share({ message: receiptText(item) })}
              style={{
                marginTop: 12,
                padding: 12,
                borderRadius: 10,
                alignItems: 'center',
                borderWidth: 1.5,
                borderColor: colors.primary,
              }}
            >
              <Text style={{ color: colors.primary, fontWeight: '600' }}>Share Receipt</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}