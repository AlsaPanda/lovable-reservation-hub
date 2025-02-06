import { Product } from './products';
import { Profile } from './auth';

export type Reservation = {
  id: string;
  product_id: string;
  store_name: string;
  quantity: number;
  reservation_date: string;
  created_at: string;
  updated_at: string;
  product?: {
    id: string;
    name: string;
    image_url: string | null;
    reference: string;
  };
  store?: Profile;
};