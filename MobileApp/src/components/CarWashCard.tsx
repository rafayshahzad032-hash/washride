import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { formatPKR } from '../utils/formatPKR';
import { discountedPrice } from '../utils/discounts';
import { CarWash } from '../services/api';
import AppIcon from './AppIcon';
import FadeInView from './FadeInView';

type Props = { wash: CarWash; onPress: () => void };

function CardInner({ wash, onPress }: Props) {
  const { colors } = useTheme();
  const discounts = (wash as any).discounts ?? [];
  const prices = wash.services.map(s => discountedPrice(s, discounts));
  const hasServices = prices.length > 0;
  const fromPrice = hasServices ? Math.min(...prices.map(p => p.price)) : 0;
  const bestPercent = hasServices ? Math.max(...prices.map(p => p.percent)) : 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 14,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          height: 110,
          backgroundColor: colors.border,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <AppIcon name="car" size={44} color={colors.primary} />
        {bestPercent > 0 && (
          <View
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: colors.success,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 12 }}>
              {'Up to ' + bestPercent + '% off'}
            </Text>
          </View>
        )}
      </View>
      <View style={{ padding: 14 }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>{wash.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <AppIcon name="pin" size={14} color={colors.subtext} />
          <Text style={{ color: colors.subtext, marginLeft: 4 }}>
            {wash.area + ', ' + wash.city}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 10,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <AppIcon name="star" size={14} color="#F59E0B" />
            <Text style={{ color: colors.text, fontWeight: '600', marginLeft: 4 }}>
              {wash.rating.toFixed(1)}
            </Text>
          </View>
          <Text style={{ color: colors.primary, fontWeight: '700' }}>
            {hasServices ? 'From ' + formatPKR(fromPrice) : 'No services yet'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function CarWashCard(props: Props) {
  return (
    <FadeInView>
      <CardInner {...props} />
    </FadeInView>
  );
}

export default React.memo(CarWashCard);