import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import { formatPKR } from '../../utils/formatPKR';
import { discountedPrice } from '../../utils/discounts';
import { CarWash } from '../../services/api';

export default function WashDetailScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const wash: CarWash = route.params.wash;
  const discounts = (wash as any).discounts ?? [];
  const description: string = (wash as any).description ?? '';

  const openDirections = async () => {
    const query = encodeURIComponent(`${wash.name}, ${wash.address}`);
    try {
      await Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
    } catch {
      Alert.alert('Could not open maps', 'Please install or update Google Maps.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '600' }}>← Back</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 24, fontWeight: '800', color: colors.text, marginTop: 16 }}>
          {wash.name}
        </Text>
        <Text style={{ color: colors.subtext, marginTop: 6 }}>📍 {wash.address}</Text>
        <Text style={{ color: colors.subtext, marginTop: 4 }}>
          🕐 {wash.opensAt} – {wash.closesAt}   ⭐ {wash.rating.toFixed(1)}
        </Text>
        {description !== '' && (
          <Text style={{ color: colors.text, marginTop: 12, lineHeight: 20 }}>{description}</Text>
        )}

        <TouchableOpacity
          onPress={openDirections}
          style={{
            marginTop: 14,
            padding: 12,
            borderRadius: 12,
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: colors.primary,
          }}
        >
          <Text style={{ color: colors.primary, fontWeight: '600' }}>🧭 Get Directions</Text>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            color: colors.text,
            marginTop: 24,
            marginBottom: 12,
          }}
        >
          Services
        </Text>
        {wash.services.length === 0 && (
          <Text style={{ color: colors.subtext }}>This car wash has not added services yet.</Text>
        )}
        {wash.services.map(s => {
          const d = discountedPrice(s, discounts);
          return (
            <View
              key={s.id}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 12,
                padding: 14,
                marginBottom: 10,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: '600' }}>{s.name}</Text>
                {d.percent > 0 && (
                  <Text style={{ color: colors.success, fontSize: 12, fontWeight: '700', marginTop: 2 }}>
                    {d.percent}% off
                  </Text>
                )}
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                {d.percent > 0 && (
                  <Text style={{ color: colors.subtext, textDecorationLine: 'line-through', fontSize: 12 }}>
                    {formatPKR(s.price)}
                  </Text>
                )}
                <Text style={{ color: colors.primary, fontWeight: '700' }}>{formatPKR(d.price)}</Text>
              </View>
            </View>
          );
        })}

        {wash.services.length > 0 && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Booking', { wash })}
            style={{
              backgroundColor: colors.primary,
              padding: 16,
              borderRadius: 12,
              alignItems: 'center',
              marginTop: 16,
            }}
          >
            <Text style={{ color: colors.primaryText, fontSize: 16, fontWeight: '600' }}>
              Book Appointment
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}