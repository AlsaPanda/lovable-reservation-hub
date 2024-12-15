export type UserRole = 'user' | 'superadmin' | 'magasin';

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
  purchase_price_ht: number | null;
  sale_price_ttc: number | null;
  product_url: string | null;
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
  store?: Profile;
};