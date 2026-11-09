import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const { colors } = useTheme();
  const { signIn, signUp } = useAuth();
  const navigation = useNavigation<any>();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email.trim() || !password) return Alert.alert('Enter your email and password');
    if (mode === 'signup' && !name.trim()) return Alert.alert('Enter your name');
    setBusy(true);
    try {
      if (mode === 'signup') await signUp(name.trim(), email, password, 'customer');
      else await signIn(email, password);
    } catch (e: any) {
      Alert.alert('Could not continue', e.message);
      setBusy(false);
    }
  };

  const input = {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 14,
    color: colors.text,
    backgroundColor: colors.card,
    marginBottom: 12,
  } as const;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 24, flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontSize: 30, fontWeight: '800', color: colors.text }}>WashRide</Text>
        <Text style={{ color: colors.subtext, marginBottom: 24 }}>
          {mode === 'signin' ? 'Sign in to continue' : 'Create your customer account'}
        </Text>

        {mode === 'signup' && (
          <TextInput
            style={input}
            placeholder="Full name"
            placeholderTextColor={colors.subtext}
            value={name}
            onChangeText={setName}
          />
        )}
        <TextInput
          style={input}
          placeholder="Email"
          placeholderTextColor={colors.subtext}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={input}
          placeholder="Password (min 6 characters)"
          placeholderTextColor={colors.subtext}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={submit}
          disabled={busy}
          style={{
            backgroundColor: colors.primary,
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            opacity: busy ? 0.7 : 1,
          }}
        >
          {busy ? (
            <ActivityIndicator color={colors.primaryText} />
          ) : (
            <Text style={{ color: colors.primaryText, fontSize: 16, fontWeight: '600' }}>
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginTop: 18, alignItems: 'center' }}
          onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
        >
          <Text style={{ color: colors.primary, fontWeight: '600' }}>
            {mode === 'signin' ? 'New here? Create an account' : 'Already have an account? Sign in'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginTop: 14, alignItems: 'center' }}
          onPress={() => navigation.navigate('RegisterBusiness')}
        >
          <Text style={{ color: colors.primary, fontWeight: '600' }}>Register Your Car Wash</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}