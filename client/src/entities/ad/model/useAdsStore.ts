import { create } from 'zustand';
import type { FilterParams} from '../../../shared/api/types';

interface AdsState {
    filters: FilterParams;
    viewMode: 'list' | 'grid';
    setFilters: (filters: Partial<FilterParams>) => void;
    setViewMode: (mode: 'list' | 'grid') => void;
    resetFilters: () => void;
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

const defaultFilters: FilterParams = {
    q: '',
    categories: [],
    needsRevision: false,
    sortColumn: 'createdAt',
    sortDirection: 'desc',
    page: 1,
};

export const useAdsStore = create<AdsState>((set) => ({
    filters: defaultFilters,
    viewMode: 'list',
    setFilters: (newFilters) =>
        set((state) => ({ filters: { ...state.filters, ...newFilters } })),
    setViewMode: (mode) => set({ viewMode: mode }),
    resetFilters: () => set({ filters: defaultFilters }),
    isDarkMode: false,
    toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));
