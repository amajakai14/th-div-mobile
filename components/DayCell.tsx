import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { DividendRow } from '../services/db';

interface DayCellProps {
  date: Date | null;
  xdRows: DividendRow[];
  payRows: DividendRow[];
  isToday: boolean;
  isCurrentMonth: boolean;
  onPress?: (xdRows: DividendRow[], payRows: DividendRow[], date: Date) => void;
}

export function DayCell({ date, xdRows, payRows, isToday, isCurrentMonth, onPress }: DayCellProps) {
  const { C, accent, radius } = useTheme();

  if (!date) return <View style={styles.empty} />;

  const hasXd = xdRows.length > 0;
  const hasPay = payRows.length > 0;

  const s = StyleSheet.create({
    cell: { flex: 1, aspectRatio: 1 / 1.18, padding: 4, alignItems: 'center' },
    circle: {
      width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
      backgroundColor: isToday ? accent.today : 'transparent',
    },
    dateNum: {
      fontSize: 13, fontWeight: isToday ? '700' : '500',
      color: isToday ? '#FFFFFF' : isCurrentMonth ? C.text : C.outMonth,
    },
    dots: { flexDirection: 'row', gap: 3, marginTop: 3, height: 6 },
    dot: { width: 6, height: 6, borderRadius: 3 },
    dotWide: { width: 14, height: 6, borderRadius: 3 },
  });

  return (
    <TouchableOpacity
      style={s.cell}
      onPress={() => onPress?.(xdRows, payRows, date)}
      activeOpacity={0.7}
      disabled={!hasXd && !hasPay}
    >
      <View style={s.circle}>
        <Text style={s.dateNum}>{date.getDate()}</Text>
      </View>
      <View style={s.dots}>
        {hasXd && (
          <View style={[xdRows.length > 1 ? s.dotWide : s.dot, { backgroundColor: accent.xd }]} />
        )}
        {hasPay && (
          <View style={[payRows.length > 1 ? s.dotWide : s.dot, { backgroundColor: accent.pay }]} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, aspectRatio: 1 / 1.18 },
});
