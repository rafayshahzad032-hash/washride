import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useBusinesses } from '../../context/BusinessContext';
import CarWashCard from '../../components/CarWashCard';

const CITIES = ['Karachi', 'Lahore', 'Islamabad'];

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
 const { listedBusinesses: businesses } = useBusinesses();
  const navigation = useNavigation<any>();
  const [city, setCity] = useState('Karachi');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return businesses.filter(
      b =>
        b.city === city &&
        !b.suspended &&
        (q === '' || b.name.toLowerCase().includes(q) || b.area.toLowerCase().includes(q)),
    );
  }, [businesses, city, query]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={filtered}
        keyExtractor={w => w.id}
        contentContainerStyle={{ padding: 20 }}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text }}>
              {'Hello, ' + (user?.name ?? '')}
            </Text>
            <Text style={{ color: colors.subtext, marginTop: 4, marginBottom: 16 }}>
              Find a car wash near you
            </Text>

            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
              {CITIES.map(c => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setCity(c)}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 14,
                    borderRadius: 20,
                    backgroundColor: city === c ? colors.primary : colors.card,
                    borderWidth: 1,
                    borderColor: city === c ? colors.primary : colors.border,
                  }}
                >
                  <Text
                    style={{
                      color: city === c ? colors.primaryText : colors.text,
                      fontWeight: '600',
                    }}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              placeholder="Search by name or area"
              placeholderTextColor={colors.subtext}
              value={query}
              onChangeText={setQuery}
              style={{
                borderWidth: 1.5,
                borderColor: colors.border,
                borderRadius: 10,
                padding: 12,
                color: colors.text,
                backgroundColor: colors.card,
              }}
            />
          </View>
        }
        ListEmptyComponent={
          <Text style={{ color: colors.subtext, textAlign: 'center', marginTop: 30 }}>
            {'No car washes found in ' + city + '.'}
          </Text>
        }
        renderItem={({ item }) => (
          <CarWashCard
            wash={item}
            onPress={() => navigation.navigate('WashDetail', { wash: item })}
          />
        )}
      />
    </SafeAreaView>
  );
}