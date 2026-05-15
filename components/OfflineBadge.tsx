import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export function OfflineBadge() {
  const { accent } = useTheme();
  return (
    <View style={[styles.badge, { backgroundColor: accent.xdAlpha8, borderColor: accent.xdAlpha20 }]}>
      <Text style={[styles.text, { color: accent.xd }]}>Offline · showing cached data</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1, alignSelf: 'center', marginBottom: 8 },
  text: { fontSize: 11, fontWeight: '600' },
});
