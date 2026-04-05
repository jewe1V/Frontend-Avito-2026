import { useState, useEffect } from 'react';
import { itemsApi } from '../../../shared/api/itemsApi';
import type { Item } from '../../../shared/api/types';

interface UseGetAdResult {
  ad: (Item & { needsRevision: boolean }) | null;
  loading: boolean;
  error: string | null;
}

export const useGetAd = (id: string | undefined): UseGetAdResult => {
  const [ad, setAd] = useState<(Item & { needsRevision: boolean }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchAd = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await itemsApi.getItem(id);
        setAd(response);
      } catch (err) {
        console.error('Error loading ad:', err);
        setError(err instanceof Error ? err.message : 'Ошибка загрузки объявления');
        setAd(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [id]);

  return { ad, loading, error };
};
