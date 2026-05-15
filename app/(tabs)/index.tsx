import { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { useDividends, groupByDate } from '../../queries/useDividends';
import { CalendarGrid } from '../../components/CalendarGrid';
import { OfflineBadge } from '../../components/OfflineBadge';
import { DividendRow } from '../../services/db';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function CalendarScreen() {
  const { C, accent, font } = useTheme();
  const { isOnline } = useNetworkStatus();
  const router = useRouter();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const { data = [], isPending } = useDividends(month, year);
  const byDate = useMemo(() => groupByDate(data), [data]);

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  function onDayPress(xdRows: DividendRow[], payRows: DividendRow[], date: Date) {
    const allRows = [...xdRows, ...payRows];
    if (allRows.length === 0) return;
    router.push({ pathname: '/modal/[ticker]', params: { ticker: allRows[0].ticker, date: date.toISOString() } });
  }

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
    monthLabel: { fontSize: font.display, fontWeight: '700', color: C.text, letterSpacing: -0.6 },
    navBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.divider, alignItems: 'center', justifyContent: 'center' },
    navBtnText: { fontSize: 18, color: C.text, fontWeight: '600' },
    legend: { flexDirection: 'row', gap: 16, paddingHorizontal: 20, marginBottom: 12 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    legendDot: { width: 8, height: 8, borderRadius: 4 },
    legendLabel: { fontSize: 11, fontWeight: '600', color: C.muted },
    loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  });

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.navBtn} onPress={prevMonth}>
          <Text style={s.navBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={s.monthLabel}>{MONTH_NAMES[month - 1]} {year}</Text>
        <TouchableOpacity style={s.navBtn} onPress={nextMonth}>
          <Text style={s.navBtnText}>›</Text>
        </TouchableOpacity>
      </View>
      {!isOnline && data.length > 0 && <OfflineBadge />}
      <View style={s.legend}>
        <View style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: accent.xd }]} />
          <Text style={s.legendLabel}>XD date</Text>
        </View>
        <View style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: accent.pay }]} />
          <Text style={s.legendLabel}>Pay date</Text>
        </View>
      </View>
      {isPending ? (
        <View style={s.loading}><ActivityIndicator color={accent.today} /></View>
      ) : (
        <ScrollView>
          <CalendarGrid year={year} month={month} byDate={byDate} onDayPress={onDayPress} />
        </ScrollView>
      )}
    </View>
  );
}
