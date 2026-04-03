export type Category = 'auto' | 'real_estate' | 'electronics';

export interface AdItem {
    id: string;
    category: Category;
    title: string;
    price: number;
    needsRevision: boolean;
}

export interface ItemsGetOut {
    items: AdItem[];
    total: number;
}

export interface FilterParams {
    q: string;
    categories: Category[];
    needsRevision: boolean;
    sortColumn: 'title' | 'createdAt';
    sortDirection: 'asc' | 'desc';
    page: number;
}
