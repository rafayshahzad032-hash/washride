import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
};

export default function ChipRow({ label, options, value, onChange }: Props) {
  const { colors } = useTheme();
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ color: colors.subtext, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
        {label}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {options.map(o => {
          const active = o === value;
          return (
            <TouchableOpacity
              key={o}
              onPress={() => onChange(o)}
              style={{
                paddingVertical: 7,
                paddingHorizontal: 14,
                borderRadius: 20,
                marginRight: 8,
                backgroundColor: active ? colors.primary : colors.card,
                borderWidth: 1,
                borderColor: active ? colors.primary : colors.border,
              }}
            >
              <Text
                style={{
                  color: active ? colors.primaryText : colors.text,
                  fontWeight: '600',
                  fontSize: 13,
                }}
              >
                {o}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}