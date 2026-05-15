import * as SecureStore from 'expo-secure-store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export interface DividendRecord {
  ticker: string;
  company: string;
  xd_date: string;
  pay_date: string | null;
  cash_per_share: number | null;
  dividend_type: string | null;
  period_start: string | null;
  period_end: string | null;
}

export interface PortfolioItem {
  ticker: string;
  quantity: number;
}

export interface WatchlistItem {
  ticker: string;
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = await SecureStore.getItemAsync('jwt');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, init);
  if (res.status === 401) throw new ApiError(401, 'Unauthorized');
  if (!res.ok) throw new ApiError(res.status, `HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Auth

export async function login(email: string, password: string): Promise<{ token: string }> {
  return request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

export async function register(email: string, password: string): Promise<{ token: string }> {
  return request('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

// Dividends

export async function getDividends(month: number, year: number): Promise<DividendRecord[]> {
  return request(`/api/dividends?month=${month}&year=${year}`);
}

// Portfolio

export async function getPortfolio(): Promise<PortfolioItem[]> {
  return request('/api/portfolio', { headers: await authHeaders() });
}

export async function addHolding(ticker: string, quantity: number): Promise<void> {
  await request('/api/portfolio', {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify({ ticker, quantity }),
  });
}

export async function removeHolding(ticker: string): Promise<void> {
  await request(`/api/portfolio/${encodeURIComponent(ticker)}`, {
    method: 'DELETE',
    headers: await authHeaders(),
  });
}

// Watchlist

export async function getWatchlist(): Promise<WatchlistItem[]> {
  return request('/api/watchlist', { headers: await authHeaders() });
}

export async function addToWatchlist(ticker: string): Promise<void> {
  await request('/api/watchlist', {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify({ ticker }),
  });
}

export async function removeFromWatchlist(ticker: string): Promise<void> {
  await request(`/api/watchlist/${encodeURIComponent(ticker)}`, {
    method: 'DELETE',
    headers: await authHeaders(),
  });
}

// Push token

export async function registerExpoPushToken(token: string): Promise<void> {
  await request('/api/push/expo-token', {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify({ token }),
  });
}

export async function unregisterExpoPushToken(token: string): Promise<void> {
  await request('/api/push/expo-token', {
    method: 'DELETE',
    headers: await authHeaders(),
    body: JSON.stringify({ token }),
  });
}
