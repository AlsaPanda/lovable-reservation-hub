export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          store_name: string;
          created_at: string;
          updated_at: string;
          role: 'user' | 'superadmin' | 'magasin';
          brand: 'schmidt' | 'cuisinella';
          store_id: string | null;
          country_code: string;
          language_code: string;
          context: string;
        };
        Insert: {
          id: string;
          store_name: string;
          role?: 'user' | 'superadmin' | 'magasin';
          brand?: 'schmidt' | 'cuisinella';
          store_id?: string | null;
          country_code?: string;
          language_code?: string;
          context?: string;
        };
        Update: {
          store_name?: string;
          role?: 'user' | 'superadmin' | 'magasin';
          brand?: 'schmidt' | 'cuisinella';
          store_id?: string | null;
          country_code?: string;
          language_code?: string;
          context?: string;
        };
      };
      products: {
        Row: {
          id: string;
          reference: string;
          name: string;
          description: string | null;
          initial_quantity: number;
          image_url: string | null;
          created_at: string;
          updated_at: string;
          purchase_price_ht: number | null;
          sale_price_ttc: number | null;
          product_url: string | null;
          brand: string;
        };
        Insert: {
          reference: string;
          name: string;
          description?: string | null;
          initial_quantity: number;
          image_url?: string | null;
          purchase_price_ht?: number | null;
          sale_price_ttc?: number | null;
          product_url?: string | null;
          brand?: string;
        };
        Update: {
          reference?: string;
          name?: string;
          description?: string | null;
          initial_quantity?: number;
          image_url?: string | null;
          purchase_price_ht?: number | null;
          sale_price_ttc?: number | null;
          product_url?: string | null;
          brand?: string;
        };
      };
      reservations: {
        Row: {
          id: string;
          product_id: string;
          store_name: string;
          quantity: number;
          reservation_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          product_id: string;
          store_name: string;
          quantity: number;
          reservation_date: string;
        };
        Update: {
          quantity?: number;
          reservation_date?: string;
        };
      };
      content_blocks: {
        Row: {
          id: string;
          placement: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          placement: string;
          content: string;
        };
        Update: {
          placement?: string;
          content?: string;
        };
      };
    };
  };
};