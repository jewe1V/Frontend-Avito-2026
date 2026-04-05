export type Category = 'auto' | 'real_estate' | 'electronics';

export interface AutoItemParams {
  brand?: string;
  model?: string;
  yearOfManufacture?: number;
  transmission?: 'automatic' | 'manual';
  mileage?: number;
  enginePower?: number;
}

export interface RealEstateItemParams {
  type?: 'flat' | 'house' | 'room';
  address?: string;
  area?: number;
  floor?: number;
}

export interface ElectronicsItemParams {
  type?: 'phone' | 'laptop' | 'misc';
  brand?: string;
  model?: string;
  condition?: 'new' | 'used';
  color?: string;
}

export type ItemParams = AutoItemParams | RealEstateItemParams | ElectronicsItemParams;

export interface Item {
  id: number;
  category: Category;
  title: string;
  description?: string;
  price: number;
  params: ItemParams;
  createdAt?: string;
  updatedAt?: string;
  missingFields?: string[];
}

export interface AdItem {
  id: number;
  category: Category;
  title: string;
  price: number;
  needsRevision: boolean;
}

export interface ItemsGetOut {
  items: AdItem[];
  total: number;
}

export interface ItemDetailGetOut {
  items: (Item & {
    needsRevision: boolean;
  })[];
  total: number;
}

export interface FilterParams {
  q?: string;
  categories: Category[];
  needsRevision?: boolean;
  sortColumn: 'title' | 'createdAt';
  sortDirection: 'asc' | 'desc';
  page: number;
  limit?: number;
}

export interface ItemUpdateIn {
  category: Category;
  title: string;
  description?: string;
  price: number;
  params: ItemParams;
}
