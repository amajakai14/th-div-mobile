import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { login, ApiError } from '../../services/api';

export default function LoginScreen() {
  const { C, accent, radius, font } = useTheme();
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError('');
    setLoading(true);
    try {
      const { token } = await login(email.trim(), password);
      await signIn(token);
      router.replace('/(tabs)');
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        setError('Invalid email or password.');
      } else {
        setError('Could not connect. Check your connection.');
      }
    } finally {
      setLoading(false);
    }
  }

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg, justifyContent: 'center', paddingHorizontal: 20 },
    title: { fontSize: font.display, fontWeight: '700', color: C.text, marginBottom: 8 },
    subtitle: { fontSize: font.body, color: C.muted, marginBottom: 32 },
    label: { fontSize: font.eyebrow, fontWeight: '600', color: C.muted, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 },
    input: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.divider, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 11, fontSize: font.body, color: C.text, marginBottom: 16 },
    error: { fontSize: font.caption, color: accent.xd, marginBottom: 16 },
    button: { backgroundColor: C.text, borderRadius: radius.md, paddingVertical: 14, alignItems: 'center', marginBottom: 16 },
    buttonText: { fontSize: font.body, fontWeight: '700', color: C.bg },
    link: { fontSize: font.body, color: accent.today, textAlign: 'center' },
  });

  return (
    <View style={s.container}>
      <Text style={s.title}>Sign in</Text>
      <Text style={s.subtitle}>Thai Dividend Calendar</Text>
      <Text style={s.label}>Email</Text>
      <TextInput
        style={s.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        placeholderTextColor={C.muted}
        placeholder="you@example.com"
      />
      <Text style={s.label}>Password</Text>
      <TextInput
        style={s.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="current-password"
        placeholderTextColor={C.muted}
        placeholder="••••••••"
      />
      {error ? <Text style={s.error}>{error}</Text> : null}
      <TouchableOpacity style={s.button} onPress={handleLogin} disabled={loading} activeOpacity={0.8}>
        {loading ? <ActivityIndicator color={C.bg} /> : <Text style={s.buttonText}>Sign in</Text>}
      </TouchableOpacity>
      <Link href="/(auth)/register" style={s.link}>Don't have an account? Register</Link>
    </View>
  );
}
