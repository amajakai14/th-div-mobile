import * as SQLite from 'expo-sqlite';

export interface DividendRow {
  ticker: string;
  company: string | null;
  xd_date: string;
  pay_date: string | null;
  cash_per_share: number | null;
  dividend_type: string | null;
  period_start: string | null;
  period_end: string | null;
  synced_at: string;
}

export interface PortfolioRow {
  ticker: string;
  quantity: number;
  user_id: string;
  synced_at: string;
}

export interface WatchlistRow {
  ticker: string;
  user_id: string;
  synced_at: string;
}

let _db: SQLite.SQLiteDatabase | null = null;

export async function openDb(): Promise<SQLite.SQLiteDatabase> {
  if (_db) return _db;
  const db = await SQLite.openDatabaseAsync('cache.db');
  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS dividends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticker TEXT NOT NULL,
      company TEXT,
      xd_date TEXT NOT NULL,
      pay_date TEXT,
      cash_per_share REAL,
      dividend_type TEXT,
      period_start TEXT,
      period_end TEXT,
      synced_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(ticker, xd_date)
    );
    CREATE TABLE IF NOT EXISTS portfolio (
      ticker TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      user_id TEXT NOT NULL,
      synced_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (ticker, user_id)
    );
    CREATE TABLE IF NOT EXISTS watchlist (
      ticker TEXT NOT NULL,
      user_id TEXT NOT NULL,
      synced_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (ticker, user_id)
    );
  `);
  _db = db;
  return db;
}

// Dividends

export async function upsertDividends(db: SQLite.SQLiteDatabase, records: DividendRow[]): Promise<void> {
  await db.withTransactionAsync(async () => {
    for (const r of records) {
      await db.runAsync(
        `INSERT OR REPLACE INTO dividends
          (ticker, company, xd_date, pay_date, cash_per_share, dividend_type, period_start, period_end, synced_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
        [r.ticker, r.company ?? null, r.xd_date, r.pay_date ?? null, r.cash_per_share ?? null,
         r.dividend_type ?? null, r.period_start ?? null, r.period_end ?? null]
      );
    }
  });
}

export async function getDividendsByMonth(
  db: SQLite.SQLiteDatabase,
  year: number,
  month: number
): Promise<DividendRow[]> {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  return db.getAllAsync<DividendRow>(
    `SELECT * FROM dividends WHERE xd_date LIKE ? OR pay_date LIKE ? ORDER BY xd_date`,
    [`${prefix}%`, `${prefix}%`]
  );
}

// Portfolio

export async function upsertPortfolio(
  db: SQLite.SQLiteDatabase,
  userId: string,
  records: { ticker: string; quantity: number }[]
): Promise<void> {
  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM portfolio WHERE user_id = ?', [userId]);
    for (const r of records) {
      await db.runAsync(
        `INSERT INTO portfolio (ticker, quantity, user_id, synced_at) VALUES (?, ?, ?, datetime('now'))`,
        [r.ticker, r.quantity, userId]
      );
    }
  });
}

export async function getPortfolio(db: SQLite.SQLiteDatabase, userId: string): Promise<PortfolioRow[]> {
  return db.getAllAsync<PortfolioRow>(
    'SELECT * FROM portfolio WHERE user_id = ? ORDER BY ticker',
    [userId]
  );
}

// Watchlist

export async function upsertWatchlist(
  db: SQLite.SQLiteDatabase,
  userId: string,
  tickers: string[]
): Promise<void> {
  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM watchlist WHERE user_id = ?', [userId]);
    for (const ticker of tickers) {
      await db.runAsync(
        `INSERT INTO watchlist (ticker, user_id, synced_at) VALUES (?, ?, datetime('now'))`,
        [ticker, userId]
      );
    }
  });
}

export async function getWatchlist(db: SQLite.SQLiteDatabase, userId: string): Promise<WatchlistRow[]> {
  return db.getAllAsync<WatchlistRow>(
    'SELECT * FROM watchlist WHERE user_id = ? ORDER BY ticker',
    [userId]
  );
}

// Cleanup on logout

export async function clearUserData(db: SQLite.SQLiteDatabase, userId: string): Promise<void> {
  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM portfolio WHERE user_id = ?', [userId]);
    await db.runAsync('DELETE FROM watchlist WHERE user_id = ?', [userId]);
  });
}
