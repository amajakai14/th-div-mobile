import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface TickerCardProps {
  ticker: string;
  onRemove: (ticker: string) => void;
}

export function TickerCard({ ticker, onRemove }: TickerCardProps) {
  const { C, accent } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: C.surface },
      ]}
    >
      <View
        style={[
          styles.tile,
          {
            backgroundColor: accent.today + '14',
            borderColor: accent.today + '33',
          },
        ]}
      >
        <Text style={[styles.tileText, { color: accent.today }]}>
          {ticker.slice(0, 2)}
        </Text>
      </View>

      <View style={styles.middle}>
        <Text
          style={[styles.tickerText, { color: C.text }]}
          numberOfLines={1}
        >
          {ticker}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => onRemove(ticker)}
        style={styles.removeBtn}
        hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
      >
        <Text style={[styles.removeIcon, { color: C.muted }]}>×</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  tile: {
    width: 42,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileText: {
    fontSize: 11,
    fontWeight: '700',
  },
  middle: {
    flex: 1,
    minWidth: 0,
  },
  tickerText: {
    fontSize: 15,
    fontWeight: '700',
  },
  removeBtn: {
    padding: 8,
  },
  removeIcon: {
    fontSize: 18,
  },
});
