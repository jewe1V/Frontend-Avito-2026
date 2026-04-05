import { create } from 'zustand';
import type { FilterParams, AdItem } from '../../../shared/api/types';
import { itemsApi, filterParamsToApiParams } from '../../../shared/api/itemsApi';

interface AdsState {
  filters: FilterParams;
  viewMode: 'list' | 'grid';
  setFilters: (filters: Partial<FilterParams>) => void;
  setViewMode: (mode: 'list' | 'grid') => void;
  resetFilters: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // Новые поля для работы с данными
  ads: AdItem[];
  total: number;
  loading: boolean;
  error: string | null;
  
  // Новые действия
  fetchAds: () => Promise<void>;
}

const defaultFilters: FilterParams = {
  q: '',
  categories: [],
  needsRevision: false,
  sortColumn: 'createdAt',
  sortDirection: 'desc',
  page: 1,
  limit: 20,
};

export const useAdsStore = create<AdsState>((set, get) => ({
  filters: defaultFilters,
  viewMode: 'list',
  setFilters: (newFilters) => {
    const updatedFilters = { ...get().filters, ...newFilters };
    // Сброс на первую страницу при изменении фильтра, кроме самого page
    if (Object.keys(newFilters).some(key => key !== 'page')) {
      updatedFilters.page = 1;
    }
    set({ filters: updatedFilters });
    // Автоматически загружаем данные с новыми фильтрами через микротаск
    Promise.resolve().then(() => get().fetchAds());
  },
  setViewMode: (mode) => set({ viewMode: mode }),
  resetFilters: () => {
    set({ filters: defaultFilters });
    Promise.resolve().then(() => get().fetchAds());
  },
  isDarkMode: false,
  toggleDarkMode: () =>
    set((state) => ({ isDarkMode: !state.isDarkMode })),
  
  ads: [],
  total: 0,
  loading: false,
  error: null,
  
  fetchAds: async () => {
    const { filters } = get();
    set({ loading: true, error: null });
    
    try {
      const apiParams = filterParamsToApiParams(filters);
      const response = await itemsApi.getItems(apiParams);
      
      set({
        ads: response.items,
        total: response.total,
        loading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch ads';
      set({
        error: errorMessage,
        loading: false,
      });
      console.error('Error fetching ads:', error);
    }
  },
}));
