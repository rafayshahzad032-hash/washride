import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useBusinesses } from '../../context/BusinessContext';
import ChipRow from '../../components/ChipRow';

const CITIES = ['Karachi', 'Lahore', 'Islamabad'];
type Row = { name: string; price: string };

export default function RegisterBusinessScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const { signUp } = useAuth();
  const { registerBusiness } = useBusinesses();

  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('Karachi');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [opensAt, setOpensAt] = useState('9:00 AM');
  const [closesAt, setClosesAt] = useState('8:00 PM');
  const [rows, setRows] = useState<Row[]>([{ name: '', price: '' }]);

  const setRow = (i: number, patch: Partial<Row>) =>
    setRows(prev => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const input = {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    color: colors.text,
    backgroundColor: colors.card,
  } as const;

  const label = { color: colors.subtext, fontSize: 12, fontWeight: '600', marginBottom: 6, marginTop: 14 } as const;

    const submit = async () => {
    const services = rows
      .filter(r => r.name.trim() && Number(r.price) > 0)
      .map((r, i) => ({
        id: `svc-${Date.now()}-${i}`,
        name: r.name.trim(),
        price: Math.round(Number(r.price)),
      }));

    if (!businessName.trim() || !ownerName.trim() || !phone.trim() || !email.trim() || !password) {
      return Alert.alert('Missing details', 'Fill in business name, owner name, phone, email and password.');
    }
    if (password.length < 6) {
      return Alert.alert('Weak password', 'Password must be at least 6 characters.');
    }
    if (!area.trim() || !address.trim()) {
      return Alert.alert('Missing details', 'Enter the area and the full business address.');
    }
    if (services.length === 0) {
      return Alert.alert('Add a service', 'Add at least one service with a price in PKR.');
    }

    const cleanEmail = email.trim().toLowerCase();
    try {
      await signUp(ownerName.trim(), cleanEmail, password, 'owner');
    } catch (e: any) {
      return Alert.alert('Could not register', e.message);
    }

    await registerBusiness({
      name: businessName.trim(),
      city,
      area: area.trim(),
      address: address.trim(),
      opensAt: opensAt.trim(),
      closesAt: closesAt.trim(),
      services,
      ownerEmail: cleanEmail,
      ownerName: ownerName.trim(),
      phone: phone.trim(),
      description: description.trim(),
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 50 }} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '600' }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: '800', color: colors.text, marginTop: 14 }}>
          Register Your Car Wash
        </Text>
        <Text style={{ color: colors.subtext, marginTop: 4 }}>
          Tell customers about your business.
        </Text>

        <Text style={label}>Business name</Text>
        <TextInput style={input} value={businessName} onChangeText={setBusinessName} placeholder="Business name" placeholderTextColor={colors.subtext} />

        <Text style={label}>Owner name</Text>
        <TextInput style={input} value={ownerName} onChangeText={setOwnerName} placeholder="Owner name" placeholderTextColor={colors.subtext} />

        <Text style={label}>Phone number</Text>
        <TextInput style={input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="Phone number" placeholderTextColor={colors.subtext} />

        <Text style={label}>Email address</Text>
        <TextInput style={input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="Email address" placeholderTextColor={colors.subtext} />

        <Text style={label}>Password</Text>
        <TextInput style={input} value={password} onChangeText={setPassword} secureTextEntry placeholder="Password" placeholderTextColor={colors.subtext} />

        <View style={{ marginTop: 14 }}>
          <ChipRow label="City" options={CITIES} value={city} onChange={setCity} />
        </View>

        <Text style={label}>Area / neighborhood</Text>
        <TextInput style={input} value={area} onChangeText={setArea} placeholder="Area" placeholderTextColor={colors.subtext} />

        <Text style={label}>Complete business address</Text>
        <TextInput style={input} value={address} onChangeText={setAddress} placeholder="Shop address" placeholderTextColor={colors.subtext} />

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={label}>Opens at</Text>
            <TextInput style={input} value={opensAt} onChangeText={setOpensAt} placeholderTextColor={colors.subtext} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={label}>Closes at</Text>
            <TextInput style={input} value={closesAt} onChangeText={setClosesAt} placeholderTextColor={colors.subtext} />
          </View>
        </View>

        <Text style={label}>Business description</Text>
        <TextInput
          style={[input, { height: 90, textAlignVertical: 'top' }]}
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Describe your car wash"
          placeholderTextColor={colors.subtext}
        />

        <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text, marginTop: 24 }}>
          Services and prices (PKR)
        </Text>
        {rows.map((r, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            <TextInput
              style={[input, { flex: 2 }]}
              value={r.name}
              onChangeText={t => setRow(i, { name: t })}
              placeholder="Service name"
              placeholderTextColor={colors.subtext}
            />
            <TextInput
              style={[input, { flex: 1 }]}
              value={r.price}
              onChangeText={t => setRow(i, { price: t.replace(/[^0-9]/g, '') })}
              keyboardType="numeric"
              placeholder="Rs."
              placeholderTextColor={colors.subtext}
            />
          </View>
        ))}
        <TouchableOpacity onPress={() => setRows(prev => [...prev, { name: '', price: '' }])} style={{ marginTop: 12 }}>
          <Text style={{ color: colors.primary, fontWeight: '600' }}>+ Add another service</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={submit}
          style={{ backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 28 }}
        >
          <Text style={{ color: colors.primaryText, fontSize: 16, fontWeight: '600' }}>Register Business</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}