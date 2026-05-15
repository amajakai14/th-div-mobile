import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useDividends } from '../../queries/useDividends';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d} ${MONTH_NAMES[parseInt(m) - 1]} ${y}`;
}

export default function TickerModal() {
  const { C, accent, radius, font } = useTheme();
  const router = useRouter();
  const { ticker, date } = useLocalSearchParams<{ ticker: string; date: string }>();

  const targetDate = date ? new Date(date) : new Date();
  const { data = [] } = useDividends(targetDate.getMonth() + 1, targetDate.getFullYear());
  const row = data.find(r => r.ticker === ticker);

  const s = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(15,12,4,0.42)' },
    sheet: { backgroundColor: C.surface, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, paddingBottom: 32 },
    handle: { width: 40, height: 5, borderRadius: 2.5, backgroundColor: C.divider, alignSelf: 'center', marginTop: 12, marginBottom: 16 },
    hero: { backgroundColor: C.surface2, paddingHorizontal: 20, paddingBottom: 24, paddingTop: 8, marginBottom: 1 },
    ticker: { fontSize: font.display, fontWeight: '700', color: C.text, letterSpacing: 0.2 },
    company: { fontSize: font.body, color: C.muted, marginTop: 2 },
    dps: { fontSize: font.display, fontWeight: '700', color: accent.pay, marginTop: 16 },
    dpsLabel: { fontSize: font.eyebrow, fontWeight: '600', color: C.muted, letterSpacing: 1.2, textTransform: 'uppercase' },
    row: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.divider },
    rowLabel: { fontSize: font.body, color: C.muted, fontWeight: '500' },
    rowValue: { fontSize: font.body, color: C.text, fontWeight: '600' },
    closeBtn: { marginHorizontal: 20, marginTop: 20, backgroundColor: C.text, borderRadius: radius.md, paddingVertical: 14, alignItems: 'center' },
    closeBtnText: { fontSize: font.body, fontWeight: '700', color: C.bg },
  });

  if (!row) {
    return (
      <View style={s.overlay}>
        <View style={s.sheet}>
          <View style={s.handle} />
          <Text style={[s.ticker, { paddingHorizontal: 20 }]}>Not found</Text>
          <TouchableOpacity style={s.closeBtn} onPress={() => router.back()}>
            <Text style={s.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={s.overlay}>
      <View style={s.sheet}>
        <View style={s.handle} />
        <ScrollView>
          <View style={s.hero}>
            <Text style={s.ticker}>{row.ticker}</Text>
            <Text style={s.company}>{row.company ?? '—'}</Text>
            <Text style={s.dpsLabel}>Dividend per share</Text>
            <Text style={s.dps}>฿{row.cash_per_share?.toFixed(2) ?? '—'}</Text>
          </View>
          <View style={s.row}>
            <Text style={s.rowLabel}>XD date</Text>
            <Text style={s.rowValue}>{formatDate(row.xd_date)}</Text>
          </View>
          <View style={s.row}>
            <Text style={s.rowLabel}>Pay date</Text>
            <Text style={s.rowValue}>{formatDate(row.pay_date)}</Text>
          </View>
          <View style={s.row}>
            <Text style={s.rowLabel}>Type</Text>
            <Text style={s.rowValue}>{row.dividend_type ?? '—'}</Text>
          </View>
          <View style={s.row}>
            <Text style={s.rowLabel}>Period start</Text>
            <Text style={s.rowValue}>{formatDate(row.period_start)}</Text>
          </View>
          <View style={s.row}>
            <Text style={s.rowLabel}>Period end</Text>
            <Text style={s.rowValue}>{formatDate(row.period_end)}</Text>
          </View>
          <TouchableOpacity style={s.closeBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <Text style={s.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}
