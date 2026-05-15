import { useQuery } from '@tanstack/react-query';
import { getDividends, DividendRecord } from '../services/api';
import { openDb, upsertDividends, getDividendsByMonth, DividendRow } from '../services/db';

function recordToRow(r: DividendRecord): DividendRow {
  return {
    ticker: r.ticker,
    company: r.company,
    xd_date: r.xd_date,
    pay_date: r.pay_date,
    cash_per_share: r.cash_per_share,
    dividend_type: r.dividend_type,
    period_start: r.period_start,
    period_end: r.period_end,
    synced_at: new Date().toISOString(),
  };
}

export function useDividends(month: number, year: number) {
  return useQuery<DividendRow[], Error>({
    queryKey: ['dividends', year, month],
    queryFn: async () => {
      const db = await openDb();
      try {
        const data = await getDividends(month, year);
        const rows = data.map(recordToRow);
        await upsertDividends(db, rows);
        return rows;
      } catch {
        return getDividendsByMonth(db, year, month);
      }
    },
  });
}

export function groupByDate(rows: DividendRow[]): Record<string, { xd: DividendRow[]; pay: DividendRow[] }> {
  const result: Record<string, { xd: DividendRow[]; pay: DividendRow[] }> = {};
  for (const row of rows) {
    const addTo = (date: string | null, type: 'xd' | 'pay') => {
      if (!date) return;
      if (!result[date]) result[date] = { xd: [], pay: [] };
      result[date][type].push(row);
    };
    addTo(row.xd_date, 'xd');
    addTo(row.pay_date, 'pay');
  }
  return result;
}
