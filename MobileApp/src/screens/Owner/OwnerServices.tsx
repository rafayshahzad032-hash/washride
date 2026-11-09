import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useBusinesses } from '../../context/BusinessContext';
import { formatPKR } from '../../utils/formatPKR';
import { Shell, NoBusiness, useMyBusiness } from './OwnerShared';

export function OwnerServices() {
  const { colors } = useTheme();
  const business = useMyBusiness();
  const { addService, removeService } = useBusinesses();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  if (!business) return <Shell title="Services"><NoBusiness /></Shell>;

  const input = { borderWidth: 1.5, borderColor: colors.border, borderRadius: 10, padding: 12, color: colors.text, backgroundColor: colors.card } as const;

  const add = () => {
    if (!name.trim() || !(Number(price) > 0)) return Alert.alert('Enter a service name and a price in PKR');
    addService(business.id, name.trim(), Math.round(Number(price)));
    setName('');
    setPrice('');
  };

  return (
    <Shell title="Services">
      {business.services.map(s => (
        <View key={s.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, marginBottom: 10 }}>
          <View>
            <Text style={{ color: colors.text, fontWeight: '600' }}>{s.name}</Text>
            <Text style={{ color: colors.primary, fontWeight: '700', marginTop: 2 }}>{formatPKR(s.price)}</Text>
          </View>
          <TouchableOpacity onPress={() => removeService(business.id, s.id)}>
            <Text style={{ color: '#EF4444', fontWeight: '600' }}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text, marginTop: 20, marginBottom: 10 }}>Add a service</Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TextInput style={[input, { flex: 2 }]} value={name} onChangeText={setName} placeholder="Service name" placeholderTextColor={colors.subtext} />
        <TextInput style={[input, { flex: 1 }]} value={price} onChangeText={t => setPrice(t.replace(/[^0-9]/g, ''))} keyboardType="numeric" placeholder="Rs." placeholderTextColor={colors.subtext} />
      </View>
      <TouchableOpacity onPress={add} style={{ backgroundColor: colors.primary, padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 12 }}>
        <Text style={{ color: colors.primaryText, fontWeight: '600' }}>Add Service</Text>
      </TouchableOpacity>
    </Shell>
  );
}