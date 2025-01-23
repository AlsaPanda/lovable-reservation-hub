import { Product } from './products';
import { Profile } from '@/utils/types';

export type ReservationProduct = Pick<Product, 'id' | 'name' | 'image_url'>;

export type Reservation = {
  id: string;
  product_id: string;
  store_name: string;
  quantity: number;
  reservation_date: string;
  created_at: string;
  updated_at: string;
  product_name: string | null;
  product?: ReservationProduct;
  store?: Profile;
};