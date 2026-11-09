import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import { useBusinesses } from '../../context/BusinessContext';
import CarWashCard from '../../components/CarWashCard';
import ChipRow from '../../components/ChipRow';

const CITIES = ['Karachi', 'Lahore', 'Islamabad'];
const PRICE_OPTIONS: Record<string, [number, number]> = {
  Any: [0, Infinity],
  'Under Rs. 700': [0, 700],
  'Rs. 700 - 1,000': [700, 1000],
  'Over Rs. 1,000': [1000, Infinity],
};
const RATING_OPTIONS: Record<string, number> = { Any: 0, '4.0+': 4, '4.5+': 4.5 };

export default function ExploreScreen() {
  const { colors } = useTheme();
  const { listedBusinesses: businesses } = useBusinesses();
  const navigation = useNavigation<any>();

  const [city, setCity] = useState('Karachi');
  const [area, setArea] = useState('All');
  const [price, setPrice] = useState('Any');
  const [rating, setRating] = useState('Any');
  const [service, setService] = useState('All');
  const [view, setView] = useState<'list' | 'map'>('list');

  useEffect(() => {
    setArea('All');
    setService('All');
  }, [city]);

  const inCity = useMemo(
    () => businesses.filter(b => b.city === city && !b.suspended),
    [businesses, city],
  );

  const areas = ['All', ...Array.from(new Set(inCity.map(w => w.area)))];
  const serviceNames = [
    'All',
    ...Array.from(new Set(inCity.flatMap(w => w.services.map(s => s.name)))),
  ];

  const [minPrice, maxPrice] = PRICE_OPTIONS[price];
  const results = inCity.filter(w => {
    if (area !== 'All' && w.area !== area) return false;
    if (w.rating < RATING_OPTIONS[rating]) return false;
    if (service !== 'All' && !w.services.some(s => s.name === service)) return false;
    if (price !== 'Any' && !w.services.some(s => s.price >= minPrice && s.price < maxPrice)) {
      return false;
    }
    return true;
  });

  const reset = () => {
    setArea('All');
    setPrice('Any');
    setRating('Any');
    setService('All');
  };

  const toggleBtn = (v: 'list' | 'map', label: string) => (
    <TouchableOpacity
      onPress={() => setView(v)}
      style={{
        flex: 1,
        padding: 10,
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: view === v ? colors.primary : colors.card,
        borderWidth: 1,
        borderColor: view === v ? colors.primary : colors.border,
      }}
    >
      <Text style={{ color: view === v ? colors.primaryText : colors.text, fontWeight: '600' }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={view === 'list' ? results : []}
        keyExtractor={w => w.id}
        contentContainerStyle={{ padding: 20 }}
        ListHeaderComponent={
          <View>
            <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 14 }}>
              Explore
            </Text>

            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
              {toggleBtn('list', '☰ List')}
              {toggleBtn('map', '🗺️ Map')}
            </View>

            <ChipRow label="City" options={CITIES} value={city} onChange={setCity} />
            <ChipRow label="Area" options={areas} value={area} onChange={setArea} />
            <ChipRow
              label="Price (PKR)"
              options={Object.keys(PRICE_OPTIONS)}
              value={price}
              onChange={setPrice}
            />
            <ChipRow
              label="Rating"
              options={Object.keys(RATING_OPTIONS)}
              value={rating}
              onChange={setRating}
            />
            <ChipRow label="Service" options={serviceNames} value={service} onChange={setService} />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <Text style={{ color: colors.subtext }}>{results.length} car wash(es) found</Text>
              <TouchableOpacity onPress={reset}>
                <Text style={{ color: colors.primary, fontWeight: '600' }}>Reset filters</Text>
              </TouchableOpacity>
            </View>

            {view === 'map' && (
              <View
                style={{
                  backgroundColor: colors.card,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 14,
                  padding: 20,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 40 }}>🗺️</Text>
                <Text style={{ color: colors.text, fontWeight: '700', marginTop: 8 }}>
                  Map view coming soon
                </Text>
                <Text style={{ color: colors.subtext, textAlign: 'center', marginTop: 4 }}>
                  Use Get Directions on any car wash to open its location in Google Maps.
                </Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          view === 'list' ? (
            <Text style={{ color: colors.subtext, textAlign: 'center', marginTop: 30 }}>
              No car washes match these filters.
            </Text>
          ) : null
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