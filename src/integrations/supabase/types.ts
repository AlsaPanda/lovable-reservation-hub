export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      content_blocks: {
        Row: {
          content: string
          created_at: string
          id: string
          placement: Database["public"]["Enums"]["content_placement"]
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          placement: Database["public"]["Enums"]["content_placement"]
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          placement?: Database["public"]["Enums"]["content_placement"]
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          brand: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          initial_quantity: number
          name: string
          product_url: string | null
          purchase_price_ht: number | null
          reference: string
          sale_price_ttc: number | null
          updated_at: string
        }
        Insert: {
          brand?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          initial_quantity?: number
          name: string
          product_url?: string | null
          purchase_price_ht?: number | null
          reference: string
          sale_price_ttc?: number | null
          updated_at?: string
        }
        Update: {
          brand?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          initial_quantity?: number
          name?: string
          product_url?: string | null
          purchase_price_ht?: number | null
          reference?: string
          sale_price_ttc?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          brand: string | null
          context: string | null
          country_code: string | null
          created_at: string
          id: string
          language_code: string | null
          role: Database["public"]["Enums"]["user_role"]
          store_id: string | null
          store_name: string
          updated_at: string
        }
        Insert: {
          brand?: string | null
          context?: string | null
          country_code?: string | null
          created_at?: string
          id: string
          language_code?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          store_id?: string | null
          store_name: string
          updated_at?: string
        }
        Update: {
          brand?: string | null
          context?: string | null
          country_code?: string | null
          created_at?: string
          id?: string
          language_code?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          store_id?: string | null
          store_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          created_at: string
          id: string
          product_id: string
          product_name: string | null
          quantity: number
          reservation_date: string
          store_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          product_name?: string | null
          quantity: number
          reservation_date?: string
          store_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          product_name?: string | null
          quantity?: number
          reservation_date?: string
          store_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_all_products: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      delete_reservation:
        | {
            Args: {
              reservation_id: string
            }
            Returns: boolean
          }
        | {
            Args: {
              reservation_id: string
              user_store_name: string
            }
            Returns: boolean
          }
      get_reservation_by_id: {
        Args: {
          reservation_id: string
        }
        Returns: {
          id: string
          product_id: string
          store_name: string
          quantity: number
          reservation_date: string
          created_at: string
          updated_at: string
          product_name: string
          product_image_url: string
        }[]
      }
      get_store_reservation_products: {
        Args: {
          store_name_param: string
        }
        Returns: {
          product_id: string
        }[]
      }
      get_store_reservations: {
        Args: {
          store_name_param: string
        }
        Returns: {
          id: string
          product_id: string
          store_name: string
          quantity: number
          reservation_date: string
          created_at: string
          updated_at: string
          product: Json
        }[]
      }
      get_store_summaries: {
        Args: Record<PropertyKey, never>
        Returns: {
          store_name: string
          store_id: string
          total_reservations: number
          total_products: number
          last_reservation: string
        }[]
      }
      product_exists: {
        Args: {
          ref: string
        }
        Returns: boolean
      }
      reset_all_quantities: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_reservation: {
        Args: {
          reservation_id: string
          new_quantity: number
          new_date: string
        }
        Returns: boolean
      }
      validate_store_token: {
        Args: {
          store_id: string
          token: string
          secret_phrase: string
        }
        Returns: boolean
      }
    }
    Enums: {
      content_placement: "products_header"
      user_role: "user" | "superadmin" | "magasin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
