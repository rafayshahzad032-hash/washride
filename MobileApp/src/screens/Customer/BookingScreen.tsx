import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useBookings } from '../../context/BookingContext';
import { formatPKR } from '../../utils/formatPKR';
import { discountedPrice } from '../../utils/discounts';
import { CarWash } from '../../services/api';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const TIMES = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
];
const PAYMENT_METHODS = ['Cash at wash', 'Easypaisa', 'JazzCash', 'Card'];

export default function BookingScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { addBooking, isSlotTaken } = useBookings();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const wash: CarWash = route.params.wash;
  const discounts = (wash as any).discounts ?? [];

  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [payment, setPayment] = useState('Cash at wash');

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      day: DAYS[d.getDay()],
      num: d.getDate(),
      key: `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`,
    };
  });

  const selected = wash.services.filter(s => serviceIds.includes(s.id));
  const priced = selected.map(s => ({ ...s, ...discountedPrice(s, discounts) }));
  const original = selected.reduce((sum, s) => sum + s.price, 0);
  const total = priced.reduce((sum, s) => sum + s.price, 0);
  const saved = original - total;

  const toggleService = (id: string) =>
    setServiceIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

  const confirm = () => {
    if (selected.length === 0) return Alert.alert('Select at least one service');
    if (!date || !time) return Alert.alert('Select a date and time');

    const booking = addBooking({
      washId: wash.id,
      washName: wash.name,
      washAddress: wash.address,
      customerName: user?.name ?? '',
      customerEmail: user?.email ?? '',
      serviceNames: selected.map(s => s.name),
      amount: total,
      discountAmount: saved,
      paymentMethod: payment,
      paymentStatus: payment === 'Cash at wash' ? 'Pay at wash' : 'Paid',
      date,
      time,
    });

    Alert.alert('Booking confirmed', `Booking ID: ${booking.id}`, [
      { text: 'View receipt', onPress: () => navigation.navigate('Tabs', { screen: 'Receipts' }) },
    ]);
  };

  const chip = (active: boolean, disabled = false) =>
    ({
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: active ? colors.primary : colors.border,
      backgroundColor: active ? colors.primary : colors.card,
      opacity: disabled ? 0.35 : 1,
      alignItems: 'center',
    }) as const;

  const heading = {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginTop: 22,
    marginBottom: 10,
  } as const;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '600' }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 14 }}>
          Book at {wash.name}
        </Text>

        <Text style={heading}>1. Choose services</Text>
        {wash.services.map(s => {
          const active = serviceIds.includes(s.id);
          const d = discountedPrice(s, discounts);
          return (
            <TouchableOpacity
              key={s.id}
              onPress={() => toggleService(s.id)}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 14,
                borderRadius: 12,
                marginBottom: 8,
                borderWidth: 1.5,
                borderColor: active ? colors.primary : colors.border,
                backgroundColor: colors.card,
              }}
            >
              <Text style={{ color: colors.text, fontWeight: '600', flex: 1 }}>
                {active ? '✅ ' : '⬜ '}
                {s.name}
              </Text>
              <View style={{ alignItems: 'flex-end' }}>
                {d.percent > 0 && (
                  <Text style={{ color: colors.subtext, textDecorationLine: 'line-through', fontSize: 12 }}>
                    {formatPKR(s.price)}
                  </Text>
                )}
                <Text style={{ color: colors.primary, fontWeight: '700' }}>{formatPKR(d.price)}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        <Text style={heading}>2. Choose a date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {dates.map(d => (
            <TouchableOpacity
              key={d.key}
              onPress={() => {
                setDate(d.key);
                setTime(null);
              }}
              style={[chip(date === d.key), { marginRight: 8, minWidth: 58 }]}
            >
              <Text style={{ color: date === d.key ? colors.primaryText : colors.subtext, fontSize: 12 }}>
                {d.day}
              </Text>
              <Text
                style={{
                  color: date === d.key ? colors.primaryText : colors.text,
                  fontSize: 18,
                  fontWeight: '700',
                }}
              >
                {d.num}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={heading}>3. Choose a time</Text>
        {!date ? (
          <Text style={{ color: colors.subtext }}>Pick a date first.</Text>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {TIMES.map(t => {
              const taken = isSlotTaken(wash.id, date, t);
              return (
                <TouchableOpacity
                  key={t}
                  disabled={taken}
                  onPress={() => setTime(t)}
                  style={chip(time === t, taken)}
                >
                  <Text
                    style={{
                      color: time === t ? colors.primaryText : colors.text,
                      fontWeight: '600',
                    }}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <Text style={heading}>4. Payment method</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {PAYMENT_METHODS.map(m => (
            <TouchableOpacity key={m} onPress={() => setPayment(m)} style={chip(payment === m)}>
              <Text
                style={{ color: payment === m ? colors.primaryText : colors.text, fontWeight: '600' }}
              >
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={{ color: colors.subtext, fontSize: 12, marginTop: 8 }}>
          Online payment is a placeholder for now. No real payment is taken.
        </Text>

        <View
          style={{
            marginTop: 24,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: colors.primary,
            backgroundColor: colors.card,
          }}
        >
          {saved > 0 && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ color: colors.success, fontWeight: '600' }}>Discount</Text>
              <Text style={{ color: colors.success, fontWeight: '700' }}>- {formatPKR(saved)}</Text>
            </View>
          )}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: colors.text, fontWeight: '700', fontSize: 16 }}>Total</Text>
            <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 20 }}>
              {formatPKR(total)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={confirm}
          style={{
            backgroundColor: colors.primary,
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 16,
          }}
        >
          <Text style={{ color: colors.primaryText, fontSize: 16, fontWeight: '600' }}>
            Confirm Booking
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}