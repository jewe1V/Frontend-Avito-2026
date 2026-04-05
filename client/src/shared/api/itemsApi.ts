import apiClient from './client';
import type {
  Item,
  ItemsGetOut,
  ItemUpdateIn,
  FilterParams,
} from './types';

interface GetItemsParams {
  q?: string;
  limit?: number;
  skip?: number;
  needsRevision?: boolean;
  categories?: string;
  sortColumn?: 'title' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
}

export const itemsApi = {
  /**
   * Получить все объявления
   */
  getItems: async (params: GetItemsParams): Promise<ItemsGetOut> => {
    const queryParams = new URLSearchParams();

    if (params.q) queryParams.append('q', params.q);
    if (params.limit) queryParams.append('limit', String(params.limit));
    if (params.skip) queryParams.append('skip', String(params.skip));
    if (params.needsRevision !== undefined)
      queryParams.append('needsRevision', String(params.needsRevision));
    if (params.categories) queryParams.append('categories', params.categories);
    if (params.sortColumn) queryParams.append('sortColumn', params.sortColumn);
    if (params.sortDirection)
      queryParams.append('sortDirection', params.sortDirection);

    const response = await apiClient.get<ItemsGetOut>(
      `/items?${queryParams.toString()}`
    );
    console.log('API Response from /items:', response.data);
    return response.data;
  },

  /**
   * Получить конкретное объявление по ID
   */
  getItem: async (id: string): Promise<Item & { needsRevision: boolean }> => {
    const response = await apiClient.get(`/items/${id}`);
    console.log('API Response from /items/:id:', response.data);
    return response.data;
  },

  /**
   * Отредактировать объявление
   */
  updateItem: async (id: string, data: ItemUpdateIn): Promise<Item> => {
    const response = await apiClient.put<Item>(`/items/${id}`, data);
    return response.data;
  },
};

/**
 * Конвертить FilterParams в параметры API
 */
export const filterParamsToApiParams = (filters: FilterParams): GetItemsParams => {
  return {
    q: filters.q || undefined,
    limit: filters.limit,
    skip: (filters.page - 1) * (filters.limit || 20),
    needsRevision: filters.needsRevision || undefined,
    categories:
      filters.categories && filters.categories.length > 0
        ? filters.categories.join(',')
        : undefined,
    sortColumn: filters.sortColumn,
    sortDirection: filters.sortDirection,
  };
};
