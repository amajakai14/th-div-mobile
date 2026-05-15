import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPortfolio, addHolding, removeHolding, ApiError } from '../services/api';
import { openDb, upsertPortfolio, getPortfolio as dbGetPortfolio, PortfolioRow } from '../services/db';
import { useAuth } from '../hooks/useAuth';

export interface PortfolioHolding extends PortfolioRow {}

export function usePortfolio() {
  const { userId } = useAuth();

  return useQuery<PortfolioHolding[], Error>({
    queryKey: ['portfolio', userId],
    enabled: !!userId,
    queryFn: async () => {
      const db = await openDb();
      try {
        const data = await getPortfolio();
        await upsertPortfolio(db, userId!, data);
        return data.map(d => ({ ticker: d.ticker, quantity: d.quantity, user_id: userId!, synced_at: new Date().toISOString() }));
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) throw e;
        return dbGetPortfolio(db, userId!);
      }
    },
  });
}

export function useAddHolding() {
  const qc = useQueryClient();
  const { userId } = useAuth();
  return useMutation({
    mutationFn: ({ ticker, quantity }: { ticker: string; quantity: number }) =>
      addHolding(ticker, quantity),
    onSuccess: () => { if (!userId) return; qc.invalidateQueries({ queryKey: ['portfolio', userId] }); },
  });
}

export function useRemoveHolding() {
  const qc = useQueryClient();
  const { userId } = useAuth();
  return useMutation({
    mutationFn: (ticker: string) => removeHolding(ticker),
    onSuccess: () => { if (!userId) return; qc.invalidateQueries({ queryKey: ['portfolio', userId] }); },
  });
}
