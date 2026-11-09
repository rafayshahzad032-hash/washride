import React, { useEffect, useRef } from 'react';
import { Animated, Text, View, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import AppIcon from '../components/AppIcon';

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 350, useNativeDriver: true }).start(onDone);
    }, 2000);

    return () => clearTimeout(timer);
  }, [opacity, scale, onDone]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Animated.View style={{ alignItems: 'center', opacity, transform: [{ scale }] }}>
        <View
          style={{
            width: 96,
            height: 96,
            borderRadius: 28,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AppIcon name="car" size={48} color={colors.primaryText} />
        </View>
        <Text style={{ fontSize: 32, fontWeight: '800', color: colors.text, marginTop: 20 }}>
          WashRide
        </Text>
        <Text style={{ color: colors.subtext, marginTop: 6 }}>Book your car wash in minutes</Text>
        <ActivityIndicator style={{ marginTop: 28 }} color={colors.primary} />
      </Animated.View>
    </View>
  );
}