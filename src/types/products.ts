export type Product = {
  id: string;
  reference: string;
  name: string;
  description: string | null;
  initial_quantity: number;
  available_quantity?: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  purchase_price_ht: number | null;
  sale_price_ttc: number | null;
  product_url: string | null;
  brand: 'schmidt' | 'cuisinella';
};