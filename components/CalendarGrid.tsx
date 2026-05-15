import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { DayCell } from './DayCell';
import { DividendRow } from '../services/db';

interface CalendarGridProps {
  year: number;
  month: number; // 1-12
  byDate: Record<string, { xd: DividendRow[]; pay: DividendRow[] }>;
  onDayPress: (xdRows: DividendRow[], payRows: DividendRow[], date: Date) => void;
}

const DOW_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function buildCalendarDates(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month - 1, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function CalendarGrid({ year, month, byDate, onDayPress }: CalendarGridProps) {
  const { C, accent } = useTheme();
  const today = new Date();
  const cells = buildCalendarDates(year, month);

  const s = StyleSheet.create({
    dow: { flexDirection: 'row', paddingHorizontal: 8, marginBottom: 4 },
    dowLabel: { flex: 1, textAlign: 'center', fontSize: 10, fontWeight: '600', color: C.muted, textTransform: 'uppercase' },
    week: { flexDirection: 'row', paddingHorizontal: 8 },
  });

  const dateKey = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <View>
      <View style={s.dow}>
        {DOW_LABELS.map((d, i) => (
          <Text key={d} style={[s.dowLabel, (i === 0 || i === 6) && { color: accent.xd }]}>
            {d}
          </Text>
        ))}
      </View>
      {weeks.map((week, wi) => (
        <View key={wi} style={s.week}>
          {week.map((date, di) => {
            const key = date ? dateKey(date) : `empty-${wi}-${di}`;
            const entry = date ? byDate[dateKey(date)] : null;
            const isToday = date
              ? date.getFullYear() === today.getFullYear() &&
                date.getMonth() === today.getMonth() &&
                date.getDate() === today.getDate()
              : false;
            return (
              <DayCell
                key={key}
                date={date}
                xdRows={entry?.xd ?? []}
                payRows={entry?.pay ?? []}
                isToday={isToday}
                isCurrentMonth={date ? date.getMonth() === month - 1 : false}
                onPress={onDayPress}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}
