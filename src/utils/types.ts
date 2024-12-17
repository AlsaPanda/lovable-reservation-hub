export type UserRole = 'user' | 'superadmin' | 'magasin';

export type Profile = {
  id: string;
  store_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
  brand: 'schmidt' | 'cuisinella';
};

// Re-export Product type using 'export type'
export type { Product } from '@/types/products';

export type Reservation = {
  id: string;
  product_id: string;
  store_name: string;
  quantity: number;
  reservation_date: string;
  created_at: string;
  updated_at: string;
  product?: import('@/types/products').Product;
  store?: Profile;
};