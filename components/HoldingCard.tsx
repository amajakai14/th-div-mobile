import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { PortfolioRow } from '../services/db';

interface HoldingCardProps {
  holding: PortfolioRow;
  onRemove: (ticker: string) => void;
}

export function HoldingCard({ holding, onRemove }: HoldingCardProps) {
  const { C } = useTheme();
  const initials = holding.ticker.slice(0, 2).toUpperCase();

  return (
    <View style={[styles.card, { backgroundColor: C.surface }]}>
      <View style={styles.tile}>
        <Text style={styles.initials}>{initials}</Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.ticker, { color: C.text }]} numberOfLines={1}>
          {holding.ticker}
        </Text>
        <Text style={[styles.qty, { color: C.muted }]} numberOfLines={1}>
          Qty: {holding.quantity}
        </Text>
      </View>
      <Pressable style={styles.removeBtn} onPress={() => onRemove(holding.ticker)}>
        <Text style={[styles.removeText, { color: C.muted }]}>×</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tile: {
    width: 42,
    height: 42,
    backgroundColor: '#E2524114',
    borderWidth: 1,
    borderColor: '#E2524133',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  initials: {
    color: '#E25241',
    fontSize: 11,
    fontWeight: '700',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  ticker: {
    fontSize: 15,
    fontWeight: '700',
  },
  qty: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 1,
  },
  removeBtn: {
    padding: 8,
    flexShrink: 0,
  },
  removeText: {
    fontSize: 18,
    lineHeight: 20,
  },
});
