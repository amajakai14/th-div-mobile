import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWatchlist, addToWatchlist, removeFromWatchlist, ApiError } from '../services/api';
import { openDb, upsertWatchlist, getWatchlist as dbGetWatchlist, WatchlistRow } from '../services/db';
import { useAuth } from '../hooks/useAuth';

export function useWatchlist() {
  const { userId } = useAuth();

  return useQuery<WatchlistRow[], Error>({
    queryKey: ['watchlist', userId],
    enabled: !!userId,
    queryFn: async () => {
      const db = await openDb();
      try {
        const data = await getWatchlist();
        await upsertWatchlist(db, userId!, data.map(d => d.ticker));
        return data.map(d => ({ ticker: d.ticker, user_id: userId!, synced_at: new Date().toISOString() }));
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) throw e;
        return dbGetWatchlist(db, userId!);
      }
    },
  });
}

export function useAddToWatchlist() {
  const qc = useQueryClient();
  const { userId } = useAuth();
  return useMutation({
    mutationFn: (ticker: string) => addToWatchlist(ticker),
    onSuccess: () => { if (!userId) return; qc.invalidateQueries({ queryKey: ['watchlist', userId] }); },
  });
}

export function useRemoveFromWatchlist() {
  const qc = useQueryClient();
  const { userId } = useAuth();
  return useMutation({
    mutationFn: (ticker: string) => removeFromWatchlist(ticker),
    onSuccess: () => { if (!userId) return; qc.invalidateQueries({ queryKey: ['watchlist', userId] }); },
  });
}
