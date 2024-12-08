export type UserRole = 'user' | 'superadmin';

export type Profile = {
  id: string;
  store_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  reference: string;
  name: string;
  description: string | null;
  initial_quantity: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  availableQuantity?: number;
};

export type Reservation = {
  id: string;
  product_id: string;
  store_name: string;
  quantity: number;
  reservation_date: string;
  created_at: string;
  updated_at: string;
  product?: Product;
};